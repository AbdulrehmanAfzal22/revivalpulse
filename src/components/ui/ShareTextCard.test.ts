import { buildShareCardLayout } from './ShareTextCard';

function canvasContext(): CanvasRenderingContext2D {
  return {
    direction: 'ltr',
    font: '',
    measureText: (text: string) => ({ width: text.length * 10 } as TextMetrics),
  } as CanvasRenderingContext2D;
}

describe('share image card layout', () => {
  it('contains a long hadith without exceeding the card width or height', () => {
    const longHadith = Array.from({ length: 140 }, (_, index) => `hadith${index}`).join(' ');
    const layout = buildShareCardLayout(canvasContext(), longHadith, longHadith);

    expect(layout.height).toBeLessThanOrEqual(1800);
    expect(layout.arabicLines.every((line) => line.length * 10 <= 880)).toBe(true);
    expect(layout.englishLines.every((line) => line.length * 10 <= 880)).toBe(true);
  });

  it('keeps all long hadith content in the full-size export layout', () => {
    const extremeHadith = Array.from({ length: 2000 }, (_, index) => `word${index}`).join(' ');
    const layout = buildShareCardLayout(canvasContext(), extremeHadith, extremeHadith);

    expect(layout.truncated).toBe(false);
    expect(layout.height).toBeGreaterThan(1800);
    expect(layout.arabicLines.at(-1)).toContain('word1999');
    expect(layout.englishLines.at(-1)).toContain('word1999');
  });
});