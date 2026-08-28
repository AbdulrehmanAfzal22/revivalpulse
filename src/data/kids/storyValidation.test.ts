import { validateStoryCitations } from 'data/kids/storyValidation';
import { KIDS_STORIES_V2 } from 'data/kids/storiesV2';
import { KIDS_SAHABI_V2 } from 'data/kids/sahabiV2';

describe('story citation hard validation (Phase 12)', () => {
  it('hard-fails loudly when any chapter is missing a citation', () => {
    const issues = validateStoryCitations();
    expect(issues).toEqual([]);
  });

  it('keeps every Prophet and Companion story at five chapters or more', () => {
    [...KIDS_STORIES_V2, ...KIDS_SAHABI_V2].forEach((story) => {
      expect(story.chapters.length).toBeGreaterThanOrEqual(5);
    });
  });

  it('keeps every chapter rich and lesson-led', () => {
    const issues = validateStoryCitations().filter((issue) => issue.message.includes('80 and 150') || issue.message.includes('bilingual highlighted'));
    expect(issues).toEqual([]);
  });
});