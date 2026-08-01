import { scoreWordMatch } from './wordMatcher';
import type { SurahWordIndex } from './surahWordIndex';

export type CorrectionReason =
  | 'Exact Quran Match'
  | 'Dictionary Match'
  | 'Context Match'
  | 'Levenshtein Match'
  | 'Low Confidence (No Correction)';

export interface CorrectionResult {
  originalWord: string;
  correctedWord: string;
  confidence: number; // 0-100
  correctionReason: CorrectionReason;
  wasCorrected: boolean;
}

/**
 * Common, linguistically-predictable categories of Arabic ASR error
 * (hamza-variant confusion, ya/alef-maqsura confusion, ta-marbuta/ha
 * confusion) are already handled upstream by normalizeArabicWord's letter
 * folding — a dictionary entry here would be redundant with that. What
 * belongs here instead is a specific WORD that Whisper substitutes for a
 * genuinely different word, in a way plain letter-folding can't fix (e.g.
 * dropping a whole internal alef, changing the actual word). There's no
 * live microphone/transcription log available in this environment to mine
 * real recurring mistakes from, so this seed is deliberately small and
 * illustrative rather than exhaustively tuned — the map is the whole
 * extension surface: add a (normalized wrong word -> normalized correct
 * word) pair here as real sessions surface repeat confusions.
 */
export const WHISPER_ERROR_DICTIONARY: Record<string, string> = {
  // "العالمين" (plain/modern spelling, full alef) for "العلمين" — the
  // Uthmani corpus text represents this word's long vowel with a dagger
  // alef (a diacritic, stripped by normalizeArabicWord), not a full alef
  // letter, so its normalized corpus form has no alef at all here. Whisper,
  // trained on standard modern Arabic text, plausibly outputs the common
  // full-alef spelling for this and similar words — a systematic mismatch
  // this dictionary entry corrects, verified against the real bundled
  // corpus (see quranCorrectionLayer.test.ts).
  العالمين: 'العلمين',
};

/** How many of the immediately preceding (corrected) words are used as context — small on purpose: a longer window doesn't sharpen a corpus n-gram lookup much further and costs more index memory for no real gain. */
export const CONTEXT_WINDOW_SIZE = 2;

const CONTEXT_CONFIDENCE_THRESHOLD = 70;
/** Higher bar than the context-search threshold — a global candidate isn't constrained by what's plausible here at all, so it needs to be a much closer match before it's trusted. Avoiding false positives matters more than catching every possible correction. */
const GLOBAL_CONFIDENCE_THRESHOLD = 85;
/** Bounds the global fallback candidate pool to words within this many characters of the input — cheap to compute, and rules out most of the vocabulary before a single Levenshtein comparison runs. */
const GLOBAL_LENGTH_SLACK = 2;

interface FollowersIndex {
  /** "prev2Word|prev1Word" -> real corpus words that follow that exact two-word run somewhere in the Quran. */
  bigram: Map<string, Set<string>>;
  /** "prev1Word" -> real corpus words that follow it anywhere in the Quran. Broader, less specific fallback than bigram. */
  unigram: Map<string, Set<string>>;
}

/**
 * Built once per SurahWordIndex instance and memoized against it (a
 * WeakMap needs no manual invalidation and never leaks — it's collected
 * along with the index itself) — a single O(corpus size) pass over the
 * *already-loaded* word list, not a separate fetch or a per-chunk rebuild.
 * Never lets a "followers" entry cross a surah boundary: the word directly
 * after the last word of one surah, in raw reading order, is the first word
 * of the next surah, which is not a meaningful continuation for correction
 * purposes and would otherwise produce a real but nonsensical suggestion at
 * the end of every surah.
 */
const followersIndexCache = new WeakMap<SurahWordIndex, FollowersIndex>();

function addTo(map: Map<string, Set<string>>, key: string, value: string): void {
  const existing = map.get(key);
  if (existing) existing.add(value);
  else map.set(key, new Set([value]));
}

function buildFollowersIndex(index: SurahWordIndex): FollowersIndex {
  const bigram = new Map<string, Set<string>>();
  const unigram = new Map<string, Set<string>>();

  for (let i = 1; i < index.words.length; i += 1) {
    const prev1 = index.words[i - 1]!;
    const current = index.words[i]!;
    if (prev1.surahId !== current.surahId) continue;

    addTo(unigram, prev1.word, current.word);

    if (i >= 2) {
      const prev2 = index.words[i - 2]!;
      if (prev2.surahId === current.surahId) {
        addTo(bigram, `${prev2.word}|${prev1.word}`, current.word);
      }
    }
  }

  return { bigram, unigram };
}

function getFollowersIndex(index: SurahWordIndex): FollowersIndex {
  const cached = followersIndexCache.get(index);
  if (cached) return cached;
  const built = buildFollowersIndex(index);
  followersIndexCache.set(index, built);
  return built;
}

interface GlobalCandidateIndex {
  /** First character -> the full set of distinct corpus words starting with it. Bounds the fallback search to a fraction of the vocabulary instead of every unique word in the Quran. */
  byFirstLetter: Map<string, string[]>;
}

const globalIndexCache = new WeakMap<SurahWordIndex, GlobalCandidateIndex>();

