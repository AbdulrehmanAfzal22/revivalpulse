import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getHadithBookContent } from 'api/hadith/hadithClient';
import { HADITH_BOOKS } from 'data/hadith/books';
import type { Hadith } from 'types/hadith.types';

export default function useHadithText(bookSlug: string, idInBook: number): UseQueryResult<Hadith | undefined, Error> {
  const book = HADITH_BOOKS.find((item) => item.slug === bookSlug);

  return useQuery({
    queryKey: ['kidsHadithText', bookSlug, idInBook],
    queryFn: async () => {
      const content = await getHadithBookContent(book as (typeof HADITH_BOOKS)[number]);
      return content.hadiths.find((hadith) => hadith.idInBook === idInBook);
    },
    enabled: Boolean(book),
  });
}
