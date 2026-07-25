import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import type { DuaItem } from 'types/duas.types';
import useTranslation from 'hooks/useTranslation';
import styles from './DuaCard.module.css';

export interface DuaCardProps {
  dua: DuaItem;
}

export default function DuaCard({ dua }: DuaCardProps) {
  const { t } = useTranslation();

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.header}>
        <Typography variant="h4" as="h3" className={styles.title}>
          {dua.title}
        </Typography>
        {dua.audioUrl && (
          <AudioPlayButton src={dua.audioUrl} size="sm" label={t('duas.playRecitation', { title: dua.title })} />
        )}
      </div>
      <Typography variant="h3" as="p" className={styles.arabic} dir="rtl">
        {dua.arabic}
      </Typography>
      <Typography variant="body">{dua.translation}</Typography>
      {dua.source && (
        <Typography variant="caption" muted>
          {dua.source}
        </Typography>
      )}
    </Card>
  );
}
