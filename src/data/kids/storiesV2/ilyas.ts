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
      ayahNote: {
        en: "The first word about Ilyas is a great honour: he is counted among the messengers. A messenger is someone sent by Allah to carry the truth to his people, and Ilyas carried that call with patience and mercy.",
        ur: "الیاس کا ذکر اللہ کے رسولوں میں ہوتا ہے۔ رسول وہ محبوب ہوتے ہیں جنہیں اللہ اپنی سچائی لوگوں تک پہنچانے کے لیے چنتا ہے، اور الیاس نے یہ دعوت صبر اور رحمت کے ساتھ سنائی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:123",
          label: { en: "Ilyas is counted among the messengers of Allah", ur: "الیاس اللہ کے رسولوں میں شمار ہوتے ہیں" },
          explanation: {
            en: "To be numbered among the messengers is the highest honour. Ilyas was specially chosen by Allah, and his name is written in the Qur'an so that no one ever forgets him.",
            ur: "رسولوں میں شمار ہونا سب سے بڑا اعزاز ہے۔ اللہ نے الیاس کو خصوصی طور پر چنا، اور اسی لیے ان کا نام قرآن میں لکھا ہے تاکہ کوئی انہیں کبھی نہ بھولے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:124",
          label: { en: "Ilyas calls his people to fear Allah alone", ur: "الیاس اپنی قوم کو صرف اللہ سے ڈرنے کی دعوت دیتے ہیں" },
          explanation: {
            en: "Ilyas asked a gentle but deep question: do you not fear Allah? He did not want to scare the people — he cared for them to remember the One who gives life, food and peace.",
            ur: "الیاس نے نرمی سے پوچھا: کیا تم اللہ سے نہیں ڈرتے؟ مقصد ڈرانا نہیں تھا، بلکہ لوگوں کو اس رب کی یاد دلانا تھا جو انہیں زندگی، خوردونوش اور سکون عطا کرتا ہے۔",
          },
        },
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
      ayahNote: {
        en: "Ilyas put the whole lesson in one question: why call upon an idol made by your own hands and leave the Creator who made your hands and the whole world? Only the One who made everything deserves our hearts.",
        ur: "الیاس نے ایک ہی سوال میں پورا سبق دیا: تمہارے اپنے ہاتھوں کا بنایا بت کیوں، اور تمہارے ہاتھ پورے جہان بنانے والا خالق کیوں چھوٹا؟ ہمارا دل صرف اس کا حق ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:125",
          label: { en: "Ilyas challenges the people who call upon the idol Ba'l instead of the Best of Creators", ur: "الیاس ان لوگوں سے سوال کرتے ہیں جو بہترین خالق کو چھوڑ کر بت بعل کو پکارتے ہیں" },
          explanation: {
            en: "The idol could not hear a word or send a single help, yet the people bowed before it. Ilyas gave them the truth: only the One Who truly creates is the Best of Creators, and He alone is worth calling.",
            ur: "بت نہ سن سکتا تھا اور نہ کسی کی مدد کر سکتا تھا، پھر بھی لوگ اس کے آگے جھکتے تھے۔ الیاس نے سچ یہ دلایا: جو سب کو پیدا کرتا ہے وہی بہتر خالق ہے، اور اسی کو پکارنا چاہیے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:126",
          label: { en: "Allah is your Lord and the Lord of your forefathers", ur: "اللہ تمہارا رب ہے اور تمہارے پہلے باپ دادا کا رب" },
          explanation: {
            en: "Allah is not only the Lord of this one people, He has been the Lord of their fathers and grandfathers too. There has never been a time when He was not the true Lord of everything.",
            ur: "اللہ صرف اس قوم کا رب نہیں، بلکہ ان کے باپ داداؤں کا بھی رب ہے۔ کوئی زمانہ ایسا نہیں گزرا، جب اللہ ہر چیز کا حقیقی رب نہ ہو۔",
          },
        },
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
      ayahNote: {
        en: "When people refuse the truth, the Qur'an does not hide the heavy cost: rejecting the messenger brings loss. But right beside it is a warm promise — the sincere servants of Allah are kept safe and protected.",
        ur: "جب لوگ سچ کو ٹھکرا دیتے ہیں تو قرآن اس بات کو چھپاتا نہیں: رسول کو جھٹلانے کا نقصان بہت بڑا ہے۔ لیکن اسی کے ساتھ ایک پیارا وعدہ بھی ہے — اللہ کے سچے بندے ہمیشہ محفوظ رہتے ہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:127",
          label: { en: "The people deny Ilyas and are warned that they will be brought for punishment", ur: "لوگ الیاس کو جھٹلاتے ہیں اور خبردار کیا جاتا ہے کہ انہیں سزا کے لیے لایا جائے گا" },
          explanation: {
            en: "Denying a messenger is not a small mistake. When someone brings the truth and we push it away, we lose the door of guidance — and that lost opportunity carries a heavy price.",
            ur: "رسول کو جھٹلانا کوئی معمولی غلطی نہیں۔ جب سچی بات آئے اور ہم اسے دور دھکیلیں تو ہم ہدایت کے دروازے سے محروم ہو جاتے ہیں، اور یہ نقصان بہت بھاری ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:128",
          label: { en: "Allah's chosen servants are singled out from the punishment", ur: "اللہ کے چنے ہوئے بندے سزا سے محفوظ رہیں گے" },
          explanation: {
            en: "Even among a people who refused, there were hidden believers who never bowed to the idol. Allah told them they are protected — belonging to Allah and staying loyal to Him is the safest place to be.",
            ur: "انکار کرنے والی قوم میں بھی کچھ صادق امانت دار پوشیدہ تھے جنہوں نے کبھی بت کو نہ جھکے۔ اللہ نے انہیں یقین دیا کہ وہ اپنی حفاظت میں ہیں — اللہ کے ساتھ ہونا سب سے محفوظ جگہ ہے۔",
          },
        },
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
      ayahNote: {
        en: "Even when people turned away, Allah did not let Ilyas be forgotten. His name lives in the Qur'an with a greeting of peace — a good remembrance that never dies and shines brighter than any idol.",
        ur: "جب لوگوں نے الیاس کو ٹھکرا دیا تو اللہ نے انہیں بھلایا نہیں۔ ان کا نام قرآن میں سلام کے ساتھ زندہ ہے — ویسا اچھا ذکر جو کبھی نہیں مٹتا، اور ہر بت سے زیادہ روشن ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:129–130",
          label: { en: "Allah leaves a good mention of Ilyas and greets him with peace", ur: "اللہ الیاس کا اچھا ذکر باقی رکھتا ہے اور انہیں سلام کے ساتھ یاد کرتا ہے" },
          explanation: {
            en: "No statue could ever return the love Ilyas had shown. So Allah gave him something nothing of stone has power: a name remembered with the greeting of peace, for every generation up to our own.",
            ur: "کوئی مجسمہ الیاس کی محبت کا بدلہ نہیں دے سکتا تھا۔ اس لیے اللہ نے انہیں وہ چیز دی جس پر کوئی پتھر قابو نہیں رکھتا: ایک ایسا نام جو ہر نسل میں سلام کے ساتھ یاد کیا جاتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 6:85",
          label: { en: "Ilyas is named among the righteous with Zakariyya, Yahya and Isa", ur: "الیاس کا نام زکریا، یحییٰ اور عیسیٰ کے ساتھ نیک لوگوں میں لیا جاتا ہے" },
          explanation: {
            en: "The Qur'an lists Ilyas together with Zakariyya, Yahya and Isa among the righteous. His place is alongside the purest prophets, and his good path shines just like theirs.",
            ur: "قرآن زکریا، یحییٰ اور عیسیٰ کے ساتھ الیاس کا نام نیک لوگوں میں لیتا ہے۔ یعنی ان کا مقام پاک نبیوں کے شانہ بشانہ ہے، اور ان کی نیکی کا سورج انہی کی طرح روشن ہے۔",
          },
        },
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
      ayahNote: {
        en: "Peace upon Ilyas is a message for every age: whoever keeps his heart pure for Allah — whether people praise him or ignore him — is walking on the road of the prophets.",
        ur: "الیاس پر سلام ہر زمانے کے لیے ایک زندہ سبق ہے۔ جو اپنے دل کو اللہ کے لیے صاف رکھتا ہے، چاہے لوگ اس کی تعریف کریں یا نظر انداز کریں، وہی انبیاء کی راہ پر چلتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:130",
          label: { en: "Peace upon Ilyas stands as a model of patience and pure worship for every generation", ur: "الیاس پر سلام ہر نسل کے لیے صبر اور خالص عبادت کی مثال ہے" },
          explanation: {
            en: "The peace Allah places on Ilyas is a reward for patience and sincere worship. It tells children that worship done for Allah alone is never wasted, even when nobody sees it.",
            ur: "اللہ کی طرف سے الیاس پر سلام صبر اور خالص عبادت کا انعام ہے۔ یہ بچوں کو سکھاتا ہے کہ صرف اللہ کے لیے کی گئی عبادت کبھی ضائع نہیں ہوتی، چاہے کوئی اسے دیکھے یا نہ دیکھے۔",
          },
        },
      ],
    },
  ],
};