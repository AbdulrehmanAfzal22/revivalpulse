import { CAUSE_EFFECT_SCENARIOS } from './causeEffect';
import { DUA_MOMENT_ITEMS } from './duaMoment';
import { KIDS_STUDY_WORDS, KIDS_STUDY_LETTERS, KIDS_STUDY_NUMBERS } from './gameContent';
import { getWuduSteps, WUDU_STEPS_EASY, WUDU_STEPS_FULL } from './wuduSteps';
import { PROPHET_TIMELINE, getProphetTimelineItems } from './prophetTimeline';

describe('Cause & Effect pool', () => {
  it('has 100+ scenarios', () => {
    expect(CAUSE_EFFECT_SCENARIOS.length).toBeGreaterThanOrEqual(100);
  });

  it('all scenario ids are unique', () => {
    const ids = CAUSE_EFFECT_SCENARIOS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every scenario has exactly one correct option', () => {
    for (const scenario of CAUSE_EFFECT_SCENARIOS) {
      const correctCount = (scenario.options || []).filter(o => o.isCorrect).length;
      expect(correctCount).toBe(1);
    }
  });

  it('every option has an explanation', () => {
    for (const scenario of CAUSE_EFFECT_SCENARIOS) {
      for (const option of (scenario.options || [])) {
        expect(typeof option.explanation?.en).toBe('string');
      }
    }
  });
});

describe('Dua for the Moment pool', () => {
  it('has 100+ items', () => {
    expect(DUA_MOMENT_ITEMS.length).toBeGreaterThanOrEqual(100);
  });

  it('all item ids are unique', () => {
    const ids = DUA_MOMENT_ITEMS.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all Arabic texts are unique', () => {
    const arabics = DUA_MOMENT_ITEMS.map(i => i.dua.arabic);
    expect(new Set(arabics).size).toBe(arabics.length);
  });

  it('every item has a source', () => {
    for (const item of DUA_MOMENT_ITEMS) {
      expect(item.source).toBeDefined();
      expect(item.source.type).toBeDefined();
      expect(item.source.reference).toBeDefined();
    }
  });
});

describe('Word Finder pool', () => {
  it('has 100+ words', () => {
    expect(KIDS_STUDY_WORDS.length).toBeGreaterThanOrEqual(100);
  });

  it('all word ids are unique', () => {
    const ids = KIDS_STUDY_WORDS.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Letter Study pool', () => {
  it('has exactly 28 letters', () => {
    expect(KIDS_STUDY_LETTERS.length).toBe(28);
  });

  it('all letter ids are unique', () => {
    const ids = KIDS_STUDY_LETTERS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('letters are ordered 1–28', () => {
    for (let i = 0; i < KIDS_STUDY_LETTERS.length; i += 1) {
      expect(KIDS_STUDY_LETTERS[i]!.order).toBe(i + 1);
    }
  });
});

describe('Number Study pool', () => {
  it('has 20 numbers', () => {
    expect(KIDS_STUDY_NUMBERS.length).toBe(20);
  });

  it('all number ids are unique', () => {
    const ids = KIDS_STUDY_NUMBERS.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('numbers are ordered 1–20', () => {
    for (let i = 0; i < KIDS_STUDY_NUMBERS.length; i += 1) {
      expect(KIDS_STUDY_NUMBERS[i]!.order).toBe(i + 1);
    }
  });
});

describe('Wudu Steps', () => {
  it('full set has increasing orders from 1', () => {
    for (let i = 0; i < WUDU_STEPS_FULL.length; i += 1) {
      expect(WUDU_STEPS_FULL[i]!.order).toBe(i + 1);
    }
  });

  it('easy subset has strictly increasing order', () => {
    const easy = getWuduSteps('easy');
    for (let i = 0; i < easy.length - 1; i += 1) {
      expect(easy[i]!.order).toBeLessThan(easy[i + 1]!.order);
    }
  });

  it('easy subset is a subset of the full wudu sequence', () => {
    const fullIds = new Set(WUDU_STEPS_FULL.map(s => s.id));
    const easy = getWuduSteps('easy');
    for (const step of easy) {
      expect(fullIds).toContain(step.id);
    }
  });
});

describe('Prophet Timeline', () => {
  it('all prophet ids are unique', () => {
    const ids = PROPHET_TIMELINE.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prophets are in strict order 1–24', () => {
    for (let i = 0; i < PROPHET_TIMELINE.length; i += 1) {
      expect(PROPHET_TIMELINE[i]!.order).toBe(i + 1);
    }
  });

  it('getProphetTimelineItems returns items in correct relative order', () => {
    for (const count of [5, 10, 15, 20]) {
      const subset = getProphetTimelineItems(count);
      const ids = subset.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (let i = 0; i < subset.length - 1; i += 1) {
        expect(subset[i]!.order).toBeLessThan(subset[i + 1]!.order);
      }
    }
  });
});