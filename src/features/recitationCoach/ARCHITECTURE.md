# Recitation Coach — Architecture & Developer Guide

> Scope note: this document covers the **Recitation Coach feature** (`src/features/recitationCoach/`, `src/pages/RecitationCoachPage.tsx`, and the supporting Whisper worker) in depth, since that is the subsystem this document's author built and verified line by line. It does not attempt to document the rest of the Islamic Web app (Quran reader, hadith, prayer times, tasbeeh, kids mode) — those already have their own working infrastructure (service worker, TanStack Query caching, IndexedDB audio caches, a shared `ErrorBoundary`, and a `devModeStore` with error logging and Web Vitals) that this document did not re-verify and won't speak for.

## 1. What this feature does

A microphone-driven Quran recitation coach: it listens as the user recites, transcribes with Whisper (in-browser, via `@huggingface/transformers`), matches the transcript against the Quran corpus word-by-word, offers live tajweed/coaching feedback, scores the session, and — over many sessions — builds a memorization profile with spaced-repetition review scheduling, goals, and achievements.

## 2. Layered architecture

Every layer below is a **pure, side-effect-free engine module** in `services/*.ts` (no React import, fully unit-testable with plain data in/out) plus a **React hook** in `hooks/use*.ts` that owns the timers/refs/side-effects and wires live state into the pure engine. This split is the single most important architectural invariant in this feature — it is what makes ~400 unit tests possible without a browser, a microphone, or a real ML model in the test environment.

```
Microphone (useMicrophoneChunks)
        │ raw Float32Array chunks, ~1.5s each with 0.3s overlap
        ▼
Whisper Worker (workers/whisperWorker.ts, via services/whisperClient.ts)
        │ transcript + per-word timestamps
        ▼
Quran-Aware Correction Layer (services/quranCorrectionLayer.ts)
        │ corrected transcript
        ▼
Intelligent Matching Engine (services/wordMatcher.ts + wordTracker.ts)
        │ per-word classification (correct/wrong/missing/…) + confidence
        ▼
   ┌────────────────┬─────────────────┬───────────────────┐
   ▼                ▼                 ▼                    ▼
Coaching Engine   Tajweed Engine   useRecitationSession's   (all consumed as
(services/         (services/       lastWordEvent state      plain outputs by
 coachingEngine)    tajweedAnalysis  (shared primitive         everything below —
                    Engine)          every downstream layer    none of them reach
                                     reads, never re-derives)   into each other's
                                                                internals)
        │
        ▼
Scoring Engine (services/scoringEngine.ts)
        │ SurahScoreReport: 7 weighted dimensions, per-ayah analysis,
        │ insights, recommendations — end of every completed session
        ▼
Learning Profile (services/learningProfileEngine.ts + Storage)
        │ lifetime totals, long-term weaknesses/strengths, trends
        ▼
Recommendation / Adaptive Coaching / Practice Queue Engines
        ▼
Memorization Engine + Review Scheduler + Goal + Achievement + Session
Builder Engines (services/memorizationEngine.ts, reviewScheduler.ts,
goalEngine.ts, achievementEngine.ts, sessionBuilder.ts)
```

### 2.1 Why this split, concretely

