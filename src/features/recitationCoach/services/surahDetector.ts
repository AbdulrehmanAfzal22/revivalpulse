import type { SurahWordIndex } from './surahWordIndex';
import { tokenizeArabic } from './arabicNormalization';

/**
 * For a match whose corpus position doesn't overlap the shared Bismillah
 * opening at all (see bismillahOverlapForCandidate below), this many
 * consecutive words is enough.
 *
 * Lowered from 4 to 3 after real-world testing showed 4 (and especially the
 * Bismillah case's resulting 8) essentially never clears given normal
 * Whisper transcription accuracy on Quranic recitation — a clean run of N
 * consecutive words with zero ASR errors anywhere in it becomes
 * exponentially less likely as N grows, and 4-8 was well past the point
 * where that stopped being realistic. 3 is deliberately still >1 so a
 * single coincidentally-matching word can't lock a surah by accident.
 */
export const MIN_CONFIDENT_MATCH_WORDS = 3;

/**
 * "بسم الله الرحمن الرحيم" opens 113 of 114 surahs (all but At-Tawbah) and
 * is also Al-Fatiha's ayah 1 verbatim — reciting it alone matches dozens of
 * places in the corpus at once, so it must never be enough to lock a surah
 * by itself. Computed via tokenizeArabic rather than hand-typed normalized
 * text, so it's guaranteed to normalize identically to how the corpus text
 * does regardless of which diacritics either happens to carry.
 */
export const BISMILLAH_WORDS = tokenizeArabic('بسم الله الرحمن الرحيم');

/**
 * Extra consecutive words required *beyond* whatever portion of a match
 * overlaps the Bismillah — see bismillahOverlapForCandidate below. Lowered
 * from 4 to 3 (not all the way to 2) for two reasons found by testing
 * against the real corpus: requiring 4 extra perfectly-recognized words
 * after the Bismillah before ever locking was unrealistic given real speech
 * recognition accuracy, but 2 wasn't enough to be safe either — Al-Fatiha,
 * Al-An'am, Al-Kahf, Saba, and Fatir all open with "بسم الله الرحمن الرحيم
 * الحمد لله" (Bismillah + "praise be to Allah") verbatim, so a 6-total-word
 * match is still genuinely ambiguous between them (confirmed empirically:
 * see surahDetector.test.ts). 7 total resolves Al-Fatiha and Fatir (they
 * diverge at word 7); Al-An'am/Al-Kahf/Saba still share "الحمد لله الذي"
 * and only fully separate at word 8 each — a narrower, rarer residual
 * ambiguity that's accepted here rather than raising the bar back toward
 * the old, unrealistic 8-word total for every Bismillah-opening surah.
 */
export const DISTINGUISHING_WORDS_AFTER_BISMILLAH = 3;

export interface SurahDetectionResult {
  surahId: number;
  ayahNumber: number;
  /** Index (0-based, within the matched ayah) of the word right after the matched run — where tracking should begin. */
  startWordIndexInAyah: number;
  /** Global word index (into SurahWordIndex.words) of that same starting point, for the tracker to resolve ayah rollovers. */
  startGlobalWordIndex: number;
  matchedWordCount: number;
}

/**
 * Best-effort diagnostics about the detection attempt, populated even when
 * no match clears the lock threshold — this is what a debug overlay reads
 * to show "how close" detection is getting, instead of only ever seeing a
 * flat "not detected yet" with no way to tell a frozen loop from a
 * too-strict threshold.
 */
export interface SurahDetectionDebugInfo {
  /** Longest matching run found anywhere in the recognized stream this pass, regardless of whether it met the lock threshold. 0 if nothing matched at all. */
  bestMatchLength: number;
  /** Surah the longest run above belongs to, if any. */
  bestMatchSurahId: number | null;
  /** The lock threshold that applied to that run (differs when it overlaps the Bismillah), for comparing against bestMatchLength. */
  requiredLengthAtBest: number;
}

export interface SurahDetectionOutcome {
  result: SurahDetectionResult | null;
  debug: SurahDetectionDebugInfo;
}

