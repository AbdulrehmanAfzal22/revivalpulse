import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProgressInfo } from '@huggingface/transformers';
import { getFullQuranText } from 'api/quran/fullTextClient';
import { buildSurahWordIndex } from '../services/surahWordIndex';
import type { SurahWordIndex } from '../services/surahWordIndex';
import { detectSurah, justFinishedBismillah } from '../services/surahDetector';
import type { SurahDetectionDebugInfo } from '../services/surahDetector';
import { findOverlapLength } from '../services/transcriptStitcher';
import { tokenizeArabic, normalizeArabicWord } from '../services/arabicNormalization';
import { createWhisperClient } from '../services/whisperClient';
import type { WhisperClient } from '../services/whisperClient';
import type { WhisperDevice } from '../workers/whisperWorker';
import useMicrophoneChunks from './useMicrophoneChunks';
import { advanceTracker, createInitialTrackerState, wordKey } from '../services/wordTracker';
import type { WordComparisonOverride, WordTrackerState } from '../services/wordTracker';
import { playMistakeTone } from '../services/alertSound';
import { getChapterTajweedText } from '../services/tajweedClient';
import { parseTajweedWords, isMaddWord } from '../services/tajweedParser';
import type { TajweedWord } from '../services/tajweedParser';
import { ALIGNMENT_WINDOW_SIZE, alignWindow, buildExpectedWindow, planAdvances } from '../services/wordMatcher';
import type { WordMatchClassification } from '../services/wordMatcher';
import { CONTEXT_WINDOW_SIZE, correctWords } from '../services/quranCorrectionLayer';
import type { CorrectionResult } from '../services/quranCorrectionLayer';
import { createLogger } from 'services/logger';

const logger = createLogger('recitation-coach');
/**
 * Phase 10 instrumentation note: every `trace.debug(...)`/`trace.error(...)`
 * call added throughout this file is a pure diagnostic addition — logging
 * only. No conditional, return value, computed value, or state-update was
 * altered to add these. Where a silent early return previously discarded
 * data with no trace (e.g. an empty transcript), a log line was added
 * immediately before the *unchanged* return — the return itself, and what
 * it returns, is identical to before.
 */
const trace = createLogger('pipeline-trace');

export type RecitationPhase = 'idle' | 'loading-model' | 'model-error' | 'listening' | 'detection-timeout' | 'locked';

/** How long to wait for a confident surah match before showing the "keep reciting" guidance — detection keeps running after this, it's informational, not a hard stop. */
const DETECTION_TIMEOUT_MS = 8000;

/**
 * Gates only the *debug visibility* of the correction layer's decisions —
 * correction itself always runs regardless of this flag. Developer-only,
 * and deliberately a single constant to flip rather than anything wired
 * through settings/UI, per Phase 2's "easy to disable" requirement.
 */
const CORRECTION_DEBUG_ENABLED = true;
/** How many recent corrections the debug panel keeps around — bounded so it can't grow unbounded over a long session. */
const MAX_CORRECTION_DEBUG_ENTRIES = 10;

/** Bounds on the pause between consecutive word reveals, in ms — see scheduleReveal below. */
const MIN_REVEAL_GAP_MS = 60;
const MAX_REVEAL_GAP_MS = 500;

