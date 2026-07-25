import { getChapterVerses } from 'api/quran/quranClient';
import { getSurahEditionText } from 'api/quran/alQuranCloudClient';
import { TRANSLATIONS } from 'constants/translations';
import type { Ayah, AyahTranslation } from 'types/quran.types';
import type { TranslationResource } from 'types/translation.types';

/** Resolves internal translation ids across both sources and merges into one Ayah[]. */
export async function fetchChapterWithTranslations(
  chapterId: number,
  translationIds: string[]
): Promise<Ayah[]> {
  const resources = translationIds
    .map((id) => TRANSLATIONS.find((translation) => translation.id === id))
    .filter((resource): resource is TranslationResource => Boolean(resource));

  const quranComResources = resources.filter((resource) => resource.source === 'quran.com');
  const cloudResources = resources.filter((resource) => resource.source === 'alquran.cloud');

  const [ayahs, ...cloudTexts] = await Promise.all([
    getChapterVerses(chapterId, quranComResources),
    ...cloudResources.map((resource) => getSurahEditionText(chapterId, String(resource.sourceId))),
  ]);

  if (cloudResources.length === 0) {
    return ayahs;
  }

  return ayahs.map((ayah) => {
    const cloudTranslations: AyahTranslation[] = cloudResources
      .map((resource, index) => {
        const text = cloudTexts[index]?.[ayah.verseNumber];
        return text ? { translationId: resource.id, text } : null;
      })
      .filter((item): item is AyahTranslation => item !== null);

    return { ...ayah, translations: [...ayah.translations, ...cloudTranslations] };
  });
}
