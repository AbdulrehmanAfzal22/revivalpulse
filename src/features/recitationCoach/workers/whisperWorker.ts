import { pipeline } from '@huggingface/transformers';
import type { AutomaticSpeechRecognitionPipeline, ProgressInfo } from '@huggingface/transformers';

/**
 * onnx-community/whisper-base_timestamped: same base architecture/size/
 * multilingual (incl. Arabic) accuracy as onnx-community/whisper-base, but
 * exported with the decoder's cross-attention outputs present — required
 * for `return_timestamps: 'word'` below. Plain whisper-base's ONNX export
 * lacks those outputs, which throws "Model outputs must contain cross
 * attentions to extract timestamps" as soon as word timestamps are requested.
 */
const MODEL_ID = 'onnx-community/whisper-base_timestamped';

// Diagnostic only — proves which physical worker script file the browser
// actually executed, independent of what the source tree says. Runs once,
// at worker script evaluation time.
// eslint-disable-next-line no-console -- deliberate runtime-verification log, not left-over debugging
console.log('Worker script URL (self.location.href):', (globalThis as unknown as { location: { href: string } }).location.href);

export type WhisperDevice = 'webgpu' | 'wasm';

export type WhisperWorkerRequest =
  | { type: 'load' }
  | { type: 'transcribe'; id: number; audio: Float32Array };

/** One recognized word and when it occurred within the chunk's own audio, in seconds. */
export interface TimedWord {
  text: string;
  start: number;
  end: number;
}

export type WhisperWorkerResponse =
  | { type: 'progress'; info: ProgressInfo }
  | { type: 'ready'; device: WhisperDevice }
  | { type: 'result'; id: number; text: string; words: TimedWord[] }
  | { type: 'error'; message: string; id?: number };

function post(message: WhisperWorkerResponse): void {
  (globalThis as unknown as Worker).postMessage(message);
}

let transcriber: AutomaticSpeechRecognitionPipeline | null = null;
let loadingPromise: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

/**
 * WebGPU is strongly preferred (real GPU inference, much faster per chunk)
 * but isn't available in every browser yet — Safari and older Chromium in
 * particular. Trying it first and falling back to WASM on failure means
 * this works everywhere without needing to feature-detect WebGPU support
 * ourselves (transformers.js's own attempt to initialize it is the most
 * reliable detector there is).
 */
async function loadModel(): Promise<AutomaticSpeechRecognitionPipeline> {
  if (transcriber) return transcriber;
  if (loadingPromise) return loadingPromise;

  const progress_callback = (info: ProgressInfo): void => post({ type: 'progress', info });

  loadingPromise = (async () => {
    try {
      // eslint-disable-next-line no-console -- deliberate runtime-verification log, not left-over debugging
      console.log('Runtime MODEL_ID:', MODEL_ID, '(device: webgpu)');
      const pipe = (await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', MODEL_ID, {
        device: 'webgpu',
        progress_callback,
      })) as AutomaticSpeechRecognitionPipeline;
      post({ type: 'ready', device: 'webgpu' });
      return pipe;
    } catch {
      // eslint-disable-next-line no-console -- deliberate runtime-verification log, not left-over debugging
      console.log('Runtime MODEL_ID:', MODEL_ID, '(device: wasm, webgpu fallback)');
      const pipe = (await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', MODEL_ID, {
        device: 'wasm',
        progress_callback,
      })) as AutomaticSpeechRecognitionPipeline;
      post({ type: 'ready', device: 'wasm' });
      return pipe;
    }
  })();

  transcriber = await loadingPromise;
  return transcriber;
}

globalThis.addEventListener('message', (event: MessageEvent<WhisperWorkerRequest>) => {
  const data = event.data;

  if (data.type === 'load') {
    loadModel().catch((error: unknown) => {
      post({ type: 'error', message: error instanceof Error ? error.message : String(error) });
    });
    return;
  }

  if (data.type === 'transcribe') {
    const { id, audio } = data;
    void (async () => {
      try {
        const pipe = await loadModel();
        // return_timestamps: 'word' gives real per-word timing within this
        // chunk's audio, used to stagger the on-screen reveal to match how
        // the words were actually spoken instead of an arbitrary fixed delay.
        const output = await pipe(audio, {
          task: 'transcribe',
          return_timestamps: 'word',
        });
        const result = Array.isArray(output) ? output[0] : output;
        const words: TimedWord[] = (result?.chunks ?? []).map((chunk) => ({
          text: chunk.text,
          start: chunk.timestamp[0],
          end: chunk.timestamp[1],
        }));
        post({ type: 'result', id, text: (result?.text ?? '').trim(), words });
      } catch (error) {
        post({ type: 'error', message: error instanceof Error ? error.message : String(error), id });
      }
    })();
  }
});
