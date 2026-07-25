import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getChapterVerses } from 'api/quran/quranClient';
import { TRANSLATIONS } from 'constants/translations';
import type { Ayah } from 'types/quran.types';

const SAHEEH_INTERNATIONAL = TRANSLATIONS.find((item) => item.id === 'saheeh-international');

export default function useBeginnerLessonVerses(surahId: number): UseQueryResult<Ayah[], Error> {
  return useQuery({
    queryKey: ['kidsLessonVerses', surahId],
    queryFn: () => getChapterVerses(surahId, SAHEEH_INTERNATIONAL ? [SAHEEH_INTERNATIONAL] : []),
    staleTime: 1000 * 60 * 60,
  });
}
