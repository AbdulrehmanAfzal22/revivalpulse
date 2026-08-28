import { useEffect, useRef, useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import useTranslation from 'hooks/useTranslation';
import Dialog from './Dialog';
import Button from './Button';
import styles from './ShareTextCard.module.css';

export interface ShareTextCardProps {
  isOpen: boolean;
  onClose: () => void;
  arabicText: string;
  secondaryText: string;
  citation: string;
  fileNameBase: string;
}

const CARD_WIDTH = 1080;
const CARD_PADDING = 100;
const MAX_CARD_HEIGHT = 1800;
const MIN_FONT_SCALE = 0.55;
const FOOTER_HEIGHT = 120;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    let remaining = word;
    while (remaining) {
      const testLine = currentLine ? `${currentLine} ${remaining}` : remaining;
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
        remaining = '';
      } else if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        let splitAt = remaining.length;
        while (splitAt > 1 && ctx.measureText(remaining.slice(0, splitAt)).width > maxWidth) splitAt -= 1;
        lines.push(remaining.slice(0, splitAt));
        remaining = remaining.slice(splitAt);
      }
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

interface CardLayout {
  arabicLines: string[];
  englishLines: string[];
  arabicFontSize: number;
  englishFontSize: number;
  arabicLineHeight: number;
  englishLineHeight: number;
  height: number;
  truncated: boolean;
}

function measureLayout(ctx: CanvasRenderingContext2D, arabicText: string, secondaryText: string, scale: number): CardLayout {
  const arabicFontSize = Math.round(48 * scale);
  const englishFontSize = Math.round(30 * scale);
  const arabicLineHeight = Math.round(72 * scale);
  const englishLineHeight = Math.round(42 * scale);
  ctx.direction = 'rtl';
  ctx.font = `600 ${arabicFontSize}px "Reader Uthmani", serif`;
  const arabicLines = wrapText(ctx, arabicText, CARD_WIDTH - CARD_PADDING * 2);
  ctx.direction = 'ltr';
  ctx.font = `400 ${englishFontSize}px sans-serif`;
  const englishLines = wrapText(ctx, secondaryText, CARD_WIDTH - CARD_PADDING * 2);
  const height = CARD_PADDING + arabicLines.length * arabicLineHeight + 40 + englishLines.length * englishLineHeight + FOOTER_HEIGHT + CARD_PADDING;
  return { arabicLines, englishLines, arabicFontSize, englishFontSize, arabicLineHeight, englishLineHeight, height, truncated: false };
}

export function buildShareCardLayout(ctx: CanvasRenderingContext2D, arabicText: string, secondaryText: string): CardLayout {
  for (let scale = 1; scale >= MIN_FONT_SCALE; scale -= 0.05) {
    const layout = measureLayout(ctx, arabicText, secondaryText, scale);
    if (layout.height <= MAX_CARD_HEIGHT) return layout;
  }
  return measureLayout(ctx, arabicText, secondaryText, MIN_FONT_SCALE);
}

function drawCard(canvas: HTMLCanvasElement, arabicText: string, secondaryText: string, citation: string): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CARD_WIDTH;

  const layout = buildShareCardLayout(ctx, arabicText, secondaryText);
  const { arabicLines, englishLines: secondaryLines, arabicLineHeight, englishLineHeight, arabicFontSize, englishFontSize } = layout;
  const cardHeight = layout.height;
  canvas.height = cardHeight;

  const gradient = ctx.createLinearGradient(0, 0, 0, cardHeight);
  gradient.addColorStop(0, '#0f7a5c');
  gradient.addColorStop(1, '#0a4f3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, cardHeight);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.direction = 'rtl';
  ctx.font = `600 ${arabicFontSize}px "Reader Uthmani", serif`;
  let y = CARD_PADDING + 52;
  arabicLines.forEach((line) => {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += arabicLineHeight;
  });

  ctx.direction = 'ltr';
  ctx.font = `400 ${englishFontSize}px sans-serif`;
  y += 40;
  secondaryLines.forEach((line) => {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += englishLineHeight;
  });

  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(citation, CARD_WIDTH / 2, cardHeight - 92);
  ctx.font = '400 24px sans-serif';
  ctx.fillText('Read full hadith in the app', CARD_WIDTH / 2, cardHeight - 57);
  ctx.textAlign = 'right';
  ctx.font = '600 22px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
  ctx.fillText('RevivalPulse', CARD_WIDTH - CARD_PADDING, cardHeight - 22);
}

export default function ShareTextCard({
  isOpen,
  onClose,
  arabicText,
  secondaryText,
  citation,
  fileNameBase,
}: ShareTextCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsReady(false);
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      drawCard(canvas, arabicText, secondaryText, citation);
      setIsReady(true);
    });
    return () => { cancelled = true; };
  }, [isOpen, arabicText, secondaryText, citation]);

  const getBlob = (): Promise<Blob | null> => new Promise((resolve) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });

  const handleDownload = async (): Promise<void> => {
    const blob = await getBlob();
    if (!blob || !isReady) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNameBase}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (): Promise<void> => {
    const blob = await getBlob();
    if (!blob || !isReady) return;
    const file = new File([blob], `${fileNameBase}.png`, { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: citation });
    } else {
      await handleDownload();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('common.share')} panelClassName={styles.sharePanel} contentClassName={styles.dialogContent}>
      {!isReady && <div className={styles.loading} role="status">Preparing image...</div>}
      <div className={styles.previewViewport}>
        <canvas ref={canvasRef} className={[styles.canvas, !isReady && styles.canvasHidden].filter(Boolean).join(' ')} />
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" disabled={!isReady} onClick={() => void handleDownload()} leadingIcon={<Download size={16} />}>
          {t('common.download')}
        </Button>
        <Button variant="primary" disabled={!isReady} onClick={() => void handleShare()} leadingIcon={<Share2 size={16} />}>
          {t('common.share')}
        </Button>
      </div>
    </Dialog>
  );
}
