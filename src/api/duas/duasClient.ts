import type { DuaItem } from 'types/duas.types';

/** Static, self-hosted text; audio links out to hisnmuslim.com — see data/duas/index.ts for sourcing. */
export async function getAllDuas(): Promise<DuaItem[]> {
  const response = await fetch('/data/duas.json');
  if (!response.ok) {
    throw new Error(`Failed to load duas (status ${response.status})`);
  }
  return response.json() as Promise<DuaItem[]>;
}
