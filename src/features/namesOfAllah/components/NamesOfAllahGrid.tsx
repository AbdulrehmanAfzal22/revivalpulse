import { useState } from 'react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Dialog from 'components/ui/Dialog';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import type { DivineName } from 'types/namesOfAllah.types';
import useTranslation from 'hooks/useTranslation';
import styles from './NamesOfAllahGrid.module.css';

export interface NamesOfAllahGridProps {
  names: DivineName[];
}

export default function NamesOfAllahGrid({ names }: NamesOfAllahGridProps) {
  const [selected, setSelected] = useState<DivineName | null>(null);
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.grid}>
        {names.map((name) => (
          <Card
            key={name.number}
            elevation="raised"
            className={styles.card}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(name)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setSelected(name);
            }}
          >
            <span className={styles.number}>{name.number}</span>
            <Typography variant="h3" as="p" className={styles.arabic} dir="rtl">
              {name.arabic}
            </Typography>
            <Typography variant="body">{name.transliteration}</Typography>
            <Typography variant="caption" muted>
              {name.meaning}
            </Typography>
          </Card>
        ))}
      </div>

      <Dialog isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.transliteration}>
        {selected && (
          <div className={styles.detail}>
            <Typography variant="h1" as="p" className={styles.detailArabic} dir="rtl">
              {selected.arabic}
            </Typography>
            <Typography variant="body" muted>
              {selected.meaning}
            </Typography>
            <Typography variant="body" className={styles.description}>
              {selected.description}
            </Typography>
            <AudioPlayButton
              src={selected.audioUrl}
              size="lg"
              label={t('namesOfAllah.playRecitation', { name: selected.transliteration })}
            />
          </div>
        )}
      </Dialog>
    </>
  );
}
