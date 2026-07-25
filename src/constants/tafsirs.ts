import type { TafsirResource } from 'types/translation.types';

/**
 * Curated, not exhaustive — adding a tafsir is a data-only change: append an
 * entry here (source ids verified live against each API).
 *
 * Jalalayn isn't published on api.quran.com's tafsir resource, so it's
 * sourced from api.alquran.cloud instead.
 *
 * Maududi's Tafhim al-Qur'an was previously wired here via Quran.com's
 * *translation* resource (id 95, quranComEndpoint: 'translation') rather
 * than a dedicated tafsir resource — which meant it only ever returned the
 * short verse translation, never the actual commentary. Neither
 * api.quran.com's /resources/tafsirs nor api.alquran.cloud's tafsir
 * editions publish a genuine Maududi tafsir in any language, so rather than
 * keep mis-substituting a translation for a tafsir, it's replaced below
 * with Ma'arif al-Qur'an — a real, verified tafsir resource in English.
 */
export const TAFSIRS: TafsirResource[] = [
  {
    id: 'ibn-kathir',
    label: 'Ibn Kathir',
    authorName: 'Hafiz Ibn Kathir',
    languageCode: 'ar',
    source: 'quran.com',
    sourceId: 14,
  },
  {
    id: 'jalalayn',
    label: 'Jalalayn',
    authorName: 'Al-Mahalli & As-Suyuti',
    languageCode: 'ar',
    source: 'alquran.cloud',
    sourceId: 'ar.jalalayn',
  },
  {
    id: 'sadi',
    label: "Al-Sa'di",
    authorName: "Abd al-Rahman al-Sa'di",
    languageCode: 'ar',
    source: 'quran.com',
    sourceId: 91,
  },
  {
    id: 'tabari',
    label: 'Al-Tabari',
    authorName: 'Ibn Jarir al-Tabari',
    languageCode: 'ar',
    source: 'quran.com',
    sourceId: 15,
  },
  {
    id: 'maarif-ul-quran',
    label: "Ma'arif al-Qur'an",
    authorName: 'Mufti Muhammad Shafi',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 168,
  },
  {
    id: 'ibn-kathir-ur',
    label: 'Ibn Kathir',
    authorName: 'Hafiz Ibn Kathir (Urdu)',
    languageCode: 'ur',
    source: 'quran.com',
    sourceId: 160,
  },
];

export const DEFAULT_TAFSIR_ID = 'ibn-kathir';
