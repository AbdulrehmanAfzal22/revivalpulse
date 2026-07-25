import { useState } from 'react';
import Dialog from 'components/ui/Dialog';
import Typography from 'components/ui/Typography';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import SocialSignInButtons from './SocialSignInButtons';
import SignInForm from './SignInForm';
import styles from './SignInDialog.module.css';

export interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInDialog({ isOpen, onClose }: SignInDialogProps) {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const { t } = useTranslation();
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogle = async (): Promise<void> => {
    setOauthError(null);
    setIsRedirecting(true);
    const result = await signInWithGoogle();
    setIsRedirecting(false);
    if (result.error) setOauthError(result.error);
  };

  const handleApple = async (): Promise<void> => {
    setOauthError(null);
    setIsRedirecting(true);
    const result = await signInWithApple();
    setIsRedirecting(false);
    if (result.error) setOauthError(result.error);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('auth.signIn')}>
      <SocialSignInButtons
        onGoogleClick={handleGoogle}
        onAppleClick={handleApple}
        isDisabled={isRedirecting}
      />

      {oauthError && (
        <Typography variant="caption" className={styles.error}>
          {oauthError}
        </Typography>
      )}

      <div className={styles.divider}>
        <span>{t('auth.or')}</span>
      </div>

      <SignInForm />

      <button type="button" className={styles.guestLink} onClick={onClose}>
        {t('auth.continueAsGuest')}
      </button>
    </Dialog>
  );
}
