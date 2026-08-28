import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { embedText } from '../server/embeddings/embedText.js';
import { createVectorStore } from '../server/embeddings/vectorStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const corpusPath = path.join(projectRoot, 'server/embeddings/quranEmbeddings.json');
const store = createVectorStore(corpusPath);

const QURAN_API_BASE_URL = 'https://api.quran.com/api/v4';
const TOTAL_VERSES = 6236;
const TRANSLATION_RESOURCE_ID = 20;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readCorpus() {
  return store.readCorpus();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.json();
}

async function fetchVerseList() {
  const allVerses = [];
  for (let chapterNumber = 1; chapterNumber <= 114; chapterNumber += 1) {
    const data = await fetchJson(
      `${QURAN_API_BASE_URL}/verses/by_chapter/${chapterNumber}?language=en&words=false&translations=${TRANSLATION_RESOURCE_ID}&per_page=300`
    );
    const verses = data?.verses || [];
    for (const verse of verses) {
      const translation = verse?.translations?.find((item) => String(item.resource_id) === String(TRANSLATION_RESOURCE_ID))?.text || '';
      if (!translation.trim()) continue;
      allVerses.push({
        reference: verse.verse_key,
        text: translation.trim(),
      });
    }
  }
  return allVerses;
}

function isRetryableEmbeddingError(message) {
  return /429|rate limit|quota|RESOURCE_EXHAUSTED|fetch failed|timeout|timed out|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT/i.test(message);
}

async function embedVerse(reference, text, existingByRef) {
  if (existingByRef.has(reference)) {
    return null;
  }

  try {
    const embedding = await embedText(text);
    const entry = { reference, text, embedding };
    store.addEntry(entry);
    return entry;
  } catch (error) {
    const message = String(error?.message || error);
    if (isRetryableEmbeddingError(message)) {
      throw new Error(`RETRYABLE:${message}`);
    }
    throw error;
  }
}

async function main() {
  const startedAt = Date.now();
  const existing = readCorpus();
  const existingByRef = new Map(existing.map((entry) => [entry.reference, entry]));

  let totalEmbedded = existing.length;
  const allVerses = await fetchVerseList();
  const total = allVerses.length;

  console.log(`Starting Quran embedding: ${existing.length}/${total} already present.`);

  if (allVerses.length !== TOTAL_VERSES) {
    console.warn(`Expected ${TOTAL_VERSES} verses, received ${allVerses.length}. Continuing with actual results.`);
  }

  for (let index = 0; index < allVerses.length; index += 1) {
    const { reference, text } = allVerses[index];
    if (existingByRef.has(reference)) {
      continue;
    }

    let attempt = 0;
    while (true) {
      try {
        const result = await embedVerse(reference, text, existingByRef);
        if (result) {
          existingByRef.set(reference, result);
          totalEmbedded += 1;
          console.log(`Embedded ${totalEmbedded}/${TOTAL_VERSES} (${reference})`);
        }
        break;
      } catch (error) {
        const message = String(error?.message || error);
        if (message.startsWith('RETRYABLE:')) {
          attempt += 1;
          if (attempt > 8) {
            throw new Error(`Retry budget exhausted for ${reference}: ${message}`);
          }
          const delayMs = 2000 * attempt;
          console.warn(`Retryable API error for ${reference} (${message}). Retrying in ${delayMs}ms... (attempt ${attempt}/8)`);
          await sleep(delayMs);
          continue;
        }
        throw error;
      }
    }
  }

  const fileSize = fs.statSync(corpusPath).size;
  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`Completed Quran embedding: ${totalEmbedded}/${TOTAL_VERSES} verses embedded.`);
  console.log(`Elapsed wall-clock time: ${elapsedSeconds}s`);
  console.log(`Final quranEmbeddings.json size: ${fileSize} bytes`);
}

main().catch((error) => {
  console.error('Quran embedding failed:', error);
  process.exit(1);
});
