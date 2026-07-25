import { Moon, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Drawer from 'components/ui/Drawer';
import Button from 'components/ui/Button';
import { NAV_ITEMS } from 'constants/navigation';
import { ROUTES } from 'constants/routes';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useTranslation from 'hooks/useTranslation';
import GlobalSearchBar from './GlobalSearchBar';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import styles from './MobileDrawer.module.css';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { interfaceLanguage } = useInterfaceLanguage();
  const { t } = useTranslation();
  const side = interfaceLanguage.dir === 'rtl' ? 'right' : 'left';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side={side}>
      <div className={styles.header}>
        <NavLink to={ROUTES.HOME} className={styles.logo} onClick={onClose}>
          <Moon size={20} />
          <span>IslamicWeb</span>
        </NavLink>
        <Button
          variant="icon"
          onClick={onClose}
          aria-label={t('nav.closeMenu')}
          leadingIcon={<X size={20} />}
        />
      </div>

      <div className={styles.toolbar}>
        <GlobalSearchBar />
        <LanguageSelector />
        <ThemeToggle />
        <UserMenu />
      </div>

      <nav className={styles.links} aria-label={t('nav.primary')}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                [styles.link, isActive && styles.linkActive].filter(Boolean).join(' ')
              }
            >
              <Icon size={18} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>
    </Drawer>
  );
}