function buildGlobalIndex(index: SurahWordIndex): GlobalCandidateIndex {
  const byFirstLetter = new Map<string, string[]>();
  for (const word of index.byWord.keys()) {
    const firstChar = word[0];
    if (!firstChar) continue;
    const existing = byFirstLetter.get(firstChar);
    if (existing) existing.push(word);
    else byFirstLetter.set(firstChar, [word]);
  }
  return { byFirstLetter };
}

function getGlobalIndex(index: SurahWordIndex): GlobalCandidateIndex {
  const cached = globalIndexCache.get(index);
  if (cached) return cached;
  const built = buildGlobalIndex(index);
  globalIndexCache.set(index, built);
  return built;
}

interface RankedCandidate {
  word: string;
  confidence: number;
  isExact: boolean;
}

/** Scores every candidate against rawWord (reusing wordMatcher's own similarity scoring — no separate distance/confidence formula to keep in sync) and returns the single best one, if any. */
function bestCandidate(rawWord: string, candidates: Iterable<string>): RankedCandidate | null {
  let best: RankedCandidate | null = null;
  for (const candidate of candidates) {
    if (candidate === rawWord) return { word: candidate, confidence: 100, isExact: true };
    const { confidence } = scoreWordMatch(candidate, rawWord);
    if (!best || confidence > best.confidence) {
      best = { word: candidate, confidence, isExact: false };
    }
  }
  return best;
}

function contextCandidates(followers: FollowersIndex, precedingWords: string[]): Set<string> | null {
  if (precedingWords.length >= 2) {
    const bigramKey = `${precedingWords[precedingWords.length - 2]}|${precedingWords[precedingWords.length - 1]}`;
    const bigramHit = followers.bigram.get(bigramKey);
    if (bigramHit && bigramHit.size > 0) return bigramHit;
  }
  if (precedingWords.length >= 1) {
    const unigramHit = followers.unigram.get(precedingWords[precedingWords.length - 1]!);
    if (unigramHit && unigramHit.size > 0) return unigramHit;
  }
  return null;
}

function globalCandidates(global: GlobalCandidateIndex, rawWord: string): string[] {
  const sameFirstLetter = global.byFirstLetter.get(rawWord[0] ?? '') ?? [];
  return sameFirstLetter.filter((word) => Math.abs(word.length - rawWord.length) <= GLOBAL_LENGTH_SLACK);
}

/**
 * Corrects one recognized word using the Quran corpus, with the preceding
 * (already-corrected) words as context. Every possible output is either the
 * input word unchanged, or a word drawn verbatim from `index.byWord`'s
 * keys — never a synthesized string, so this can never invent a word that
 * doesn't genuinely occur in the Quran.
 */
export function correctWord(rawWord: string, precedingWords: string[], index: SurahWordIndex): CorrectionResult {
  if (index.byWord.has(rawWord)) {
    return { originalWord: rawWord, correctedWord: rawWord, confidence: 100, correctionReason: 'Exact Quran Match', wasCorrected: false };
  }

  const dictionaryCorrection = WHISPER_ERROR_DICTIONARY[rawWord];
  if (dictionaryCorrection && index.byWord.has(dictionaryCorrection)) {
    return {
      originalWord: rawWord,
      correctedWord: dictionaryCorrection,
      confidence: 95,
      correctionReason: 'Dictionary Match',
      wasCorrected: true,
    };
  }

  const followers = getFollowersIndex(index);
  const fromContext = contextCandidates(followers, precedingWords);
  if (fromContext) {
    const best = bestCandidate(rawWord, fromContext);
    if (best && best.confidence >= CONTEXT_CONFIDENCE_THRESHOLD) {
      return {
        originalWord: rawWord,
        correctedWord: best.word,
        confidence: best.confidence,
        correctionReason: best.isExact ? 'Context Match' : 'Levenshtein Match',
        wasCorrected: best.word !== rawWord,
      };
    }
  }

  const global = getGlobalIndex(index);
  const fromGlobal = globalCandidates(global, rawWord);
  const globalBest = bestCandidate(rawWord, fromGlobal);
  if (globalBest && globalBest.confidence >= GLOBAL_CONFIDENCE_THRESHOLD) {
    return {
      originalWord: rawWord,
      correctedWord: globalBest.word,
      confidence: globalBest.confidence,
      correctionReason: 'Levenshtein Match',
      wasCorrected: globalBest.word !== rawWord,
    };
  }

  // Nothing cleared the bar — safer to pass the original through unchanged
  // than to guess. The intelligent matcher downstream already tolerates a
  // genuine near-miss; this layer's job is only to fix what it's confident
  // about, never to force a correction.
  return { originalWord: rawWord, correctedWord: rawWord, confidence: 0, correctionReason: 'Low Confidence (No Correction)', wasCorrected: false };
}

/**
 * Corrects a whole batch of newly-recognized words in order, threading the
 * growing (corrected, not raw) context through each subsequent word — so if
 * word i gets corrected, word i+1's context lookup uses the corrected form,
 * which is the more likely-accurate anchor for what comes next.
 */
export function correctWords(rawWords: string[], precedingContext: string[], index: SurahWordIndex): CorrectionResult[] {
  const results: CorrectionResult[] = [];
  const context = [...precedingContext];

  for (const rawWord of rawWords) {
    const result = correctWord(rawWord, context.slice(-CONTEXT_WINDOW_SIZE), index);
    results.push(result);
    context.push(result.correctedWord);
  }

  return results;
}
