import { buildTrueFalseDeck, makeFalsePrompt } from 'features/kids/games/trueFalseDeck';
import { TRUE_FALSE_BANK } from 'data/kids/trueFalseBank';
import type { Tier } from 'features/kids/games/difficultyConfig';

const ROUNDS_TO_WIN: Record<Tier, number> = { easy: 8, medium: 8, hard: 12 };
const TIERS: Tier[] = ['easy', 'medium', 'hard'];
const BANK_PROMPTS = new Set(TRUE_FALSE_BANK.map((item) => item.prompt));
const BANK_TRUE_PROMPTS = new Set(
  TRUE_FALSE_BANK.filter((item) => item.answer).map((item) => item.prompt),
);

describe('true/false round generation', () => {
  it('plays 20+ rounds across tiers with a real mix of true and false correct answers', () => {
    const answers: boolean[] = [];
    for (let session = 0; session < 12; session += 1) {
      for (const tier of TIERS) {
        const deck = buildTrueFalseDeck(tier, ROUNDS_TO_WIN[tier]);
        // The game answers `deck[round]` for each round up to roundsToWin.
        for (let round = 0; round < ROUNDS_TO_WIN[tier]; round += 1) {
          answers.push(deck[round % deck.length]?.answer ?? false);
        }
      }
    }

    const played = answers.length;
    const falseAnswers = answers.filter((answer) => !answer).length;
    const trueAnswers = answers.filter(Boolean).length;

    expect(played).toBeGreaterThanOrEqual(20);
    expect(falseAnswers).toBeGreaterThan(0);
    expect(trueAnswers).toBeGreaterThan(0);

    // Roughly half of the rounds must be genuinely false.
    const falseRatio = falseAnswers / played;
    expect(falseRatio).toBeGreaterThanOrEqual(0.3);
    expect(falseRatio).toBeLessThanOrEqual(0.7);
  });

  it('never deals a session of all-true rounds', () => {
    for (const tier of TIERS) {
      for (let session = 0; session < 25; session += 1) {
        const deck = buildTrueFalseDeck(tier, ROUNDS_TO_WIN[tier]);
        expect(deck.some((item) => !item.answer)).toBe(true);
        expect(deck.some((item) => item.answer)).toBe(true);
      }
    }
  });

  it('every generated false variant is a real false statement, never a banked fact', () => {
    const variants: string[] = [];
    for (const tier of TIERS) {
      for (let session = 0; session < 25; session += 1) {
        const deck = buildTrueFalseDeck(tier, ROUNDS_TO_WIN[tier]);
        for (const item of deck) {
          // Generated variants must be new prompts that are not sourced facts
          // from the bank (otherwise it would be a true statement relabelled).
          if (item.id.endsWith('-alt')) {
            expect(item.answer).toBe(false);
            expect(BANK_PROMPTS.has(item.prompt)).toBe(false);
            variants.push(item.prompt);
          }
        }
      }
    }
    // Hard has only 3 authored false statements for 6 false slots, so the
    // generator must have produced variants at least somewhere.
    expect(variants.length).toBeGreaterThan(0);
  });

  it('guards against swap collisions with sourced facts', () => {
    // "Salih (AS) was sent to the people of Thamud." is a sourced TRUE fact;
    // mutating the Nuh statement must never produce it.
    const source = 'Nuh (AS) was sent to the people of Thamud.';
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const mutated = makeFalsePrompt(source, BANK_PROMPTS);
      expect(mutated).not.toBeNull();
      const result = mutated as string;
      expect(result).not.toBe(source);
      expect(BANK_TRUE_PROMPTS.has(result)).toBe(false);
    }
  });

  it('produces statements that read as plausible false claims (spot check)', () => {
    const known = new Set<string>();
    const examples: Array<[string, boolean]> = [
      ['Nuh (AS) built a great ark by the command of Allah.', false],
      ['The Islamic year has twelve months.', false],
      ['Muslims pray five times a day.', false],
      ['Fajr is the prayer at dawn.', false],
      ['The Qur\u2019an has 114 surahs.', false],
      ['Muharram is the first month of the Islamic year.', false],
    ];
    for (const [prompt] of examples) {
      const mutated = makeFalsePrompt(prompt, known);
      expect(mutated).not.toBeNull();
      const result = mutated as string;
      expect(result).not.toBe(prompt);
      known.add(result);
    }
  });

  it('keeps every statement sourced and correctly flagged', () => {
    for (const tier of TIERS) {
      const deck = buildTrueFalseDeck(tier, ROUNDS_TO_WIN[tier]);
      for (const item of deck) {
        expect(item.sources.length).toBeGreaterThan(0);
        expect(item.difficulty).toBe(tier);
        expect(deck.filter((other) => other.prompt === item.prompt)).toHaveLength(1);
      }
    }
  });
});
