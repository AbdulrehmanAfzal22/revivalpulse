import type { TranslationResource } from 'types/translation.types';

/**
 * Curated, not exhaustive — adding a translation is a data-only change:
 * append an entry here (source ids verified live against each API).
 *
 * Two requested works aren't available from either api.quran.com or
 * api.alquran.cloud and are omitted rather than mis-substituted:
 * Dr. Mustafa Khattab's "The Clear Quran" (not published via either API —
 * Talal Itani's unrelated "Clear Qur'an" on AlQuran Cloud is NOT this work).
 * "Jalandhry" and "Fateh Muhammad Jalandhari" are the same translator/work,
 * listed once.
 *
 * hardening-phase-3 coverage audit (cross-referenced api.quran.com's
 * /resources/translations and api.alquran.cloud's /edition?type=translation,
 * one entry added per interface language that had zero translations wired
 * despite real ones being available — each sourceId spot-checked live
 * against /verses/by_key/1:1 before being added here):
 * - fa, fr, id, ms, tr, bn, hi, de: were entirely unwired; one representative,
 *   well-established translation added for each below.
 * - ar: deliberately has none — see TranslationLanguageCode in
 *   types/translation.types.ts for why "translate Quran into Arabic" isn't
 *   a real category.
 * - en, ur: already had solid multi-work coverage; left as-is.
 */
export const TRANSLATIONS: TranslationResource[] = [
  {
    id: 'saheeh-international',
    label: 'Saheeh International',
    authorName: 'Saheeh International',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 20,
  },
  {
    id: 'pickthall',
    label: 'Pickthall',
    authorName: 'M. Pickthall',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 19,
  },
  {
    id: 'yusuf-ali',
    label: 'Yusuf Ali',
    authorName: 'Abdullah Yusuf Ali',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 22,
  },
  {
    id: 'hilali-muhsin-khan',
    label: 'Hilali & Muhsin Khan',
    authorName: 'Al-Hilali & Khan',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 203,
  },
  {
    id: 'abdel-haleem',
    label: 'Abdel Haleem',
    authorName: 'M.A.S. Abdel Haleem',
    languageCode: 'en',
    source: 'quran.com',
    sourceId: 85,
  },
  {
    id: 'jalandhry',
    label: 'Jalandhry',
    authorName: 'Fatah Muhammad Jalandhari',
    languageCode: 'ur',
    source: 'quran.com',
    sourceId: 234,
  },
  {
    id: 'maududi-ur',
    label: 'Maududi (Tafheem-ul-Quran)',
    authorName: 'Syed Abu Ali Maududi',
    languageCode: 'ur',
    source: 'quran.com',
    sourceId: 97,
  },
  {
    id: 'ahmed-raza-khan',
    label: 'Ahmed Raza Khan (Kanzul Iman)',
    authorName: 'Ahmed Raza Khan',
    languageCode: 'ur',
    source: 'alquran.cloud',
    sourceId: 'ur.kanzuliman',
  },
  {
    id: 'taji-kal-dari',
    label: 'Hussein Taji Kal Dari',
    authorName: 'Hussein Taji Kal Dari',
    languageCode: 'fa',
    source: 'quran.com',
    sourceId: 29,
  },
  {
    id: 'hamidullah',
    label: 'Hamidullah',
    authorName: 'Muhammad Hamidullah',
    languageCode: 'fr',
    source: 'quran.com',
    sourceId: 31,
  },
  {
    id: 'indonesian-ministry',
    label: 'Kemenag',
    authorName: 'Indonesian Islamic Affairs Ministry',
    languageCode: 'id',
    source: 'quran.com',
    sourceId: 33,
  },
  {
    id: 'basmeih',
    label: 'Basmeih',
    authorName: 'Abdullah Muhammad Basmeih',
    languageCode: 'ms',
    source: 'quran.com',
    sourceId: 39,
  },
  {
    id: 'diyanet',
    label: 'Diyanet İşleri',
    authorName: 'Diyanet İşleri Başkanlığı',
    languageCode: 'tr',
    source: 'quran.com',
    sourceId: 77,
  },
  {
    id: 'zakaria',
    label: 'Abu Bakr Zakaria',
    authorName: 'Dr. Abu Bakr Muhammad Zakaria',
    languageCode: 'bn',
    source: 'quran.com',
    sourceId: 213,
  },
  {
    id: 'azizul-haque',
    label: 'Azizul Haque al-Umari',
    authorName: 'Maulana Azizul Haque al-Umari',
    languageCode: 'hi',
    source: 'quran.com',
    sourceId: 122,
  },
  {
    id: 'bubenheim',
    label: 'Bubenheim & Elyas',
    authorName: 'Frank Bubenheim and Nadeem Elyas',
    languageCode: 'de',
    source: 'quran.com',
    sourceId: 27,
  },
];

export const DEFAULT_TRANSLATION_IDS = ['saheeh-international'];
