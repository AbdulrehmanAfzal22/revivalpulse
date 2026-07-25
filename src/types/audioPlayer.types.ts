export type LoopMode = 'off' | 'ayah' | 'range' | 'surah';
export type PlaybackSource = 'word' | 'surah' | null;

export interface PlaybackRange {
  startAyah: number;
  endAyah: number;
}

export type DownloadStatus = 'idle' | 'downloading' | 'downloaded' | 'error';

export interface DownloadProgress {
  reciterId: string;
  surahId: number;
  status: DownloadStatus;
  completedFiles: number;
  totalFiles: number;
}
