import type { ProgressInfo } from '@huggingface/transformers';
import type { WhisperDevice, WhisperWorkerRequest, WhisperWorkerResponse, TimedWord } from '../workers/whisperWorker';
import { createWhisperWorker } from '../workers/createWhisperWorker';
import { createLogger } from 'services/logger';

/**
 * Phase 10 instrumentation note: every `trace.debug(...)` call below is a
 * pure diagnostic addition — logging only. No request/response handling,
 * timing, promise resolution, or control-flow was altered to add these.
 */
const trace = createLogger('whisper-trace');

export interface TranscriptionResult {
  text: string;
  words: TimedWord[];
}

export interface WhisperClient {
  /** Resolves once the model is loaded and ready to transcribe (or rejects if both WebGPU and WASM fail). */
  load: () => Promise<WhisperDevice>;
  transcribe: (audio: Float32Array) => Promise<TranscriptionResult>;
  terminate: () => void;
}

export interface WhisperClientCallbacks {
  onProgress?: (info: ProgressInfo) => void;
  /**
   * Fired once, the first time the worker itself dies (an uncaught
   * exception, an OOM kill on a memory-constrained device, etc.) — as
   * opposed to an ordinary transcription failure, which rejects just that
   * one request. Every in-flight `load()`/`transcribe()` call is rejected
   * at the same time this fires, so a crash surfaces immediately instead
   * of leaving the caller waiting on a promise that can now never settle.
   */
  onCrash?: (error: Error) => void;
}

/**
 * Owns the Whisper Web Worker and turns its message-based protocol into
 * promises. Runs entirely off the main thread — model loading and
 * inference both happen in the worker, so transcribing a chunk never
 * blocks the UI.
 */
