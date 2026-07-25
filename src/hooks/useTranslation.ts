import { useCallback, useMemo } from 'react';
import useInterfaceLanguage from './useInterfaceLanguage';
import { getDictionary, en } from 'i18n';
import { interpolate } from 'i18n/interpolate';
import { getPluralRules } from 'i18n/pluralRules';
import type { TranslationKey, PluralKey } from 'i18n/types';

type InterpolationParams = Record<string, string | number>;

export interface UseTranslationResult {
  t: (key: TranslationKey, params?: InterpolationParams) => string;
  tp: (base: PluralKey, count: number, params?: InterpolationParams) => string;
}

export default function useTranslation(): UseTranslationResult {
  const { interfaceLanguage } = useInterfaceLanguage();
  const dict = useMemo(() => getDictionary(interfaceLanguage.code), [interfaceLanguage.code]);

  const t = useCallback(
    (key: TranslationKey, params?: InterpolationParams): string => {
      const raw = dict[key] ?? en[key];
      if (process.env.NODE_ENV !== 'production' && raw === undefined) {
        // eslint-disable-next-line no-console
        console.warn(`Missing translation for key "${key}"`);
      }
      return params ? interpolate(raw, params) : raw;
    },
    [dict]
  );

  const tp = useCallback(
    (base: PluralKey, count: number, params?: InterpolationParams): string => {
      const category = getPluralRules(interfaceLanguage.code).select(count);
      const candidateKey = `${base}_${category}` as TranslationKey;
      const fallbackKey = `${base}_other` as TranslationKey;
      const raw = dict[candidateKey] ?? dict[fallbackKey] ?? en[fallbackKey];
      return interpolate(raw, { count, ...params });
    },
    [dict, interfaceLanguage.code]
  );

  return { t, tp };
}
