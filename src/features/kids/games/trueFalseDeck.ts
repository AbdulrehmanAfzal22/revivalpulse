import type { TrueFalseQuestion } from 'types/quiz.types';
import { TRUE_FALSE_BANK } from 'data/kids/trueFalseBank';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { shuffle } from 'features/kids/games/engineUtils';

/**
 * The authored bank is ~99% true statements, so a shuffled deck used to play
 * almost nothing but "true" rounds. This module re-balances the deck at build
 * time: about half of the rounds are turned into genuinely false statements by
 * swapping a name, a number, or an attribute so the sentence claims something
 * that is actually incorrect (never just relabelling a true statement).
 *
 * Every generated prompt is checked against the whole bank first: if the swap
 * would land on a prompt that already exists in the bank (i.e. a known fact,
 * true or false), the swap is rejected and another one is tried. Statements
 * that cannot be mutated safely stay true, so the deck only gets *better*,
 * never wrong.
 */

/** Names that commonly appear in statements, used to produce false swaps. */
const SWAP_NAMES = [
  'Adam', 'Idris', 'Nuh', 'Hud', 'Salih', 'Ibrahim', 'Ismail', 'Ishaq',
  'Yaqub', 'Yusuf', 'Ayyub', 'Shuayb', 'Musa', 'Harun', 'Dawud',
  'Sulayman', 'Yunus', 'Ilyas', 'Zakariyya', 'Yahya', 'Isa', 'Muhammad',
  'Maryam', 'Jibril', 'Khadijah', 'Aisha', 'Abu Bakr', 'Umar', 'Uthman',
  'Ali', 'Fatimah', 'Bilal',
];

/** Islamic months, used to produce false swaps on calendar-style facts. */
const MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal',
  'Jumada al-Thani', 'Rajab', 'Sha\u2019ban', 'Ramadan', 'Shawwal',
  'Dhul-Qa\u2019dah', 'Dhul-Hijjah',
];

/** Swapping a Hajj-month name into a Hajj statement could stay true. */
const HAJJ_MONTHS = ['Shawwal', 'Dhul-Qa\u2019dah', 'Dhul-Hijjah'];

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Jumu\u2019ah', 'Taraweeh', 'Eid al-Fitr', 'Eid al-Adha'];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CITIES = ['Makkah', 'Madinah'];

/** Ordinals (words and digits) are interchangeable to make a false claim. */
const ORDINALS = [
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
  'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth',
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th', '20th', '27th', '29th', '30th',
];

/**
 * Spelled-out counts. A false swap picks a *larger* value: a bigger number
 * turns "has X" / "is X" claims false, and can never accidentally stay true
 * the way a smaller number can ("better than a thousand months" is also
 * "better than a hundred months").
 */
const CARDINALS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, twenty: 20, thirty: 30, hundred: 100,
  thousand: 1000,
};

/**
 * Try to mutate `prompt` so it claims something genuinely false. Returns the
 * mutated prompt, or null when no safe swap exists. Every candidate is checked
 * against `knownPrompts` (the whole bank, true and false) so a generated
 * statement can never collide with a sourced fact.
 */
export function makeFalsePrompt(prompt: string, knownPrompts: Set<string>): string | null {
  const nameSwap = swapAnyToken(prompt, knownPrompts, SWAP_NAMES, (name) => {
    if (name === 'Muhammad' || prompt.includes('peace be upon him')) return false;
    return true;
  });
  if (nameSwap) return nameSwap;

  const monthSwap = swapAnyToken(prompt, knownPrompts, MONTHS, (_month) => true, (replacement) =>
    prompt.includes('Hajj') ? !HAJJ_MONTHS.includes(replacement) : true,
  );
  if (monthSwap) return monthSwap;

  const prayerSwap = swapAnyToken(prompt, knownPrompts, PRAYERS);
  if (prayerSwap) return prayerSwap;

  const weekdaySwap = swapAnyToken(prompt, knownPrompts, WEEKDAYS);
  if (weekdaySwap) return weekdaySwap;

  const citySwap = swapAnyToken(prompt, knownPrompts, CITIES);
  if (citySwap) return citySwap;

  const ordinalSwap = swapAnyToken(prompt, knownPrompts, ORDINALS);
  if (ordinalSwap) return ordinalSwap;

  const cardinalSwap = swapCardinal(prompt, knownPrompts);
  if (cardinalSwap) return cardinalSwap;

  return swapDigit(prompt, knownPrompts);
}

/**
 * Replace every occurrence of one matched token from `pool` with a different
 * token from the same pool, preferring swaps that pass `allowReplacement`.
 * Returns null when no swap yields a prompt that is not already in the bank.
 */
