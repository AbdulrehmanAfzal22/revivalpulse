import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import KidsLayout from 'layouts/KidsLayout';
import ImmersiveLayout from 'layouts/ImmersiveLayout';
import { ROUTES } from 'constants/routes';

const HomePage = lazy(() => import('pages/HomePage'));
const QuranPage = lazy(() => import('pages/QuranPage'));
const SurahPage = lazy(() => import('pages/SurahPage'));
const HadithPage = lazy(() => import('pages/HadithPage'));
const HadithBookPage = lazy(() => import('pages/HadithBookPage'));
const HadithChapterPage = lazy(() => import('pages/HadithChapterPage'));
const TafsirSurahListPage = lazy(() => import('pages/TafsirSurahListPage'));
const TafsirPage = lazy(() => import('pages/TafsirPage'));
const PrayerTimesPage = lazy(() => import('pages/PrayerTimesPage'));
const TasbeehPage = lazy(() => import('pages/TasbeehPage'));
const DuasPage = lazy(() => import('pages/DuasPage'));
const NamesOfAllahPage = lazy(() => import('pages/NamesOfAllahPage'));
const IslamicCalendarPage = lazy(() => import('pages/IslamicCalendarPage'));
const BookmarksPage = lazy(() => import('pages/BookmarksPage'));
const DownloadsPage = lazy(() => import('pages/DownloadsPage'));
const RecitationCoachPage = lazy(() => import('pages/RecitationCoachPage'));
const SettingsPage = lazy(() => import('pages/SettingsPage'));
const DevModePage = lazy(() => import('pages/DevModePage'));
// Phase 4: the timestamp editor is a DEV-ONLY tool. `lazy` is only bound (and
// the page chunk only wired) outside production builds; the route below is
// likewise gated, so it can never ship.
const TimestampEditorPage =
  process.env.NODE_ENV === 'production'
    ? null
    : lazy(() => import('pages/TimestampEditorPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage'));

const KidsPage = lazy(() => import('pages/KidsPage'));
const KidsAlphabetPage = lazy(() => import('pages/KidsAlphabetPage'));
const KidsStoriesPage = lazy(() => import('pages/KidsStoriesPage'));
const KidsStoryPage = lazy(() => import('pages/KidsStoryPage'));
const KidsStoryChaptersPage = lazy(() => import('pages/KidsStoryChaptersPage'));
const KidsStoryChapterPage = lazy(() => import('pages/KidsStoryChapterPage'));
const KidsSahabiPage = lazy(() => import('pages/KidsSahabiPage'));
const KidsLessonsPage = lazy(() => import('pages/KidsLessonsPage'));
const KidsMannersPage = lazy(() => import('pages/KidsMannersPage'));
const KidsParentDashboardPage = lazy(() => import('pages/KidsParentDashboardPage'));
const KidsQuizPage = lazy(() => import('pages/KidsQuizPage'));
const KidsGamesPage = lazy(() => import('pages/KidsGamesPage'));
const KidsGamesTierPage = lazy(() => import('pages/KidsGamesTierPage'));
const KidsGamePlayPage = lazy(() => import('pages/KidsGamePlayPage'));
const KidsStarsPage = lazy(() => import('pages/KidsStarsPage'));
const ImmersiveRecitationPage = lazy(() => import('pages/ImmersiveRecitationPage'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.QURAN} element={<QuranPage />} />
        <Route path={ROUTES.SURAH} element={<SurahPage />} />
        <Route path={ROUTES.HADITH} element={<HadithPage />} />
        <Route path={ROUTES.HADITH_BOOK} element={<HadithBookPage />} />
        <Route path={ROUTES.HADITH_CHAPTER} element={<HadithChapterPage />} />
        <Route path={ROUTES.TAFSIR_SURAHS} element={<TafsirSurahListPage />} />
        <Route path={ROUTES.TAFSIR} element={<TafsirPage />} />
        <Route path={ROUTES.PRAYER_TIMES} element={<PrayerTimesPage />} />
        <Route path={ROUTES.TASBEEH} element={<TasbeehPage />} />
        <Route path={ROUTES.DUAS} element={<DuasPage />} />
        <Route path={ROUTES.NAMES_OF_ALLAH} element={<NamesOfAllahPage />} />
        <Route path={ROUTES.ISLAMIC_CALENDAR} element={<IslamicCalendarPage />} />
        <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
        <Route path={ROUTES.DOWNLOADS} element={<DownloadsPage />} />
        <Route path={ROUTES.RECITATION_COACH} element={<RecitationCoachPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route path={ROUTES.DEV_MODE} element={<DevModePage />} />
        {TimestampEditorPage && (
          <Route path={ROUTES.TIMESTAMP_EDITOR} element={<TimestampEditorPage />} />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Kids Mode: its own shell (no main navbar/footer) — Phase 14 treats it as a
          near-separate app skinned inside the same SPA shell. */}
      <Route element={<KidsLayout />}>
        <Route path={ROUTES.KIDS} element={<KidsPage />} />
        <Route path={ROUTES.KIDS_ALPHABET} element={<KidsAlphabetPage />} />
        <Route path={ROUTES.KIDS_STORIES} element={<KidsStoriesPage />} />
        <Route path={ROUTES.KIDS_STORY} element={<KidsStoryPage />} />
        <Route path={ROUTES.KIDS_STORY_CHAPTERS} element={<KidsStoryChaptersPage />} />
        <Route path={ROUTES.KIDS_STORY_CHAPTER} element={<KidsStoryChapterPage />} />
        <Route path={ROUTES.KIDS_SAHABI} element={<KidsSahabiPage />} />
        <Route path={ROUTES.KIDS_SAHABI_CHAPTERS} element={<KidsStoryChaptersPage />} />
        <Route path={ROUTES.KIDS_SAHABI_CHAPTER} element={<KidsStoryChapterPage />} />
        <Route path={ROUTES.KIDS_LESSONS} element={<KidsLessonsPage />} />
        <Route path={ROUTES.KIDS_MANNERS} element={<KidsMannersPage />} />
        <Route path={ROUTES.KIDS_PARENT} element={<KidsParentDashboardPage />} />
        <Route path={ROUTES.KIDS_QUIZ} element={<KidsQuizPage />} />
        <Route path={ROUTES.KIDS_GAMES} element={<KidsGamesPage />} />
        <Route path={ROUTES.KIDS_GAMES_TIER} element={<KidsGamesTierPage />} />
        <Route path={ROUTES.KIDS_GAME_PLAY} element={<KidsGamePlayPage />} />
        <Route path={ROUTES.KIDS_STARS} element={<KidsStarsPage />} />
      </Route>

      {/* Immersive Recitation: its own fullscreen shell — no main navbar/footer/global player. */}
      <Route element={<ImmersiveLayout />}>
        <Route path={ROUTES.NAMES_OF_ALLAH_IMMERSIVE} element={<ImmersiveRecitationPage />} />
      </Route>
    </Routes>
  );
}
