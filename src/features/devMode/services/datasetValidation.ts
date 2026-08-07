import { SURAHS } from 'data/quran/surahs';
import { HADITH_BOOKS } from 'data/hadith/books';
import { BADGE_DEFINITIONS } from 'data/kids/badges';
import { PROPHET_STORIES, SAHABAH_STORIES } from 'data/kids/stories';
import { validateStoryCitations } from 'data/kids/storyValidation';
import { DUA_CATEGORIES } from 'data/duas';
import { getAlphabetLetters } from 'api/kids/kidsAlphabetClient';
import { getDivineNames } from 'api/namesOfAllah/namesOfAllahClient';
import { getAllDuas } from 'api/duas/duasClient';

export interface DatasetCheck {
  label: string;
  passed: boolean;
  detail: string;
}

function syncChecks(): DatasetCheck[] {
  const totalVerses = SURAHS.reduce((sum, surah) => sum + surah.versesCount, 0);
  const citationIssues = validateStoryCitations();

  return [
    { label: '114 surahs', passed: SURAHS.length === 114, detail: `${SURAHS.length} surahs loaded` },
    { label: '6236 total verses', passed: totalVerses === 6236, detail: `${totalVerses} verses across all surahs` },
    { label: 'Hadith books registered', passed: HADITH_BOOKS.length > 0, detail: `${HADITH_BOOKS.length} books` },
    { label: '6 kids badges', passed: BADGE_DEFINITIONS.length === 6, detail: `${BADGE_DEFINITIONS.length} badges` },
    { label: '25 Quran-named prophets', passed: PROPHET_STORIES.length === 25, detail: `${PROPHET_STORIES.length} prophets` },
    { label: 'Sahabah stories present', passed: SAHABAH_STORIES.length > 0, detail: `${SAHABAH_STORIES.length} companions` },
    { label: '12 dua categories', passed: DUA_CATEGORIES.length === 12, detail: `${DUA_CATEGORIES.length} categories` },
    {
      label: 'Chapter citations complete',
      passed: citationIssues.length === 0,
      detail: citationIssues.length === 0
        ? 'all chapters have non-empty sources'
        : `${citationIssues.length} issues (first: ${citationIssues[0]?.message})`,
    },
  ];
}

async function asyncChecks(): Promise<DatasetCheck[]> {
  const results = await Promise.allSettled([getAlphabetLetters(), getDivineNames(), getAllDuas()]);
  const [letters, names, duas] = results;

  return [
    {
      label: '29 alphabet letters',
      passed: letters.status === 'fulfilled' && letters.value.length === 29,
      detail: letters.status === 'fulfilled' ? `${letters.value.length} letters` : 'failed to load',
    },
    {
      label: '99 names of Allah',
      passed: names.status === 'fulfilled' && names.value.length === 99,
      detail: names.status === 'fulfilled' ? `${names.value.length} names` : 'failed to load',
    },
    {
      label: 'Duas dataset loads',
      passed: duas.status === 'fulfilled' && duas.value.length > 0,
      detail: duas.status === 'fulfilled' ? `${duas.value.length} duas` : 'failed to load',
    },
  ];
}

export async function runDatasetValidation(): Promise<DatasetCheck[]> {
  const async = await asyncChecks();
  return [...syncChecks(), ...async];
}
