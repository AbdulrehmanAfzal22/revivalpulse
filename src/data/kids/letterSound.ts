/**
 * Letter Sound Match: Arabic letter sounds for the audio-based matching game.
 * Each letter has its pronunciation name which serves as the "sound" the child hears.
 * In a real implementation, these would map to actual audio files.
 */
import { shuffle } from 'features/kids/games/engineUtils';

export interface LetterSoundItem {
  id: string;
  letter: string;           // The Arabic letter
  name: string;             // The letter's name (e.g., "Alif", "Ba")
  soundKey: string;         // Key for audio file (e.g., "alif", "ba")
  similarSounds: string[];  // Letters with similar sounds for hard mode decoys
  category: 'no-dots' | 'dots';
}

export const LETTER_SOUND_ITEMS: LetterSoundItem[] = [
  { id: 'alif', letter: 'ا', name: 'Alif', soundKey: 'alif', similarSounds: [], category: 'no-dots' },
  { id: 'ba', letter: 'ب', name: 'Ba', soundKey: 'ba', similarSounds: ['ta', 'tha'], category: 'dots' },
  { id: 'ta', letter: 'ت', name: 'Ta', soundKey: 'ta', similarSounds: ['ba', 'tha'], category: 'dots' },
  { id: 'tha', letter: 'ث', name: 'Tha', soundKey: 'tha', similarSounds: ['ba', 'ta'], category: 'dots' },
  { id: 'jim', letter: 'ج', name: 'Jim', soundKey: 'jim', similarSounds: ['ha', 'kha'], category: 'dots' },
  { id: 'ha', letter: 'ح', name: 'Ha', soundKey: 'ha', similarSounds: ['jim', 'kha'], category: 'no-dots' },
  { id: 'kha', letter: 'خ', name: 'Kha', soundKey: 'kha', similarSounds: ['ha', 'jim'], category: 'dots' },
  { id: 'dal', letter: 'د', name: 'Dal', soundKey: 'dal', similarSounds: ['dhal', 'ra'], category: 'no-dots' },
  { id: 'dhal', letter: 'ذ', name: 'Dhal', soundKey: 'dhal', similarSounds: ['dal', 'zay'], category: 'dots' },
  { id: 'ra', letter: 'ر', name: 'Ra', soundKey: 'ra', similarSounds: ['dal', 'zay'], category: 'no-dots' },
  { id: 'zay', letter: 'ز', name: 'Zay', soundKey: 'zay', similarSounds: ['ra', 'dhal'], category: 'dots' },
  { id: 'sin', letter: 'س', name: 'Sin', soundKey: 'sin', similarSounds: ['shin', 'sad'], category: 'no-dots' },
  { id: 'shin', letter: 'ش', name: 'Shin', soundKey: 'shin', similarSounds: ['sin', 'sad'], category: 'dots' },
  { id: 'sad', letter: 'ص', name: 'Sad', soundKey: 'sad', similarSounds: ['sin', 'shin', 'dad'], category: 'no-dots' },
  { id: 'dad', letter: 'ض', name: 'Dad', soundKey: 'dad', similarSounds: ['sad', 'tah'], category: 'dots' },
  { id: 'tah', letter: 'ط', name: 'Tah', soundKey: 'tah', similarSounds: ['dad', 'zah'], category: 'no-dots' },
  { id: 'zah', letter: 'ظ', name: 'Zah', soundKey: 'zah', similarSounds: ['tah', 'ghayn'], category: 'dots' },
  { id: 'ayn', letter: 'ع', name: 'Ayn', soundKey: 'ayn', similarSounds: ['ghayn'], category: 'no-dots' },
  { id: 'ghayn', letter: 'غ', name: 'Ghayn', soundKey: 'ghayn', similarSounds: ['ayn', 'kha'], category: 'dots' },
  { id: 'fa', letter: 'ف', name: 'Fa', soundKey: 'fa', similarSounds: ['qaf'], category: 'dots' },
  { id: 'qaf', letter: 'ق', name: 'Qaf', soundKey: 'qaf', similarSounds: ['fa', 'kaf'], category: 'dots' },
  { id: 'kaf', letter: 'ك', name: 'Kaf', soundKey: 'kaf', similarSounds: ['qaf', 'lam'], category: 'no-dots' },
  { id: 'lam', letter: 'ل', name: 'Lam', soundKey: 'lam', similarSounds: ['kaf', 'mim'], category: 'no-dots' },
  { id: 'mim', letter: 'م', name: 'Mim', soundKey: 'mim', similarSounds: ['lam', 'nun'], category: 'dots' },
  { id: 'nun', letter: 'ن', name: 'Nun', soundKey: 'nun', similarSounds: ['mim'], category: 'dots' },
  { id: 'haa', letter: 'ه', name: 'Haa', soundKey: 'haa', similarSounds: ['ha'], category: 'no-dots' },
  { id: 'waw', letter: 'و', name: 'Waw', soundKey: 'waw', similarSounds: [], category: 'no-dots' },
  { id: 'ya', letter: 'ي', name: 'Ya', soundKey: 'ya', similarSounds: [], category: 'dots' },
];

/** Get a subset of letters for a specific difficulty */
export function getLetterSoundItems(count: number, includeSimilar: boolean = false): LetterSoundItem[] {
  let pool = [...LETTER_SOUND_ITEMS];
  
  if (!includeSimilar) {
    // For easy mode, filter out letters that have very similar sounds to others
    // Keep letters with distinct sounds
    pool = pool.filter(item => item.similarSounds.length <= 1);
  }
  
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}


/** Get decoy letters, with prioritized similar sound letters */
export function getDecoysWithSimilar(
  targetItem: LetterSoundItem,
  pool: LetterSoundItem[],
  totalDecoyCount: number,
  similarCount: number
): LetterSoundItem[] {
  const similarIds = targetItem.similarSounds;
  const similarItems = pool.filter(item => similarIds.includes(item.id));
  const others = pool.filter(
    item => !similarIds.includes(item.id) && item.id !== targetItem.id
  );

  const shuffledSimilar = shuffle([...similarItems]);
  const shuffledOthers = shuffle([...others]);

  const selectedSimilar = shuffledSimilar.slice(0, similarCount);
  const selectedOthers = shuffledOthers.slice(
    0,
    totalDecoyCount - similarCount
  );

  return [...selectedSimilar, ...selectedOthers];
}

/** Get decoy letters that sound similar to the target (for hard mode) */
export function getSimilarSoundDecoys(
  targetItem: LetterSoundItem,
  pool: LetterSoundItem[],
  count: number
): LetterSoundItem[] {
  const similarIds = targetItem.similarSounds;
  const similarItems = pool.filter(item => similarIds.includes(item.id));
  const others = pool.filter(item => !similarIds.includes(item.id) && item.id !== targetItem.id);

  const decoys = [...similarItems, ...others].slice(0, count);
  return decoys;
}

/** Simulate playing a letter sound - in production this would play an audio file */
export function playLetterSound(soundKey: string): void {
  // In a real implementation, this would play an audio file
  // Example: new Audio(`/audio/letters/${soundKey}.mp3`).play();
  console.log(`Playing sound for: ${soundKey}`);
  
  // For now, we'll use speech synthesis as a fallback
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(soundKey);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
}