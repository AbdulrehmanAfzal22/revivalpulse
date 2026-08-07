import type { KidsStoryV2 } from 'types/kidsStories.types';
import { STORY_ADAM } from './adam';

/**
 * Registry of chapter-based (KidsStoryV2) stories. Every new Prophet/Sahabi
 * that is migrated to the chapter model gets added here — Adam is the Phase 3
 * reference implementation the rest copy.
 */
export const KIDS_STORIES_V2: KidsStoryV2[] = [STORY_ADAM];

export function getKidsStoryV2(storyId: string): KidsStoryV2 | undefined {
  return KIDS_STORIES_V2.find((story) => story.id === storyId);
}
