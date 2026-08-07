import {
  isLicensedForCommercialUse,
  toBackgroundAsset,
  type VideoManifestClip,
} from './mediaLicense';
import { buildThemedPlaylist } from '../hooks/useThemedVideoPlaylist';

const baseClip: VideoManifestClip = {
  id: 'kaaba-1',
  category: 'holy-sites',
  query: 'kaaba',
  provider: 'pexels',
  license: 'pexels',
  url: '/media/background/holy-sites/kaaba-1.mp4',
  posterUrl: '/media/background/holy-sites/kaaba-1-poster.jpg',
};

describe('isLicensedForCommercialUse', () => {
  it('accepts provider, permissive, and unspecified licenses', () => {
    for (const license of [
      'pexels',
      'free',
      'royalty-free',
      'pixabay',
      'cc0',
      'creative commons',
      'unspecified',
      undefined,
    ]) {
      expect(isLicensedForCommercialUse({ license })).toBe(true);
    }
  });

  it('rejects premium, restricted, and unknown licenses', () => {
    expect(isLicensedForCommercialUse({ is_premium: true, license: 'pexels' })).toBe(false);
    for (const license of ['internal', 'exclusive', 'editorial-only', 'restricted', 'proprietary']) {
      expect(isLicensedForCommercialUse({ license })).toBe(false);
    }
  });

  it('rejects malformed input', () => {
    expect(isLicensedForCommercialUse(null)).toBe(false);
    expect(isLicensedForCommercialUse('clip')).toBe(false);
  });
});

describe('buildThemedPlaylist', () => {
  const a: VideoManifestClip = { ...baseClip, id: 'a', url: '/a.mp4', posterUrl: '/a-poster.jpg' };
  const b: VideoManifestClip = { ...baseClip, id: 'b', url: '/b.mp4', posterUrl: '/b-poster.jpg' };
  const c: VideoManifestClip = {
    ...baseClip,
    id: 'c',
    url: '/c.mp4',
    posterUrl: '/c-poster.jpg',
    category: 'nature',
  };
  const d: VideoManifestClip = {
    ...baseClip,
    id: 'd',
    url: '/d.mp4',
    posterUrl: '/d-poster.jpg',
    category: 'nature',
  };

  it('emits categories in canonical order and flattens the rotation', () => {
    // holy-sites entries ('a','b') must occupy the first group; nature
    // entries ('c','d') the second — regardless of input order or intra-group
    // shuffle. The playlist itself carries no category field, so group
    // membership is asserted by id set.
    const playlist = buildThemedPlaylist([d, a, c, b]);
    expect(playlist).toHaveLength(4);
    const holyIds = new Set(['a', 'b']);
    const natureIds = new Set(['c', 'd']);
    expect(holyIds.has(playlist[0]!.id)).toBe(true);
    expect(holyIds.has(playlist[1]!.id)).toBe(true);
    expect(natureIds.has(playlist[2]!.id)).toBe(true);
    expect(natureIds.has(playlist[3]!.id)).toBe(true);
  });

  it('shuffles within categories but keeps every member exactly once', () => {
    const playlist = buildThemedPlaylist([d, a, b, c]);
    const ids = playlist.map((asset) => asset.id).sort();
    expect(ids).toEqual(['a', 'b', 'c', 'd']);
  });

  it('drops unlicensed clips from the rotation', () => {
    const restricted = { ...baseClip, id: 'restricted-1', license: 'restricted' };
    const playlist = buildThemedPlaylist([restricted, c]);
    expect(playlist).toHaveLength(1);
    expect(playlist[0]!.id).toBe('c');
  });

  it('caps the rotation and returns empty for no licensed clips', () => {
    const many: VideoManifestClip[] = Array.from({ length: 20 }, (_, i) => ({
      ...baseClip,
      id: `clip-${i}`,
      url: `/clip-${i}.mp4`,
      posterUrl: `/clip-${i}-poster.jpg`,
    }));
    expect(buildThemedPlaylist(many)).toHaveLength(12);
    expect(buildThemedPlaylist([])).toHaveLength(0);
  });
});

describe('toBackgroundAsset', () => {
  it('maps a manifest clip to the player asset shape', () => {
    const asset = toBackgroundAsset(baseClip);
    expect(asset).toEqual({
      id: baseClip.id,
      url: baseClip.url,
      posterUrl: baseClip.posterUrl,
    });
  });
});