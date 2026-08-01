import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_SCORING_WEIGHTS,
  buildSurahScoreReport,
  createScoringAccumulatorState,
  createSessionRecord,
  finalizeCurrentAyah,
  recordWordSample,
} from '../services/scoringEngine';
import type { AyahRawMetrics, RecitationSessionRecord, ScoringAccumulatorState, ScoringWeights, SurahScoreReport } from '../services/scoringEngine';
import type { AyahTajweedSummary, SurahTajweedReport } from '../services/tajweedAnalysisEngine';
import type { RecitationSession } from './useRecitationSession';

export interface UseScoringEngineOptions {
  weights?: ScoringWeights;
}

export interface UseScoringEngineResult {
  /** Every ayah finalized so far this session, raw (pre-report) — developer diagnostics. */
  accumulator: ScoringAccumulatorState;
  /** Set once the tracker reports the surah completed; null until then. */
  report: SurahScoreReport | null;
  /** A plain, serializable record of this completed session — ready for future local persistence or cloud sync. Null until `report` is set. */
  sessionRecord: RecitationSessionRecord | null;
  weights: ScoringWeights;
}

function attachTajweedSummaries(ayahRawMetrics: AyahRawMetrics[], tajweedAyahSummaries: AyahTajweedSummary[]): AyahRawMetrics[] {
  const byAyah = new Map<number, AyahTajweedSummary>(tajweedAyahSummaries.map((summary) => [summary.ayahNumber, summary]));
  return ayahRawMetrics.map((raw) => ({ ...raw, tajweedSummary: byAyah.get(raw.ayahNumber) ?? null }));
}

/**
 * Wraps the pure scoringEngine with everything it needs from the live
 * world: accumulating each `lastWordEvent` into per-ayah raw metrics (the
 * same event Tajweed and Coaching independently read — see
 * scoringEngine.ts's module docstring on why this stays off Coaching's own
 * derived analytics), merging in the Tajweed engine's already-computed
 * per-ayah summaries by ayah number, and building the final report once the
 * tracker completes. Entirely independent of the matching/coaching
 * pipeline internals — only their already-computed outputs are consumed.
 */
export function useScoringEngine(
  session: RecitationSession,
  tajweedAyahSummaries: AyahTajweedSummary[],
  tajweedSurahReport: SurahTajweedReport | null,
  options: UseScoringEngineOptions = {}
): UseScoringEngineResult {
  const weights = options.weights ?? DEFAULT_SCORING_WEIGHTS;

  const [accumulator, setAccumulator] = useState<ScoringAccumulatorState>(createScoringAccumulatorState());
  const [report, setReport] = useState<SurahScoreReport | null>(null);
  const [sessionRecord, setSessionRecord] = useState<RecitationSessionRecord | null>(null);

  const accumulatorRef = useRef(accumulator);
  accumulatorRef.current = accumulator;
  const lastProcessedTimestampRef = useRef<number | null>(null);
  const previousSurahIdRef = useRef<number | null>(null);
  const firstTimestampRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Fresh session — nothing from a previous surah/attempt should carry over.
  useEffect(() => {
    if (session.detectedSurahId === previousSurahIdRef.current) return;
    previousSurahIdRef.current = session.detectedSurahId;
    if (session.detectedSurahId === null) return;

    lastProcessedTimestampRef.current = null;
    firstTimestampRef.current = null;
    lastTimestampRef.current = null;
    setAccumulator(createScoringAccumulatorState());
    setReport(null);
    setSessionRecord(null);
  }, [session.detectedSurahId]);

  useEffect(() => {
    const event = session.lastWordEvent;
    if (!event || event.timestamp === lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = event.timestamp;

    if (firstTimestampRef.current === null) firstTimestampRef.current = event.timestamp;
    lastTimestampRef.current = event.timestamp;

    const next = recordWordSample(accumulatorRef.current, {
      ayahNumber: event.ayahNumber,
      wordIndex: event.wordIndex,
      classification: event.classification,
      confidence: event.confidence,
      durationMs: event.durationMs,
      timestamp: event.timestamp,
    });
    accumulatorRef.current = next;
    setAccumulator(next);
  }, [session.lastWordEvent]);

  useEffect(() => {
    // Waits for the Tajweed engine's own end-of-surah report too, not just
    // the tracker's completed flag: both hooks react to the same
    // `session.tracker?.completed` flip in the same commit, but Tajweed's
    // completion effect (which finalizes its last ayah and computes
    // surahReport) runs in hook-declaration order *before* this one only
    // within a single component render — it still needs a render cycle to
    // propagate its new state back down as this hook's props. Gating on
    // `tajweedSurahReport !== null` (rather than assuming same-tick
    // availability) means this only builds the final report once Tajweed's
    // output genuinely exists, tolerating that one extra render.
    if (!session.tracker?.completed || tajweedSurahReport === null || report !== null) return;

    const finalized = finalizeCurrentAyah(accumulatorRef.current);
    accumulatorRef.current = finalized;
    setAccumulator(finalized);

    const ayahRawMetrics = attachTajweedSummaries(finalized.finalizedAyahRaw, tajweedAyahSummaries);
    const finalReport = buildSurahScoreReport(ayahRawMetrics, tajweedSurahReport, weights);
    setReport(finalReport);

    if (session.detectedSurahId !== null) {
      const ayahNumbers = ayahRawMetrics.map((raw) => raw.ayahNumber);
      const durationMs =
        firstTimestampRef.current !== null && lastTimestampRef.current !== null
          ? lastTimestampRef.current - firstTimestampRef.current
          : 0;
      const record = createSessionRecord(
        `${session.detectedSurahId}-${Date.now()}`,
        new Date().toISOString(),
        session.detectedSurahId,
        { start: ayahNumbers[0] ?? 0, end: ayahNumbers[ayahNumbers.length - 1] ?? 0 },
        durationMs,
        finalReport,
        tajweedSurahReport
      );
      setSessionRecord(record);
    }
    // tajweedAyahSummaries is read once tajweedSurahReport (its final,
    // definitely-complete counterpart) is available, so it's intentionally
    // left out of the dependency list — including it would risk this effect
    // re-running on an intermediate render where surahReport is set but
    // ayahSummaries hasn't re-rendered down yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.tracker?.completed, tajweedSurahReport, report, weights, session.detectedSurahId]);

  return useMemo(() => ({ accumulator, report, sessionRecord, weights }), [accumulator, report, sessionRecord, weights]);
}
