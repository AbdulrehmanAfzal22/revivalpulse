import { nameIndexAtTime } from './useTimestampSync';
import type { AllahName } from 'types/immersiveRecitation.types';

const NAMES: AllahName[] = [
  { id: '01', arabic: '', transliteration: '', meaning: '', timestampSeconds: 0 },
  { id: '02', arabic: '', transliteration: '', meaning: '', timestampSeconds: 10 },
  { id: '03', arabic: '', transliteration: '', meaning: '', timestampSeconds: 20 },
  { id: '04', arabic: '', transliteration: '', meaning: '', timestampSeconds: 30 },
];

describe('nameIndexAtTime', () => {
  it('returns 0 before the first boundary and at time 0', () => {
    expect(nameIndexAtTime(0, NAMES)).toBe(0);
    expect(nameIndexAtTime(5, NAMES)).toBe(0);
  });

  it('returns the index of the last name whose timestamp is at-or-before the time', () => {
    expect(nameIndexAtTime(10, NAMES)).toBe(1);
    expect(nameIndexAtTime(19.99, NAMES)).toBe(1);
    expect(nameIndexAtTime(20, NAMES)).toBe(2);
    expect(nameIndexAtTime(50, NAMES)).toBe(3);
  });

  it('handles an empty list without throwing', () => {
    expect(nameIndexAtTime(12, [])).toBe(-1);
  });

  it('stops scanning once timestamps exceed the time (monotonic assumption)', () => {
    expect(nameIndexAtTime(15, NAMES)).toBe(1);
  });

  it('returns -1 while the melodic intro is still playing', () => {
    const withIntro = NAMES.map((n, i) => (i === 0 ? { ...n, timestampSeconds: 8 } : n));
    expect(nameIndexAtTime(0, withIntro, 8)).toBe(-1);
    expect(nameIndexAtTime(7.99, withIntro, 8)).toBe(-1);
    expect(nameIndexAtTime(8, withIntro, 8)).toBe(0);
    expect(nameIndexAtTime(10, withIntro, 8)).toBe(1);
  });

  it('holds the last name through the outro (array exhausted → last index)', () => {
    expect(nameIndexAtTime(1000, NAMES)).toBe(3);
    expect(nameIndexAtTime(299.5, NAMES, 0)).toBe(3);
  });
});
