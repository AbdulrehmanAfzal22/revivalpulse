/**
 * Isolated into its own one-line module because `import.meta.url` can't be
 * parsed by CRA's CommonJS Jest transform — keeping it out of
 * whisperClient.ts means whisperClient.test.ts can `jest.mock` this seam
 * instead of the real Worker (and this file's syntax) ever needing to load
 * under Jest at all. No behavior change for the running app: this is the
 * exact same construction whisperClient.ts used to do inline.
 */
export function createWhisperWorker(): Worker {
  return new Worker(new URL('./whisperWorker.ts', import.meta.url), { type: 'module' });
}
