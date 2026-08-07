import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Idris (AS) — KidsStoryV2 story (Phase 12).
 *
 * Follows the Adam reference shape: every chapter has 4–8 real narrative
 * paragraphs and a non-empty `sources` array. Qur’an anchors are used only
 * with the verified verse (19:56); anything else is a hadith at book level
 * flagged `needsVerification` when it was not confidently checked.
 *
 * `ur` is empty except for `summary`: readers see the English fallback until
 * careful Urdu translations are added in a later pass.
 */
export const STORY_IDRIS: KidsStoryV2 = {
  id: "idris",
  type: "prophet",
  nameArabic: "إدريس",
  nameEnglish: "Idris",
  illustrationSymbol: "Star",
  accentColor: "#f2b705",
  summary: {
    en: "Idris was a prophet known for being very truthful and very patient — he always spoke the truth and never gave up, even when it was hard. The Qur’an says he was given knowledge and honored by Allah, who raised him to a lofty place. His story teaches us that Allah raises people who are honest, patient and devoted to Him.",
    ur: "ادریس علیہ السلام ایک ایسے نبی ہیں جو ہمیشہ سچ بولتے تھے اور کبھی ہمت نہیں ہارتے تھے، چاہے مشکل کیوں نہ ہو۔ قرآن فرماتا ہے کہ اللہ نے انہیں علم دیا اور انہیں معزز رکھ کر ایک بلند مرتبے تک پہنچایا۔ ان کی کہانی سکھاتی ہے کہ جو لوگ سچے، صبور اور اللہ پر بھروسہ کرنے والے ہوتے ہیں، اللہ انہیں بلند کرتا ہے۔",
  },
  chapters: [
    {
      id: "truthful-prophet",
      title: { en: "A Truthful Prophet" },
      paragraphs: [
        {
          en: "Long ago, Allah sent a special messenger named Idris to guide his people. The Qur’an tells us about him in just a few beautiful words: “And mention in the Book Idris. Indeed, he was a man of truth and a prophet” (Qur’an 19:56).",
        },
        {
          en: "Idris always spoke the truth. Whether he was talking to his family, his friends, or even people who disagreed with him, his words were always honest. The people of his time knew that if the Prophet Idris said something, it was true.",
        },
        {
          en: "He was also very patient. Being a prophet is not easy — people often make fun of the messengers of Allah and refuse to listen. But Idris kept inviting people to goodness, gently and kindly, and he never gave up.",
        },
        {
          en: "Truth and patience were the treasures of Idris. He held onto both, and both made him a beloved and honored servant of Allah.",
        },
      ],
      ayahNote: {
        en: "The whole story of Idris shines from one verse (Qur’an 19:56): Allah calls him a man of truth and a prophet. The two treasures that carried Idris forward were truth and patience.",
        ur: "ادریس کی پوری کہانی ایک آیت سے روشن ہوتی ہے (قرآن 19:56): اللہ اُسے سچا آدمی اور نبی کہتا ہے۔ ادریس کو بلند رکھنے والی دو چیزیں تھیں: سچ بولنا اور صبر کرنا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 19:56",
          label: { en: "The Qur’an tells us that Idris was a man of truth and a prophet", ur: "قرآن ہمیں بتاتا ہے کہ ادریس سچے آدمی اور نبی تھے" },
          explanation: {
            en: "Allah Himself tells us about Idris in one line: he was a truthful man and a prophet. Speaking the truth every day is a habit of the prophets.",
            ur: "اللہ خود ایک جملے میں ادریس کا تعارف بتاتا ہے: وہ سچ بولنے والا اور نبی تھا۔ روزانہ سچ بولنا انبیاء کا طریقہ ہے۔",
          },
        },
      ],
    },
    {
      id: "gift-of-knowledge",
      title: { en: "The Gift of Knowledge" },
      paragraphs: [
        {
          en: "Allah also gave Idris a very special gift: knowledge. Allah taught him many things, and Idris used what he learned to teach his people what is good and what is not good.",
        },
        {
          en: "Idris did not keep his knowledge to himself. He taught people about the laws of Allah and about how to live fairly and kindly with one another. He is remembered as a great teacher among the early prophets.",
        },
        {
          en: "The people around Idris learned from his words, but even more from his actions. When they saw him being honest, gentle and patient every single day, they could see with their own eyes what truth really looks like in a person’s life.",
        },
        {
          en: "Knowledge is one of the greatest gifts of Allah. He gave it to Idris, and it helped Idris become a light for his people. When we learn good things and use them to help others, we are doing something very much like what Idris did.",
        },
      ],
      ayahNote: {
        en: "Allah gave Idris the gift of knowledge, and Idris used it to teach people goodness. When children learn good things and help others with what they learned, they are following the path of Idris.",
        ur: "اللہ نے ادریس کو علم کا تحفہ دیا اور ادریس نے اس علم سے لوگوں کو بھلائی سکھائی۔ جب بچے اچھی چیزیں سیکھتے ہیں اور سیکھ کر دوسروں کی مدد کرتے ہیں تو وہ ادریس کی راہ پر چلتے ہیں۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim",
          label: { en: "The Prophet (PBUH) encouraged learning and teaching knowledge, following the way of the prophets who were given wisdom", ur: "نبی کریم ﷺ نے علم سیکھنے اور سکھانے کی ترغیب دی، ان نبیوں کے طریقے پر جو حکمت دیے گئے تھے" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "raised-high",
      title: { en: "Raised to a High Station" },
      paragraphs: [
        {
          en: "Nothing in the world is worth as much as being close to Allah. And for Idris, Allah gave a very special honor — the Qur’an tells us He raised him to a lofty place (Qur’an 19:56).",
        },
        {
          en: "Some scholars explain that Idris was taken up and raised to a station of great honor in the heavens. The beloved Prophet Muhammad ﷺ met him on his journey through the heavens, where Idris was waiting for him among the honored prophets.",
        },
        {
          en: "Allah raised Idris because of his truthfulness and his patience. It was not his power or his riches that lifted him up — it was the pure heart he kept for his Lord, a heart that held onto the truth and never let it go.",
        },
        {
          en: "For every child, this is a beautiful promise: people who are truthful and patient are lifted up by Allah and kept close to the ones He honors.",
        },
      ],
      ayahNote: {
        en: "The Qur’an says Allah raised Idris to a high station (Qur’an 19:56). It was not his power or his riches that lifted him — it was his truthful and patient heart. A pure heart raises a person the highest.",
        ur: "قرآن کہتا ہے کہ اللہ نے ادریس کو بلند مرتبہ عطا کیا (قرآن 19:56)۔ اسے اونچا کرنے والی چیز طاقت یا دولت نہیں تھی بلکہ اس کا سچا اور صابر دل تھا۔ صاف دل انسان کو سب سے بلند کرتا ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari",
          label: { en: "The Prophet (PBUH) tells of meeting Idris in the heavens on the night journey, showing the high station Allah gave him", ur: "نبی کریم ﷺ بتاتے ہیں کہ معراج کے سفر میں انہوں نے آسمانوں پر ادریس سے ملاقات کی، جو اللہ کی طرف سے ان کا بلند مقام ظاہر کرتا ہے" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-lesson",
      title: { en: "The Lesson of Idris" },
      paragraphs: [
        {
          en: "The story of Idris is short, but it carries two big lessons. The first lesson: a truthful person is honored by Allah. The second lesson: a patient person is raised up high.",
        },
        {
          en: "Sometimes telling the truth is hard, and being patient is even harder. But the life of Idris shows us that these struggles are never wasted. A person who stays truthful in the hard moments and patient in the difficult days is loved by Allah.",
        },
        {
          en: "Never give up. Idris never gave up, even when his people were slow to listen. There will always be something difficult — at school, at home, or inside ourselves — but a patient and honest heart keeps moving forward, and Allah is with it.",
        },
        {
          en: "Tell the truth, be patient, learn good things, and always trust in Allah. That is the lamp of Idris, and if we hold it, it will lead us close to the ones Allah loves.",
        },
      ],
      ayahNote: {
        en: "Two big lessons live in the story of Idris: a truthful person is honored by Allah, and a patient person is raised high. Whatever is hard, a patient and honest heart keeps moving forward, and Allah is with it.",
        ur: "ادریس کی کہانی میں دو بڑے سبق ہیں: سچا انسان اللہ کی نظر میں عزت والا ہے، اور صابر انسان اونچا اٹھایا جاتا ہے۔ چاہے بات کتنی ہی مشکل ہو، صبر اور سچا دل آگے بڑھتا رہتا ہے اور اللہ اس کے ساتھ ہوتا ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari",
          label: { en: "The Prophet (PBUH) taught that truthfulness leads to righteousness and that righteousness leads to Paradise", ur: "نبی کریم ﷺ نے سکھایا کہ سچائی نیکی کی طرف لے جاتی ہے اور نیکی جنت کی طرف" },
        },
      ],
    },
  ],
};