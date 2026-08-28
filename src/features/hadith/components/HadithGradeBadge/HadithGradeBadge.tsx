import { getHadithGrades, getStrictestHadithGrade, type HadithScholarGrade } from 'data/hadith/grading';
import styles from './HadithGradeBadge.module.css';

export interface HadithGradeBadgeProps {
  bookSlug: string;
  idInBook: number;
}

export default function HadithGradeBadge({ bookSlug, idInBook }: HadithGradeBadgeProps) {
  const grades: HadithScholarGrade[] = getHadithGrades(bookSlug, idInBook);
  const strictestGrade = getStrictestHadithGrade(bookSlug, idInBook);
  const badgeClassName = grades.length === 0
    ? styles.ungraded
    : strictestGrade === 'Sahih'
      ? styles.sahih
      : strictestGrade === 'Hasan'
        ? styles.hasan
        : styles.daif;

  return (
    <span className={[styles.badge, badgeClassName].filter(Boolean).join(' ')}>
      {grades.length === 0 ? 'Ungraded' : grades.map((grade) => `${grade.scholar}: ${grade.grade}`).join(' · ')}
    </span>
  );
}