function swapAnyToken(
  prompt: string,
  knownPrompts: Set<string>,
  pool: string[],
  allowToken: (token: string) => boolean = () => true,
  allowReplacement: (replacement: string) => boolean = () => true,
): string | null {
  const matches = pool.filter((token) => prompt.includes(token) && allowToken(token));
  if (matches.length === 0) return null;
  for (const original of shuffle(matches)) {
    const candidates = shuffle(pool.filter((candidate) => candidate !== original && allowReplacement(candidate)));
    for (const replacement of candidates) {
      const candidate = prompt.split(original).join(replacement);
      if (candidate !== prompt && !knownPrompts.has(candidate)) return candidate;
    }
  }
  return null;
}

/** Swap a spelled-out count for a larger one (bigger numbers falsify claims). */
function swapCardinal(prompt: string, knownPrompts: Set<string>): string | null {
  const tokens = Object.keys(CARDINALS).filter((word) => new RegExp(`\\b${word}\\b`).test(prompt));
  for (const original of shuffle(tokens)) {
    const value = CARDINALS[original] as number;
    const replacements = shuffle(
      Object.entries(CARDINALS)
        .filter(([word, number]) => number > value)
        .map(([word]) => word),
    );
    for (const replacement of replacements) {
      const candidate = prompt
        .split(new RegExp(`\\b${original}\\b`))
        .join(replacement);
      if (candidate !== prompt && !knownPrompts.has(candidate)) return candidate;
    }
  }
  return null;
}

/** Swap a bare number (e.g. "114 surahs", "622 CE") for a larger one. */
function swapDigit(prompt: string, knownPrompts: Set<string>): string | null {
  const tokens = [...prompt.matchAll(/\b\d{1,4}\b/g)].map((match) => match[0]);
  for (const original of shuffle(tokens)) {
    for (const offset of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
      const replacement = String(Number(original) + offset);
      const candidate = prompt.split(original).join(replacement);
      if (candidate !== prompt && !knownPrompts.has(candidate)) return candidate;
    }
  }
  return null;
}

/** A false statement derived from `source` by mutating its prompt. */
function falseStatement(source: TrueFalseQuestion, knownPrompts: Set<string>): TrueFalseQuestion | null {
  const mutated = makeFalsePrompt(source.prompt, knownPrompts);
  if (!mutated) return null;
  return {
    ...source,
    id: `${source.id}-alt`,
    prompt: mutated,
    answer: false,
  };
}

/**
 * Build a shuffled deck of `size` statements where roughly half of the rounds
 * carry a genuinely false statement: the rare authored false statements first,
 * then false variants generated from true ones, alternating with true rounds.
 */
export function buildTrueFalseDeck(tier: Tier, size: number): TrueFalseQuestion[] {
  const deckSize = Number.isFinite(size) ? Math.max(1, Math.floor(size)) : 8;
  const pool = TRUE_FALSE_BANK.filter((item) => item.difficulty === tier);
  const effectivePool = pool.length > 0 ? pool : TRUE_FALSE_BANK;

  const trues = shuffle(effectivePool.filter((item) => item.answer));
  const falses = shuffle(effectivePool.filter((item) => !item.answer));
  const knownPrompts = new Set(effectivePool.map((item) => item.prompt));

  const deck: TrueFalseQuestion[] = [];
  const usedPrompts = new Set<string>();

  let falseCursor = 0;
  let trueCursor = 0;
  let wantFalse = true;

  const takeFalse = (): TrueFalseQuestion | null => {
    if (falseCursor < falses.length) {
      const item = falses[falseCursor++];
      if (item && !usedPrompts.has(item.prompt)) return item;
      return null;
    }
    while (trueCursor < trues.length) {
      const source = trues[trueCursor++];
      if (!source) break;
      const variant = falseStatement(source, knownPrompts);
      if (variant && !usedPrompts.has(variant.prompt)) return variant;
    }
    return null;
  };

  const takeTrue = (): TrueFalseQuestion | null => {
    for (const item of trues) {
      if (!usedPrompts.has(item.prompt)) return item;
    }
    return null;
  };

  while (deck.length < deckSize) {
    const next = wantFalse ? takeFalse() : takeTrue();
    if (next) {
      usedPrompts.add(next.prompt);
      deck.push(next);
      wantFalse = !wantFalse;
      continue;
    }
    // No false/variant left to offer — fall back to filling with true rounds.
    if (!wantFalse) break;
    wantFalse = false;
  }

  return shuffle(deck);
}
