import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useHadithText from 'features/kids/hooks/useHadithText';
import { HADITH_BOOKS } from 'data/hadith/books';
import styles from './HadithSnippetCard.module.css';

export interface HadithSnippetCardProps {
  framing: string;
  bookSlug: string;
  idInBook: number;
}

export default function HadithSnippetCard({ framing, bookSlug, idInBook }: HadithSnippetCardProps) {
  const { data: hadith, isPending } = useHadithText(bookSlug, idInBook);
  const book = HADITH_BOOKS.find((item) => item.slug === bookSlug);

  return (
    <Card elevation="raised" className={styles.card}>
      <Typography variant="caption" muted>
        {framing}
      </Typography>
      {isPending ? (
        <Skeleton variant="text" count={2} />
      ) : (
        <Typography variant="body">{hadith?.englishText}</Typography>
      )}
      <Typography variant="caption" muted>
        {book?.nameEnglish}
      </Typography>
    </Card>
  );
}
