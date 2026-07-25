import { queryClient } from 'services/queryClient';
import { getSingleTranslationText, getVerseArabicText } from 'api/quran/quranClient';
import { fetchTafsirText } from 'features/quranReader/services/tafsirAggregator';
import { fetchChapterWithTranslations } from 'features/quranReader/services/translationAggregator';
import { getHadithBookContent } from 'api/hadith/hadithClient';
import { findHadithByNumber } from 'features/hadith/services/hadithSearch';
import { matchesKeywords, significantWords } from 'features/assistant/services/keywordMatch';
import { getAllDuas } from 'api/duas/duasClient';
import { SURAHS } from 'data/quran/surahs';
import { HADITH_BOOKS } from 'data/hadith/books';
import { DUA_CATEGORIES } from 'data/duas';
import { en as enDictionary } from 'i18n';
import { TRANSLATIONS } from 'constants/translations';
import { DEFAULT_TAFSIR_ID, TAFSIRS } from 'constants/tafsirs';
import type { AssistantAnswer, AssistantSection, Citation } from 'types/assistant.types';
import type { DuaCategoryId } from 'types/duas.types';

const DEFAULT_TRANSLATION_ID = 'saheeh-international';
const DEFAULT_TRANSLATION_SOURCE_ID = 20;

/** Assistant hadith search stays scoped to two small, already-integrated books rather than
 *  fetching all 11 (Bukhari alone is ~12MB) — keeps every query fast, not a data gap: if a
 *  question genuinely needs a different collection, Phase 10's own search covers that case. */
const HADITH_SEARCH_BOOK_SLUGS = ['nawawi40', 'riyad_assalihin'];
const HADITH_RESULTS_LIMIT = 3;
const DUA_RESULTS_LIMIT = 5;

function surahLabelFor(verseKey: string): string {
  const surahId = Number(verseKey.split(':')[0]);
  const surah = SURAHS.find((item) => item.id === surahId);
  return surah ? surah.nameSimple : `Surah ${surahId}`;
}

function buildVerseSection(verseKey: string, arabic: string, translations: { label: string; text: string }[]): AssistantSection {
  return { kind: 'verse', verseKey, surahLabel: surahLabelFor(verseKey), arabic, translations };
}

export async function resolveVerseExplain(verseKey: string): Promise<AssistantAnswer> {
  const [arabic, translation, tafsirText] = await Promise.all([
    queryClient.fetchQuery({ queryKey: ['quran', 'verseArabicText', verseKey], queryFn: () => getVerseArabicText(verseKey) }),
    queryClient.fetchQuery({
      queryKey: ['quran', 'singleTranslation', DEFAULT_TRANSLATION_SOURCE_ID, verseKey],
      queryFn: () => getSingleTranslationText(DEFAULT_TRANSLATION_SOURCE_ID, verseKey),
    }),
    queryClient.fetchQuery({
      queryKey: ['quran', 'tafsir', DEFAULT_TAFSIR_ID, verseKey],
      queryFn: () => fetchTafsirText(DEFAULT_TAFSIR_ID, verseKey),
    }),
  ]);

  const translationLabel = TRANSLATIONS.find((item) => item.id === DEFAULT_TRANSLATION_ID)?.label ?? 'Translation';
  const tafsirAuthor = TAFSIRS.find((item) => item.id === DEFAULT_TAFSIR_ID)?.authorName ?? 'Tafsir';

  const sections: AssistantSection[] = [
    buildVerseSection(verseKey, arabic, [{ label: translationLabel, text: translation }]),
    { kind: 'tafsir', verseKey, authorName: tafsirAuthor, text: tafsirText },
  ];
  const citations: Citation[] = [
    { type: 'quran', label: `Quran ${verseKey}` },
    { type: 'tafsir', label: `Tafsir ${tafsirAuthor}, ${verseKey}` },
  ];

  return { sections, citations, confident: true };
}

export async function resolveTranslationCompare(verseKey: string): Promise<AssistantAnswer> {
  const [surahId, verseNumberStr] = verseKey.split(':');
  const surahIdNum = Number(surahId);
  const verseNumber = Number(verseNumberStr);

  const englishTranslations = TRANSLATIONS.filter((item) => item.languageCode === 'en');
  const sortedIds = [...englishTranslations.map((item) => item.id)].sort();

  const [arabic, ayahs] = await Promise.all([
    queryClient.fetchQuery({ queryKey: ['quran', 'verseArabicText', verseKey], queryFn: () => getVerseArabicText(verseKey) }),
    queryClient.fetchQuery({
      queryKey: ['quran', 'chapterVerses', surahIdNum, sortedIds],
      queryFn: () => fetchChapterWithTranslations(surahIdNum, sortedIds),
    }),
  ]);

  const ayah = ayahs.find((item) => item.verseNumber === verseNumber);
  const translations = (ayah?.translations ?? [])
    .map((translation) => {
      const resource = TRANSLATIONS.find((item) => item.id === translation.translationId);
      return resource ? { label: resource.label, text: translation.text } : null;
    })
    .filter((item): item is { label: string; text: string } => item !== null);

  if (translations.length === 0) {
    return {
      sections: [{ kind: 'note', text: `Couldn't load translations for ${verseKey} right now.` }],
      citations: [],
      confident: false,
    };
  }

  return {
    sections: [buildVerseSection(verseKey, arabic, translations)],
    citations: [
      { type: 'quran', label: `Quran ${verseKey}` },
      ...translations.map((translation) => ({ type: 'quran' as const, label: `${translation.label} translation` })),
    ],
    confident: true,
  };
}

