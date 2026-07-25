import type { AlphabetLetter } from 'types/kids.types';

export async function getAlphabetLetters(): Promise<AlphabetLetter[]> {
  const response = await fetch('/data/kidsAlphabet.json');
  if (!response.ok) {
    throw new Error(`Failed to load the alphabet (status ${response.status})`);
  }
  return response.json() as Promise<AlphabetLetter[]>;
}