export interface RecitationSessionState {
  phase: RecitationPhase;
  device: WhisperDevice | null;
  modelLoadProgress: number;
  recognizedWords: string[];
  detectedSurahId: number | null;
  /** True once the Bismillah has just been recognized and nothing distinguishing has followed yet — used to show a more specific "keep reciting" message than the generic listening one. */
  awaitingDistinguishingWords: boolean;
  /** Original (diacritics intact) words per ayah for the locked surah, index-aligned with the tracker's word indices. */
  displayAyahs: string[][] | null;
  /** Parsed tajweed color segments per ayah — only present for ayahs whose word count matches displayAyahs; null (or missing entries) fall back to plain rendering. Loaded best-effort after locking, so it can arrive a beat after displayAyahs does. */
  tajweedWordsByAyah: Map<number, TajweedWord[]> | null;
  tracker: WordTrackerState | null;
  error: string | null;
  /** Diagnostics from the most recent detection attempt (null once locked, or before the first chunk) — surfaced in the debug panel so a stuck detection can be told apart from a threshold that's merely not clearing yet. */
  detectionDebug: SurahDetectionDebugInfo | null;
  /** Most recent corrections the Quran-aware correction layer actually applied (Whisper output -> corpus word), newest last, capped at MAX_CORRECTION_DEBUG_ENTRIES — developer-only diagnostics, gated by CORRECTION_DEBUG_ENABLED. Null (never populated) when that flag is off. */
  correctionDebug: CorrectionResult[] | null;
  /** Phase 1's own classification for the most recently processed word, with when it happened and how long Whisper heard it take — this is the information downstream coaching/tajweed analysis needs that the matching pipeline computes but otherwise discards after converting it into a plain match/no-match verdict for the tracker. Null before the first word of a locked session. */
  lastWordEvent: {
    classification: WordMatchClassification;
    confidence: number;
    durationMs: number;
    /** Position of the word this event is for (the tracker's cursor *before* advancing past it) — needed by the Phase 4 tajweed engine to look up this exact word's parsed TajweedWord segments. */
    ayahNumber: number;
    wordIndex: number;
    timestamp: number;
  } | null;
}

export interface RecitationSession extends RecitationSessionState {
  start: () => void;
  stop: () => void;
}

const INITIAL_STATE: RecitationSessionState = {
  phase: 'idle',
  device: null,
  modelLoadProgress: 0,
  recognizedWords: [],
  detectedSurahId: null,
  awaitingDistinguishingWords: false,
  displayAyahs: null,
  tajweedWordsByAyah: null,
  tracker: null,
  error: null,
  detectionDebug: null,
  correctionDebug: null,
  lastWordEvent: null,
};

interface QueuedReveal {
  surahId: number;
  word: string;
  /** Delay to wait after the previous reveal before showing this one, already clamped. */
  gapMs: number;
  /** How long Whisper heard this word take, in ms — used by the madd-timing hint. */
  durationMs: number;
  /** The intelligent matcher's verdict for this word (see wordMatcher.ts) — replaces the tracker's own strict === comparison. */
  comparison: WordComparisonOverride;
  /** Phase 1's own classification this verdict came from — carried through so the coaching engine can react to *which* category this was (see RecitationSessionState.lastWordEvent). */
  classification: WordMatchClassification;
  confidence: number;
}

/** One word (or confidently-inferred missing word) ready to be queued for reveal, already carrying the matcher's verdict and real pacing/timing. */
interface PlannedReveal {
  word: string;
  comparison: WordComparisonOverride;
  classification: WordMatchClassification;
  confidence: number;
  gapMs: number;
  durationMs: number;
}

