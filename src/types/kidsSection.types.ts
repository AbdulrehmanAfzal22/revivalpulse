/**
 * Kids Section — typed media registry (Phase 1: Asset Inventory).
 *
 * Catalogues the bundled images in `public/assets/` and tags each with the
 * role it is best suited for. Later phases consume `kidsAssetById` /
 * `kidsAssetsByCategory` instead of reaching into `public/assets/` directly,
 * so every image is addressable, has real alt text, and is tagged up front.
 *
 * NOTE: all NINE bundled photos were inspected (macOS Vision) and are
 * landscape/nature stills (sky, clouds, hills, grasslands) — perfect as
 * wholesome backgrounds, but NONE of them is a character/mascot, badge, or
 * category icon. Those categories exist in the type so later phases can
 * register new, purpose-built assets (mascot, reward badges, category icons)
 * in this same registry rather than special-casing them.
 */

/** What a media asset is (structural) — decides where it can be referenced. */
export type KidsAssetCategory = 'character' | 'background' | 'badge' | 'categoryIcon';

/** What the asset is BEST USED for (semantic) — decides how phases consume it. */
export type KidsAssetPurpose =
  | 'character'
  | 'mascot'
  | 'background'
  | 'badge'
  | 'rewardIcon'
  | 'categoryIcon';

export interface KidsAsset {
  /** Stable, route-safe id, e.g. "landscape-sky-1". */
  id: string;
  /** Public path the app can load, e.g. "/assets/pic1.jpg". */
  path: string;
  /** Accessible description (alt text) describing the actual image content. */
  altText: string;
  /** Structural category. */
  category: KidsAssetCategory;
  /** Best-fit usage, decided from what the image actually shows. */
  purpose: KidsAssetPurpose;
}

/**
 * The bundled landscape/nature stills (public/assets/picN.jpg).
 *
 * Tagged from actual content (macOS Vision classification, Aug 2026): every
 * photo is outdoor scenery — sky, clouds, hills, grass — so the purpose is
 * `background` for all nine. Alt text mirrors what each picture shows.
 */
export const KIDS_ASSETS: readonly KidsAsset[] = [
  {
    id: 'clouds-over-grassland',
    path: '/assets/pic1.jpg',
    altText: 'Cloudy blue sky above a wide grassland.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'green-foliage-sky',
    path: '/assets/pic2.jpg',
    altText: 'Fresh green plants reaching toward a bright sky.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'hills-under-storm-sky',
    path: '/assets/pic3.jpg',
    altText: 'Dramatic cloudy sky hanging over green hills.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'hill-with-sky',
    path: '/assets/pic4.jpg',
    altText: 'Clear blue sky over a rolling hill with a small structure.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'rolling-grass-fields',
    path: '/assets/pic5.jpg',
    altText: 'Sunny sky over rolling green grass fields.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'hills-blue-sky',
    path: '/assets/pic6.jpg',
    altText: 'Blue sky with soft clouds over gentle hills.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'grassy-hillside-clouds',
    path: '/assets/pic7.jpg',
    altText: 'Morning clouds drifting over a grassy hillside.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'soft-clouds-hills',
    path: '/assets/pic8.jpg',
    altText: 'Soft clouds over distant, layered hills.',
    category: 'background',
    purpose: 'background',
  },
  {
    id: 'hill-sunlit-clouds',
    path: '/assets/pic9.jpg',
    altText: 'Sunlit hills framed by streaked clouds.',
    category: 'background',
    purpose: 'background',
  },
];

export function kidsAssetById(id: string): KidsAsset | undefined {
  return KIDS_ASSETS.find((asset) => asset.id === id);
}

export function kidsAssetsByCategory(category: KidsAssetCategory): KidsAsset[] {
  return KIDS_ASSETS.filter((asset) => asset.category === category);
}

export function kidsAssetsByPurpose(purpose: KidsAssetPurpose): KidsAsset[] {
  return KIDS_ASSETS.filter((asset) => asset.purpose === purpose);
}