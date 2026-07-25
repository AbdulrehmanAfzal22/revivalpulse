import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { getReciterById } from 'constants/reciters';
import { SURAHS } from 'data/quran/surahs';
import { getChapterRecitation } from 'api/quran/quranClient';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';

interface SurahAudioCacheSchema extends DBSchema {
  files: {
    key: string;
    value: { url: string; blob: Blob };
  };
  downloads: {
    key: string;
    value: { key: string; reciterId: string; surahId: number; fileUrls: string[]; downloadedAt: number };
  };
}

const DB_NAME = 'islamic-web-surah-audio-cache';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SurahAudioCacheSchema>> | null = null;

function getDb(): Promise<IDBPDatabase<SurahAudioCacheSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<SurahAudioCacheSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('files', { keyPath: 'url' });
        db.createObjectStore('downloads', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

function downloadKey(reciterId: string, surahId: number): string {
  return `${reciterId}:${surahId}`;
}

async function urlsForDownload(reciterId: string, surahId: number): Promise<string[]> {
  const reciter = getReciterById(reciterId);
  const surah = SURAHS.find((item) => item.id === surahId);
  if (!reciter || !surah) return [];

  if (reciter.source === 'quran.com') {
    const recitation = await getChapterRecitation(reciter.recitationId, surahId);
    return [recitation.audioUrl];
  }

  return Array.from({ length: surah.versesCount }, (_, index) =>
    buildAyahAudioUrl(reciter.folderName, surahId, index + 1)
  );
}

/** Read-only introspection for the Developer Mode panel. */
export async function getSurahAudioCacheStats(): Promise<{ fileCount: number; downloadCount: number }> {
  const db = await getDb();
  const [fileCount, downloadCount] = await Promise.all([db.count('files'), db.count('downloads')]);
  return { fileCount, downloadCount };
}

/** Returns an object URL if this specific file was downloaded, else null (falls back to network). */
export async function getCachedSurahAudio(url: string): Promise<string | null> {
  const db = await getDb();
  const entry = await db.get('files', url);
  return entry ? URL.createObjectURL(entry.blob) : null;
}

export async function isDownloaded(reciterId: string, surahId: number): Promise<boolean> {
  const db = await getDb();
  const entry = await db.get('downloads', downloadKey(reciterId, surahId));
  return Boolean(entry);
}

export async function listDownloads(): Promise<{ reciterId: string; surahId: number; downloadedAt: number }[]> {
  const db = await getDb();
  const all = await db.getAll('downloads');
  return all.map(({ reciterId, surahId, downloadedAt }) => ({ reciterId, surahId, downloadedAt }));
}

export async function downloadSurah(
  reciterId: string,
  surahId: number,
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const db = await getDb();
  const urls = await urlsForDownload(reciterId, surahId);
  let completed = 0;
  onProgress?.(completed, urls.length);

  for (const url of urls) {
    const existing = await db.get('files', url);
    if (!existing) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download audio (status ${response.status})`);
      const blob = await response.blob();
      await db.put('files', { url, blob });
    }
    completed += 1;
    onProgress?.(completed, urls.length);
  }

  await db.put('downloads', {
    key: downloadKey(reciterId, surahId),
    reciterId,
    surahId,
    fileUrls: urls,
    downloadedAt: Date.now(),
  });
}

export async function removeDownload(reciterId: string, surahId: number): Promise<void> {
  const db = await getDb();
  const key = downloadKey(reciterId, surahId);
  const entry = await db.get('downloads', key);
  if (!entry) return;

  const tx = db.transaction('files', 'readwrite');
  await Promise.all(entry.fileUrls.map((url) => tx.store.delete(url)));
  await tx.done;

  await db.delete('downloads', key);
}
