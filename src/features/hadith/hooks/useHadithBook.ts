import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getHadithBookContent } from 'api/hadith/hadithClient';
import type { HadithBook, HadithBookContent } from 'types/hadith.types';

export default function useHadithBook(book: HadithBook | undefined): UseQueryResult<HadithBookContent, Error> {
  return useQuery({
    queryKey: ['hadith', 'book', book?.slug],
    queryFn: () => getHadithBookContent(book as HadithBook),
    enabled: Boolean(book),
  });
}
