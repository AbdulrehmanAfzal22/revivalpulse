import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Ibrahim (AS) — KidsStoryV2 story (Phase 12).
 *
 * Follows the Adam reference shape: every chapter has 4–8 real narrative
 * paragraphs and a non-empty `sources` array. Qur'an anchors come only from
 * the verified verses (9:114, 2:127); other events are anchored to Ibn Kathir's
 * Tafsir / Qasas at book level with `needsVerification: true`, or to a hadith
 * in Sahih al-Bukhari / Sahih Muslim that the author is confident in.
 *
 * `ur` is empty except for `summary`: readers see the English fallback until
 * careful Urdu translations are added in a later pass.
 */
export const STORY_IBRAHIM: KidsStoryV2 = {
  id: "ibrahim",
  type: "prophet",
  nameArabic: "إبراهيم",
  nameEnglish: "Ibrahim (Abraham)",
  illustrationSymbol: "Flame",
  accentColor: "#e2622a",
  summary: {
    en: "Ibrahim questioned idol worship from a young age and stayed firm in believing in the One God, even when his people threw him into a great fire. Allah kept the fire safe for him and honored him as His close friend. He and his son Ismail built the Kaaba together, and his story teaches us to trust Allah completely, even in the hardest tests.",
    ur: "ابراہیم علیہ السلام نے چھوٹی عمر ہی سے بتوں کی عبادت سے سوال کیا اور ایک اللہ پر ایمان رکھنے پر مضبوط رہے، حتی کہ ان کی قوم نے انہیں بڑی آگ میں ڈال دیا۔ اللہ نے آگ کو ان کے لیے ٹھنڈی کیا اور انہیں اپنا خلیل یعنی دوست بنایا۔ انہوں نے اپنے بیٹے اسماعیل کے ساتھ مل کر کعبہ بنایا، اور ان کی کہانی سکھاتی ہے کہ مشکل ترین آزمائش میں بھی اللہ پر مکمل بھروسا رکھنا چاہیے۔",
  },
  chapters: [
    {
      id: "searching-for-truth",
      title: { en: "A Boy Looking for the Truth" },
      paragraphs: [
        {
          en: "Prophet Ibrahim grew up in a town where the people worshipped statues made from stone. His father and the whole town around him would bow before these idols and ask them for help, believing that the stones could give them whatever they wanted.",
        },
        {
          en: "But even as a young boy, Ibrahim's heart was not at peace with this. He knew that the true Lord should be someone very great, someone who never disappears. So he looked up at the night sky and studied the bright stars that sparkled overhead.",
        },
        {
          en: "When he saw a beautiful star he asked himself: could this be my Lord? But then the star set and disappeared, and he understood with a gentle heart that anything which can fade away can never be the Creator, who is always there.",
        },
        {
          en: "He then looked at the moon, and it too rose and set. He looked at the sun, warm and brilliant, and still the evening came and the sun vanished as well. One by one the lights of the sky slipped away, and Ibrahim knew in his heart that only Allah, the One who made them all, deserves to be worshipped.",
        },
        {
          en: "So, even before the people knew him as a prophet, the truth was already growing inside him like a treasure: there is no god except Allah. A young honest heart had found the straight path all on its own, being guided by its Creator.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 6:74-79)",
          label: { en: "Ibn Kathir narrates how young Ibrahim tried the star, the moon and the sun before reaching the truth of Allah's oneness" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "calling-the-family",
      title: { en: "Calling the Family to Faith" },
      paragraphs: [
        {
          en: "When Ibrahim grew up, Allah chose him as a prophet and sent him to his town. His task was gentle yet bold: to call the people, starting with his own dear family, to leave the statues and to worship Allah alone.",
        },
        {
          en: "He spoke with tenderness and love. He asked his father why he bowed before a stone that could neither hear nor help him, and he told him that true knowledge had come to him. But the father did not want to change and went on serving the idols.",
        },
        {
          en: "Ibrahim was patient every day. He invited the whole town with kind words, but the people had loved their idols for so long that they made fun of what he said. Still he kept calling, never harsh, never surrendering the truth for the sake of their anger.",
        },
        {
          en: "Because he loved his father so dearly, he made a promise to him and asked Allah to forgive him, hoping in his heart that his father would be guided. The Qur'an says: \"And Ibrahim's praying for forgiveness for his father was only because of a promise he had made to him\" (Qur'an 9:114).",
        },
        {
          en: "From this a child can learn a lovely lesson: you can love people very deeply and still wish for them what is true and good. Even when people stay with their old ways, a gentle heart keeps hoping and keeps behaving with kindness.",
        },
      ],
      sources: [
        {
          type: "quran",
          reference: "Qur'an 9:114",
          label: { en: "Ibrahim prayed for forgiveness for his father because of a promise he had made to him" },
        },
      ],
    },
    {
      id: "the-fire",
      title: { en: "The Miracle of the Fire" },
      paragraphs: [
        {
          en: "The people of Ibrahim grew more and more angry, because their idols could not help them and the young messenger would not stop. So the town gathered together and its leaders chose a very cruel punishment for him.",
        },
        {
          en: "They built a huge fire, a great blazing furnace so tall that its warm light could be seen from far away. Then they put Ibrahim into the middle of the flames, hoping that the fire would finish what their words could not.",
        },
        {
          en: "But Ibrahim trusted his Lord completely. As the flames drew near, he simply placed his whole heart in the hand of Allah, saying that Allah alone was enough for him. His body entered the heat, but his heart was safe in the care of his Lord.",
        },
        {
          en: "And then the miracle happened: Allah told the fire to become cool and safe for Ibrahim. The great blaze turned calm and gentle around him. When the smoke cleared, Ibrahim stepped out completely safe, as if he had only rested in the shade of a garden.",
        },
        {
          en: "That was a lesson no statue could ever give: the hot fire of an entire people cannot harm a heart that truly trusts in Allah. Even fire obeys the command of the Only One who deserves to be worshipped.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 21:68-70)",
          label: { en: "Ibn Kathir narrates how the great fire was made cool and safe for the Prophet Ibrahim" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-sacrifice",
      title: { en: "The Test of the Sacrifice" },
      paragraphs: [
        {
          en: "In his old age, after many years of travel and trust, Allah blessed Ibrahim with a dear son named Ismail. The boy grew up gentle, obedient and strong, and he filled his father's heart with joy.",
        },
        {
          en: "Then came the most difficult test a father could ever face. Ibrahim saw in a dream that he was asked to offer his beloved son to Allah. The dreams of the prophets are true, so he knew the command was real and that no love could ever compete with the love of Allah.",
        },
        {
          en: "He talked with his son about the dream. Instead of crying or running away, Ismail answered with a peace that the whole world admires: \"O my father, do as you are commanded. You will find me, if Allah wills, among the patient.\"",
        },
        {
          en: "Both father and son obeyed Allah with all their hearts, and at that moment Allah held back the hand and sent a great sacrifice in the place of the son. It was a beautiful gift of mercy from the Lord, and the test was accepted.",
        },
        {
          en: "That is why the believers remember this event every year on Eid al-Adha, the festival of the sacrifice, when families share meat with relatives and with people in need. It is a beautiful yearly reminder that submitting to Allah brings safety and mercy in the end.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir of Qur'an 37:100-109",
          label: { en: "Ibn Kathir narrates Ibrahim's dream to offer his son, the son's faithful patience, and the great sacrifice sent in his place" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-kaaba",
      title: { en: "Building the Kaaba" },
      paragraphs: [
        {
          en: "After the great test, Allah gave Ibrahim another wonderful task: to raise a House of prayer in the valley of Makkah, the very first House built for the worship of Allah alone, and a safe refuge for all who come to it.",
        },
        {
          en: "The builders of this House show the beauty of a family of faith: a father and his son, Ibrahim and Ismail together. They worked hand in hand, raising stone upon stone, and their hearts were full of dua as the wall grew taller.",
        },
        {
          en: "When the two of them raised the foundations, they prayed together from the heart: \"Our Lord, accept this from us. Truly You are the All-Hearing, the All-Knowing\" (Qur'an 2:127). They did not build it to be praised by people; they built it so that Allah would be pleased.",
        },
        {
          en: "They also asked that among their children would grow a nation that submits to the one Creator, and that Allah would show them the ways of worship and turn toward them out of mercy. This part of their prayer has indeed been accepted to this very day.",
        },
        {
          en: "That House is the sacred Kaaba that still stands in Makkah. Whenever a child sees the picture of the Kaaba, they can remember: this blessed building was raised by the hands of a great prophet and his obedient son, and Allah blessed their work forever.",
        },
      ],
      sources: [
        {
          type: "quran",
          reference: "Qur'an 2:127",
          label: { en: "Ibrahim and Ismail raise the foundations of the House and pray that Allah accepts their work" },
        },
      ],
    },
    {
      id: "friend-of-allah",
      title: { en: "The Friend of Allah" },
      paragraphs: [
        {
          en: "Through fire and thirst, through travel and trial, and through the hardest test of offering his own dear son, Ibrahim never left the path. And for that pure devotion, Allah honored him with a title of the sublime greatness: the close friend of Allah.",
        },
        {
          en: "The beloved Prophet Muhammad peace be upon him told us that Prophet Ibrahim, may peace be upon him, is Al-Khalil of the Most Merciful — that means the close, intimate friend. It is a risen rank given to this great prophet, and his memory is honored by the whole family of believers.",
        },
        {
          en: "Allah did not take Ibrahim as a friend because he was rich or powerful. He chose him because of the pure heart of tawhid inside him — the heart that trusts once, and trusts again, in fire, in the empty desert, and in the moment of the sacrifice. Nothing could shake him back.",
        },
        {
          en: "So every child who loves Ibrahim can carry a small part of this gift: when days become hard or unfair, we can also simply say, \"Allah is sufficient for me, and He is the best of trustees.\" A heart that belongs to Allah is never really alone.",
        },
        {
          en: "Such is the whole lesson of the prophet of faith: trust Allah with a certain heart, in the little moments on the biggest tests. And whenever the fire of a difficulty or the trial of a decision looks too big, we remember the friend of the Merciful and call the same Lord he called.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim",
          label: { en: "The Prophet (PBUH) says that Allah took Ibrahim as His close and intimate friend, the Khalil" },
        },
      ],
    },
  ],
};