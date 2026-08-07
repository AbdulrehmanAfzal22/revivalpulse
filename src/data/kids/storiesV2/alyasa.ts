import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Al-Yasa (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The humble successor-prophet who carried on the mission of Ilyas (Elijah)
 * and is honoured in the Qur'an beside Isma'il and Dhul-Kifl. Every Quran
 * event is anchored to the true verses (38:48 and 6:86); the only narrative
 * detail not in the Qur'an carries a hadith-style reference flagged
 * needsVerification rather than a guessed citation. Urdu summary only.
 */
export const STORY_ALYASA: KidsStoryV2 = {
  id: "alyasa",
  type: "prophet",
  nameArabic: "اليسع",
  nameEnglish: "Al-Yasa (Elisha)",
  illustrationSymbol: "HeartPulse",
  accentColor: "#3f9f6f",
  summary: {
    en: "A prophet mentioned alongside Isma'il and Dhul-Kifl as among the best and most patient.",
    ur: "اليسع علیہ السلام ایک نبی تھے جن کا ذکر قرآن میں اسماعیل اور ذوالکفل کے ساتھ آیا ہے کہ وہ بہترین اور صبر کرنے والے لوگوں میں سے تھے۔",
  },
  chapters: [
    {
      id: "successor-of-ilyas",
      title: { en: "Carrying On the Mission of Ilyas" },
      paragraphs: [
        {
          en: "After the time of Ilyas, Allah chose another prophet to keep the message alive among the people of Bani Isra'il. His name was Al-Yasa, and he walked in the footsteps of his teacher with a gentle and faithful heart.",
        },
        {
          en: "Al-Yasa carried on Ilyas's call — the very same call: stop worshipping idols, and worship Allah alone. He did not invent a new teaching; he kept the pure teaching that every prophet before him had carried.",
        },
        {
          en: "We do not know many details about his daily life, because the Qur'an tells us very little about his story. But that little is enough to show us his worth — Allah decorated his name with praise.",
        },
        {
          en: "Al-Yasa is remembered above all for patience. Day after day, he called his people to the truth, and he remained gentle no matter how hard the road became.",
        },
      ],
      ayahNote: {
        en: "Al-Yasa carried on the call of Ilyas: worship Allah alone, never idols. He did not become famous, but he kept the mission alive — and Allah honored his faithfulness.",
        ur: "الیسع نے الیاس کی دعوت آگے بڑھائی: صرف اللہ کی عبادت کرو، بتوں کی نہیں۔ وہ مشہور نہیں ہوئے، مگر انہوں نے پیغام کو زندہ رکھا — اور اللہ نے ان کی وفاداری کو عزت دی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 6:86",
          label: { en: "Al-Yasa is named among the prophets Allah guided and preferred above the worlds", ur: "اليسع ان نبیوں میں شامل ہیں جنہیں اللہ نے ہدایت دی اور تمام دنیا کے لوگوں پر فضیلت دی" },
          explanation: {
            en: "Al-Yasa is named among the prophets whom Allah guided and preferred above the worlds. His name in the Qur'an is itself a reward: Allah remembers those who serve Him quietly.",
            ur: "الیسع ان انبیاء میں شمار ہوتے ہیں جنہیں اللہ نے ہدایت دی اور دنیا کے لوگوں پر فضیلت دی۔ قرآن میں ان کا نام خود انعام ہے: اللہ انہیں یاد رکھتا ہے جو چپ چاپ اس کی خدمت کرتے ہیں۔",
          },
        },
        { type: "hadith", reference: "Classical prophet-stories tradition", needsVerification: true, label: { en: "Al-Yasa' is described as the successor who continued the mission of the prophet Ilyas", ur: "اليسع کو الیاس علیہ السلام کا جانشین بتایا گیا ہے جنہوں نے نبی الیاس کا پیغام آگے بڑھایا" } },
      ],
    },
    {
      id: "named-among-the-best",
      title: { en: "Remembered Among the Best of People" },
      paragraphs: [
        {
          en: "In the Qur'an, Allah says: \"And remember Ishmael and Al-Yasa and Dhul-Kifl, and all of them are among the best\" (Qur'an 38:48).",
        },
        {
          en: "What a beautiful way to be remembered! Allah himself tells us of Al-Yasa's name among three honoured prophets — Ishmael, Al-Yasa and Dhul-Kifl — and calls them all the best of people.",
        },
        {
          en: "You might ask: why would Allah mention a prophet whose long story is not told? Because the honour itself is the message: you were patient, you were truthful, you were dedicated, and Allah did not forget you.",
        },
        {
          en: "Sometimes the most precious people are the ones who never become famous. Al-Yasa shows us that doing your duty quietly, day after day, is a treasure in the eyes of Allah.",
        },
      ],
      ayahNote: {
        en: "Allah said: remember Ishmael, Al-Yasa and Dhul-Kifl — all of them are among the best. A person who is not famous can still be beloved to Allah, because He sees the faithful heart.",
        ur: "اللہ نے فرمایا: اسماعیل، الیسع اور ذوالکفل کو یاد کرو — یہ سب بہترین لوگ ہیں۔ جو شخص مشہور نہیں وہ بھی اللہ کے نزدیک پیارا ہوتا ہے، کیونکہ اللہ وفادار دل کو دیکھتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 38:48",
          label: { en: "Allah remembers Ishmael, Al-Yasa' and Dhul-Kifl as among the best", ur: "اللہ اسماعیل، اليسع اور ذو الکفل کا ذکر ان بہترین لوگوں میں کرتا ہے" },
          explanation: {
            en: "Allah himself praises Al-Yasa together with Ishmael and Dhul-Kifl, calling them all among the best. When Allah remembers you with praise, fame is not needed.",
            ur: "اللہ خود الیسع کو اسماعیل اور ذوالکفل کے ساتھ یاد کرتا ہے اور ان سب کو بہترین کہتا ہے۔ جب اللہ آپ کو عزت سے یاد کرے تو دنیا کی شہرت کی ضرورت نہیں۔",
          },
        },
      ],
    },
    {
      id: "patient-and-true",
      title: { en: "Patient, Truthful and Devoted" },
      paragraphs: [
        {
          en: "The Qur'an also places Al-Yasa in a company of the most honoured: \"And [We guided] Ishmael and Al-Yasa and Yunus and Lut, and all of them We preferred above the worlds\" (Qur'an 6:86).",
        },
        {
          en: "Being \"preferred above the worlds\" means Allah raised them with honour — not because of wealth or fame, but because of their faith, their patience and their constant turning back to Him.",
        },
        {
          en: "Al-Yasa was a person who kept the worship of Allah pure. He was patient when people were slow to listen, truthful when lying seemed easier, and devoted when other people lost their way.",
        },
        {
          en: "His example shows us something important about Allah's scale: He judges hearts, not popularity. A quiet, honest believer can be dearer to Allah than a loud and famous one.",
        },
      ],
      ayahNote: {
        en: "Al-Yasa is placed with Ishmael, Yunus and Lut — all preferred above the worlds. Allah raises people not by their fame but by their patience, truth and constant turning to Him.",
        ur: "الیسع کا ذکر اسماعیل، یونس اور لوط کے ساتھ آیا ہے — جن سب کو دنیا کے لوگوں پر فضیلت دی گئی۔ اللہ شہرت سے نہیں، صبر، سچائی اور اپنی طرف رجوع سے بلند کرتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 6:86",
          label: { en: "Al-Yasa is mentioned with Ishmael, Yunus and Lut who were all favoured above the worlds", ur: "اليسع کا ذکر اسماعیل، یونس اور لوط کے ساتھ آیا ہے جن سب کو دنیا کے لوگوں پر فضیلت دی گئی" },
          explanation: {
            en: "Al-Yasa, Ishmael, Yunus and Lut were all preferred above the worlds — not for wealth but for faith. Patience and honesty lift a quiet person higher than fame ever could.",
            ur: "الیسع، اسماعیل، یونس اور لوط سب کو دنیا پر فضیلت ملی — مال کی وجہ سے نہیں، ایمان کی وجہ سے۔ صبر اور سچائی ایک خاموش انسان کو شہرت سے زیادہ بلند کرتی ہے۔",
          },
        },
      ],
    },
    {
      id: "example-for-us",
      title: { en: "A Great Example for Us Today" },
      paragraphs: [
        {
          en: "Al-Yasa's example reminds us of something wonderful: helping people stay on the right path is a great honour. When you remind a friend to be kind, or help your brother finish his homework, you are doing a little of what Al-Yasa did.",
        },
        {
          en: "He also teaches us humility. He did his duty even though almost no chapter of history speaks his name. He did not need to be famous to be loved by Allah.",
        },
        {
          en: "And he teaches us patience. In a world that sometimes feels loud and busy, the quiet believer who says their prayers and keeps their promises shines very brightly in the sight of Allah.",
        },
        {
          en: "So when we remember Al-Yasa, we say: let me be patient, let me be truthful, and let me do my duty faithfully — because Allah remembers those who serve Him faithfully.",
        },
      ],
      ayahNote: {
        en: "Al-Yasa teaches us: help others stay on the right path, do your duty faithfully, and be patient. Allah remembers those who serve Him quietly.",
        ur: "الیسع ہمیں سکھاتے ہیں: دوسروں کو سیدھے راستے پر رہنے میں مدد کرو، اپنا کام وفاداری سے کرو اور صبر کرو۔ اللہ انہیں یاد رکھتا ہے جو چپ چاپ اس کی خدمت کرتے ہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 38:48",
          label: { en: "Al-Yasa is counted among the best and most faithful servants remembered in the Qur'an", ur: "اليسع قرآن میں یاد کیے جانے والے بہترین اور وفادار بندوں میں شمار ہوتے ہیں" },
          explanation: {
            en: "Al-Yasa is counted among the best and most faithful servants remembered in the Qur'an. Doing your small duties well every day makes you great in the sight of Allah.",
            ur: "الیسع قرآن میں یاد کیے جانے والے بہترین اور وفادار بندوں میں شمار ہوتے ہیں۔ روزانہ کے چھوٹے کام نیکی سے کرنا آپ کو اللہ کے نزدیک بڑا بناتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 6:86",
          label: { en: "Allah guides and honours those, like Al-Yasa, who are patient and devoted", ur: "اللہ ان لوگوں کو ہدایت اور عزت دیتا ہے جو اليسع کی طرح صبر کرنے والے اور اللہ کے وفادار ہوں" },
          explanation: {
            en: "Allah guides and honours those who are patient and devoted like Al-Yasa. A quiet believer who keeps his prayers and his promises shines brightly before Allah.",
            ur: "اللہ ان لوگوں کو ہدایت اور عزت دیتا ہے جو الیسع کی طرح صبر کرنے والے اور وفادار ہوں۔ جو بندہ نماز اور وعدے نبھاتا ہے وہ اللہ کے نزدیک چمکتا ہے۔",
          },
        },
      ],
    },
  ],
};