- **Testability without a browser.** `wordMatcher.ts`'s Levenshtein/alignment logic, `scoringEngine.ts`'s weighting, `reviewScheduler.ts`'s spaced-repetition math — all of it is plain functions over plain data, tested with literal fixtures. Nothing in `services/` imports React, `window`, or a Worker.
- **Registry/pluggable-evaluator pattern for "future ML can replace this."** `tajweedAnalysisEngine.ts`'s `RULE_EVALUATORS`, `scoringEngine.ts`'s `DIMENSION_CALCULATORS`, `learningProfileEngine.ts`'s `WEAKNESS_DETECTORS`, `achievementEngine.ts`'s `ACHIEVEMENT_DETECTORS` are all `Record<Id, Fn>` maps. Swapping one heuristic for a trained model is a one-line change, never a change to the orchestration around it.
- **Confidence accompanies every judgment.** `WordMatchResult.confidence`, `CorrectionResult.confidence`, `TajweedRuleEvaluation.confidence`, every `DimensionScore.confidence` — this is deliberate and consistent: a rule/heuristic that fundamentally can't be verified from the available data (word-level timing only, no phoneme-level acoustic signal) is capped at low confidence rather than issuing a false-certain verdict.
- **Additive-only extension of shared state.** `RecitationSessionState.lastWordEvent` has grown fields four times across phases (classification → confidence → durationMs → ayahNumber/wordIndex) without ever renaming or removing one. This is why phases 2–7 could each add a new downstream consumer without touching `useRecitationSession.ts`'s core tracking logic.

## 3. Module responsibilities (by directory)

| Path | Responsibility |
|---|---|
| `services/arabicNormalization.ts`, `surahWordIndex.ts`, `surahDetector.ts`, `transcriptStitcher.ts` | Text-processing primitives: normalize Arabic text, build a searchable index of the Quran corpus, detect which surah is being recited, dedupe overlapping ASR chunks. |
| `services/wordMatcher.ts`, `wordTracker.ts` | The Intelligent Matching Engine: DP sequence alignment between expected and recognized words, a forward-only cursor that advances/freezes/recovers. |
| `services/quranCorrectionLayer.ts` | Corrects likely ASR misrecognitions against the known corpus before matching runs. |
| `services/coachingEngine.ts` + `hooks/useCoachingEngine.ts` | Live coaching state machine (encouragement, mistake messages, pause detection) and its message-selection/voice-feedback wiring. |
| `services/tajweedAnalysisEngine.ts` + `hooks/useTajweedAnalysis.ts` | Per-word tajweed rule detection and evaluation (madd, ghunnah, qalqalah, noon/meem-sakinah family), aggregated per ayah and per surah. |
| `services/scoringEngine.ts` + `hooks/useScoringEngine.ts` | 7-dimension weighted scoring, per-ayah analysis, insights/recommendations, the `RecitationSessionRecord` progress-tracking model. |
| `services/learningProfileEngine.ts`, `learningProfileStorage.ts`, `recommendationEngine.ts`, `practiceQueueEngine.ts`, `adaptiveCoachingEngine.ts` + `hooks/useLearningProfile.ts` | Cross-session learning profile: lifetime totals, long-term weakness/strength detection, trend lines, motivation, a smart recommendation engine, and a practice queue. |
| `services/memorizationEngine.ts`, `reviewScheduler.ts`, `memorizationStorage.ts`, `goalEngine.ts`, `achievementEngine.ts`, `practiceModes.ts`, `sessionBuilder.ts` + `hooks/useMemorization.ts` | Per-ayah memorization status and mastery (with time-based decay), a simplified SM-2 spaced-repetition scheduler, daily/weekly goals, achievements, and an adaptive session builder. |
| `hooks/useRecitationSession.ts` | The root hook: owns the mic-chunk → Whisper → correction → matching pipeline and the single `RecitationSessionState` every other hook reads from. |
| `hooks/useMicrophoneChunks.ts` | Microphone capture via `ScriptProcessorNode`, chunked with overlap; also owns mic-disconnect and `AudioContext` suspension recovery (Phase 8). |
| `services/whisperClient.ts` + `workers/whisperWorker.ts` + `workers/createWhisperWorker.ts` | Owns the Whisper Web Worker: WebGPU-first with automatic WASM fallback, an ordered transcription queue, and worker-crash resilience (Phase 8). |
| `services/logger.ts` (in `src/services/`, shared) | Leveled, namespaced logging used throughout this feature in place of ad hoc `console.*` calls (Phase 8). |
| `pages/RecitationCoachPage.tsx` | The single page component: wires every hook above together, renders the live tracker, the completion screen's analytics/learning/memorization dashboards, and a developer-only debug drawer covering every engine's internal state. |

