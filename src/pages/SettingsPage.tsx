import { Bell, BellOff } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import PillGroup from 'components/ui/PillGroup';
import Slider from 'components/ui/Slider';
import Switch from 'components/ui/Switch';
import useTheme from 'hooks/useTheme';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useReadingPreferences from 'hooks/useReadingPreferences';
import useNotificationPermission from 'features/notifications/hooks/useNotificationPermission';
import useTranslation from 'hooks/useTranslation';
import { useNotificationPreferencesStore } from 'stores/notificationPreferencesStore';
import { TEXT_SCALE_STEPS, useAccessibilityPreferencesStore } from 'stores/accessibilityPreferencesStore';
import { TRANSLATIONS } from 'constants/translations';
import { RECITERS } from 'constants/reciters';
import { ARABIC_FONTS } from 'constants/fonts';
import { WORD_PLAYBACK_SPEED_BOUNDS } from 'constants/wordAudio';
import { PRAYERS } from 'constants/prayerNames';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { interfaceLanguage, languages, setInterfaceLanguage } = useInterfaceLanguage();
  const { t } = useTranslation();
  const { preferences, update } = useReadingPreferences();

  const notificationsEnabled = useNotificationPreferencesStore((state) => state.enabled);
  const enabledPrayers = useNotificationPreferencesStore((state) => state.enabledPrayers);
  const setNotificationsEnabled = useNotificationPreferencesStore((state) => state.setEnabled);
  const togglePrayer = useNotificationPreferencesStore((state) => state.togglePrayer);
  const { permission, request } = useNotificationPermission();

  const highContrast = useAccessibilityPreferencesStore((state) => state.highContrast);
  const setHighContrast = useAccessibilityPreferencesStore((state) => state.setHighContrast);
  const textScale = useAccessibilityPreferencesStore((state) => state.textScale);
  const setTextScale = useAccessibilityPreferencesStore((state) => state.setTextScale);

  function toggleTranslation(id: string) {
    const active = preferences.activeTranslationIds;
    const isActive = active.includes(id);
    if (isActive && active.length === 1) return;
    update({ activeTranslationIds: isActive ? active.filter((item) => item !== id) : [...active, id] });
  }

  async function handleNotificationsToggle(checked: boolean) {
    if (checked && permission === 'default') {
      const result = await request();
      setNotificationsEnabled(result === 'granted');
      return;
    }
    setNotificationsEnabled(checked);
  }

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('settings.title')}</Typography>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          {t('settings.appearance')}
        </Typography>
        <Card className={styles.card}>
          <div className={styles.row}>
            <Typography variant="body">{t('settings.theme')}</Typography>
            <PillGroup
              options={[
                { id: 'light', label: t('settings.themeLight') },
                { id: 'dark', label: t('settings.themeDark') },
              ]}
              value={theme}
              onChange={(id) => setTheme(id as 'light' | 'dark')}
            />
          </div>

          <div className={styles.row}>
            <div>
              <Typography variant="body">{t('settings.highContrast')}</Typography>
              <Typography variant="caption" muted>
                {t('settings.highContrastDescription')}
              </Typography>
            </div>
            <Switch checked={highContrast} onChange={setHighContrast} label={t('settings.highContrast')} />
          </div>

          <div className={styles.subsection}>
            <Typography variant="caption" muted>
              {t('settings.textSize')}
            </Typography>
            <PillGroup
              options={TEXT_SCALE_STEPS.map((scale) => ({ id: String(scale), label: `${Math.round(scale * 100)}%` }))}
              value={String(textScale)}
              onChange={(id) => setTextScale(Number(id))}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          {t('settings.interfaceLanguage')}
        </Typography>
        <Card className={styles.card}>
          <Typography variant="caption" muted>
            {t('settings.interfaceLanguageDescription')}
          </Typography>
          <PillGroup
            options={languages.map((option) => ({ id: option.code, label: option.nativeName }))}
            value={interfaceLanguage.code}
            onChange={setInterfaceLanguage}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          {t('settings.quranReading')}
        </Typography>
        <Card className={styles.card}>
          <div className={styles.subsection}>
            <Typography variant="caption" muted>
              {t('settings.translations')}
            </Typography>
            <div className={styles.checkboxList}>
              {TRANSLATIONS.map((translation) => (
                <label key={translation.id} className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={preferences.activeTranslationIds.includes(translation.id)}
                    onChange={() => toggleTranslation(translation.id)}
                  />
                  <span>
                    {translation.label} <Typography variant="caption" muted>({translation.authorName})</Typography>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <Typography variant="caption" muted>
              {t('settings.reciter')}
            </Typography>
            <PillGroup
              options={RECITERS.map((reciter) => ({
                id: reciter.id,
                label: reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name,
              }))}
              value={preferences.selectedReciterId}
              onChange={(id) => update({ selectedReciterId: id })}
            />
          </div>

          <div className={styles.subsection}>
            <Typography variant="caption" muted>
              {t('settings.arabicFont')}
            </Typography>
            <PillGroup
              options={ARABIC_FONTS.map((font) => ({ id: font.id, label: font.label }))}
              value={preferences.arabicFont}
              onChange={(id) => update({ arabicFont: id as typeof preferences.arabicFont })}
            />
          </div>

          <div className={styles.subsection}>
            <Slider
              label={t('settings.wordAudioPlaybackSpeed')}
              value={preferences.wordPlaybackSpeed}
              min={WORD_PLAYBACK_SPEED_BOUNDS.min}
              max={WORD_PLAYBACK_SPEED_BOUNDS.max}
              step={WORD_PLAYBACK_SPEED_BOUNDS.step}
              valueLabel={`${preferences.wordPlaybackSpeed}x`}
              onChange={(value) => update({ wordPlaybackSpeed: value })}
            />
          </div>

          <div className={styles.row}>
            <div>
              <Typography variant="body">{t('settings.autoScroll')}</Typography>
              <Typography variant="caption" muted>
                {t('settings.autoScrollDescription')}
              </Typography>
            </div>
            <Switch
              checked={preferences.autoScrollEnabled}
              onChange={(checked) => update({ autoScrollEnabled: checked })}
              label={t('settings.autoScroll')}
            />
          </div>

          <div className={styles.row}>
            <div>
              <Typography variant="body">{t('settings.wordHighlight')}</Typography>
              <Typography variant="caption" muted>
                {t('settings.wordHighlightDescription')}
              </Typography>
            </div>
            <Switch
              checked={preferences.wordHighlightEnabled}
              onChange={(checked) => update({ wordHighlightEnabled: checked })}
              label={t('settings.wordHighlight')}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          {t('settings.notifications')}
        </Typography>
        <Card className={styles.card}>
          <div className={styles.row}>
            <div className={styles.notificationsLabel}>
              {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              <div>
                <Typography variant="body">{t('settings.prayerTimeNotifications')}</Typography>
                <Typography variant="caption" muted>
                  {permission === 'unsupported'
                    ? t('settings.notificationsUnsupported')
                    : permission === 'denied'
                      ? t('settings.notificationsBlocked')
                      : t('settings.notificationsDescription')}
                </Typography>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onChange={(checked) => void handleNotificationsToggle(checked)}
              label={t('settings.prayerTimeNotifications')}
              disabled={permission === 'unsupported' || permission === 'denied'}
            />
          </div>

          {notificationsEnabled && (
            <div className={styles.subsection}>
              <Typography variant="caption" muted>
                {t('settings.notifyFor')}
              </Typography>
              <div className={styles.checkboxList}>
                {PRAYERS.map((prayer) => (
                  <label key={prayer} className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={enabledPrayers.includes(prayer)}
                      onChange={() => togglePrayer(prayer)}
                    />
                    <span>{prayer}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
