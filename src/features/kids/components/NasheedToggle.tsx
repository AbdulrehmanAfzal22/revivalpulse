import { Music } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Switch from 'components/ui/Switch';
import { useKidsPreferencesStore } from 'stores/kidsPreferencesStore';
import useTranslation from 'hooks/useTranslation';
import styles from './NasheedToggle.module.css';

/**
 * Off by default and stays off — this build ships no nasheed audio at all.
 * Turning the switch on doesn't unlock or download anything; it's here so
 * the setting exists and is honestly explained rather than silently
 * missing, per the Phase 14 brief ("clearly gated on licensing").
 */
export default function NasheedToggle() {
  const nasheedsEnabled = useKidsPreferencesStore((state) => state.nasheedsEnabled);
  const setNasheedsEnabled = useKidsPreferencesStore((state) => state.setNasheedsEnabled);
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <div className={styles.row}>
        <Music size={18} />
        <div className={styles.text}>
          <Typography variant="body">{t('kids.nasheeds')}</Typography>
          <Typography variant="caption" muted>
            {t('kids.nasheedsDescription')}
          </Typography>
        </div>
        <Switch checked={nasheedsEnabled} onChange={setNasheedsEnabled} label={t('kids.nasheeds')} />
      </div>
    </Card>
  );
}
