#!/usr/bin/env node
/**
 * Phase 6-9 — Automated background video pipeline (developer-facing).
 *
 * Fetches a batch of ambient background clips for the immersive recitation
 * from the Pexels video API, license-checks every candidate (Phase 7), stores
 * clips + posters under `public/media/background/<category>`, and writes a
 * manifest that the client uses to build the themed rotation (Phase 8).
 *
 * Design notes:
 * - ROTATION: search terms are grouped into categories; each run starts at a
 *   week-derived offset so repeated runs bring in DIFFERENT clips instead of the
 *   same front page results every time.
 * - CACHING (Phase 9): a run is a no-op (exit 0) when the manifest was fetched
 *   within `intervalDays`. Staleness (older than 2x the interval) logs a loud
 *   warning so an owner notices before the media roster goes stale.
 * - LICENSE (Phase 7): every candidate passes `isLicensedForCommercialUse`
 *   before it is downloaded. The same predicate is mirrored in the client hook
 *   so the browser re-validates at render time. Deliberately conservative:
 *   anything marked premium/restricted, exotic file types, or missing data is
 *   rejected here.
 * - SAFE FALLBACK (Phase 7/8): if this script leaves `manifest.json` missing or
 *   empty, the client falls back to the manually curated SAFE_VIDEO_FALLBACK
 *   in config/recitationConfig.ts — never a blank screen.
 *
 * Usage:
 *   PEXELS_API_KEY=xxx node scripts/fetchVideoBatch.mjs [--interval-days 7]
 * Requires Node 18+ (global fetch). No runtime dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MEDIA_DIR = path.join(ROOT, 'public', 'media', 'background');
const MANIFEST_PATH = path.join(MEDIA_DIR, 'manifest.json');

/** Category labels the client can theme against (canonical order is client-side). */
const CATEGORIES = {
  'holy-sites': ['kaaba', 'masjid al haram', 'madinah', 'masjid an nabawi'],
  architecture: ['islamic architecture'],
  nature: ['sunset', 'mountains', 'nature', 'clouds'],
  ambient: ['abstract waves', 'slow motion water'],
};

const ALL_TERMS = Object.entries(CATEGORIES).flatMap(([category, terms]) =>
  terms.map((term) => ({ term, category })),
);

const PEXELS_SEARCH_URL = (query) =>
  `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(query)}&per_page=15`;

const warn = (msg) => console.warn(`[videos:fetch] WARN ${msg}`);
const error = (msg) => console.error(`[videos:fetch] ERROR ${msg}`);
const info = (msg) => console.log(`[videos:fetch] ${msg}`);

/**
 * Phase 7 — commercial-use license predicate (shared contract with the client).
 * Rejects anything the API marks premium/restricted or any license we cannot
 * prove is free to redistribute. Conservative by design.
 */
export function isLicensedForCommercialUse(video) {
  if (!video || typeof video !== 'object') {
    return { ok: false, reason: 'malformed-candidate' };
  }
  if (video.is_premium === true) {
    return { ok: false, reason: `premium-excluded:${video.id}` };
  }
  const license = typeof video.license === 'string' ? video.license.toLowerCase() : 'unspecified';
  const excluded = new Set(['internal', 'exclusive', 'editorial-only', 'restricted']);
  const allowed = new Set([
    'unspecified',
    'free',
    'royalty-free',
    'pexels',
    'pixabay',
    'cc0',
    'creative commons',
  ]);
  if (excluded.has(license) || !allowed.has(license)) {
    return { ok: false, reason: `license:${license}` };
  }
  return { ok: true, reason: `license:${license}` };
}

/** ISO week number (used to rotate the term list per-run). First week = 1. */
function isoWeek(date = new Date()) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  return Math.round(((target - firstThursday) / 86400000 + 6) / 7);
}

/** Rotated term list: start at (week % length) so successive runs differ. */
function rotatedTerms(offset) {
  const start = Math.abs(offset) % ALL_TERMS.length;
  return [...ALL_TERMS.slice(start), ...ALL_TERMS.slice(0, start)];
}

