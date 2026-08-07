import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Ilyas (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger who called his people away from worshipping the idol Ba'l
 * and back to the worship of Allah alone. Anchored to the true Ilyas verses
 * in Surah As-Saffat (37:123–130) and the mention in Surah Al-An'am (6:85).
 * Urdu shown on the summary only; paragraphs use the English fallback.
 */
export const STORY_ILYAS: KidsStoryV2 = {
  id: "ilyas",
  type: "prophet",
  nameArabic: "إلياس",
  nameEnglish: "Ilyas (Elijah)",
  illustrationSymbol: "Mountain",
  accentColor: "#4f8a5b",
  summary: {
    en: "Ilyas called his people to stop worshipping an idol and to worship Allah alone.",
    ur: "الیاس علیہ السلام نے اپنی قوم کو بت کی عبادت چھوڑ کر صرف اللہ کی عبادت کی دعوت دی۔",
  },
  chapters: [
    {
      id: "messenger-of-allah",
      title: { en: "A Messenger Sent To His People" },
      paragraphs: [
        {
          en: "Long ago, Allah sent a strong and loving prophet to some people who had drifted far away from the truth. His name was Ilyas, and the Qur'an says: “Indeed, Ilyas was among the messengers” (Qur'an 37:123).",
        },
        {
          en: "Ilyas did not come to argue or to fight. He came because he loved his people, and he wanted them to remember the Lord Who had made them and cared for them all their lives.",
        },
        {
          en: "He spoke to them gently and bravely: “Will you not fear Allah?” (Qur'an 37:124). He asked them to stop and think about the One Who gives life and food and safety.",
        },
        {
          en: "His whole message was about Tawhid — worshiping Allah alone. Ilyas never tired of saying it, because he knew that nothing else truly matters.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:123", label: { en: "Ilyas is counted among the messengers of Allah" } },
        { type: "quran", reference: "Qur'an 37:124", label: { en: "Ilyas calls his people to fear Allah alone" } },
      ],
    },
    {
      id: "the-idol-baal",
      title: { en: "The Idol of Ba'l and the Best of Creators" },
      paragraphs: [
        {
          en: "The people of Ilyas had started worshipping a statue they had made with their own hands, and they called it Ba'l. They bowed down low before a block of stone and wood instead of the Allah Who had made the stones and the meadows.",
        },
        {
          en: "Ilyas looked at them with kindness and asked a simple, powerful question: “Do you call upon Ba'l and leave the Best of Creators?” (Qur'an 37:125).",
        },
        {
          en: "Then he reminded them Who the Best of Creators is: “Allah, your Lord and the Lord of your forefathers” (Qur'an 37:126). Idols made by human hands cannot hear a single prayer, cannot move, and cannot help — but the true Lord hears everything.",
        },
        {
          en: "Ilyas put his finger on the deepest truth: Allah created humans, so humans must never worship what they themselves create. Only the Creator of all things deserves our hearts.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:125", label: { en: "Ilyas challenges the people who call upon the idol Ba'l instead of the Best of Creators" } },
        { type: "quran", reference: "Qur'an 37:126", label: { en: "Allah is your Lord and the Lord of your forefathers" } },
      ],
    },
    {
      id: "firm-though-refused",
      title: { en: "Standing Firm When They Refused" },
      paragraphs: [
        {
          en: "Sadly, many of the people did not listen. They loved their old comfortable habit of the idol, and they refused to change. They closed their hearts and turned away from the prophet's gentle call.",
        },
        {
          en: "The Qur'an speaks honestly about it: “But they denied him, so indeed they will be brought [for punishment]” (Qur'an 37:127). Choosing to worship stone instead of the Creator has a heavy price.",
        },
        {
          en: "Yet the very next verse brings a warm hope: “Except the chosen servants of Allah” (Qur'an 37:128). Hidden among the people were faithful souls who never bowed to the idol, and Allah promised them protection and safety.",
        },
        {
          en: "Ilyas did not give up. He kept calling his people to the truth, walking with a gentle and unshakable heart. He knew that a prophet's job is not to force belief, but to keep inviting with patience and love.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:127", label: { en: "The people deny Ilyas and are warned that they will be brought for punishment" } },
        { type: "quran", reference: "Qur'an 37:128", label: { en: "Allah's chosen servants are singled out from the punishment" } },
      ],
    },
    {
      id: "peace-upon-ilyas",
      title: { en: "Peace Upon Ilyas — a Remembrance That Lives" },
      paragraphs: [
        {
          en: "Even though his own people pushed him away, Allah gave Ilyas a gift that never ends. The Qur'an says: “And We left for him a good name among later generations: Peace be upon Ilyas. Indeed, this is how We reward those who do good” (Qur'an 37:129–130).",
        },
        {
          en: "And Allah counts him among the most beloved of the righteous: “And Zakariyya, and Yahya, and Isa, and Ilyas — each one of them was of the righteous” (Qur'an 6:85). His name stands beside the purest prophets of Allah.",
        },
        {
          en: "Many years after his time, when children learn the names of the prophets and say salam upon Ilyas, that is his comfort: in the Qur'an his name is honoured with the greeting of peace that no stone idol could ever bring.",
        },
        {
          en: "Ilyas teaches us a golden truth — when we try with an honest heart to remind others about Allah, even in secret, our efforts are written and never wasted.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:129–130", label: { en: "Allah leaves a good mention of Ilyas and greets him with peace" } },
        { type: "quran", reference: "Qur'an 6:85", label: { en: "Ilyas is named among the righteous with Zakariyya, Yahya and Isa" } },
      ],
    },
    {
      id: "lesson-for-us",
      title: { en: "A Lesson for Us Today" },
      paragraphs: [
        {
          en: "Ilyas's story is small in the pages of the Qur'an but huge in meaning. It teaches us to keep our hearts fixed on the One Who created us, and not to be fooled by glitter and pretend gods.",
        },
        {
          en: "It teaches us to be brave. It is a sweet victory when a child says no to something wrong, even if others laugh. Standing for the truth, even alone, is a prophet-like deed.",
        },
        {
          en: "It teaches us mercy — Ilyas did not raise his voice in anger at those who refused; he wanted to save them, not to defeat them. When our friends wander away from good, we return them with a patient dua, not a frown.",
        },
        {
          en: "Above all, Ilyas reminds us to be sincere in worship. Whether we are praised or ignored, we worship Allah because He is our Lord — and He alone is worthy.",
        },
        {
          en: "Let us be like Ilyas: honest in word, patient in difficulty, and loyal in worship to the One Who made us. That is the road that brings the heart safely home.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:130", label: { en: "Peace upon Ilyas stands as a model of patience and pure worship for every generation" } },
      ],
    },
  ],
};