## 4. Data flow: one recitation session, start to finish

1. User taps **Start**. `useRecitationSession.start()` loads the Quran corpus index and the Whisper model in parallel (`Promise.all`), showing progress via `modelLoadProgress`.
2. `useMicrophoneChunks` starts capturing ~1.5s audio chunks (0.3s overlap) and calls `handleChunk` for each.
3. Each chunk is transcribed by the Whisper worker (`whisperClient.transcribe`), corrected (`quranCorrectionLayer.correctWords`), and — once a surah is detected — aligned against the expected upcoming words (`wordMatcher.alignWindow` → `planAdvances`).
4. Each planned advance is revealed one word at a time (`scheduleReveal`/`drainRevealQueue`, paced by real per-word timing from Whisper), and folded into the tracker (`wordTracker.advanceTracker`), producing a fresh `lastWordEvent`.
5. `useCoachingEngine` and `useTajweedAnalysis` each independently subscribe to `lastWordEvent` and derive their own state — neither depends on the other.
6. On completion, `useScoringEngine` builds the final `SurahScoreReport` from tajweed's report and its own accumulated per-word samples.
7. `useLearningProfile` persists a lean `StoredSessionSummary` (Phase 6) and `useMemorization` updates per-ayah `AyahMemorizationRecord`s and the spaced-repetition schedule from the *fresh, in-memory* `SurahScoreReport.ayahAnalyses` (Phase 7) — this per-ayah detail is deliberately **not** kept in the long-term session history (see §5), so Phase 7's hook consumes it at the one moment it's still available.

## 5. Caching & storage strategy

Everything below is `localStorage`-backed, versioned, and fails soft (a corrupted or version-mismatched entry falls back to an empty store rather than throwing):

| Store | Key | Bounded by | Notes |
|---|---|---|---|
| Learning profile | `recitationCoach.learningProfile.v1` | Capped history (200 most recent sessions) + O(1) incrementally-updated lifetime totals | Totals/averages stay exactly correct forever even after history entries roll off, because they're maintained as running sums, never re-derived from the (capped) array. |
| Memorization | `recitationCoach.memorization.v1` | The Quran's fixed ~6,236 ayahs (one record per ayah ever practiced, updated in place — never appended per session) | Deliberately separate from the learning-profile store: different lifecycle, different growth bound. |

Whisper's own model weights are cached by `@huggingface/transformers` itself via the browser Cache API across reloads — this feature does not (and should not) reimplement that.

## 6. Performance decisions

- **Whisper runs entirely off the main thread** (a module Web Worker) — transcribing a chunk never blocks a re-render or an animation frame.
- **WebGPU-first, WASM fallback** — `whisperWorker.ts` tries WebGPU and falls back to WASM on any failure, which is also the most reliable feature-detection available (letting `@huggingface/transformers` attempt real initialization rather than sniffing capability flags ourselves).
- **A strictly-ordered transcription queue** (`whisperClient.ts`) — on a slow device a chunk can take longer to transcribe than the ~1.5s it took to record; without ordering, a later chunk's result could resolve first and scramble word order.
- **`ArrayBuffer` transfer, not copy**, when posting audio to the worker (`postMessage(message, [audio.buffer])`).
- **Per-session engine costs are O(surah length), never O(history)** — `buildSurahScoreReport`, `buildPracticeQueue`/`buildSmartPracticeQueue`, and friends all operate on the current surah's words/ayahs or the capped history window, not on unbounded past data.
- **Route-level code splitting** — every page in this app, including `RecitationCoachPage`, is already `React.lazy`-loaded (see `src/routes/AppRoutes.tsx`); the Whisper/`@huggingface/transformers` dependency is only downloaded when a user actually navigates to this feature.

## 7. Testing strategy