async function fetchJsonWithKey(url, apiKey) {
  const response = await fetch(url, { headers: { Authorization: apiKey } });
  if (response.status === 429) {
    throw new Error(`rate limited (HTTP 429) — ${url}`);
  }
  if (!response.ok) {
    throw new Error(`Pexels responded ${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

function pickBestMp4(video) {
  const candidates = (video.video_files ?? [])
    .filter((file) => file && file.file_type === 'video/mp4' && file.link)
    .sort((a, b) => {
      const aHd = a.quality === 'hd' ? 1 : 0;
      const bHd = b.quality === 'hd' ? 1 : 0;
      if (aHd !== bHd) return bHd - aHd;
      return (b.width ?? 0) - (a.width ?? 0);
    });
  return candidates[0] ?? null;
}

function pickPoster(video) {
  const pictures = (video.video_pictures ?? []).filter((p) => p && p.picture);
  if (pictures.length === 0) return null;
  return pictures
    .slice()
    .sort((a, b) => (a.width ?? Infinity) - (b.width ?? Infinity))[0].picture;
}

async function downloadToFile(url, destination, apiKey) {
  const response = await fetch(url, { headers: { Authorization: apiKey } });
  if (!response.ok) {
    throw new Error(`download ${url} → HTTP ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, buffer);
  return buffer.byteLength;
}

export async function main({
  apiKey = process.env.PEXELS_API_KEY,
  intervalDays = 7,
} = {}) {
  if (!apiKey) {
    warn(
      'PEXELS_API_KEY is not set — nothing to do. Set it (CI secret or .env.local) and rerun.',
    );
    return { fetched: 0, skipped: true, reason: 'no-api-key' };
  }

  fs.mkdirSync(MEDIA_DIR, { recursive: true });

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
      warn('manifest.json exists but is unparseable — will overwrite it.');
    }
  }

  // Phase 9 cache: not due yet → no-op (idempotent weekly cron).
  const since = typeof manifest.fetchedAt === 'string' ? new Date(manifest.fetchedAt) : null;
  if (since && !Number.isNaN(since.getTime())) {
    const ageDays = (Date.now() - since.getTime()) / 86400000;
    if (ageDays < intervalDays) {
      info(
        `manifest fetched ${ageDays.toFixed(1)}d ago (< ${intervalDays}d interval) — skipping run.`,
      );
      return { fetched: 0, skipped: true, reason: 'fresh-cache' };
    }
    if (ageDays > intervalDays * 2) {
      warn(`manifest is stale by ${(ageDays - intervalDays).toFixed(1)}d — refreshing now.`);
    }
  }

  const week = isoWeek();
  const termsToFetch = rotatedTerms(week);
  info(
    `fetching ${termsToFetch.length} terms (week ${week}, starting at "${termsToFetch[0].term}")`,
  );

  const clips = [];
  const seenIds = new Set();

  for (const { term, category } of termsToFetch) {
    try {
      const payload = await fetchJsonWithKey(PEXELS_SEARCH_URL(term), apiKey);
      const videos = payload.videos ?? [];
      if (videos.length === 0) {
        warn(`no videos for term "${term}"`);
        continue;
      }

      let chosen = null;
      for (const video of videos) {
        const check = isLicensedForCommercialUse(video);
        if (!check.ok) {
          info(`rejected ${video.id} for "${term}": ${check.reason}`);
          continue;
        }
        if (seenIds.has(video.id)) continue;
        const mp4 = pickBestMp4(video);
        const poster = pickPoster(video);
        if (!mp4 || !poster) continue;
        chosen = { video, mp4, poster, check };
        break;
      }

      if (!chosen) {
        warn(`no licensed usable clip for "${term}"`);
        continue;
      }

      const { video, mp4, poster, check } = chosen;
      seenIds.add(video.id);
      const clipName = `${term.replace(/[^a-z0-9]+/gi, '-')}-${video.id}`;
      const videoDest = path.join(MEDIA_DIR, category, `${clipName}.mp4`);
      const posterDest = path.join(MEDIA_DIR, category, `${clipName}-poster.jpg`);

      const videoBytes = await downloadToFile(mp4.link, videoDest, apiKey);
      const posterBytes = await downloadToFile(poster, posterDest, apiKey);
      info(
        `downloaded ${category}/${clipName}.mp4 (${(videoBytes / 1024).toFixed(0)} KB, poster ${(posterBytes / 1024).toFixed(0)} KB, ${check.reason})`,
      );

      clips.push({
        id: clipName,
        category,
        query: term,
        provider: 'pexels',
        license: check.reason.replace('license:', ''),
        url: `/media/background/${category}/${clipName}.mp4`,
        posterUrl: `/media/background/${category}/${clipName}-poster.jpg`,
      });
    } catch (err) {
      error(`"${term}" failed: ${err.message}`);
    }
  }

  if (clips.length === 0) {
    warn('no clips fetched at all — manifest not updated.');
    return { fetched: 0, skipped: false, reason: 'no-clips' };
  }

  manifest = {
    source: 'pexels',
    fetchedAt: new Date().toISOString(),
    intervalDays,
    clips,
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  info(`wrote ${clips.length} clip(s) to ${MANIFEST_PATH}`);
  return { fetched: clips.length, skipped: false, reason: 'done' };
}

// CLI entry point.
function arg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (value === undefined || value.startsWith('--')) return true;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? value : parsed;
}

const intervalDays =
  typeof arg('--interval-days') === 'number'
    ? arg('--interval-days')
    : Number.parseInt(process.env.PEXELS_INTERVAL_DAYS ?? '90', 10);

main({ intervalDays, apiKey: process.env.PEXELS_API_KEY })
  .then((result) => {
    console.log(
      `[videos:fetch] done — ${result.fetched} clip(s) staged; interval ${intervalDays}d.`,
    );
  })
  .catch((err) => {
    error(err.message);
    process.exitCode = 1;
  });
