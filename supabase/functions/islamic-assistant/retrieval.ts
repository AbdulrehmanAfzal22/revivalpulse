import { QURAN_API_BASE_URL } from '../../../constants/quranApi';
import { HADITH_DATA_BASE_URL, HADITH_BOOKS } from '../../../constants/hadithApi';
import fetch from 'node-fetch';

interface TranslationResource {
  sourceId: number | string;
  id: string;
}

const ARABIC_TRANSLATION_IDS = ['saheeh-international'];

export interface QuranVerseRef {
  type: 'quran';
  reference: string;
  text: string;
  url?: string;
}

export interface HadithRef {
  type: 'hadith';
  reference: string;
  text: string;
  book: string;
  url?: string;
}

export interface TafsirRef {
  type: 'tafsir';
  reference: string;
  text: string;
  scholar: string;
  url?: string;
}

export interface SourceCitation {
  type: 'quran' | 'hadith' | 'tafsir';
  reference: string;
  text: string;
}

/**
 * Resolve a query by source mode using the same underlying data sources
 * that the client-side resolvers.ts uses, but adapted for the edge function
 * environment (Node.js fetch instead of browser fetch, no TanStack Query).
 */
export async function resolveByMode(
  query: string,
  sourceMode: string
): Promise<SourceCitation[]> {
  const lowerQuery = query.toLowerCase().trim();

  switch (sourceMode) {
    case 'quran': {
      // Try to extract a verse key from the query (e.g., "2:255" or "Ayat al-Kursi")
      const verseKeyMatch = lowerQuery.match(/\b(\d{1,3})\s*[:.]\s*(\d{1,3})\b/);
      if (verseKeyMatch) {
        const surahId = Number(verseKeyMatch[1]);
        const ayahNumber = Number(verseKeyMatch[2]);
        const verseKey = `${surahId}:${ayahNumber}`;

        // Fetch Arabic text
        const verseUrl = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?fields=text_uthmani`;
        const verseResponse = await fetch(verseUrl);
        if (!verseResponse.ok) {
          return [{ type: 'quran', reference: `Quran ${verseKey}`, text: '' }];
        }
        const verseData = await verseResponse.json();
        const arabic = verseData.verse?.text_uthmani || '';

        // Fetch default translation (Saheeh International, sourceId 20)
        const translationUrl = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?translations=20`;
        const translationResponse = await fetch(translationUrl);
        let translation = '';
        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          translation = translationData.verse?.translations?.[0]?.text || '';
        }

        return [
          { type: 'quran', reference: `Quran ${verseKey}`, text: arabic + ' ' + translation },
        ];
      }

      // Generic Quran search - search api.quran.com
      const searchUrl = `${QURAN_API_BASE_URL}/search?q=${encodeURIComponent(
        lowerQuery
      )}&translation_ids=20&size=5`;
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        return [];
      }
      const searchData = await searchResponse.json();
      const results: SourceCitation[] = [];

      if (searchData.data && Array.isArray(searchData.data)) {
        for (const item of searchData.data) {
          const verseKey = item.verse_key;
          const arabic = item.highlightedArabic || item.textUthmani || '';

          // Get translation text
          const transUrl = `${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?translations=20`;
          const transResponse = await fetch(transUrl);
          let text = '';
          if (transResponse.ok) {
            const transData = await transResponse.json();
            text = transData.verse?.translations?.[0]?.text || '';
          }

          results.push({
            type: 'quran',
            reference: `Quran ${verseKey}`,
            text: arabic + ' ' + text,
          });
        }
      }

      return results;
    }

    case 'hadith': {
      // Search across ALL 11 hadith collections, not just the 2 client-side scoped
      const results: SourceCitation[] = [];

      for (const book of HADITH_BOOKS) {
        const url = `${HADITH_DATA_BASE_URL}/${book.sourcePath}`;
        const response = await fetch(url);
        if (!response.ok) continue;

        const data = await response.json();
        const hadiths = data.hadiths || [];

        // Simple keyword matching on english text and narrator
        const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

        const matches = hadiths.filter(
          (hadith: any) => {
            const textMatch =
              hadith.english?.text?.toLowerCase().includes(lowerQuery) ||
              (queryWords.some(
                (word) => hadith.english?.text?.toLowerCase().includes(word)
              ));
            const narratorMatch =
              hadith.english?.narrator?.toLowerCase().includes(lowerQuery) ||
              (queryWords.some(
                (word) => hadith.english?.narrator?.toLowerCase().includes(word)
              ));
            return textMatch || narratorMatch;
          }
        ).slice(0, 3); // limit to 3 results per book

        for (const hadith of matches) {
          results.push({
            type: 'hadith',
            reference: `${book.nameEnglish} #${hadith.idInBook}`,
            text: hadith.english?.text || '',
            book: book.nameEnglish,
          });
        }
      }

      return results;
    }

    case 'tafsir': {
      // Try to extract verse key, then fetch tafsir
      const verseKeyMatch = lowerQuery.match(/\b(\d{1,3})\s*[:.]\s*(\d{1,3})\b/);
      if (verseKeyMatch) {
        const verseKey = `${Number(verseKeyMatch[1])}:${Number(verseKeyMatch[2])}`;

        // Fetch tafsir - use Ibn Kathir (id: 1) as default, similar to client-side DEFAULT_TAFSIR_ID
        const tafsirUrl = `${QURAN_API_BASE_URL}/tafsirs/1/by_ayah/${verseKey}`;
        const tafsirResponse = await fetch(tafsirUrl);
        if (!tafsirResponse.ok) {
          return [{ type: 'tafsir', reference: `Tafsir ${verseKey}`, text: '' }];
        }
        const tafsirData = await tafsirResponse.json();
        const text = tafsirData.tafsir?.text || '';

        return [
          {
            type: 'tafsir',
            reference: `Tafsir Ibn Kathir, ${verseKey}`,
            text,
          },
        ];
      }

      // Generic tafsir search - limited search
      return [];
    }

    case 'general': {
      // Classify whether the query needs Islamic evidence at all
      const islamicKeywords = [
        'quran',
        'hadith',
        'salah',
        'sunnah',
        'dua',
        'tafsir',
        'islam',
        'allah',
        'prophet',
      ];
      const needsIslamicEvidence = islamicKeywords.some((kw) => lowerQuery.includes(kw));

      if (needsIslamicEvidence) {
        // Try to detect which specific mode would be most appropriate
        if (lowerQuery.match(/\b\d{1,3}\s*[:.]\s*\d{1,3}\b/)) {
          // Looks like a verse reference - fall through to quran mode
          return [{ type: 'quran', reference: 'Generic Islamic reference', text: '' }];
        }
        if (lowerQuery.match(/\bhadith\b/) || lowerQuery.match(/\bprophet\b/)) {
          return [{ type: 'hadith', reference: 'Generic hadith reference', text: '' }];
        }
        if (lowerQuery.match(/\btafsir\b/) || lowerQuery.match(/\bcommentary\b/)) {
          return [{ type: 'tafsir', reference: 'Generic tafsir reference', text: '' }];
        }
      }

      // Generic non-Islamic query or unclassified - return empty
      return [];
    }

    default:
      return [];
  }
}

/**
 * Map a hadith book source path to its name
 */
function getBookName(sourcePath: string): string {
  const book = HADITH_BOOKS.find((b) => b.sourcePath === sourcePath);
  return book ? book.nameEnglish : 'Hadith Collection';
}