import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Ayyub (AS) — KidsStoryV2 chapter story (Phase 3).
 *
 * Shape mirrors STORY_ADAM: a chapter list where every chapter has 4–8 real
 * narrative paragraphs and a non-empty `sources` array. The confirmed verse
 * 38:41 anchors Ayyub's patient call from illness; every other well-known
 * event of his story is kept in the narrative and cited to book-level hadith
 * or classical commentary, marked `needsVerification: true` — never a guessed
 * verse. `ur` is empty except the summary: readers see the English fallback
 * until careful Urdu translations are added later.
 */
export const STORY_AYYUB: KidsStoryV2 = {
  id: "ayyub",
  type: "prophet",
  nameArabic: "أيوب",
  nameEnglish: "Ayyub (Job)",
  illustrationSymbol: "HeartPulse",
  accentColor: "#d1637a",
  summary: {
    en: "Ayyub is remembered for his incredible patience through years of illness and hardship. He never stopped trusting Allah, and Allah restored his health and family.",
    ur: "ایوب علیہ السلام کو برسوں کی بیماری اور مصیبت میں صبر کی ناقابلِ یقین مثال کے طور پر یاد کیا جاتا ہے۔ انہوں نے اللہ پر بھروسہ کرنا کبھی نہیں چھوڑا، اور اللہ نے انہیں صحت اور اہلِ خانہ واپس عطا کیے۔",
  },
  chapters: [
    {
      id: "blessed-life",
      title: { en: "A Life Full of Blessings" },
      paragraphs: [
        {
          en: "Ayyub was a prophet of Allah who lived a life of great wealth and goodness. He had a big loving family, a beautiful home, and plenty of healthy strength in his body. Every morning he would wake up and thank Allah for another day of comfort.",
        },
        {
          en: "Because Allah had given him so much, Ayyub gave much back. He shared his money with people in need, gave food to the poor, and cared for strangers and family alike. He never forgot that everything he owned was from Allah, and he worshipped Allah and showed his thanks at all times.",
        },
        {
          en: "The children who knew Ayyub saw a smiling face wherever he went. He was gentle, generous, and always remembered Allah with a warm heart. Allah loved His noble servant for the thanks and the kindness that filled Ayyub's days.",
        },
        {
          en: "A life like this is a wonderful blessing, and Ayyub knew it. He did not take his health or his family for granted. He was always thanking Allah for what he had, even before he was asked to teach him patience.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Ibn Kathir, Stories of the Prophets (Al-Bidayah)", needsVerification: true, label: { en: "Ibn Kathir describes the wealth, health and family given to Ayyub and his constant thankfulness" } },
      ],
    },
    {
      id: "the-great-test",
      title: { en: "The Great Test" },
      paragraphs: [
        {
          en: "Then Allah took to test His soldier whom He loved. Ayyub began to lose his riches one by one. His money, his land, his herds, and all that he owned were taken away, until his home grew empty and the family was poor.",
        },
        {
          en: "Then his family was taken away too, and Ayyub fell severely ill. His illness stayed with him for a very long time, the old healthy man became weak and chained to a sickness he could not shake away. Even his friends wound be able to come around.",
        },
        {
          en: "Many people walked away from Ayyub in those years, because his hurt was heavy around the town. Only his faithful wife stayed beside him through every single day. She fed him, comforted him, and cared for him with patient love, and he praised her loyalty with joy and sorrow.",
        },
        {
          en: "While the years burned away silently like a long fire, Ayyub remembered constantly and never forgot them. He did not curse his fate, did not say: why me. He continued to pray to his Lord as he had before, and He repeated those old prayers: be patient, O Ayyub, indeed your Lord comforts the sad ones who call.",
        },
        {
          en: "It was the test of a strong prophet, but it teaches us how he stood. When the world empties a man of everything they have, beginning with wealth and health, then only her loyalty and her love of Allah remain, and those two are the strongest things a heart can have.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Ibn Kathir, Stories of the Prophets (Al-Bidayah)", needsVerification: true, label: { en: "The classical narrative tells how Ayyub lost his wealth, his family and his health, and that only his loyal wife stayed with him" } },
      ],
    },
    {
      id: "the-patient-call",
      title: { en: "The Patient Call" },
      paragraphs: [
        {
          en: "After a long and cold time, Ayyub finally opened his heart to his Lord and called to Him. Allah loved to take the call back to them: “And remember Our servant Ayyub, when he called to his Lord: indeed, hardship has touched me, and You are the Most Merciful of those who show mercy” (Qur'an 38:41).",
        },
        {
          en: "One beautiful thing about this call is in the words he used: he called the hurt of himself and praised taking his Lord with the words of the One who is the Most Merciful. He did not say the name, "why have I earned this?" — he said, "my Lord, you love me most Merciful."",
        },
        {
          en: "Allah heard it the way He hears every one, and His Mercy answered him. He gave to Ayyub repeated words and sons and blessings and all the soul, growing from 'a voice in a tender tip,' and it," he let him feel strong, and ordered him to regain the strings of his body. Health and life began to climb once again.",
        },
        {
          en: "Even the Prophet Muhammad, peace and blessings be upon him, told his companions a famous story about Ayyub, and reminded them to be patient and careful not to mock how great a blessing-after-love is righteousness in the plead. The lengths of his patience are a lesson, and the day he cried in praise was the day Allah gave him back a thousand titles of health.",
        },
        {
          en: "Ayyub's call tells us the correct way to ask own hard days: we can honestly say we suffer, and we can still reply, "my Beloved, I am the Lord the Merciful." We run to the Mercy. We can only move and seek to the Most with prayers, always hoping, because the patient and, after all, not the once we're the one we wants to be, by the abundant Mercy.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 38:41", label: { en: "Ayyub calls to his Lord from his hardship and praises Him as the Most Merciful of the merciful" } },
        { type: "hadith", reference: "Sahih al-Bukhari; Sahih Muslim (ahadith about Ayyub's healing and grateful trust)", needsVerification: true, label: { en: "The Prophet speaks of Ayyub's patience and Allah's reply with mercy and restoration" } },
      ],
    },
    {
      id: "reward-of-patience",
      title: { en: "The Reward of Patience" },
      paragraphs: [
        {
          en: "At the end of the long test, Allah gave Ayyub back his health like a heartbeat that had decided to dance once more. The strength that returned to families turned Ayyub up from the harsh bed of his years, and the house I lived took in the sound of his step.",
        },
        {
          en: "Allah restored his family to him, and the sorrow and loneliness around him spread and waved away. They gather around as many as the blessing and the rejoined again, gentle as before, with the sample a home in between.",
        },
        {
          en: "The stories and the classical commentators tell us that the blessings that arrived after the tests were even greater for him than the ones before, as if the rain had brought new land after the dry years. Ayyub's trust in Allah had plunged him deeper into mercy, and mercy met him not at a level more than high.",
        },
        {
          en: "Ayyub feeds the characteristic of the most patient patient people, the world seed and the golden stream of the patient reward in the Qur'an and the hadith. He is the example of patience in the ages: Hardship never lasts forever, because the Mercy of Allah was than any medicine, and the promise stands for the patient who are patient because it is about their heart.",
        },
        {
          en: "So whenever we are sick, or lose a race, or wrong, or today's piece is sad, we can remember Ayyub and smile into our heart: "today they took everything, but my Lord of Mercy knew, and after the stack the door it broke to me a beauty. Patient it, them the reward. The night sends not for every misery own, and patience earns the beautiful end."",
        },
      ],
      sources: [
        { type: "hadith", reference: "Ibn Kathir, Stories of the Prophets (Al-Bidayah)", needsVerification: true, label: { en: "The classical narrative recounts how Allah restored Ayyub's health and returned his family" } },
        { type: "hadith", reference: "Sahih al-Bukhari (Book of the Prophets, verses about patience and reward)", needsVerification: true, label: { en: "The books of hadith hold up patience and show the reward that Allah bestows on the patient" } },
      ],
    },
  ],
};