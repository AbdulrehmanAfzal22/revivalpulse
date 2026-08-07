import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Salih (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger sent to the people of Thamud, a mighty tribe that carved
 * homes into the mountains and trusted in its own strength. Allah gave them
 * the she-camel as an unmistakable sign, but they killed her and defied
 * their Lord, so the promised punishment came. Salih and the believers were
 * saved by mercy. Anchored to the true Salih verses: Al-A'raf (7:73–79),
 * Hud (11:61–68), Ash-Shu'ara (26:141–158), Al-Qamar (54:29) and
 * Ash-Shams (91:12–15). Fully bilingual (English + Urdu).
 */
export const STORY_SALIH: KidsStoryV2 = {
  id: "salih",
  type: "prophet",
  nameArabic: "صالح",
  nameEnglish: "Salih (Saleh)",
  illustrationSymbol: "Mountain",
  accentColor: "#a97449",
  summary: {
    en: "The people of Thamud carved their homes into the mountains and bragged about their strength. Allah sent Salih to them and gave them the she-camel as a clear sign. But they killed the she-camel and defied their Lord, so the promised punishment came within three days. Salih and the believers were saved — for those who are grateful for the signs of Allah are safe, and no one can harm the one who trusts Him.",
    ur: "قومِ ثمود نے اپنے گھر پہاڑوں میں تراشے تھے اور اپنی طاقت پر فخر کیا تھا۔ اللہ تعالیٰ نے ان کی طرف صالح علیہ السلام کو بھیجا اور اپنی ناقة کو بطور نشانی عطا کیا۔ لیکن انہوں نے اس ناقة کو شہید کر دیا اور اپنے رب کے حکم کی خلاف ورزی کی تو وعدہ کیا ہوا عذاب تین دنوں میں آ گیا۔ صالح اور ایمان والے بچ گئے — کیونکہ جو اللہ کی نشانیوں کا شکر ادا کرے، وہ محفوظ رہتا ہے اور جو اللہ پر بھروسہ رکھے، اُسے کوئی نقصان نہیں پہنچا سکتا۔",
  },
  chapters: [
    {
      id: "the-people-of-thamud",
      title: { en: "The People of Thamud", ur: "قومِ ثمود" },
      paragraphs: [
        {
          en: "After the wind swept away the people of 'Ad, another strong tribe grew in the land — the people of Thamud. Allah gave them gardens, springs and green plains. To guide them, Allah sent their brother Salih, who said: \"O my people, worship Allah — there is no god for you other than Him\" (Qur'an 7:73).",
          ur: "آندھی عاد کی قوم کو لے گئی تو زمین پر ایک اور طاقتور قوم پھیلی — قومِ ثمود۔ اللہ نے انہیں باغ، چشمے اور سرسبز میدان دیے۔ رہنمائی کے لیے اللہ نے ان کا بھائی صالح بھیجا، جس نے کہا: \"اے میری قوم! اللہ کی عبادت کرو — اس کے سوا تمہارا کوئی معبود نہیں\" (قرآن 7:73)۔",
        },
        {
          en: "The Thamud were famous for carving the mountains. They cut tall homes into the great rocks so no wind could shake them. The Qur'an reminds us of this blessing: \"And remember when He made you successors after 'Ad and settled you in the earth — you take for yourselves castles on its plains and carve the mountains into homes\" (Qur'an 7:74).",
          ur: "قومِ ثمود پہاڑ تراشنے میں مشہور تھی۔ وہ بڑی چٹانوں میں اونچے گھر کاٹتے تھے تاکہ کوئی ہوا انہیں نہ ہلا سکے۔ قرآن ہمیں اس نعمت کی یاد دلاتا ہے: \"اور یاد کرو جب اس نے تمہیں عاد کے بعد جانشین بنایا اور زمین میں بسایا — تم میدانوں میں قلعے بناتے ہو اور پہاڑوں کو گھر تراشتے ہو\" (قرآن 7:74)۔",
        },
        {
          en: "The Thamud became rich and proud. They had cattle, water and strong buildings, and they said to themselves: \"We are the strongest people in the land.\" But strength belongs only to Allah — every gift they owned came from Him.",
          ur: "قومِ ثمود امیر اور مغرور ہو گئی۔ ان کے پاس مویشی، پانی اور مضبوط عمارتیں تھیں، اور وہ کہتے تھے: \"ہم اس زمین کی سب سے طاقتور قوم ہیں۔\" لیکن طاقت صرف اللہ کی ہے — ان کے پاس جو کچھ تھا سب اللہ کا دیا ہوا تھا۔",
        },
        {
          en: "Salih reminded them with a gentle heart: \"O my people, worship Allah — you have no god other than Him. He created you from the earth and settled you in it, so ask His forgiveness and turn back to Him. Indeed, my Lord is near and answers\" (Qur'an 11:61).",
          ur: "صالح نے نرم دل سے انہیں یاد دلایا: \"اے میری قوم! اللہ کی عبادت کرو — اس کے سوا تمہارا کوئی معبود نہیں۔ اس نے تمہیں زمین سے پیدا کیا اور زمین میں بسایا، پس اس سے مغفرت مانگو اور اس کی طرف لوٹ آؤ۔ بیشک میرا رب قریب ہے اور دعا سننے والا ہے\" (قرآن 11:61)۔",
        },
        {
          en: "But the proud leaders said: \"O Salih, you were a man of hope among us before this. Do you forbid us to worship what our fathers worshipped? Indeed we are in disquieting doubt about what you call us to\" (Qur'an 11:62). They held tight to their idols and refused to listen.",
          ur: "لیکن مغرور سرداروں نے کہا: \"اے صالح! اس سے پہلے تو ہم میں امید کا سبب تھا۔ کیا تو ہمیں ان کی عبادت سے روکتا ہے جنہیں ہمارے باپ دادا پوجتے تھے؟ ہمیں تیری دعوت پر شک ہے\" (قرآن 11:62)۔ وہ اپنے بتوں سے چمٹے رہے اور سننے سے انکار کر دیا۔",
        },
      ],
      ayahNote: {
        en: "Salih's first lesson is the lesson of every prophet: worship Allah alone. The Thamud had strength, water and carved homes — every gift comes from Allah, so every gift deserves thanks, not pride.",
        ur: "صالح کا پہلا سبق وہی ہے جو ہر نبی کا ہوتا ہے: صرف اللہ کی عبادت کرو۔ ثمود کے پاس طاقت، پانی اور تراشے ہوئے گھر تھے — ہر نعمت اللہ کی دی ہوئی ہے، اس لیے ہر نعمت پر شکر چاہیے، فخر نہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:73",
          label: { en: "Salih calls the Thamud to worship Allah alone — there is no god other than Him", ur: "صالح قومِ ثمود کو صرف اللہ کی عبادت کی دعوت دیتے ہیں — اس کے سوا کوئی معبود نہیں" },
          explanation: {
            en: "Salih opens with the one truth that matters: Allah alone is God, and He alone created everything. Idols made by hands are only stone — worship belongs to Allah alone.",
            ur: "صالح کی دعوت کا آغاز سب سے بڑی سچائی سے ہوتا ہے: اللہ ہی معبود ہے اور وہی ہر چیز کا خالق ہے۔ ہاتھوں کی بنی مورتیاں صرف پتھر ہیں — عبادت صرف اللہ کا حق ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:74",
          label: { en: "Allah made the Thamud succeed the 'Ad and gave them homes carved from the mountains", ur: "اللہ نے ثمود کو عاد کا جانشین بنایا اور پہاڑوں سے تراشے ہوئے گھر عطا کیے" },
          explanation: {
            en: "Allah reminds the Thamud that their carved homes and green land were His gifts. When a gift makes a heart proud, the gift itself becomes a test.",
            ur: "اللہ ثمود کو یاد دلاتا ہے کہ تراشے ہوئے گھر اور سبز زمین اس کی نعمتیں تھیں۔ جب نعمت دل کو مغرور بنا دے تو وہی نعمت امتحان بن جاتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:61",
          label: { en: "Salih tells the Thamud that Allah created them from the earth and will forgive them", ur: "صالح ثمود کو بتاتے ہیں کہ اللہ نے انہیں زمین سے پیدا کیا اور معاف کرنے والا ہے" },
          explanation: {
            en: "Allah created you from the earth and settled you on it, and He is near, always ready to answer. Whoever turns back to Him sincerely will be forgiven.",
            ur: "اللہ نے تمہیں زمین سے پیدا کیا اور زمین پر بسایا، اور وہ قریب ہے اور دعا سنتا ہے۔ جو سچے دل سے اس کی طرف لوٹ آئے، وہ معاف کر دیا جاتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:62",
          label: { en: "The leaders doubt Salih and refuse to leave the gods of their fathers", ur: "سردار صالح پر شک کرتے ہیں اور باپ دادا کے معبودوں کو چھوڑنے سے انکار کرتے ہیں" },
          explanation: {
            en: "The leaders refused because the idols came from their fathers. But a thing does not become true just because the elders did it — truth is from Allah.",
            ur: "سرداروں نے اس لیے انکار کیا کہ بت ان کے باپ دادا سے چلے آ رہے تھے۔ مگر کوئی بات صرف اس لیے سچی نہیں ہوتی کہ بزرگ کرتے رہے — سچ اللہ کی طرف سے ہے۔",
          },
        },
      ],
    },
    {
      id: "the-miraculous-she-camel",
      title: { en: "The Miraculous She-Camel", ur: "معجزاتی ناقة" },
      paragraphs: [
        {
          en: "Then Salih told them that Allah would show them a great sign. A wonderful she-camel appeared among them — tall and strong, unlike any camel the people had ever seen. Salih said: \"This she-camel of Allah is a sign for you, so let her eat in the land of Allah and do not touch her with harm\" (Qur'an 7:73).",
          ur: "پھر صالح نے کہا کہ اللہ انہیں ایک بڑی نشانی دکھائے گا۔ اچانک ایک عظیم ناقة ان کے درمیان نمودار ہوئی — لمبی اور طاقتور، جیسی ناقة انہوں نے کبھی نہیں دیکھی تھی۔ صالح نے کہا: \"یہ اللہ کی ناقة تمہارے لیے نشانی ہے، اسے اللہ کی زمین میں چرنے دو اور اسے تکلیف نہ پہنچاؤ\" (قرآن 7:73)۔",
        },
        {
          en: "The she-camel was sent as a gift and a test. Salih made a fair agreement with the people: the camel would drink from the spring on her day, and the people would take water on their day. The Qur'an says: \"She has a day to drink, and you have a day to drink, on a known schedule\" (Qur'an 26:155–156).",
          ur: "ناقة اللہ کی طرف سے تحفہ اور امتحان دونوں تھی۔ صالح نے لوگوں کے ساتھ انصاف کا معاہدہ کیا: ناقة اپنے دن چشمے سے پانی پیے گی، اور لوگ اپنے دن پانی لیں گے۔ قرآن کہتا ہے: \"اس کے لیے پانی کا ایک دن ہے اور تمہارے لیے پانی کا ایک دن ہے، ایک معلوم حساب سے\" (قرآن 26:155–156)۔",
        },
        {
          en: "And in return for her share of the water, the camel would give them milk — enough for every family in the village. She was a living blessing in the middle of their homes, asking for nothing except a little water.",
          ur: "اور پانی کے بدلے ناقة گاؤں والوں کو دودھ دیتی تھی — اتنا دودھ کہ ہر گھرانے کو کافی ہو جاتا۔ وہ ان کے گھروں کے درمیان ایک زندہ برکت تھی، اور صرف تھوڑا سا پانی مانگتی تھی۔",
        },
        {
          en: "Salih warned them again: \"O my people, this is the she-camel of Allah, a sign for you — so leave her to eat on the land of Allah and do not harm her, or a punishment near at hand will seize you\" (Qur'an 11:64).",
          ur: "صالح نے انہیں دوبارہ خبردار کیا: \"اے میری قوم! یہ اللہ کی ناقة ہے، تمہارے لیے نشانی — اسے اللہ کی زمین میں چرنے دو اور اسے نقصان نہ پہنچاؤ، ورنہ قریب کا عذاب تمہیں آ لے گا\" (قرآن 11:64)۔",
        },
        {
          en: "Some of the Thamud looked at the camel and understood — this was truly from Allah. But others, who had cruelty in their hearts, waited for the chance to destroy the sign.",
          ur: "کچھ لوگوں نے ناقة کو دیکھا اور سمجھ گئے کہ یہ واقعی اللہ کی طرف سے ہے۔ لیکن جن کے دلوں میں ظلم تھا وہ اس نشانی کو ختم کرنے کا موقع ڈھونڈ رہے تھے۔",
        },
      ],
      ayahNote: {
        en: "The she-camel was not a magic trick — she was a living sign of Allah who shared water and gave milk to every family. Treating her gently and sharing the spring fairly was the real test.",
        ur: "ناقة کوئی جادو نہیں تھی — وہ اللہ کی زندہ نشانی تھی جو پانی بانٹتی تھی اور ہر گھر کو دودھ دیتی تھی۔ اس کے ساتھ نرمی اور پانی کی منصفانہ تقسیم ہی اصل امتحان تھا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:73",
          label: { en: "The she-camel of Allah appears as a clear sign — leave her to eat and do not harm her", ur: "اللہ کی ناقة واضح نشانی کے طور پر آتی ہے — اسے چرنے دو اور نقصان نہ پہنچاؤ" },
          explanation: {
            en: "Allah Himself called her 'the she-camel of Allah.' She was not an animal to use — she was a sign to respect, a gift to guard.",
            ur: "اللہ نے خود اسے اللہ کی ناقة کہا۔ وہ استعمال کی چیز نہیں تھی — وہ احترام کرنے والی نشانی تھی، حفاظت کرنے والی امانت تھی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 26:155–156",
          label: { en: "The she-camel has a day to drink and the people have a day — a known schedule", ur: "ناقة کے لیے پانی کا ایک دن ہے اور لوگوں کے لیے ایک دن — معلوم حساب کے مطابق" },
          explanation: {
            en: "One day her water, one day yours — that was the rule of fairness. Even the blessed camel took only her share and taught everyone: Allah's signs never take what is not theirs.",
            ur: "ایک دن اس کا پانی، ایک دن تمہارا — یہ انصاف کا اصول تھا۔ برکت والی ناقة بھی اپنا حصہ ہی لیتی تھی اور سکھاتی تھی کہ اللہ کی نشانیاں کسی کا حق نہیں لیتیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:64",
          label: { en: "Salih warns that harming the she-camel brings a punishment near at hand", ur: "صالح خبردار کرتے ہیں کہ ناقة کو نقصان پہنچانے سے قریب کا عذاب آئے گا" },
          explanation: {
            en: "Salih warned them softly: leave her in the land of Allah and do not harm her. Harming a sign of Allah brings the punishment near — this is His own warning.",
            ur: "صالح نے نرمی سے خبردار کیا: اسے اللہ کی زمین میں چرنے دو اور تکلیف نہ پہنچاؤ۔ اللہ کی نشانی کو نقصان پہنچانے سے عذاب قریب آ جاتا ہے — یہ اللہ کی اپنی تنبیہ ہے۔",
          },
        },
      ],
    },
    {
      id: "they-kill-the-camel",
      title: { en: "They Kill the Camel", ur: "ناقة کا قتل" },
      paragraphs: [
        {
          en: "The wicked ones could not bear the sign. The Qur'an tells us: \"When the most wicked of them was sent forth\" (Qur'an 91:12). A cruel man from the tribe rose up to do the evil deed.",
          ur: "شریر لوگ اس نشانی کو برداشت نہ کر سکے۔ قرآن بتاتا ہے: \"جب ان کا سب سے بدبخت شخص اٹھ کھڑا ہوا\" (قرآن 91:12)۔ قوم کا ایک ظالم آدمی برے کام کے لیے اٹھا۔",
        },
        {
          en: "He went to the she-camel and struck her legs until she fell. The Qur'an says: \"But they called their companion, and he took [the sword] and hamstrung her\" (Qur'an 54:29). The blessed camel that had given them water and milk lay on the ground.",
          ur: "اس نے ناقة کے پاس جا کر اس کی ٹانگیں کاٹ دیں اور وہ زمین پر گر گئی۔ قرآن کہتا ہے: \"پھر انہوں نے اپنے ساتھی کو بلایا، تو اس نے [تلوار] پکڑ کر اسے کاٹ ڈالا\" (قرآن 54:29)۔ وہ ناقة جو انہیں پانی اور دودھ دیتی تھی زمین پر پڑی تھی۔",
        },
        {
          en: "Now the whole tribe, not just one man, became guilty. The Qur'an says: \"But they hamstrung the she-camel and insolently defied the command of their Lord, and said: O Salih, bring us what you promise us, if you are among the messengers\" (Qur'an 7:77).",
          ur: "اب ساری قوم گنہگار تھی، صرف ایک آدمی نہیں۔ قرآن کہتا ہے: \"پھر انہوں نے ناقة کو کاٹ ڈالا اور اپنے رب کے حکم سے سرکشی کی، اور کہا: اے صالح! جو عذاب تو ہمیں دھمکاتا ہے لا دکھا، اگر تو رسولوں میں سے ہے\" (قرآن 7:77)۔",
        },
        {
          en: "Allah recorded their crime: \"And they denied him and killed her — so their Lord destroyed them for their sin and leveled them to the ground\" (Qur'an 91:14).",
          ur: "اللہ نے ان کا جرم درج کیا: \"انہوں نے اسے جھٹلایا اور ناقة کو کاٹ ڈالا — پس ان کے رب نے ان کے گناہ کی وجہ سے انہیں ہلاک کر کے زمین پر پھیلا دیا\" (قرآن 91:14)۔",
        },
        {
          en: "Salih watched with a sad heart. He had warned them over and over, but they had thrown the mercy of Allah away. Now only a few short days were left for the Thamud.",
          ur: "صالح دکھی دل سے دیکھتے رہے۔ انہوں نے بار بار خبردار کیا تھا، لیکن قوم نے اللہ کی رحمت ٹھکرا دی۔ اب ثمود کے پاس صرف تین دن باقی تھے۔",
        },
      ],
      ayahNote: {
        en: "One wicked man killed the she-camel, but the whole tribe shared the sin — they watched, they approved, they even challenged Salih to bring the punishment. Silence against wrong is a partner in it.",
        ur: "ایک بدبخت شخص نے ناقة کو شہید کیا، مگر گناہ پوری قوم کے سر تھا — وہ دیکھتے رہے، راضی رہے، اور خود عذاب مانگ بیٹھے۔ برائی پر خاموشی بھی برائی میں شریک ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 91:12",
          label: { en: "The most wicked man of Thamud is sent forth to harm the camel", ur: "ثمود کا سب سے بدبخت آدمی ناقة کو نقصان پہنچانے کے لیے اٹھتا ہے" },
          explanation: {
            en: "The Qur'an names him 'the most wicked of them' — the one they sent forward. But he was sent by the many, so the many share the guilt.",
            ur: "قرآن نے اسے ان کا سب سے بدبخت کہا — جسے قوم نے آگے بھیجا۔ مگر اسے آگے بھیجنے والی پوری قوم تھی، اس لیے گناہ سب کا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 54:29",
          label: { en: "They call their companion and he hamstrings the she-camel", ur: "وہ اپنے ساتھی کو بلاتے ہیں اور وہ ناقة کی ٹانگیں کاٹ دیتا ہے" },
          explanation: {
            en: "They called their companion and he struck her down. One hand held the sword, but the whole tribe had held it in their hearts.",
            ur: "انہوں نے اپنے ساتھی کو بلایا اور اس نے ناقة کو کاٹ ڈالا۔ تلوار ایک ہاتھ میں تھی، مگر اسے قبول کرنے والی پوری قوم تھی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:77",
          label: { en: "They kill the camel, defy their Lord and dare Salih to bring the punishment", ur: "وہ ناقة کو شہید کرتے ہیں، اپنے رب کے حکم کی خلاف ورزی کرتے ہیں اور صالح کو للکارتے ہیں" },
          explanation: {
            en: "They did not stop at the crime — they dared Salih: bring the punishment. Defying the Lord openly is what turns a mistake into destruction.",
            ur: "انہوں نے جرم پر ہی بس نہ کیا — صالح کو للکارا کہ عذاب لا دکھا۔ رب کی صریح مخالفت ہی خطا کو ہلاکت میں بدل دیتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 91:14",
          label: { en: "They denied Salih and killed the camel — Allah destroyed them for their sin", ur: "انہوں نے صالح کو جھٹلایا اور ناقة کو مار ڈالا — اللہ نے ان کے گناہ پر انہیں ہلاک کیا" },
          explanation: {
            en: "They denied the prophet and killed the sign, so their Lord wiped them away. The one who destroys the signs of Allah destroys himself first.",
            ur: "انہوں نے نبی کو جھٹلایا اور نشانی کو شہید کیا، تو رب نے انہیں مٹا دیا۔ جو اللہ کی نشانیوں کو مٹاتا ہے، وہ سب سے پہلے اپنے آپ کو مٹاتا ہے۔",
          },
        },
      ],
    },
    {
      id: "the-warning",
      title: { en: "The Warning", ur: "عذاب کی تنبیہ" },
      paragraphs: [
        {
          en: "When the camel was killed, Salih said to the people: \"Enjoy yourselves in your homes for three days — that is a promise not to be denied\" (Qur'an 11:65). The punishment would not be late.",
          ur: "ناقة کے قتل کے بعد صالح نے قوم سے کہا: \"تین دن اپنے گھروں میں رہ کر لطف اٹھا لو — یہ وعدہ ہے جو جھٹلایا نہیں جا سکتا\" (قرآن 11:65)۔ عذاب دیر نہیں کرے گا۔",
        },
        {
          en: "So the Thamud lived their last three days. The sky turned red, their faces changed, and worry sat in their hearts. They laughed, but their laughter had no joy in it.",
          ur: "پس ثمود نے اپنے آخری تین دن گزارے۔ آسمان کا رنگ بدل گیا، ان کے چہرے بگڑ گئے، اور ان کے دلوں میں پریشانی آ گئی۔ وہ ہنستے تھے لیکن ان کی ہنسی میں خوشی نہیں تھی۔",
        },
        {
          en: "On the third day, the command of Allah came. The earth shook beneath their feet, and a terrible blast filled the air. The Qur'an says: \"So the earthquake seized them, and they lay dead in their homes, fallen to their knees\" (Qur'an 7:78).",
          ur: "تیسرے دن اللہ کا حکم آ گیا۔ زمین ان کے پاؤں تلے لرز اٹھی، اور ایک خوفناک آواز فضا میں گونجی۔ قرآن کہتا ہے: \"پھر زلزلے نے انہیں آ لیا، اور وہ اپنے گھروں میں گھٹنوں کے بل گرے پڑے رہ گئے\" (قرآن 7:78)۔",
        },
        {
          en: "Their strength, their mountains and their palaces could not save them. The Qur'an says: \"And in Thamud, when it was said to them: Enjoy yourselves for a while. But they rebelled against the command of their Lord, so the thunderbolt seized them while they were looking on\" (Qur'an 51:43–44).",
          ur: "ان کی طاقت، ان کے پہاڑ اور ان کے محل انہیں بچا نہ سکے۔ قرآن کہتا ہے: \"اور ثمود میں بھی نشانی ہے جب انہیں کہا گیا: تھوڑی دیر مزے کر لو۔ پھر انہوں نے اپنے رب کے حکم سے سرکشی کی، تو بجلی نے انہیں آ لیا جب وہ دیکھ رہے تھے\" (قرآن 51:43–44)۔",
        },
        {
          en: "In one moment, the proud tribe was gone. Their carved homes stood empty, and the green valley became silent.",
          ur: "ایک ہی لمحے میں مغرور قوم ختم ہو گئی۔ ان کے تراشے ہوئے گھر خالی کھڑے تھے، اور سرسبز وادی خاموش ہو گئی۔",
        },
      ],
      ayahNote: {
        en: "After the crime, Salih announced a fixed promise: three days, and then the punishment. Those days were a gift of time — time to turn back before the blast came.",
        ur: "جرم کے بعد صالح نے پکا وعدہ سنایا: تین دن، پھر عذاب۔ وہ تین دن وقت کی مہلت تھے — مہلت کہ عذاب آنے سے پہلے لوگ لوٹ آئیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:65",
          label: { en: "Salih gives the Thamud three days to enjoy their homes before the punishment", ur: "صالح ثمود کو عذاب سے پہلے تین دن گھروں میں مزے کرنے کی مہلت دیتے ہیں" },
          explanation: {
            en: "Salih gave them three days — a promise that would not be denied. Even in anger, Allah gives time; the punishment is never without warning.",
            ur: "صالح نے انہیں تین دن دیے — وہ وعدہ جو جھوٹا نہیں ہو سکتا۔ اللہ غضب میں بھی مہلت دیتا ہے — عذاب کبھی بغیر تنبیہ کے نہیں آتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:78",
          label: { en: "The earthquake seizes them and they die in their homes", ur: "زلزلہ انہیں آ لیتا ہے اور وہ اپنے گھروں میں ہلاک ہو جاتے ہیں" },
          explanation: {
            en: "The earthquake seized them and they died kneeling in their homes. Walls carved from mountains could not save them — only faith could have.",
            ur: "زلزلے نے انہیں پکڑ لیا اور وہ اپنے گھروں میں گھٹنوں کے بل مر گئے۔ پہاڑوں سے تراشے گھر نہ بچا سکے — صرف ایمان بچا سکتا تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 51:43–44",
          label: { en: "The thunderbolt seizes the Thamud while they look on", ur: "بجلی ثمود کو آ لیتی ہے جب وہ دیکھ رہے ہوتے ہیں" },
          explanation: {
            en: "They were told: enjoy yourselves for a while. But they defied their Lord, so the thunderbolt seized them while they were watching. Pride does not delay the punishment.",
            ur: "ان سے کہا گیا: تھوڑی دیر مزے کر لو۔ مگر انہوں نے اپنے رب کے حکم سے سرکشی کی، تو بجلی نے انہیں آ لیا جب وہ دیکھ رہے تھے۔ غرور عذاب کو نہیں ٹال سکتا۔",
          },
        },
      ],
    },
    {
      id: "the-believers-saved",
      title: { en: "Salih and the Believers Saved", ur: "صالح اور ایمان والے بچ گئے" },
      paragraphs: [
        {
          en: "The story does not end in sadness for everyone. The Qur'an says: \"And when Our command came, We saved Salih and those who believed with him, by a mercy from Us, from the disgrace of that day\" (Qur'an 11:66).",
          ur: "یہ کہانی سب کے لیے غم کے ساتھ ختم نہیں ہوتی۔ قرآن کہتا ہے: \"پھر جب ہمارا حکم آیا، ہم نے صالح اور ان کے ساتھ ایمان لانے والوں کو اپنی رحمت سے اس دن کی رسوائی سے بچا لیا\" (قرآن 11:66)۔",
        },
        {
          en: "The believers walked out of the valley unhurt. Nothing could touch them, because Allah protects the believers — no one can harm the one whom Allah protects.",
          ur: "مؤمنین وادی سے سلامت نکل گئے۔ انہیں کچھ بھی نقصان نہیں پہنچا، کیونکہ اللہ اپنے ایمان والوں کی حفاظت کرتا ہے — جس کی اللہ حفاظت کرے اسے کوئی نقصان نہیں پہنچا سکتا۔",
        },
        {
          en: "Salih turned away from the ruined city and said: \"O my people, I had conveyed to you the message of my Lord and advised you, but you do not like advisers\" (Qur'an 7:79). He had done his duty with love and patience.",
          ur: "صالح ویران شہر سے منہ موڑتے ہوئے کہا: \"اے میری قوم! میں نے تمہیں اپنے رب کا پیغام پہنچا دیا اور تمہیں نصیحت کی، لیکن تم نصیحت کرنے والوں کو پسند نہیں کرتے\" (قرآن 7:79)۔ انہوں نے اپنا فرض محبت اور صبر کے ساتھ ادا کیا۔",
        },
        {
          en: "And the Thamud became a lesson: \"So away with Thamud — they denied their Lord\" (Qur'an 11:68). The strong people who mocked the sign of Allah were gone, while the humble believers lived on.",
          ur: "اور ثمود ایک سبق بن گئی: \"پس ثمود دور ہو جائے — انہوں نے اپنے رب کا انکار کیا\" (قرآن 11:68)۔ طاقتور قوم جو اللہ کی نشانی کا مذاق اڑاتی تھی ختم ہو گئی، جبکہ عاجز ایمان والے زندہ رہے۔",
        },
        {
          en: "The story of Salih teaches every child: be grateful for the signs of Allah, treat His creatures with kindness, and put your trust in Him. The believer is always in the protection of Allah — and nothing in the world can harm that.",
          ur: "صالح کی کہانی ہر بچے کو سکھاتی ہے: اللہ کی نشانیوں کا شکر ادا کرو، اس کی مخلوق کے ساتھ نرمی کرو، اور اللہ پر بھروسہ رکھو۔ ایمان والا ہمیشہ اللہ کی حفاظت میں ہوتا ہے — اور دنیا کی کوئی چیز اسے نقصان نہیں پہنچا سکتی۔",
        },
      ],
      ayahNote: {
        en: "The story ends with mercy: Salih and the believers walked out unhurt. Their power was not in stone or strength, but in trusting Allah — and the one in Allah's protection cannot be harmed.",
        ur: "کہانی کا اختتام رحمت پر ہوتا ہے: صالح اور ایمان والے سلامت نکل آئے۔ ان کی طاقت پتھر میں نہ تھی، اللہ پر بھروسے میں تھی — اور اللہ کی حفاظت میں رہنے والے کو کوئی نقصان نہیں پہنچا سکتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:66",
          label: { en: "Allah saves Salih and the believers by His mercy from the disgrace of that day", ur: "اللہ اپنی رحمت سے صالح اور ایمان والوں کو اس دن کی رسوائی سے بچاتا ہے" },
          explanation: {
            en: "When the command came, Allah saved Salih and the believers by His mercy. The punishment passed over them untouched — mercy is stronger than destruction.",
            ur: "جب حکم آیا تو اللہ نے اپنی رحمت سے صالح اور ایمان والوں کو بچا لیا۔ عذاب ان پر نہیں اترا — رحمت ہلاکت سے بڑی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:79",
          label: { en: "Salih turns from them, saying he conveyed the message and advised them", ur: "صالح ان سے منہ موڑتے ہوئے کہتے ہیں کہ انہوں نے پیغام پہنچایا اور نصیحت کی" },
          explanation: {
            en: "Even at the end Salih had no anger — he had delivered the message and advised them. A prophet's farewell is peace, not revenge.",
            ur: "آخری لمحے میں بھی صالح کے دل میں غصہ نہیں تھا — انہوں نے پیغام پہنچا دیا اور نصیحت کر دی۔ نبی کا رخصتی کلام سکون ہے، بدلہ نہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:68",
          label: { en: "Thamud denied their Lord, so away with them — a lesson for all", ur: "ثمود نے اپنے رب کا انکار کیا، پس وہ دور ہو گئی — سب کے لیے سبق" },
          explanation: {
            en: "Thamud was gone, and only their lesson remained: the people who denied their Lord are away. The strong were erased; the humble believers lived on.",
            ur: "ثمود ختم ہو گئی، اور ان کا سبق رہ گیا: جس قوم نے اپنے رب کا انکار کیا وہ دور ہو گئی۔ مغرور مٹ گئے، عاجز ایمان والے زندہ رہے۔",
          },
        },
      ],
    },
  ],
};