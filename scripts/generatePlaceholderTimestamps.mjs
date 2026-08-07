#!/usr/bin/env node
// PLACEHOLDER generator — one-time tool.
//
// Writes src/data/namesTimestamps.json with 99 EVENLY SPACED placeholder
// timestamps spanning the melodic track's playable body, delayed by LEAD_SECONDS
// past the melodic intro. Owner calibration (2026): the even grid typed AT the
// boundary ran the text ahead — first ~1 name, then a further ~0.5s — so the
// sung melody lands ≈ 2s after the intro finishes. LEAD_SECONDS moves the WHOLE
// grid later to keep the text on top of the voice:
//   first name = introSeconds + LEAD_SECONDS, uniform 1.52s steps after that.
//
// PLACEHOLDER — replace with real timestamps captured by ear from the
// /dev/timestamp-editor tool (Enter at each name change), then overwrite
// this file with the exported JSON. Do NOT ship the placeholder set to
// production: names sync would be roughly right, never the actual sung
// positions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../src/data/namesTimestamps.json');

// Mirror ACTIVE_RECITER fields (config/recitationConfig.ts) — keep in sync if those change.
const COUNT = 99;
const introSeconds = 17; // ACTIVE_RECITER.introSeconds (nasheed instrumental opening)
const durationSeconds = 169.018; // ACTIVE_RECITER.durationSeconds (ffprobe, 2026)
const outroSeconds = 0; // ACTIVE_RECITER.outroSeconds (none)

const start = introSeconds; // (inclusive) — first name may start AT the intro
const end = durationSeconds - outroSeconds; // exclusive-ified by the validator (last must be < end)

// LEAD_SECONDS: delay of the first name past the intro end. Owner-calibrated:
// at 0 the text ran a name ahead, +1 step was still 0.5s fast, 2.0s was on the
// voice — owner now wants the text to sit ~0.5s SLOW (behind the melody):
// first name lands at intro + 2.5s (tunable while timestamps are placeholders;
// replace with real positions via /dev/timestamp-editor).
const LEAD_SECONDS = 2.5;
// Spread the whole grid so the LAST name stays strictly inside the body
// (validator demands last < duration - outro).
const step = (end - start - LEAD_SECONDS) / COUNT;

const rows = Array.from({ length: COUNT }, (_, i) => ({
  id: String(i + 1).padStart(2, '0'),
  timestampSeconds: Number((start + LEAD_SECONDS + i * step).toFixed(3)),
}));

// Guard against rounded collisions (trivial at this spacing, kept for safety).
for (let i = 1; i < rows.length; i += 1) {
  if (rows[i].timestampSeconds <= rows[i - 1].timestampSeconds) {
    rows[i].timestampSeconds = Number((rows[i - 1].timestampSeconds + 0.001).toFixed(3));
  }
}

fs.writeFileSync(OUT, `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
process.stdout.write(
  [
    `Wrote ${rows.length} placeholder rows to ${OUT}`,
    `  first: ${rows[0].timestampSeconds}s (introSeconds=${introSeconds} + lead ${LEAD_SECONDS}s)`,
    `  last:  ${rows[rows.length - 1].timestampSeconds}s (< duration-outro ${end}s)`,
    `  step:  ${step.toFixed(4)}s`,
    'PLACEHOLDER — replace with real timestamps from /dev/timestamp-editor.',
    '',
  ].join('\n')
);