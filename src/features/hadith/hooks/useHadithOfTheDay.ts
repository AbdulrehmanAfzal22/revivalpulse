import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getHadithBookContent } from 'api/hadith/hadithClient';
import { HADITH_BOOKS } from 'data/hadith/books';
import type { Hadith } from 'types/hadith.types';

const NAWAWI_40 = HADITH_BOOKS.find((book) => book.slug === 'nawawi40') as (typeof HADITH_BOOKS)[number];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Rotates through Imam Nawawi's Forty Hadith rather than a full book (e.g.
 * Bukhari, ~12MB) — small enough to fetch on every home-page visit, and
 * already a scholar-curated "most essential hadith" set, so no additional
 * judgment call is needed about which of thousands of hadith to feature.
 */
export default function useHadithOfTheDay(): UseQueryResult<Hadith, Error> {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  return useQuery({
    queryKey: ['hadithOfTheDay', dateKey],
    queryFn: async () => {
      const content = await getHadithBookContent(NAWAWI_40);
      const index = dayOfYear(today) % content.hadiths.length;
      return content.hadiths[index] as Hadith;
    },
    staleTime: 1000 * 60 * 60,
  });
}
