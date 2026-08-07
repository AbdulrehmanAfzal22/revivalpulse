import type { QuizQuestion } from 'types/quiz.types';

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  CONTENT REVIEW REQUIRED — DO NOT PUBLISH AS-IS  ⚠️              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * This is a STARTER question bank for kids. It is an AI-written scaffolding
 * meant to be REVIEWED — not trusted — for religious and factual accuracy,
 * wording, and age-appropriateness. AI generation CANNOT be the authority
 * for religious content aimed at children.
 *
 * A HUMAN (site owner + knowledgeable reviewer) MUST, before publishing:
 *   1. Verify every question, answer option, and correctIndex against a
 *      reliable source.
 *   2. Confirm wording is appropriate and inviting for the target age.
 *   3. Set QUIZ_CONTENT_REVIEWED to `true` below.
 *
 * Only ship what a reviewer has signed off on. Questions that don't pass
 * review should be removed, not "fixed later".
 */
export const QUIZ_CONTENT_REVIEWED = false;

/**
 * Flagging for any tooling/UI that wants to surface "unreviewed content" as a
 * vignette before a child plays. Consumers can read this constant at runtime.
 */
export const QUIZ_CONTENT_REVIEW_BANNER =
  'Quiz content is a draft pending human review (see src/data/kids/quizBank.ts).';

/**
 * Starter bank — 4 categories, age-appropriate multiple choice. Wording kept
 * short and concrete; options 3-4 so a 5-7 year old isn't overwhelmed.
 */
