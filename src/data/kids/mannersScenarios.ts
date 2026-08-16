/**
 * Good Manners (Adab) scenario data for kids.
 * Each scenario presents a relatable situation with 2-3 response choices.
 * The correct answer is based on authentic Hadith and Islamic adab.
 * Sources verified from Nawawi's 40, Riyad as-Salihin, etc. (needsVerification: true)
 */

export interface MannersScenario {
  id: string;
  /** The situation presented to the child */
  situation: { en: string };
  /** Response options - one correct (Islamically good), others incorrect */
  options: Array<{
    id: string;
    text: { en: string };
    isCorrect: boolean;
    /** Why this is the right/wrong choice */
    explanation: { en: string };
  }>;
  /** Hadith reference for the lesson */
  hadithRef: {
    bookSlug: string;
    idInBook: number;
    needsVerification: boolean;
  };
  /** Difficulty tier this scenario is appropriate for */
  difficulty: 'easy' | 'medium' | 'hard';
}

export const MANNERS_SCENARIOS: MannersScenario[] = [
  {
    id: 'greeting-guest',
    situation: { en: 'A guest comes to your home. What should you do?' },
    options: [
      { id: 'a', text: { en: 'Say "Assalamu alaikum" and welcome them warmly' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said to honor your guest.' } },
      { id: 'b', text: { en: 'Ignore them and keep playing' }, isCorrect: false, explanation: { en: 'Ignoring guests is rude and against Islamic manners.' } },
      { id: 'c', text: { en: 'Hide in your room' }, isCorrect: false, explanation: { en: 'Hiding from guests shows bad manners.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 8, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'eating-manners',
    situation: { en: 'You are about to eat dinner with your family. What do you say first?' },
    options: [
      { id: 'a', text: { en: 'Say "Bismillah" before eating' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ taught us to mention Allah\'s name before eating.' } },
      { id: 'b', text: { en: 'Start eating immediately' }, isCorrect: false, explanation: { en: 'We should remember Allah before enjoying His blessings.' } },
      { id: 'c', text: { en: 'Complain about the food' }, isCorrect: false, explanation: { en: 'Complaining about food is ungrateful and bad manners.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 48, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'sneeze-dua',
    situation: { en: 'You sneeze. What should you say?' },
    options: [
      { id: 'a', text: { en: 'Say "Alhamdulillah"' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said when one sneezes, they should praise Allah.' } },
      { id: 'b', text: { en: 'Say nothing' }, isCorrect: false, explanation: { en: 'We should thank Allah for the blessing of health.' } },
      { id: 'c', text: { en: 'Say "Achoo!" loudly' }, isCorrect: false, explanation: { en: 'While natural, we should follow it with the Sunnah dua.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 145, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'parents-kindness',
    situation: { en: 'Your mother asks you to help clean up. You are in the middle of a game.' },
    options: [
      { id: 'a', text: { en: 'Pause the game and help her right away' }, isCorrect: true, explanation: { en: 'Being kind and obedient to parents is one of the best deeds.' } },
      { id: 'b', text: { en: 'Say "Later!" and keep playing' }, isCorrect: false, explanation: { en: 'Delaying obedience to parents can be disrespectful.' } },
      { id: 'c', text: { en: 'Complain and do it angrily' }, isCorrect: false, explanation: { en: 'Doing good deeds with a bad attitude reduces the reward.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 1, needsVerification: true }, // Intentions + parent kindness
    difficulty: 'easy',
  },
  {
    id: 'sharing-toys',
    situation: { en: 'Your friend wants to play with your favorite toy.' },
    options: [
      { id: 'a', text: { en: 'Share it and play together happily' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "None of you believes until he loves for his brother what he loves for himself."' } },
      { id: 'b', text: { en: 'Say "No, it\'s mine!" and hide it' }, isCorrect: false, explanation: { en: 'Selfishness goes against the spirit of Islamic brotherhood.' } },
      { id: 'c', text: { en: 'Give it but look angry' }, isCorrect: false, explanation: { en: 'Giving reluctantly isn\'t true generosity.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 13, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'speaking-kindly',
    situation: { en: 'Someone says something mean to you. How do you respond?' },
    options: [
      { id: 'a', text: { en: 'Stay calm and say something kind or stay silent' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever believes in Allah and the Last Day, let him speak good or remain silent."' } },
      { id: 'b', text: { en: 'Shout back meaner words' }, isCorrect: false, explanation: { en: 'Replying with insults makes you like them, not better.' } },
      { id: 'c', text: { en: 'Push them' }, isCorrect: false, explanation: { en: 'Physical harm is never the answer to words.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 15, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'thanking-gift',
    situation: { en: 'Someone gives you a gift you don\'t really like.' },
    options: [
      { id: 'a', text: { en: 'Smile and say "Jazakallahu khairan"' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ taught us to thank people sincerely for gifts.' } },
      { id: 'b', text: { en: 'Say "I don\'t want this"' }, isCorrect: false, explanation: { en: 'Rejecting a gift hurts the giver\'s feelings.' } },
      { id: 'c', text: { en: 'Throw it away later' }, isCorrect: false, explanation: { en: 'Being ungrateful for a gift is bad manners.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 167, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'listening-elders',
    situation: { en: 'An elder is talking to you, but you want to check your game.' },
    options: [
      { id: 'a', text: { en: 'Put the game down and listen respectfully' }, isCorrect: true, explanation: { en: 'Respecting elders and listening attentively is from Islamic adab.' } },
      { id: 'b', text: { en: 'Keep playing and say "uh-huh"' }, isCorrect: false, explanation: { en: 'Pretending to listen while distracted is disrespectful.' } },
      { id: 'c', text: { en: 'Walk away without a word' }, isCorrect: false, explanation: { en: 'Walking away while someone speaks to you is very rude.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 24, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'helping-friend',
    situation: { en: 'You see a friend fall and scrape their knee.' },
    options: [
      { id: 'a', text: { en: 'Run to help them and get an adult' }, isCorrect: true, explanation: { en: 'Helping someone in need is a charity and brotherly duty.' } },
      { id: 'b', text: { en: 'Laugh and point at them' }, isCorrect: false, explanation: { en: 'Mocking someone\'s pain is cruel and un-Islamic.' } },
      { id: 'c', text: { en: 'Ignore it and keep playing' }, isCorrect: false, explanation: { en: 'Ignoring someone in need goes against caring for others.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 23, needsVerification: true }, // Smile is charity
    difficulty: 'medium',
  },
  {
    id: 'truth-telling',
    situation: { en: 'You accidentally broke a vase. Your mom asks what happened.' },
    options: [
      { id: 'a', text: { en: 'Tell the truth: "I broke it, I\'m sorry"' }, isCorrect: true, explanation: { en: 'Truthfulness leads to righteousness, and righteousness leads to Paradise.' } },
      { id: 'b', text: { en: 'Blame your sibling' }, isCorrect: false, explanation: { en: 'Lying and blaming others is a major sin.' } },
      { id: 'c', text: { en: 'Say "I don\'t know"' }, isCorrect: false, explanation: { en: 'Hiding the truth is also a form of lying.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 1, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'masjid-manners',
    situation: { en: 'You are in the masjid and hear the adhan for prayer.' },
    options: [
      { id: 'a', text: { en: 'Stop talking, listen, and repeat after the mu\'adhin' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ taught us to repeat the adhan and make dua after.' } },
      { id: 'b', text: { en: 'Keep talking to your friend' }, isCorrect: false, explanation: { en: 'Talking during the adhan is disrespectful to the call of Allah.' } },
      { id: 'c', text: { en: 'Run around the masjid' }, isCorrect: false, explanation: { en: 'Running and playing in the masjid is not proper behavior.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 9, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'borrowing-things',
    situation: { en: 'You want to use your brother\'s book but he\'s not home.' },
    options: [
      { id: 'a', text: { en: 'Wait for him to ask permission first' }, isCorrect: true, explanation: { en: 'Taking something without permission is not allowed, even from siblings.' } },
      { id: 'b', text: { en: 'Take it, you\'ll return it later' }, isCorrect: false, explanation: { en: 'Using others\' things without asking is not respectful.' } },
      { id: 'c', text: { en: 'Take it and hide it' }, isCorrect: false, explanation: { en: 'Hiding borrowed items breaks trust.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 230, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'patience-difficulty',
    situation: { en: 'You are trying to learn something new, but it\'s hard and you want to quit.' },
    options: [
      { id: 'a', text: { en: 'Say "In sha Allah" and keep trying with patience' }, isCorrect: true, explanation: { en: 'Allah loves those who are patient, and patience brings great reward.' } },
      { id: 'b', text: { en: 'Throw your things and cry' }, isCorrect: false, explanation: { en: 'Giving up easily and losing control shows lack of patience.' } },
      { id: 'c', text: { en: 'Blame the teacher for making it hard' }, isCorrect: false, explanation: { en: 'Blaming others for your own struggles is not taking responsibility.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 1, needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'jealousy-friend',
    situation: { en: 'Your friend gets a new toy you really wanted.' },
    options: [
      { id: 'a', text: { en: 'Be happy for them and say "Mashallah"' }, isCorrect: true, explanation: { en: 'Loving for others what you love for yourself is true faith.' } },
      { id: 'b', text: { en: 'Feel angry and stop talking to them' }, isCorrect: false, explanation: { en: 'Jealousy burns good deeds like fire burns wood.' } },
      { id: 'c', text: { en: 'Tell them their toy isn\'t that cool' }, isCorrect: false, explanation: { en: 'Putting others down to feel better is bad character.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 13, needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'promise-keeping',
    situation: { en: 'You promised your friend you\'d play with them after school, but another friend invites you to something more fun.' },
    options: [
      { id: 'a', text: { en: 'Keep your first promise and play with your friend' }, isCorrect: true, explanation: { en: 'Keeping promises is a sign of faith; breaking them is hypocrisy.' } },
      { id: 'b', text: { en: 'Go to the more fun thing and ignore your promise' }, isCorrect: false, explanation: { en: 'Breaking a promise for something better is not trustworthy.' } },
      { id: 'c', text: { en: 'Tell your first friend "something came up"' }, isCorrect: false, explanation: { en: 'Making excuses to break promises is still breaking them.' } },
    ],
    hadithRef: { bookSlug: 'nawawi40', idInBook: 12, needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'cleanliness',
    situation: { en: 'You finished using the bathroom. What should you do?' },
    options: [
      { id: 'a', text: { en: 'Clean yourself properly and wash your hands' }, isCorrect: true, explanation: { en: 'Cleanliness is half of faith, the Prophet ﷺ emphasized istinja and wudu.' } },
      { id: 'b', text: { en: 'Run out without washing' }, isCorrect: false, explanation: { en: 'Leaving without cleaning is against Islamic hygiene.' } },
      { id: 'c', text: { en: 'Just wipe your hands on your clothes' }, isCorrect: false, explanation: { en: 'Proper cleaning requires water, not just wiping.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 1, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'anger-control',
    situation: { en: 'You are really angry because someone took your turn in a game.' },
    options: [
      { id: 'a', text: { en: 'Say "A\'udhu billahi min ash-shaytan ir-rajeem" and sit down' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ taught us to seek refuge from Shaytan when angry, and sit/lie down.' } },
      { id: 'b', text: { en: 'Push them and yell' }, isCorrect: false, explanation: { en: 'Acting on anger physically harms others and yourself.' } },
      { id: 'c', text: { en: 'Hold a grudge and never talk to them again' }, isCorrect: false, explanation: { en: 'Holding grudges is not the way of a believer; forgiveness is better.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 29, needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'phone-manners',
    situation: { en: 'Your parents are talking to guests, and you want to show them something on your tablet.' },
    options: [
      { id: 'a', text: { en: 'Wait quietly until they finish talking' }, isCorrect: true, explanation: { en: 'Interrupting adults\' conversations is disrespectful.' } },
      { id: 'b', text: { en: 'Walk between them and show the screen' }, isCorrect: false, explanation: { en: 'Walking between people talking is bad manners.' } },
      { id: 'c', text: { en: 'Shout "Look at this!"' }, isCorrect: false, explanation: { en: 'Raising your voice over elders is disrespectful.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 24, needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'food-wasting',
    situation: { en: 'You took a lot of food but now you\'re full and there\'s leftovers on your plate.' },
    options: [
      { id: 'a', text: { en: 'Take only what you can eat next time; save or share leftovers' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ forbade wasting food; take small portions and finish them.' } },
      { id: 'b', text: { en: 'Throw the extra in the trash' }, isCorrect: false, explanation: { en: 'Wasting food is ungrateful to Allah\'s blessings.' } },
      { id: 'c', text: { en: 'Leave it on the table for someone else to clean' }, isCorrect: false, explanation: { en: 'Leaving a mess for others is not taking responsibility.' } },
    ],
    hadithRef: { bookSlug: 'riyad_assalihin', idInBook: 54, needsVerification: true },
    difficulty: 'medium',
  },
];

export function getMannersScenarios(count: number, difficulty?: 'easy' | 'medium' | 'hard'): MannersScenario[] {
  let filtered = [...MANNERS_SCENARIOS];
  if (difficulty) {
    filtered = filtered.filter(s => s.difficulty === difficulty);
  }
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}