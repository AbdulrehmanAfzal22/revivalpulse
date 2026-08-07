import fs from 'fs';
import path from 'path';
import { ACTIVE_RECITER, buildAllahNames } from 'config/recitationConfig';
import { nameIndexAtTime } from './useTimestampSync';
import type { AllahName } from 'types/immersiveRecitation.types';
import type { DivineName } from 'types/namesOfAllah.types';

/**
 * Phase 7 — REAL-DATA end-to-end sync validation.
 *
 * Uses the actual production assets (public/data/namesOfAllah.json metadata,
 * src/data/namesTimestamps.json timestamps) and walks ALL 99 name windows —
 * every name must own a nonzero, contiguous, strictly-ascending window — then
 * verifies the synchronizer maps times to exactly one name (no gaps, no
 * overlaps, no name reached out of order). The nasheed starts its first name
 * at ACTIVE_RECITER.introSeconds (17), so samples at real times before it
 * legitimately resolve to index -1 (the Bismillah idle state).
 */
describe('Immersive Recitation — 99-name sync against real assets', () => {
  const metadataPath = path.resolve(
    process.cwd(),
    'public',
    'data',
    'namesOfAllah.json',
  );
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as DivineName[];
  const names: AllahName[] = buildAllahNames(metadata);
  // Total length of the melodic nasheed (ffprobe, 2026) — spans the placeholder
  // timestamps; see recitationConfig.note.sync
  const AUDIO_DURATION_SECONDS = ACTIVE_RECITER.durationSeconds;

  it('yields exactly 99 names in canonical order', () => {
    expect(buildAllahNames(metadata)).toHaveLength(99);
  });

  it('timestamps are strictly ascending within each window', () => {
    for (let i = 1; i < names.length; i += 1) {
      const previous = names[i - 1];
      const next = names[i];
      if (previous && next) {
        expect(next.timestampSeconds).toBeGreaterThan(previous.timestampSeconds);
      }
    }
    // The first name is never inside the melodic intro.
    expect(names[0]?.timestampSeconds).toBeGreaterThanOrEqual(ACTIVE_RECITER.introSeconds);
  });

  it('every name owns a non-zero, contiguous window (all 99 mapped times)', () => {
    for (let i = 0; i < names.length - 1; i += 1) {
      const current = names[i];
      const next = names[i + 1];
      if (!current || !next) continue;
      const windowDiameter = next.timestampSeconds - current.timestampSeconds;
      expect(windowDiameter).toBeGreaterThan(0);
      // Exactly on the boundary maps to the NEXT name...
      expect(nameIndexAtTime(next.timestampSeconds, names)).toBe(i + 1);
      // ...just before the boundary still maps to THIS name.
      expect(nameIndexAtTime(next.timestampSeconds - 0.001, names)).toBe(i);
    }
  });

  it('mid-audio resolves the right name every ~10s across the whole stream', () => {
    const stepSeconds = 10;
    const lastTimestamp = names[names.length - 1]?.timestampSeconds ?? 0;
    // Samples before the first name resolve to -1 (Bismillah idle); start
    // the walk at the FIRST name's timestamp (which may sit a step after the
    // melodic intro — see STEP_OFFSET in generatePlaceholderTimestamps.mjs).
    const firstTimestamp = names[0]?.timestampSeconds ?? ACTIVE_RECITER.introSeconds;
    for (let t = Math.max(stepSeconds, firstTimestamp); t < lastTimestamp; t += stepSeconds) {
      const resolved = nameIndexAtTime(t, names);
      const lower = names[resolved];
      const upper = names[resolved + 1];
      expect(lower?.timestampSeconds).toBeLessThanOrEqual(t);
      if (upper) {
        expect(upper.timestampSeconds).toBeGreaterThan(t);
      }
    }
  });

  it('last name resolves at the end of the audio (time past the final boundary)', () => {
    expect(nameIndexAtTime(999, names)).toBe(98);
  });

  it('resolves every one of the 99 names once during playback', () => {
    const resolvedIds = new Set<string>();
    for (let t = 0; t < 400; t += 0.5) {
      const index = nameIndexAtTime(t, names);
      const name = names[index];
      if (name) resolvedIds.add(name.id);
    }
    expect(resolvedIds.size).toBe(99);
  });
});