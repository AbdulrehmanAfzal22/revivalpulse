/**
 * Cause and Effect: Good Deeds scenarios for kids.
 * Each scenario presents a situation and the child picks the outcome that actually follows.
 *
 * Content standard (the same as the rest of the Islamic content in this project):
 *  - The pool is 100+ scenarios so a child never repeats a round in normal play.
 *  - Every scenario, every "correct" outcome, and every explanation is grounded in
 *    the Quran or an authentic, well-known hadith. No invented consequences, no
 *    misrepresentations of Islamic teaching. `needsVerification` stays true so the
 *    references are re-checked before they are ever presented as verified.
 */

export interface CauseEffectScenario {
  id: string;
  situation: { en: string; ur?: string };
  options: Array<{
    id: string;
    text: { en: string; ur?: string };
    isCorrect: boolean;
    explanation: { en: string };
  }>;
  /** Hadith/Quran source for the lesson */
  source: {
    type: 'quran' | 'hadith' | 'scholar';
    reference: string;
    needsVerification: boolean;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export const CAUSE_EFFECT_SCENARIOS: CauseEffectScenario[] = [
  {
    id: 'sharing-toy',
    situation: { en: 'You share your favorite toy with your little sister.' },
    options: [
      { id: 'a', text: { en: 'Allah loves you more and gives you something better' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "None of you believes until he loves for his brother what he loves for himself."' } },
      { id: 'b', text: { en: 'You lose the toy forever' }, isCorrect: false, explanation: { en: 'Sharing doesn\'t mean losing; Allah replaces what you give for His sake.' } },
      { id: 'c', text: { en: 'Your sister breaks it and you get nothing' }, isCorrect: false, explanation: { en: 'Even if it breaks, the reward for sharing is with Allah.' } },
    ],
    source: { type: 'hadith', reference: 'Nawawi 40, Hadith 13', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'saying-bismillah',
    situation: { en: 'You say "Bismillah" before eating your lunch.' },
    options: [
      { id: 'a', text: { en: 'Shaytan cannot share in your food' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "When one of you eats, let him mention Allah\'s name. If he forgets, let him say: Bismillah awwalahu wa akhirahu."' } },
      { id: 'b', text: { en: 'The food tastes different' }, isCorrect: false, explanation: { en: 'The blessing is spiritual, not necessarily a taste change.' } },
      { id: 'c', text: { en: 'You get full faster' }, isCorrect: false, explanation: { en: 'Saying Bismillah brings barakah (blessing), not physical fullness.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1859', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'helping-parent',
    situation: { en: 'You help your mom carry groceries without being asked.' },
    options: [
      { id: 'a', text: { en: 'Allah writes a good deed for you and raises your rank' }, isCorrect: true, explanation: { en: 'Being kind to parents is one of the best deeds. The Prophet ﷺ said: "The pleasure of Allah is in the pleasure of the father."' } },
      { id: 'b', text: { en: 'Your mom gives you candy' }, isCorrect: false, explanation: { en: 'The real reward is from Allah, not just worldly treats.' } },
      { id: 'c', text: { en: 'You get tired and it\'s not worth it' }, isCorrect: false, explanation: { en: 'The effort spent in obedience to parents is never wasted.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1899', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'telling-truth',
    situation: { en: 'You accidentally broke a cup and tell your dad the truth.' },
    options: [
      { id: 'a', text: { en: 'Your dad forgives you and Allah loves your honesty' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Truthfulness leads to righteousness, and righteousness leads to Paradise."' } },
      { id: 'b', text: { en: 'You get punished severely' }, isCorrect: false, explanation: { en: 'Honesty is praised in Islam; punishment for accidental mistakes after confession is not the Sunnah.' } },
      { id: 'c', text: { en: 'Nothing happens, it doesn\'t matter' }, isCorrect: false, explanation: { en: 'Every truthful word is recorded and rewarded by Allah.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6094', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'making-wudu',
    situation: { en: 'You make wudu carefully before prayer, even though you\'re in a hurry.' },
    options: [
      { id: 'a', text: { en: 'Your sins wash away with the water' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "When a Muslim washes his face in wudu, every sin he looked at with his eyes leaves with the water."' } },
      { id: 'b', text: { en: 'You\'re just wet, nothing special happens' }, isCorrect: false, explanation: { en: 'Wudu has spiritual effects beyond physical cleanliness.' } },
      { id: 'c', text: { en: 'You waste time and miss the prayer' }, isCorrect: false, explanation: { en: 'Proper wudu is part of the prayer, not a delay.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 244', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'saying-alhamdulillah',
    situation: { en: 'Something good happens and you say "Alhamdulillah" sincerely.' },
    options: [
      { id: 'a', text: { en: 'Allah increases your blessings' }, isCorrect: true, explanation: { en: 'Allah says in the Quran: "If you are grateful, I will surely increase you [in favor]." (14:7)' } },
      { id: 'b', text: { en: 'People think you\'re polite' }, isCorrect: false, explanation: { en: 'The reward is from Allah, not people\'s opinions.' } },
      { id: 'c', text: { en: 'Nothing changes' }, isCorrect: false, explanation: { en: 'Gratitude brings increase; ingratitude risks loss of blessings.' } },
    ],
    source: { type: 'quran', reference: '14:7', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'forgiving-friend',
    situation: { en: 'Your friend says something mean, but you forgive them instead of getting angry.' },
    options: [
      { id: 'a', text: { en: 'Allah forgives your sins and gives you peace in your heart' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever pardons others, Allah will pardon him." Forgiveness brings inner peace.' } },
      { id: 'b', text: { en: 'Your friend keeps being mean' }, isCorrect: false, explanation: { en: 'Forgiveness doesn\'t mean accepting bad behavior; it means letting go of anger for Allah\'s sake.' } },
      { id: 'c', text: { en: 'You look weak' }, isCorrect: false, explanation: { en: 'Forgiveness is strength; the Prophet ﷺ said the strong one controls himself when angry.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1996', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'reading-quran',
    situation: { en: 'You read one page of Quran every day after school.' },
    options: [
      { id: 'a', text: { en: 'Each letter gives you 10 rewards, and the Quran intercedes for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever reads a letter from the Quran gets a good deed, and each good deed is multiplied by ten."' } },
      { id: 'b', text: { en: 'You finish the Quran quickly' }, isCorrect: false, explanation: { en: 'Speed isn\'t the goal; consistency and reflection are.' } },
      { id: 'c', text: { en: 'It\'s boring and you stop after a week' }, isCorrect: false, explanation: { en: 'With sincere intention, Allah makes it easy and beloved to you.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2910', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'being-kind-to-animals',
    situation: { en: 'You see a thirsty cat and give it water.' },
    options: [
      { id: 'a', text: { en: 'Allah forgives you and admits you to Paradise' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ told of a man who gave water to a thirsty dog; Allah forgave him. Another woman was punished for starving a cat.' } },
      { id: 'b', text: { en: 'The cat follows you home' }, isCorrect: false, explanation: { en: 'The reward is from Allah, not the animal\'s reaction.' } },
      { id: 'c', text: { en: 'You waste your water' }, isCorrect: false, explanation: { en: 'Kindness to Allah\'s creation is never wasted.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 3321', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'patience-in-hardship',
    situation: { en: 'You lose your favorite toy but you say "Inna lillahi wa inna ilayhi raji\'un" and stay patient.' },
    options: [
      { id: 'a', text: { en: 'Allah replaces it with something better and gives you a house in Paradise' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "No Muslim is afflicted by a hardship... but Allah expiates his sins thereby." Also: "Whoever says Inna lillahi... Allah will compensate him with better."' } },
      { id: 'b', text: { en: 'You just lost your toy forever' }, isCorrect: false, explanation: { en: 'Patience transforms loss into spiritual gain.' } },
      { id: 'c', text: { en: 'You pretend it doesn\'t hurt' }, isCorrect: false, explanation: { en: 'Patience isn\'t denying feelings; it\'s trusting Allah despite them.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 918', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'standing-up-for-truth',
    situation: { en: 'Everyone is cheating on a test, but you don\'t cheat even though you could.' },
    options: [
      { id: 'a', text: { en: 'Allah is pleased with you and your integrity becomes a light for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Fear Allah wherever you are." Standing for truth when alone is true Taqwa.' } },
      { id: 'b', text: { en: 'You get a bad grade and everyone laughs' }, isCorrect: false, explanation: { en: 'Worldly loss for Allah\'s sake is actually eternal gain.' } },
      { id: 'c', text: { en: 'It doesn\'t matter, everyone does it' }, isCorrect: false, explanation: { en: 'Following the crowd in wrongdoing doesn\'t make it right.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1987', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'making-dua-for-others',
    situation: { en: 'Your friend is sick, so you make dua for them in sujood.' },
    options: [
      { id: 'a', text: { en: 'The angels say "Ameen, and for you the same" and Allah accepts it' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The dua of a Muslim for his brother in his absence is answered. An angel says: Ameen, and for you the same."' } },
      { id: 'b', text: { en: 'Your friend gets better immediately' }, isCorrect: false, explanation: { en: 'Dua is answered in Allah\'s wisdom and timing, not always instantly.' } },
      { id: 'c', text: { en: 'Nothing happens because you\'re just a kid' }, isCorrect: false, explanation: { en: 'The dua of a sincere child is very powerful to Allah.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2732', needsVerification: true },
    difficulty: 'hard',
  },

  // ---------------------------------------------------------------------------
  // EASY — everyday actions, clear simple outcomes
  // ---------------------------------------------------------------------------
  {
    id: 'sneezing-alhamdulillah',
    situation: { en: 'You sneeze and say "Alhamdulillah".' },
    options: [
      { id: 'a', text: { en: 'The Muslim next to you replies "Yarhamukallah" — May Allah have mercy on you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ taught that when someone sneezes and praises Allah, the one who hears it should reply: "Yarhamukallah."' } },
      { id: 'b', text: { en: 'Everyone claps' }, isCorrect: false, explanation: { en: 'The reply to a sneezer is a du\'a for mercy, not applause.' } },
      { id: 'c', text: { en: 'You must stay quiet all day' }, isCorrect: false, explanation: { en: 'Sneezing is natural; praising Allah after it is the Sunnah.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6224', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'not-stealing-when-alone',
    situation: { en: 'You really want a toy in the shop and nobody is looking.' },
    options: [
      { id: 'a', text: { en: 'You leave it — Allah sees everything you do' }, isCorrect: true, explanation: { en: 'Allah says: "And Allah is All-Seeing of what you do" (57:4). Taking what is not yours is a major sin, even when no one sees.' } },
      { id: 'b', text: { en: 'You slip it in your pocket quickly' }, isCorrect: false, explanation: { en: 'Allah sees even what people don\'t; stealing is never hidden from Him.' } },
      { id: 'c', text: { en: 'You take it and say sorry later' }, isCorrect: false, explanation: { en: 'Saying sorry later doesn\'t make taking something that isn\'t yours okay.' } },
    ],
    source: { type: 'quran', reference: '57:4', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'sharing-dates',
    situation: { en: 'You have a pack of dates and your friend comes to visit.' },
    options: [
      { id: 'a', text: { en: 'You share half — Allah loves those who share' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ encouraged feeding others: "O people, spread salam, feed the hungry... and you will enter Paradise."' } },
      { id: 'b', text: { en: 'You eat them all before your friend arrives' }, isCorrect: false, explanation: { en: 'Keeping everything for yourself misses the reward of sharing.' } },
      { id: 'c', text: { en: 'You hide them under the bed' }, isCorrect: false, explanation: { en: 'Sharing brings love and reward; hiding brings neither.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2485', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'saying-salam-first',
    situation: { en: 'You meet your cousin and say "Assalamu alaykum" first.' },
    options: [
      { id: 'a', text: { en: 'He replies and you are the best to Allah by starting the salam' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The best of people to Allah are those who initiate the greeting of salam."' } },
      { id: 'b', text: { en: 'You wasted your words' }, isCorrect: false, explanation: { en: 'Every salam is a dua for peace and a good deed.' } },
      { id: 'c', text: { en: 'Only grown-ups can say salam first' }, isCorrect: false, explanation: { en: 'Anyone can start with salam; it is loved from children too.' } },
    ],
    source: { type: 'hadith', reference: 'Abu Dawud 5197', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'gentle-with-baby',
    situation: { en: 'Your baby cousin pulls your hair.' },
    options: [
      { id: 'a', text: { en: 'You stay calm and gentle with him' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "He who does not show mercy to the young is not one of us."' } },
      { id: 'b', text: { en: 'You pull his hair back' }, isCorrect: false, explanation: { en: 'Hitting or hurting back is not how the Prophet ﷺ taught us to treat the young.' } },
      { id: 'c', text: { en: 'You scream at him loudly' }, isCorrect: false, explanation: { en: 'Babies don\'t mean harm; kindness is the way of the Prophet ﷺ.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1920', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'cleaning-toys',
    situation: { en: 'After playing, you put your toys back in the box.' },
    options: [
      { id: 'a', text: { en: 'Your home stays clean and you gain the reward of cleanliness' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Purity is half of faith." Keeping your home clean is part of that.' } },
      { id: 'b', text: { en: 'You lose your toys' }, isCorrect: false, explanation: { en: 'Tidying up actually protects your toys.' } },
      { id: 'c', text: { en: 'It\'s only for your mom to do' }, isCorrect: false, explanation: { en: 'Helping keep the home clean is a beautiful act for everyone.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 223', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'kind-word-instead-of-mean',
    situation: { en: 'You feel like saying a mean word to your sister.' },
    options: [
      { id: 'a', text: { en: 'You say something kind instead — a good word is charity' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "A good word is sadaqah (charity)."' } },
      { id: 'b', text: { en: 'You say the mean word loudly' }, isCorrect: false, explanation: { en: 'Harsh words hurt and erase the reward of good deeds; the believer guards his tongue.' } },
      { id: 'c', text: { en: 'Mean words make you stronger' }, isCorrect: false, explanation: { en: 'Strength is controlling the tongue, not hurting others.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 2989', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'smiling-at-sad-friend',
    situation: { en: 'Your friend looks sad, so you smile at him.' },
    options: [
      { id: 'a', text: { en: 'Your smile is a charity and may cheer him up' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Your smile in the face of your brother is charity."' } },
      { id: 'b', text: { en: 'A smile does nothing for anyone' }, isCorrect: false, explanation: { en: 'A kind smile can change someone\'s whole day.' } },
      { id: 'c', text: { en: 'You should have laughed at him instead' }, isCorrect: false, explanation: { en: 'Laughing at someone who is sad is the opposite of kindness.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1956', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'waking-for-fajr',
    situation: { en: 'Your alarm rings for Fajr and you get up to pray.' },
    options: [
      { id: 'a', text: { en: 'You are promised Paradise for praying before sunrise' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever prays before the sun rises (Fajr) and before it sets (Asr) will enter Paradise."' } },
      { id: 'b', text: { en: 'Praying early makes you more tired' }, isCorrect: false, explanation: { en: 'Fajr brings barakah to the whole day; the early morning is blessed.' } },
      { id: 'c', text: { en: 'You can catch up at night instead' }, isCorrect: false, explanation: { en: 'Each prayer has its own time; the reward of Fajr in its time is special.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 574', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'saying-jazakallah',
    situation: { en: 'Someone helps you carry your heavy bag.' },
    options: [
      { id: 'a', text: { en: 'You say "Jazakallahu khairan" — May Allah reward you with good' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever is done a favour, let him repay it, and if he cannot, let him praise (dua) for him: Jazakallahu khairan."' } },
      { id: 'b', text: { en: 'You say nothing and walk away' }, isCorrect: false, explanation: { en: 'Thanking and making dua for the helper is part of good manners.' } },
      { id: 'c', text: { en: 'You tell them to carry it faster' }, isCorrect: false, explanation: { en: 'The one who helps deserves thanks and kindness.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2034', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'drinking-water-sitting',
    situation: { en: 'You are very thirsty and reach for a glass of water.' },
    options: [
      { id: 'a', text: { en: 'You sit and drink it with your right hand' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ forbade drinking while standing and drank with his right hand, and taught us the same.' } },
      { id: 'b', text: { en: 'You gulp it down standing' }, isCorrect: false, explanation: { en: 'Drinking while sitting was the way of the Prophet ﷺ.' } },
      { id: 'c', text: { en: 'You drink with your left hand' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ said: "Eat with your right hand and drink with your right hand, for Shaytan eats and drinks with his left."' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2021', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'eating-with-right-hand',
    situation: { en: 'You sit down to eat your lunch.' },
    options: [
      { id: 'a', text: { en: 'You eat with your right hand and begin with Bismillah' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Mention Allah\'s name, eat with your right hand, and eat from what is in front of you."' } },
      { id: 'b', text: { en: 'You eat with your left hand' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ told the boy Umar ibn Abi Salamah to eat with his right hand.' } },
      { id: 'c', text: { en: 'You eat as fast as you can, standing' }, isCorrect: false, explanation: { en: 'Eating calmly while sitting, starting with Allah\'s name, is the Sunnah.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2020', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'giving-thirsty-drink',
    situation: { en: 'Your little brother is thirsty, so you bring him water.' },
    options: [
      { id: 'a', text: { en: 'Allah counts your kindness as a good deed' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Every act of kindness is charity." Serving water to a thirsty person is a great kindness.' } },
      { id: 'b', text: { en: 'You\'re too small to get any reward' }, isCorrect: false, explanation: { en: 'No one is too small for Allah\'s reward; deeds count for everyone.' } },
      { id: 'c', text: { en: 'Only parents get the reward' }, isCorrect: false, explanation: { en: 'Every person is rewarded for his own kindness.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6027', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'saying-inshaallah',
    situation: { en: 'You tell your friend you will visit him tomorrow.' },
    options: [
      { id: 'a', text: { en: 'You say "InshaAllah" — if Allah wills' }, isCorrect: true, explanation: { en: 'Allah tells us in the Quran: "Do not say about anything: I will do that tomorrow, unless Allah wills." (18:23-24)' } },
      { id: 'b', text: { en: 'You say it without Allah\'s name' }, isCorrect: false, explanation: { en: 'Saying InshaAllah reminds us that nothing happens without Allah\'s will.' } },
      { id: 'c', text: { en: 'You say "maybe" but not InshaAllah' }, isCorrect: false, explanation: { en: 'The Quran teaches us to tie our plans to Allah\'s will.' } },
    ],
    source: { type: 'quran', reference: '18:23-24', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'not-wasting-bread',
    situation: { en: 'A piece of bread falls on the floor at lunch.' },
    options: [
      { id: 'a', text: { en: 'You pick it up cleanly and don\'t waste the food' }, isCorrect: true, explanation: { en: 'Allah says: "Eat and drink, but waste not by extravagance — surely He does not love the wasteful." (7:31)' } },
      { id: 'b', text: { en: 'You throw it in the bin — there\'s plenty more' }, isCorrect: false, explanation: { en: 'Wasting food is not from the way of the Prophet ﷺ.' } },
      { id: 'c', text: { en: 'You leave it on the floor' }, isCorrect: false, explanation: { en: 'Leaving food on the floor is both wasteful and unclean.' } },
    ],
    source: { type: 'quran', reference: '7:31', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'salam-entering-home',
    situation: { en: 'You come home from school and say salaam at the door.' },
    options: [
      { id: 'a', text: { en: 'Your home is filled with blessing' }, isCorrect: true, explanation: { en: 'Allah says: "When you enter houses, greet one another with a greeting from Allah, blessed and good." (24:61)' } },
      { id: 'b', text: { en: 'Nobody hears you, so it\'s wasted' }, isCorrect: false, explanation: { en: 'The blessing is from Allah, whether or not someone replies.' } },
      { id: 'c', text: { en: 'You should be silent at home' }, isCorrect: false, explanation: { en: 'Entering with salam is exactly what the Quran teaches.' } },
    ],
    source: { type: 'quran', reference: '24:61', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'waiting-patiently-for-food',
    situation: { en: 'Dinner is ready but mom is still serving the guests first.' },
    options: [
      { id: 'a', text: { en: 'You wait patiently for your turn' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Patience is illumination." Waiting your turn politely is patience in action.' } },
      { id: 'b', text: { en: 'You grab the biggest piece first' }, isCorrect: false, explanation: { en: 'Taking before others and grabbing the best is not the adab the Prophet ﷺ taught.' } },
      { id: 'c', text: { en: 'You complain loudly about being hungry' }, isCorrect: false, explanation: { en: 'Complaining doesn\'t speed anything up and is not patience.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 223', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'saying-astaghfirullah',
    situation: { en: 'You said a mean word by mistake and feel bad about it.' },
    options: [
      { id: 'a', text: { en: 'You say "Astaghfirullah" and ask Allah to forgive you' }, isCorrect: true, explanation: { en: 'Allah commands: "And ask forgiveness for your sin" (40:55). Seeking forgiveness is the way of the believers.' } },
      { id: 'b', text: { en: 'You pretend it never happened' }, isCorrect: false, explanation: { en: 'Covering it up doesn\'t fix the tongue that spoke it.' } },
      { id: 'c', text: { en: 'You say the mean word again' }, isCorrect: false, explanation: { en: 'Repeating a mistake after regretting it is not repentance.' } },
    ],
    source: { type: 'quran', reference: '40:55', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'picking-up-grandmas-glasses',
    situation: { en: 'Your grandma drops her glasses on the floor.' },
    options: [
      { id: 'a', text: { en: 'You pick them up for her gently' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "He is not from us who does not show mercy to our young and honour our elders."' } },
      { id: 'b', text: { en: 'You wait until she asks you twice' }, isCorrect: false, explanation: { en: 'Helping elders without being asked is true honouring of them.' } },
      { id: 'c', text: { en: 'You watch TV and pretend not to see' }, isCorrect: false, explanation: { en: 'Turning away from an elder who needs help is not from the way of the Prophet ﷺ.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1919', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'washing-hands-before-eating',
    situation: { en: 'You come in from the garden and sit down to eat.' },
    options: [
      { id: 'a', text: { en: 'You wash your hands first' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Purity is half of faith." Clean hands before eating are part of that purity.' } },
      { id: 'b', text: { en: 'You wipe your hands on your shirt' }, isCorrect: false, explanation: { en: 'That is not real cleanliness and the food is still shared with dirt.' } },
      { id: 'c', text: { en: 'You eat with dusty hands — it doesn\'t matter' }, isCorrect: false, explanation: { en: 'Islam loves cleanliness, especially before eating.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 223', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'replying-to-salam',
    situation: { en: 'Someone greets you: "Assalamu alaykum."' },
    options: [
      { id: 'a', text: { en: 'You reply: "Wa alaykumus salam" (and a better reply if you can)' }, isCorrect: true, explanation: { en: 'Allah says: "When you are greeted, greet with something better or return it." (4:86)' } },
      { id: 'b', text: { en: 'You just nod your head' }, isCorrect: false, explanation: { en: 'Returning the salam with words is a right of the one who greeted you.' } },
      { id: 'c', text: { en: 'You say nothing at all' }, isCorrect: false, explanation: { en: 'The Quran teaches us to return the greeting.' } },
    ],
    source: { type: 'quran', reference: '4:86', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'kindness-to-cat-at-door',
    situation: { en: 'A cat meows at your door on a hot day.' },
    options: [
      { id: 'a', text: { en: 'You gently give it water and food' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ told us about a woman who entered the Fire for starving a cat, and a man forgiven for giving water to a thirsty dog.' } },
      { id: 'b', text: { en: 'You chase it away with a stick' }, isCorrect: false, explanation: { en: 'Harming Allah\'s creatures is a great sin — the opposite of mercy.' } },
      { id: 'c', text: { en: 'You tease it with the water but don\'t give it' }, isCorrect: false, explanation: { en: 'Teasing an animal is cruel and not from the way of the Prophet ﷺ.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 3321', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'grateful-for-new-shirt',
    situation: { en: 'You got a new shirt from your aunt.' },
    options: [
      { id: 'a', text: { en: 'You say "Alhamdulillah" and thank her' }, isCorrect: true, explanation: { en: 'Allah says: "If you are grateful, I will surely increase you in favour." (14:7) And thanking people is thanking Allah\'s blessings.' } },
      { id: 'b', text: { en: 'You complain it\'s not your favorite color' }, isCorrect: false, explanation: { en: 'Complaining about a gift is ungratefulness.' } },
      { id: 'c', text: { en: 'You ask for two more right away' }, isCorrect: false, explanation: { en: 'Gratitude first, then anything else — Allah increases the grateful.' } },
    ],
    source: { type: 'quran', reference: '14:7', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'picking-up-litter-in-masjid',
    situation: { en: 'You see a piece of paper on the masjid floor.' },
    options: [
      { id: 'a', text: { en: 'You pick it up — removing harm from the way is charity' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Removing harmful things from the road is sadaqah."' } },
      { id: 'b', text: { en: 'You leave it for the cleaner' }, isCorrect: false, explanation: { en: 'Every believer is asked to remove harm when they can.' } },
      { id: 'c', text: { en: 'You kick it under the carpet' }, isCorrect: false, explanation: { en: 'Hiding the harm is not removing it.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 2989', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'answering-mom-gently',
    situation: { en: 'Mom calls you to help, but you are in the middle of playing.' },
    options: [
      { id: 'a', text: { en: 'You say "Yes mom" and come' }, isCorrect: true, explanation: { en: 'Allah says: "And do not say to them a word of disrespect, and do not repel them; but speak to them a noble word." (17:23)' } },
      { id: 'b', text: { en: 'You shout "In a minute!" from your room' }, isCorrect: false, explanation: { en: 'A harsh or disrespectful reply to parents is what the Quran forbids.' } },
      { id: 'c', text: { en: 'You pretend you didn\'t hear' }, isCorrect: false, explanation: { en: 'Ignoring your parents is a form of disrespect.' } },
    ],
    source: { type: 'quran', reference: '17:23', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'bismillah-before-drink',
    situation: { en: 'You are about to drink a glass of juice.' },
    options: [
      { id: 'a', text: { en: 'You say "Bismillah" before drinking' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Mention the name of Allah when you eat and drink."' } },
      { id: 'b', text: { en: 'You drink first and remember later' }, isCorrect: false, explanation: { en: 'The Sunnah is to begin with Allah\'s name, not after.' } },
      { id: 'c', text: { en: 'Drinking doesn\'t need any words' }, isCorrect: false, explanation: { en: 'Saying Bismillah brings blessing to the drink and keeps Shaytan away.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5376', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'helping-clean-table',
    situation: { en: 'After dinner you help clear the table.' },
    options: [
      { id: 'a', text: { en: 'Your family loves it and Allah rewards your helpfulness' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The best of you are the best to their families."' } },
      { id: 'b', text: { en: 'You\'re just doing chores for no reason' }, isCorrect: false, explanation: { en: 'Serving your family is a beloved deed to Allah.' } },
      { id: 'c', text: { en: 'Only paid chores count' }, isCorrect: false, explanation: { en: 'Reward is for the deed and intention, not for payment.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 3895', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'giving-seat-to-elder',
    situation: { en: 'The bus is full and an elderly man gets on.' },
    options: [
      { id: 'a', text: { en: 'You offer him your seat' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "He is not from us who does not honour our elders."' } },
      { id: 'b', text: { en: 'You put your bag on the seat next to you' }, isCorrect: false, explanation: { en: 'Keeping a seat for your bag while an elder stands is not honouring them.' } },
      { id: 'c', text: { en: 'You pretend to be asleep' }, isCorrect: false, explanation: { en: 'Honouring elders means serving them, not avoiding them.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1919', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'helping-at-home-for-pleasure-of-allah',
    situation: { en: 'You help your dad carry the groceries from the car.' },
    options: [
      { id: 'a', text: { en: 'You get reward for helping your parents' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The pleasure of Allah is in the pleasure of the father, and the displeasure of Allah is in the displeasure of the father."' } },
      { id: 'b', text: { en: 'Helping dad is only useful if you get paid' }, isCorrect: false, explanation: { en: 'Helping parents is worship with reward from Allah.' } },
      { id: 'c', text: { en: 'You wait until he asks three times' }, isCorrect: false, explanation: { en: 'Helping without being asked is even more loved.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1899', needsVerification: true },
    difficulty: 'easy',
  },

  // ---------------------------------------------------------------------------
  // MEDIUM — daily situations with a clear, sourced consequence
  // ---------------------------------------------------------------------------
  {
    id: 'walking-to-masjid',
    situation: { en: 'You walk to the masjid for Dhuhr prayer with your dad.' },
    options: [
      { id: 'a', text: { en: 'Every step is rewarded and Allah prepares Jannah for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever goes to the masjid in the morning or the evening, Allah prepares for him a place in Paradise every time he goes."' } },
      { id: 'b', text: { en: 'Only the prayer counts, walking is nothing' }, isCorrect: false, explanation: { en: 'The steps to the masjid are themselves a source of reward.' } },
      { id: 'c', text: { en: 'You should have driven to save energy' }, isCorrect: false, explanation: { en: 'Walking to prayer is a Sunnah with its own reward.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 661', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'praying-with-jamaah',
    situation: { en: 'You pray Dhuhr with the jama\'ah (congregation) at the masjid.' },
    options: [
      { id: 'a', text: { en: 'It is worth 27 times more than praying alone' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Prayer in congregation is 27 times better than praying alone."' } },
      { id: 'b', text: { en: 'It is worth the same as praying alone' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ specifically promised the multiplied reward.' } },
      { id: 'c', text: { en: 'It counts less because you walked far' }, isCorrect: false, explanation: { en: 'Walking far and praying with the jama\'ah both add reward.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 645', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'dhikr-after-fajr',
    situation: { en: 'After Fajr prayer you stay in your place and remember Allah until sunrise.' },
    options: [
      { id: 'a', text: { en: 'You are given the reward of a Hajj and an Umrah' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever prays Fajr in congregation, then sits remembering Allah until the sun rises, then prays two rak\'ahs, has the reward of a complete Hajj and Umrah."' } },
      { id: 'b', text: { en: 'You waste the morning' }, isCorrect: false, explanation: { en: 'The early morning is a time of blessing and remembrance.' } },
      { id: 'c', text: { en: 'It only counts for grown-ups' }, isCorrect: false, explanation: { en: 'The reward is for whoever does it, young or old.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 586', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'subhanallah-bihamdihi-100',
    situation: { en: 'Before sleeping you say "SubhanAllahi wa bihamdihi" one hundred times.' },
    options: [
      { id: 'a', text: { en: 'Your sins are forgiven even if they were like the foam of the sea' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever says SubhanAllahi wa bihamdihi a hundred times, his sins are forgiven even if they were like the foam of the sea."' } },
      { id: 'b', text: { en: 'You get good dreams only' }, isCorrect: false, explanation: { en: 'The promise is forgiveness, which is far greater than a good dream.' } },
      { id: 'c', text: { en: 'It only works for adults' }, isCorrect: false, explanation: { en: 'The promise is to whoever says it — no age is excluded.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6405', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'ayat-kursi-after-prayer',
    situation: { en: 'After each prayer you read Ayat al-Kursi.' },
    options: [
      { id: 'a', text: { en: 'Nothing stands between you and Paradise except death' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever reads Ayat al-Kursi after every prayer, nothing prevents him from entering Paradise except that he dies."' } },
      { id: 'b', text: { en: 'It is just a long verse for memorizing' }, isCorrect: false, explanation: { en: 'It carries a special protection and a special promise.' } },
      { id: 'c', text: { en: 'Only imams may read it' }, isCorrect: false, explanation: { en: 'Every Muslim is invited to recite it.' } },
    ],
    source: { type: 'hadith', reference: 'Nasa\'i 9928', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'surah-al-ikhlas',
    situation: { en: 'You recite Surah al-Ikhlas carefully with love.' },
    options: [
      { id: 'a', text: { en: 'It equals one third of the Quran in reward' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said to a companion: "It (al-Ikhlas) equals one third of the Quran."' } },
      { id: 'b', text: { en: 'It is too short to count' }, isCorrect: false, explanation: { en: 'Its shortness hides its great reward.' } },
      { id: 'c', text: { en: 'Only the whole Quran counts' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ promised this surah a third of the Quran\'s reward.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5013', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'secret-sadaqah',
    situation: { en: 'You put your pocket money into the sadaqah box quietly so no one sees.' },
    options: [
      { id: 'a', text: { en: 'You are among those shaded by Allah on the Day of Judgment' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ listed among the seven under Allah\'s shade: "A person who gives charity so secretly that his left hand does not know what his right hand gives."' } },
      { id: 'b', text: { en: 'Only big money counts as charity' }, isCorrect: false, explanation: { en: 'Even small amounts given sincerely are beloved to Allah.' } },
      { id: 'c', text: { en: 'Charity only counts if people see it' }, isCorrect: false, explanation: { en: 'Secret charity is even better — it purifies the intention.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 660', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'visiting-sick-friend',
    situation: { en: 'Your friend is sick, so you visit him with your mom.' },
    options: [
      { id: 'a', text: { en: 'Angels make dua for you and your rank is raised' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "When a Muslim visits his sick brother, he remains in the harvest of Paradise, and angels say: May you be good and your path be good."' } },
      { id: 'b', text: { en: 'You might catch his cold' }, isCorrect: false, explanation: { en: 'Being careful is fine, but the visit itself is a beloved deed.' } },
      { id: 'c', text: { en: 'It\'s a waste of time' }, isCorrect: false, explanation: { en: 'Visiting the sick is a right of a Muslim upon his brother.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2568', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'learning-quran-lesson',
    situation: { en: 'You study your Quran lesson every day after school.' },
    options: [
      { id: 'a', text: { en: 'Allah makes a path to Paradise easy for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever travels a path seeking knowledge, Allah makes easy for him a path to Paradise."' } },
      { id: 'b', text: { en: 'It only helps you pass school' }, isCorrect: false, explanation: { en: 'The reward is with Allah, far beyond school marks.' } },
      { id: 'c', text: { en: 'Learning is only for adults' }, isCorrect: false, explanation: { en: 'Seeking knowledge is beloved from every age.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2699', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'not-backbiting',
    situation: { en: 'Your friend did something silly and you want to tell everyone.' },
    options: [
      { id: 'a', text: { en: 'You keep it to yourself — backbiting is a big sin' }, isCorrect: true, explanation: { en: 'Allah says: "Do not backbite one another. Would any of you like to eat the flesh of his dead brother? You would hate that." (49:12)' } },
      { id: 'b', text: { en: 'You tell the whole class' }, isCorrect: false, explanation: { en: 'That is exactly backbiting, which the Quran compares to eating a brother\'s flesh.' } },
      { id: 'c', text: { en: 'You tell your best friend quietly' }, isCorrect: false, explanation: { en: 'Backbiting in secret is still backbiting.' } },
    ],
    source: { type: 'quran', reference: '49:12', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'listening-to-teacher',
    situation: { en: 'Your teacher is explaining an important lesson.' },
    options: [
      { id: 'a', text: { en: 'You listen quietly — Allah raises the ranks of those with knowledge' }, isCorrect: true, explanation: { en: 'Allah says: "Allah will raise those who believe among you and those given knowledge, by degrees." (58:11)' } },
      { id: 'b', text: { en: 'You talk to your friend while she teaches' }, isCorrect: false, explanation: { en: 'Disrupting a lesson is disrespect and blocks your own learning.' } },
      { id: 'c', text: { en: 'You sigh loudly to show boredom' }, isCorrect: false, explanation: { en: 'Honouring the teacher is part of honouring knowledge.' } },
    ],
    source: { type: 'quran', reference: '58:11', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'keeping-a-promise',
    situation: { en: 'You promised to lend your cousin your ball after school.' },
    options: [
      { id: 'a', text: { en: 'You keep your promise and lend it to him' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The signs of a hypocrite are three: lying when he speaks, breaking his promise, and betraying trust."' } },
      { id: 'b', text: { en: 'You say you lost it' }, isCorrect: false, explanation: { en: 'Making excuses to break a promise is a bad habit the Prophet ﷺ warned about.' } },
      { id: 'c', text: { en: 'You lend it to someone else instead' }, isCorrect: false, explanation: { en: 'A promise is a promise; keeping it is honesty.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 33', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'anger-refuge',
    situation: { en: 'You feel very angry at your brother.' },
    options: [
      { id: 'a', text: { en: 'You say "A\'udhu billahi minash-shaytanir-rajim" and calm down' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ advised the angry man: "I know a word which, if he said it, his anger would go: A\'udhu billahi minash-shaytanir-rajim."' } },
      { id: 'b', text: { en: 'You throw your shoe at him' }, isCorrect: false, explanation: { en: 'Throwing things in anger is what Shaytan pushes you to do.' } },
      { id: 'c', text: { en: 'You say the meanest word you know' }, isCorrect: false, explanation: { en: 'The strong person is the one who controls himself when angry.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6115', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'handing-in-found-money',
    situation: { en: 'You find a five-dirham note in the playground.' },
    options: [
      { id: 'a', text: { en: 'You hand it to the teacher so the owner can find it' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Return the trust to the one who entrusted you, and do not betray the one who betrayed you."' } },
      { id: 'b', text: { en: 'You keep it — finders keepers' }, isCorrect: false, explanation: { en: 'Someone else\'s money is a trust, not a prize.' } },
      { id: 'c', text: { en: 'You spend it on candy before anyone sees' }, isCorrect: false, explanation: { en: 'Spending what belongs to someone else is not allowed.' } },
    ],
    source: { type: 'hadith', reference: 'Abu Dawud 3535', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'honest-in-football',
    situation: { en: 'You score a goal, but the ball actually went out of bounds.' },
    options: [
      { id: 'a', text: { en: 'You tell the truth and give the goal back' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Truthfulness leads to righteousness, and righteousness leads to Paradise."' } },
      { id: 'b', text: { en: 'You celebrate and pretend you didn\'t see' }, isCorrect: false, explanation: { en: 'Claiming a goal you know is not yours is a small lie, but a lie all the same.' } },
      { id: 'c', text: { en: 'You blame the goalie' }, isCorrect: false, explanation: { en: 'Blaming someone else for your own unfairness is not honesty.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6094', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'sharing-lunch',
    situation: { en: 'You have your lunch and your friend forgot his.' },
    options: [
      { id: 'a', text: { en: 'You share — the food of two is enough for three' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The food of two suffices for three, and the food of three suffices for four."' } },
      { id: 'b', text: { en: 'You eat fast before he notices' }, isCorrect: false, explanation: { en: 'Sharing food is a great good; hiding it is the opposite.' } },
      { id: 'c', text: { en: 'You trade half his toy for your sandwich' }, isCorrect: false, explanation: { en: 'A friend in need deserves generosity, not bargaining.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5392', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'watering-plant',
    situation: { en: 'You water the dry plant at school.' },
    options: [
      { id: 'a', text: { en: 'Whatever eats or drinks from it is sadaqah for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "If a Muslim plants a tree, whatever is eaten from it is charity for him."' } },
      { id: 'b', text: { en: 'Plants are not rewarded — only people' }, isCorrect: false, explanation: { en: 'The reward comes to the person who cares for the plant.' } },
      { id: 'c', text: { en: 'Only farmers get that reward' }, isCorrect: false, explanation: { en: 'Any believer who plants or waters is included.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 1552', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'closing-door-at-night',
    situation: { en: 'You are the last one up and close the house door at night.' },
    options: [
      { id: 'a', text: { en: 'You mention Allah\'s name as you close it' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Close your door and mention the name of Allah, for Shaytan does not open a closed door."' } },
      { id: 'b', text: { en: 'You slam it shut quickly' }, isCorrect: false, explanation: { en: 'Mentioning Allah\'s name is the protection; the slam is not.' } },
      { id: 'c', text: { en: 'You leave it open — nothing bad happens' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ taught this as a nightly protection, and we follow his guidance.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5624', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'covering-the-jug',
    situation: { en: 'You see the milk jug open in the kitchen at night.' },
    options: [
      { id: 'a', text: { en: 'You cover it and mention Allah\'s name' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Cover the vessel and tie the water-skin, and mention the name of Allah, and close the door."' } },
      { id: 'b', text: { en: 'You leave it open — it\'s just milk' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ specifically told us to cover vessels at night.' } },
      { id: 'c', text: { en: 'You take a sip and leave it' }, isCorrect: false, explanation: { en: 'Drinking is fine — but the covering is the Sunnah he taught.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2011', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'not-wasting-wudu-water',
    situation: { en: 'You finish making wudu and the tap is still running.' },
    options: [
      { id: 'a', text: { en: 'You close the tap — no wasting water, even for wudu' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ passed by Sa\'d while he was making wudu and said: "Do not waste water," even on a running river.' } },
      { id: 'b', text: { en: 'You let it run — wudu needs lots of water' }, isCorrect: false, explanation: { en: 'Wudu needs little water; the Prophet ﷺ used a small amount.' } },
      { id: 'c', text: { en: 'Wasting water is not important' }, isCorrect: false, explanation: { en: 'Waste is disliked by Allah in all things, even water.' } },
    ],
    source: { type: 'hadith', reference: 'Ibn Majah 425', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'dua-for-parents',
    situation: { en: 'You make dua: "Rabbi irhamhuma kama rabbayani saghira."' },
    options: [
      { id: 'a', text: { en: 'It is a beloved dua the Quran teaches us to say for parents' }, isCorrect: true, explanation: { en: 'Allah says: "And say: My Lord, have mercy upon them as they brought me up when I was small." (17:24)' } },
      { id: 'b', text: { en: 'Only parents can make dua for themselves' }, isCorrect: false, explanation: { en: 'The Quran commands children to make this dua for their parents.' } },
      { id: 'c', text: { en: 'Kids\' duas don\'t work' }, isCorrect: false, explanation: { en: 'The dua of a child for a parent is very powerful.' } },
    ],
    source: { type: 'quran', reference: '17:24', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'splitting-the-cookie',
    situation: { en: 'You and your friend both want the last cookie.' },
    options: [
      { id: 'a', text: { en: 'You split it fairly in half' }, isCorrect: true, explanation: { en: 'Allah says: "O you who believe, be persistently standing firm in justice." (5:8) Fairness with friends is justice in action.' } },
      { id: 'b', text: { en: 'You take it first — you\'re quicker' }, isCorrect: false, explanation: { en: 'Taking more than your share is unfair to your friend.' } },
      { id: 'c', text: { en: 'You say "finders keepers"' }, isCorrect: false, explanation: { en: 'Fairness is what Allah loves, not cleverness in grabbing.' } },
    ],
    source: { type: 'quran', reference: '5:8', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'bismillah-before-undressing',
    situation: { en: 'You get ready for bed and take off your school clothes.' },
    options: [
      { id: 'a', text: { en: 'You say "Bismillah" as you take them off' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever takes off his clothes (to change) let him mention the name of Allah, for it is a screen between him and the jinn."' } },
      { id: 'b', text: { en: 'You just quickly change' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ taught this simple protection to us.' } },
      { id: 'c', text: { en: 'You throw your clothes on the floor' }, isCorrect: false, explanation: { en: 'Whether or not clothes are tidy, mentioning Allah\'s name is the protection.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 3397', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'helping-neighbor-cat',
    situation: { en: 'Your neighbor\'s cat is stuck on the roof and meowing.' },
    options: [
      { id: 'a', text: { en: 'You get an adult to help bring it down gently' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever believes in Allah and the Last Day, let him honour his neighbor." Caring for his cat is caring for his neighbor.' } },
      { id: 'b', text: { en: 'You ignore it — it\'s not your cat' }, isCorrect: false, explanation: { en: 'A neighbor\'s need is our concern in Islam.' } },
      { id: 'c', text: { en: 'You throw stones to make it come down' }, isCorrect: false, explanation: { en: 'Harming the animal is cruelty, not helping.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6019', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'helping-prepare-iftar',
    situation: { en: 'In Ramadan, you help set out the dates and water for iftar.' },
    options: [
      { id: 'a', text: { en: 'You share the reward of whoever breaks their fast with your food' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever feeds a fasting person has his reward and does not reduce anything from the fasting person\'s reward."' } },
      { id: 'b', text: { en: 'Only those who fast get reward' }, isCorrect: false, explanation: { en: 'The one who feeds shares the reward too.' } },
      { id: 'c', text: { en: 'You should eat first and set the table later' }, isCorrect: false, explanation: { en: 'Serving the fasting people first is the beautiful Sunnah.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 807', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'praying-on-time',
    situation: { en: 'It is time for Asr and you are in the middle of a game.' },
    options: [
      { id: 'a', text: { en: 'You stop and pray on time' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said the most beloved deed to Allah is prayer on its time.' } },
      { id: 'b', text: { en: 'You finish the game and pray later' }, isCorrect: false, explanation: { en: 'Delaying prayer for play makes play the master, not the prayer.' } },
      { id: 'c', text: { en: 'You skip it today — one day won\'t matter' }, isCorrect: false, explanation: { en: 'The prayer is the most important pillar after faith; skipping it is a serious sin.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 753', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'dua-before-test',
    situation: { en: 'You have a big test tomorrow.' },
    options: [
      { id: 'a', text: { en: 'You study, then ask Allah for help and success' }, isCorrect: true, explanation: { en: 'The believer prays: "Our Lord, give us good in this world and good in the Hereafter." (2:201) Effort and dua go together.' } },
      { id: 'b', text: { en: 'You just pray to pass without studying' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ tied effort with trust: tie the camel, then rely on Allah.' } },
      { id: 'c', text: { en: 'You worry all night instead of sleeping' }, isCorrect: false, explanation: { en: 'Rest is part of preparation; dua replaces worry.' } },
    ],
    source: { type: 'quran', reference: '2:201', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'reading-al-kahf-friday',
    situation: { en: 'On Friday you read Surah al-Kahf.' },
    options: [
      { id: 'a', text: { en: 'A light shines for you between the two Fridays' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever reads Surah al-Kahf on Friday, a light shines for him between the two Fridays."' } },
      { id: 'b', text: { en: 'It is too long for children to read' }, isCorrect: false, explanation: { en: 'Reading it in parts is fine; the reward is for reading it on Friday.' } },
      { id: 'c', text: { en: 'Only imams should read it' }, isCorrect: false, explanation: { en: 'It is a Sunnah for every Muslim on Friday.' } },
    ],
    source: { type: 'hadith', reference: 'Al-Hakim, al-Mustadrak 2069 (graded sahih by al-Albani)', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'sleeping-on-right-side',
    situation: { en: 'You lie down to sleep.' },
    options: [
      { id: 'a', text: { en: 'You lie on your right side, facing the qiblah if you can' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ used to sleep on his right side, and taught us to sleep on the right.' } },
      { id: 'b', text: { en: 'You sleep on your stomach' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ said sleeping on the stomach is disliked, the way of the people of the Fire.' } },
      { id: 'c', text: { en: 'Any position is the same' }, isCorrect: false, explanation: { en: 'Sleeping on the right side is the Sunnah of the Prophet ﷺ.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 6316', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'putting-shoes-right-side-first',
    situation: { en: 'You are putting on your shoes in the morning.' },
    options: [
      { id: 'a', text: { en: 'You start with the right shoe, and left shoe first when taking off' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "When you put on shoes, start with the right; when you take them off, start with the left."' } },
      { id: 'b', text: { en: 'You put on whichever shoe you grab first' }, isCorrect: false, explanation: { en: 'Starting with the right is a beloved Sunnah in daily life.' } },
      { id: 'c', text: { en: 'Shoes don\'t matter for manners' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ taught us blessing in even the small daily things.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5856', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'helping-younger-sibling',
    situation: { en: 'Your little sister is struggling to put on her backpack.' },
    options: [
      { id: 'a', text: { en: 'You help her — Allah helps the servant who helps his brother' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Allah is in the help of the servant as long as the servant is in the help of his brother."' } },
      { id: 'b', text: { en: 'You watch and wait for her to manage alone' }, isCorrect: false, explanation: { en: 'Helping others is the way to receive Allah\'s help.' } },
      { id: 'c', text: { en: 'You tell her to hurry up' }, isCorrect: false, explanation: { en: 'Rushing a little one with harsh words is not helpful.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2699', needsVerification: true },
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------------------
  // HARD — deeper situations that need thought and sincerity
  // ---------------------------------------------------------------------------
  {
    id: 'fasting-in-ramadan',
    situation: { en: 'You fast in Ramadan with faith and hope for reward (when you are ready).' },
    options: [
      { id: 'a', text: { en: 'Your past sins are forgiven' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever fasts Ramadan with faith and seeking reward, his past sins are forgiven."' } },
      { id: 'b', text: { en: 'Only adults who fast fully are forgiven' }, isCorrect: false, explanation: { en: 'The promise is for whoever fasts with faith and hope, of any age.' } },
      { id: 'c', text: { en: 'Fasting is just about being hungry' }, isCorrect: false, explanation: { en: 'Fasting trains the soul and brings forgiveness, not just hunger.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 38', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'forgiving-despite-being-strong',
    situation: { en: 'Your friend breaks your new pencil box and you are stronger than him.' },
    options: [
      { id: 'a', text: { en: 'You forgive him — forgiveness only increases honor' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Allah does not increase a servant in anything except honor through forgiving others."' } },
      { id: 'b', text: { en: 'You break his ruler to teach him a lesson' }, isCorrect: false, explanation: { en: 'The strong one is the one who controls himself when angry, not the one who gets even.' } },
      { id: 'c', text: { en: 'You stop being friends forever' }, isCorrect: false, explanation: { en: 'Forgiveness keeps brotherhood; grudges destroy it.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2588', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'sincere-intention-when-praised',
    situation: { en: 'Guests are coming and everyone will hear you recite Quran.' },
    options: [
      { id: 'a', text: { en: 'You recite for Allah alone, not for the praise' }, isCorrect: true, explanation: { en: 'Allah says: "And they were not commanded except to worship Allah, sincere to Him in religion." (98:5) Purity of intention is the heart of worship.' } },
      { id: 'b', text: { en: 'You recite louder so everyone claps' }, isCorrect: false, explanation: { en: 'Doing worship to impress people is showing off, which the Prophet ﷺ warned against.' } },
      { id: 'c', text: { en: 'You only recite when people can hear' }, isCorrect: false, explanation: { en: 'Worship for Allah is done in private and public alike.' } },
    ],
    source: { type: 'quran', reference: '98:5', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'happy-for-friend',
    situation: { en: 'Your friend gets a brand new bike and you don\'t have one.' },
    options: [
      { id: 'a', text: { en: 'You say "MashaAllah" and are happy for him' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Beware of envy, for envy eats good deeds like fire eats wood."' } },
      { id: 'b', text: { en: 'You wish he hadn\'t gotten it' }, isCorrect: false, explanation: { en: 'Wishing the loss of another\'s blessing is envy, which destroys good deeds.' } },
      { id: 'c', text: { en: 'You ignore him until he shares it' }, isCorrect: false, explanation: { en: 'Genuine happiness for a brother is part of faith.' } },
    ],
    source: { type: 'hadith', reference: 'Abu Dawud 4903', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'concealing-a-friends-mistake',
    situation: { en: 'Your friend forgot his homework and the teacher asks who didn\'t do it.' },
    options: [
      { id: 'a', text: { en: 'You don\'t expose him; he can admit it himself' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever conceals a Muslim\'s fault, Allah will conceal his faults in this world and the next."' } },
      { id: 'b', text: { en: 'You point at him and say it loudly' }, isCorrect: false, explanation: { en: 'Exposing a brother\'s fault in public is not the way of the believers.' } },
      { id: 'c', text: { en: 'You announce it to the whole class' }, isCorrect: false, explanation: { en: 'The believer covers faults, just as he hopes Allah covers his own.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 2442', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'tying-the-camel',
    situation: { en: 'You have a big football match tomorrow.' },
    options: [
      { id: 'a', text: { en: 'You practice, then trust Allah for the result' }, isCorrect: true, explanation: { en: 'A man asked the Prophet ﷺ: should I tie my camel or trust Allah? He said: "Tie it, then trust Allah."' } },
      { id: 'b', text: { en: 'You don\'t practice — you just make dua to win' }, isCorrect: false, explanation: { en: 'Trusting Allah never means abandoning effort.' } },
      { id: 'c', text: { en: 'You worry all night about losing' }, isCorrect: false, explanation: { en: 'Tawakkul replaces worry; effort replaces laziness.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2517', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'trusting-riza',
    situation: { en: 'You worry about what will happen tomorrow and what you will eat.' },
    options: [
      { id: 'a', text: { en: 'You remember Allah provides for the birds, and He provides for you' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "If you relied on Allah as He deserves, He would provide for you as He provides for the birds: they leave hungry in the morning and return full."' } },
      { id: 'b', text: { en: 'You hoard all the snacks to be safe' }, isCorrect: false, explanation: { en: 'Hoarding in fear of the future is not trust in Allah.' } },
      { id: 'c', text: { en: 'You ask everyone you meet for food' }, isCorrect: false, explanation: { en: 'The believer asks Allah, works, and trusts His provision.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2344', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'admitting-blame',
    situation: { en: 'You broke the vase and blamed your sister.' },
    options: [
      { id: 'a', text: { en: 'You tell the truth and apologize to both your family and Allah' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Every son of Adam sins, and the best of sinners are those who repent."' } },
      { id: 'b', text: { en: 'You keep blaming your sister' }, isCorrect: false, explanation: { en: 'Repentance begins with truthfulness about the mistake.' } },
      { id: 'c', text: { en: 'You apologize to Allah only, in your heart' }, isCorrect: false, explanation: { en: 'Repentance to Allah goes with making right the wrong done to people.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 2499', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'taqwa-way-out',
    situation: { en: 'You fear you will fail a subject you worked hard on.' },
    options: [
      { id: 'a', text: { en: 'You remember Allah makes a way out for those who fear Him' }, isCorrect: true, explanation: { en: 'Allah says: "Whoever fears Allah, He will make for him a way out and provide for him from where he does not expect." (65:2-3)' } },
      { id: 'b', text: { en: 'Failing is final and nothing can change it' }, isCorrect: false, explanation: { en: 'Allah\'s help is not limited by our expectations.' } },
      { id: 'c', text: { en: 'You give up trying' }, isCorrect: false, explanation: { en: 'Taqwa is doing what is right and trusting Allah with the result.' } },
    ],
    source: { type: 'quran', reference: '65:2-3', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'hasbunallahu-wa-nimal-wakeel',
    situation: { en: 'Something scary happens on the news and you feel frightened.' },
    options: [
      { id: 'a', text: { en: 'You say "Hasbunallahu wa ni\'mal wakeel" and trust Allah' }, isCorrect: true, explanation: { en: 'This was the saying of the believers when the enemy marched on them: "Sufficient for us is Allah, and He is the best Disposer of affairs." (3:173)' } },
      { id: 'b', text: { en: 'You worry about it all day' }, isCorrect: false, explanation: { en: 'Fear is answered with trust and remembrance of Allah.' } },
      { id: 'c', text: { en: 'You tell everyone to be scared too' }, isCorrect: false, explanation: { en: 'Spreading fear is not helpful; trusting Allah brings peace.' } },
    ],
    source: { type: 'quran', reference: '3:173', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'sadaqah-to-family',
    situation: { en: 'Your uncle is having a hard time, and you give him your saved money.' },
    options: [
      { id: 'a', text: { en: 'It is both sadaqah and keeping family ties — the best charity' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Charity to a relative is both charity and upholding of family ties."' } },
      { id: 'b', text: { en: 'Charity only counts for strangers' }, isCorrect: false, explanation: { en: 'Charity to relatives is doubly rewarded.' } },
      { id: 'c', text: { en: 'Your saved money is yours alone' }, isCorrect: false, explanation: { en: 'Giving from what you love is the highest level of charity.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 658', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'teaching-a-surah',
    situation: { en: 'You teach your little sister Surah al-Ikhlas.' },
    options: [
      { id: 'a', text: { en: 'You share the reward of every time she recites it' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever guides someone to good gets a reward like the one who does it."' } },
      { id: 'b', text: { en: 'Only the one who recites gets reward' }, isCorrect: false, explanation: { en: 'The teacher shares the reward of what is learned.' } },
      { id: 'c', text: { en: 'Teaching is a waste of your time' }, isCorrect: false, explanation: { en: 'Guiding others to good is among the best deeds.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2674', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'standing-with-new-student',
    situation: { en: 'Some kids are teasing the new student at school.' },
    options: [
      { id: 'a', text: { en: 'You stand with him and welcome him' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Whoever defends the honor of his brother, Allah protects his face from the Fire on the Day of Judgment."' } },
      { id: 'b', text: { en: 'You join in so you\'re not teased too' }, isCorrect: false, explanation: { en: 'Joining oppression to avoid it is never the way of the believer.' } },
      { id: 'c', text: { en: 'You look away — it\'s not your fight' }, isCorrect: false, explanation: { en: 'Defending the weak and the newcomer is a duty of brotherhood.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 1931', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'fasting-white-days',
    situation: { en: 'It is the 13th, 14th and 15th of the month and you fast (if you are ready).' },
    options: [
      { id: 'a', text: { en: 'You follow a beloved Sunnah of the Prophet ﷺ' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ encouraged fasting the three white days (13th, 14th, 15th of each lunar month).' } },
      { id: 'b', text: { en: 'Only Ramadan fasting has any value' }, isCorrect: false, explanation: { en: 'Extra fasts are a great Sunnah, but never replace Ramadan.' } },
      { id: 'c', text: { en: 'Only adults may fast these days' }, isCorrect: false, explanation: { en: 'Children may fast voluntarily when their parents see they can.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 761', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'fasting-mondays',
    situation: { en: 'You fast on Mondays like the Prophet ﷺ used to (when you are ready).' },
    options: [
      { id: 'a', text: { en: 'Your deeds are shown to Allah on that day while you are fasting' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Deeds are presented on Monday and Thursday, and I like my deeds to be presented while I am fasting."' } },
      { id: 'b', text: { en: 'Any random day is better' }, isCorrect: false, explanation: { en: 'Mondays and Thursdays were the Prophet\'s ﷺ chosen days.' } },
      { id: 'c', text: { en: 'Fasting on Mondays is for adults only' }, isCorrect: false, explanation: { en: 'Children can fast these days too, with their family\'s guidance.' } },
    ],
    source: { type: 'hadith', reference: 'Tirmidhi 747', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'salawat-on-friday',
    situation: { en: 'On Friday you send salawat (peace and blessings) upon the Prophet ﷺ.' },
    options: [
      { id: 'a', text: { en: 'Your salawat is shown to him and you are rewarded' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Send salawat upon me on Friday, for your salawat are presented to me."' } },
      { id: 'b', text: { en: 'Only imams should do that' }, isCorrect: false, explanation: { en: 'Every Muslim is invited to send salawat, especially on Friday.' } },
      { id: 'c', text: { en: 'It is only for Eid' }, isCorrect: false, explanation: { en: 'Friday is singled out for salawat in the Sunnah.' } },
    ],
    source: { type: 'hadith', reference: 'Abu Dawud 1046', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'befriending-orphan',
    situation: { en: 'A new kid at school has no father, and you notice he\'s lonely.' },
    options: [
      { id: 'a', text: { en: 'You befriend him — the one caring for an orphan is near the Prophet ﷺ in Paradise' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "I and the one who cares for an orphan will be like this in Paradise" (and he held up two fingers together).' } },
      { id: 'b', text: { en: 'You stay away — he\'s different' }, isCorrect: false, explanation: { en: 'Caring for orphans is one of the greatest deeds.' } },
      { id: 'c', text: { en: 'You feel sorry but do nothing' }, isCorrect: false, explanation: { en: 'Real care is friendship and kindness, not just pity.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5304', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'first-ten-days-dhul-hijjah',
    situation: { en: 'The first ten days of Dhul-Hijjah arrive.' },
    options: [
      { id: 'a', text: { en: 'You do extra good deeds — these are the best days of the year' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "There are no days in which righteous deeds are more beloved to Allah than these ten days" (the first ten of Dhul-Hijjah).' } },
      { id: 'b', text: { en: 'It\'s just another ordinary week' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ singled out these days as the best of the year.' } },
      { id: 'c', text: { en: 'Only people on Hajj get reward' }, isCorrect: false, explanation: { en: 'Everyone can earn great reward in these ten days.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 969', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'fasting-ashura',
    situation: { en: 'On the 10th of Muharram (Ashura) you fast, if you are able.' },
    options: [
      { id: 'a', text: { en: 'It expiates the sins of the past year' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Fasting the day of Ashura, I hope Allah will expiate the sins of the past year."' } },
      { id: 'b', text: { en: 'Only Ramadan fasting counts for anything' }, isCorrect: false, explanation: { en: 'Ashura is a great voluntary fast in the Sunnah.' } },
      { id: 'c', text: { en: 'It is just a normal day of the year' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ fasted it and encouraged it.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 1162', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'answering-rudeness-with-kindness',
    situation: { en: 'Someone is rude to you at school for no reason.' },
    options: [
      { id: 'a', text: { en: 'You answer with a kind word — repelling evil with good' }, isCorrect: true, explanation: { en: 'Allah says: "Repel evil with that which is better, and the one between you and whom there was enmity will become as if he were a devoted friend." (41:34)' } },
      { id: 'b', text: { en: 'You are rude back' }, isCorrect: false, explanation: { en: 'Returning evil with evil only grows the evil.' } },
      { id: 'c', text: { en: 'You tell everyone how mean they are' }, isCorrect: false, explanation: { en: 'Backbiting in return is still backbiting.' } },
    ],
    source: { type: 'quran', reference: '41:34', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'ayat-kursi-before-sleep',
    situation: { en: 'Before sleeping you read Ayat al-Kursi.' },
    options: [
      { id: 'a', text: { en: 'Allah guards you through the night and Shaytan stays away' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ told Abu Huraira that whoever reads Ayat al-Kursi before sleeping is guarded by Allah, and Shaytan does not come near him.' } },
      { id: 'b', text: { en: 'It is only for grown-ups to read' }, isCorrect: false, explanation: { en: 'The promise is for whoever recites it before sleep.' } },
      { id: 'c', text: { en: 'It only works when you are sick' }, isCorrect: false, explanation: { en: 'It is a nightly protection for every believer.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 2311', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'three-quls-at-night',
    situation: { en: 'Before sleep you recite al-Ikhlas, al-Falaq and an-Nas, then blow on your hands and wipe your body.' },
    options: [
      { id: 'a', text: { en: 'It protects you through the night' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ used to recite these three surahs before sleep, blow on his hands and wipe his body with them — a protection from harm.' } },
      { id: 'b', text: { en: 'It only helps people who are sick' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ did this every night as protection.' } },
      { id: 'c', text: { en: 'You must recite them loudly for it to work' }, isCorrect: false, explanation: { en: 'The Prophet ﷺ recited them quietly before sleep.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 5017', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'finishing-the-food',
    situation: { en: 'You are eating and only a little food is left on your plate.' },
    options: [
      { id: 'a', text: { en: 'You finish it — blessing is in all of it, and you don\'t let Shaytan share' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Do not wipe your hand until you have licked it... for you do not know which portion of your food contains the blessing."' } },
      { id: 'b', text: { en: 'You leave the rest — someone else can eat it' }, isCorrect: false, explanation: { en: 'Leaving food invites Shaytan to share; the Prophet ﷺ told us not to.' } },
      { id: 'c', text: { en: 'You throw the little bit in the bin' }, isCorrect: false, explanation: { en: 'Wasting even a little is not from the guidance of the Prophet ﷺ.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 2032', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'keeping-five-prayers',
    situation: { en: 'You keep your five daily prayers even when the day is busy.' },
    options: [
      { id: 'a', text: { en: 'The prayers wash away your sins like a river washing off dirt' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said the five prayers are like a river at your door in which you wash five times a day — nothing of your dirt remains.' } },
      { id: 'b', text: { en: 'Praying sometimes is enough' }, isCorrect: false, explanation: { en: 'The five prayers are obligatory; each has its own time.' } },
      { id: 'c', text: { en: 'Prayers are only for weekends' }, isCorrect: false, explanation: { en: 'The daily prayers are the pillar of a Muslim\'s day.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 667', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'praying-when-others-laugh',
    situation: { en: 'Some kids laugh at you for praying at school.' },
    options: [
      { id: 'a', text: { en: 'You pray anyway — the Prophet ﷺ said Islam began strange and will return strange' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "Islam began as something strange, and it will return to being strange, so glad tidings to the strangers" — those who hold onto it when others abandon it.' } },
      { id: 'b', text: { en: 'You stop praying to fit in' }, isCorrect: false, explanation: { en: 'Leaving a pillar of Islam because of laughter is a loss no friendship is worth.' } },
      { id: 'c', text: { en: 'You hide your prayer forever' }, isCorrect: false, explanation: { en: 'Praying is a light; being known as someone who prays is an honour.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 145', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'sujood-dua',
    situation: { en: 'During sujood you take your time and make dua from your heart.' },
    options: [
      { id: 'a', text: { en: 'You are closest to Allah at that moment, and dua is accepted' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ said: "The servant is closest to his Lord while prostrating, so increase in dua there."' } },
      { id: 'b', text: { en: 'Sujood is just a position, not a time for dua' }, isCorrect: false, explanation: { en: 'Sujud is the very moment the Prophet ﷺ told us to make dua.' } },
      { id: 'c', text: { en: 'You should rush through sujood' }, isCorrect: false, explanation: { en: 'Calmness and presence in sujood is a pillar of the prayer.' } },
    ],
    source: { type: 'hadith', reference: 'Muslim 482', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'sitting-with-the-clean',
    situation: { en: 'You choose to sit with friends who remind you of Allah and good.' },
    options: [
      { id: 'a', text: { en: 'You are like the one sitting with the perfume seller — you catch goodness' }, isCorrect: true, explanation: { en: 'The Prophet ﷺ compared a good companion to a perfume seller: even if you don\'t take perfume, you enjoy the scent.' } },
      { id: 'b', text: { en: 'Any friends are the same' }, isCorrect: false, explanation: { en: 'A person follows the religion of his close friend, so the Prophet ﷺ told us to choose good friends.' } },
      { id: 'c', text: { en: 'You should sit alone forever' }, isCorrect: false, explanation: { en: 'Good company is a blessing; the warning is only about bad company.' } },
    ],
    source: { type: 'hadith', reference: 'Bukhari 2101', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'controlling-eyes',
    situation: { en: 'You see something on TV or online that you know you should not watch.' },
    options: [
      { id: 'a', text: { en: 'You look away and change it — lowering the gaze protects your heart' }, isCorrect: true, explanation: { en: 'Allah commands the believers to lower their gaze (24:30); the eye is a gate through which harm reaches the heart.' } },
      { id: 'b', text: { en: 'You keep watching — it\'s just a few seconds' }, isCorrect: false, explanation: { en: 'The eye is entrusted to you; guarding it is part of faith.' } },
      { id: 'c', text: { en: 'You watch but tell yourself it doesn\'t affect you' }, isCorrect: false, explanation: { en: 'What the eyes take in shapes the heart, and the heart is the root of deeds.' } },
    ],
    source: { type: 'quran', reference: '24:30', needsVerification: true },
    difficulty: 'hard',
  },
];

export function getCauseEffectScenarios(count: number, difficulty?: 'easy' | 'medium' | 'hard'): CauseEffectScenario[] {
  let filtered = [...CAUSE_EFFECT_SCENARIOS];
  if (difficulty) {
    filtered = filtered.filter(s => s.difficulty === difficulty);
  }
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
