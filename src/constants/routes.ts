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
  ISLAMIC_CALENDAR: '/islamic-calendar',
  BOOKMARKS: '/bookmarks',
  DOWNLOADS: '/downloads',
  RECITATION_COACH: '/recitation-coach',
  SETTINGS: '/settings',
  KIDS: '/kids',
  KIDS_ALPHABET: '/kids/alphabet',
  KIDS_STORIES: '/kids/stories',
  KIDS_STORY: '/kids/stories/:storyId',
  KIDS_LESSONS: '/kids/lessons',
  KIDS_MANNERS: '/kids/manners',
  KIDS_PARENT: '/kids/parent',
  /** Intentionally not in NAV_ITEMS / any linked navigation — see pages/DevModePage.tsx. */
  DEV_MODE: '/dev',
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
