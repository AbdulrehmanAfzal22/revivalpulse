export const ROUTES = {
  HOME: '/',
  QURAN: '/quran',
  SURAH: '/quran/:surahId',
  HADITH: '/hadith',
  HADITH_BOOK: '/hadith/:bookSlug',
  HADITH_CHAPTER: '/hadith/:bookSlug/:chapterId',
  TAFSIR_SURAHS: '/tafsir',
  TAFSIR: '/tafsir/:surahId/:ayahNumber',
  PRAYER_TIMES: '/prayer-times',
  TASBEEH: '/tasbeeh',
  DUAS: '/duas',
  NAMES_OF_ALLAH: '/names-of-allah',
  /** Immersive full-screen 99-Names recitation — its own layout (no navbar/footer). */
  NAMES_OF_ALLAH_IMMERSIVE: '/names-of-allah/immersive',
  ISLAMIC_CALENDAR: '/islamic-calendar',
  BOOKMARKS: '/bookmarks',
  DOWNLOADS: '/downloads',
  RECITATION_COACH: '/recitation-coach',
  SETTINGS: '/settings',
  KIDS: '/kids',
  KIDS_ALPHABET: '/kids/alphabet',
  KIDS_STORIES: '/kids/stories',
  /** Legacy flat story page (single-panel narrative). */
  KIDS_STORY: '/kids/stories/:storyId',
  /** Phase 3 — chapter-based story: chapter list + per-chapter detail. */
  KIDS_STORY_CHAPTERS: '/kids/stories/:storyId/chapters',
  KIDS_STORY_CHAPTER: '/kids/stories/:storyId/chapters/:chapterId',
  /** Phase 7 — Companions (Sahabah): a top-level, chapter-based section that
   *  reuses the same KidsStoryV2 schema as Stories. */
  KIDS_SAHABI: '/kids/sahabi',
  KIDS_SAHABI_CHAPTERS: '/kids/sahabi/:storyId/chapters',
  KIDS_SAHABI_CHAPTER: '/kids/sahabi/:storyId/chapters/:chapterId',
  KIDS_LESSONS: '/kids/lessons',
  KIDS_MANNERS: '/kids/manners',
  KIDS_PARENT: '/kids/parent',
  /** Phase 6-7,10,11 — quiz/games hub, games, and the stars dashboard. */
  KIDS_QUIZ: '/kids/quiz',
  KIDS_GAMES: '/kids/games',
  KIDS_GAME_PLAY: '/kids/games/:gameId',
  KIDS_STARS: '/kids/stars',
  /** Intentionally not in NAV_ITEMS / any linked navigation — see pages/DevModePage.tsx. */
  DEV_MODE: '/dev',
  /** Dev-only timestamp capture helper for the immersive recitation (Phase 4). */
  TIMESTAMP_EDITOR: '/dev/timestamp-editor',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export function buildTafsirPath(surahId: number, ayahNumber: number): string {
  return `/tafsir/${surahId}/${ayahNumber}`;
}

export function buildTafsirSurahPath(surahId: number): string {
  return buildTafsirPath(surahId, 1);
}

export function buildHadithBookPath(bookSlug: string): string {
  return `/hadith/${bookSlug}`;
}

export function buildHadithChapterPath(bookSlug: string, chapterId: number): string {
  return `/hadith/${bookSlug}/${chapterId}`;
}

export function buildKidsStoryPath(storyId: string): string {
  return `/kids/stories/${storyId}`;
}

export function buildKidsStoryChaptersPath(storyId: string): string {
  return `${buildKidsStoryPath(storyId)}/chapters`;
}

export function buildKidsStoryChapterPath(storyId: string, chapterId: string): string {
  return `${buildKidsStoryPath(storyId)}/chapters/${chapterId}`;
}

export function buildKidsSahabiPath(sahabiId: string): string {
  return `/kids/sahabi/${sahabiId}`;
}

export function buildKidsSahabiChaptersPath(sahabiId: string): string {
  return `${buildKidsSahabiPath(sahabiId)}/chapters`;
}

export function buildKidsSahabiChapterPath(sahabiId: string, chapterId: string): string {
  return `${buildKidsSahabiPath(sahabiId)}/chapters/${chapterId}`;
}
