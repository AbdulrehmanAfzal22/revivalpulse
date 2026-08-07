/**
 * KidsStoryV2 — the reference story schema every Prophet and Sahabi story
 * is built on (Phase 3 reference implementation: Prophet Adam).
 *
 * Differences from the legacy `KidsStory` (types/kids.types.ts):
 *  - `sections: string[]` (flat paragraphs) → `chapters: KidsStoryChapter[]`
 *    (a chapter list with a detail page per chapter).
 *  - Text is bilingual (`LocalizedText`): English is always present; Urdu
 *    (`ur`) may lag behind and falls back to English when empty.
*  - Text is bilingual (`LocalizedText`): English is always present; Urdu
 *    (`ur`) may lag behind and falls back to English when empty.
 *  - Every chapter carries a non-empty `sources` array. `type: "quran"`
 *    anchors a Quran-narrated event to its actual verse; `type: "hadith"`
 *    is used ONLY where a specific authentic hadith covers the event.
 *    Anything the author could not confidently cite sets
 *    `needsVerification: true` instead of guessing a reference.
 *  - Every source carries a short BILINGUAL `label` — a one-line human
 *    explanation of what the citation anchors (e.g. "Allah commands the
 *    angels to bow to Adam"), not just a raw reference code. `reference` is
 *    the language-agnostic source string; `label` is what makes it read as
 *    an explanation in the reader's language.
 *
 * Depth standard (decided Phase 11): there is NO fixed chapter-count target.
 * Cover every well-documented event for a given Prophet or Sahabi — some
 * stories will have 10+ chapters, some 4 or 5, and both are correct. What is
 * fixed is paragraph depth per chapter: 4–8 real narrative paragraphs each.
 *
 * Citation standard (decided Phase 11):
 *  - Prefer Sahih al-Bukhari / Sahih Muslim whenever a hadith covers the
 *    event; a topical (book-level) reference is acceptable when a specific
 *    hadith number could not be reliably confirmed — never invent numbers.
 *  - Seerah-heavy events (delegations, battles, campaigns) that are not
 *    narrated word-for-word in Bukhari/Muslim anchor to a classical Seerah
 *    or history text (Ibn Hisham's Sirah, Ibn Kathir's al-Bidaya/Tafsir,
 *    At-Tabari). Modern secondary compilations are not cited by themselves.
 *    EXAMPLE (resolved Phase 11): the Najran Delegation chapter for Muhammad ﷺ
 *    cites `Qur'an 3:61` (the mubahala verse) as the quran anchor, Sunan
 *    at-Tirmidhi 2999 (on 3:61 the Prophet ﷺ gathered Ali, Fatima, Hasan,
 *    Husayn and said "O Allah, these are my family" — graded hasan sahih),
 *    Sahih Muslim (Hadith of the Cloak / household heading to delegate), and
 *    Ibn Hisham's Sirah or Ibn Kathir's Tafsir of 3:61 (delegation narrative).
 *  - Anything relying on a background/narrative report still gets
 *    `needsVerification: true` until the site owner signs it off.
 *
 * Review sign-off (decided Phase 11): the SITE OWNER is the single reviewer
 * delegated to mark a source `reviewed: true` in batches (matching the
 * CONTENT batches). Reviewed sources also carry `reviewedBy` and
 * `reviewedDate` (e.g. "2026-08-26"). This one-reviewer sign-off is a human
 * confirm-read that both the citation AND its bilingual label match the
 * narration — not a scholarly/ijazah certification. Unreviewed content ships
 * and displays normally; it simply has no signature yet.
 */

/** Bilingual text: English is the source of truth; Urdu may lag. */
export interface LocalizedText {
  en: string;
  /** Optional Urdu translation — empty/absent renders the English fallback. */
  ur?: string;
}

export type StorySourceType = 'quran' | 'hadith';

export interface StorySource {
  type: StorySourceType;
  /** Language-agnostic citation, e.g. "Qur'an 2:30" or "Sahih al-Bukhari 3406". */
  reference: string;
  /** Short bilingual human explanation of what this citation anchors — the reader-facing "why" behind the reference. */
  label: LocalizedText;
  /** True when the author could not verify this citation — must be reviewed before publishing. */
  needsVerification?: boolean;
  /** True once the site owner signed this citation off in a review batch. */
  reviewed?: boolean;
  /** Reviewer initials — set when `reviewed: true` (single reviewer: site owner). */
  reviewedBy?: string;
  /** Sign-off date, e.g. "2026-08-26" — set when `reviewed: true`. */
  reviewedDate?: string;
}

export interface KidsStoryChapter {
  /** Stable slug, e.g. "creation" — used in the chapter detail route. */
  id: string;
  title: LocalizedText;
  /**
   * 4–8 real narrative paragraphs (not summaries), rendered in order.
   * Chapter COUNT is driven by the events: cover every well-documented
   * event — a story may have 4 or 10+ chapters.
   */
  paragraphs: LocalizedText[];
  /** Non-empty — every chapter must be anchored to at least one source. */
  sources: StorySource[];
}

export type KidsFigureKind = 'prophet' | 'sahabi';

export interface KidsStoryV2 {
  id: string;
  type: KidsFigureKind;
  nameArabic: string;
  nameEnglish: string;
  summary: LocalizedText;
  /** Key into the symbolic illustration map — features/kids/components/StoryIllustration.tsx. */
  illustrationSymbol: string;
  accentColor: string;
  chapters: KidsStoryChapter[];
}
