import { validateReciterShape } from 'config/recitationConfig';
import type { ReciterShape } from 'config/recitationConfig';
import type { TimestampEntry } from 'types/immersiveRecitation.types';

const TIMESTAMPS: TimestampEntry[] = [
  { id: '01', timestampSeconds: 0 },
  { id: '02', timestampSeconds: 10 },
  { id: '03', timestampSeconds: 20 },
];

function shape(overrides: Partial<ReciterShape>): ReciterShape {
  return {
    style: 'recitation',
    introSeconds: 0,
    outroSeconds: 0,
    durationSeconds: 30,
    timestamps: TIMESTAMPS,
    ...overrides,
  };
}

/**
 * Phase 2 — melodic-track schema guard. The fields are ADDITIVE to the speech
 * path: `style: 'recitation'` with 0/0 bookends (the current concatenation)
 * must always validate clean, while nasheed tracks get intro/outro rules.
 */
describe('validateReciterShape (Phase 2 melodic schema)', () => {
  it('accepts the current speech reciter (recitation, 0 bookends)', () => {
    expect(validateReciterShape(shape({}))).toEqual([]);
  });

  it('accepts a valid nasheed with intro/outro and names clear of the bookends', () => {
    expect(
      validateReciterShape(
        shape({
          style: 'nasheed',
          introSeconds: 12,
          outroSeconds: 8,
          durationSeconds: 40,
          timestamps: [
            { id: '01', timestampSeconds: 13 },
            { id: '02', timestampSeconds: 25 },
            { id: '03', timestampSeconds: 31 },
          ],
        }),
      ),
    ).toEqual([]);
  });

  it('rejects an unknown style', () => {
    const problems = validateReciterShape(shape({ style: 'duet' as ReciterShape['style'] }));
    expect(problems.join('\n')).toContain('nasheed');
    expect(problems.join('\n')).toContain('duet');
  });

  it('rejects negative or non-finite bookends', () => {
    expect(validateReciterShape(shape({ introSeconds: -1 })).join('\n')).toContain('non-negative');
    expect(validateReciterShape(shape({ outroSeconds: Number.NaN })).join('\n')).toContain('non-negative');
  });

  it('rejects bookends that swallow the whole track', () => {
    const problems = validateReciterShape(shape({ introSeconds: 20, outroSeconds: 15, durationSeconds: 30 }));
    expect(problems.join('\n')).toContain('shorter than the full duration');
  });

  it('rejects a nasheed whose first name starts inside the intro', () => {
    const problems = validateReciterShape(
      shape({ style: 'nasheed', introSeconds: 12, outroSeconds: 8, durationSeconds: 40 }),
    );
    expect(problems.join('\n')).toContain('inside the intro');
  });

  it('rejects a nasheed whose last name starts inside the outro', () => {
    const problems = validateReciterShape(
      shape({
        style: 'nasheed',
        introSeconds: 12,
        outroSeconds: 8,
        durationSeconds: 40,
        timestamps: [
          { id: '01', timestampSeconds: 13 },
          { id: '02', timestampSeconds: 25 },
          { id: '03', timestampSeconds: 33 },
        ],
      }),
    );
    expect(problems.join('\n')).toContain('outro');
  });

  it('rejects a non-finite durationSeconds', () => {
    expect(validateReciterShape(shape({ durationSeconds: Number.POSITIVE_INFINITY })).join('\n')).toContain(
      'finite positive',
    );
  });

  it('accepts loop omitted or set to a boolean', () => {
    expect(validateReciterShape(shape({})).filter((p) => p.includes('loop'))).toEqual([]);
    expect(validateReciterShape(shape({ loop: false }))).toEqual([]);
    expect(validateReciterShape(shape({ loop: true }))).toEqual([]);
  });

  it('rejects a non-boolean loop value', () => {
    const problems = validateReciterShape(shape({ loop: 'yes' as unknown as boolean }));
    expect(problems.join('\n')).toContain('loop must be a boolean');
  });
});
