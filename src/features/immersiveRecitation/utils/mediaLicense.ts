import type { BackgroundVideoAsset } from 'types/immersiveRecitation.types';

/**
 * Phase 7 — client-side mirror of the server (script/fetchVideoBatch.mjs)
 * license predicate. The pipeline enforces it before downloading clips; this
 * copy re-validates clip entries read back from the manifest at render time so
 * a hand-edited or stale manifest can never slip a restricted clip through.
 */
export function isLicensedForCommercialUse(candidate: unknown): boolean {
  if (!candidate || typeof candidate !== 'object') return false;
  const video = candidate as { is_premium?: unknown; license?: unknown };
  if (video.is_premium === true) return false;
  const license =
    typeof video.license === 'string' ? video.license.toLowerCase() : 'unspecified';
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
  return !excluded.has(license) && allowed.has(license);
}

/**
 * A clip row from the pipeline manifest (`public/media/background/manifest.json`).
 * Mirrors what scripts/fetchVideoBatch.mjs writes per clip.
 */
export interface VideoManifestClip {
  /** Unique clip id (term-category + Pexels id). */
  id: string;
  /** Canonical category bucket: 'holy-sites' | 'architecture' | 'nature' | 'ambient'. */
  category: string;
  /** Search term that produced it (informational). */
  query: string;
  /** Provider, e.g. 'pexels'. */
  provider: string;
  /** License tag recorded by the pipeline (post-license-check). */
  license: string;
  url: string;
  posterUrl: string;
}

/**
 * Shape of the whole pipeline manifest (as written by fetchVideoBatch.mjs).
 */
export interface VideoManifest {
  source: string;
  fetchedAt: string;
  intervalDays: number;
  clips: VideoManifestClip[];
}

/** Casts a raw manifest clip row to the player's asset shape. */
export function toBackgroundAsset(clip: VideoManifestClip): BackgroundVideoAsset {
  return { id: clip.id, url: clip.url, posterUrl: clip.posterUrl };
}