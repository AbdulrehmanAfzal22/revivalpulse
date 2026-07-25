import { Moon, Sun } from 'lucide-react';
import Button from 'components/ui/Button';
import useTheme from 'hooks/useTheme';
import useTranslation from 'hooks/useTranslation';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="icon"
      onClick={toggleTheme}
      aria-label={isDark ? t('common.switchToLightMode') : t('common.switchToDarkMode')}
      leadingIcon={isDark ? <Sun size={18} /> : <Moon size={18} />}
    />
  );
}