export function useRecitationSession(): RecitationSession {
  const [state, setState] = useState<RecitationSessionState>(INITIAL_STATE);
  const [micEnabled, setMicEnabled] = useState(false);

  const whisperRef = useRef<WhisperClient | null>(null);
  const wordIndexRef = useRef<SurahWordIndex | null>(null);
  const detectionDeadlineRef = useRef<number | null>(null);
  const revealQueueRef = useRef<QueuedReveal[]>([]);
  const revealTimerRef = useRef<number | null>(null);
  /** Phase 10 instrumentation only — counts chunks handed to handleChunk, purely for log correlation. */
  const chunkCounterRef = useRef(0);
  /** `${ayahNumber}:${wordIndex}` keys for words carrying a madd rule in the locked surah — populated once tajweed data loads, read synchronously from the reveal queue so it can't be a stale closure. */
  const maddWordsRef = useRef<Set<string>>(new Set());

  const applyRevealedWord = useCallback(
    (
      surahId: number,
      word: string,
      durationMs: number,
      comparison: WordComparisonOverride,
      classification: WordMatchClassification,
      confidence: number
    ) => {
      setState((prev) => {
        if (prev.phase !== 'locked' || !prev.tracker || prev.detectedSurahId !== surahId) {
          trace.debug('WORD TRACKER: applyRevealedWord skipped — not in locked state', {
            phase: prev.phase,
            hasTracker: !!prev.tracker,
            detectedSurahId: prev.detectedSurahId,
            requestedSurahId: surahId,
            timestamp: Date.now(),
          });
          return prev;
        }
        const ayahs = wordIndexRef.current?.ayahsBySurah.get(surahId);
        if (!ayahs) {
          trace.debug('WORD TRACKER: applyRevealedWord skipped — no ayahs found for surah', { surahId, timestamp: Date.now() });
          return prev;
        }

        const cursorBefore = prev.tracker.cursor;
        const expectedWord = ayahs[cursorBefore.ayahNumber - 1]?.[cursorBefore.wordIndex] ?? '(none — cursor past end)';
        const cursorKey = wordKey(prev.tracker.cursor.ayahNumber, prev.tracker.cursor.wordIndex);
        const nextTracker = advanceTracker(
          prev.tracker,
          ayahs,
          word,
          { durationMs, isMaddWord: maddWordsRef.current.has(cursorKey) },
          comparison
        );
        trace.debug('WORD TRACKER: advanceTracker called', {
          cursorBefore,
          cursorAfter: nextTracker.cursor,
          expectedWord,
          receivedWord: word,
          classification,
          confidence,
          comparison,
          hasMistakeAtCursorBefore: prev.tracker.hasMistakeAtCursor,
          hasMistakeAtCursorAfter: nextTracker.hasMistakeAtCursor,
          completed: nextTracker.completed,
          timestamp: Date.now(),
        });
        if (!prev.tracker.hasMistakeAtCursor && nextTracker.hasMistakeAtCursor) {
          playMistakeTone();
        }
        return {
          ...prev,
          tracker: nextTracker,
          lastWordEvent: {
            classification,
            confidence,
            durationMs,
            ayahNumber: prev.tracker.cursor.ayahNumber,
            wordIndex: prev.tracker.cursor.wordIndex,
            timestamp: Date.now(),
          },
        };
      });
    },
    []
  );

  const drainRevealQueue = useCallback(() => {
    const next = revealQueueRef.current.shift();
    if (!next) {
      revealTimerRef.current = null;
      return;
    }
    applyRevealedWord(next.surahId, next.word, next.durationMs, next.comparison, next.classification, next.confidence);

    const following = revealQueueRef.current[0];
    const delay = following ? following.gapMs : MIN_REVEAL_GAP_MS;
    revealTimerRef.current = window.setTimeout(drainRevealQueue, delay);
  }, [applyRevealedWord]);

  /**
   * Queues already-matched words (see planAdvances in wordMatcher.ts) for a
   * staggered, one-at-a-time reveal instead of flipping them all green in a
   * single render. Pacing/timing is computed by the caller (handleChunk),
   * since it needs the recognized window's real per-word timestamps *before*
   * they're reordered/collapsed by alignment (a merge step, for instance,
   * has no 1:1 correspondence to a single recognized timestamp anymore).
   */
  const scheduleReveal = useCallback(
    (surahId: number, planned: PlannedReveal[]) => {
      planned.forEach((item) => {
        revealQueueRef.current.push({
          surahId,
          word: item.word,
          gapMs: item.gapMs,
          durationMs: item.durationMs,
          comparison: item.comparison,
          classification: item.classification,
          confidence: item.confidence,
        });
      });

      if (revealTimerRef.current === null) drainRevealQueue();
    },
    [drainRevealQueue]
  );

  /**
   * Best-effort: tajweed coloring is a visual bonus layered on top of the
   * core tracking feature, so a slow or failed fetch never blocks locking
   * onto a surah — it just arrives a beat later (or not at all) without
   * affecting anything else.
   */
  const loadTajweedForSurah = useCallback((surahId: number, displayAyahs: string[][] | null) => {
    getChapterTajweedText(surahId)
      .then((markupByAyah) => {
        const parsedByAyah = new Map<number, TajweedWord[]>();
        const maddKeys = new Set<string>();

        markupByAyah.forEach((markup, ayahNumber) => {
          const words = parseTajweedWords(markup);
          const displayWords = displayAyahs?.[ayahNumber - 1];
          if (displayWords && displayWords.length !== words.length) return; // misaligned — this ayah falls back to plain rendering

          parsedByAyah.set(ayahNumber, words);
          words.forEach((word, wordIndex) => {
            if (isMaddWord(word)) maddKeys.add(wordKey(ayahNumber, wordIndex));
          });
        });

        maddWordsRef.current = maddKeys;
        setState((prev) => (prev.detectedSurahId === surahId ? { ...prev, tajweedWordsByAyah: parsedByAyah } : prev));
      })
      .catch((error: unknown) => {
        logger.warn('failed to load tajweed coloring', error);
      });
  }, []);

  const handleChunk = useCallback(
    (chunk: Float32Array) => {
      const chunkNumber = ++chunkCounterRef.current;
      // eslint-disable-next-line no-console -- Phase 11D: JSON.stringify'd so Chrome prints real values instead of collapsing to "Object"; logger.debug() calls from Phase 10 remain in place unchanged alongside this.
      console.log('[PHASE11D]', JSON.stringify({ event: 'chunk received', chunkNumber, chunkLengthSamples: chunk.length, timestamp: Date.now() }, null, 2));
      const whisper = whisperRef.current;
      if (!whisper) {
        trace.error('PIPELINE STOPPED: handleChunk received a chunk but whisperRef.current is null', {
          chunkNumber,
          timestamp: Date.now(),
        });
        return;
      }

      trace.debug('AUDIO CHUNK -> WHISPER REQUEST: dispatching chunk for transcription', {
        chunkNumber,
        chunkLengthSamples: chunk.length,
        timestamp: Date.now(),
      });
      const chunkDispatchedAt = Date.now();

      whisper
        .transcribe(chunk)
        .then(({ text, words: timedWords }) => {
          trace.debug('WHISPER RESPONSE received in useRecitationSession', {
            chunkNumber,
            roundTripMs: Date.now() - chunkDispatchedAt,
            returnedText: text,
            returnedTextLength: text.length,
            returnedWordCount: timedWords.length,
            timestamp: Date.now(),
          });
          // eslint-disable-next-line no-console -- Phase 11D: see note above.
          console.log(
            '[PHASE11D]',
            JSON.stringify({ event: 'Whisper transcript', chunkNumber, transcriptText: text, words: timedWords, wordCount: timedWords.length }, null, 2)
          );

          const rawWords = tokenizeArabic(text);
          trace.debug('TOKENIZATION', {
            chunkNumber,
            rawTranscript: text,
            tokenizedWords: rawWords,
            wordCount: rawWords.length,
            timestamp: Date.now(),
          });
          // eslint-disable-next-line no-console -- Phase 11D: see note above.
          console.log('[PHASE11D]', JSON.stringify({ event: 'normalized words', chunkNumber, transcriptText: text, normalizedWords: rawWords }, null, 2));

          if (rawWords.length === 0) {
            trace.error('PIPELINE STOPPED: Whisper returned zero Arabic words for this chunk — nothing downstream (correction, matching, surah detection) will run for it.', {
              chunkNumber,
              rawReturnedText: JSON.stringify(text),
              timestamp: Date.now(),
            });
            return;
          }

          setState((prev) => {
            // eslint-disable-next-line no-console -- Phase 11D: see note above handleChunk.
            console.log(
              '[PHASE11D]',
              JSON.stringify({ event: 'current phase / lock state', chunkNumber, phase: prev.phase, detectedSurahId: prev.detectedSurahId, trackerCompleted: prev.tracker?.completed ?? null }, null, 2)
            );
            // Quran-aware correction layer: runs on every recognized batch,
            // before overlap-dedup, before surah detection, and before the
            // intelligent matcher — so a corrected transcript benefits all
            // three, not just tracking after a surah is already locked.
            // Falls back to the raw words untouched if the corpus index
            // isn't ready yet (shouldn't normally happen, since the mic
            // only starts after it loads, but this keeps the hook safe
            // regardless).
            const wordIndex = wordIndexRef.current;
            if (!wordIndex) {
              trace.error('CORRECTION LAYER: wordIndexRef.current is null — corpus not loaded, falling back to uncorrected words', {
                chunkNumber,
                timestamp: Date.now(),
              });
            }
            const corrections: CorrectionResult[] = wordIndex
              ? correctWords(rawWords, prev.recognizedWords.slice(-CONTEXT_WINDOW_SIZE), wordIndex)
              : rawWords.map((word) => ({
                  originalWord: word,
                  correctedWord: word,
                  confidence: 0,
                  correctionReason: 'Low Confidence (No Correction)' as const,
                  wasCorrected: false,
                }));
            const newWords = corrections.map((correction) => correction.correctedWord);

            const appliedCorrections = corrections.filter((correction) => correction.wasCorrected);
            const correctionDebug =
              CORRECTION_DEBUG_ENABLED && appliedCorrections.length > 0
                ? [...(prev.correctionDebug ?? []), ...appliedCorrections].slice(-MAX_CORRECTION_DEBUG_ENTRIES)
                : prev.correctionDebug;
            trace.debug('CORRECTION LAYER output', {
              chunkNumber,
              inputWords: rawWords,
              outputWords: newWords,
              correctionsAppliedCount: appliedCorrections.length,
              timestamp: Date.now(),
            });
            if (appliedCorrections.length > 0) {
              logger.debug(
                'corrections applied:',
                appliedCorrections.map((c) => `${c.originalWord}->${c.correctedWord} (${c.correctionReason}, ${c.confidence}%)`)
              );
            }

            const overlap = findOverlapLength(prev.recognizedWords, newWords);
            const recognizedWords = [...prev.recognizedWords, ...newWords.slice(overlap)];
            logger.debug('transcript:', recognizedWords.join(' '));
            trace.debug('UI STATE: recognizedWords accumulated', {
              chunkNumber,
              overlapLength: overlap,
              newWordsAddedThisChunk: newWords.slice(overlap),
              totalRecognizedWordCount: recognizedWords.length,
              currentPhase: prev.phase,
              timestamp: Date.now(),
            });

            if (prev.phase === 'locked' && prev.detectedSurahId !== null && prev.tracker) {
              const surahId = prev.detectedSurahId;
              const newPlainWords = newWords.slice(overlap);
              const newTimedWords =
                timedWords.length === newWords.length
                  ? timedWords.slice(overlap)
                  : newPlainWords.map((word) => ({ text: word, start: 0, end: 0 }));

              const ayahs = wordIndexRef.current?.ayahsBySurah.get(surahId);
              if (ayahs) {
                // Intelligent matching layer: instead of comparing the next
                // recognized word 1:1 against the current expected word,
                // align a window of upcoming expected words against this
                // whole chunk's newly recognized words at once — this is
                // what lets a single ASR misrecognition, a merged/split
                // word, or a dropped word be told apart from a genuine
                // recitation mistake, using the surrounding words as
                // context rather than judging each word in isolation.
                const rawAyahs = wordIndexRef.current?.displayAyahsBySurah.get(surahId);
                const expectedWindow = buildExpectedWindow(ayahs, prev.tracker.cursor, ALIGNMENT_WINDOW_SIZE, rawAyahs);
                const steps = alignWindow(
                  expectedWindow.map((entry) => entry.word),
                  newPlainWords,
                  expectedWindow.map((entry) => entry.raw ?? entry.word)
                );
                trace.debug('MATCHING ENGINE: alignWindow called', {
                  chunkNumber,
                  expectedWindowWords: expectedWindow.map((entry) => entry.word),
                  newlyRecognizedWords: newPlainWords,
                  stepClassifications: steps.map((step) => step.classification),
                  timestamp: Date.now(),
                });
                const advances = planAdvances(steps);

                const planned: PlannedReveal[] = advances.map((advance, i) => {
                  const timedWord = advance.recognizedIndex !== null ? newTimedWords[advance.recognizedIndex] : undefined;
                  const previousRecognizedIndex = i > 0 ? advances[i - 1]!.recognizedIndex : null;
                  const previousTimedWord = previousRecognizedIndex !== null ? newTimedWords[previousRecognizedIndex] : undefined;
                  const rawGapMs = timedWord && previousTimedWord ? (timedWord.start - previousTimedWord.start) * 1000 : 0;
                  const gapMs = Math.min(Math.max(rawGapMs, MIN_REVEAL_GAP_MS), MAX_REVEAL_GAP_MS);
                  const durationMs = timedWord ? Math.max(0, (timedWord.end - timedWord.start) * 1000) : 0;
                  // A confidently-inferred missing word has no recognized
                  // audio of its own to display — falls back to the
                  // expected word's own (normalized) text, which is what
                  // advanceTracker needs for its stale-duplicate check
                  // regardless of what (if anything) is actually shown.
                  const word = timedWord ? normalizeArabicWord(timedWord.text) : expectedWindow[advance.expectedIndex]!.word;
                  return {
                    word,
                    comparison: advance.comparison,
                    classification: advance.classification,
                    confidence: advance.confidence,
                    gapMs,
                    durationMs,
                  };
                });

                trace.debug('MATCHING ENGINE: scheduleReveal dispatched', {
                  chunkNumber,
                  surahId,
                  plannedReveals: planned.map((p) => ({ word: p.word, classification: p.classification, comparison: p.comparison })),
                  timestamp: Date.now(),
                });
                scheduleReveal(surahId, planned);
              } else {
                trace.error('MATCHING ENGINE: skipped — no ayahs found in wordIndex for the locked surah', {
                  chunkNumber,
                  surahId,
                  timestamp: Date.now(),
                });
              }
              return { ...prev, recognizedWords, correctionDebug };
            }

            if ((prev.phase === 'listening' || prev.phase === 'detection-timeout') && wordIndexRef.current) {
              // eslint-disable-next-line no-console -- Phase 11D: see note above handleChunk.
              console.log(
                '[PHASE11D]',
                JSON.stringify({ event: 'detectSurah input', chunkNumber, phase: prev.phase, recognizedWords }, null, 2)
              );
              const { result, debug } = detectSurah(wordIndexRef.current, recognizedWords);
              {
                const confidenceScore = debug.requiredLengthAtBest > 0 ? debug.bestMatchLength / debug.requiredLengthAtBest : 0;
                const rejectionReason = result
                  ? null
                  : debug.bestMatchSurahId === null
                    ? 'no candidate word matched anywhere in the corpus yet'
                    : debug.bestMatchLength < debug.requiredLengthAtBest
                      ? `best candidate (surah ${debug.bestMatchSurahId}) only reached ${debug.bestMatchLength} of ${debug.requiredLengthAtBest} required consecutive words`
                      : 'best-length candidates were tied/ambiguous between more than one location — see surahDetector.ts distinctLocations check';
                // eslint-disable-next-line no-console -- Phase 11D: see note above handleChunk.
                console.log(
                  '[PHASE11D]',
                  JSON.stringify(
                    {
                      event: 'detectSurah output',
                      chunkNumber,
                      locked: result !== null,
                      bestCandidateSurahId: debug.bestMatchSurahId,
                      matchedWords: result?.matchedWordCount ?? debug.bestMatchLength,
                      requiredWords: debug.requiredLengthAtBest,
                      confidenceScorePercent: Math.round(confidenceScore * 100),
                      rejectionReason,
                    },
                    null,
                    2
                  )
                );
              }
              // Visibility into whether confidence is climbing at all,
              // separate from whether it's cleared yet.
              logger.debug(
                'detection pass:',
                `bestMatchLength=${debug.bestMatchLength}/${debug.requiredLengthAtBest || '—'}`,
                `bestMatchSurahId=${debug.bestMatchSurahId ?? '—'}`,
                `locked=${result !== null}`
              );
              trace.debug('SURAH DETECTION: detectSurah called', {
                chunkNumber,
                inputRecognizedWords: recognizedWords,
                bestMatchSurahId: debug.bestMatchSurahId ?? null,
                bestMatchLength: debug.bestMatchLength,
                requiredLengthAtBest: debug.requiredLengthAtBest,
                locked: result !== null,
                previousPhase: prev.phase,
                timestamp: Date.now(),
              });

              if (result) {
                const tracker = createInitialTrackerState({
                  ayahNumber: result.ayahNumber,
                  wordIndex: result.startWordIndexInAyah,
                });
                const displayAyahs = wordIndexRef.current.displayAyahsBySurah.get(result.surahId) ?? null;
                maddWordsRef.current = new Set();
                loadTajweedForSurah(result.surahId, displayAyahs);
                trace.debug('UI STATE TRANSITION', {
                  chunkNumber,
                  previousPhase: prev.phase,
                  nextPhase: 'locked',
                  reason: `Surah ${result.surahId} detected and locked at ayah ${result.ayahNumber}, word ${result.startWordIndexInAyah}`,
                  timestamp: Date.now(),
                });
                return {
                  ...prev,
                  recognizedWords,
                  phase: 'locked',
                  detectedSurahId: result.surahId,
                  awaitingDistinguishingWords: false,
                  displayAyahs,
                  tajweedWordsByAyah: null,
                  tracker,
                  detectionDebug: null,
                  correctionDebug,
                };
              }

              const timedOut = detectionDeadlineRef.current !== null && Date.now() > detectionDeadlineRef.current;
              if (timedOut && prev.phase !== 'detection-timeout') {
                trace.debug('UI STATE TRANSITION', {
                  chunkNumber,
                  previousPhase: prev.phase,
                  nextPhase: 'detection-timeout',
                  reason: 'Surah detection deadline elapsed without a confident match',
                  timestamp: Date.now(),
                });
              }
              return {
                ...prev,
                recognizedWords,
                phase: timedOut ? 'detection-timeout' : prev.phase,
                awaitingDistinguishingWords: justFinishedBismillah(recognizedWords),
                detectionDebug: debug,
                correctionDebug,
              };
            }

            if (prev.phase === 'listening' || prev.phase === 'detection-timeout') {
              trace.error(
                'SURAH DETECTION: skipped this chunk — wordIndexRef.current is null (corpus not loaded), so detectSurah() was never called',
                { chunkNumber, phase: prev.phase, timestamp: Date.now() }
              );
            }

            return { ...prev, recognizedWords, correctionDebug };
          });
        })
        .catch((error: unknown) => {
          // Best-effort — one failed chunk shouldn't end the whole session.
          trace.error('PIPELINE STOPPED: chunk transcription promise rejected', {
            chunkNumber,
            error: error instanceof Error ? { name: error.name, message: error.message } : String(error),
            timestamp: Date.now(),
          });
          logger.warn('chunk transcription failed', error);
        });
    },
    [scheduleReveal, loadTajweedForSurah]
  );

  useMicrophoneChunks({
    enabled: micEnabled,
    onChunk: handleChunk,
    onError: (error) =>
      setState((prev) => {
        trace.debug('UI STATE TRANSITION', {
          previousPhase: prev.phase,
          nextPhase: 'model-error',
          reason: `useMicrophoneChunks reported an error: ${error.message}`,
          timestamp: Date.now(),
        });
        return { ...prev, phase: 'model-error', error: error.message };
      }),
  });

  const start = useCallback(() => {
    revealQueueRef.current = [];
    maddWordsRef.current = new Set();
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    trace.debug('UI STATE TRANSITION', {
      previousPhase: '(pre-start)',
      nextPhase: 'loading-model',
      reason: 'start() called',
      timestamp: Date.now(),
    });
    setState({ ...INITIAL_STATE, phase: 'loading-model' });

    trace.debug('start(): dispatching corpus load and Whisper model load in parallel', { timestamp: Date.now() });
    const loadCorpus = getFullQuranText().then((fullText) => {
      wordIndexRef.current = buildSurahWordIndex(fullText);
      trace.debug('start(): corpus loaded and word index built', { timestamp: Date.now() });
    });

    const loadModel = (async () => {
      const whisper = createWhisperClient({
        onProgress: (info: ProgressInfo) => {
          if (info.status === 'progress') {
            setState((prev) => ({ ...prev, modelLoadProgress: Math.round(info.progress) }));
          }
        },
        // A crash mid-session (after the model already loaded) would
        // otherwise just make every subsequent chunk silently fail one at a
        // time via handleChunk's own best-effort catch, with the UI never
        // telling the user anything actually stopped working. Stopping the
        // mic here also avoids wastefully feeding audio to a worker that can
        // no longer process it.
        onCrash: (error) => {
          logger.error('whisper worker crashed', error);
          setMicEnabled(false);
          setState((prev) => {
            trace.debug('UI STATE TRANSITION', {
              previousPhase: prev.phase,
              nextPhase: 'model-error',
              reason: `Whisper worker crashed: ${error.message}`,
              timestamp: Date.now(),
            });
            return { ...prev, phase: 'model-error', error: error.message };
          });
        },
      });
      whisperRef.current = whisper;
      const device = await whisper.load();
      trace.debug('start(): whisper.load() resolved', { device, timestamp: Date.now() });
      setState((prev) => ({ ...prev, device }));
    })();

    Promise.all([loadCorpus, loadModel])
      .then(() => {
        detectionDeadlineRef.current = Date.now() + DETECTION_TIMEOUT_MS;
        trace.debug('UI STATE TRANSITION', {
          previousPhase: 'loading-model',
          nextPhase: 'listening',
          reason: 'corpus load and whisper.load() both resolved successfully; enabling microphone',
          timestamp: Date.now(),
        });
        setState((prev) => ({ ...prev, phase: 'listening' }));
        setMicEnabled(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        trace.error('UI STATE TRANSITION', {
          previousPhase: 'loading-model',
          nextPhase: 'model-error',
          reason: `corpus load or whisper.load() rejected: ${message}`,
          timestamp: Date.now(),
        });
        setState((prev) => ({
          ...prev,
          phase: 'model-error',
          error: message,
        }));
      });
  }, []);

  const stop = useCallback(() => {
    trace.debug('UI STATE TRANSITION', {
      previousPhase: '(unknown — stop() does not read current phase)',
      nextPhase: 'idle',
      reason: 'stop() called',
      timestamp: Date.now(),
    });
    setMicEnabled(false);
    whisperRef.current?.terminate();
    whisperRef.current = null;
    detectionDeadlineRef.current = null;
    revealQueueRef.current = [];
    maddWordsRef.current = new Set();
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    setState(INITIAL_STATE);
  }, []);

  useEffect(() => {
    return () => {
      whisperRef.current?.terminate();
      if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current);
    };
  }, []);

  return { ...state, start, stop };
}
