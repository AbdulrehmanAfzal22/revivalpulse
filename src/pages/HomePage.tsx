import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, CalendarDays, Clock, Heart, ScrollText, Sparkles } from 'lucide-react';
import Skeleton from 'components/ui/Skeleton';
import useAyahOfTheDay from 'features/quranReader/hooks/useAyahOfTheDay';
import useHadithOfTheDay from 'features/hadith/hooks/useHadithOfTheDay';
import useDuas from 'features/duas/hooks/useDuas';
import useDivineNames from 'features/namesOfAllah/hooks/useDivineNames';
import useTodayHijriDate from 'features/islamicCalendar/hooks/useTodayHijriDate';
import useGeolocation from 'features/prayerTimes/hooks/useGeolocation';
import usePrayerTimes from 'features/prayerTimes/hooks/usePrayerTimes';
import { getCurrentPrayerInfo, getCountdownParts } from 'features/prayerTimes/services/prayerTimeCalculations';
import { usePrayerTimesPreferencesStore } from 'stores/prayerTimesPreferencesStore';
import { buildHadithBookPath, ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import ContinueReadingCard from 'components/ui/ContinueReadingCard';
import KidsModeEntry from 'features/kidsMode/components/KidsModeEntry';
import { useReadingPositionStore } from 'stores/readingPositionStore';
import { SURAHS } from 'data/quran/surahs';
import { HADITH_BOOKS } from 'data/hadith/books';
import styles from './HomePage.module.css';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HomePage() {
  const { t } = useTranslation();

  const geolocation = useGeolocation();
  const manualLocation = usePrayerTimesPreferencesStore((state) => state.manualLocation);
  const calculationMethodId = usePrayerTimesPreferencesStore((state) => state.calculationMethodId);

  useEffect(() => {
    if (!manualLocation) geolocation.requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCoordinates = manualLocation ?? geolocation.coordinates;
  const prayerTimes = usePrayerTimes(activeCoordinates, calculationMethodId);
  const prayerInfo = prayerTimes.data
    ? getCurrentPrayerInfo(prayerTimes.data.timings, prayerTimes.data.timezone)
    : null;

  const hijri = useTodayHijriDate();
  const ayah = useAyahOfTheDay();
  const hadith = useHadithOfTheDay();
  const duas = useDuas();
  const names = useDivineNames();

  const positions = useReadingPositionStore((state) => state.positions);
  const quran = positions.quran?.module === 'quran' ? positions.quran : undefined;
  const hadithPosition = positions.hadith?.module === 'hadith' ? positions.hadith : undefined;
  const tafsir = positions.tafsir?.module === 'tafsir' ? positions.tafsir : undefined;
  const hadithBook =
    hadithPosition && HADITH_BOOKS.find((book) => book.slug === hadithPosition.bookSlug);

  const dua = duas.data && duas.data.length > 0 ? duas.data[dayOfYear(new Date()) % duas.data.length] : undefined;
  const name = names.data && names.data.length > 0 ? names.data[dayOfYear(new Date()) % names.data.length] : undefined;

  function countdownText(minutesUntilNext: number): string {
    const { hours, minutes } = getCountdownParts(minutesUntilNext);
    return hours === 0
      ? t('prayerTimes.countdownMinutes', { minutes })
      : t('prayerTimes.countdownHoursMinutes', { hours, minutes });
  }

  return (
    <div className="container">
      <div className={styles.page}>
        <section className={styles.hero} aria-label={t('home.dailyOverview')}>
          <div className={styles.heroTop}>
            <div className={styles.heroBlock}>
              <span className={styles.heroEyebrow}>
                <Clock size={13} aria-hidden="true" />
                {t('prayerTimes.nextPrayer')}
              </span>
              {activeCoordinates && prayerTimes.isPending && <span className={styles.heroLoading} />}
              {!activeCoordinates && geolocation.status !== 'loading' && (
                <Link to={ROUTES.PRAYER_TIMES} className={styles.heroLink}>
                  <span className={styles.heroMeta}>{t('prayerTimes.setYourLocation')}</span>
                </Link>
              )}
              {activeCoordinates && prayerInfo && (
                <Link to={ROUTES.PRAYER_TIMES} className={styles.heroLink}>
                  <strong className={styles.heroTitle}>{prayerInfo.next}</strong>
                  <span className={styles.heroMeta}>
                    {t('prayerTimes.in', { countdown: countdownText(prayerInfo.minutesUntilNext) })}
                  </span>
                </Link>
              )}
            </div>

            {hijri.isError !== true && (
              <div className={`${styles.heroBlock} ${styles.heroBlockEnd}`}>
                <span className={styles.heroEyebrow}>
                  <CalendarDays size={13} aria-hidden="true" />
                  {t('islamicCalendar.islamicDate')}
                </span>
                {hijri.isPending && <span className={styles.heroLoading} />}
                {hijri.data && (
                  <Link to={ROUTES.ISLAMIC_CALENDAR} className={styles.heroLink}>
                    <strong className={styles.heroTitle}>
                      {t('islamicCalendar.hijriDateAH', {
                        day: hijri.data.hijri.day,
                        month: hijri.data.hijri.month.en,
                        year: hijri.data.hijri.year,
                      })}
                    </strong>
                    <span className={styles.heroMeta}>
                      {t('islamicCalendar.gregorianDate', {
                        weekday: hijri.data.gregorian.weekdayEn,
                        month: hijri.data.gregorian.monthNameEn,
                        day: hijri.data.gregorian.day,
                        year: hijri.data.gregorian.year,
                      })}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {ayah.isError !== true && (
          <section className={styles.ayah} aria-label={t('quran.ayahOfTheDay')}>
            <span className={styles.ornament} aria-hidden="true">
              <span className={styles.ornamentLine} />
              <span className={styles.ornamentStar}>۞</span>
              <span className={styles.ornamentLine} />
            </span>
            <span className={styles.eyebrow}>
              <BookMarked size={13} aria-hidden="true" />
              {t('quran.ayahOfTheDay')}
            </span>
            {ayah.isPending && (
              <div className={styles.ayahSkeleton}>
                <Skeleton variant="text" count={3} />
              </div>
            )}
            {ayah.data && (
              <>
                <p className={styles.ayahArabic} dir="rtl" lang="ar">
                  {ayah.data.arabic}
                </p>
                <p className={styles.ayahTranslation}>{ayah.data.translation}</p>
                <Link
                  className={styles.ayahCite}
                  to={`/quran/${ayah.data.verseKey.split(':')[0]}?ayah=${ayah.data.verseKey.split(':')[1]}`}
                >
                  {ayah.data.verseKey}
                </Link>
              </>
            )}
          </section>
        )}

        <div className={styles.rule} aria-hidden="true" />

        <section className={styles.dailyGrid} aria-label={t('home.dailyReflections')}>
          {hadith.isError !== true && (
            <Link to={buildHadithBookPath('nawawi40')} className={styles.dailyCard}>
              <span className={styles.dailyEyebrow}>
                <ScrollText size={13} aria-hidden="true" />
                {t('hadith.hadithOfTheDay')}
              </span>
              {hadith.isPending && <Skeleton variant="text" count={4} />}
              {hadith.data && (
                <>
                  <span className={`${styles.dailyBody} ${styles.clamp5}`}>{hadith.data.englishText}</span>
                  <span className={styles.dailyFoot}>
                    {hadith.data.narrator ? `${hadith.data.narrator} · ` : ''}
                    {t('hadith.nawawiCitation', { number: hadith.data.idInBook })}
                  </span>
                </>
              )}
            </Link>
          )}

          {duas.isError !== true && (
            <Link to={ROUTES.DUAS} className={styles.dailyCard}>
              <span className={styles.dailyEyebrow}>
                <Heart size={13} aria-hidden="true" />
                {t('duas.duaOfTheDay')}
              </span>
              {duas.isPending && <Skeleton variant="text" count={4} />}
              {dua && (
                <>
                  <span className={styles.dailyArabic} dir="rtl" lang="ar">
                    {dua.arabic}
                  </span>
                  <span className={`${styles.dailyBody} ${styles.clamp3}`}>{dua.translation}</span>
                  <span className={styles.dailyFoot}>{dua.title}</span>
                </>
              )}
            </Link>
          )}

          {names.isError !== true && (
            <Link to={ROUTES.NAMES_OF_ALLAH} className={styles.dailyCard}>
              <span className={styles.dailyEyebrow}>
                <Sparkles size={13} aria-hidden="true" />
                {t('namesOfAllah.reflectOn')}
              </span>
              {names.isPending && <Skeleton variant="text" count={3} />}
              {name && (
                <>
                  <span className={styles.dailyName} dir="rtl" lang="ar">
                    {name.arabic}
                  </span>
                  <span className={styles.dailyBody}>
                    {t('namesOfAllah.transliterationMeaning', {
                      transliteration: name.transliteration,
                      meaning: name.meaning,
                    })}
                  </span>
                </>
              )}
            </Link>
          )}
        </section>

        {(quran || (hadithPosition && hadithBook) || tafsir) && (
          <div className={styles.readingGrid}>
            {quran && (
              <ContinueReadingCard
                title="Continue Quran"
                description={`${SURAHS.find((surah) => surah.id === quran.surahId)?.nameSimple ?? `Surah ${quran.surahId}`} · Verse ${quran.ayahNumber}`}
                preview={quran.preview}
                to={`/quran/${quran.surahId}?ayah=${quran.ayahNumber}`}
              />
            )}
            {hadithPosition && hadithBook && (
              <ContinueReadingCard
                title="Continue Hadith"
                description={`${hadithBook.nameEnglish} · Chapter ${hadithPosition.chapterId} · Hadith ${hadithPosition.hadithNumber}`}
                preview={hadithPosition.preview}
                to={`/hadith/${hadithPosition.bookSlug}/${hadithPosition.chapterId}`}
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

        <div className="banner">
          <KidsModeEntry />
        </div>
      </div>
    </div>
  );
}
