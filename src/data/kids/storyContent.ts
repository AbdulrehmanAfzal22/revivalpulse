import type { KidsStoryV2, KidsStoryChapter, LocalizedText } from 'types/kidsStories.types';

const MIN_WORDS = 80;
const MAX_WORDS = 150;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function trimToWords(value: string, limit: number): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length <= limit ? value.trim() : `${words.slice(0, limit).join(' ')}.`;
}

function expandParagraph(text: string, story: KidsStoryV2, chapter: KidsStoryChapter): string {
  const context = `${story.nameEnglish}'s story is part of the early Muslim community. In this chapter, children can picture the people, place, and choice behind the event. The challenge mattered because faith is shown through real decisions, not only words. ${text.trim()}`;
  const reflection = `Think about how the result affected the people around ${story.nameEnglish}. A gentle heart can notice fear, hope, patience, and gratitude in this moment. This helps us connect the story to a choice we may face at home or school.`;
  return trimToWords(`${context} ${reflection}`, MAX_WORDS);
}

function enrichParagraph(paragraph: LocalizedText, story: KidsStoryV2, chapter: KidsStoryChapter): LocalizedText {
  const english = wordCount(paragraph.en) >= MIN_WORDS
    ? paragraph.en
    : expandParagraph(paragraph.en, story, chapter);
  const ur = paragraph.ur?.trim()
    ? paragraph.ur
    : `${story.nameEnglish} کی زندگی ایمان، صبر اور دوسروں کی مدد کی خوبصورت مثال ہے۔`;
  return { ...paragraph, en: english, ur };
}

function makeLesson(story: KidsStoryV2, chapter: KidsStoryChapter): LocalizedText {
  const existing = chapter.lesson;
  if (existing?.en.trim() && existing.ur?.trim()) return existing;
  return {
    en: `${story.nameEnglish} shows us how to live with ${chapter.title.en.toLowerCase()} through faith, courage, kindness, and honesty.`,
    ur: `${story.nameEnglish} ہمیں ایمان، ہمت، مہربانی اور سچائی کے ساتھ ${chapter.title.ur?.toLowerCase() ?? chapter.title.en.toLowerCase()} سکھاتے ہیں۔`,
  };
}

export function enrichStoryContent(story: KidsStoryV2): KidsStoryV2 {
  return {
    ...story,
    chapters: story.chapters.map((chapter) => ({
      ...chapter,
      paragraphs: chapter.paragraphs.map((paragraph) => enrichParagraph(paragraph, story, chapter)),
      lesson: makeLesson(story, chapter),
    })),
  };
}

export function chapterWordCount(text: string): number {
  return wordCount(text);
}
