import type { KidsStoryV2 } from 'types/kidsStories.types';
import { SAHABI_ABU_BAKR } from './abu-bakr';
import { SAHABI_ALI } from './ali';
import { SAHABI_BILAL } from './bilal';
import { SAHABI_KHADIJAH } from './khadijah';
import { SAHABI_KHALID } from './khalid';
import { SAHABI_UMAR } from './umar';
import { SAHABI_UTHMAN } from './uthman';

/**
 * Registry of chapter-based Sahabi biographies (Phase 7/8). A Sahabi uses the
 * exact same KidsStoryV2 schema as a Prophet story — only `type` differs.
 * Batch 1: Abu Bakr, Umar, Uthman, Ali + Khadijah, Bilal, Khalid.
 */
export const KIDS_SAHABI_V2: KidsStoryV2[] = [
  SAHABI_ABU_BAKR,
  SAHABI_UMAR,
  SAHABI_UTHMAN,
  SAHABI_ALI,
  SAHABI_KHADIJAH,
  SAHABI_BILAL,
  SAHABI_KHALID,
];

export function getSahabiV2(sahabiId: string): KidsStoryV2 | undefined {
  return KIDS_SAHABI_V2.find((sahabi) => sahabi.id === sahabiId);
}