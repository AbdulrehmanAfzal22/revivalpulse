import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { embedText } from '../server/embeddings/embedText.js';
import { createVectorStore } from '../server/embeddings/vectorStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const corpusPath = path.join(projectRoot, 'server/embeddings/israrAhmedEmbeddings.json');
const store = createVectorStore(corpusPath);

const ARCHIVE_METADATA_BASE_URL = 'https://archive.org/metadata';
const ARCHIVE_DOWNLOAD_BASE_URL = 'https://archive.org/download';
const SOURCE_LABEL = 'Dr. Israr Ahmed';
const CHUNK_PARAGRAPHS = 3;
const MAX_CHUNK_CHARACTERS = 4500;
const ARCHIVE_ITEMS = [
  'AlKitabDr.IsrarAhmed',
  'BooksOfDrIsrarAhmad',
  'Sheikh-Yameen-Dr-Israr-Ahmad-Books',
  'BU507JamatSheikhUlHindAurTanzeemIslamiDr.IsrarAhmed',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function looksRetryable(message) {
  return /(429|rate limit|quota|RESOURCE_EXHAUSTED|fetch failed|timeout|timed out|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT)/i.test(message);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

function cleanOcrText(text) {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkText(text) {
  const paragraphs = cleanOcrText(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter((paragraph) => paragraph.length > 40);
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const paragraph of paragraphs) {
    const wouldOverflow = current.length >= CHUNK_PARAGRAPHS || currentLength + paragraph.length > MAX_CHUNK_CHARACTERS;
    if (current.length > 0 && wouldOverflow) {
      chunks.push(current.join('\n\n'));
      current = [];
      currentLength = 0;
    }
    current.push(paragraph);
    currentLength += paragraph.length;
  }
  if (current.length > 0) chunks.push(current.join('\n\n'));
  return chunks;
}

function archiveFileUrl(identifier, fileName) {
  return `${ARCHIVE_DOWNLOAD_BASE_URL}/${identifier}/${encodeURIComponent(fileName)}`;
}

async function fetchOcrFiles(identifier) {
  const metadata = await fetchJson(`${ARCHIVE_METADATA_BASE_URL}/${identifier}`);
  const files = (metadata.files ?? [])
    .filter((file) => String(file.name ?? '').endsWith('_djvu.txt'))
    .map((file) => ({
      name: file.name,
      title: path.basename(file.name, '_djvu.txt').replace(/[_-]+/g, ' ').trim(),
      url: archiveFileUrl(identifier, file.name),
    }));
  return { title: metadata.metadata?.title ?? identifier, files };
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

async function embedChunk(entry, existingByKey) {
  const key = `${entry.archiveUrl}\n${entry.chunkText}`;
  if (existingByKey.has(key)) return false;

  let attempt = 0;
  while (true) {
    try {
      const embedding = await embedText(entry.chunkText);
      store.addEntry({ ...entry, embedding });
      existingByKey.add(key);
      return true;
    } catch (error) {
      const message = String(error?.message || error);
      if (!looksRetryable(message)) throw error;
      attempt += 1;
      if (attempt > 8) throw new Error(`Retry budget exhausted for ${entry.bookTitle} chunk: ${message}`);
      const delayMs = 2000 * attempt;
      console.warn(`Retryable embedding error. Retrying in ${delayMs}ms... (attempt ${attempt}/8)`);
      await sleep(delayMs);
    }
  }
}

async function main() {
  const startedAt = Date.now();
  const existing = store.readCorpus();
  const existingByKey = new Set(existing.map((entry) => `${entry.archiveUrl}\n${entry.chunkText}`));
  let processedBooks = 0;
  let processedChunks = 0;
  let skippedChunks = 0;

  console.log(`Starting ${SOURCE_LABEL} embedding: ${existing.length} chunks already present.`);

  for (const identifier of ARCHIVE_ITEMS) {
    let archive;
    try {
      archive = await fetchOcrFiles(identifier);
    } catch (error) {
      console.warn(`[${identifier}] metadata fetch failed: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    if (archive.files.length === 0) {
      console.log(`[${identifier}] no _djvu.txt files found; skipped.`);
      continue;
    }
    console.log(`[${identifier}] discovered ${archive.files.length} OCR books.`);

    for (const file of archive.files) {
      let text;
      try {
        text = await fetchText(file.url);
      } catch (error) {
        console.warn(`[${file.title}] OCR fetch failed: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        console.log(`[${file.title}] no usable OCR paragraphs; skipped.`);
        continue;
      }
      processedBooks += 1;
      for (let index = 0; index < chunks.length; index += 1) {
        const entry = {
          source: SOURCE_LABEL,
          bookTitle: file.title,
          chunkText: chunks[index],
          archiveUrl: file.url,
        };
        if (await embedChunk(entry, existingByKey)) {
          processedChunks += 1;
          console.log(`Embedded ${processedChunks} new chunks (${file.title}, ${index + 1}/${chunks.length})`);
        } else {
          skippedChunks += 1;
        }
      }
    }
  }

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  const fileSize = fs.existsSync(corpusPath) ? fs.statSync(corpusPath).size : 0;
  console.log(`Completed ${SOURCE_LABEL} embedding: ${processedBooks} books processed, ${processedChunks} new chunks, ${skippedChunks} chunks resumed/skipped.`);
  console.log(`Elapsed wall-clock time: ${elapsedSeconds}s`);
  console.log(`Final israrAhmedEmbeddings.json size: ${fileSize} bytes`);
}

main().catch((error) => {
  console.error(`${SOURCE_LABEL} embedding failed:`, error);
  process.exit(1);
});