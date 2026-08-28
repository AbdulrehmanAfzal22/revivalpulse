import ReactMarkdown from 'react-markdown';
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
        <ReactMarkdown>{section.text}</ReactMarkdown>
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
          <ReactMarkdown>{section.arabic}</ReactMarkdown>
        </Typography>
        {section.translations.map((translation) => (
          <div key={translation.label}>
            <Typography variant="caption" muted>
              {translation.label}
            </Typography>
            <Typography variant="body">
              <ReactMarkdown>{translation.text}</ReactMarkdown>
            </Typography>
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
        <Typography variant="body">
          <ReactMarkdown>{section.text}</ReactMarkdown>
        </Typography>
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
          <ReactMarkdown>{section.arabic}</ReactMarkdown>
        </Typography>
        <Typography variant="body">
          <ReactMarkdown>{section.englishText}</ReactMarkdown>
        </Typography>
        {section.narrator && (
          <Typography variant="caption" muted>
            Narrated by {section.narrator}
          </Typography>
        )}
      </Card>
    );
  }

  if (section.kind === 'dua') {
    return (
      <Card elevation="raised" className={styles.card}>
        <Typography variant="caption" muted>
          {section.title}
        </Typography>
        <Typography variant="body" className={styles.arabic} dir="rtl">
          <ReactMarkdown>{section.arabic}</ReactMarkdown>
        </Typography>
        <Typography variant="body">
          <ReactMarkdown>{section.translation}</ReactMarkdown>
        </Typography>
      </Card>
    );
  }

  // TypeScript exhaustive check — all AssistantSection kinds are handled above.
  // This line satisfies the type checker and should never be reached.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _exhaustiveCheck: never = section;
  return null;
}