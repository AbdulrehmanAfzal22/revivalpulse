const TYPO_HINTS_ENABLED = false; // Temporary disable: too many false positives on ordinary English text.

const COMMON_ISLAMIC_TERMS = [
  'Allah',
  'Hadith',
  'Hijab',
  'Halal',
  'Haram',
  'Sunnah',
  'Dua',
  'Tafsir',
  'Sahaba',
  'Quran',
  'Masjid',
  'Salah',
  'Zakat',
  'Hajj',
  'Ramadan',
  'Umrah',
  'Adhan',
  'Akhirah',
  'Islam',
  'Muslim',
  'Muslims',
  'Salam',
  'Imaan',
  'Imam',
  'Shariah',
  'Fiqh',
];

const STOP_WORDS = new Set([
  'what', 'when', 'where', 'why', 'who', 'how', 'is', 'are', 'was', 'were', 'the', 'a', 'an',
  'and', 'or', 'of', 'to', 'for', 'in', 'on', 'about', 'with', 'at', 'by', 'from', 'this',
  'that', 'these', 'those', 'it', 'its', 'as', 'be', 'am', 'do', 'does', 'did', 'can', 'could',
  'should', 'would', 'will', 'if', 'then', 'please', 'tell', 'me', 'my', 'we', 'our', 'you',
  'your', 'i', 'he', 'she', 'they', 'them', 'their', 'there', 'here', 'which', 'any', 'some',
]);

const COMMON_VARIANT_ALIASES = {
  hadees: 'Hadith',
  hades: 'Hadith',
  hadeeth: 'Hadith',
  hadeth: 'Hadith',
  hadithh: 'Hadith',
  hijap: 'Hijab',
  hijabb: 'Hijab',
  halaal: 'Halal',
  haramm: 'Haram',
  sunnna: 'Sunnah',
  sunna: 'Sunnah',
  duaa: 'Dua',
  tafseer: 'Tafsir',
  tafsirr: 'Tafsir',
  sahabaa: 'Sahaba',
  sahabah: 'Sahaba',
  quraan: 'Quran',
  masjed: 'Masjid',
  salaah: 'Salah',
  zakattt: 'Zakat',
  hajj: 'Hajj',
  ramdan: 'Ramadan',
};

function normalizeToken(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function levenshteinDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) rows[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
    }
  }

  return rows[a.length][b.length];
}

function detectTypoHint(query) {
  if (!TYPO_HINTS_ENABLED) return null;
  if (typeof query !== 'string' || !query.trim()) return null;

  const words = query.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];

  for (const word of words) {
    const normalizedWord = normalizeToken(word);
    if (!normalizedWord || normalizedWord.length <= 2) continue;
    if (STOP_WORDS.has(normalizedWord.toLowerCase())) continue;

    const exactLower = normalizedWord.toLowerCase();
    if (COMMON_ISLAMIC_TERMS.some((term) => normalizeToken(term) === exactLower)) {
      continue;
    }

    const aliasMatch = COMMON_VARIANT_ALIASES[exactLower];
    if (aliasMatch) {
      return {
        typedWord: word,
        likelyTerm: aliasMatch,
        note: `Note: the word '${word}' closely resembles the Islamic term '${aliasMatch}', but is not an exact match.`,
      };
    }

    let bestMatch = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const term of COMMON_ISLAMIC_TERMS) {
      const normalizedTerm = normalizeToken(term);
      if (!normalizedTerm || normalizedTerm === normalizedWord) continue;

      const distance = levenshteinDistance(normalizedWord, normalizedTerm);
      const threshold = Math.min(3, Math.max(1, Math.ceil(normalizedTerm.length * 0.45)));

      if (distance <= threshold && distance < bestDistance) {
        bestDistance = distance;
        bestMatch = term;
      }
    }

    if (bestMatch) {
      return {
        typedWord: word,
        likelyTerm: bestMatch,
        note: `Note: the word '${word}' closely resembles the Islamic term '${bestMatch}', but is not an exact match.`,
      };
    }
  }

  return null;
}

module.exports = {
  COMMON_ISLAMIC_TERMS,
  detectTypoHint,
};
