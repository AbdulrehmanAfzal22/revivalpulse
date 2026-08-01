import { renderHook } from '@testing-library/react';
import useMicrophoneChunks from './useMicrophoneChunks';

type Listener = () => void;

class MockAudioTrack {
  listeners: Record<string, Listener[]> = {};
  addEventListener(type: string, listener: Listener): void {
    (this.listeners[type] ??= []).push(listener);
  }
  removeEventListener(): void {
    // Not exercised by these tests.
  }
  stop(): void {
    // Not exercised by these tests.
  }
  emit(type: string): void {
    for (const listener of this.listeners[type] ?? []) listener();
  }
}

class MockAudioContext {
  state: 'running' | 'suspended' | 'closed' = 'running';
  listeners: Record<string, Listener[]> = {};
  destination = {};
  resume = jest.fn(() => Promise.resolve());
  close = jest.fn(() => Promise.resolve());

  constructor(public options?: { sampleRate?: number }) {}

  createMediaStreamSource() {
    return { connect: jest.fn(), disconnect: jest.fn() };
  }

  createScriptProcessor() {
    return { onaudioprocess: null as ((event: unknown) => void) | null, connect: jest.fn(), disconnect: jest.fn() };
  }

  createGain() {
    return { gain: { value: 0 }, connect: jest.fn(), disconnect: jest.fn() };
  }

  addEventListener(type: string, listener: Listener): void {
    (this.listeners[type] ??= []).push(listener);
  }

  removeEventListener(): void {
    // Not exercised by these tests.
  }

  emit(type: string): void {
    for (const listener of this.listeners[type] ?? []) listener();
  }
}

let mockTrack: MockAudioTrack;
let mockAudioContext: MockAudioContext;

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('useMicrophoneChunks', () => {
  const originalAudioContext = (globalThis as { AudioContext?: unknown }).AudioContext;
  const originalMediaDevices = navigator.mediaDevices;

  beforeEach(() => {
    mockTrack = new MockAudioTrack();
    mockAudioContext = new MockAudioContext();
    (globalThis as unknown as { AudioContext: unknown }).AudioContext = jest.fn(() => mockAudioContext);

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: () => [mockTrack],
          getAudioTracks: () => [mockTrack],
        }),
      },
    });
  });

  afterEach(() => {
    (globalThis as unknown as { AudioContext: unknown }).AudioContext = originalAudioContext;
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: originalMediaDevices });
  });

  it('reports a disconnect error when the audio track ends unexpectedly', async () => {
    const onError = jest.fn();
    renderHook(() => useMicrophoneChunks({ enabled: true, onChunk: jest.fn(), onError }));
    await flushMicrotasks();

    mockTrack.emit('ended');

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Microphone disconnected' }));
  });

  it('attempts to resume the audio context when it becomes suspended', async () => {
    renderHook(() => useMicrophoneChunks({ enabled: true, onChunk: jest.fn(), onError: jest.fn() }));
    await flushMicrotasks();

    mockAudioContext.state = 'suspended';
    mockAudioContext.emit('statechange');

    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  it('does not attempt to resume when the context is already running', async () => {
    renderHook(() => useMicrophoneChunks({ enabled: true, onChunk: jest.fn(), onError: jest.fn() }));
    await flushMicrotasks();

    mockAudioContext.emit('statechange'); // state is still 'running'

    expect(mockAudioContext.resume).not.toHaveBeenCalled();
  });

  it('reports an error when resuming a suspended context fails', async () => {
    mockAudioContext.resume.mockRejectedValueOnce(new Error('cannot resume'));
    const onError = jest.fn();
    renderHook(() => useMicrophoneChunks({ enabled: true, onChunk: jest.fn(), onError }));
    await flushMicrotasks();

    mockAudioContext.state = 'suspended';
    mockAudioContext.emit('statechange');
    await flushMicrotasks();

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('interrupted') }));
  });

  it('does not report a disconnect error after the hook has been cleaned up', async () => {
    const onError = jest.fn();
    const { unmount } = renderHook(() => useMicrophoneChunks({ enabled: true, onChunk: jest.fn(), onError }));
    await flushMicrotasks();
    unmount();

    mockTrack.emit('ended');

    expect(onError).not.toHaveBeenCalled();
  });
});
