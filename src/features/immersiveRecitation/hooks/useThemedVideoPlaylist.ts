import { useEffect, useState } from 'react';
import type { BackgroundVideoAsset } from 'types/immersiveRecitation.types';
import { SAFE_VIDEO_FALLBACK } from 'config/recitationConfig';
import {
  isLicensedForCommercialUse,
  toBackgroundAsset,
  type VideoManifest,
} from '../utils/mediaLicense';

/**
 * Canonical category order for the themed rotation. Categories the manifest
 * does not contain are skipped; categories with clips are emitted in this
 * order so the composition always opens with the most atmospheric set.
 */
const CANONICAL_CATEGORY_ORDER = ['holy-sites', 'architecture', 'nature', 'ambient'];

/** Hard cap on the rotation size (memory/bandwidth guard — see Phase 9). */
const MAX_CLIPS = 12;

const MANIFEST_URL = `${process.env.PUBLIC_URL ?? ''}/media/background/manifest.json`;

/** Fisher–Yates shuffle (in-place, returns the same array). */
function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = items[i] as T;
    const b = items[j] as T;
    items[i] = b;
    items[j] = a;
  }
  return items;
}

/** Builds the themed playlist from manifest clips (already license-validated). */
export function buildThemedPlaylist(clips: VideoManifest['clips']): BackgroundVideoAsset[] {
  const groups = new Map<string, BackgroundVideoAsset[]>();
  for (const clip of clips) {
    if (!isLicensedForCommercialUse({ license: clip.license })) continue;
    if (typeof clip.url !== 'string' || clip.url.length === 0) continue;
    if (typeof clip.posterUrl !== 'string' || clip.posterUrl.length === 0) continue;
    const bucket = groups.get(clip.category) ?? [];
    bucket.push(toBackgroundAsset(clip));
    groups.set(clip.category, bucket);
  }

  const playlist: BackgroundVideoAsset[] = [];
  for (const category of CANONICAL_CATEGORY_ORDER) {
    const bucket = groups.get(category);
    if (!bucket || bucket.length === 0) continue;
    playlist.push(...shuffle(bucket));
    if (playlist.length >= MAX_CLIPS) break;
  }
  return playlist.slice(0, MAX_CLIPS);
}

export interface ThemedVideoPlaylistState {
  /** Playlist for the background player (themed rotation or safe fallback). */
  playlist: BackgroundVideoAsset[];
  /** True when the fallback set is in use (manifest missing/invalid/empty). */
  usingFallback: boolean;
}

/**
 * Phase 8 — themed background rotation.
 *
 * Loads the pipeline manifest (`public/media/background/manifest.json`), groups
 * clips by category, shuffles WITHIN each category (so consecutive clips vary
 * but the composition always walks holy-sites → architecture → nature →
 * ambient), and flattens into the player playlist.
 *
 * Phase 7: every clip is re-validated through isLicensedForCommercialUse
 * client-side before it may enter the rotation.
 *
 * Phase 7/9 fallback: if the manifest 404s, is unparseable, contains no
 * licensed clips, or the fetch fails for any reason, the SAFE_VIDEO_FALLBACK
 * set from config is used — the page never renders with zero background
 * assets, and the degradation is surfaced via `usingFallback` (dev console
 * note, no UI noise).
 */
export default function useThemedVideoPlaylist(): ThemedVideoPlaylistState {
  const [state, setState] = useState<ThemedVideoPlaylistState>({
    playlist: SAFE_VIDEO_FALLBACK,
    usingFallback: true,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`manifest.json → HTTP ${response.status}`);
        }
        const manifest = (await response.json()) as Partial<VideoManifest>;
        const clips = Array.isArray(manifest.clips) ? manifest.clips : [];
        const playlist = buildThemedPlaylist(clips);
        if (cancelled) return;
        if (playlist.length === 0) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              '[Immersive Recitation] manifest has no licensed clips — using SAFE_VIDEO_FALLBACK.',
            );
          }
          setState({ playlist: SAFE_VIDEO_FALLBACK, usingFallback: true });
          return;
        }
        setState({ playlist, usingFallback: false });
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[Immersive Recitation] could not load video manifest (${String(error)}) — using SAFE_VIDEO_FALLBACK.`,
          );
        }
        setState({ playlist: SAFE_VIDEO_FALLBACK, usingFallback: true });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}