export function createWhisperClient(callbacks: WhisperClientCallbacks = {}): WhisperClient {
  const worker = createWhisperWorker();

  let requestId = 0;
  let loadPromise: Promise<WhisperDevice> | null = null;
  let resolveLoad: ((device: WhisperDevice) => void) | null = null;
  let rejectLoad: ((error: Error) => void) | null = null;
  let crashed = false;
  const pendingTranscriptions = new Map<
    number,
    { resolve: (result: TranscriptionResult) => void; reject: (error: Error) => void }
  >();
  /** Phase 10 instrumentation only — request-start timestamps, keyed by the same id as pendingTranscriptions, purely to compute and log round-trip duration. Never read by any non-diagnostic code. */
  const requestStartedAt = new Map<number, number>();
  let loadRequestedAt: number | null = null;

  /**
   * The worker's own `error` event — distinct from the message-based
   * `{ type: 'error' }` protocol above, which requires the worker to still
   * be alive enough to post a message back. A hard crash (uncaught
   * exception terminating the worker, an OOM kill) never gets that chance,
   * so without this listener every pending and future `load()`/
   * `transcribe()` call would simply hang forever with no rejection —
   * exactly the silent-freeze failure mode "Worker crashes" calls for
   * graceful recovery from.
   */
  worker.addEventListener('error', (event: ErrorEvent) => {
    trace.error('worker error event', { message: event.message, alreadyCrashed: crashed, timestamp: Date.now() });
    if (crashed) return; // already handled — a worker that keeps firing 'error' shouldn't re-notify or re-reject an already-cleared pending set.
    crashed = true;
    const error = new Error(event.message || 'Whisper worker crashed unexpectedly');
    rejectLoad?.(error);
    resolveLoad = null;
    rejectLoad = null;
    for (const pending of pendingTranscriptions.values()) pending.reject(error);
    pendingTranscriptions.clear();
    callbacks.onCrash?.(error);
  });

  worker.addEventListener('message', (event: MessageEvent<WhisperWorkerResponse>) => {
    const data = event.data;

    if (data.type === 'progress') {
      trace.debug('progress message', { status: data.info.status, timestamp: Date.now() });
      callbacks.onProgress?.(data.info);
      return;
    }

    if (data.type === 'ready') {
      const durationMs = loadRequestedAt !== null ? Date.now() - loadRequestedAt : null;
      trace.debug('Whisper finish time — ready message received', { device: data.device, loadDurationMs: durationMs, timestamp: Date.now() });
      resolveLoad?.(data.device);
      return;
    }

    if (data.type === 'result') {
      const startedAt = requestStartedAt.get(data.id);
      const durationMs = startedAt !== undefined ? Date.now() - startedAt : null;
      requestStartedAt.delete(data.id);
      trace.debug('Whisper finish time — result message received', {
        requestId: data.id,
        durationMs,
        returnedText: data.text,
        returnedTextLength: data.text.length,
        returnedWordCount: data.words.length,
        returnedTimestamps: data.words.map((w) => ({ text: w.text, start: w.start, end: w.end })),
        timestamp: Date.now(),
      });
      if (data.text.length === 0 || data.words.length === 0) {
        trace.error('ERROR: Whisper produced empty transcription.', { requestId: data.id, timestamp: Date.now() });
      }
      pendingTranscriptions.get(data.id)?.resolve({ text: data.text, words: data.words });
      pendingTranscriptions.delete(data.id);
      return;
    }

    if (data.type === 'error') {
      const startedAt = data.id !== undefined ? requestStartedAt.get(data.id) : undefined;
      const durationMs = startedAt !== undefined ? Date.now() - startedAt : null;
      trace.error('Whisper worker reported a message-level error', {
        requestId: data.id ?? '(load request)',
        message: data.message,
        durationMs,
        timestamp: Date.now(),
      });
      const error = new Error(data.message);
      if (data.id !== undefined) {
        requestStartedAt.delete(data.id);
        pendingTranscriptions.get(data.id)?.reject(error);
        pendingTranscriptions.delete(data.id);
      } else {
        rejectLoad?.(error);
      }
    }
  });

  function load(): Promise<WhisperDevice> {
    if (crashed) {
      trace.error('load() called after crash — rejecting immediately', { timestamp: Date.now() });
      return Promise.reject(new Error('Whisper worker has crashed and cannot be restarted'));
    }
    if (loadPromise) {
      trace.debug('load() called again while already loading/loaded — returning existing promise', { timestamp: Date.now() });
      return loadPromise;
    }
    loadPromise = new Promise<WhisperDevice>((resolve, reject) => {
      resolveLoad = resolve;
      rejectLoad = reject;
    });
    const message: WhisperWorkerRequest = { type: 'load' };
    loadRequestedAt = Date.now();
    trace.debug('Whisper request — load dispatched to worker', { timestamp: loadRequestedAt });
    worker.postMessage(message);
    return loadPromise;
  }

  // Chunks must be transcribed in the order they were recorded — on a slow
  // device (WASM fallback, weaker hardware) a single chunk can take longer
  // to process than the ~1.5s it took to record, so without this a later
  // chunk's request could reach the worker (and resolve) before an earlier
  // one's, scrambling the word order fed into the tracker and surfacing as
  // "resumes from the wrong position." Chaining every transcribe() call
  // after the previous one's settlement guarantees strict in-order
  // processing regardless of how backed up the queue gets.
  let transcriptionQueue: Promise<unknown> = Promise.resolve();

  function sendTranscribeRequest(audio: Float32Array): Promise<TranscriptionResult> {
    if (crashed) {
      trace.error('transcribe() dispatch skipped — worker already crashed', { timestamp: Date.now() });
      return Promise.reject(new Error('Whisper worker has crashed and cannot be restarted'));
    }
    const id = requestId++;
    const result = new Promise<TranscriptionResult>((resolve, reject) => {
      pendingTranscriptions.set(id, { resolve, reject });
    });
    const message: WhisperWorkerRequest = { type: 'transcribe', id, audio };
    requestStartedAt.set(id, Date.now());
    trace.debug('Whisper request — transcribe dispatched to worker', {
      requestId: id,
      audioLengthSamples: audio.length,
      audioDurationS: audio.length / 16000,
      timestamp: Date.now(),
    });
    // Transfers the underlying buffer to the worker instead of copying it —
    // fine here since each chunk's Float32Array is only ever used once.
    worker.postMessage(message, [audio.buffer]);
    return result;
  }

  function transcribe(audio: Float32Array): Promise<TranscriptionResult> {
    const chained = transcriptionQueue.then(
      () => sendTranscribeRequest(audio),
      () => sendTranscribeRequest(audio)
    );
    // Swallow here so one failed chunk doesn't poison the chain for every
    // chunk queued after it — the caller of transcribe() still sees the
    // rejection via `chained`.
    transcriptionQueue = chained.catch(() => undefined);
    return chained;
  }

  function terminate(): void {
    trace.debug('terminate() called', { pendingCount: pendingTranscriptions.size, timestamp: Date.now() });
    worker.terminate();
    pendingTranscriptions.clear();
  }

  return { load, transcribe, terminate };
}
