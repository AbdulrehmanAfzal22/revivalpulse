import { readFile, writeFile } from 'node:fs/promises';

const API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const GRADING_FILE = new URL('../src/data/hadith/grading.ts', import.meta.url);

// These are the local book slugs and their corresponding hadith-api editions.
const COLLECTIONS = [
  ['abudawud', 'abudawud'],
  ['bukhari', 'bukhari'],
  ['muslim', 'muslim'],
  ['nasai', 'nasai'],
  ['ibnmajah', 'ibnmajah'],
  ['malik', 'malik'],
  ['tirmidhi', 'tirmidhi'],
  ['nawawi40', 'nawawi'],
  ['riyad_assalihin', 'riyad_assalihin'],
  ['bulugh_almaram', 'bulugh_almaram'],
  ['mishkat_almasabih', 'mishkat_almasabih'],
];

function normalizeGrade(value) {
  const grade = String(value).toLowerCase();
  if (/da.?if|weak|fabricated|mawdu/.test(grade)) return "Da'if";
  if (grade.includes('sahih')) return 'Sahih';
  if (grade.includes('hasan')) return 'Hasan';
  return null;
}

function addGrades(target, bookSlug, idInBook, grades) {
  const normalized = grades
    .map((entry) => ({ scholar: entry.name, grade: normalizeGrade(entry.grade) }))
    .filter((entry) => entry.scholar && entry.grade);
  if (normalized.length > 0) target[`${bookSlug}:${idInBook}`] = normalized;
}

function seedConsensus(target, bookSlug, count) {
  for (let id = 1; id <= count; id += 1) {
    target[`${bookSlug}:${id}`] = [{ scholar: 'Scholarly consensus', grade: 'Sahih' }];
  }
}

async function fetchCollection(bookSlug, apiSlug) {
  if (bookSlug === 'bukhari' || bookSlug === 'muslim') return null;
  const response = await fetch(`${API_BASE}/editions/eng-${apiSlug}.json`);
  if (response.status === 404) return { status: 'empty', count: 0 };
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const payload = await response.json();
  return { status: 'real', hadiths: payload.hadiths ?? [] };
}

const grades = {};
for (const [bookSlug, apiSlug] of COLLECTIONS) {
  try {
    if (bookSlug === 'bukhari' || bookSlug === 'muslim') {
      const count = bookSlug === 'bukhari' ? 7277 : 7459;
      seedConsensus(grades, bookSlug, count);
      console.log(`[${bookSlug}] Sahih by scholarly consensus: ${count} records`);
      continue;
    }

    const result = await fetchCollection(bookSlug, apiSlug);
    if (!result || result.status === 'empty') {
      console.log(`[${bookSlug}] no grading edition found: empty`);
      continue;
    }

    let gradedCount = 0;
    result.hadiths.forEach((hadith) => {
      if (!Array.isArray(hadith.grades)) return;
      const before = Object.keys(grades).length;
      addGrades(grades, bookSlug, hadith.hadithnumber, hadith.grades);
      if (Object.keys(grades).length > before) gradedCount += 1;
    });
    console.log(`[${bookSlug}] real API grades: ${gradedCount}/${result.hadiths.length} hadiths`);
  } catch (error) {
    console.log(`[${bookSlug}] fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const source = await readFile(GRADING_FILE, 'utf8');
const replacement = `const HADITH_GRADES: Record<string, HadithScholarGrade[]> = ${JSON.stringify(grades, null, 2)};`;
const updated = source.replace(/const HADITH_GRADES: Record<string, HadithScholarGrade\[\]> = \{[\s\S]*?\};/, replacement);
if (updated === source) throw new Error('Could not find the existing HADITH_GRADES initializer');
await writeFile(GRADING_FILE, updated);
console.log(`Wrote ${Object.keys(grades).length} grading records to src/data/hadith/grading.ts`);