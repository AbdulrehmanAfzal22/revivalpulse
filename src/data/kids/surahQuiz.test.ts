import { SURAHS } from 'data/quran/surahs';
import { buildSurahQuizPool, selectSurahQuizQuestions, SURAH_QUIZ_BANKS } from 'data/kids/surahQuiz';

describe('surah quiz banks', () => {
  it('provides an expandable bank of at least 15 unique questions for every surah', () => {
    expect(Object.keys(SURAH_QUIZ_BANKS)).toHaveLength(114);

    SURAHS.forEach((surah) => {
      const questions = buildSurahQuizPool(surah);
      expect(questions.length).toBeGreaterThanOrEqual(15);
      expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
      questions.forEach((question) => {
        expect(question.options).toContain(question.correct);
      });
    });
  });

  it('selects a unique, shuffled five-question attempt from one surah bank', () => {
    const questions = selectSurahQuizQuestions(SURAHS[0]!, [], 5);

    expect(questions).toHaveLength(5);
    expect(new Set(questions.map((question) => question.id)).size).toBe(5);
    questions.forEach((question) => expect(question.options).toContain(question.correct));
  });
});