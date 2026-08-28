import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { embedText } from '../server/embeddings/embedText.js';
import { createVectorStore } from '../server/embeddings/vectorStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const corpusPath = path.join(projectRoot, 'server/embeddings/hadithEmbeddings.json');
const store = createVectorStore(corpusPath);

const HADITH_DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_book';

const HADITH_BOOKS = [
  { slug: 'bukhari', sourcePath: 'the_9_books/bukhari.json', totalHadiths: 7277, id: 1 },
  { slug: 'muslim', sourcePath: 'the_9_books/muslim.json', totalHadiths: 7459, id: 2 },
  { slug: 'abudawud', sourcePath: 'the_9_books/abudawud.json', totalHadiths: 5276, id: 4 },
  { slug: 'tirmidhi', sourcePath: 'the_9_books/tirmidhi.json', totalHadiths: 4053, id: 5 },
  { slug: 'nasai', sourcePath: 'the_9_books/nasai.json', totalHadiths: 5768, id: 3 },
  { slug: 'ibnmajah', sourcePath: 'the_9_books/ibnmajah.json', totalHadiths: 4345, id: 6 },
  { slug: 'malik', sourcePath: 'the_9_books/malik.json', totalHadiths: 1985, id: 7 },
  { slug: 'riyad_assalihin', sourcePath: 'other_books/riyad_assalihin.json', totalHadiths: 1896, id: 13 },
  { slug: 'bulugh_almaram', sourcePath: 'other_books/bulugh_almaram.json', totalHadiths: 1767, id: 17 },
  { slug: 'mishkat_almasabih', sourcePath: 'other_books/mishkat_almasabih.json', totalHadiths: 4428, id: 14 },
  { slug: 'nawawi40', sourcePath: 'forties/nawawi40.json', totalHadiths: 42, id: 10 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readCorpus() {
  return store.readCorpus();
}

function makeReference(collection, bookNumber, hadithNumber) {
  return `${collection}:${Number(bookNumber || 0)}:${Number(hadithNumber || 0)}`;
}

function normalizeGrades(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : item))
      .filter((item) => item !== null && item !== undefined && String(item).trim() !== '');
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (value && typeof value === 'object') {
    return [String(value).trim()].filter(Boolean);
  }

  return [];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

function looksRetryable(message) {
  return /(429|rate limit|quota|RESOURCE_EXHAUSTED|fetch failed|timeout|timed out|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT)/i.test(message);
}

async function main() {
  const startedAt = Date.now();
  const existing = readCorpus();
  const existingByRef = new Map(existing.map((entry) => [makeReference(entry.collection, entry.bookNumber, entry.hadithNumber), entry]));

  const totalHadith = HADITH_BOOKS.reduce((sum, book) => sum + Number(book.totalHadiths || 0), 0);
  let embeddedCount = existing.length;

  console.log(`Starting Hadith embedding: ${existing.length}/${totalHadith} already present across ${HADITH_BOOKS.length} books.`);

  for (const book of HADITH_BOOKS) {
    const data = await fetchJson(`${HADITH_DATA_BASE_URL}/${book.sourcePath}`);
    const hadiths = Array.isArray(data?.hadiths) ? data.hadiths : [];

    for (const hadith of hadiths) {
      const hadithNumber = Number(hadith?.idInBook ?? hadith?.hadithnumber ?? hadith?.number ?? 0);
      const bookNumber = Number(hadith?.bookId ?? book.id ?? 0);
      const text = String(hadith?.english?.text ?? hadith?.text ?? '').trim();
      const reference = makeReference(book.slug, bookNumber, hadithNumber);

      if (!hadithNumber || !text || existingByRef.has(reference)) {
        continue;
      }

      let attempt = 0;
      while (true) {
        try {
          const embedding = await embedText(text);
          const entry = {
            collection: book.slug,
            bookNumber: bookNumber,
            hadithNumber,
            text,
            embedding,
            grades: normalizeGrades(hadith?.grades ?? hadith?.grade ?? hadith?.authenticity ?? hadith?.grading ?? []),
          };

          store.addEntry(entry);
          existingByRef.set(reference, entry);
          embeddedCount += 1;
          console.log(`Embedded ${embeddedCount}/${totalHadith} (${book.slug} #${hadithNumber})`);
          break;
        } catch (error) {
          const message = String(error?.message || error);
          if (looksRetryable(message)) {
            attempt += 1;
            if (attempt > 8) {
              throw new Error(`Retry budget exhausted for ${book.slug} #${hadithNumber}: ${message}`);
            }
            const delayMs = 2000 * attempt;
            console.warn(`Retryable API error for ${book.slug} #${hadithNumber} (${message}). Retrying in ${delayMs}ms... (attempt ${attempt}/8)`);
            await sleep(delayMs);
            continue;
          }
          throw error;
        }
      }
    }
  }

  const fileSize = fs.statSync(corpusPath).size;
  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log(`Completed Hadith embedding: ${embeddedCount}/${totalHadith} hadith embedded.`);
  console.log(`Elapsed wall-clock time: ${elapsedSeconds}s`);
  console.log(`Final hadithEmbeddings.json size: ${fileSize} bytes`);
}

main().catch((error) => {
  const fileSize = fs.existsSync(corpusPath) ? fs.statSync(corpusPath).size : 0;
  console.error('Hadith embedding failed:', error);
  console.error(`Final hadithEmbeddings.json size before exit: ${fileSize} bytes`);
  process.exit(1);
});
