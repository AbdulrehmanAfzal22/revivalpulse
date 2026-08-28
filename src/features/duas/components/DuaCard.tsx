import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import type { DuaItem } from 'types/duas.types';
import type { ReactNode } from 'react';
import { useState } from 'react';
import useTranslation from 'hooks/useTranslation';
import styles from './DuaCard.module.css';

export interface DuaCardProps {
  dua: DuaItem;
  headerAction?: ReactNode;
  playbackRate?: number;
  arabicSize?: number;
  translationSize?: number;
}

export default function DuaCard({ dua, headerAction, playbackRate, arabicSize, translationSize }: DuaCardProps) {
  const { t } = useTranslation();
  const [audioError, setAudioError] = useState('');

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.header}>
        <Typography variant="h4" as="h3" className={styles.title}>
          {dua.title}
        </Typography>
        <div className={styles.headerActions}>
          {headerAction}
          {dua.audioUrl && (
            <AudioPlayButton
              src={dua.audioUrl}
              size="sm"
              label={t('duas.playRecitation', { title: dua.title })}
              startOffsetSeconds={dua.startOffsetSeconds}
              debugLabel={dua.title}
              playbackRate={playbackRate}
              onAudioError={setAudioError}
            />
          )}
        </div>
      </div>
      {audioError && <Typography variant="caption" role="alert" className={styles.audioError}>{audioError}</Typography>}
      <Typography variant="h3" as="p" className={styles.arabic} dir="rtl" style={arabicSize ? { fontSize: `${arabicSize}px` } : undefined}>
        {dua.arabic}
      </Typography>
      <Typography variant="body" className={styles.translation} style={translationSize ? { fontSize: `${translationSize}px` } : undefined}>{dua.translation}</Typography>
      {dua.source && (
        <Typography variant="caption" muted>
          {dua.source}
        </Typography>
      )}
    </Card>
  );
}
