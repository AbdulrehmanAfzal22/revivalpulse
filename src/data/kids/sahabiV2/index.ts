import type { KidsStoryV2 } from 'types/kidsStories.types';
import { SAHABI_ABU_BAKR } from './abu-bakr';
import { SAHABI_ALI } from './ali';
import { SAHABI_BILAL } from './bilal';
import { SAHABI_KHADIJAH } from './khadijah';
import { SAHABI_KHALID } from './khalid';
import { SAHABI_UMAR } from './umar';
import { SAHABI_UTHMAN } from './uthman';
import { SAHABI_AMMAR } from './ammar';
import { SAHABI_ABU_DHARR } from './abu-dharr';
import { SAHABI_ANAS } from './anas';
import { SAHABI_HAMZA } from './hamza';
import { SAHABI_MUSAB } from './musab';
import { SAHABI_SAD } from './sad';
import { SAHABI_SALMAN } from './salman';
import { SAHABI_ZAYD } from './zayd';

/**
 * Registry of chapter-based Sahabi biographies (Phase 7/8). A Sahabi uses the
 * exact same KidsStoryV2 schema as a Prophet story — only `type` differs.
 * Batch 1: Abu Bakr, Umar, Uthman, Ali + Khadijah, Bilal, Khalid.
 * Batch 2: Ammar, Hamza, Mus'ab, Salman al-Farisi, Abu Dharr, Zayd, Sa'd, Anas.
 */
export const KIDS_SAHABI_V2: KidsStoryV2[] = [
  SAHABI_ABU_BAKR,
  SAHABI_UMAR,
  SAHABI_UTHMAN,
  SAHABI_ALI,
  SAHABI_KHADIJAH,
  SAHABI_BILAL,
  SAHABI_KHALID,
  SAHABI_AMMAR,
  SAHABI_ABU_DHARR,
  SAHABI_ANAS,
  SAHABI_HAMZA,
  SAHABI_MUSAB,
  SAHABI_SAD,
  SAHABI_SALMAN,
  SAHABI_ZAYD,
];

export function getSahabiV2(sahabiId: string): KidsStoryV2 | undefined {
  return KIDS_SAHABI_V2.find((sahabi) => sahabi.id === sahabiId);
}