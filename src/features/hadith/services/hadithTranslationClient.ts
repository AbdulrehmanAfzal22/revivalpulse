const HADITH_API_BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

const API_BOOK_SLUGS: Record<string, string> = {
  nawawi40: 'nawawi',
};

const LANGUAGE_CODES: Record<string, string> = {
  ara: 'ar',
  ben: 'bn',
  eng: 'en',
  fra: 'fr',
  ind: 'id',
  rus: 'ru',
  tam: 'ta',
  tur: 'tr',
  urd: 'ur',
};

export interface HadithTranslationLanguage {
  code: string;
  label: string;
  direction: 'rtl' | 'ltr';
  editionId: string;
}

export interface HadithTranslation {
  text: string;
  direction: 'rtl' | 'ltr';
}

interface EditionManifestEntry {
  name: string;
  book: string;
  language: string;
  direction: 'rtl' | 'ltr';
  link: string;
}

interface EditionManifestBook {
  collection: EditionManifestEntry[];
}

type EditionManifest = Record<string, EditionManifestBook>;

interface RawTranslationHadith {
  hadithnumber: number;
  text: string;
}

interface RawTranslationEdition {
  metadata: {
    direction?: 'rtl' | 'ltr';
  };
  hadiths: RawTranslationHadith[];
}

let editionsPromise: Promise<EditionManifest> | undefined;

function getEditionsManifest(): Promise<EditionManifest> {
  editionsPromise ??= fetch(`${HADITH_API_BASE_URL}/editions.json`).then(async (response) => {
    if (!response.ok) throw new Error(`Failed to load Hadith translation languages (status ${response.status})`);
    return (await response.json()) as EditionManifest;
  });
  return editionsPromise;
}

function apiBookSlug(bookSlug: string): string {
  return API_BOOK_SLUGS[bookSlug] ?? bookSlug;
}

function languageCode(entry: EditionManifestEntry): string {
  const prefix = entry.name.slice(0, entry.name.indexOf('-'));
  return LANGUAGE_CODES[prefix] ?? prefix;
}

export async function getHadithTranslationLanguages(bookSlug: string): Promise<HadithTranslationLanguage[]> {
  const manifest = await getEditionsManifest();
  const collection = manifest[apiBookSlug(bookSlug)]?.collection ?? [];
  const seen = new Set<string>();

  return collection
    .filter((entry) => {
      const code = languageCode(entry);
      if (seen.has(code)) return false;
      seen.add(code);
      return true;
    })
    .map((entry) => ({
      code: languageCode(entry),
      label: entry.language,
      direction: entry.direction,
      editionId: entry.name,
    }));
}

export async function getHadithTranslation(
  bookSlug: string,
  language: HadithTranslationLanguage
): Promise<Record<number, HadithTranslation>> {
  const response = await fetch(`${HADITH_API_BASE_URL}/editions/${language.editionId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${language.label} Hadith translation (status ${response.status})`);
  }

  const data = (await response.json()) as RawTranslationEdition;
  const direction = data.metadata?.direction ?? language.direction;
  return Object.fromEntries(
    data.hadiths.map((hadith) => [hadith.hadithnumber, { text: hadith.text.trim(), direction }])
  );
}

export function getHadithApiBookSlug(bookSlug: string): string {
  return apiBookSlug(bookSlug);
}
