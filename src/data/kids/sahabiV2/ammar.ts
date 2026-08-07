import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Ammar ibn Yasir (RA) — son of Yasir and Sayyidah Sumayyah, and one of the
 * very first believers of Islam (Phase 8 Batch 2).
 *
 * Citation discipline for Sahabah content: Hadith/Seerah sourced ONLY. Where a
 * specific authentic hadith number could not be confidently verified while
 * writing, the reference is marked `needsVerification: true` rather than
 * guessing a number. Chapter 3 (the forced word with a firm heart) is anchored
 * to the Qur'an (16:106); the remaining chapters use Sahih al-Bukhari/Sahih
 * Muslim and the classical Seerah (Ibn Hisham).
 */
export const SAHABI_AMMAR: KidsStoryV2 = {
  id: 'ammar',
  type: 'sahabi',
  nameArabic: 'عمار بن یاسر',
  nameEnglish: 'Ammar ibn Yasir',
  illustrationSymbol: 'Shield',
  accentColor: '#9c6b76',
  summary: {
    en: 'Ammar ibn Yasir (RA) was one of the first believers in Islam. He and his parents, Yasir and Sumayyah — free and enslaved believers — were tormented by the people of Makkah. Even when he was forced to say a word against his faith, Ammar\u2019s heart stayed firm. He stayed on the side of truth until the end, and the Prophet \uFDFA loved him dearly.',
    ur: 'عمار بن یاسر رضی اللہ عنہ اسلام کے اولین ایمان لانے والوں میں سے تھے۔ انہوں نے اپنے والد یاسر اور والدہ سمیہ کے ساتھ — جو آزاد اور غلام دونوں قسم کے مومنین میں شامل تھے — مکہ والوں کی تکلیفیں برداشت کیں۔ یہاں تک کہ جب انہیں ایمان کے خلاف ایک لفظ کہنے پر مجبور کیا گیا تب بھی ان کا دل ایمان پر قائم رہا۔ وہ آخر تک حق کے ساتھ رہے، اور نبی کریم ﷺ ان سے بہت محبت فرماتے تھے۔',
  },
  chapters: [
    {
      id: 'first-family',
      title: { en: 'A Family of the Firsts', ur: 'اولینوں کا خاندان' },
      paragraphs: [
        {
          en: 'In the early days of Islam, when most people in Makkah still worshipped idols, a small family quietly opened their hearts to the truth. The father was Yasir, a kind and gentle man. The mother was Sumayyah, a patient and brave woman. Their son was Ammar, honest and eager to learn.',
          ur: 'اسلام کے ابتدائی دنوں میں، جب مکہ کے بیشتر لوگ ابھی بھی بتوں کی پوجا کرتے تھے، ایک چھوٹا سا خاندان خاموشی سے سچائی کے لیے اپنا دل کھول رہا تھا۔ والد کا نام یاسر تھا، جو مہربان اور نرم دل انسان تھے۔ والدہ کا نام سمیہ تھا، جو صابر اور بہادر خاتون تھیں۔ ان کا بیٹا عمار تھا، جو سچا اور سیکھنے کی چاہت رکھنے والا تھا۔',
        },
        {
          en: 'Yasir and his family were strangers in Makkah — they came from far away, and they had no powerful relatives to protect them. Even so, when they heard the Prophet\u2019s message, they believed. Ammar was among the very first Muslims in the whole world.',
          ur: 'یاسر اور ان کا خاندان مکہ میں اجنبی تھا — وہ دور سے آئے تھے، اور ان کے پاس کوئی طاقتور رشتہ دار نہیں تھا جو ان کی حفاظت کرتا۔ پھر بھی، جب انہوں نے نبی کریم ﷺ کا پیغام سنا تو ایمان لے آئے۔ عمار پوری دنیا کے اولین مسلمانوں میں شامل تھے۔',
        },
        {
          en: 'Among the first Muslims were free believers like Abu Bakr (RA), whose tribe protected them, and also slaves and servants like Bilal (RA). Yasir and Sumayyah were among the believers who had no one to guard them — only Allah.',
          ur: 'اولین مسلمانوں میں ابوبکر رضی اللہ عنہ جیسے آزاد مومن بھی تھے جن کی حفاظت ان کا قبیلہ کرتا تھا، اور بلال رضی اللہ عنہ جیسے غلام اور خادم بھی۔ یاسر اور سمیہ ان مومنین میں سے تھے جن کی حفاظت کرنے والا کوئی نہیں تھا — سوائے اللہ کے۔',
        },
        {
          en: 'So Islam grew in the heart of this little family first. They prayed, they remembered Allah, and they stood together. Many great people came later, but these three — Ammar, Yasir and Sumayyah — were among the first stones of the house of Islam.',
          ur: 'اس طرح اسلام پہلے اس چھوٹے سے خاندان کے دل میں پروان چڑھا۔ وہ نماز پڑھتے، اللہ کو یاد کرتے اور ساتھ کھڑے رہتے۔ بہت سے عظیم لوگ بعد میں آئے، لیکن یہ تینوں — عمار، یاسر اور سمیہ — اسلام کے گھر کے پہلے پتھروں میں شامل تھے۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah mentions Yasir, Sumayyah and Ammar among the first believers in Makkah',
            ur: 'سیرت میں یاسر، سمیہ اور عمار کا ذکر مکہ کے اولین مومنین میں ملتا ہے',
          },
        },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          needsVerification: true,
          label: {
            en: 'The Prophet \uFDFA counted Ammar among the earliest Muslims',
            ur: 'نبی کریم ﷺ نے عمار کو اولین مسلمانوں میں شمار فرمایا',
          },
        },
      ],
    },
    {
      id: 'first-martyrs',
      title: { en: 'The First Two Martyrs', ur: 'پہلے دو شہید' },
      paragraphs: [
        {
          en: 'When the leaders of Makkah saw more people believing in Allah, they grew angry. They especially hated the believers who had no powerful tribe, because they could hurt them easily. So they turned their cruelty toward Yasir and his family.',
          ur: 'جب مکہ کے سرداروں نے دیکھا کہ مزید لوگ اللہ پر ایمان لا رہے ہیں تو وہ غصے سے بھر گئے۔ انہیں خاص طور پر ان مومنین سے نفرت تھی جن کا کوئی طاقتور قبیلہ نہیں تھا، کیونکہ وہ انہیں آسانی سے تکلیف دے سکتے تھے۔ چنانچہ انہوں نے اپنا ظلم یاسر اور ان کے خاندان پر اتارا۔',
        },
        {
          en: 'They made Yasir and Sumayyah stand under the burning sun of Makkah, on the hot sand, wearing heavy armor, until their bodies burned. They said: \u201CLeave your religion and we will let you go.\u201D But Yasir and Sumayyah never left their faith.',
          ur: 'انہوں نے یاسر اور سمیہ کو مکہ کی تپتی دھوپ میں، گرم ریت پر، بھاری زرہ پہن کر کھڑا کر دیا یہاں تک کہ ان کے جسم جلنے لگے۔ انہوں نے کہا: \u201Cاپنا دین چھوڑ دو تو ہم تمہیں چھوڑ دیں گے۔\u201D لیکن یاسر اور سمیہ نے کبھی اپنا ایمان نہیں چھوڑا۔',
        },
        {
          en: 'Then came the hardest day of all. The enemies killed Yasir, and right after that, they killed Sumayyah too — in front of their son Ammar. She was the first woman to give her life for Islam, and her husband was the first man. They became the first two martyrs of Islam.',
          ur: 'پھر سب سے سخت دن آیا۔ دشمنوں نے یاسر کو شہید کر دیا، اور اس کے فوراً بعد سمیہ کو بھی شہید کر دیا — اپنے بیٹے عمار کے سامنے۔ وہ اسلام کے لیے اپنی جان دینے والی پہلی خاتون تھیں، اور ان کے شوہر پہلے مرد تھے۔ وہ دونوں اسلام کے پہلے دو شہید بنے۔',
        },
        {
          en: 'Their names are written in gold in the history of Islam. A father and a mother who gave everything they had — their lives — for Allah. Their pain did not break them; it made their faith shine forever.',
          ur: 'ان کے نام اسلام کی تاریخ میں سنہرے حروف سے لکھے گئے ہیں۔ ایک باپ اور ایک ماں جنہوں نے اللہ کے لیے اپنا سب کچھ — اپنی جانیں — قربان کر دیں۔ ان کی تکلیف انہیں توڑ نہ سکی؛ اس نے ان کے ایمان کو ہمیشہ کے لیے روشن کر دیا۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how Yasir and Sumayyah were martyred by the people of Makkah',
            ur: 'سیرت بتاتی ہے کہ یاسر اور سمیہ کو مکہ والوں نے کیسے شہید کیا',
          },
        },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          needsVerification: true,
          label: {
            en: 'The Companions remembered Sumayyah as the first martyr of Islam',
            ur: 'صحابہ کرام سمیہ کو اسلام کی پہلی شہیدہ کے طور پر یاد کرتے تھے',
          },
        },
      ],
    },
    {
      id: 'tortured-but-strong',
      title: { en: 'Tortured but Strong', ur: 'تکلیف میں بھی مضبوط' },
      paragraphs: [
        {
          en: 'After his father and mother were gone, the enemies turned to Ammar. They tortured him again and again, day after day. They dragged him over stones, burned him, and poured water down his throat until he could not breathe — all to make him give up his faith.',
          ur: 'باپ اور ماں کے جانے کے بعد، دشمنوں نے عمار کی طرف توجہ کی۔ انہوں نے عمار کو بار بار تکلیف دی، دن بہ دن۔ انہوں نے انہیں پتھروں پر گھسیٹا، جلایا، اور ان کے گلے میں پانی ڈال کر سانس روک دی — سب کچھ اس لیے کہ وہ اپنا ایمان چھوڑ دیں۔',
        },
        {
          en: 'But Ammar\u2019s heart stayed firm. The Prophet \uFDFA had said that a believer is like a strong tree — the wind can shake it, but it does not fall. So Ammar\u2019s roots grew deeper in faith while the storm raged around him.',
          ur: 'لیکن عمار کا دل مضبوط رہا۔ نبی کریم ﷺ نے فرمایا تھا کہ مومن مضبوط درخت کی مانند ہے — ہوا اسے ہلا سکتی ہے، لیکن گرا نہیں سکتی۔ چنانچہ عمار کی جڑیں ایمان میں اور گہری ہوتی گئیں جبکہ آندھی ان کے گرد چلتی رہی۔',
        },
        {
          en: 'One day the torturers grew tired of hurting him and said: \u201CAmmar, we will stop if you say just one bad word about your religion.\u201D Ammar was so tired and in so much pain that, with his tongue only, he said what they wanted — but his heart never agreed. His heart stayed firm in faith.',
          ur: 'ایک دن عذاب دینے والے انہیں تکلیف دیتے دیتے تھک گئے اور کہا: \u201Cعمار، اگر تم اپنے دین کے بارے میں صرف ایک برا لفظ کہہ دو تو ہم تمہیں چھوڑ دیں گے۔\u201D عمار اتنے تھکے ہوئے اور اتنے تکلیف میں تھے کہ صرف زبان سے انہوں نے وہ کہہ دیا جو وہ چاہتے تھے — لیکن ان کا دل کبھی راضی نہ ہوا۔ ان کا دل ایمان پر قائم رہا۔',
        },
        {
          en: 'When the Prophet \uFDFA heard about this, he did not scold Ammar. He asked him gently: \u201CAmmar, what is in your heart?\u201D Ammar answered: \u201CO Messenger of Allah, my heart is full of faith.\u201D Then the Prophet \uFDFA was pleased and comforted him.',
          ur: 'جب نبی کریم ﷺ نے یہ سنا تو آپ نے عمار کو ڈانٹا نہیں۔ آپ نے نرمی سے پوچھا: \u201Cعمار! تمہارے دل میں کیا ہے؟\u201D عمار نے جواب دیا: \u201Cاے اللہ کے رسول! میرا دل ایمان سے بھرا ہوا ہے۔\u201D پھر نبی کریم ﷺ خوش ہوئے اور انہیں تسلی دی۔',
        },
        {
          en: 'Because of this, Allah sent down words in the Qur\u2019an (16:106): whoever is forced to speak a word against faith, while his heart is firm in belief, is not blamed. Allah looks at hearts — and Ammar\u2019s heart was with Allah.',
          ur: 'اسی لیے اللہ نے قرآن مجید میں یہ الفاظ نازل فرمائے: جسے ایمان کے خلاف لفظ کہنے پر مجبور کیا جائے، جبکہ اس کا دل ایمان پر قائم ہو، تو اس پر کوئی گناہ نہیں۔ اللہ دلوں کو دیکھتا ہے — اور عمار کا دل اللہ کے ساتھ تھا۔',
        },
      ],
      ayahNote: {
        en: 'This verse came to comfort Ammar (RA). When the people of Makkah forced him to say a word against Islam, his heart stayed firm in faith. So Allah taught us: if a person is forced to speak while his heart believes, his heart is what matters. A forced word does not harm a firm heart.',
        ur: 'یہ آیت عمار رضی اللہ عنہ کی تسلی کے لیے نازل ہوئی۔ جب مکہ والوں نے انہیں اسلام کے خلاف ایک لفظ کہنے پر مجبور کیا تو ان کا دل ایمان پر قائم رہا۔ اس لیے اللہ نے ہمیں سکھایا: اگر کوئی شخص مجبور ہو کر کہے جبکہ اس کا دل ایمان رکھتا ہو تو اصل اہمیت اس کے دل کی ہے۔ مجبوری کا لفظ قائم دل کو نقصان نہیں پہنچا سکتا۔',
      },
      sources: [
        {
          type: 'quran',
          reference: "Qur'an 16:106",
          label: {
            en: 'Allah says a person forced to speak against faith, whose heart stays firm in belief, is not blamed',
            ur: 'اللہ فرماتا ہے کہ جو شخص ایمان کے خلاف لفظ کہنے پر مجبور ہو جبکہ اس کا دل ایمان پر قائم ہو تو اس پر کوئی گناہ نہیں',
          },
          explanation: {
            en: 'These verses were revealed about the believers who were forced to speak while their hearts stayed firm. Ammar (RA) was one of them: his tongue said a word under torture, but his heart remained with Allah, so Allah did not blame him.',
            ur: 'یہ آیتیں ان مومنین کے بارے میں نازل ہوئیں جنہیں کہنے پر مجبور کیا گیا جبکہ ان کے دل قائم رہے۔ عمار رضی اللہ عنہ انہی میں سے تھے: تکلیف کے وقت ان کی زبان نے ایک لفظ کہہ دیا، لیکن ان کا دل اللہ کے ساتھ رہا، اس لیے اللہ نے ان پر کوئی الزام نہیں رکھا۔',
          },
        },
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how Ammar was tortured and how the Prophet \uFDFA comforted him',
            ur: 'سیرت بتاتی ہے کہ عمار کو کیسے تکلیف دی گئی اور نبی کریم ﷺ نے انہیں کیسے تسلی دی',
          },
        },
      ],
    },
    {
      id: 'with-the-truth',
      title: { en: 'With the Truth Until the End', ur: 'آخر تک حق کے ساتھ' },
      paragraphs: [
        {
          en: 'The Prophet \uFDFA loved Ammar very much. He called him by an affectionate name and said: \u201CAmmar, I am pleased with you.\u201D And when Ammar fought in battles beside the Prophet \uFDFA, he always stood closest to the truth.',
          ur: 'نبی کریم ﷺ عمار سے بہت محبت فرماتے تھے۔ آپ ﷺ انہیں محبت بھرے نام سے پکارتے تھے اور فرماتے تھے: \u201Cعمار! میں تم سے راضی ہوں۔\u201D اور جب عمار نبی کریم ﷺ کے ساتھ جنگوں میں لڑتے تو ہمیشہ حق کے سب سے قریب کھڑے رہتے۔',
        },
        {
          en: 'One day the Prophet \uFDFA told Ammar something mysterious. He said: \u201CO Ammar, a group of people will fight you, and they will be the ones in the wrong.\u201D Ammar was surprised, but he trusted the words of the Prophet \uFDFA and kept them in his heart.',
          ur: 'ایک دن نبی کریم ﷺ نے عمار کو ایک پراسرار بات بتائی۔ آپ ﷺ نے فرمایا: \u201Cاے عمار! ایک گروہ تم سے لڑے گا، اور وہی گروہ حق پر نہ ہوگا۔\u201D عمار حیران ہوئے، لیکن انہوں نے نبی کریم ﷺ کی بات پر بھروسہ کیا اور اسے اپنے دل میں رکھ لیا۔',
        },
        {
          en: 'Years later, after the Prophet \uFDFA had passed away, that day came. Even then, Ammar stayed on the side of truth. His heart never left the way of the Prophet \uFDFA, and he fought only for what was right — until the very end.',
          ur: 'کئی سال بعد، جب نبی کریم ﷺ اس دنیا سے تشریف لے گئے، وہ دن آ گیا۔ تب بھی عمار حق کے ساتھ کھڑے رہے۔ ان کا دل کبھی نبی کریم ﷺ کے راستے سے نہ ہٹا، اور وہ صرف حق کے لیے لڑے — آخری سانس تک۔',
        },
        {
          en: 'Ammar stayed on the side of truth until the end of his life. He was a companion who loved the Prophet \uFDFA, obeyed Allah, and never traded the truth for anything in this world. This is why the Muslims remember him with love and honor.',
          ur: 'عمار اپنی زندگی کے آخری لمحے تک حق کے ساتھ رہے۔ وہ ایک ایسے صحابی تھے جنہوں نے نبی کریم ﷺ سے محبت کی، اللہ کی اطاعت کی، اور سچ کو کبھی دنیا کی کسی چیز کے بدلے نہیں بیچا۔ یہی وجہ ہے کہ مسلمان انہیں محبت اور عزت کے ساتھ یاد کرتے ہیں۔',
        },
      ],
      ayahNote: {
        en: 'This chapter teaches what the Prophet \uFDFA said about Ammar: that he stays with the truth until the end. For children, the lesson is simple: when you love Allah and His Messenger and you hold on to what is right, no storm can move you. The truth loves those who love it.',
        ur: 'اس باب میں نبی کریم ﷺ کا وہ فرمان سکھایا گیا ہے جو عمار کے بارے میں ہے: کہ وہ آخر تک حق کے ساتھ رہیں گے۔ بچوں کے لیے سبق آسان ہے: جب آپ اللہ اور اس کے رسول سے محبت کریں اور حق کو تھامے رہیں تو کوئی طوفان آپ کو نہیں ہلا سکتا۔ حق ان سے محبت کرتا ہے جو اس سے محبت کرتے ہیں۔',
      },
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          needsVerification: true,
          label: {
            en: 'The Prophet \uFDFA said Ammar stays with the truth until the end',
            ur: 'نبی کریم ﷺ نے فرمایا کہ عمار آخر تک حق کے ساتھ رہیں گے',
          },
        },
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how Ammar remained loyal to the truth after the Prophet \uFDFA passed away',
            ur: 'سیرت بتاتی ہے کہ نبی کریم ﷺ کے بعد عمار حق پر کیسے قائم رہے',
          },
        },
      ],
    },
    {
      id: 'lessons',
      title: { en: 'Lessons from Ammar', ur: 'عمار سے سبق' },
      paragraphs: [
        {
          en: 'The first lesson is patience under pressure. Ammar was tortured many times, but he never gave up. Patience means holding on to what is right even when it is hard. Allah loves the patient.',
          ur: 'پہلا سبق مصیبت میں صبر ہے۔ عمار کو کئی بار تکلیف دی گئی، لیکن انہوں نے کبھی ہمت نہیں ہاری۔ صبر کا مطلب ہے حق کو تھامے رہنا چاہے حالات کتنے ہی سخت ہوں۔ اللہ صبر کرنے والوں سے محبت کرتا ہے۔',
        },
        {
          en: 'The second lesson is a family that stands for the truth. Yasir, Sumayyah and Ammar stood together. They did not leave each other, and they did not leave their faith. A family that loves Allah together is strong like a mountain.',
          ur: 'دوسرا سبق حق پر قائم رہنے والا خاندان ہے۔ یاسر، سمیہ اور عمار ساتھ کھڑے رہے۔ انہوں نے نہ ایک دوسرے کو چھوڑا اور نہ اپنا ایمان۔ وہ خاندان جو مل کر اللہ سے محبت کرتا ہے پہاڑ جیسا مضبوط ہوتا ہے۔',
        },
        {
          en: 'The third lesson is sincerity to Allah. Ammar\u2019s heart stayed sincere even when his tongue was forced. Sincerity means our hearts, our words and our actions all point to Allah. Allah sees what is inside every heart.',
          ur: 'تیسرا سبق اللہ کے ساتھ خلوص ہے۔ جب عمار کی زبان پر زبردستی کی گئی تب بھی ان کا دل خلوص سے بھرا رہا۔ خلوص کا مطلب ہے کہ ہمارا دل، ہمارے الفاظ اور ہمارے عمل سب اللہ کی طرف اشارہ کریں۔ اللہ ہر دل کے باطن کو دیکھتا ہے۔',
        },
        {
          en: 'So, dear child, when life is hard, remember Ammar: be patient, stand with your family for the truth, and keep your heart sincere to Allah. That is how a person becomes a companion of the truth, in this world and the next.',
          ur: 'پیارے بچے، جب حالات سخت ہوں تو عمار کو یاد رکھیں: صبر کریں، حق پر اپنے خاندان کے ساتھ کھڑے رہیں، اور اپنے دل کو اللہ کے لیے خالص رکھیں۔ اس طرح ایک شخص اس دنیا اور آخرت دونوں میں حق کا ساتھی بن جاتا ہے۔',
        },
      ],
      ayahNote: {
        en: 'All the lessons of Ammar come back to one idea: keep your heart with Allah. When the heart is with Allah, no one can force it to leave the truth — not even torture. Patience, family love and sincerity all begin in a heart that belongs to Allah.',
        ur: 'عمار کے تمام اسباق ایک ہی بات پر واپس آتے ہیں: اپنے دل کو اللہ کے ساتھ رکھیں۔ جب دل اللہ کے ساتھ ہوتا ہے تو کوئی اسے حق چھوڑنے پر مجبور نہیں کر سکتا — حتیٰ کہ عذاب بھی نہیں۔ صبر، خاندان کی محبت اور خلوص سب ایک ایسے دل سے شروع ہوتے ہیں جو اللہ کا ہوتا ہے۔',
      },
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          needsVerification: true,
          label: {
            en: 'The Prophet \uFDFA praised patience as a light in times of hardship',
            ur: 'نبی کریم ﷺ نے صبر کو تکلیف کے وقت روشنی قرار دیا',
          },
        },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim',
          needsVerification: true,
          label: {
            en: 'The Prophet \uFDFA said Allah loves those who are sincere and firm',
            ur: 'نبی کریم ﷺ نے فرمایا کہ اللہ خلوص اور استقامت رکھنے والوں سے محبت کرتا ہے',
          },
        },
      ],
    },
  ],
};