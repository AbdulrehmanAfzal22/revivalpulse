import { useThemeContext } from 'contexts/ThemeContext';
import type { ThemeContextValue } from 'types/theme.types';

export default function useTheme(): ThemeContextValue {
  return useThemeContext();
}
