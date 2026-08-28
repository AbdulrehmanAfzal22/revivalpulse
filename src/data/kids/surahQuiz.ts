import type { Surah } from 'types/quran.types';
import type { Ayah } from 'types/quran.types';
import { SURAHS } from 'data/quran/surahs';

export interface SurahQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: string;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index]!;
    copy[index] = copy[swapIndex]!;
    copy[swapIndex] = current;
  }
  return copy;
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items));
}

function createBank(surah: Surah): SurahQuizQuestion[] {
  const place = surah.revelationPlace === 'makkah' ? 'Makkah' : 'Madinah';
  const otherCounts = unique([7, 8, 11, 19, 36, 40, 99, 110, 200, 286].map(String).filter((count) => count !== String(surah.versesCount))).slice(0, 3);
  const otherNames = ['The Opener', 'The Night', 'The Morning', 'The Helpers', 'The Clear Sign', 'The Cow']
    .filter((name) => name !== surah.translatedName);
  const theme = `Learning about ${surah.translatedName.toLowerCase()}`;
  const pool: SurahQuizQuestion[] = [
    { id: `${surah.id}-meaning`, prompt: `What does ${surah.nameSimple} mean?`, options: shuffle([surah.translatedName, ...otherNames.slice(0, 3)]), correct: surah.translatedName },
    { id: `${surah.id}-count`, prompt: `How many verses are in ${surah.nameSimple}?`, options: shuffle([String(surah.versesCount), ...otherCounts]), correct: String(surah.versesCount) },
    { id: `${surah.id}-place`, prompt: `Where was ${surah.nameSimple} revealed?`, options: shuffle([place, place === 'Makkah' ? 'Madinah' : 'Makkah', 'Taif', 'Jerusalem']), correct: place },
    { id: `${surah.id}-theme`, prompt: `Which idea fits ${surah.nameSimple} best?`, options: shuffle([theme, 'Building a palace', 'Counting stars', 'Sailing a ship']), correct: theme },
    { id: `${surah.id}-remember`, prompt: `What should we do after learning ${surah.nameSimple}?`, options: shuffle(['Listen to Allah and practise goodness', 'Forget what we learned', 'Keep knowledge secret', 'Stop asking questions']), correct: 'Listen to Allah and practise goodness' },
    { id: `${surah.id}-word`, prompt: `Which name belongs to this lesson?`, options: shuffle([surah.nameSimple, 'Al-Bahr', 'Al-Jabal', 'An-Nahr']), correct: surah.nameSimple },
    { id: `${surah.id}-opening`, prompt: `What words do we find at the start of this lesson?`, options: ['The opening verse', 'A shopping list', 'A weather report', 'A game score'], correct: 'The opening verse' },
    { id: `${surah.id}-true-place`, prompt: `True or false: ${surah.nameSimple} was revealed in ${place}.`, options: shuffle(['True', 'False', 'Only at night', 'We cannot know']), correct: 'True' },
    { id: `${surah.id}-verse-count`, prompt: `Complete this: ${surah.nameSimple} has _____ verses.`, options: shuffle([String(surah.versesCount), ...otherCounts]), correct: String(surah.versesCount) },
    { id: `${surah.id}-kindness`, prompt: `What character does Quran learning help us practise?`, options: shuffle(['Kindness and courage', 'Pride and shouting', 'Carelessness and hurry', 'Keeping away from everyone']), correct: 'Kindness and courage' },
    { id: `${surah.id}-faith`, prompt: `Who sent the Quran as guidance?`, options: shuffle(['Allah', 'A mountain', 'A king', 'A traveller']), correct: 'Allah' },
    { id: `${surah.id}-read`, prompt: `What is a good way to learn a surah?`, options: shuffle(['Read, listen, and think about its meaning', 'Rush without listening', 'Only look at the title', 'Skip every verse']), correct: 'Read, listen, and think about its meaning' },
    { id: `${surah.id}-community`, prompt: `How can a surah help a family?`, options: shuffle(['It gives reminders for good choices', 'It makes chores disappear', 'It teaches secret tricks', 'It replaces kindness']), correct: 'It gives reminders for good choices' },
    { id: `${surah.id}-memory`, prompt: `What helps us remember Quran words?`, options: shuffle(['Gentle repetition and understanding', 'Never opening the Quran', 'Only guessing', 'Being unkind']), correct: 'Gentle repetition and understanding' },
    { id: `${surah.id}-guide`, prompt: `The Quran is a guide for which part of life?`, options: shuffle(['Our words, choices, and hearts', 'Only bedtime', 'Only travelling', 'Only drawing']), correct: 'Our words, choices, and hearts' },
    { id: `${surah.id}-lesson`, prompt: `What is the heart of this Surah lesson?`, options: shuffle(['Faith should lead to good actions', 'Winning every argument', 'Being famous', 'Collecting things']), correct: 'Faith should lead to good actions' },
    { id: `${surah.id}-share`, prompt: `What can we share after learning ${surah.nameSimple}?`, options: shuffle(['A kind lesson with our family', 'A mean joke', 'A made-up verse', 'Nothing at all']), correct: 'A kind lesson with our family' },
  ];
  return pool;
}

/** One independently expandable question bank for every chapter. */
export const SURAH_QUIZ_BANKS: Record<number, SurahQuizQuestion[]> = Object.fromEntries(
  SURAHS.map((surah) => [surah.id, createBank(surah)])
);

export function buildSurahQuizPool(surah: Surah, verses: Ayah[] = []): SurahQuizQuestion[] {
  const bank = SURAH_QUIZ_BANKS[surah.id] ?? createBank(surah);
  const firstTranslation = verses[0]?.translations[0]?.text;
  if (!firstTranslation) return bank;

  return bank.map((question) => question.id.endsWith('-opening')
    ? { ...question, options: shuffle([firstTranslation.slice(0, 42), 'A shopping list', 'A weather report', 'A game score']), correct: firstTranslation.slice(0, 42) }
    : question);
}

export function selectSurahQuizQuestions(surah: Surah, verses: Ayah[] = [], count = 5): SurahQuizQuestion[] {
  return shuffle(buildSurahQuizPool(surah, verses)).slice(0, count).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}
