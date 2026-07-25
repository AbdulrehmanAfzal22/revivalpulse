import { useState } from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import { BEGINNER_LESSONS } from 'data/kids/beginnerLessons';
import { SURAHS } from 'data/quran/surahs';
import { RECITERS } from 'constants/reciters';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';
import useBeginnerLessonVerses from 'features/kids/hooks/useBeginnerLessonVerses';
import { useKidsProgressStore, getCompletedLessonSurahIds } from 'stores/kidsProgressStore';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsLessonsPage.module.css';

const KIDS_RECITER = RECITERS.find((reciter) => reciter.id === 'maher-muaiqly');

export default function KidsLessonsPage() {
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const records = useKidsProgressStore((state) => state.records);
  const completeLesson = useKidsProgressStore((state) => state.completeLesson);
  const completedIds = getCompletedLessonSurahIds(records);
  const { t } = useTranslation();

  const { data: verses, isPending, isError } = useBeginnerLessonVerses(selectedSurahId ?? 0);

  if (selectedSurahId !== null) {
    const surah = SURAHS.find((item) => item.id === selectedSurahId);
    const lesson = BEGINNER_LESSONS.find((item) => item.surahId === selectedSurahId);
    const isCompleted = completedIds.includes(selectedSurahId);

    return (
      <div className={styles.page}>
        <Button variant="ghost" size="sm" onClick={() => setSelectedSurahId(null)} leadingIcon={<ChevronLeft size={16} />}>
          {t('kids.backToLessons')}
        </Button>
        <Typography variant="h2">{lesson?.title ?? surah?.nameSimple}</Typography>
        {lesson && (
          <Typography variant="body" muted>
            {t(lesson.focusKey)}
          </Typography>
        )}

        {isPending && <Skeleton variant="rect" height="5rem" count={4} />}
        {isError && <EmptyState title={t('emptyState.kids.lessonLoadFailed')} />}

        <div className={styles.verses}>
          {verses?.map((verse) => (
            <Card key={verse.verseKey} elevation="raised" className={styles.verseCard}>
              <div className={styles.verseHeader}>
                <Typography variant="caption" muted>
                  {verse.verseKey}
                </Typography>
                {KIDS_RECITER?.source === 'everyayah.com' && (
                  <AudioPlayButton
                    src={buildAyahAudioUrl(KIDS_RECITER.folderName, verse.chapterId, verse.verseNumber)}
                    size="sm"
                    label={t('kids.playVerse', { verseKey: verse.verseKey })}
                  />
                )}
              </div>
              <Typography variant="h4" as="p" className={styles.verseArabic} dir="rtl">
                {verse.textUthmani}
              </Typography>
              <Typography variant="body">{verse.translations[0]?.text}</Typography>
            </Card>
          ))}
        </div>

        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          onClick={() => completeLesson(selectedSurahId)}
          leadingIcon={isCompleted ? <Check size={16} /> : undefined}
        >
          {isCompleted ? t('kids.lessonComplete') : t('kids.markLessonComplete')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('kids.beginnerLessons')}</Typography>
      <div className={styles.grid}>
        {BEGINNER_LESSONS.map((lesson) => {
          const surah = SURAHS.find((item) => item.id === lesson.surahId);
          const isCompleted = completedIds.includes(lesson.surahId);
          return (
            <Card
              key={lesson.surahId}
              elevation="raised"
              className={styles.lessonCard}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedSurahId(lesson.surahId)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') setSelectedSurahId(lesson.surahId);
              }}
            >
              <div className={styles.lessonHeader}>
                <Typography variant="body">{lesson.title}</Typography>
                {isCompleted && <Check size={16} className={styles.completeIcon} />}
              </div>
              <Typography variant="caption" muted>
                {t(lesson.focusKey)}
              </Typography>
              <Typography variant="caption" muted>
                {t('kids.versesCount', { count: surah?.versesCount ?? 0 })}
              </Typography>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
