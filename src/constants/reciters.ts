import type { Reciter } from 'types/word.types';

/**
 * 7 reciters are on api.quran.com (word+verse sync via segment timing).
 * The other 5 aren't published there — mp3quran.net has them but only as
 * whole-surah files with no ayah boundaries at all, so everyayah.com's
 * per-ayah files are used instead (verse-level sync, no word-level).
 * Every id/URL below was checked live (200 + real audio) while building this.
 */
export const RECITERS: Reciter[] = [
  { id: 'alafasy', name: 'Mishary Alafasy', style: null, source: 'quran.com', recitationId: 7, supportsWordSync: true },
  { id: 'abdul-basit', name: 'Abdul Basit', style: 'Murattal', source: 'quran.com', recitationId: 2, supportsWordSync: true },
  {
    id: 'maher-muaiqly',
    name: 'Maher Al Muaiqly',
    style: null,
    source: 'everyayah.com',
    folderName: 'Maher_AlMuaiqly_64kbps',
    supportsWordSync: false,
  },
  {
    id: 'yasser-dossari',
    name: 'Yasser Al Dossari',
    style: null,
    source: 'everyayah.com',
    folderName: 'Yasser_Ad-Dussary_128kbps',
    supportsWordSync: false,
  },
  { id: 'sudais', name: 'Sudais', style: null, source: 'quran.com', recitationId: 3, supportsWordSync: true },
  { id: 'shuraim', name: 'Shuraim', style: null, source: 'quran.com', recitationId: 10, supportsWordSync: true },
  {
    id: 'saad-ghamdi',
    name: 'Saad Al Ghamdi',
    style: null,
    source: 'everyayah.com',
    folderName: 'Ghamadi_40kbps',
    supportsWordSync: false,
  },
  { id: 'minshawi', name: 'Minshawi', style: 'Murattal', source: 'quran.com', recitationId: 9, supportsWordSync: true },
  {
    id: 'hudhaify',
    name: 'Hudhaify',
    style: null,
    source: 'everyayah.com',
    folderName: 'Hudhaify_128kbps',
    supportsWordSync: false,
  },
  {
    id: 'abu-bakr-shatri',
    name: 'Abu Bakr Al Shatri',
    style: null,
    source: 'quran.com',
    recitationId: 4,
    supportsWordSync: true,
  },
  {
    id: 'ali-jaber',
    name: 'Ali Jaber',
    style: null,
    source: 'everyayah.com',
    folderName: 'Ali_Jaber_64kbps',
    supportsWordSync: false,
  },
  { id: 'husary', name: 'Khalil Al Husary', style: null, source: 'quran.com', recitationId: 6, supportsWordSync: true },
];

export const DEFAULT_RECITER_ID = 'alafasy';

export function getReciterById(id: string): Reciter | undefined {
  return RECITERS.find((reciter) => reciter.id === id);
}
