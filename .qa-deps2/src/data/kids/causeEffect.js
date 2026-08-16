"use strict";
/**
 * Cause and Effect: Good Deeds scenarios for kids.
 * Each scenario presents a situation and the child picks the outcome that actually follows.
 * Based on Islamic teachings about consequences of good/bad actions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCauseEffectScenarios = exports.CAUSE_EFFECT_SCENARIOS = void 0;
exports.CAUSE_EFFECT_SCENARIOS = [
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
];
function getCauseEffectScenarios(count, difficulty) {
    let filtered = [...exports.CAUSE_EFFECT_SCENARIOS];
    if (difficulty) {
        filtered = filtered.filter(s => s.difficulty === difficulty);
    }
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
exports.getCauseEffectScenarios = getCauseEffectScenarios;
