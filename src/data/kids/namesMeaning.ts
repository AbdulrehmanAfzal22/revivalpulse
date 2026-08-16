import namesOfAllah from './namesOfAllah.json';

/**
 * 99 Names of Allah with meaning options for the Names Meaning Match game.
 * Each entry has the Arabic name, transliteration, meaning, and decoy meanings.
 */

export interface NamesMeaningItem {
  id: string;
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  /** Array of possible meanings for the matching game (includes correct + decoys) */
  meaningOptions: string[];
}

/** Transform the raw names data into game-ready format */
function transformNamesData(): NamesMeaningItem[] {
  const rawNames = namesOfAllah as Array<{
    number: number;
    arabic: string;
    transliteration: string;
    meaning: string;
    description: string;
    audioUrl: string;
  }>;

  // Pool of all meanings for decoy selection
  const allMeanings = rawNames.map(n => n.meaning);

  return rawNames.map(name => {
    const otherMeanings = allMeanings.filter(m => m !== name.meaning);
    // Shuffle and pick decoys (will be randomized per round in the game)
    const shuffled = [...otherMeanings].sort(() => Math.random() - 0.5);
    const decoys = shuffled.slice(0, 6); // Up to 6 decoys available
    const meaningOptions = [name.meaning, ...decoys];

    return {
      id: `name-${name.number}`,
      number: name.number,
      arabic: name.arabic,
      transliteration: name.transliteration,
      meaning: name.meaning,
      meaningOptions,
    };
  });
}

export const NAMES_OF_ALLAH = transformNamesData();

/** Get a subset of names for a specific difficulty */
export function getNamesMeaningItems(difficulty?: 'easy' | 'medium' | 'hard'): NamesMeaningItem[] {
  let pool = [...NAMES_OF_ALLAH];
  if (difficulty === 'easy') {
    // First 33 names (easier, more well-known)
    pool = pool.slice(0, 33);
  } else if (difficulty === 'medium') {
    // First 66 names
    pool = pool.slice(0, 66);
  }
  // Hard uses all 99
  return pool;
}