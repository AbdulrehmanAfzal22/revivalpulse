import type { DuaCategory } from 'types/duas.types';

/**
 * The 12 requested categories. Dua text itself lives in public/data/duas.json
 * (content, fetched via api/duas/duasClient.ts — same split as the 99 Names
 * and Phase 7's morphology data). This file holds the curation surface:
 * which of the source book's ~132 chapters were folded into each category.
 *
 * Source: Hisn al-Muslim (Fortress of the Muslim) by Saʿid bin Ali bin Wahf
 * Al-Qahtani, via the YousefAsalya/Islamic-Pro-azkar-API mirror (MIT
 * licensed, Arabic+English, audio filenames matching hisnmuslim.com's own
 * numbering). Audio is linked directly from hisnmuslim.com — the book's own
 * publisher site — rather than re-hosted; see public/data/duas.json.
 *
 * 'morning' and 'evening' both draw from the source's single combined
 * "Words of remembrance for morning and evening" chapter: the book presents
 * one list recited at both times (with a few words swapped, e.g. "we have
 * reached the morning" / "...the evening", not distinguished in this
 * digitization), so duplicating it under both tabs is accurate to the
 * source rather than an invented split.
 *
 * No transliteration field: verified absent from every digitization of this
 * book that was checked (KabDeveloper, wafaaelmaandy, rn0x, YousefAsalya) —
 * the original source material itself was never transliterated, so this
 * isn't a per-mirror gap to patch by merging in a different, differently
 * worded dua collection (dua-dhikr's ~97 items have transliteration, but
 * matching its wording to this book's item-by-item would be exactly the
 * kind of fragile cross-source text merge this project avoids elsewhere —
 * see data/hadith/books.ts for the same call on Urdu hadith).
 */
export const DUA_CATEGORIES: DuaCategory[] = [
  { id: 'morning', labelKey: 'duas.category.morning' },
  { id: 'evening', labelKey: 'duas.category.evening' },
  { id: 'sleeping', labelKey: 'duas.category.sleeping' },
  { id: 'wakingUp', labelKey: 'duas.category.wakingUp' },
  { id: 'eating', labelKey: 'duas.category.eating' },
  { id: 'traveling', labelKey: 'duas.category.traveling' },
  { id: 'illness', labelKey: 'duas.category.illness' },
  { id: 'prayer', labelKey: 'duas.category.prayer' },
  { id: 'ramadan', labelKey: 'duas.category.ramadan' },
  { id: 'hajj', labelKey: 'duas.category.hajj' },
  { id: 'protection', labelKey: 'duas.category.protection' },
  { id: 'forgiveness', labelKey: 'duas.category.forgiveness' },
];
