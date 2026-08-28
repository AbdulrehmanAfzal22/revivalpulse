import { create } from 'zustand';
import type { ReadingModule, ReadingPosition, ReadingPositions } from 'types/readingPosition.types';

const STORAGE_KEY = 'islamic-web:reading-positions:v1';

function loadPositions(): ReadingPositions {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ReadingPositions : {};
  } catch {
    return {};
  }
}

function persistPositions(positions: ReadingPositions): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Reading progress is best-effort when storage is unavailable or full.
  }
}

interface ReadingPositionState {
  positions: ReadingPositions;
  savePosition: (position: ReadingPosition) => void;
}

export const useReadingPositionStore = create<ReadingPositionState>((set) => ({
  positions: loadPositions(),
  savePosition: (position) => set((state) => {
    const positions = { ...state.positions, [position.module]: position };
    persistPositions(positions);
    return { positions };
  }),
}));

export function getReadingPosition(positions: ReadingPositions, module: ReadingModule): ReadingPosition | undefined {
  return positions[module];
}
