/**
 * Debugging-only utility (Phase 11 investigation): saves a raw microphone
 * chunk to disk as a playable WAV file, so a chunk that produced suspicious
 * Whisper output (e.g. a hallucinated repeated word) can be listened to
 * directly, or run through a different ASR implementation to isolate
 * whether the problem is the captured audio or Transformers.js/the model.
 * Not wired into any recitation/detection logic — purely a side-effecting
 * diagnostic export triggered by the caller.
 */

/** Same 44-byte-header mono 16-bit PCM WAV encoding pattern already used for Quran audio playback (see playbackEngine.ts's encodeWavBlob) — duplicated here rather than shared since that one takes an AudioBuffer, not a raw Float32Array + explicit sample rate. */
function encodeFloat32AsWav(audio: Float32Array, sampleRate: number): Blob {
  const bytesPerSample = 2;
  const dataSize = audio.length * bytesPerSample;

  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  const writeString = (offset: number, value: string): void => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < audio.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, audio[i]!));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/** Triggers a browser download of the given raw audio chunk as a .wav file. */
export function saveFloat32AsWav(audio: Float32Array, filename: string, sampleRate: number): void {
  const blob = encodeFloat32AsWav(audio, sampleRate);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoked after a tick, not immediately — some browsers cancel the download if the object URL is revoked synchronously.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** True if `words` contains the same word repeated `minRun` or more times in a row — the exact pattern the reported "نحن نحن نحن نحن" symptom matches. Pure, read-only, no side effects. */
export function hasRepeatedWordRun(words: string[], minRun = 3): boolean {
  let runLength = 1;
  for (let i = 1; i < words.length; i += 1) {
    runLength = words[i] === words[i - 1] ? runLength + 1 : 1;
    if (runLength >= minRun) return true;
  }
  return false;
}
