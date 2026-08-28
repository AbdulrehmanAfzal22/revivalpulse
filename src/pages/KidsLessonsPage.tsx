import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import AudioPlayButton from 'components/ui/AudioPlayButton';
import KidsBackButton from 'features/kids/components/KidsBackButton';
import SurahQuiz from 'features/kids/components/SurahQuiz';
import { SURAHS } from 'data/quran/surahs';
import { JUZ_BOUNDARIES } from 'data/quran/juz';
import { RECITERS } from 'constants/reciters';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';
import useBeginnerLessonVerses from 'features/kids/hooks/useBeginnerLessonVerses';
import { useKidsProgressStore, getCompletedLessonSurahIds, getViewedContentIds } from 'stores/kidsProgressStore';
import { useKidsRewardsStore } from 'stores/useKidsRewardsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsLessonsPage.module.css';

const KIDS_RECITER = RECITERS.find((reciter) => reciter.id === 'maher-muaiqly');
const JUZ_AMMA_IDS = Object.keys(JUZ_BOUNDARIES.find((juz) => juz.juzNumber === 30)?.verseMapping ?? {}).map(Number);
const JUZ_AMMA_SURAHS = JUZ_AMMA_IDS.map((id) => SURAHS.find((surah) => surah.id === id)).filter(
  (surah): surah is (typeof SURAHS)[number] => Boolean(surah)
);

function surahSummary(name: string, meaning: string, place: string): string {
  return `${name} helps us learn about ${meaning.toLowerCase()} and living with faith, kindness, and courage. It was revealed in ${place === 'makkah' ? 'Makkah' : 'Madinah'}.`;
}

export default function KidsLessonsPage() {
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [quizSurahId, setQuizSurahId] = useState<number | null>(null);
  const records = useKidsProgressStore((state) => state.records);
  const completeLesson = useKidsProgressStore((state) => state.completeLesson);
  const markContentViewed = useKidsProgressStore((state) => state.markContentViewed);
  const recordQuizResult = useKidsProgressStore((state) => state.recordQuizResult);
  const awardStars = useKidsRewardsStore((state) => state.awardStars);
  const completedIds = getCompletedLessonSurahIds(records);
  const viewedSurahIds = getViewedContentIds(records, 'surahLesson');
  const { t } = useTranslation();
  const { data: verses, isPending, isError } = useBeginnerLessonVerses(selectedSurahId ?? 0);
  useEffect(() => {
    if (selectedSurahId !== null && verses && verses.length > 0 && !isPending && !isError) {
      markContentViewed('surahLesson', String(selectedSurahId));
    }
  }, [isError, isPending, markContentViewed, selectedSurahId, verses]);
  if (selectedSurahId !== null) {
    const surah = SURAHS.find((item) => item.id === selectedSurahId);
    const isCompleted = completedIds.includes(selectedSurahId);
    const lessonViewed = isCompleted || viewedSurahIds.includes(String(selectedSurahId));
    if (!surah) return <EmptyState title="Surah not found" />;

    return (
      <div className={styles.page}>
        <div className={styles.detailTop}>
          <KidsBackButton to="/kids/lessons" />
        </div>
        <div className={styles.detailHeading}>
          <Typography variant="h2" dir="rtl">{surah.nameArabic}</Typography>
          <Typography variant="h3">{surah.nameSimple}</Typography>
          <Typography variant="body" muted>{surah.translatedName} · {surah.versesCount} verses · {surah.revelationPlace === 'makkah' ? 'Meccan' : 'Medinan'}</Typography>
          <Typography variant="body">{surahSummary(surah.nameSimple, surah.translatedName, surah.revelationPlace)}</Typography>
        </div>
        {isPending && <Skeleton variant="rect" height="5rem" count={Math.min(surah.versesCount, 4)} />}
        {isError && <EmptyState title={t('emptyState.kids.lessonLoadFailed')} />}
        <div className={styles.verses}>
          {verses?.map((verse) => (
            <Card key={verse.verseKey} elevation="raised" className={styles.verseCard}>
              <div className={styles.verseHeader}>
                <Typography variant="caption" muted>{verse.verseKey}</Typography>
                {KIDS_RECITER?.source === 'everyayah.com' && <AudioPlayButton src={buildAyahAudioUrl(KIDS_RECITER.folderName, verse.chapterId, verse.verseNumber)} size="sm" label={t('kids.playVerse', { verseKey: verse.verseKey })} />}
              </div>
              <Typography variant="h4" as="p" className={styles.verseArabic} dir="rtl">{verse.textUthmani}</Typography>
              <Typography variant="body">{verse.translations[0]?.text}</Typography>
            </Card>
          ))}
        </div>
        {lessonViewed && !isCompleted && quizSurahId !== selectedSurahId && (
          <Card elevation="raised" className={styles.recapCard}>
            <Typography variant="h3" as="h2">Ready for a quick quiz?</Typography>
            <Typography variant="body">Answer five questions about this Surah. You can try again with no penalty.</Typography>
            <Button variant="primary" onClick={() => setQuizSurahId(selectedSurahId)}>Start quiz</Button>
          </Card>
        )}
        {quizSurahId === selectedSurahId && lessonViewed && verses && <SurahQuiz surah={surah} verses={verses} onComplete={(score, total) => { recordQuizResult(`surah:${selectedSurahId}`, score, total); completeLesson(selectedSurahId); awardStars(25 + score * 10); setQuizSurahId(null); }} />}
        {isCompleted && <Button variant="secondary" disabled leadingIcon={<Check size={16} />}>{t('kids.lessonComplete')}</Button>}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <KidsBackButton to="/kids" />
      <Typography variant="h2">Juz 'Amma - Short Surahs</Typography>
      <div className={styles.grid}>
          {JUZ_AMMA_SURAHS.map((surah) => {
            const isCompleted = completedIds.includes(surah.id);
            return <Card key={surah.id} elevation="raised" className={styles.lessonCard} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { setSelectedSurahId(surah.id); setQuizSurahId(null); } }}>
              <div className={styles.lessonHeader}><span className={styles.surahNumber}>{surah.id}</span><Typography variant="h4" as="span" dir="rtl">{surah.nameArabic}</Typography>{isCompleted && <Check size={20} className={styles.completeIcon} />}</div>
              <Typography variant="body">{surah.nameSimple}</Typography>
              <Typography variant="caption" muted>{surah.translatedName} · {surah.versesCount} verses · {surah.revelationPlace === 'makkah' ? 'Meccan' : 'Medinan'}</Typography>
              <Typography variant="caption" muted>{surahSummary(surah.nameSimple, surah.translatedName, surah.revelationPlace)}</Typography>
              <Button variant="secondary" size="sm" onClick={(event) => { event.stopPropagation(); setSelectedSurahId(surah.id); if (isCompleted) window.setTimeout(() => setQuizSurahId(surah.id), 0); }}>Quiz</Button>
            </Card>;
          })}
      </div>
    </div>
  );
}
