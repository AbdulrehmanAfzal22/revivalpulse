import type { DivineName } from 'types/namesOfAllah.types';

/** Static, self-hosted — see public/audio/asma-ul-husna/ATTRIBUTION.md for sourcing. */
export async function getDivineNames(): Promise<DivineName[]> {
  const response = await fetch('/data/namesOfAllah.json');
  if (!response.ok) {
    throw new Error(`Failed to load the 99 Names (status ${response.status})`);
  }
  return response.json() as Promise<DivineName[]>;
}
