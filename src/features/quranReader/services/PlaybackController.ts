import type { ChapterRecitation, VerseTimestamp } from 'types/word.types';

/**
 * "Is a translation playing right now" is never a plain on/off toggle —
 * a single boolean would have to make "nothing is playing at all" and
 * "ordinary recitation is playing" look identical (both "false"), which is
 * exactly the kind of collapse that lets a call site skip checking it
 * safely by accident. Naming all three states explicitly closes that hole.
 */
export type PlaybackEngineState = 'idle' | 'playing-recitation' | 'playing-translation';

/**
 * One linear plan for the whole session, built once (or its tail rebuilt on
 * a settings change) — playback ever only moves forward by
 * `currentIndex += 1`. This is what Arabic-then-translation-then-next-Arabic
 * actually *is*, not a rule several functions have to independently
 * remember to apply: an 'arabic' item for ayah N is always immediately
 * followed in the array by that ayah's enabled translation item(s), which
 * are always immediately followed by the next ayah's 'arabic' item.
 */
export interface QueueItem {
  type: 'arabic' | 'urdu' | 'english';
  surah: number;
  ayah: number;
}

/**
 * The single owner of all playback state — no other module holds a
 * competing piece of it or touches an audio element directly.
 */
export class PlaybackController {
  // --- audio elements — the only two that produce sound ---
  audio: HTMLAudioElement | null = null;
  translationAudio: HTMLAudioElement | null = null;
  /** everyayah.com mode only — prefetches the next ayah's file so advancing doesn't have a network-fetch-sized gap of silence. */
  preloadAudio: HTMLAudioElement | null = null;

  // --- quran.com mode: cached chapter recitation (one file, timestamps) ---
  recitationCache: { key: string; data: ChapterRecitation } | null = null;

  /**
   * quran.com mode only: the shared chapter file decoded once into raw PCM,
   * so each ayah can be sliced out to its own exact-length clip and played
   * through `audio` exactly like everyayah.com's one-file-per-ayah mode —
   * the native `ended` event then fires at the real end of *that ayah's own
   * audio*, with no next-ayah content physically present to bleed into.
   * Decoding (not just fetching) is what makes sample-accurate slicing
   * possible; a plain fetched URL only lets you seek within one continuous
   * stream, not carve out an independent clip.
   */
  decodedRecitationCache: { key: string; buffer: AudioBuffer } | null = null;
  /** In-flight dedup: a real Play press for a surah whose preload is still fetching/decoding joins this same promise instead of starting a redundant fetch. Cleared once the fetch settles (success or failure), independent of whether it ends up cached. */
  decodedRecitationFetch: { key: string; promise: Promise<AudioBuffer> } | null = null;
  /** Same in-flight dedup as `decodedRecitationFetch`, for the lighter metadata-only fetch. */
  recitationFetch: { key: string; promise: Promise<ChapterRecitation> } | null = null;
  /**
   * The most recently *requested* key for each cache, updated by every
   * caller regardless of whether they started the fetch or joined an
   * in-flight one. This — not `epoch` — is what gates the eventual cache
   * write: `epoch` only changes on real playback sessions, but a background
   * preload can originate a fetch that a real session later joins via the
   * dedup above, so gating on "did epoch change since whoever happened to
   * start this fetch" would wrongly discard a result the current real
   * session is actually waiting on. Gating on "is this key still the latest
   * one anyone asked for" protects the single-slot cache from a genuinely
   * stale, superseded request (for a *different* key) without being fooled
   * by preloading's deliberate epoch-independence.
   */
  decodedRecitationLatestKey: string | null = null;
  recitationLatestKey: string | null = null;
  /** Lazily created — used only for decoding audio into PCM, never for output, so it never needs a user-gesture resume. */
  audioContext: AudioContext | null = null;
  /** quran.com mode only: the timestamp entry for whichever ayah is currently loaded into `audio`, so word-sync highlighting can offset the trimmed clip's own currentTime back into the original file's coordinate space. */
  activeTimestamp: VerseTimestamp | null = null;

  /** The single source of truth for playback order — see QueueItem docstring. */
  queue: QueueItem[] = [];
  currentIndex = 0;

  /** Replaces the old isInTranslationInterlude boolean — see PlaybackEngineState docstring above for why a flag wasn't enough. */
  state: PlaybackEngineState = 'idle';

  /** Derived, never stored — which element is producing sound is always exactly a function of `state`, so keeping a second field in sync with it would just reintroduce duplicated state. */
  get activeElement(): 'recitation' | 'translation' | null {
    if (this.state === 'playing-recitation') return 'recitation';
    if (this.state === 'playing-translation') return 'translation';
    return null;
  }

  /** Bumped on every session-superseding action (fresh load(), stop()). Every async continuation checks this before mutating anything — a mismatch means it's stale and must terminate silently. */
  epoch = 0;

  mediaSessionWired = false;

  /**
   * Background preloading (warming recitationCache/decodedRecitationCache
   * before Play is pressed) is deliberately tracked separately from `epoch`
   * — it must never bump epoch, or starting a preload for a surah the user
   * merely opened would interrupt whatever is actively playing. Bumped every
   * time preloadSurah() is called for a new surah, so a superseded preload's
   * own continuations can tell they're stale and stop without touching
   * anything a newer preload (or real playback) now owns.
   */
  preloadToken = 0;
  /** Aborts the in-flight chapter-audio fetch of a superseded preload — the one part of preloading actually worth cancelling over the wire, since it can be a multi-minute file. */
  preloadAbortController: AbortController | null = null;
}

/** One instance for the whole app — the single owner of all playback state. */
export const controller = new PlaybackController();
