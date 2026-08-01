import {
  BookOpen,
  ScrollText,
  BookMarked,
  Clock,
  Hand,
  Heart,
  CalendarDays,
  Bookmark,
  Download,
  Sparkles,
  Mic,
} from 'lucide-react';

import type { NavItem } from 'types/navigation.types';
import { ROUTES } from 'constants/routes';

export const NAV_ITEMS: NavItem[] = [
  { id: 'quran', labelKey: 'nav.quran', path: ROUTES.QURAN, icon: BookOpen },
  { id: 'hadith', labelKey: 'nav.hadith', path: ROUTES.HADITH, icon: ScrollText },
  { id: 'tafsir', labelKey: 'nav.tafsir', path: ROUTES.TAFSIR_SURAHS, icon: BookMarked },
  { id: 'recitation-coach', labelKey: 'nav.recitationCoach', path: ROUTES.RECITATION_COACH, icon: Mic },
  { id: 'prayer-times', labelKey: 'nav.prayerTimes', path: ROUTES.PRAYER_TIMES, icon: Clock },
  { id: 'tasbeeh', labelKey: 'nav.tasbeeh', path: ROUTES.TASBEEH, icon: Hand },
  { id: 'duas', labelKey: 'nav.duas', path: ROUTES.DUAS, icon: Heart },
  { id: 'names-of-allah', labelKey: 'nav.namesOfAllah', path: ROUTES.NAMES_OF_ALLAH, icon: Sparkles },
  { id: 'islamic-calendar', labelKey: 'nav.islamicCalendar', path: ROUTES.ISLAMIC_CALENDAR, icon: CalendarDays },
  { id: 'bookmarks', labelKey: 'nav.bookmarks', path: ROUTES.BOOKMARKS, icon: Bookmark },
  { id: 'downloads', labelKey: 'nav.downloads', path: ROUTES.DOWNLOADS, icon: Download },
];
