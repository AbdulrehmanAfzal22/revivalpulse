import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_TAJWEED_THRESHOLDS,
  analyzeWord,
  createPaceTrackerState,
  currentPaceBaseline,
  recordPaceSample,
  summarizeAyah,
  summarizeSurah,
} from '../services/tajweedAnalysisEngine';
import type {
  AyahTajweedSummary,
  SurahTajweedReport,
  TajweedThresholds,
  WordTajweedAnalysis,
} from '../services/tajweedAnalysisEngine';
import type { RecitationSession } from './useRecitationSession';

function rawWordAt(displayAyahs: string[][] | null, ayahNumber: number, wordIndex: number): string | null {
  return displayAyahs?.[ayahNumber - 1]?.[wordIndex] ?? null;
}

/** The next word in reading order, rolling over into the next ayah if this one is the last word — Izhar detection at a word boundary needs this. */
function nextRawWordAt(displayAyahs: string[][] | null, ayahNumber: number, wordIndex: number): string | null {
  const sameAyah = rawWordAt(displayAyahs, ayahNumber, wordIndex + 1);
  if (sameAyah !== null) return sameAyah;
  return rawWordAt(displayAyahs, ayahNumber + 1, 0);
}

export interface UseTajweedAnalysisOptions {
  thresholds?: TajweedThresholds;
}

export interface UseTajweedAnalysisResult {
  /** The most recently analyzed word — developer diagnostics (see RecitationCoachPage's debug drawer). Null before the first tajweed-bearing word of a locked session. */
  mostRecentAnalysis: WordTajweedAnalysis | null;
  /** Every ayah summarized so far this session, in order. */
  ayahSummaries: AyahTajweedSummary[];
  /** Set once the tracker reports the surah completed; null until then. */
  surahReport: SurahTajweedReport | null;
  thresholds: TajweedThresholds;
}

/**
 * Wraps the pure tajweedAnalysisEngine with everything it needs from the
 * live world: looking up each word's parsed TajweedWord/raw text, feeding a
 * self-contained rolling pace baseline (deliberately separate from
 * wordTracker's own — see tajweedAnalysisEngine's module docstring),
 * finalizing an ayah's summary when the cursor moves past it, and building
 * the end-of-surah report on completion. Entirely independent of the
 * tracker/matching pipeline internals — it only reads what
 * useRecitationSession already exposes.
 */
export function useTajweedAnalysis(session: RecitationSession, options: UseTajweedAnalysisOptions = {}): UseTajweedAnalysisResult {
  const thresholds = options.thresholds ?? DEFAULT_TAJWEED_THRESHOLDS;
  const thresholdsRef = useRef(thresholds);
  thresholdsRef.current = thresholds;

  const [mostRecentAnalysis, setMostRecentAnalysis] = useState<WordTajweedAnalysis | null>(null);
  const [ayahSummaries, setAyahSummaries] = useState<AyahTajweedSummary[]>([]);
  const [surahReport, setSurahReport] = useState<SurahTajweedReport | null>(null);

  const paceTrackerRef = useRef(createPaceTrackerState());
  const lastProcessedTimestampRef = useRef<number | null>(null);
  const previousSurahIdRef = useRef<number | null>(null);
  const currentAyahRef = useRef<{ ayahNumber: number; analyses: WordTajweedAnalysis[] } | null>(null);
  const ayahSummariesRef = useRef<AyahTajweedSummary[]>([]);

  // Fresh session — nothing from a previous surah/attempt should carry over.
  useEffect(() => {
    if (session.detectedSurahId === previousSurahIdRef.current) return;
    previousSurahIdRef.current = session.detectedSurahId;
    if (session.detectedSurahId === null) return;

    paceTrackerRef.current = createPaceTrackerState();
    lastProcessedTimestampRef.current = null;
    currentAyahRef.current = null;
    ayahSummariesRef.current = [];
    setMostRecentAnalysis(null);
    setAyahSummaries([]);
    setSurahReport(null);
  }, [session.detectedSurahId]);

  useEffect(() => {
    const event = session.lastWordEvent;
    if (!event || event.timestamp === lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = event.timestamp;

    const tajweedWord = session.tajweedWordsByAyah?.get(event.ayahNumber)?.[event.wordIndex];
    const rawWord = rawWordAt(session.displayAyahs, event.ayahNumber, event.wordIndex);
    if (!tajweedWord || rawWord === null) return; // tajweed data (or display text) not loaded yet for this word — skip, best-effort only

    // Finalize the previous ayah's summary the moment the cursor moves into a new one.
    if (currentAyahRef.current && currentAyahRef.current.ayahNumber !== event.ayahNumber) {
      const finished = summarizeAyah(currentAyahRef.current.ayahNumber, currentAyahRef.current.analyses);
      ayahSummariesRef.current = [...ayahSummariesRef.current, finished];
      setAyahSummaries(ayahSummariesRef.current);
    }
    if (!currentAyahRef.current || currentAyahRef.current.ayahNumber !== event.ayahNumber) {
      currentAyahRef.current = { ayahNumber: event.ayahNumber, analyses: [] };
    }

    const paceBaselineMs = currentPaceBaseline(paceTrackerRef.current, thresholdsRef.current.minBaselineSamples);
    const analysis = analyzeWord(
      event.ayahNumber,
      event.wordIndex,
      {
        word: tajweedWord,
        rawWord,
        nextRawWord: nextRawWordAt(session.displayAyahs, event.ayahNumber, event.wordIndex),
        durationMs: event.durationMs > 0 ? event.durationMs : null,
        paceBaselineMs,
        wordMatchClassification: event.classification,
      },
      thresholdsRef.current
    );

    // Elongated words are deliberately excluded from the pace baseline —
    // otherwise a correctly-elongated word would inflate the average and
    // make the next elongation's expected minimum creep upward too (the
    // same rationale wordTracker's own madd heuristic already follows).
    const isElongationRule = analysis.rulesApplied.includes('madd') || analysis.rulesApplied.includes('ghunnah');
    if (!isElongationRule && event.durationMs > 0) {
      paceTrackerRef.current = recordPaceSample(paceTrackerRef.current, event.durationMs, thresholdsRef.current.paceWindowSize);
    }

    currentAyahRef.current.analyses.push(analysis);
    setMostRecentAnalysis(analysis);
  }, [session.lastWordEvent, session.tajweedWordsByAyah, session.displayAyahs]);

  useEffect(() => {
    if (!session.tracker?.completed || surahReport !== null) return;

    let finalSummaries = ayahSummariesRef.current;
    if (currentAyahRef.current) {
      const finished = summarizeAyah(currentAyahRef.current.ayahNumber, currentAyahRef.current.analyses);
      finalSummaries = [...finalSummaries, finished];
      ayahSummariesRef.current = finalSummaries;
      setAyahSummaries(finalSummaries);
      currentAyahRef.current = null;
    }

    setSurahReport(summarizeSurah(finalSummaries));
  }, [session.tracker?.completed, surahReport]);

  return { mostRecentAnalysis, ayahSummaries, surahReport, thresholds };
}
