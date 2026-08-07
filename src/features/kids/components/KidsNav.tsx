import { NavLink } from 'react-router-dom';
import { BookOpen, GraduationCap, HeartHandshake, Home, LogOut, Type, Users } from 'lucide-react';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './KidsNav.module.css';

const NAV_ITEMS: { to: string; labelKey: TranslationKey; icon: typeof Home; end: boolean }[] = [
  { to: ROUTES.KIDS, labelKey: 'kids.nav.home', icon: Home, end: true },
  { to: ROUTES.KIDS_ALPHABET, labelKey: 'kids.nav.letters', icon: Type, end: false },
  { to: ROUTES.KIDS_STORIES, labelKey: 'kids.nav.stories', icon: BookOpen, end: false },
  { to: ROUTES.KIDS_SAHABI, labelKey: 'kids.nav.sahabi', icon: Users, end: false },
  { to: ROUTES.KIDS_LESSONS, labelKey: 'kids.nav.lessons', icon: GraduationCap, end: false },
  { to: ROUTES.KIDS_MANNERS, labelKey: 'kids.nav.manners', icon: HeartHandshake, end: false },
];

export default function KidsNav() {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav} aria-label={t('kids.kidsMode')}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => [styles.item, isActive && styles.itemActive].filter(Boolean).join(' ')}
        >
          <item.icon size={22} />
          <span>{t(item.labelKey)}</span>
        </NavLink>
      ))}
      <NavLink to={ROUTES.HOME} className={styles.exit} aria-label={t('kids.exitKidsMode')}>
        <LogOut size={20} />
      </NavLink>
    </nav>
  );
}
