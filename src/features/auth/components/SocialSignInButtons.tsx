import Button from 'components/ui/Button';
import type { ButtonProps } from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import styles from './SocialSignInButtons.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.9v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.9a9 9 0 0 0 0 8.08l3.05-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .9 4.96l3.05 2.33C4.66 5.16 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" fill="currentColor">
      <path d="M13.1 9.53c.02 2.15 1.9 2.87 1.92 2.88-.02.05-.3 1.03-1 2.03-.6.87-1.23 1.73-2.21 1.75-.97.02-1.28-.57-2.39-.57-1.11 0-1.46.55-2.38.59-.94.04-1.66-.94-2.27-1.8-1.24-1.78-2.19-5.03-.91-7.23A3.5 3.5 0 0 1 6.85 5.4c.93-.02 1.8.62 2.38.62.57 0 1.63-.77 2.75-.66.47.02 1.78.19 2.62 1.43-.07.04-1.56.91-1.54 2.74ZM11.02 3.9c.5-.6.84-1.44.75-2.28-.72.03-1.6.48-2.12 1.08-.47.53-.88 1.38-.77 2.2.8.06 1.62-.41 2.14-1Z" />
    </svg>
  );
}

interface SocialSignInButtonsProps {
  onGoogleClick: () => void;
  onAppleClick: () => void;
  isDisabled?: boolean;
}

const SHARED_PROPS: Partial<ButtonProps> = { variant: 'secondary', size: 'lg' };

export default function SocialSignInButtons({
  onGoogleClick,
  onAppleClick,
  isDisabled,
}: SocialSignInButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Button
        {...SHARED_PROPS}
        onClick={onGoogleClick}
        disabled={isDisabled}
        leadingIcon={<GoogleIcon />}
      >
        {t('auth.continueWithGoogle')}
      </Button>
      <Button
        {...SHARED_PROPS}
        onClick={onAppleClick}
        disabled={isDisabled}
        leadingIcon={<AppleIcon />}
      >
        {t('auth.continueWithApple')}
      </Button>
    </div>
  );
}
