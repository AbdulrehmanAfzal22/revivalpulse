import { createWhisperClient } from './whisperClient';
import { createWhisperWorker } from '../workers/createWhisperWorker';

type Listener = (event: unknown) => void;

/**
 * jsdom doesn't implement Worker at all, and the real construction path
 * (createWhisperWorker.ts) uses `import.meta.url`, which CRA's CommonJS
 * Jest transform can't parse — so that module is mocked below rather than
 * the global Worker constructor. This fake stands in just far enough to
 * drive whisperClient's own message/error-handling logic (the thing
 * actually worth unit-testing here) without needing a real worker thread.
 */
class MockWorker {
  listeners: Record<string, Listener[]> = {};
  postMessage = jest.fn();
  terminate = jest.fn();

  addEventListener(type: string, listener: Listener): void {
    (this.listeners[type] ??= []).push(listener);
  }

  removeEventListener(): void {
    // Not exercised by these tests.
  }

  dispatchEvent(): boolean {
    return true;
  }

  emitMessage(data: unknown): void {
    for (const listener of this.listeners.message ?? []) listener({ data });
  }

  emitError(message: string): void {
    for (const listener of this.listeners.error ?? []) listener({ message });
  }
}

let mockLatestWorker: MockWorker;

jest.mock('../workers/createWhisperWorker', () => ({
  __esModule: true,
  createWhisperWorker: jest.fn(),
}));

describe('createWhisperClient', () => {
  // CRA's Jest config sets `resetMocks: true`, which wipes any
  // mockImplementation set inside a jest.mock() factory before every test
  // (the factory only runs once, at first import) — so the implementation
  // has to be (re)installed here instead, where it survives that reset.
  beforeEach(() => {
    (createWhisperWorker as jest.Mock).mockImplementation(() => {
      mockLatestWorker = new MockWorker();
      return mockLatestWorker;
    });
  });

  it('resolves load() once the worker reports ready', async () => {
    const client = createWhisperClient();
    const loadPromise = client.load();
    mockLatestWorker.emitMessage({ type: 'ready', device: 'wasm' });
    await expect(loadPromise).resolves.toBe('wasm');
  });

  it('rejects only the specific transcription a message-based error names', async () => {
    const client = createWhisperClient();
    client.load();
    mockLatestWorker.emitMessage({ type: 'ready', device: 'wasm' });

    const audio = new Float32Array(4);
    const result = client.transcribe(audio);
    // The internal transcription queue dispatches sendTranscribeRequest (and
    // registers it as pending) on the next microtask, not synchronously —
    // give it a tick before the worker "responds".
    await Promise.resolve();
    mockLatestWorker.emitMessage({ type: 'error', id: 0, message: 'bad audio' });

    await expect(result).rejects.toThrow('bad audio');
  });

  it('rejects an in-flight load() when the worker itself crashes', async () => {
    const client = createWhisperClient();
    const loadPromise = client.load();
    mockLatestWorker.emitError('worker crashed');
    await expect(loadPromise).rejects.toThrow('worker crashed');
  });

  it('rejects the in-flight transcription when the worker crashes mid-session', async () => {
    // The transcription queue is strictly sequential (chunks must be
    // transcribed in recording order — see whisperClient.ts's own
    // docstring), so there is only ever one truly in-flight (dispatched,
    // awaiting-response) request at a time; anything requested after it is
    // still queued, not yet pending, which is covered separately by the
    // "rejects future ... calls" test below.
    const client = createWhisperClient();
    client.load();
    mockLatestWorker.emitMessage({ type: 'ready', device: 'wasm' });

    const inFlight = client.transcribe(new Float32Array(4));
    await Promise.resolve();
    mockLatestWorker.emitError('out of memory');

    await expect(inFlight).rejects.toThrow('out of memory');
  });

  it('invokes onCrash exactly once when the worker crashes', () => {
    const onCrash = jest.fn();
    createWhisperClient({ onCrash });
    mockLatestWorker.emitError('boom');
    mockLatestWorker.emitError('boom again');
    expect(onCrash).toHaveBeenCalledTimes(1);
  });

  it('rejects future load()/transcribe() calls immediately after a crash, without posting to the dead worker', async () => {
    const client = createWhisperClient();
    mockLatestWorker.emitError('fatal');
    mockLatestWorker.postMessage.mockClear();

    await expect(client.load()).rejects.toThrow('cannot be restarted');
    await expect(client.transcribe(new Float32Array(4))).rejects.toThrow('cannot be restarted');
    expect(mockLatestWorker.postMessage).not.toHaveBeenCalled();
  });

  it('forwards progress updates via onProgress', () => {
    const onProgress = jest.fn();
    createWhisperClient({ onProgress });
    const info = { status: 'progress', progress: 42 };
    mockLatestWorker.emitMessage({ type: 'progress', info });
    expect(onProgress).toHaveBeenCalledWith(info);
  });

  it('terminate() stops the underlying worker', () => {
    const client = createWhisperClient();
    client.transcribe(new Float32Array(4));
    client.terminate();
    expect(mockLatestWorker.terminate).toHaveBeenCalled();
  });
});
