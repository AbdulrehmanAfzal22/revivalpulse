import type { MannerTip, RamadanEidActivity, SimplifiedHadithRef } from 'types/kids.types';

/**
 * Each tip is a kid-friendly one-line framing of a REAL hadith already
 * verified in Phase 10 (data/hadith/books.ts / AhmedBaset/hadith-json) —
 * the app fetches and shows the actual hadith text alongside the framing
 * (features/kids/hooks/useMannerTipHadith.ts), it isn't replaced by it.
 */
export const MANNER_TIPS: MannerTip[] = [
  {
    id: 'kindness-everywhere',
    tipKey: 'kids.mannerTip.kindnessEverywhere',
    bookSlug: 'nawawi40',
    idInBook: 18,
  },
  {
    id: 'want-good-for-others',
    tipKey: 'kids.mannerTip.wantGoodForOthers',
    bookSlug: 'nawawi40',
    idInBook: 13,
  },
  {
    id: 'speak-kindly-or-stay-quiet',
    tipKey: 'kids.mannerTip.speakKindlyOrStayQuiet',
    bookSlug: 'nawawi40',
    idInBook: 15,
  },
  {
    id: 'eating-manners',
    tipKey: 'kids.mannerTip.eatingManners',
    bookSlug: 'riyad_assalihin',
    idInBook: 48,
  },
  {
    id: 'greet-everyone',
    tipKey: 'kids.mannerTip.greetEveryone',
    bookSlug: 'riyad_assalihin',
    idInBook: 8,
  },
];

/** Short, already-simple hadith shown as-is (real text, fetched live) — foundational picks from Nawawi's 40. */
export const SIMPLIFIED_HADITH: SimplifiedHadithRef[] = [
  { id: 'intentions', bookSlug: 'nawawi40', idInBook: 1, kidFramingKey: 'kids.simplifiedHadith.intentions' },
  { id: 'mind-your-business', bookSlug: 'nawawi40', idInBook: 12, kidFramingKey: 'kids.simplifiedHadith.mindYourBusiness' },
  { id: 'smile-charity', bookSlug: 'riyad_assalihin', idInBook: 23, kidFramingKey: 'kids.simplifiedHadith.smileCharity' },
];

export const RAMADAN_EID_ACTIVITIES: RamadanEidActivity[] = [
  {
    id: 'ramadan-countdown',
    occasion: 'ramadan',
    titleKey: 'kids.activity.ramadanCountdown.title',
    descriptionKey: 'kids.activity.ramadanCountdown.description',
  },
  {
    id: 'ramadan-dua-jar',
    occasion: 'ramadan',
    titleKey: 'kids.activity.ramadanDuaJar.title',
    descriptionKey: 'kids.activity.ramadanDuaJar.description',
  },
  {
    id: 'ramadan-help-iftar',
    occasion: 'ramadan',
    titleKey: 'kids.activity.ramadanHelpIftar.title',
    descriptionKey: 'kids.activity.ramadanHelpIftar.description',
  },
  {
    id: 'ramadan-charity-box',
    occasion: 'ramadan',
    titleKey: 'kids.activity.ramadanCharityBox.title',
    descriptionKey: 'kids.activity.ramadanCharityBox.description',
  },
  {
    id: 'eid-card',
    occasion: 'eid',
    titleKey: 'kids.activity.eidCard.title',
    descriptionKey: 'kids.activity.eidCard.description',
  },
  {
    id: 'eid-thank-you',
    occasion: 'eid',
    titleKey: 'kids.activity.eidThankYou.title',
    descriptionKey: 'kids.activity.eidThankYou.description',
  },
  {
    id: 'eid-share-sweets',
    occasion: 'eid',
    titleKey: 'kids.activity.eidShareSweets.title',
    descriptionKey: 'kids.activity.eidShareSweets.description',
  },
];
