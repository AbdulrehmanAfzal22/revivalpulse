import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ThemeContextValue, ThemeMode } from 'types/theme.types';
import type { WithChildren } from 'types/common.types';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from 'constants/theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): ThemeMode {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: WithChildren) {
  const [theme, setThemeState] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
