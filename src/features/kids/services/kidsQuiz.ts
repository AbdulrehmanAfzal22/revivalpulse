import type { AlphabetLetter, QuizQuestion } from 'types/kids.types';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/** "Which name matches this letter?" — 4-option multiple choice, correct answer position randomized. */
export function generateAlphabetQuiz(letters: AlphabetLetter[], count: number): QuizQuestion[] {
  const pool = shuffle(letters).slice(0, Math.min(count, letters.length));

  return pool.map((letter) => {
    const distractors = shuffle(letters.filter((item) => item.id !== letter.id)).slice(0, 3);
    const options = shuffle([letter, ...distractors]);
    const correctIndex = options.findIndex((option) => option.id === letter.id);

    return {
      id: letter.id,
      prompt: letter.arabic,
      options: options.map((option) => option.transliteration),
      correctIndex,
    };
  });
}
