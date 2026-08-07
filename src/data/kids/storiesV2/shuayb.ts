import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Shu'ayb (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger sent to the people of Midian, a nation of traders who cheated
 * in their shops — short measures, false weights and unfair deals. Shu'ayb
 * called them to give full measure and weigh with justice. When they mocked
 * him and threatened to stone him, the promised punishment came and only the
 * believers were saved. Anchored to the true Shu'ayb verses: Al-A'raf
 * (7:85–93), Hud (11:84–95), Ash-Shu'ara (26:177–189) and Al-Hijr (15:78).
 * Fully bilingual (English + Urdu).
 */
export const STORY_SHUAYB: KidsStoryV2 = {
  id: "shuayb",
  type: "prophet",
  nameArabic: "شعیب",
  nameEnglish: "Shuayb (Jethro)",
  illustrationSymbol: "Scale",
  accentColor: "#3e9e83",
  summary: {
    en: "The people of Midian were traders who cheated in their trade — short measures, false weights and unfair deals. Allah sent their brother Shu'ayb to tell them: give full measure and weigh with justice. They mocked him and even threatened to stone him. Then a great blast seized the wrongdoers, and only the believers were saved — honesty in trade, honesty in life, and giving others their full rights.",
    ur: "قومِ مدین تاجر تھے جو دھوکہ دیتے تھے۔ اللہ نے ان کا بھائی شعیب بھیجا جو کہتے تھے: پورا ناپو اور انصاف سے تولو۔ انہوں نے ان کا مذاق اڑایا۔ پھر زلزلے نے ظالموں کو پکڑ لیا، اور صرف ایمان والے بچ گئے۔ لین دین میں ایمانداری اور سب کا پورا حق دینا عبادت ہے۔",
  },
  chapters: [
    {
      id: "the-people-of-midian",
      title: { en: "The People of Midian", ur: "قومِ مدین" },
      paragraphs: [
        {
          en: "Between the mountains and the sea lived the people of Midian, a land of traders. Their city was famous for its markets, and people came from far away to buy and sell. Allah sent them their brother Shu'ayb to guide them back to the right path.",
          ur: "پہاڑوں اور سمندر کے درمیان تاجروں کی قوم مدین رہتی تھی۔ ان کا شہر اپنے بازاروں کے لیے مشہور تھا۔ اللہ نے ان کی رہنمائی کے لیے ان کا بھائی شعیب بھیجا۔",
        },
        {
          en: "Shu'ayb said: \"O my people, worship Allah — you have no god other than Him. There has come to you clear proof from your Lord\" (Qur'an 7:85). Then he told them what Allah loves most: \"Give full measure and full weight, and do not deprive people of their due\" (Qur'an 7:85).",
          ur: "شعیب نے کہا: \"اے میری قوم! اللہ کی عبادت کرو — اس کے سوا تمہارا کوئی معبود نہیں\" (قرآن 7:85)۔ پھر کہا: \"پورا ناپو اور پورا تولو اور لوگوں کا حق کم نہ دو\" (قرآن 7:85)۔",
        },
        {
          en: "The people of Midian were rich, but their wealth was not clean. When customers came to their shops, they used small cups and light weights, and took too much money. The poor people lost their money and could not complain.",
          ur: "قومِ مدین امیر تھی لیکن ان کی دولت پاک نہ تھی۔ وہ چھوٹے پیمانے اور ہلکے وزین استعمال کرتے تھے۔ غریب لوگ نقصان اٹھاتے تھے۔",
        },
        {
          en: "Shu'ayb said clearly: \"Do not cheat people in their goods, and do not spread corruption in the land after its reformation\" (Qur'an 7:85). Honest trade brings blessings, while cheating empties both the hand and the heart.",
          ur: "شعیب نے صاف کہا: \"لوگوں کو ان کی چیزوں میں نقصان نہ دو اور زمین میں فساد نہ پھیلاؤ\" (قرآن 7:85)۔ ایماندار تجارت پر برکت آتی ہے۔",
        },
        {
          en: "But the rich traders loved their unfair profit. They said: \"If we become honest, we will become poor.\" They did not know that Allah is the Giver, and that dishonesty steals peace from the heart.",
          ur: "لیکن امیر تاجر اپنے ناجائز منافع کے پیارے تھے۔ وہ کہتے تھے کہ ایمانداری سے ہم غریب ہو جائیں گے۔ وہ نہیں جانتے تھے کہ رزق اللہ دیتا ہے۔",
        },
      ],
      ayahNote: {
        en: "Shu'ayb's first lesson was honesty: full measure, full weight, full rights for every person. Allah had set the scale of justice, and cheating on it was cheating against Allah Himself.",
        ur: "شعیب کا پہلا سبق ایمانداری تھا: پورا ناپ، پورا تول، ہر شخص کا پورا حق۔ اللہ نے انصاف کا پیمانہ باندھا تھا، اور اس میں دھوکا اللہ سے ہی دھوکا تھا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:85",
          label: { en: "Shu'ayb calls Midian to worship Allah and to give full measure and weight", ur: "شعیب نے مدین کو اللہ کی عبادت اور پورا ناپ تول سکھایا" },
          explanation: {
            en: "Shu'ayb joined two things in one call: worship Allah alone, and deal with people honestly. A heart that prays should not cheat in the market.",
            ur: "شعیب نے ایک ہی دعوت میں دو باتیں جوڑ دیں: صرف اللہ کی عبادت، اور لوگوں سے سچا لین دین۔ جس دل میں نماز ہے، اس کے ہاتھ دھوکا نہیں دیتے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:85",
          label: { en: "Do not cheat people in their goods or bring corruption to the land", ur: "لوگوں کو نقصان نہ دو اور زمین میں فساد مت ہو" },
          explanation: {
            en: "Short cups and light weights were not small tricks — they were corruption on the earth. Honest measure is a duty, and unfair measure is a wound on the whole land.",
            ur: "چھوٹے پیمانے اور ہلکے وزن معمولی چال نہ تھے — یہ زمین میں فساد تھا۔ سچا ناپ فرض ہے، اور ناانصافی پورے علاقے کے لیے زخم ہے۔",
          },
        },
      ],
    },
    {
      id: "the-call-and-deniers",
      title: { en: "Shu'ayb's Call and the Deniers", ur: "شعیب کی دعوت اور انکار" },
      paragraphs: [
        {
          en: "Shu'ayb did not give up. Every day he went to the market and reminded the traders: \"O my people, worship Allah — you have no god but Him — and do not reduce the measure and the weight\" (Qur'an 11:84).",
          ur: "شعیب نہیں رکے۔ روز بازار جا کر کہتے تھے: \"اے میری قوم! اللہ کی عبادت کرو اور ناپ تول میں کمی نہ کرو\" (قرآن 11:84)۔",
        },
        {
          en: "He said clearly: \"Give full measure and weight in justice, do not deprive people of their things, and do not spread corruption in the earth\" (Qur'an 11:85).",
          ur: "انہوں نے صاف کہا: \"پورا ناپو اور انصاف سے تولو، لوگوں کا حق نہ روکو اور زمین میں فساد نہ پھیلاؤ\" (قرآن 11:85)۔",
        },
        {
          en: "The rich leaders answered with mockery: \"O Shu'ayb, does your prayer command you that we should leave what our fathers worshipped?\" (Qur'an 11:87). They laughed at the prayer of a prophet.",
          ur: "امیر سرداروں نے طنز سے کہا: \"اے شعیب! کیا تمہاری نماز ہمیں بتاتی ہے کہ ہم باپ دادا کے معبودوں کو چھوڑ دیں؟\" (قرآن 11:87)۔ وہ نبی کی نماز پر ہنسے۔",
        },
        {
          en: "Some said: \"You are only one of those bewitched\" (Qur'an 26:185), and others even dared: \"So bring down on us a piece of the sky, if you are among the truthful\" (Qur'an 26:187).",
          ur: "کچھ نے کہا: \"تو تو جادو زدہ لوگوں میں سے ہے\" (قرآن 26:185)۔ بعض نے کہا: \"اگر تو سچا ہے تو ہم پر آسمان کا ٹکڑا گرا دے\" (قرآن 26:187)۔",
        },
        {
          en: "Yet a few humble hearts believed Shu'ayb. They left the false scales, began to give full measure, and their hearts found a peace that money never gives.",
          ur: "لیکن چند عاجز لوگ ایمان لے آئے۔ انہوں نے جھوٹا وزن چھوڑا اور دل کو سکون ملا۔",
        },
      ],
      ayahNote: {
        en: "Shu'ayb did not stop when the leaders mocked him — he kept calling: worship Allah, give full measure. Mockery from the strong does not change the truth.",
        ur: "سرداروں کے طنز پر شعیب رکے نہیں — وہ دیتے رہے: اللہ کی عبادت کرو، پورا ناپو۔ طاقتوروں کا مذاق سچ کو بدل نہیں سکتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:84",
          label: { en: "Shu'ayb calls Midian to worship Allah and not to reduce the measure and weight", ur: "شعیب نے مدین کو اللہ کی عبادت اور ناپ تول میں کمی نہ کرنے کی دعوت دی" },
          explanation: {
            en: "Every day in the market the same call: worship Allah, and do not reduce the measure. Faith was not only in the mosque for them — it had to live in every scale.",
            ur: "ہر روز بازار میں وہی پکار: اللہ کی عبادت، اور ناپ میں کمی نہیں۔ ان کے لیے ایمان صرف مسجد میں نہ تھا — ہر ترازو میں رہنا تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:85",
          label: { en: "Give full measure and weight in justice and do not deprive people of their due", ur: "پورا ناپو اور انصاف سے تولو اور لوگوں کا حق مت روکو" },
          explanation: {
            en: "Give full measure in justice, do not deprive people of their things, do not spread corruption. Three short rules that keep a whole society fair.",
            ur: "انصاف سے پورا ناپو، لوگوں کا حق نہ روکو، زمین میں فساد نہ پھیلاؤ۔ تین چھوٹے اصول جو پورے معاشرے کو انصاف پر رکھتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 26:185–187",
          label: { en: "They call Shu'ayb bewitched and dare him to bring a piece of the sky", ur: "انہوں نے شعیب کو جادو زدہ کہا اور آسمان کا ٹکڑا گرانے کو کہا" },
          explanation: {
            en: "They called him bewitched and dared him to drop a piece of the sky. Mocking a messenger of Allah does not hurt the message — it hurts those who mock.",
            ur: "انہوں نے اسے جادو زدہ کہا اور للکارا کہ آسمان کا ٹکڑا گرا دے۔ اللہ کے رسول کا مذاق پیغام کو نقصان نہیں پہنچاتا — نقصان مذاق کرنے والوں کو پہنچتا ہے۔",
          },
        },
      ],
    },
    {
      id: "the-threat-and-response",
      title: { en: "The Threat and the Response", ur: "دھمکی اور جواب" },
      paragraphs: [
        {
          en: "The proud leaders became angry and said: \"O Shu'ayb, we do not understand much of what you say, and we see that you are weak among us — if it were not for your family, we would have stoned you\" (Qur'an 11:91).",
          ur: "مغرور سردار غصے سے بولے: \"اے شعیب! ہم تمہاری بات نہیں سمجھتے اور تمہیں کمزور دیکھتے ہیں — اگر تمہارا خاندان نہ ہوتا تو ہم تمہیں سنگسار کر دیتے\" (قرآن 11:91)۔",
        },
        {
          en: "They said more: \"We will surely expel you, O Shu'ayb, and those who believed with you, from our town, or you will return to our religion\" (Qur'an 7:88). They threatened to drive the believers from their homes.",
          ur: "انہوں نے کہا: \"اے شعیب! ہم تمہیں اور ایمان والوں کو شہر سے نکال دیں گے یا تم ہمارے دین میں لوٹ آؤ گے\" (قرآن 7:88)۔",
        },
        {
          en: "Shu'ayb answered bravely: \"We would then be inventing lies against Allah if we returned to your religion after He saved us from it\" (Qur'an 7:89).",
          ur: "شعیب نے دلیری سے جواب دیا: \"اگر اللہ بچانے کے بعد ہم تمہارے دین میں لوٹیں تو اللہ پر جھوٹ بولیں گے\" (قرآن 7:89)۔",
        },
        {
          en: "Then he placed his trust where it belongs: \"My success is only through Allah — upon Him I rely, and to Him I turn\" (Qur'an 11:88).",
          ur: "پھر انہوں نے فرمایا: \"کامیابی صرف اللہ سے ہے — اسی پر بھروسہ ہے اور اسی کی طرف لوٹنا ہے\" (قرآن 11:88)۔",
        },
        {
          en: "The believers stood beside him, calm and firm. They had left the cheating scales behind, and no threat could shake them.",
          ur: "ایمان والے ان کے ساتھ مضبوطی سے کھڑے رہے۔ انہوں نے دھوکہ چھوڑ دیا تھا۔",
        },
      ],
      ayahNote: {
        en: "They threatened to stone him and drive him out. Shu'ayb answered with the strongest weapon: reliance on Allah. 'My success is only through Allah — upon Him I rely.'",
        ur: "انہوں نے سنگسار اور شہر سے نکالنے کی دھمکی دی۔ شعیب نے سب سے مضبوط ہتھیار سے جواب دیا: اللہ پر بھروسہ۔ میری کامیابی صرف اللہ سے ہے — اسی پر بھروسہ اور اسی کی طرف لوٹنا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:91",
          label: { en: "The leaders say they would stone Shu'ayb if not for his family", ur: "سردار کہتے ہیں کہ خاندان نہ ہوتا تو شعیب کو سنگسار کر دیتے" },
          explanation: {
            en: "They said: we would have stoned you, if not for your family. The threat showed their cruelty, not their power — the truthful one does not fear stones.",
            ur: "انہوں نے کہا: تمہارا خاندان نہ ہوتا تو ہم تمہیں سنگسار کر دیتے۔ یہ دھمکی ان کی ظلمت بتاتی تھی، طاقت نہیں — سچا آدمی پتھروں سے نہیں ڈرتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:88",
          label: { en: "They threaten to expel Shu'ayb and the believers from the town", ur: "وہ شعیب اور ایمان والوں کو شہر سے نکالنے کی دھمکی دیتے ہیں" },
          explanation: {
            en: "They planned to expel Shu'ayb and the believers from the town. Expelling the honest does not clean the town — it leaves the cheaters alone with their scales.",
            ur: "انہوں نے شعیب اور ایمان والوں کو شہر سے نکالنے کی سازش کی۔ ایمانداروں کو نکالنا شہر کو صاف نہیں کرتا — دھوکہ دینے والے اکیلے اپنے ترازوؤں کے ساتھ رہ جاتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:88",
          label: { en: "Shu'ayb says his success is only through Allah, on Whom he relies", ur: "شعیب کہتے ہیں کامیابی صرف اللہ سے ہے جس پر بھروسہ ہے" },
          explanation: {
            en: "Shu'ayb placed his trust where it belongs: success is only through Allah. When the whole town threatens you, the One who hears is stronger than the whole town.",
            ur: "شعیب نے بھروسہ وہاں رکھا جہاں رکھنا چاہیے: کامیابی صرف اللہ سے ہے۔ جب پورا شہر دھمکائے تو سننے والا رب پورے شہر سے زیادہ طاقتور ہے۔",
          },
        },
      ],
    },
    {
      id: "the-punishment",
      title: { en: "The Punishment", ur: "عذاب" },
      paragraphs: [
        {
          en: "Allah is patient, but the punishment does not wait for those who keep doing wrong. The Qur'an says: \"So the earthquake seized them, and they became fallen dead in their homes\" (Qur'an 7:91).",
          ur: "اللہ صبر کرتا ہے لیکن ظلم کرنے والوں کو عذاب ضرور آتا ہے۔ قرآن کہتا ہے: \"پھر زلزلے نے انہیں پکڑ لیا اور وہ اپنے گھروں میں مرے پڑے رہے\" (قرآن 7:91)۔",
        },
        {
          en: "Their shops, their gold and their false weights could not help them. \"When Our command came, We saved Shu'ayb and the believers by a mercy from Us — and the blast seized the wrongdoers\" (Qur'an 11:94).",
          ur: "ان کی دکانیں اور سونا کچھ کام نہ آئے۔ \"ہمارا حکم آیا تو ہم نے شعیب اور ایمان والوں کو بچا لیا — اور زوردار آواز نے ظالموں کو پکڑ لیا\" (قرآن 11:94)۔",
        },
        {
          en: "And the people of al-Aykah, the dwellers among the trees, were also wrongdoers (Qur'an 15:78). Their end became a lesson for traders of every time.",
          ur: "درختوں میں رہنے والی ایکہ کی قوم بھی ظالم تھی (قرآن 15:78)۔ ان کا انجام ہر تاجر کے لیے سبق بن گیا۔",
        },
        {
          en: "The believers walked out of the ruined town unharmed. The mercy of Allah lifted them away, and the false scales lay buried under the dust.",
          ur: "ایمان والے ویران شہر سے سلامت نکل گئے اور دھوکہ دینے والے خاک تلے دب گئے۔",
        },
        {
          en: "In the empty market the scales hung still. The cheaters were gone, and only the honest remained to tell the story — for honesty is a scale that never lies.",
          ur: "خالی بازار میں ترازو پڑی رہی۔ دھوکہ دینے والے ختم ہو گئے اور ایماندار باقی رہے۔",
        },
      ],
      ayahNote: {
        en: "The blast came, and only the honest walked out alive. Shops, gold and false weights were buried under the dust — the scale of Allah was still standing.",
        ur: "آواز آئی، اور صرف ایماندار زندہ نکلے۔ دکانیں، سونا اور جھوٹے وزن خاک تلے دب گئے — اللہ کا پیمانہ قائم رہا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:91",
          label: { en: "The earthquake seized the cheaters and they died in their homes", ur: "زلزلے نے دھوکہ دینے والوں کو پکڑا اور وہ گھروں میں مر گئے" },
          explanation: {
            en: "The earthquake seized the cheaters in their homes. All the coins they had saved could not buy back one breath.",
            ur: "زلزلے نے دھوکہ دینے والوں کو انہی کے گھروں میں پکڑ لیا۔ ان کے جمع کیے سکے ایک سانس بھی واپس نہ خرید سکے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:94",
          label: { en: "Allah saved Shu'ayb and the believers; the blast seized the wrongdoers", ur: "اللہ نے شعیب اور ایمان والوں کو بچایا اور زوردار آواز نے ظالموں کو پکڑا" },
          explanation: {
            en: "Allah saved Shu'ayb and the believers by mercy, and the blast seized the wrongdoers. Justice and mercy walked out of the ruined town together.",
            ur: "اللہ نے رحمت سے شعیب اور ایمان والوں کو بچایا، اور آواز نے ظالموں کو پکڑ لیا۔ انصاف اور رحمت دونوں ساتھ ویران شہر سے نکلے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 15:78",
          label: { en: "The people of al-Aykah were also wrongdoers", ur: "ایکہ والے بھی ظالم تھے" },
          explanation: {
            en: "The people of al-Aykah, the dwellers among the trees, were also wrongdoers. No green shade and no tall trees could hide their injustice from Allah.",
            ur: "درختوں میں رہنے والے ایکہ کے لوگ بھی ظالم تھے۔ نہ ہری چھاؤں، نہ لمبے درخت ان کے ظلم کو اللہ سے چھپا سکے۔",
          },
        },
      ],
    },
    {
      id: "the-lesson-of-honesty",
      title: { en: "The Lesson of Honesty", ur: "ایمانداری کا سبق" },
      paragraphs: [
        {
          en: "The story of Shu'ayb teaches every child the beauty of honesty. The Qur'an says: \"Give full measure, and do not be among those who reduce it, and weigh with the straight scale\" (Qur'an 26:181–182).",
          ur: "شعیب کی کہانی ایمانداری کی خوبصورتی سکھاتی ہے۔ قرآن کہتا ہے: \"پورا ناپو اور سیدھی ترازو سے تولو\" (قرآن 26:181–182)۔",
        },
        {
          en: "Honesty is not only for the market. It lives in the classroom, in games, in promises, and in our speech. An honest heart speaks softly and returns what belongs to others.",
          ur: "ایمانداری صرف بازار کے لیے نہیں۔ یہ کلاس، کھیل اور وعدوں میں بھی ہے۔",
        },
        {
          en: "Allah loves the honest. When you give people their full rights, you become dear to Him. A cheater may collect a few coins, but he loses the peace of his heart.",
          ur: "اللہ ایمانداروں سے محبت کرتا ہے۔ دھوکہ دینے والا دو سکے کما لیتا ہے مگر دل کا سکون کھو دیتا ہے۔",
        },
        {
          en: "And if a believer ever slips — because everyone makes a mistake — he should hurry back to Allah, ask forgiveness, and start again with clean hands.",
          ur: "اگر کوئی مومن سے چوک ہو جائے تو اسے فورا اللہ کی طرف لوٹ آنا چاہیے اور معافی مانگ لینی چاہیے۔",
        },
        {
          en: "So always remember Shu'ayb and Midian: be honest in trade, honest in life, and give everyone their full rights. That is how we worship the One who measures every heart.",
          ur: "پس مدین کی کہانی یاد رکھو: تجارت میں ایماندار رہو اور سب کو پورا حق دو۔ یہی اللہ کی عبادت ہے۔",
        },
      ],
      ayahNote: {
        en: "Honesty is not only for the market — it lives in the classroom, in games, in promises, in words. The straight scale of Shu'ayb is a straight heart, and Allah loves the straight-hearted.",
        ur: "ایمانداری صرف بازار کے لیے نہیں — وہ کلاس میں، کھیل میں، وعدے میں اور بات میں رہتی ہے۔ شعیب کی سیدھی ترازو سیدھا دل ہے، اور اللہ سیدھے دلوں سے محبت کرتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 26:181–182",
          label: { en: "Give full measure and weigh with the straight scale", ur: "پورا ناپو اور سیدھی ترازو سے تولو" },
          explanation: {
            en: "Give full measure and weigh with the straight scale — two commands for every deal. When the scale is straight, the heart stands straight too.",
            ur: "پورا ناپو اور سیدھی ترازو سے تولو — ہر لین دین کے لیے دو حکم۔ جب ترازو سیدھی ہو تو دل بھی سیدھا رہتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:85",
          label: { en: "Give full measure and weight and do not deprive people of their full right", ur: "پورا ناپو اور تولو اور لوگوں کو پورا حق دو" },
          explanation: {
            en: "Full measure and full weight for people — because what they have is their right. Taking less from others makes our own hands empty, even if the pocket is full.",
            ur: "لوگوں کو پورا ناپ اور پورا وزن — کیونکہ ان کا حق ان کا ہے۔ دوسروں کا کم دینے والا جیب بھری ہو تو بھی اپنے ہاتھ خالی کرتا ہے۔",
          },
        },
      ],
    },
  ],
};