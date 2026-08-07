import { validateStoryCitations } from 'data/kids/storyValidation';

describe('story citation hard validation (Phase 12)', () => {
  it('hard-fails loudly when any chapter is missing a citation', () => {
    const issues = validateStoryCitations();
    expect(issues).toEqual([]);
  });
});