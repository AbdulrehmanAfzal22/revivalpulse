import {
  playbackStartRealSeconds,
  toDisplayDuration,
  toDisplaySeconds,
  toRealSeconds,
} from './timeline';

describe('normalized timeline (melodic intro offset)', () => {
  it('maps real time to display time by subtracting the intro, clamped at 0', () => {
    expect(toDisplaySeconds(17, 17)).toBe(0);
    expect(toDisplaySeconds(25, 17)).toBe(8);
    expect(toDisplaySeconds(169, 17)).toBe(152);
    expect(toDisplaySeconds(5, 17)).toBe(0);
  });

  it('is a no-op when there is no intro (speech tracks)', () => {
    expect(toDisplaySeconds(0, 0)).toBe(0);
    expect(toDisplaySeconds(42, 0)).toBe(42);
  });

  it('maps display positions back to real seek targets', () => {
    expect(toRealSeconds(0, 17)).toBe(17);
    expect(toRealSeconds(8, 17)).toBe(25);
    expect(toRealSeconds(152, 17)).toBe(169);
  });

  it('display and real conversions round-trip', () => {
    for (const display of [0, 1.5, 60, 152]) {
      expect(toDisplaySeconds(toRealSeconds(display, 17), 17)).toBe(display);
    }
  });

  it('computes the seek-bar maximum as duration minus intro', () => {
    expect(toDisplayDuration(169, 17)).toBe(152);
    expect(toDisplayDuration(303.054, 0)).toBe(303.054);
    expect(toDisplayDuration(10, 20)).toBe(0);
  });

  it('reports the real start position for a fresh pass', () => {
    expect(playbackStartRealSeconds(17)).toBe(17);
    expect(playbackStartRealSeconds(0)).toBe(0);
  });

  it('never yields NaN from non-finite input', () => {
    expect(toDisplaySeconds(Number.NaN, 17)).toBe(0);
    expect(toDisplaySeconds(Number.POSITIVE_INFINITY, 17)).toBe(0);
    expect(toRealSeconds(Number.NaN, 17)).toBe(0);
    expect(toDisplayDuration(Number.NaN, 17)).toBe(0);
    expect(playbackStartRealSeconds(Number.NaN)).toBe(0);
  });
});