- **Pure engines** (`services/*.ts`): tested directly with literal fixtures — no mocking needed, since none of them touch React, the DOM, or a Worker.
- **Hooks**: tested indirectly through the engines they wrap; a few (`useMicrophoneChunks`) have direct `renderHook` tests using hand-rolled fakes for `AudioContext`/`getUserMedia`, since jsdom doesn't implement the Web Audio API at all.
- **The Whisper worker boundary is a real Jest limitation, not a gap in effort**: `new Worker(new URL(..., import.meta.url))` cannot be parsed by CRA's CommonJS Jest transform. `workers/createWhisperWorker.ts` exists specifically to isolate that one line so `whisperClient.test.ts` can `jest.mock` the *seam* instead of needing Jest to parse real `import.meta` syntax. This is a deliberate, minimal, additive extraction — not a behavior change.
- **What's out of scope for this test suite, honestly**: true end-to-end tests (a real browser driving a real microphone against a real Whisper model), Lighthouse/Core Web Vitals measurement, and cross-browser compatibility matrices all require tooling (Playwright/Cypress + real browsers, a CI environment with GPU/audio access) that isn't part of this Jest+jsdom unit-test setup. The architecture is built to make as much as possible unit-testable in isolation instead; what remains needs a real browser and is recommended, not claimed as done, in the Phase 8 report.

## 8. Troubleshooting guide

| Symptom | Likely cause | Where to look |
|---|---|---|
| Recitation coach page shows "model error" immediately | WebGPU and WASM both failed to initialize, or the Whisper worker crashed (`whisperClient.ts`'s `onCrash`) | Browser console (via `createLogger('recitation-coach')`, visible at `warn`/`error` level even in production builds), `session.error` |
| Tracker never advances past a word that sounds correct | Check `wordTracker`'s `uncertainStreak`/`hasMistakeAtCursor` via the debug drawer's coaching/tajweed sections — a genuinely ambiguous ASR result held at `isUncertain` will wait for a second word before deciding | Debug drawer → Coaching debug section |
| A recitation session "goes silent" with no chunks arriving | Microphone track ended (unplugged, permission revoked) or the `AudioContext` was suspended (backgrounding/interruption) — both are now surfaced via `onError` (Phase 8) instead of failing silently | `useMicrophoneChunks.ts`'s `ended`/`statechange` listeners |
| Debug drawer shows "no learning profile yet" after several sessions | `localStorage` was cleared, in a private/incognito context that restricts storage, or quota was exceeded (saves fail soft) | `learningProfileStorage.ts` / `memorizationStorage.ts` |
| A new translation key renders as the literal key string | A `TranslationKey`-typed value was embedded directly into an engine's `params` instead of a raw identifier — see the `resolveParams` helper in `RecitationCoachPage.tsx` and the note in `scoringEngine.ts` about why engines never pre-resolve translation keys themselves | `RecitationCoachPage.tsx`'s `resolveParams` |

## 9. Future extension points

- **Swap any heuristic for an ML model** without touching orchestration: replace one entry in `RULE_EVALUATORS`, `DIMENSION_CALCULATORS`, `WEAKNESS_DETECTORS`, or `ACHIEVEMENT_DETECTORS`.
- **Cloud sync**: every persisted shape (`StoredSessionSummary`, `LearningProfileTotals`, `AyahMemorizationRecord`, `ReviewScheduleEntry`) is already plain, JSON-serializable data with no functions or class instances — sending it to a backend is a serialization non-event.
- **Practice modes are modeled but not yet wired into live recitation**: `practiceModes.ts` and `sessionBuilder.ts` produce a genuine, data-driven recommendation (which mode, which ayahs/words/rule), but `useRecitationSession.start()` always tracks a full detected surah start-to-finish today. Actually constraining a live session to "only these ayahs" would mean giving `start()` an optional target-range parameter — a real, scoped, backward-compatible addition, deliberately left as a follow-up rather than done speculatively in Phase 8.
- **A future TTS voice for coaching messages**: `CoachingVoiceFeedback` already exists as an injectable interface (`silentVoiceFeedback`/`toneVoiceFeedback`) specifically for this.
