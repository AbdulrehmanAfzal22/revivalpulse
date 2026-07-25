import type { TranslationKey } from 'i18n';

export type DuaCategoryId =
  | 'morning'
  | 'evening'
  | 'sleeping'
  | 'wakingUp'
  | 'eating'
  | 'traveling'
  | 'illness'
  | 'prayer'
  | 'ramadan'
  | 'hajj'
  | 'protection'
  | 'forgiveness';

export interface DuaCategory {
  id: DuaCategoryId;
  labelKey: TranslationKey;
}

export interface DuaItem {
  /** Stable id from the source book (Hisn al-Muslim), unique across the whole collection. */
  id: number;
  categoryId: DuaCategoryId;
  title: string;
  arabic: string;
  /**
   * No transliteration field: verified absent from every Hisn al-Muslim
   * mirror checked (the book's original digitization never included one).
   * Rather than auto-generate or splice in mismatched wording from an
   * unrelated, differently-worded dua source, it's left out.
   */
  translation: string;
  /** Original publisher's own CDN (hisnmuslim.com) — not re-hosted, see data/duas/index.ts. */
  audioUrl: string | null;
  source: string | null;
}
