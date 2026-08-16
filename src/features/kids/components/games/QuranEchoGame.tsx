import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import useTranslation from 'hooks/useTranslation';
import styles from './QuranEchoGame.module.css';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';

export default function QuranEchoGame({ difficulty, tier }: { difficulty?: PlayDifficulty; tier?: 'easy' | 'medium' | 'hard' }) {
  const { t } = useTranslation();
  const [matched, setMatched] = useState<string[]>([]);

  const handleSelect = (ayah: string) => {
    setMatched(prev => {
      const next = [...prev, ayah];
      if (next.length >= 3) {
        const allSame = next.every((a, i) => a === next[0]);
        if (allSame) {
          setMatched([]);
          return [];
        }
      }
      return next;
    });
  };

  return (
    <MiniGameShell
      gameId="quran-echo"
      title={t('kids.gameQuranEcho')}
      won={matched.length > 0}
      onRestart={() => setMatched([])}
    >
      <div className={styles.container}>
        <p>{t('kids.gameQuranEchoDesc')}</p>
        <div className={styles.grid}>
          {/* Game board - ayah cards would go here */}
          {['ayah1', 'ayah2', 'ayah3'].map((key) => (
            <div
              key={key}
              className={styles.card}
              onClick={() => handleSelect(key)}
              aria-label={t('kids.gameQuranEcho')}
            >
              {key}
            </div>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}