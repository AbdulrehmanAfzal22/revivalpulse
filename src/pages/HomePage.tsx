import AyahOfTheDay from 'features/quranReader/components/AyahOfTheDay';
import HadithOfTheDay from 'features/hadith/components/HadithOfTheDay';
import DuaOfTheDay from 'features/duas/components/DuaOfTheDay';
import NameReflection from 'features/namesOfAllah/components/NameReflection';
import PrayerCountdownWidget from 'features/prayerTimes/components/PrayerCountdownWidget';
import IslamicDateWidget from 'features/islamicCalendar/components/IslamicDateWidget';
import KidsModeEntry from 'features/kidsMode/components/KidsModeEntry';
import Typography from 'components/ui/Typography';
import styles from './HomePage.module.css';
import ContinueReadingCard from 'components/ui/ContinueReadingCard';
import { useReadingPositionStore } from 'stores/readingPositionStore';
import { SURAHS } from 'data/quran/surahs';
import { HADITH_BOOKS } from 'data/hadith/books';

export default function HomePage() {
  const positions = useReadingPositionStore((state) => state.positions);
  const quran = positions.quran?.module === 'quran' ? positions.quran : undefined;
  const hadith = positions.hadith?.module === 'hadith' ? positions.hadith : undefined;
  const tafsir = positions.tafsir?.module === 'tafsir' ? positions.tafsir : undefined;
  const hadithBook = hadith && HADITH_BOOKS.find((book) => book.slug === hadith.bookSlug);

  return (
    <div className="container">
      <div className={styles.page}>
        <Typography variant="h2" className={styles.heading}>
          Welcome to IslamicWeb
        </Typography>

        <div className="banner">
          <KidsModeEntry />
        </div>

        {(quran || (hadith && hadithBook) || tafsir) && (
          <div className={styles.readingGrid}>
            {quran && (
              <ContinueReadingCard
                title="Continue Quran"
                description={`${SURAHS.find((surah) => surah.id === quran.surahId)?.nameSimple ?? `Surah ${quran.surahId}`} · Verse ${quran.ayahNumber}`}
                preview={quran.preview}
                to={`/quran/${quran.surahId}?ayah=${quran.ayahNumber}`}
              />
            )}
            {hadith && hadithBook && (
              <ContinueReadingCard
                title="Continue Hadith"
                description={`${hadithBook.nameEnglish} · Chapter ${hadith.chapterId} · Hadith ${hadith.hadithNumber}`}
                preview={hadith.preview}
                to={`/hadith/${hadith.bookSlug}/${hadith.chapterId}`}
              />
            )}
            {tafsir && (
              <ContinueReadingCard
                title="Continue Tafsir"
                description={`${SURAHS.find((surah) => surah.id === tafsir.surahId)?.nameSimple ?? `Surah ${tafsir.surahId}`} · Verse ${tafsir.ayahNumber}`}
                preview={tafsir.preview}
                to={`/tafsir/${tafsir.surahId}/${tafsir.ayahNumber}`}
              />
            )}
          </div>
        )}

        <div className="grid-dashboard">
          <PrayerCountdownWidget />
          <IslamicDateWidget />
          <AyahOfTheDay />
          <HadithOfTheDay />
          <DuaOfTheDay />
          <NameReflection />
        </div>
      </div>
    </div>
  );
}