function startsWithBismillah(words: string[], start: number): boolean {
  return BISMILLAH_WORDS.every((word, i) => words[start + i] === word);
}

/** True once the most recently recognized words are exactly the Bismillah and nothing distinguishing has followed yet — used to show "keep reciting" rather than a generic listening message. */
export function justFinishedBismillah(recognizedWords: string[]): boolean {
  if (recognizedWords.length < BISMILLAH_WORDS.length) return false;
  return startsWithBismillah(recognizedWords, recognizedWords.length - BISMILLAH_WORDS.length);
}

/**
 * How many of a candidate match's leading words are actually just a piece
 * of the shared Bismillah phrase, based purely on the corpus text at the
 * candidate's position — not on where that position happens to fall (ayah
 * 1, or anywhere else) or on whether the recognized-word stream happens to
 * start exactly at word 0 of the phrase.
 *
 * Two things a naive "does this position open an ayah with the literal
 * 4-word Bismillah text" check would miss, both real:
 *   - A run starting at word 1, 2, or 3 of the phrase (e.g. "الله الرحمن
 *     الرحيم", 3 words, with "بسم" not part of the recognized run at all)
 *     is still just the Bismillah's tail, and exactly as non-distinguishing
 *     as the full phrase — it appears at the start of the same ~113 surahs.
 *   - The phrase also appears once *mid-ayah*, in the middle of Surah
 *     An-Naml 27:31 (the letter of Sulayman) — an ayah-1-only check misses
 *     this entirely and would let it through as if it were ordinary,
 *     distinguishing text.
 * Comparing the candidate's own words directly against every contiguous
 * slice of BISMILLAH_WORDS catches all of the above regardless of where in
 * the Quran the candidate position falls.
 */
function bismillahOverlapForCandidate(index: SurahWordIndex, candidateStart: number, matchLength: number): number {
  const compareLen = Math.min(matchLength, BISMILLAH_WORDS.length);

  for (let k = compareLen; k >= 1; k -= 1) {
    for (let offset = 0; offset + k <= BISMILLAH_WORDS.length; offset += 1) {
      let matches = true;
      for (let i = 0; i < k; i += 1) {
        if (index.words[candidateStart + i]?.word !== BISMILLAH_WORDS[offset + i]) {
          matches = false;
          break;
        }
      }
      if (matches) return k;
    }
  }

  return 0;
}

/**
 * Scans the recognized-word stream, most recently spoken words first, for a
 * run that lines up with somewhere in the Quran corpus, and returns the
 * first (i.e. most recent) run found that clears the required threshold
 * *and* is unambiguous — this matches against the whole Quran, at any
 * position, not just surah openings, so recitation can be picked up
 * starting anywhere.
 *
 * Earlier versions tracked a single running "longest match wins" across the
 * *entire* accumulated transcript, which meant one coincidentally long false
 * match near the start of a session (noise, or a genuinely ambiguous shared
 * phrase) permanently raised the bar every real match afterwards had to
 * beat — in effect, detection got harder to satisfy the longer someone
 * recited, not easier. Preferring the most recent qualifying run instead
 * means old noise can never block new signal.
 *
 * Any portion of a match that overlaps the shared Bismillah opening (at any
 * offset within it — see bismillahOverlapForCandidate) needs
 * DISTINGUISHING_WORDS_AFTER_BISMILLAH additional matching words beyond
 * that overlap before it's accepted — otherwise "بسم الله الرحمن الرحيم",
 * or any trailing piece of it, would satisfy MIN_CONFIDENT_MATCH_WORDS
 * against essentially any of the ~112 surahs that open with it, and lock
 * onto whichever one happens to be checked first.
 *
 * The Bismillah is the most common source of that ambiguity, but not the
 * only one — plenty of ordinary short phrases repeat verbatim in more than
 * one place in the Quran. So beyond that specific case, if the *longest*
 * qualifying run at a given start position is tied between two or more
 * genuinely different locations, this treats the position as not yet
 * resolvable rather than arbitrarily picking whichever the corpus happens
 * to list first — the same "wait for more distinguishing words" principle
 * the Bismillah case uses, applied generally.
 */
