import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Typography from './Typography';
import Button from './Button';
import styles from './ContinueReadingCard.module.css';

interface ContinueReadingCardProps {
  title: string;
  description: string;
  preview: string;
  to: string;
}

export default function ContinueReadingCard({ title, description, preview, to }: ContinueReadingCardProps) {
  return (
    <Card elevation="raised" className={styles.card}>
      <BookOpen size={20} className={styles.icon} aria-hidden="true" />
      <div className={styles.text}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="caption" muted>{description}</Typography>
        {preview && <Typography variant="caption" className={styles.preview}>{preview}</Typography>}
      </div>
      <Link to={to} className={styles.link}>
        <Button variant="primary" size="sm" trailingIcon={<ArrowRight size={14} />}>Continue</Button>
      </Link>
    </Card>
  );
}
