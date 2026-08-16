import { deckForDifficulty, shuffleOptions } from 'features/kids/components/games/StoryQuizGame';
import { QUIZ_BANK } from 'data/kids/quizBank';
import type { QuizQuestion } from 'types/quiz.types';

const ORIGINAL_BY_ID = new Map(QUIZ_BANK.map((question) => [question.id, question]));

describe('Story Quiz Blitz option shuffling', () => {
  it('plays 15+ rounds with the correct answer moving between positions', () => {
    for (const tier of ['easy', 'medium', 'hard']) {
      const deck = deckForDifficulty(tier);
      const positions = deck.slice(0, 15).map((question) => question.correctIndex);
      expect(positions.length).toBeGreaterThanOrEqual(15);
      // The correct answer must not sit in the same slot every round.
      expect(new Set(positions).size).toBeGreaterThan(1);
    }
  });

  it('never puts every correct answer in slot A across sessions', () => {
    for (let session = 0; session < 20; session += 1) {
      for (const tier of ['easy', 'medium', 'hard']) {
        const deck = deckForDifficulty(tier);
        const positions = new Set(deck.slice(0, 15).map((question) => question.correctIndex));
        expect(positions.size).toBeGreaterThan(1);
      }
    }
  });

  it('remaps correctIndex so it still points at the right option', () => {
    for (const tier of ['easy', 'medium', 'hard']) {
      for (const question of deckForDifficulty(tier)) {
        const original = ORIGINAL_BY_ID.get(question.id);
        expect(original).toBeDefined();
        const source = original as QuizQuestion;
        expect(question.options.length).toBe(source.options.length);
        // Same set of options, just in a new order.
        expect(new Set(question.options)).toEqual(new Set(source.options));
        // The option the kid must pick is still the authored correct one.
        expect(question.options[question.correctIndex]).toBe(source.options[source.correctIndex]);
      }
    }
  });

  it('shuffleOptions is a true permutation with a remapped index', () => {
    const original: QuizQuestion = {
      id: 'test-question',
      prompt: 'Which one is correct?',
      options: ['first', 'second', 'third'],
      correctIndex: 0,
      category: 'test',
      difficulty: 'easy',
      sources: [],
    };
    const seen = new Set<number>();
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const shuffled = shuffleOptions(original);
      expect([...shuffled.options].sort()).toEqual([...original.options].sort());
      expect(shuffled.options[shuffled.correctIndex]).toBe('first');
      expect(shuffled.correctIndex).toBe(shuffled.options.indexOf('first'));
      seen.add(shuffled.correctIndex);
    }
    // Across 100 shuffles the correct answer must land in every slot.
    expect(seen.size).toBe(3);
  });
});
