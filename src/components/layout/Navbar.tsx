import { useState } from 'react';
import { Menu, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from 'constants/navigation';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import Button from 'components/ui/Button';
import GlobalSearchBar from './GlobalSearchBar';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Button
          variant="icon"
          className={styles.menuButton}
          onClick={() => setIsDrawerOpen(true)}
          aria-label={t('nav.openMenu')}
          leadingIcon={<Menu size={20} />}
        />

        <NavLink to={ROUTES.HOME} className={styles.logo} aria-label={t('nav.home')}>
          <Moon size={20} />
          <span>IslamicWeb</span>
        </NavLink>

        <nav className={styles.links} aria-label={t('nav.primary')}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                [styles.link, isActive && styles.linkActive].filter(Boolean).join(' ')
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <GlobalSearchBar />
          <LanguageSelector />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}
