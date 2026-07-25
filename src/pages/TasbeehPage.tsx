import { useEffect } from 'react';
import Typography from 'components/ui/Typography';
import GlobalCounter from 'features/tasbeeh/components/GlobalCounter';
import PersonalCounter from 'features/tasbeeh/components/PersonalCounter';
import { flushTasbeehSync } from 'stores/tasbeehStore';
import useTranslation from 'hooks/useTranslation';
import styles from './TasbeehPage.module.css';

export default function TasbeehPage() {
  useEffect(() => flushTasbeehSync, []);
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('tasbeeh.title')}</Typography>

      <GlobalCounter />
      <PersonalCounter />
    </div>
  );
}
