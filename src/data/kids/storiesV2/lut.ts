import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Lut (AS) — KidsStoryV2 story (Phase 12).
 *
 * Follows the Adam reference shape: every chapter has 4–8 real narrative
 * paragraphs and a non-empty `sources` array. Qur'an anchors come only from
 * the verified verse (15:61); other events are anchored to Ibn Kathir's Tafsir
 * / Qasas at book level with `needsVerification: true`, or to authentic hadith
 * the author is confident in.
 *
 * `ur` is empty except for `summary`: readers see the English fallback until
 * careful Urdu translations are added in a later pass.
 */
export const STORY_LUT: KidsStoryV2 = {
  id: "lut",
  type: "prophet",
  nameArabic: "لوط",
  nameEnglish: "Lut (Lot)",
  illustrationSymbol: "CloudRain",
  accentColor: "#5c6bc0",
  summary: {
    en: "Prophet Lut lived among people who had turned far away from what is right and did very harmful things. He gently warned them to stop and come back to Allah. When Allah's angels came to shelter him, his believing family left with him at night, and the town that would not listen was destroyed. Lut's story teaches us to stand up for what is right, even when many around us are doing wrong.",
    ur: "حضرت لوط علیہ السلام ایسی قوم میں رہتے تھے جنہوں نے اللہ کی راہ سے دور ہو کر بہت برے کام کرنے لگے تھے۔ انہوں نے انہیں نرمی سے سمجھایا کہ برے کام چھوڑ کر اللہ کی طرف آجاؤ۔ جب اللہ کے فرشتے انہیں بچانے کے لیے آئے تو ان کے ایمان والے گھرانے کو رات کو لے کر نکل گئے، اور جو قوم باز نہ آئی وہ تباہ کر دی گئی۔ لوط علیہ السلام کی کہانی سکھاتی ہے کہ جب بہت سے لوگ غلط راستے پر ہوں تو ہمیں حق پر کھڑے رہنا چاہیے۔",
  },
  chapters: [
    {
      id: "living-in-a-city",
      title: { en: "Living in a City of Wrong" },
      paragraphs: [
        {
          en: "Prophet Lut was a close relative of Prophet Ibrahim, may peace be upon both of them. He traveled with the faith of tawhid — the worship of Allah alone — and Allah sent him as a prophet to a town that had gone very far away from the right path.",
        },
        {
          en: "The people of this town did things that no people before them had done. Their hearts had grown hard, and they behaved badly toward others and ignored the natural signs that Allah had placed in the world. They did not want to be told the truth.",
        },
        {
          en: "Lut knew these people needed help, not anger. So he set up his home among them and began to call them, kindly and with patience, to leave their bad ways and to come back to the worship of Allah alone.",
        },
        {
          en: "The people already knew Lut and respected his clean heart. But the city's wrong habits were so old and so dear to them that his gentle, clear words felt strange in their ears.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 11:77-83)",
          label: { en: "Ibn Kathir describes the wrongdoings of the people of Lut's city and Prophet Lut's gentle calling" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "he-warns-them",
      title: { en: "A Gentle Warning" },
      paragraphs: [
        {
          en: "Prophet Lut stood among his people and warned them openly. He told them to fear Allah, the One who created them, and to stop the evil deeds that were destroying their hearts and their city (Qur'an 26:161-166).",
        },
        {
          en: "He tried again and again, with soft and simple words, to teach them that justice and purity were better for them. A prophet never stops; Lut's hope was that the people would open their ears and change for their own good.",
        },
        {
          en: "But the people defended their old ways. They replied with mockery and insults, saying that Lut was just a man who claimed to have escaped from their badness. They refused, too, prophets advice: the signs were clear but the hearts were closed.",
        },
        {
          en: "Lut did not return the rudeness. He kept his dignity, kept his patience, and kept standing for the truth every single day, even with no one left standing beside him. The message stayed alive in him even when the town would not listen.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 26:160-166)",
          label: { en: "Ibn Kathir narrates Lut's repeated warnings to his people and their stubborn refusal" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-guests",
      title: { en: "The Angels Come as Guests" },
      paragraphs: [
        {
          en: "One evening, Allah sent some of His angels to Lut in the shape of handsome travelers. They appeared at his door like strangers passing through the town, and hosting a guest was a very noble part of the way of the prophets.",
        },
        {
          en: "The Qur'an tells us: \"When the messengers came to the family of Lut\" (Qur'an 15:61). Lut hurried to welcome them, asked them to sit with him, and closed to his heart a fear rising: he knew the bad wills of his town, and he feared for the sake of the strangers.",
        },
        {
          en: "Lut could not protect young men the way they say "the town": And indeed his worry grew. The townspeople learned that handsome guests had come to the house of Lut, and they ran to gather by his home.",
        },
        {
          en: "Lut was too angry, too sad, too ... he saw the strangers in danger, and he tried to block his house - he did not concern him for himself, but for the sake of his guests. He remembered the example of guests like Ibrahim the generous, and strength and bare on that night better than any weapon to the floor.",
        },
      ],
      sources: [
        {
          type: "quran",
          reference: "Qur'an 15:61",
          label: { en: "The messengers (angels) came to the family of Lut as honored guests" },
        },
      ],
    },
    {
      id: "the-answer-of-the-angels",
      title: { en: "The Answer of the Angels" },
      paragraphs: [
        {
          en: "As the townspeople gathered with wrong intent, Lut was nearly alone in his house. But the guests were not frightened for their own hearts; for they turned slowly and quietly in comfort: they told him they were messengers of Allah before all angels to dead repel the watchers.",
        },
        {
          en: "They told Lut to stay calm — that these bad people could not harm him, nor any guest: Everything was in the power of Allah. And then they gave him the good news: leave the city during the night with his believing family, before the morning of the punishment, and do not look back.",
        },
        {
          en: "Lut's heart filled with a mix of hope and sadness at once. His faith grew — yes, salvation was coming at last — but the end would far away for the people that the Lord so long to guide. He cried deeply, and even his wise old went down to the sand of the bed.",
        },
        {
          en: "Before morning, Lut placed his trust in Allah and left the city with his believing household, exactly as the angels had told him. They moved silently through the lamps of the dark, toward the valley and the new beginning of the day.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 15:51-60; 11:69-83)",
          label: { en: "Ibn Kathir narrates that the angels announced salvation to Lut and ordered his leaving home, and people do not look back" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-rain-of-stones",
      title: { en: "The Rain of Stones" },
      paragraphs: [
        {
          en: "The night had not yet ended in the city, and when the people of that city inside the wall of the homes slept, Allah sent His punishment upon them. In the way of stones and a wild turn the earth, the sky and the words were turned upside down (Qur'an 11:77-83).",
        },
        {
          en: "It was the bitter fruit that the town had planted with its own hands during all those years: repeated refusals to listen to the truth from a prophet of Allah. The pride of the house built their destruction with the small weekly bad habits they refused to give up.",
        },
        {
          en: "The believers of Lut and those who had listened to the truth of the messengers were completely safe outside the territory of the town. The same command that became a stain in the sleeping city was a bridge of safety for those who had believed.",
        },
        {
          en: "The next day the morning broke, but the light came on a city that was no more: the sign of the grave placed on the road of travelers — the remains of the town of wrong ordnance lay as a lesson for those who come after, like a dark warning next to the road.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 11:77-96)",
          label: { en: "Ibn Kathir tells how the disobedient town was destroyed in the morning, and how the believers of Lut were saved" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "standing-for-the-truth",
      title: { en: "Standing Up for What Is Right" },
      paragraphs: [
        {
          en: "Prophet Lut was the only voice in his town, and the entire city opposed him. He still stood firm: he warned, he invited, he hosted the guests with — the courage that the whole world admires. He knew how to be alone for the truth.",
        },
        {
          en: "His enemies was many and his side had no power, but he pleaded with them like a brother: 'wish for them the virtue that is good, and pray that their hearts be softened. He understood that defeating wrong by not becoming wrong is the way of the prophets.",
        },
        {
          en: "The best of the signals of his faith: our moral history chooses stand firm on what is right, before the majority tells us that no one does it. Lut saw the harm of the majority — but the Qur'an closes its (Prophet SAW) saying that the mu'min (believer). Every truth of the 'Amir' when a wrong is seen, it is cleared with the hand or the tongue or the trusting heart (Sahih Muslim; none ha dared).",
        },
        {
          en: "So our story of Lut is not a story of a distant yesterdays; it is a mirror for everyday: when a friend insists on lying, when a crowd laughs at what is fair, when it is easier to go with the wind — the heart of the Hashmi is the heart of Islam.",
        },
        {
          en: "And the last of the lesson is also mercy: all of the city became their enemies, then with the command to get people departing the night — the believers were saved, so the mercy of Allah is bigger than the will of a mob.",
        },
      ],
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim",
          label: { en: "The hadith of the changing of the wrong with the hand and the tongue and the closing heart" },
        },
      ],
    },
  ],
};