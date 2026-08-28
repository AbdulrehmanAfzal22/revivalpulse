const QURAN_API_BASE_URL = 'https://api.quran.com/api/v4';
const HADITH_DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_book';
const DUAS = require('../public/data/duas.json');

const HADITH_BOOKS = [
  ['the_9_books/bukhari.json', 'Sahih al-Bukhari', 'bukhari'],
  ['the_9_books/muslim.json', 'Sahih Muslim', 'muslim'],
  ['the_9_books/abudawud.json', 'Sunan Abi Dawud', 'abudawud'],
  ['the_9_books/tirmidhi.json', "Jami' at-Tirmidhi", 'tirmidhi'],
  ['the_9_books/nasai.json', "Sunan an-Nasa'i", 'nasai'],
  ['the_9_books/ibnmajah.json', 'Sunan Ibn Majah', 'ibnmajah'],
  ['the_9_books/malik.json', 'Muwatta Malik', 'malik'],
  ['other_books/riyad_assalihin.json', 'Riyad as-Salihin', 'riyad-assalihin'],
  ['other_books/bulugh_almaram.json', 'Bulugh al-Maram', 'bulugh-al-maram'],
  ['other_books/mishkat_almasabih.json', 'Mishkat al-Masabih', 'mishkat-al-masabih'],
  ['forties/nawawi40.json', 'The Forty Hadith of Imam Nawawi', 'nawawi40'],
];

function source(type, reference, text, metadata = {}) {
  if (typeof reference !== 'string' || !reference.trim() || typeof text !== 'string' || !text.trim()) return null;
  return { type, reference, text: text.trim(), ...metadata };
}

async function fetchJson(url) {
  console.log('Fetching Quran API:', url);
  const response = await fetch(url);
  console.log('Quran API response status:', response.status);
  console.log('Quran API response ok:', response.ok);
  const text = await response.text();
  console.log('Quran API response body (first 200):', text.substring(0, 200));
  if (!response.ok) {
    return null;
  }
  const data = JSON.parse(text);
  console.log('Parsed data keys:', Object.keys(data).slice(0, 10));
  return data;
}

function verseKeyFrom(query) {
  const match = query.toLowerCase().match(/\b(\d{1,3})\s*[:.]\s*(\d{1,3})\b/);
  return match ? `${Number(match[1])}:${Number(match[2])}` : null;
}

async function resolveQuran(query) {
  console.log('Quran retrieval called with query:', query);
  const verseKey = verseKeyFrom(query);
  if (verseKey) {
    const [verseData, translationData] = await Promise.all([
      fetchJson(`${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?fields=text_uthmani`),
      fetchJson(`${QURAN_API_BASE_URL}/verses/by_key/${verseKey}?translations=20`),
    ]);
    const arabic = verseData?.verse?.text_uthmani || '';
    const translation = translationData?.verse?.translations?.[0]?.text || '';
    const [surah, ayah] = verseKey.split(':');
    return [source('quran', `Quran ${verseKey}`, `${arabic} ${translation}`, { url: `https://quran.com/${surah}/${ayah}` })].filter(Boolean);
  }

  const searchResponse = await fetchJson(
    `${QURAN_API_BASE_URL}/search?q=${encodeURIComponent(query.trim())}&translation_ids=20&size=5`
  );
  const searchResults = searchResponse?.search?.results || [];
  console.log('Quran topic search attempted for:', query, '-> results:', searchResults.length);
  console.log('Search results count:', searchResults.length);
  const results = [];
  for (const item of searchResults) {
    if (!item.verse_key) continue;
    const translationData = await fetchJson(
      `${QURAN_API_BASE_URL}/verses/by_key/${item.verse_key}?translations=20`
    );
    const text = `${item.highlightedArabic || item.textUthmani || ''} ${translationData?.verse?.translations?.[0]?.text || ''}`;
    const [surah, ayah] = item.verse_key.split(':');
    const result = source('quran', `Quran ${item.verse_key}`, text, { url: `https://quran.com/${surah}/${ayah}` });
    if (result) results.push(result);
  }
  return results;
}

async function resolveTafsir(query) {
  const verseKey = verseKeyFrom(query);
  if (!verseKey) return [];
  const data = await fetchJson(`${QURAN_API_BASE_URL}/tafsirs/1/by_ayah/${verseKey}`);
  const result = source('tafsir', `Tafsir Ibn Kathir, ${verseKey}`, data?.tafsir?.text || '');
  return result ? [result] : [];
}

