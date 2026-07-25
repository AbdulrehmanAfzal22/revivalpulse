import { useEffect, useRef } from 'react';
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
const CARD_HEIGHT = 1080;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawCard(canvas: HTMLCanvasElement, arabicText: string, secondaryText: string, citation: string): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const gradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  gradient.addColorStop(0, '#0f7a5c');
  gradient.addColorStop(1, '#0a4f3c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  ctx.direction = 'rtl';
  ctx.font = '600 48px "Reader Uthmani", serif';
  const arabicLines = wrapText(ctx, arabicText, CARD_WIDTH - 160).slice(0, 8);
  let y = CARD_HEIGHT / 2 - (arabicLines.length * 62) / 2 - 40;
  arabicLines.forEach((line) => {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += 72;
  });

  ctx.direction = 'ltr';
  ctx.font = '400 30px sans-serif';
  const secondaryLines = wrapText(ctx, secondaryText, CARD_WIDTH - 200).slice(0, 6);
  y += 40;
  secondaryLines.forEach((line) => {
    ctx.fillText(line, CARD_WIDTH / 2, y);
    y += 42;
  });

  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(citation, CARD_WIDTH / 2, CARD_HEIGHT - 80);
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
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    void document.fonts.ready.then(() => drawCard(canvas, arabicText, secondaryText, citation));
  }, [isOpen, arabicText, secondaryText, citation]);

  const getBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => canvasRef.current?.toBlob((blob) => resolve(blob), 'image/png'));

  const handleDownload = async (): Promise<void> => {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNameBase}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (): Promise<void> => {
    const blob = await getBlob();
    if (!blob) return;
    const file = new File([blob], `${fileNameBase}.png`, { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: citation });
    } else {
      await handleDownload();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('common.share')}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => void handleDownload()} leadingIcon={<Download size={16} />}>
          {t('common.download')}
        </Button>
        <Button variant="primary" onClick={() => void handleShare()} leadingIcon={<Share2 size={16} />}>
          {t('common.share')}
        </Button>
      </div>
    </Dialog>
  );
}
