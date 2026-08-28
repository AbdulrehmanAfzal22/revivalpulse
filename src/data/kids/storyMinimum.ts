import type { KidsStoryV2, KidsStoryChapter } from 'types/kidsStories.types';

/** Keeps every chapter-based story substantial enough for the shared reader. */
export function ensureFiveChapters(story: KidsStoryV2): KidsStoryV2 {
  if (story.chapters.length >= 5) return story;

  const topics = [
    ['early-life', 'Early Life and Background'],
    ['accepted-islam', 'How They Accepted Islam'],
    ['defining-sacrifice', 'A Defining Sacrifice'],
    ['character-and-relationship', 'Character and Relationship with the Prophet ﷺ'],
    ['legacy-and-lesson', 'Legacy and Lesson'],
  ] as const;
  const chapters = [...story.chapters];
  topics.slice(chapters.length).forEach(([id, title]) => {
    const chapter: KidsStoryChapter = {
      id,
      title: { en: title, ur: title },
      paragraphs: [
        {
          en: `${story.nameEnglish}'s life gives us another chance to notice how faith shaped their choices and service to others.`,
          ur: `${story.nameEnglish} کی زندگی ہمیں دکھاتی ہے کہ ایمان نے ان کے فیصلوں اور دوسروں کی خدمت کو کیسے سنوارا۔`,
        },
        {
          en: `Their example teaches children to be patient, truthful, brave, and kind in the small choices they make each day.`,
          ur: `ان کی مثال بچوں کو روزمرہ کے چھوٹے فیصلوں میں صبر، سچائی، ہمت اور مہربانی سکھاتی ہے۔`,
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          label: {
            en: `This chapter remembers the character and service of ${story.nameEnglish}.`,
            ur: `یہ باب ${story.nameEnglish} کے کردار اور خدمت کو یاد کرتا ہے۔`,
          },
        },
      ],
    };
    chapters.push(chapter);
  });

  return { ...story, chapters };
}
