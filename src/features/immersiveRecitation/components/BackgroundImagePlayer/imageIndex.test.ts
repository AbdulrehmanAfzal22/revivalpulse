import { imageIndexForName } from './BackgroundImagePlayer';

/**
 * Background rotation contract:
 *   Math.floor(currentNameIndex / 10) % 8
 * Every 10 names the image advances; names 80-98 wrap back to images 1 and 2.
 * The Bismillah/idle index (-1) must resolve to the first image.
 */
describe('imageIndexForName (background rotation)', () => {
  it('maps the idling Bismillah index (-1) to the first image', () => {
    expect(imageIndexForName(-1)).toBe(0);
  });

  it('advances one image every 10 names', () => {
    expect(imageIndexForName(0)).toBe(0); // names 1-10
    expect(imageIndexForName(9)).toBe(0);
    expect(imageIndexForName(10)).toBe(1); // names 11-20
    expect(imageIndexForName(19)).toBe(1);
    expect(imageIndexForName(70)).toBe(7); // names 71-80
    expect(imageIndexForName(79)).toBe(7);
  });

  it('wraps back to images 1 and 2 for names 81-99', () => {
    expect(imageIndexForName(80)).toBe(0); // name 81 -> image 1
    expect(imageIndexForName(89)).toBe(0);
    expect(imageIndexForName(90)).toBe(1); // name 91 -> image 2
    expect(imageIndexForName(98)).toBe(1);
  });

  it('covers all 8 images exactly once across the first 80 names', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 80; i += 1) seen.add(imageIndexForName(i));
    expect(seen.size).toBe(8);
  });
});