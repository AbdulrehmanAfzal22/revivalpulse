import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Sulayman (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * Son of Dawud who inherited his father's kingdom and was given the gifts
 * of speaking the language of the birds, commanding the wind, and ruling
 * the jinn. Every Quran-narrated event carries its actual verse from Surah
 * An-Naml (27), Surah Saba (34) and Surah Al-Anbiya (21). Urdu summary
 * only; paragraphs show the English fallback until translated.
 */
export const STORY_SULAYMAN: KidsStoryV2 = {
  id: "sulayman",
  type: "prophet",
  nameArabic: "سليمان",
  nameEnglish: "Sulayman (Solomon)",
  illustrationSymbol: "Bird",
  accentColor: "#6a5acd",
  summary: {
    en: "Dawud's son, given the gift of understanding the speech of birds and command over the wind. He ruled with wisdom and justice.",
    ur: "سلیمان علیہ السلام داؤد علیہ السلام کے بیٹے تھے، جنہیں اللہ نے پرندوں کی زبان سمجھنے اور ہوا پر حکمرانی کی نعمت عطا کی۔ اُنہوں نے حکمت اور انصاف کے ساتھ حکومت کی۔",
  },
  chapters: [
    {
      id: "inherited-kingdom",
      title: { en: "A Great Kingdom and Wonderful Gifts" },
      paragraphs: [
        {
          en: "Sulayman was the son of Dawud, and Allah gave him an amazing kingdom — even bigger and fuller of wonders than the kingdom of his father. The Qur'an says: “And Solomon inherited David, and he said: 'O people, we have been taught the language of birds, and we have been given from all things. Indeed, this is evident bounty'” (Qur'an 27:16).",
        },
        {
          en: "You see, Allah gave Sulayman the most wonderful gift: he could understand the language of the birds! A bird singing outside his window was not just making a sound — Sulayman knew what it was saying.",
        },
        {
          en: "And that was not all. Allah gave him command over the wind and made it obedient to him, and some of the jinn worked for him as well. His people, his soldiers and even the creatures of the sky lived under the care of a kind and wise king.",
        },
        {
          en: "Sulayman knew that all these gifts came from Allah. He praised his Lord for every single blessing instead of feeling proud, and he never used his powers to harm anyone.",
        },
        {
          en: "This is a lovely lesson for us: when we are given something special — a talent, a gift, or a responsibility — we should say Alhamdulillah and use it to help others, exactly as Sulayman did.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 27:16", label: { en: "Sulayman inherits from Dawud and is taught the language of birds as evident bounty" } },
        { type: "quran", reference: "Qur'an 27:17", label: { en: "Sulayman's army is gathered from jinn, men and birds, marching in rows" } },
      ],
    },
    {
      id: "valley-of-ants",
      title: { en: "The Valley of the Ants" },
      paragraphs: [
        {
          en: "One day, Sulayman and his great army marched through a valley — his soldiers of men, the jinn and the birds, all walking in perfect rows. But as they came near a hill of ants, a tiny voice called out in alarm.",
        },
        {
          en: "The Qur'an tells us what the ant said: “O ants, enter your dwellings so that Sulayman and his soldiers do not crush you while they do not realize it” (Qur'an 27:18).",
        },
        {
          en: "The little ant was frightened for her friends, because the army was so huge. But Sulayman could hear her — he could understand exactly what she said!",
        },
        {
          en: "Instead of getting angry, Sulayman smiled, amused at her words, and thanked Allah. He prayed: “My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do righteousness of which You approve. And admit me, by Your mercy, into the ranks of Your righteous servants” (Qur'an 27:19).",
        },
        {
          en: "Think of it — the king of a mighty kingdom stopped to smile at a tiny ant and asked Allah for help to be thankful. This is a big lesson: even small creatures matter, and gratitude comes before pride.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 27:18", label: { en: "An ant warns its friends to enter their dwellings before Sulayman's army passes" } },
        { type: "quran", reference: "Qur'an 27:19", label: { en: "Sulayman smiles at the ant's words and prays for gratitude and righteousness" } },
      ],
    },
    {
      id: "hoopoe-news",
      title: { en: "The Hoopoe's Message from a Faraway Land" },
      paragraphs: [
        {
          en: "One day Sulayman took attendance of his birds and noticed that the hoopoe was missing. \"Why do I not see the hoopoe — or is he among the absent?\" he asked (Qur'an 27:20). He knew that even a clever bird must explain its absence.",
        },
        {
          en: "After a short wait, the hoopoe came flying back with an urgent message: “I have encompassed that which you have not encompassed, and I have come to you from Sheba with certain news” (Qur'an 27:22).",
        },
        {
          en: "The hoopoe said: “I found a woman ruling over them, and she has been given of all things, and she has a great throne” (Qur'an 27:23). And then came the most important news of all: “I found her and her people prostrating to the sun instead of Allah” (Qur'an 27:24).",
        },
        {
          en: "The Queen of Sheba and her people were praying to the sun, not to Allah. But the sun is only a creation — it is Allah who made it rise and set, and He alone deserves our worship.",
        },
        {
          en: "Sulayman did not want just news or gossip. He wanted the truth about Allah to reach those faraway people, so he decided to act with wisdom and mercy toward a whole nation he had never met.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 27:20–21", label: { en: "Sulayman notices the hoopoe is absent and asks why he is missing" } },
        { type: "quran", reference: "Qur'an 27:22–25", label: { en: "The hoopoe reports a queen of Sheba whose people worship the sun instead of Allah" } },
      ],
    },
    {
      id: "letter-to-queen",
      title: { en: "A Letter to the Queen of Sheba" },
      paragraphs: [
        {
          en: "Sulayman wrote a gentle but clear letter and gave it to the hoopoe to deliver. “Take this letter of mine and deliver it to them, then leave them and see what answer they will return” (Qur'an 27:28). And the hoopoe flew across the lands until it reached the queen.",
        },
        {
          en: "The letter began: \"In the name of Allah, the Most Gracious, the Most Merciful. Do not act towards me with arrogance, but come to me in submission to Allah alone\" (Qur'an 27:30–31).",
        },
        {
          en: "When the Queen read it, she called her advisors. They said: \"We possess great strength and great might, but the command is yours, so see what you will command\" (Qur'an 27:33). The wise queen decided to send a gift to Sulayman instead of a war.",
        },
        {
          en: "But Sulayman refused the gift with grace: \"Would you provide me with wealth? But what Allah has given me is better than what He has given you\" (Qur'an 27:36). He did not want treasure — he wanted her heart to turn toward Allah.",
        },
        {
          en: "The queen began to understand that this king was different. His letter was kind, his wisdom was deep, and his words carried light. So she set out herself to meet him.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 27:28–31", label: { en: "Sulayman sends a letter inviting the queen to submit to Allah alone" } },
        { type: "quran", reference: "Qur'an 27:32–36", label: { en: "The queen consults her chiefs, sends a gift, and Sulayman declines it, relying on Allah's bounty" } },
      ],
    },
    {
      id: "queen-submits",
      title: { en: "The Queen Submits to Allah" },
      paragraphs: [
        {
          en: "At last the Queen of Sheba travelled to meet Sulayman. He welcomed her with honour and showed her the wonders of his kingdom, including the most amazing palace of all.",
        },
        {
          en: "When she stepped into the great hall, she saw what looked like a pool of water and lifted her skirt to wade through it. But it was not water at all — the floor was made of smooth, shining glass (Qur'an 27:44).",
        },
        {
          en: "At that moment her eyes opened wide. She said: \"My Lord, indeed I have wronged myself, and I submit with Sulayman to Allah, Lord of the worlds\" (Qur'an 27:44).",
        },
        {
          en: "The proud queen bowed instead to Allah alone. She left the sun she had worshipped behind her and came to the One Who had created the sun, the glass, the ants and everything else.",
        },
        {
          en: "This was one of Sulayman's dearest rewards: his message had reached a heart in a faraway land, and a whole nation had come to the truth. Sharing Allah's message with gentleness is a treasure that lasts forever.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 27:44", label: { en: "The queen sees the glass floor of Sulayman's palace and submits to Allah, Lord of the worlds" } },
        { type: "quran", reference: "Qur'an 27:37–39", label: { en: "Sulayman warns the queen not to come in defiance and a strong jinn offers to bring her throne" } },
      ],
    },
    {
      id: "wind-and-jinn",
      title: { en: "The Wind and the Jinn Obey Him" },
      paragraphs: [
        {
          en: "Allah gave Sulayman a special command over the wind. The Qur'an says: \"And to Sulayman We subjected the wind — its morning journey is a month's journey and its afternoon journey is a month's journey\" (Qur'an 34:12).",
        },
        {
          en: "Imagine that! With a favourable breeze, Sulayman could travel in one morning what would take other travellers a whole month. The wind carried his ships wherever he wished to go.",
        },
        {
          en: "The Qur'an also tells us: \"And of the devils were some who dived for him and did other work besides that\" (Qur'an 21:82). Some of the jinn worked for Sulayman — diving for pearls and building for him — but always by the command of Allah.",
        },
        {
          en: "Allah says about those workers: \"Whoever deviated among them from Our command — We will make him taste the punishment of the Blaze\" (Qur'an 34:12). So even the jinn who served Sulayman were kept in line by Allah.",
        },
        {
          en: "Sulayman had the wind and the jinn at his call, yet he remained humble. True power in Islam is not about showing off — it is about receiving a gift from Allah and using it with thankfulness and justice.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 34:12", label: { en: "Allah subjects the wind and some jinn to work for Sulayman by His permission" } },
        { type: "quran", reference: "Qur'an 21:81–82", label: { en: "The strongly raging wind runs by Sulayman's command and the devils dive and work for him" } },
      ],
    },
  ],
};
