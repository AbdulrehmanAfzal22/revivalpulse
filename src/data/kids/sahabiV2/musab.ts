import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Mus'ab ibn Umayr (RA) — the first teacher and ambassador of Islam, sent by
 * the Prophet (SAW) to Madinah after the first pledge of Aqabah (Phase 8
 * Batch 2).
 *
 * Citation discipline for Sahabah content: Hadith/Seerah sourced ONLY. Where a
 * specific authentic hadith number could not be confidently verified while
 * writing, the reference is marked `needsVerification: true` rather than
 * guessing a number. Chapter 5 (the martyrdom at Uhud) is anchored to the
 * Qur'an (3:169); the remaining chapters use the classical Seerah (Ibn
 * Hisham) and Ibn Kathir's al-Bidayah.
 */
export const SAHABI_MUSAB: KidsStoryV2 = {
  id: 'musab',
  type: 'sahabi',
  nameArabic: 'مصعب بن عمیر',
  nameEnglish: "Mus'ab ibn Umayr",
  illustrationSymbol: 'BookOpen',
  accentColor: '#3a6fbe',
  summary: {
    en: "Mus'ab ibn Umayr (RA) was the best-dressed and most beloved young man of Makkah, raised in wealth and luxury. But when he found the truth of Islam, he gave up everything — his mother's love, his riches and his comfort. The Prophet \uFDFA sent him to Madinah as the first teacher of Islam, and through his gentleness many hearts opened. At Uhud, Mus'ab died bravely holding the flag of the Prophet, wearing a shroud so thin that his feet showed. His life teaches us that the real treasure is faith.",
    ur: 'مصعب بن عمیر رضی اللہ عنہ مکہ کے سب سے خوبصورت اور مالدار نوجوان تھے، جن کی پرورش آسائشوں میں ہوئی۔ لیکن جب انہوں نے اسلام کا سچ پہچان لیا تو سب کچھ چھوڑ دیا — ماں کی محبت، دولت اور آرام۔ نبی کریم ﷺ نے انہیں مدینہ میں اسلام کے پہلے معلم بنا کر بھیجا، اور ان کی نرمی سے بہت سے دل کھل گئے۔ جنگ احد میں مصعب نبی ﷺ کا جھنڈا اٹھائے بہادری سے شہید ہوئے، اور ان کا کفن اتنا پتلا تھا کہ ان کے پاؤں باہر نظر آتے تھے۔ ان کی زندگی ہمیں سکھاتی ہے کہ اصل خزانہ ایمان ہے۔',
  },
  chapters: [
    {
      id: 'the-youth-of-luxury',
      title: { en: 'The Youth of Luxury', ur: 'عیش و آرام کا نوجوان' },
      paragraphs: [
        {
          en: "In the city of Makkah, there was no young man more handsome, more wealthy or better dressed than Mus'ab ibn Umayr. He came from a rich family, and he wore the finest clothes of the city. His mother loved him deeply and gave him everything he asked for.",
          ur: 'مکہ کے شہر میں مصعب بن عمیر سے زیادہ خوبصورت، مالدار اور خوب لباس پہننے والا کوئی نوجوان نہیں تھا۔ ان کا تعلق ایک امیر گھرانے سے تھا، اور وہ شہر کے بہترین کپڑے پہنتے تھے۔ ان کی ماں ان سے بہت محبت کرتی تھیں اور وہ جو مانگتے تھے وہی مل جاتا تھا۔',
        },
        {
          en: 'The people of Makkah loved to look at Mus\u2019ab. When he walked through the streets, people stopped and smiled. He wore the most expensive perfume, and his home was full of beautiful things. Everyone thought that Mus\u2019ab had the best life in all of Makkah.',
          ur: 'مکہ والوں کو مصعب کو دیکھنا بہت پسند تھا۔ جب وہ گلیوں سے گزرتے تو لوگ رک کر مسکراتے تھے۔ وہ سب سے مہنگے خوشبو استعمال کرتے تھے، اور ان کا گھر خوبصورت چیزوں سے بھرا ہوا تھا۔ سب سوچتے تھے کہ پورے مکہ میں مصعب کی زندگی سب سے اچھی ہے۔',
        },
        {
          en: 'But the heart of Mus\u2019ab was not satisfied. Even with all his wealth and beauty, he felt that something was missing. He was a smart and thoughtful young man, and he kept looking for something deeper than money and clothes.',
          ur: 'لیکن مصعب کا دل مطمئن نہیں تھا۔ اتنی دولت اور خوبصورتی کے باوجود وہ محسوس کرتے تھے کہ کچھ کمی ہے۔ وہ ہوشیار اور سوچنے والے نوجوان تھے، اور وہ پیسے اور کپڑوں سے بڑھ کر کچھ اور تلاش کرتے رہتے تھے۔',
        },
        {
          en: 'Makkah at that time was a city of idols, where people worshipped stones. But Mus\u2019ab heard that a man named Muhammad \uFDFA was teaching about one God, Allah. And something in his heart told him that this was the truth he was searching for.',
          ur: 'اس وقت مکہ بتوں کا شہر تھا، جہاں لوگ پتھروں کی پوجا کرتے تھے۔ لیکن مصعب نے سنا کہ محمد ﷺ نامی ایک شخص ایک خدا یعنی اللہ کے بارے میں سکھا رہے ہیں۔ اور ان کے دل میں کسی چیز نے کہا کہ یہی وہ سچ ہے جسے وہ تلاش کر رہے تھے۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah describes Mus\u2019ab as the best-dressed and most loved young man of Makkah',
            ur: 'سیرت میں مصعب کو مکہ کا سب سے خوب لباس والا اور پسندیدہ نوجوان بتایا گیا ہے',
          },
        },
        {
          type: 'hadith',
          reference: 'Ibn Kathir, Al-Bidayah',
          needsVerification: true,
          label: {
            en: 'Ibn Kathir describes the wealthy upbringing of Mus\u2019ab ibn Umayr',
            ur: 'ابن کثیر نے مصعب بن عمیر کی امیرانہ پرورش کا ذکر کیا ہے',
          },
        },
      ],
    },
    {
      id: 'he-found-the-truth',
      title: { en: 'He Found the Truth', ur: 'انہوں نے سچ پا لیا' },
      paragraphs: [
        {
          en: 'In the early days of Islam, the Prophet Muhammad \uFDFA used to teach in secret. A few believers would gather in a house in Makkah to listen to the words of Allah. When Mus\u2019ab heard these words, his heart trembled with wonder.',
          ur: 'اسلام کے ابتدائی دنوں میں نبی کریم ﷺ خاموشی سے تعلیم دیتے تھے۔ کچھ مومنین مکہ کے ایک گھر میں اکٹھے ہو کر اللہ کے کلام کو سنتے تھے۔ جب مصعب نے یہ کلام سنا تو ان کا دل حیرت سے کانپ اٹھا۔',
        },
        {
          en: 'Mus\u2019ab wanted to hear the Prophet \uFDFA himself. So he went to the Prophet \uFDFA and said, "O Messenger of Allah, teach me." The Prophet \uFDFA recited the Quran to him, and Mus\u2019ab\u2019s heart opened like a flower. He believed in Allah and accepted Islam.',
          ur: 'مصعب خود نبی کریم ﷺ کو سننا چاہتے تھے۔ چنانچہ وہ نبی کریم ﷺ کے پاس آئے اور عرض کیا: اے اللہ کے رسول، مجھے تعلیم دیں۔ نبی کریم ﷺ نے انہیں قرآن سنایا، اور مصعب کا دل پھول کی طرح کھل گیا۔ انہوں نے اللہ پر ایمان لا کر اسلام قبول کر لیا۔',
        },
        {
          en: 'Mus\u2019ab was among the very first Muslims — one of the early believers who accepted Islam in the secret days of Makkah. He kept his faith hidden from his family, because he knew his mother would not accept it.',
          ur: 'مصعب پہلے مسلمانوں میں شامل تھے — ان اولین مومنین میں سے جنہوں نے مکہ کے خفیہ دنوں میں اسلام قبول کیا۔ انہوں نے اپنا ایمان اپنے گھر والوں سے چھپائے رکھا، کیونکہ وہ جانتے تھے کہ ان کی ماں اسے قبول نہیں کریں گی۔',
        },
        {
          en: 'But faith is like a light — it cannot stay hidden for long. The people of Makkah slowly came to know that the rich young man Mus\u2019ab had left the religion of his fathers. And the news reached his mother, who loved him more than anything.',
          ur: 'لیکن ایمان روشنی کی طرح ہے — وہ زیادہ دیر چھپا نہیں رہ سکتا۔ مکہ والوں کو آہستہ آہستہ پتہ چل گیا کہ مالدار نوجوان مصعب نے اپنے باپ دادا کا دین چھوڑ دیا ہے۔ اور یہ خبر ان کی ماں تک پہنچی، جو ان سے سب سے زیادہ محبت کرتی تھیں۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how Mus\u2019ab accepted Islam in the early secret days of Makkah',
            ur: 'سیرت بتاتی ہے کہ مصعب نے مکہ کے ابتدائی خفیہ دنوں میں اسلام کیسے قبول کیا',
          },
        },
        {
          type: 'hadith',
          reference: 'Ibn Kathir, Al-Bidayah',
          needsVerification: true,
          label: {
            en: 'Ibn Kathir counts Mus\u2019ab among the first believers of Makkah',
            ur: 'ابن کثیر مصعب کو مکہ کے اولین مومنین میں شمار کرتے ہیں',
          },
        },
      ],
    },
    {
      id: 'the-cost-of-faith',
      title: { en: 'The Cost of Faith', ur: 'ایمان کی قیمت' },
      paragraphs: [
        {
          en: 'When Mus\u2019ab\u2019s mother learned that her son had become Muslim, she was very angry. She locked him up in his room and said, "You will stay here until you leave this new religion!" She cut him off from his wealth and his comfort.',
          ur: 'جب مصعب کی ماں کو پتہ چلا کہ ان کا بیٹا مسلمان ہو گیا ہے تو وہ بہت غصے میں آئیں۔ انہوں نے اسے اس کے کمرے میں بند کر دیا اور کہا: تم یہاں رہوگے جب تک تم یہ نیا دین نہیں چھوڑو گے! انہوں نے اسے دولت اور آرام سے محروم کر دیا۔',
        },
        {
          en: 'Day after day, Mus\u2019ab sat in that locked room. He had lost his rich food, his fine clothes and his freedom. But he had found something much greater: faith in Allah. And no price was too high for that treasure.',
          ur: 'دن بہ دن مصعب اسی بند کمرے میں بیٹھے رہے۔ ان کی عمدہ غذا، بہترین کپڑے اور آزادی سب ختم ہو گئے۔ لیکن انہوں نے اس سے بڑی چیز پا لی تھی: اللہ پر ایمان۔ اور اس خزانے کے لیے کوئی قیمت زیادہ نہیں تھی۔',
        },
        {
          en: 'At last, Mus\u2019ab escaped from the locked room and made his way to the Prophet \uFDFA in secret. He chose to leave his mother, his wealth and his luxurious home for the sake of Allah. From that day, he lived in hardship, eating simple food and wearing simple clothes.',
          ur: 'آخر کار مصعب بند کمرے سے نکل کر خفیہ طور پر نبی کریم ﷺ کے پاس پہنچے۔ انہوں نے اللہ کی رضا کے لیے اپنی ماں، اپنی دولت اور اپنا پرتعیش گھر چھوڑنے کا فیصلہ کیا۔ اس دن سے وہ سادہ زندگی گزارنے لگے، سادہ کھانا کھاتے اور سادہ کپڑے پہنتے تھے۔',
        },
        {
          en: 'When the Prophet \uFDFA saw Mus\u2019ab living in hardship after his rich life, he praised his patience. The beloved young man who had everything had given it all up — and his heart was full of peace. The Prophet \uFDFA loved him for his beautiful patience.',
          ur: 'جب نبی کریم ﷺ نے مصعب کو امیر زندگی کے بعد تنگی میں دیکھا تو آپ نے ان کے صبر کی تعریف کی۔ وہ پیارا نوجوان جس کے پاس سب کچھ تھا، سب کچھ چھوڑ چکا تھا — اور اس کا دل سکون سے بھرا ہوا تھا۔ نبی کریم ﷺ ان کے حسین صبر کی وجہ سے ان سے محبت کرتے تھے۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how Mus\u2019ab\u2019s mother locked him up and cut him off from his wealth',
            ur: 'سیرت بتاتی ہے کہ مصعب کی ماں نے انہیں کیسے بند کیا اور دولت سے محروم کیا',
          },
        },
        {
          type: 'hadith',
          reference: 'Ibn Kathir, Al-Bidayah',
          needsVerification: true,
          label: {
            en: 'Ibn Kathir describes the Prophet \uFDFA praising the patience of Mus\u2019ab',
            ur: 'ابن کثیر نے نبی کریم ﷺ کے مصعب کے صبر کی تعریف کا ذکر کیا ہے',
          },
        },
      ],
    },
    {
      id: 'the-first-teacher',
      title: { en: 'The First Teacher', ur: 'پہلا معلم' },
      paragraphs: [
        {
          en: 'One year, some people came to Makkah from the city of Yathrib, which we now call Madinah. They heard the message of Islam and believed. This was the first pledge of Aqabah. Then they went back home and asked the Prophet \uFDFA to send them a teacher.',
          ur: 'ایک سال کچھ لوگ مکہ میں یثرب شہر سے آئے، جسے آج ہم مدینہ کہتے ہیں۔ انہوں نے اسلام کا پیغام سنا اور ایمان لے آئے۔ یہ بیعت عقبہ اولی تھی۔ پھر وہ گھر واپس گئے اور نبی کریم ﷺ سے ایک معلم بھیجنے کی درخواست کی۔',
        },
        {
          en: 'The Prophet \uFDFA chose Mus\u2019ab for this great duty. He sent him to Madinah as the very first teacher and ambassador of Islam. Mus\u2019ab left his old life of Makkah behind and carried the light of the Quran to a new city.',
          ur: 'نبی کریم ﷺ نے اس عظیم ذمہ داری کے لیے مصعب کو چنا۔ آپ نے انہیں مدینہ میں اسلام کے پہلے معلم اور سفیر بنا کر بھیجا۔ مصعب نے مکہ کی پرانی زندگی کو پیچھے چھوڑ دیا اور قرآن کی روشنی نئے شہر تک پہنچا دی۔',
        },
        {
          en: 'In Madinah, Mus\u2019ab taught the people with patience and gentleness. He did not argue or shout. He read the Quran with a sweet voice and answered every question with kindness. The hearts of the people of Madinah began to open to Islam.',
          ur: 'مدینہ میں مصعب نے لوگوں کو صبر اور نرمی سے تعلیم دی۔ انہوں نے نہ جھگڑا اور نہ شور مچایا۔ وہ میٹھی آواز سے قرآن پڑھتے اور ہر سوال کا جواب محبت سے دیتے۔ مدینہ کے لوگوں کے دل اسلام کے لیے کھلنے لگے۔',
        },
        {
          en: 'Even the two great chiefs of Madinah, Sa\u2019d ibn Mu\u2019adh and Usayd ibn Hudayr, came to hear him. Mus\u2019ab spoke to them so gently and truthfully that both of them accepted Islam. Through the gentleness of one teacher, many hearts found the truth.',
          ur: 'مدینہ کے دو بڑے سردار سعد بن معاذ اور اسید بن حضیر بھی انہیں سننے آئے۔ مصعب نے ان سے اتنی نرمی اور سچائی سے بات کی کہ دونوں نے اسلام قبول کر لیا۔ ایک معلم کی نرمی سے بہت سے دلوں نے سچ پا لیا۔',
        },
        {
          en: 'Soon, the light of Islam spread across Madinah. Houses, gardens and gatherings all began to shine with the words of Allah. It was all because the Prophet \uFDFA had sent a gentle teacher who taught with love — and that teacher was Mus\u2019ab.',
          ur: 'جلد ہی اسلام کی روشنی مدینہ میں پھیل گئی۔ گھر، باغات اور محفلیں اللہ کے کلام سے روشن ہونے لگیں۔ یہ سب اس لیے ہوا کہ نبی کریم ﷺ نے ایک نرم معلم بھیجا تھا جو محبت سے سکھاتا تھا — اور وہ معلم مصعب تھے۔',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells how the Prophet \uFDFA sent Mus\u2019ab to Madinah as the first teacher after the pledge of Aqabah',
            ur: 'سیرت بتاتی ہے کہ بیعت عقبہ کے بعد نبی کریم ﷺ نے مصعب کو پہلے معلم بنا کر مدینہ کیسے بھیجا',
          },
        },
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah records how Sa\u2019d ibn Mu\u2019adh and Usayd ibn Hudayr accepted Islam through Mus\u2019ab',
            ur: 'سیرت میں درج ہے کہ سعد بن معاذ اور اسید بن حضیر نے مصعب کے ذریعے اسلام کیسے قبول کیا',
          },
        },
      ],
    },
    {
      id: 'the-flag-and-farewell',
      title: { en: 'The Flag and the Farewell', ur: 'جھنڈا اور رخصت' },
      paragraphs: [
        {
          en: 'When the Muslims fought the Battle of Badr, Mus\u2019ab was there, carrying the flag of Islam with honour. He had given up his rich life for Allah, and now he was giving his strength in the way of Allah. His faith grew with every passing day.',
          ur: 'جب مسلمانوں نے جنگ بدر لڑی تو مصعب وہاں موجود تھے، عزت کے ساتھ اسلام کا جھنڈا اٹھائے ہوئے۔ انہوں نے اپنی امیر زندگی اللہ کے لیے چھوڑ دی تھی، اور اب وہ اللہ کی راہ میں اپنی طاقت دے رہے تھے۔ ان کا ایمان ہر گزرتے دن کے ساتھ بڑھتا رہا۔',
        },
        {
          en: 'Then came the Battle of Uhud. Mus\u2019ab stood in the field holding the flag of the Prophet \uFDFA. He fought bravely, and the enemies attacked again and again. But Mus\u2019ab did not run away — he held the flag high until the end.',
          ur: 'پھر جنگ احد آئی۔ مصعب میدان میں نبی کریم ﷺ کا جھنڈا اٹھائے کھڑے تھے۔ انہوں نے بہادری سے لڑے، اور دشمن بار بار حملہ کرتا رہا۔ لیکن مصعب بھاگے نہیں — انہوں نے جھنڈا بلند رکھا، آخری دم تک۔',
        },
        {
          en: 'In that battle, Mus\u2019ab was martyred. He fell to the ground still holding the flag of the Prophet \uFDFA. The young man who once wore the finest clothes of Makkah now wore the most precious dress of all — the dress of a martyr.',
          ur: 'اسی جنگ میں مصعب شہید ہو گئے۔ وہ نبی کریم ﷺ کا جھنڈا تھامے ہوئے زمین پر گر گئے۔ وہ نوجوان جو کبھی مکہ کے بہترین کپڑے پہنتا تھا، اب سب سے قیمتی لباس پہن رہا تھا — شہادت کا لباس۔',
        },
        {
          en: 'When the companions looked for a cloth to shroud Mus\u2019ab, they could find only one piece of cloth, and it was so thin that when his head was covered, his feet showed. This showed how Mus\u2019ab had given up the world for Allah — he left it with nothing but faith.',
          ur: 'جب صحابہ نے مصعب کے کفن کے لیے کپڑا ڈھونڈا تو انہیں صرف ایک پتلا کپڑا ملا، اور وہ اتنا پتلا تھا کہ جب ان کا سر چھپایا جاتا تو پاؤں نظر آتے تھے۔ یہ اس بات کی نشانی تھی کہ مصعب نے دنیا اللہ کے لیے چھوڑ دی تھی — وہ صرف ایمان کے ساتھ اس دنیا سے گئے۔',
        },
        {
          en: 'Mus\u2019ab taught us the most beautiful lesson: the real treasure is not gold, clothes or comfort — the real treasure is faith in Allah. He left a palace and earned Paradise. Dear child, treasure your faith, for it is worth more than everything in this world.',
          ur: 'مصعب نے ہمیں سب سے خوبصورت سبق سکھایا: اصل خزانہ سونا، کپڑے یا آرام نہیں — اصل خزانہ اللہ پر ایمان ہے۔ انہوں نے محل چھوڑا اور جنت کمائی۔ پیارے بچے، اپنے ایمان کو خزانہ سمجھیں، کیونکہ یہ اس دنیا کی ہر چیز سے زیادہ قیمتی ہے۔',
        },
      ],
      sources: [
        {
          type: 'quran',
          reference: "Qur'an 3:169",
          label: {
            en: 'Allah says that those killed in His way are not dead but alive with their Lord',
            ur: 'اللہ فرماتا ہے کہ اس کی راہ میں شہید ہونے والے مردہ نہیں — وہ اپنے رب کے پاس زندہ ہیں',
          },
          explanation: {
            en: 'Mus\u2019ab (RA) was martyred at Uhud, in the way of Allah. This verse tells us that martyrs like him are not lost — they are alive with Allah and are given wonderful rewards. Their life has changed, but it has not ended.',
            ur: 'مصعب رضی اللہ عنہ احد میں اللہ کی راہ میں شہید ہوئے۔ یہ آیت ہمیں بتاتی ہے کہ ان جیسے شہداء کھو نہیں جاتے — وہ اللہ کے پاس زندہ ہیں اور انہیں بہترین انعامات ملتے ہیں۔ ان کی زندگی بدل گئی ہے، لیکن ختم نہیں ہوئی۔',
          },
        },
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham)',
          needsVerification: true,
          label: {
            en: 'The Seerah tells of Mus\u2019ab\u2019s martyrdom at Uhud holding the flag',
            ur: 'سیرت میں مصعب کی احد میں جھنڈا اٹھائے شہادت کا ذکر ہے',
          },
        },
        {
          type: 'hadith',
          reference: 'Ibn Kathir, Al-Bidayah',
          needsVerification: true,
          label: {
            en: 'Ibn Kathir describes the thin shroud of Mus\u2019ab, showing his sacrifice of worldly life',
            ur: 'ابن کثیر نے مصعب کے پتلے کفن کا ذکر کیا، جو دنیا چھوڑنے کی نشانی ہے',
          },
        },
      ],
    },
  ],
};