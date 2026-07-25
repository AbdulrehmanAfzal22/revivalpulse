import { create } from 'zustand';
import { downloadSurah, listDownloads, removeDownload } from 'services/surahAudioCache';
import type { DownloadProgress } from 'types/audioPlayer.types';

function keyOf(reciterId: string, surahId: number): string {
  return `${reciterId}:${surahId}`;
}

interface DownloadsStoreState {
  downloads: Record<string, DownloadProgress>;
  refresh: () => Promise<void>;
  startDownload: (reciterId: string, surahId: number) => Promise<void>;
  remove: (reciterId: string, surahId: number) => Promise<void>;
}

export const useDownloadsStore = create<DownloadsStoreState>((set, get) => ({
  downloads: {},

  refresh: async () => {
    const existing = await listDownloads();
    const downloads: Record<string, DownloadProgress> = {};
    existing.forEach(({ reciterId, surahId }) => {
      downloads[keyOf(reciterId, surahId)] = {
        reciterId,
        surahId,
        status: 'downloaded',
        completedFiles: 1,
        totalFiles: 1,
      };
    });
    set({ downloads });
  },

  startDownload: async (reciterId, surahId) => {
    const key = keyOf(reciterId, surahId);
    set((state) => ({
      downloads: {
        ...state.downloads,
        [key]: { reciterId, surahId, status: 'downloading', completedFiles: 0, totalFiles: 1 },
      },
    }));

    try {
      await downloadSurah(reciterId, surahId, (completedFiles, totalFiles) => {
        set((state) => ({
          downloads: {
            ...state.downloads,
            [key]: { reciterId, surahId, status: 'downloading', completedFiles, totalFiles },
          },
        }));
      });
      set((state) => ({
        downloads: {
          ...state.downloads,
          [key]: { ...state.downloads[key], status: 'downloaded' } as DownloadProgress,
        },
      }));
    } catch {
      set((state) => ({
        downloads: {
          ...state.downloads,
          [key]: { ...state.downloads[key], status: 'error' } as DownloadProgress,
        },
      }));
    }
  },

  remove: async (reciterId, surahId) => {
    await removeDownload(reciterId, surahId);
    const key = keyOf(reciterId, surahId);
    const next = { ...get().downloads };
    delete next[key];
    set({ downloads: next });
  },
}));