export function detectSurah(index: SurahWordIndex, recognizedWords: string[]): SurahDetectionOutcome {
  const debug: SurahDetectionDebugInfo = { bestMatchLength: 0, bestMatchSurahId: null, requiredLengthAtBest: 0 };

  for (let start = recognizedWords.length - 1; start >= 0; start -= 1) {
    const firstWord = recognizedWords[start];
    if (!firstWord) continue;
    const candidates = index.byWord.get(firstWord);
    if (!candidates) continue;

    const qualifying: SurahDetectionResult[] = [];
    let maxQualifyingLength = 0;

    for (const candidateStart of candidates) {
      let length = 1;
      while (start + length < recognizedWords.length) {
        const nextIndexed = index.words[candidateStart + length];
        if (!nextIndexed || nextIndexed.word !== recognizedWords[start + length]) break;
        length += 1;
      }

      // Any overlap at all — even just the phrase's last word or two — gets
      // the *full* stricter bar (BISMILLAH_WORDS.length + DISTINGUISHING),
      // not one prorated down by how much overlapped. A partial overlap
      // like just "الرحيم" is, if anything, a weaker signal than a full
      // 4-word overlap (it's an extremely common word on its own), so
      // scaling the requirement down for it would have re-opened the same
      // hole this whole check exists to close — confirmed by a real corpus
      // collision: "الرحيم الحمد لله" matches both Al-Fatiha (ayah 1 into
      // ayah 2) and any Bismillah-prefixed surah opening with "الحمد لله".
      const bismillahOverlap = bismillahOverlapForCandidate(index, candidateStart, length);
      const requiredLength =
        bismillahOverlap > 0 ? BISMILLAH_WORDS.length + DISTINGUISHING_WORDS_AFTER_BISMILLAH : MIN_CONFIDENT_MATCH_WORDS;

      if (length > debug.bestMatchLength) {
        debug.bestMatchLength = length;
        debug.bestMatchSurahId = index.words[candidateStart]?.surahId ?? null;
        debug.requiredLengthAtBest = requiredLength;
      }

      if (length < requiredLength) continue;

      const lastMatched = index.words[candidateStart + length - 1];
      if (!lastMatched) continue;

      const startGlobalWordIndex = candidateStart + length;
      const nextWord = index.words[startGlobalWordIndex];
      // Matched run ended at the last word of the corpus, or (more
      // commonly) at the last word of an ayah — tracking then begins at
      // word 0 of whichever ayah comes next, resolved via the global index.
      const resolved = nextWord ?? lastMatched;
      const startWordIndexInAyah = nextWord && nextWord.ayahNumber === lastMatched.ayahNumber
        ? nextWord.wordIndexInAyah
        : 0;

      qualifying.push({
        surahId: resolved.surahId,
        ayahNumber: resolved.ayahNumber,
        startWordIndexInAyah,
        startGlobalWordIndex: Math.min(startGlobalWordIndex, index.words.length - 1),
        matchedWordCount: length,
      });
      maxQualifyingLength = Math.max(maxQualifyingLength, length);
    }

    if (qualifying.length === 0) continue;

    // Among the longest qualifying matches at this position, collapse any
    // that actually resolve to the same tracking location (a phrase can
    // legitimately occur at more than one corpus offset that all lead to
    // the same next-word position isn't really possible here since offsets
    // differ, but this stays robust either way) before judging ambiguity.
    const atMaxLength = qualifying.filter((candidate) => candidate.matchedWordCount === maxQualifyingLength);
    const distinctLocations = new Set(atMaxLength.map((candidate) => `${candidate.surahId}:${candidate.startGlobalWordIndex}`));

    if (distinctLocations.size === 1) return { result: atMaxLength[0]!, debug };
    // Genuinely ambiguous at this position (e.g. a common phrase repeating
    // in more than one surah) — don't guess; either more words arrive in a
    // later chunk and one candidate keeps extending while the others fall
    // away, or scanning continues to an earlier, less promising start.
  }

  return { result: null, debug };
}
