import { useRef, useState } from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import useClickOutside from 'hooks/useClickOutside';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import SignInDialog from 'features/auth/components/SignInDialog';
import styles from './UserMenu.module.css';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, isMenuOpen, () => setIsMenuOpen(false));

  const handleSignOut = async (): Promise<void> => {
    setIsMenuOpen(false);
    await signOut();
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        variant="icon"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label={t('nav.userMenu')}
        leadingIcon={
          isAuthenticated && user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className={styles.avatarImage} />
          ) : isAuthenticated && user ? (
            <span className={styles.avatarInitials}>{getInitials(user.displayName)}</span>
          ) : (
            <UserIcon size={18} />
          )
        }
      />

      {isMenuOpen && (
        <div className={styles.menu} role="menu">
          {isAuthenticated && user ? (
            <>
              <Typography variant="body" className={styles.userName}>
                {user.displayName}
              </Typography>
              {user.email && (
                <Typography variant="caption" muted>
                  {user.email}
                </Typography>
              )}
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<LogOut size={16} />}
                onClick={handleSignOut}
              >
                {t('common.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="caption" muted className={styles.status}>
                {t('common.notSignedIn')}
              </Typography>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<LogIn size={16} />}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSignInOpen(true);
                }}
              >
                {t('common.signIn')}
              </Button>
            </>
          )}
        </div>
      )}

      <SignInDialog isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </div>
  );
}
