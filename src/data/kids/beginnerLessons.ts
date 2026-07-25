import type { BeginnerLesson } from 'types/kids.types';

/** Short, commonly-taught-to-beginners surahs — surah metadata (verse counts etc.) already verified in data/quran/surahs.ts. */
export const BEGINNER_LESSONS: BeginnerLesson[] = [
  { surahId: 1, title: 'Al-Fatihah', focusKey: 'kids.lesson.alFatihah.focus' },
  { surahId: 112, title: 'Al-Ikhlas', focusKey: 'kids.lesson.alIkhlas.focus' },
  { surahId: 113, title: 'Al-Falaq', focusKey: 'kids.lesson.alFalaq.focus' },
  { surahId: 114, title: 'An-Nas', focusKey: 'kids.lesson.anNas.focus' },
  { surahId: 108, title: 'Al-Kawthar', focusKey: 'kids.lesson.alKawthar.focus' },
  { surahId: 103, title: "Al-'Asr", focusKey: 'kids.lesson.alAsr.focus' },
  { surahId: 110, title: 'An-Nasr', focusKey: 'kids.lesson.anNasr.focus' },
  { surahId: 105, title: 'Al-Fil', focusKey: 'kids.lesson.alFil.focus' },
];