export async function resolveTafsirRequest(verseKey: string, tafsirId: string = DEFAULT_TAFSIR_ID): Promise<AssistantAnswer> {
  const resource = TAFSIRS.find((item) => item.id === tafsirId) ?? TAFSIRS.find((item) => item.id === DEFAULT_TAFSIR_ID);
  const resolvedTafsirId = resource?.id ?? DEFAULT_TAFSIR_ID;

  const [arabic, translation, tafsirText] = await Promise.all([
    queryClient.fetchQuery({ queryKey: ['quran', 'verseArabicText', verseKey], queryFn: () => getVerseArabicText(verseKey) }),
    queryClient.fetchQuery({
      queryKey: ['quran', 'singleTranslation', DEFAULT_TRANSLATION_SOURCE_ID, verseKey],
      queryFn: () => getSingleTranslationText(DEFAULT_TRANSLATION_SOURCE_ID, verseKey),
    }),
    queryClient.fetchQuery({
      queryKey: ['quran', 'tafsir', resolvedTafsirId, verseKey],
      queryFn: () => fetchTafsirText(resolvedTafsirId, verseKey),
    }),
  ]);

  const translationLabel = TRANSLATIONS.find((item) => item.id === DEFAULT_TRANSLATION_ID)?.label ?? 'Translation';
  const tafsirAuthor = resource?.authorName ?? 'Tafsir';

  return {
    sections: [
      buildVerseSection(verseKey, arabic, [{ label: translationLabel, text: translation }]),
      { kind: 'tafsir', verseKey, authorName: tafsirAuthor, text: tafsirText },
    ],
    citations: [
      { type: 'quran', label: `Quran ${verseKey}` },
      { type: 'tafsir', label: `Tafsir ${tafsirAuthor}, ${verseKey}` },
    ],
    confident: true,
  };
}

export async function resolveHadithSearch(query: string): Promise<AssistantAnswer> {
  const trimmed = query.trim();
  const isNumberLookup = /^\d+$/.test(trimmed);
  const queryWords = significantWords(query);

  for (const slug of HADITH_SEARCH_BOOK_SLUGS) {
    const book = HADITH_BOOKS.find((item) => item.slug === slug);
    if (!book) continue;

    // eslint-disable-next-line no-await-in-loop -- deliberately sequential: stop at the first book with a confident match
    const content = await queryClient.fetchQuery({
      queryKey: ['hadith', 'book', book.slug],
      queryFn: () => getHadithBookContent(book),
    });

    // Word-stem matching (not exact substring) — a plain substring check misses real matches
    // like a query for "intentions" against hadith text that says "he intended". See
    // keywordMatch.ts for why this is still a mechanical text match, not a guess.
    const matches = isNumberLookup
      ? [findHadithByNumber(content, Number(trimmed))].filter((hadith): hadith is NonNullable<typeof hadith> => Boolean(hadith))
      : content.hadiths
          .filter((hadith) => matchesKeywords(hadith.englishText, queryWords) || (hadith.narrator ? matchesKeywords(hadith.narrator, queryWords) : false))
          .slice(0, HADITH_RESULTS_LIMIT);

    if (matches.length > 0) {
      return {
        sections: matches.map(
          (hadith): AssistantSection => ({
            kind: 'hadith',
            bookName: book.nameEnglish,
            idInBook: hadith.idInBook,
            arabic: hadith.arabic,
            englishText: hadith.englishText,
            narrator: hadith.narrator,
          })
        ),
        citations: matches.map((hadith) => ({ type: 'hadith' as const, label: `${book.nameEnglish} #${hadith.idInBook}` })),
        confident: true,
      };
    }
  }

  return {
    sections: [{ kind: 'note', text: `Couldn't find a hadith matching "${query}" in the collections this assistant searches.` }],
    citations: [],
    confident: false,
  };
}

export async function resolveDuaSearch(query: string, categoryId: DuaCategoryId | null): Promise<AssistantAnswer> {
  const duas = await queryClient.fetchQuery({ queryKey: ['duas'], queryFn: getAllDuas });

  const matches = categoryId
    ? duas.filter((dua) => dua.categoryId === categoryId).slice(0, DUA_RESULTS_LIMIT)
    : duas
        .filter((dua) => {
          const lower = query.toLowerCase();
          return dua.title.toLowerCase().includes(lower) || dua.translation.toLowerCase().includes(lower);
        })
        .slice(0, DUA_RESULTS_LIMIT);

  if (matches.length === 0) {
    return {
      sections: [{ kind: 'note', text: `Couldn't find a dua matching "${query}".` }],
      citations: [],
      confident: false,
    };
  }

  const categoryLabelKey = categoryId ? DUA_CATEGORIES.find((item) => item.id === categoryId)?.labelKey : undefined;
  // The assistant's own answer text is always English regardless of interfaceLanguage
  // (a separate scope from chrome translation), so this resolves against `en` directly.
  const categoryLabel = categoryLabelKey ? enDictionary[categoryLabelKey] : '';

  return {
    sections: matches.map(
      (dua): AssistantSection => ({
        kind: 'dua',
        title: dua.title,
        arabic: dua.arabic,
        translation: dua.translation,
        categoryLabel,
      })
    ),
    citations: matches.map((dua) => ({ type: 'dua' as const, label: dua.source ?? 'Hisn al-Muslim' })),
    confident: true,
  };
}
