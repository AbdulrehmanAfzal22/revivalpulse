import type { KidsStudyTopic } from 'data/kids/gameContent';
import type { TranslationKey } from 'i18n';
import useTranslation from 'hooks/useTranslation';
import styles from './StudyTopicChips.module.css';

const TOPIC_KEYS: Record<KidsStudyTopic, TranslationKey> = {
  letters: 'kids.gameTopicLetters',
  numbers: 'kids.gameTopicNumbers',
  words: 'kids.gameTopicWords',
};

export interface StudyTopicChipsProps {
  topic: KidsStudyTopic;
  onChange: (next: KidsStudyTopic) => void;
}

/** Letters / Numbers / Words selector shared by all study games. */
export default function StudyTopicChips({ topic, onChange }: StudyTopicChipsProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.topicRow} role="group" aria-label={t('kids.gameTopicLabel')}>
      {(Object.keys(TOPIC_KEYS) as KidsStudyTopic[]).map((key) => (
        <button
          key={key}
          type="button"
          className={[styles.topicChip, topic === key && styles.topicChipActive]
            .filter(Boolean)
            .join(' ')}
          aria-pressed={topic === key}
          onClick={() => onChange(key)}
        >
          {t(TOPIC_KEYS[key])}
        </button>
      ))}
    </div>
  );
}