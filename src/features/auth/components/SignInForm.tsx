import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import useAuth from 'hooks/useAuth';
import useTranslation from 'hooks/useTranslation';
import { MIN_PASSWORD_LENGTH } from 'constants/auth';
import styles from './SignInForm.module.css';

type FormMode = 'sign-in' | 'sign-up';

export default function SignInForm() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<FormMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isSignUp = mode === 'sign-up';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setFormError(null);

    if (isSignUp && password.length < MIN_PASSWORD_LENGTH) {
      setFormError(t('auth.passwordMinLength', { count: MIN_PASSWORD_LENGTH }));
      return;
    }

    setIsSubmitting(true);
    const result = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setFormError(result.error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <Mail size={16} className={styles.fieldIcon} />
        <input
          type="email"
          required
          autoComplete="email"
          placeholder={t('auth.emailAddress')}
          className={styles.input}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <Lock size={16} className={styles.fieldIcon} />
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          required
          minLength={isSignUp ? MIN_PASSWORD_LENGTH : undefined}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          placeholder={t('auth.password')}
          className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="button"
          className={styles.visibilityToggle}
          onClick={() => setIsPasswordVisible((visible) => !visible)}
          aria-label={isPasswordVisible ? t('auth.hidePassword') : t('auth.showPassword')}
        >
          {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </label>

      {formError && (
        <Typography variant="caption" className={styles.error}>
          {formError}
        </Typography>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t('auth.pleaseWait') : isSignUp ? t('auth.createAccount') : t('auth.signIn')}
      </Button>

      <button
        type="button"
        className={styles.modeSwitch}
        onClick={() => {
          setMode(isSignUp ? 'sign-in' : 'sign-up');
          setFormError(null);
        }}
      >
        {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
      </button>
    </form>
  );
}
