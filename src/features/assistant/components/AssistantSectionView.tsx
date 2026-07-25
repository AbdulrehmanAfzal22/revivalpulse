import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import type { AssistantSection } from 'types/assistant.types';
import styles from './AssistantSectionView.module.css';

export interface AssistantSectionViewProps {
  section: AssistantSection;
}

export default function AssistantSectionView({ section }: AssistantSectionViewProps) {
  if (section.kind === 'note') {
    return (
      <Typography variant="body" className={styles.note}>
        {section.text}
      </Typography>
    );
  }

  if (section.kind === 'verse') {
    return (
      <Card elevation="raised" className={styles.card}>
        <Typography variant="caption" muted>
          {section.surahLabel} {section.verseKey}
        </Typography>
        <Typography variant="body" className={styles.arabic} dir="rtl">
          {section.arabic}
        </Typography>
        {section.translations.map((translation) => (
          <div key={translation.label}>
            <Typography variant="caption" muted>
              {translation.label}
            </Typography>
            <Typography variant="body">{translation.text}</Typography>
          </div>
        ))}
      </Card>
    );
  }

  if (section.kind === 'tafsir') {
    return (
      <Card elevation="raised" className={styles.card}>
        <Typography variant="caption" muted>
          Tafsir — {section.authorName} on {section.verseKey}
        </Typography>
        <Typography variant="body">{section.text}</Typography>
      </Card>
    );
  }

  if (section.kind === 'hadith') {
    return (
      <Card elevation="raised" className={styles.card}>
        <Typography variant="caption" muted>
          {section.bookName} #{section.idInBook}
        </Typography>
        <Typography variant="body" className={styles.arabic} dir="rtl">
          {section.arabic}
        </Typography>
        <Typography variant="body">{section.englishText}</Typography>
        {section.narrator && (
          <Typography variant="caption" muted>
            Narrated by {section.narrator}
          </Typography>
        )}
      </Card>
    );
  }

  return (
    <Card elevation="raised" className={styles.card}>
      <Typography variant="caption" muted>
        {section.categoryLabel || 'Dua'}
      </Typography>
      <Typography variant="body">{section.title}</Typography>
      <Typography variant="body" className={styles.arabic} dir="rtl">
        {section.arabic}
      </Typography>
      <Typography variant="body">{section.translation}</Typography>
    </Card>
  );
}
