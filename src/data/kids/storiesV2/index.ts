import type { KidsStoryV2 } from 'types/kidsStories.types';
import { STORY_ADAM } from './adam';
import { STORY_ALYASA } from './alyasa';
import { STORY_AYYUB } from './ayyub';
import { STORY_DAWUD } from './dawud';
import { STORY_DHUL_KIFL } from './dhul-kifl';
import { STORY_HARUN } from './harun';
import { STORY_HUD } from './hud';
import { STORY_IBRAHIM } from './ibrahim';
import { STORY_IDRIS } from './idris';
import { STORY_ILYAS } from './ilyas';
import { STORY_ISA } from './isa';
import { STORY_ISHAQ } from './ishaq';
import { STORY_ISMAIL } from './ismail';
import { STORY_LUT } from './lut';
import { STORY_MUHAMMAD } from './muhammad';
import { STORY_MUSA } from './musa';
import { STORY_NUH } from './nuh';
import { STORY_SALIH } from './salih';
import { STORY_SHUAYB } from './shuayb';
import { STORY_SULAYMAN } from './sulayman';
import { STORY_YAHYA } from './yahya';
import { STORY_YAQUB } from './yaqub';
import { STORY_YUNUS } from './yunus';
import { STORY_YUSUF } from './yusuf';
import { STORY_ZAKARIYYA } from './zakariyya';

/**
 * Registry of chapter-based (KidsStoryV2) stories — every Prophet is now
 * migrated to the chapter model. Adam was the Phase 3 reference
 * implementation; the rest follow the same shape.
 */
export const KIDS_STORIES_V2: KidsStoryV2[] = [
  STORY_ADAM,
  STORY_IDRIS,
  STORY_NUH,
  STORY_HUD,
  STORY_SALIH,
  STORY_IBRAHIM,
  STORY_LUT,
  STORY_ISMAIL,
  STORY_ISHAQ,
  STORY_YAQUB,
  STORY_YUSUF,
  STORY_AYYUB,
  STORY_SHUAYB,
  STORY_MUSA,
  STORY_HARUN,
  STORY_DAWUD,
  STORY_SULAYMAN,
  STORY_ILYAS,
  STORY_ALYASA,
  STORY_YUNUS,
  STORY_DHUL_KIFL,
  STORY_ZAKARIYYA,
  STORY_YAHYA,
  STORY_ISA,
  STORY_MUHAMMAD,
];

export function getKidsStoryV2(storyId: string): KidsStoryV2 | undefined {
  return KIDS_STORIES_V2.find((story) => story.id === storyId);
}