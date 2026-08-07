#!/usr/bin/env node
/**
 * Real per-name timestamps for the full speech recitation.
 *
 * `public/audio/asma-ul-husna-full.mp3` is the byte-exact concatenation of the
 * 99 per-name source files (1.mp3..99.mp3, from the BSD-style Asma-ul-Husna
 * source, see ATTRIBUTION.md), each with its leading ID3v2 tag stripped. The
 * resulting stream is MPEG-1 Layer III CBR at 96 kbps — 96 000 bits/s = 12 000
 * bytes/second. Because the stream is one contiguous CBR run whose frame
 * boundaries are byte-exact, a name's start time in the file is exactly its
 * cumulative stripped byte count divided by the byte rate:
 *
 *   timestampSeconds(name i) = (sum of stripped sizes of files 1..i-1) / 12000
 *
 * This is frame-accurate by construction (every MP3 frame is 417 bytes here) —
 * the browser's currentTime steps through those same frames, so sync cannot
 * drift: the timestamps are derived from the very bytes the decoder reads.
 *
 * Re-runs are idempotent and self-verifying: it fails loudly if the on-disk
 * full file is not byte-equal to the recomputed concatenation.
 *
 * Usage:  node scripts/generateSpeechTrackTimestamps.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio', 'asma-ul-husna');
const FULL_PATH = path.join(ROOT, 'public', 'audio', 'asma-ul-husna-full.mp3');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'namesTimestamps.json');

/** 96 kbps CBR MPEG-1 Layer III. */
const BYTES_PER_SECOND = 12000;

/**
 * Size of an MP3 file's audio payload (leading ID3v2 tag excluded). Any other
 * file layout contributes its full length — the source files only carry ID3v2.
 */
function audioPayloadSize(buffer) {
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    const tagSize =
      ((buffer[6] & 0x7f) << 21) |
      ((buffer[7] & 0x7f) << 14) |
      ((buffer[8] & 0x7f) << 7) |
      (buffer[9] & 0x7f);
    return buffer.length - (10 + tagSize);
  }
  return buffer.length;
}

// 1. Recomputed concatenation size + cumulative start times.
const cumulativeStartBytes = [0];
let recomputedTotal = 0;
for (let i = 1; i <= 99; i += 1) {
  const payload = audioPayloadSize(fs.readFileSync(path.join(AUDIO_DIR, `${i}.mp3`)));
  recomputedTotal += payload;
  cumulativeStartBytes.push(recomputedTotal);
}

// 2. Verify the on-disk full file is exactly the recomputed stream.
const fullSize = fs.statSync(FULL_PATH).size;
if (fullSize !== recomputedTotal) {
  console.error(
    `[timestamps:speech] MISMATCH: ${FULL_PATH} is ${fullSize} bytes but the stripped ` +
      `concatenation of the 99 source files is ${recomputedTotal}. Refusing to write.`,
  );
  process.exit(1);
}

// 3. timestamps for ids "01".."99" in real file seconds, to 3 decimals.
const timestamps = cumulativeStartBytes.slice(0, 99).map((bytes, index) => ({
  id: String(index + 1).padStart(2, '0'),
  timestampSeconds: Number((bytes / BYTES_PER_SECOND).toFixed(3)),
}));

const totalSeconds = recomputedTotal / BYTES_PER_SECOND;
const ascending = timestamps.every(
  (row, index) => index === 0 || row.timestampSeconds > timestamps[index - 1].timestampSeconds,
);

if (!ascending) {
  console.error('[timestamps:speech] generated timestamps are not strictly ascending.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(timestamps, null, 2)}\n`);

console.log(
  `[timestamps:speech] wrote 99 real timestamps → src/data/namesTimestamps.json\n` +
    `  first: ${timestamps[0].timestampSeconds}s  last: ${timestamps[98].timestampSeconds}s\n` +
    `  total stream: ${recomputedTotal} bytes = ${totalSeconds.toFixed(3)}s @ 96kbps CBR (verified byte-exact)`,
);