async function resolveHadith(query) {
  const lowerQuery = query.toLowerCase().trim();
  const exactReference = findHadithReference(lowerQuery);
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 2);
  const results = [];

  for (const [sourcePath, bookName, slug] of HADITH_BOOKS) {
    if (exactReference && exactReference.slug !== slug) continue;
    const data = await fetchJson(`${HADITH_DATA_BASE_URL}/${sourcePath}`);
    if (exactReference) {
      const hadith = (data?.hadiths || []).find((item) => item.idInBook === exactReference.number);
      const text = hadith?.english?.text || `Hadith ${exactReference.number} does not exist in ${bookName} in this dataset.`;
      const result = source(
        'hadith',
        `${bookName} #${exactReference.number}`,
        text,
        { url: `https://sunnah.com/${slug}:${exactReference.number}`, collection: slug, number: exactReference.number }
      );
      return result ? [result] : [];
    }
    for (const hadith of data?.hadiths || []) {
      const text = hadith.english?.text || '';
      const narrator = hadith.english?.narrator || '';
      const searchableText = `${text} ${narrator}`.toLowerCase();
      if (searchableText.includes(lowerQuery) || queryWords.some((word) => searchableText.includes(word))) {
        const result = source(
          'hadith',
          `${bookName} #${hadith.idInBook}`,
          text,
          { url: `https://sunnah.com/${slug}:${hadith.idInBook}`, collection: slug, number: hadith.idInBook }
        );
        if (result) results.push(result);
        if (results.length >= 3) return results;
      }
    }
  }
  return results;
}

function findHadithReference(query) {
  const aliases = [
    ['riyad as salihin', 'riyad-assalihin'],
    ['riyad assalihin', 'riyad-assalihin'],
    ['bulugh al maram', 'bulugh-al-maram'],
    ['mishkat al masabih', 'mishkat-al-masabih'],
    ['nawawi', 'nawawi40'],
    ['abu dawud', 'abudawud'],
    ['ibn majah', 'ibnmajah'],
    ['tirmidhi', 'tirmidhi'],
    ['bukhari', 'bukhari'],
    ['muslim', 'muslim'],
    ['nasai', 'nasai'],
    ['malik', 'malik'],
  ];

  for (const [alias, slug] of aliases) {
    const escapedAlias = alias.replace(/\s+/g, '\\s+');
    const beforeCollection = new RegExp(`\\b(?:hadith\\s*)?(\\d{1,5})\\s*(?:in|from|of)?\\s*${escapedAlias}\\b`, 'i').exec(query);
    const afterCollection = new RegExp(`\\b${escapedAlias}\\s*(?:hadith\\s*)?#?\\s*(\\d{1,5})\\b`, 'i').exec(query);
    const match = beforeCollection || afterCollection;
    if (match) return { slug, number: Number(match[1]) };
  }
  return null;
}

function resolveDua(query) {
  const lowerQuery = query.toLowerCase().trim();
  return DUAS.filter((dua) =>
    dua.title.toLowerCase().includes(lowerQuery) || dua.translation.toLowerCase().includes(lowerQuery)
  )
    .slice(0, 5)
    .map((dua) => source('dua', `Hisn al-Muslim: ${dua.title}`, `${dua.arabic} ${dua.translation}`))
    .filter(Boolean);
}

async function resolveByMode(query, sourceMode) {
  console.log('RETRIEVAL.JS FILE VERSION CHECK:', new Date().toISOString());
  console.log('resolveByMode: query="', query, '", sourceMode="', sourceMode, '"');
  const lowerQuery = query.toLowerCase().trim();
  if (sourceMode === 'quran') return resolveQuran(query);
  if (sourceMode === 'tafsir') return resolveTafsir(query);
  if (sourceMode === 'hadith') return resolveHadith(query);

  if (sourceMode === 'general') {
    if (verseKeyFrom(query)) return resolveQuran(query);

    const exactReference = findHadithReference(lowerQuery);
    if (exactReference) return resolveHadith(query);

    const quranResultsPromise = resolveQuran(query);
    const hadithResultsPromise = resolveHadith(query);
    const [quranResults, hadithResults] = await Promise.all([quranResultsPromise, hadithResultsPromise]);
    return [...quranResults, ...hadithResults];
  }
  return [];
}

module.exports = { resolveByMode };