export const QUIZ_BANK: QuizQuestion[] = [
  // ---- Prophets -------------------------------------------------------
  {
    id: 'prophets-last-prophet',
    prompt: 'Who was the last prophet sent by Allah?',
    options: ['Prophet Musa', 'Prophet Muhammad ﷺ', 'Prophet Nuh', 'Prophet Yunus'],
    correctIndex: 1,
    category: 'prophets',
    difficulty: 'easy',
  },
  {
    id: 'prophets-story-fish',
    prompt: 'Which prophet was kept safe inside a very big fish?',
    options: ['Prophet Yunus', 'Prophet Adam', 'Prophet Ibrahim', 'Prophet Hud'],
    correctIndex: 0,
    category: 'prophets',
    difficulty: 'easy',
  },
  {
    id: 'prophets-kaaba',
    prompt: 'Which prophet helped build the Kaaba in Makkah?',
    options: ['Prophet Nuh', 'Prophet Musa', 'Prophet Ibrahim', 'Prophet Isa'],
    correctIndex: 2,
    category: 'prophets',
    difficulty: 'easy',
  },
  {
    id: 'prophets-quran',
    prompt: 'Who received the Qur’an?',
    options: ['Prophet Musa', 'Prophet Dawud', 'Prophet Isa', 'Prophet Muhammad ﷺ'],
    correctIndex: 3,
    category: 'prophets',
    difficulty: 'easy',
  },
  {
    id: 'prophets-ibrahim-fire',
    prompt: 'Allah made the fire cool and peaceful for which prophet?',
    options: ['Prophet Nuh', 'Prophet Ibrahim', 'Prophet Isa', 'Prophet Yunus'],
    correctIndex: 1,
    category: 'prophets',
    difficulty: 'medium',
  },
  {
    id: 'prophets-zabur',
    prompt: 'Which prophet was given the Zabur (a holy book)?',
    options: ['Prophet Dawud', 'Prophet Musa', 'Prophet Adam', 'Prophet Sulayman'],
    correctIndex: 0,
    category: 'prophets',
    difficulty: 'medium',
  },
  {
    id: 'prophets-mothers',
    prompt: 'Who was the mother of Prophet Isa (Jesus)?',
    options: ['Maryam', 'Hajar', 'Sarah', 'Asiya'],
    correctIndex: 0,
    category: 'prophets',
    difficulty: 'medium',
  },

  // ---- Salah basics ---------------------------------------------------
  {
    id: 'salah-count',
    prompt: 'How many times a day do Muslims pray?',
    options: ['3', '5', '7', '10'],
    correctIndex: 1,
    category: 'salah-basics',
    difficulty: 'easy',
  },
  {
    id: 'salah-direction',
    prompt: 'Which direction do Muslims face when they pray?',
    options: ['Towards the Kaaba', 'Towards the sea', 'Towards the moon', 'Any direction'],
    correctIndex: 0,
    category: 'salah-basics',
    difficulty: 'easy',
  },
  {
    id: 'salah-fajr',
    prompt: 'Which prayer do we pray in the early morning?',
    options: ['Isha', 'Maghrib', 'Fajr', 'Dhuhr'],
    correctIndex: 2,
    category: 'salah-basics',
    difficulty: 'easy',
  },
  {
    id: 'salah-call',
    prompt: 'What do we call the beautiful call that tells us it is time to pray?',
    options: ['The Adhan', 'The Nasheed', 'The Tasbih', 'The Salaam'],
    correctIndex: 0,
    category: 'salah-basics',
    difficulty: 'easy',
  },
  {
    id: 'salah-rakahs',
    prompt: 'How many rak\'ahs (prayer units) does Fajr have?',
    options: ['2', '3', '4', '5'],
    correctIndex: 0,
    category: 'salah-basics',
    difficulty: 'medium',
  },
  {
    id: 'salah-first',
    prompt: 'What is the first thing we say when we start the prayer?',
    options: ['Allahu Akbar', 'Assalamu alaikum', 'Salam', 'Alhamdulillah'],
    correctIndex: 0,
    category: 'salah-basics',
    difficulty: 'medium',
  },

  // ---- Duas -----------------------------------------------------------
  {
    id: 'duas-before-eating',
    prompt: 'What do we say before we start eating?',
    options: ['Assalamu alaikum', 'Bismillah', 'Alhamdulillah', 'Mashallah'],
    correctIndex: 1,
    category: 'duas',
    difficulty: 'easy',
  },
  {
    id: 'duas-sneeze',
    prompt: 'When we sneeze, what should we say?',
    options: ['Alhamdulillah', 'Bismillah', 'Subhanallah', 'Allahu Akbar'],
    correctIndex: 0,
    category: 'duas',
    difficulty: 'easy',
  },
  {
    id: 'duas-after-eating',
    prompt: 'After we finish eating, we say…',
    options: ['Bismillah', 'Alhamdulillah', 'Assalamu alaikum', 'Mashallah'],
    correctIndex: 1,
    category: 'duas',
    difficulty: 'easy',
  },
  {
    id: 'duas-dua-is',
    prompt: 'Talking and asking Allah for help is called…',
    options: ['Dua', 'Adhan', 'Tasbih', 'Jumah'],
    correctIndex: 0,
    category: 'duas',
    difficulty: 'easy',
  },
  {
    id: 'duas-ready-house',
    prompt: 'When we enter our home, what is the beautiful dua to say?',
    options: ['Bismillah', 'Mashallah', 'Allahu Akbar', 'Goodbye'],
    correctIndex: 0,
    category: 'duas',
    difficulty: 'medium',
  },
  {
    id: 'duas-sleep',
    prompt: 'What dua do we say before going to sleep?',
    options: ['La ilaha illallah', 'Bismika Allahumma', 'Allahu Akbar', 'Jumah'],
    correctIndex: 1,
    category: 'duas',
    difficulty: 'medium',
  },

  // ---- Adab (manners) -------------------------------------------------
  {
    id: 'adab-greeting-reply',
    prompt: 'If someone says to you “Assalamu alaikum”, how do you reply?',
    options: ['Wa alaikum assalam', 'Mashallah', 'Alhamdulillah', 'Bismillah'],
    correctIndex: 0,
    category: 'adab',
    difficulty: 'easy',
  },
  {
    id: 'adab-parents',
    prompt: 'We always speak to our parents with…',
    options: ['Loud voices', 'Kindness and respect', 'A grumpy face', 'Shouting'],
    correctIndex: 1,
    category: 'adab',
    difficulty: 'easy',
  },
  {
    id: 'adab-sharing',
    prompt: 'When a friend needs help, the Sunnah says to…',
    options: ['Walk away', 'Help them nicely', 'Ignore them', 'Take their toys'],
    correctIndex: 1,
    category: 'adab',
    difficulty: 'easy',
  },
  {
    id: 'adab-greeting-home',
    prompt: 'When we come home, we should greet our family with…',
    options: ['Assalamu alaikum', 'Nothing at all', 'A big noise', 'Only a wave'],
    correctIndex: 0,
    category: 'adab',
    difficulty: 'easy',
  },
  {
    id: 'adab-louder',
    prompt: 'When someone is talking, it is good to…',
    options: ['Listen carefully', 'Shout over them', 'Walk away', 'Tell them to hush'],
    correctIndex: 0,
    category: 'adab',
    difficulty: 'medium',
  },
  {
    id: 'adab-gift',
    prompt: 'When someone gives us a gift, we say…',
    options: ['Jazakallahu khairan', 'Goodbye', 'I already have one', 'Silently take it'],
    correctIndex: 0,
    category: 'adab',
    difficulty: 'medium',
  },
];

export function quizQuestionsByCategory(category: string): QuizQuestion[] {
  return QUIZ_BANK.filter((question) => question.category === category);
}