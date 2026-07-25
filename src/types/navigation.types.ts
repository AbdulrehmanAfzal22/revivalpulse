import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from 'i18n';

export interface NavItem {
  id: string;
  labelKey: TranslationKey;
  path: string;
  icon: LucideIcon;
}
