import { buildAdaptiveSession } from './sessionBuilder';
import type { SessionBuilderContext } from './sessionBuilder';
import type { PracticeQueueItem } from './practiceQueueEngine';
import type { WeaknessRanking } from './learningProfileEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { DailyGoal } from './goalEngine';

const BASE_DATE = '2026-01-01T00:00:00.000Z';

function dailyGoal(overrides: Partial<DailyGoal> = {}): DailyGoal {
  return { targetAyahs: 7, targetMinutes: 10, targetReviewCount: 0, ...overrides };
}

function context(overrides: Partial<SessionBuilderContext> = {}): SessionBuilderContext {
  return {
    practiceQueue: [],
    weaknesses: [],
    dueReviews: [],
    dailyGoal: dailyGoal(),
    availableMinutes: 30,
    ...overrides,
  };
}

function reviewEntry(overrides: Partial<ReviewScheduleEntry> = {}): ReviewScheduleEntry {
  return { surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: BASE_DATE, lastReviewedIso: BASE_DATE, lastReviewScore: 40, ...overrides };
}

function queueItem(overrides: Partial<PracticeQueueItem> = {}): PracticeQueueItem {
  return { type: 'ayah', priority: 50, textKey: 'recitationCoach.learning.queue.ayah', ...overrides };
}

function weakness(overrides: Partial<WeaknessRanking> = {}): WeaknessRanking {
  return { category: 'shortens-madd', frequency: 60, severity: 70, score: 42, sessionsAnalyzed: 5, ...overrides };
}

describe('buildAdaptiveSession', () => {
  it('prioritizes due reviews above everything else', () => {
    const built = buildAdaptiveSession(
      context({
        dueReviews: [reviewEntry({ ayahNumber: 3 }), reviewEntry({ ayahNumber: 4 })],
        practiceQueue: [queueItem({ type: 'word' }), queueItem({ type: 'word' }), queueItem({ type: 'word' })],
        weaknesses: [weakness()],
      })
    );
    expect(built.modeConfig.mode).toBe('revision-mode');
    expect(built.modeConfig.ayahNumbers).toEqual([3, 4]);
  });

  it('falls back to weak-words mode when there are enough difficult-word queue items', () => {
    const built = buildAdaptiveSession(
      context({
        practiceQueue: [
          queueItem({ type: 'word', ayahNumber: 3, surahId: 2 }),
          queueItem({ type: 'word', ayahNumber: 4, surahId: 2 }),
          queueItem({ type: 'word', ayahNumber: 4, surahId: 2 }),
        ],
      })
    );
    expect(built.modeConfig.mode).toBe('weak-words');
    expect(built.modeConfig.surahId).toBe(2);
  });

  it('does not choose weak-words mode with too few difficult-word items', () => {
    const built = buildAdaptiveSession(context({ practiceQueue: [queueItem({ type: 'word' })] }));
    expect(built.modeConfig.mode).not.toBe('weak-words');
  });

  it('chooses tajweed-practice targeting Madd when that is the top-ranked weakness', () => {
    const built = buildAdaptiveSession(context({ weaknesses: [weakness({ category: 'shortens-madd' })] }));
    expect(built.modeConfig.mode).toBe('tajweed-practice');
    expect(built.modeConfig.ruleId).toBe('madd');
  });

  it('chooses tajweed-practice targeting Ghunnah when that is the top-ranked weakness', () => {
    const built = buildAdaptiveSession(context({ weaknesses: [weakness({ category: 'ghunnah-mistakes' })] }));
    expect(built.modeConfig.ruleId).toBe('ghunnah');
  });

  it('does not choose tajweed-practice for an unrelated top weakness', () => {
    const built = buildAdaptiveSession(context({ weaknesses: [weakness({ category: 'hesitation-after-mistakes' })] }));
    expect(built.modeConfig.mode).not.toBe('tajweed-practice');
  });

  it('falls back to mistake-review when frequently-missed ayahs remain in the queue', () => {
    const built = buildAdaptiveSession(context({ practiceQueue: [queueItem({ type: 'ayah', ayahNumber: 9, surahId: 3 })] }));
    expect(built.modeConfig.mode).toBe('mistake-review');
    expect(built.modeConfig.ayahNumbers).toEqual([9]);
  });

  it('falls back to full-surah when nothing more specific applies', () => {
    const built = buildAdaptiveSession(context());
    expect(built.modeConfig.mode).toBe('full-surah');
  });

  it('never estimates more minutes than the reciter has available', () => {
    const built = buildAdaptiveSession(
      context({ dueReviews: Array.from({ length: 20 }, (_, i) => reviewEntry({ ayahNumber: i })), availableMinutes: 10 })
    );
    expect(built.estimatedMinutes).toBeLessThanOrEqual(10);
  });

  it('always estimates at least the configured minimum session length', () => {
    const built = buildAdaptiveSession(context({ availableMinutes: 60, dailyGoal: dailyGoal({ targetMinutes: 1 }) }));
    expect(built.estimatedMinutes).toBeGreaterThanOrEqual(5);
  });
});
