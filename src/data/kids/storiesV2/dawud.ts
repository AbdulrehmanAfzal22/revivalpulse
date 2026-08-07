import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Dawud (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * Bilingual English/Urdu story of the shepherd-king of Bani Isra'il: his
 * defeat of the giant Jalut, the gift of the Zabur, the mountains and birds
 * joining his glorification, and the iron that softened in his hands.
 * Every Quran-narrated event carries its actual verse; the one hadith
 * (Dawud eating from his own handiwork) is Sahih al-Bukhari. Urdu is given
 * on the summary only; paragraphs show the English fallback until translated.
 */
export const STORY_DAWUD: KidsStoryV2 = {
  id: "dawud",
  type: "prophet",
  nameArabic: "داود",
  nameEnglish: "Dawud (David)",
  illustrationSymbol: "Shield",
  accentColor: "#556b8d",
  summary: {
    en: "Dawud was given a beautiful voice for praising Allah — the mountains and birds are described as glorifying Allah along with him. He was also taught to make armor.",
    ur: "داؤد علیہ السلام کو اللہ نے تسبیح کے لیے بہت خوب صورت آواز عطا کی تھی — قرآن میں ہے کہ پہاڑ اور پرندے اُن کے ساتھ مل کر اللہ کی تسبیح کرتے تھے۔ اللہ نے اُنہیں زرہ بنانا بھی سکھایا تھا۔",
  },
  chapters: [
    {
      id: "young-shepherd",
      title: { en: "The Young Shepherd and the Giant" },
      paragraphs: [
        {
          en: "Dawud was still a young shepherd when the army of the believers marched out to face the giant soldier Jalut. Jalut was huge, strong and proud, and his soldiers terrified the people. Everyone was afraid — but not Dawud, because he trusted in Allah.",
        },
        {
          en: "The Qur'an says: “So they defeated them by permission of Allah, and David killed Goliath, and Allah gave him the kingship and wisdom” (Qur'an 2:251). With a single stone from his sling, Allah helped the young shepherd bring the giant down.",
        },
        {
          en: "No one could believe their eyes. The same boy who had been caring for sheep just a little while ago now stood as the brave soldier who had saved the army. He had not won with big weapons or strong muscles — he had won by putting his trust in Allah.",
        },
        {
          en: "After that day, Allah gave Dawud a great kingdom and wisdom. The Qur'an remembers him as “Our servant David, the man of strength. Indeed, he constantly turned to Allah” (Qur'an 38:17).",
        },
        {
          en: "Dawud's story teaches us that strength without trust in Allah is nothing. Even a small person, with Allah's help, can do great things — just like a young shepherd with a small stone.",
        },
      ],
      ayahNote: {
        en: "The whole chapter rests on two ayahs: a young shepherd defeats the giant by Allah's permission, and Allah gives him kingship and wisdom. True strength is trusting Allah, not size or weapons.",
        ur: "پورا باب دو آیات پر قائم ہے۔ ایک نوجوان چرواہا اللہ کی اجازت سے دیو کو ہرا دیتا ہے، اور اللہ اسے بادشاہی اور حکمت دیتا ہے۔ سچی طاقت اللہ پر بھروسہ ہے، جسامت یا ہتھیار نہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 2:251",
          label: { en: "David kills the giant Goliath and Allah gives him the kingdom and wisdom", ur: "داؤد نے دیو جالوت کو مارا اور اللہ نے انہیں بادشاہی اور حکمت عطا کی" },
          explanation: {
            en: "The stone and the sling were small, but Allah's permission made them enough. This ayah tells us: when Allah decides to help someone, no giant can stand in the way.",
            ur: "پتھر اور گوپھلی چھوٹی تھیں، لیکن اللہ کی اجازت نے انہیں کافی بنا دیا۔ یہ آیت بتاتی ہے کہ جب اللہ کسی کی مدد کا فیصلہ کر لے تو کوئی دیو راستے میں نہیں کھڑا ہو سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 38:17",
          label: { en: "Allah calls Dawud His servant of strength who always turned back to Him", ur: "اللہ داؤد کو اپنا مضبوط بندہ کہتا ہے جو ہمیشہ اللہ کی طرف رجوع کرتا تھا" },
          explanation: {
            en: "Allah praised Dawud with two beautiful words: a man of strength, and one who constantly turns back to Allah. Strength with repentance is what made him great.",
            ur: "اللہ نے داؤد کی دو خوبصورت صفات بیان کیں۔ مضبوط بندہ، اور ہمیشہ اللہ کی طرف رجوع کرنے والا۔ طاقت کے ساتھ توبہ ہی نے انہیں عظیم بنایا۔",
          },
        },
      ],
    },
    {
      id: "zabur-voice",
      title: { en: "The Zabur and the Mountains That Sang" },
      paragraphs: [
        {
          en: "Allah gave Dawud a very special book called the Zabur, the book of praises. The Qur'an tells us: “And to David We gave the book of Psalms” (Qur'an 17:55). Dawud recited it with the most beautiful voice anyone had ever heard.",
        },
        {
          en: "His voice was so lovely that even the mountains joined him! Allah says: “Indeed, We subjected the mountains to glorify with him in the evening and after sunrise, and the birds, flocking together, all turned to him” (Qur'an 38:18–19).",
        },
        {
          en: "Imagine the big, heavy mountains echoing the praises of Allah along with Dawud's voice, and the birds gathering around him to sing too. The whole of creation seemed to join the prophet in thanking Allah.",
        },
        {
          en: "This was Allah's gift to Dawud, but Dawud never forgot Who gave it to him. Every morning and every evening, he turned to Allah with his beautiful voice, and the world around him turned with him.",
        },
        {
          en: "We can learn something lovely from this: when we praise Allah with a happy heart, even the world around us seems to shine. Praising Allah is a gift that never runs out.",
        },
      ],
      ayahNote: {
        en: "The Zabur was a book of praises, and the mountains and birds joined Dawud in glorifying Allah. When your heart is full of Allah's remembrance, the whole world seems to sing with you.",
        ur: "زبور تعریف کا صحیفہ تھا، اور پہاڑ اور پرندے داؤد کے ساتھ مل کر اللہ کی تسبیح کرتے تھے۔ جب دل اللہ کے ذکر سے بھرا ہو تو ساری دنیا آپ کے ساتھ گاتی دکھائی دیتی ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 17:55",
          label: { en: "Allah gave Dawud the Zabur, the book of Psalms", ur: "اللہ نے داؤد کو زبور عطا کی، جو تعریف کا صحیفہ ہے" },
          explanation: {
            en: "This ayah says Allah gave Dawud the Zabur, the book of Psalms. It was a special gift — a book of praise that Dawud recited with his famous beautiful voice.",
            ur: "یہ آیت بتاتی ہے کہ اللہ نے داؤد کو زبور عطا کی۔ یہ ایک خاص تحفہ تھا، تعریف کا صحیفہ جو داؤد اپنی مشہور خوب صورت آواز سے پڑھتے تھے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 38:18–19",
          label: { en: "The mountains and birds glorify Allah along with Dawud", ur: "پہاڑ اور پرندے داؤد کے ساتھ مل کر اللہ کی تسبیح کرتے ہیں" },
          explanation: {
            en: "Allah made the mountains repeat the praises with Dawud and gathered the birds to him. This shows how beloved His servant's voice was in the heavens and on the earth.",
            ur: "اللہ نے پہاڑوں کو داؤد کے ساتھ تسبیح دہرائی اور پرندوں کو ان کی طرف جمع کیا۔ اس سے اللہ یہ ظاہر کرتا ہے کہ اس کے بندے کی آواز آسمان و زمین میں کتنی محبوب تھی۔",
          },
        },
      ],
    },
    {
      id: "iron-armor",
      title: { en: "Armor from Soft Iron" },
      paragraphs: [
        {
          en: "Allah gave Dawud another amazing gift: the iron became soft in his hands. The Qur'an says: “And We made pliable for him iron, commanding him: make full coats of mail and calculate precisely the links” (Qur'an 34:10–11).",
        },
        {
          en: "So Dawud would sit and shape the metal with his own hands, like a child shaping soft clay. He made coats of mail — strong armor that protected the soldiers in battle.",
        },
        {
          en: "Allah also says: “And We taught him the making of metal coats of mail, to protect you in your fighting” (Qur'an 21:80). So the armor Dawud made was not just for himself — it protected his whole people.",
        },
        {
          en: "Dawud made every single ring carefully, neither too loose nor too tight, so the armor was strong and beautiful. He worked with patience, because Allah says: “Indeed, I, of what you do, am Seeing” (Qur'an 34:11).",
        },
        {
          en: "Dawud teaches us that Allah gives everyone different talents. Some sing beautifully, some are strong, some are clever with their hands — and every talent is a gift to use for good, just as Dawud used his to protect others.",
        },
      ],
      ayahNote: {
        en: "Allah made iron soft in Dawud's hands and taught him to make armor. The ayah that Allah is Seeing of all deeds reminds us: Allah watches even our careful, honest work.",
        ur: "اللہ نے داؤد کے ہاتھوں میں لوہا نرم کیا اور انہیں زرہ بنانا سکھایا۔ یہ آیت کہ اللہ سب کچھ دیکھتا ہے، یاد دلاتی ہے کہ اللہ ہماری مہارت اور ایمانداری سے کیے گئے کام کو بھی دیکھتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 34:10–11",
          label: { en: "Allah makes iron soft for Dawud and commands him to make precise coats of mail", ur: "اللہ داؤد کے لیے لوہے کو نرم کرتا ہے اور حکم دیتا ہے کہ مکمل اور ہموار زرہ بنائیں" },
          explanation: {
            en: "Iron usually stays hard, but Allah made it soft for Dawud like clay. The command to measure the rings carefully teaches that work done with precision and honesty is worship.",
            ur: "لوہا عام طور پر سخت رہتا ہے، لیکن اللہ نے اسے داؤد کے لیے مٹی کی طرح نرم کر دیا۔ کڑیوں کو برابر کرنے کا حکم سکھاتا ہے کہ مہارت اور ایمانداری سے کیا گیا کام عبادت ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 21:80",
          label: { en: "Allah taught Dawud the making of armor to protect people in battle", ur: "اللہ نے داؤد کو زرہ بنانا سکھایا تاکہ لوگ لڑائی میں محفوظ رہیں" },
          explanation: {
            en: "The armor was not a toy — it protected soldiers in real battles. Allah taught Dawud a skill that shielded his whole people, showing that useful skills are a great gift.",
            ur: "زرہ کھلونا نہیں تھی، یہ جنگ میں سپاہیوں کی حفاظت کرتی تھی۔ اللہ نے داؤد کو ایسا ہنر سکھایا جو پوری قوم کی ڈھال بنا۔ اس سے معلوم ہوتا ہے کہ کارآمد ہنر بہت بڑا تحفہ ہے۔",
          },
        },
      ],
    },
    {
      id: "wise-judge",
      title: { en: "The Wise Judge and the Two Visitors" },
      paragraphs: [
        {
          en: "One day, while Dawud was praying in his sanctuary, two men climbed over the wall and came into his room. They were brothers with a quarrel, and they asked the prophet to judge between them fairly (Qur'an 38:21–22).",
        },
        {
          en: "One of them said: “This brother of mine has ninety-nine sheep while I have only one sheep, and he asked me to give it up to him” (Qur'an 38:23). He begged Dawud to stop his brother from taking the last sheep he had.",
        },
        {
          en: "Dawud listened and gave a just decision. But then he understood something: Allah had used this quarrel as a gentle test for him. The Qur'an says: “Then David realized that We had tested him, so he asked for his Lord's forgiveness, fell down in prostration, and turned to Him in repentance” (Qur'an 38:24).",
        },
        {
          en: "And Allah was pleased with him: “So We forgave him that” (Qur'an 38:25). Dawud, the king and prophet, bowed to the ground before his Lord and said sorry from his heart — and Allah's mercy was bigger than any mistake.",
        },
        {
          en: "This chapter teaches us that no one is too big or too important to ask Allah for forgiveness. Even a king should bow his head and say sorry, because Allah loves those who turn back to Him.",
        },
      ],
      ayahNote: {
        en: "The two visitors tested Dawud's justice, and then he understood it was a test from Allah. He fell in prostration and repented — even prophets show us how to say sorry to Allah.",
        ur: "دو مہمانوں نے داؤد کے انصاف کا امتحان لیا، پھر داؤد سمجھ گئے کہ یہ اللہ کی آزمائش تھی۔ انہوں نے سجدہ کیا اور توبہ کی۔ نبی بھی ہمیں سکھاتے ہیں کہ اللہ سے معافی کیسے مانگی جاتی ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 38:21–23",
          label: { en: "Two quarrelling brothers climb into Dawud's sanctuary and ask for a fair judgment", ur: "دو جھگڑتے بھائی داؤد کے عبادت خانے میں چڑھ کر آتے ہیں اور انصاف کا فیصلہ مانگتے ہیں" },
          explanation: {
            en: "Two brothers came to Dawud for a judgment about sheep. The story shows that even a king can be tested with a small dispute — Allah tests hearts at any moment.",
            ur: "دو بھائی بکریوں کے جھگڑے کا فیصلہ لینے داؤد کے پاس آئے۔ کہانی بتاتی ہے کہ بادشاہ بھی چھوٹے جھگڑے سے آزمایا جا سکتا ہے۔ اللہ کسی بھی لمحے دلوں کو آزماتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 38:24–25",
          label: { en: "Dawud judges, then realizes it was a test, prostrates and repents, and Allah forgives him", ur: "داؤد فیصلہ کرتے ہیں، پھر سمجھ جاتے ہیں کہ یہ آزمائش تھی، سجدہ کرتے ہیں اور توبہ کرتے ہیں اور اللہ انہیں معاف کر دیتا ہے" },
          explanation: {
            en: "Dawud could have been proud of his wise judgment, but instead he fell in prostration. This ayah teaches: no matter how great you are, repentance keeps your heart clean.",
            ur: "داؤد اپنے دانش مند فیصلے پر فخر کر سکتے تھے، لیکن انہوں نے سجدہ کیا۔ یہ آیت سکھاتی ہے کہ آپ چاہے کتنے ہی عظیم ہوں، توبہ دل کو صاف رکھتی ہے۔",
          },
        },
      ],
    },
    {
      id: "humble-king",
      title: { en: "A King Who Worked with His Own Hands" },
      paragraphs: [
        {
          en: "Dawud was a king with a huge kingdom, but he never became lazy or proud. Even as a king, he worked with his own hands, making armor and earning his own food.",
        },
        {
          en: "The Prophet Muhammad, peace and blessings be upon him, told us: “Nobody has ever eaten a better meal than that which one has earned by working with one's own hands. The Prophet of Allah, Dawud, used to eat from the earnings of his manual labor” (Sahih al-Bukhari 2072).",
        },
        {
          en: "So the mighty king of Bani Isra'il sat and worked like a craftsman, and his food was earned through his own honest work. He did not ask anyone for anything — he used the hands Allah had gifted him.",
        },
        {
          en: "Dawud's example is beautiful for children: no job is too small when it is done honestly, and no one is too big to work. Allah loves the hands that work hard and the hearts that stay humble.",
        },
      ],
      ayahNote: {
        en: "This chapter holds no ayah — its light comes from a hadith of the Prophet (PBUH): no meal is better than one earned by one's own hands. Dawud, a king, ate from his own work.",
        ur: "اس باب میں کوئی آیت نہیں، اس کی روشنی نبی کریم ﷺ کی حدیث سے ہے۔ اپنے ہاتھوں کی کمائی سے بہتر کوئی کھانا نہیں۔ داؤد بادشاہ ہو کر بھی اپنی محنت کی کمائی کھاتے تھے۔",
      },
      sources: [
        { type: "hadith", reference: "Sahih al-Bukhari 2072", label: { en: "The Prophet (PBUH) says no meal is better than one earned by one's own hands, and Dawud ate from his own manual labor", ur: "نبی کریم ﷺ نے فرمایا کہ اپنے ہاتھوں کی کمائی سے بہتر کوئی کھانا نہیں اور داؤد اپنی محنت کی کمائی سے کھاتے تھے" } },
      ],
    },
  ],
};
