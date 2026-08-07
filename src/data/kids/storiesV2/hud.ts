import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Hud (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger sent to the people of 'Ad, a proud nation that built grand
 * monuments in the valleys and trusted in its own strength. When they refused
 * to worship Allah alone, a fierce cold wind destroyed them, and only the
 * believers were saved.
 * Anchored to the true Hud verses: Surah Hud (11:50–72), Al-A'raf (7:65–72),
 * Al-Fussilat (41:15–17), Al-Haqqah (69:4–8) and Al-Ahqaf (46:24–25).
 * Fully bilingual (English + Urdu).
 */
export const STORY_HUD: KidsStoryV2 = {
  id: "hud",
  type: "prophet",
  nameArabic: "هود",
  nameEnglish: "Hud (Heber)",
  illustrationSymbol: "Wind",
  accentColor: "#7d9db5",
  summary: {
    en: "Hud was sent to the people of 'Ad, who were tall, strong and proud of their grand buildings. They called him a liar and kept worshipping their idols. But no power lasts against Allah — a fierce cold wind swept the proud nation away, and only the believers were saved.",
    ur: "ہود علیہ السلام عاد کی قوم کی طرف بھیجے گئے جو لمبے، طاقتور اور اپنی شاندار عمارتوں پر فخر کرنے والے تھے۔ انہوں نے ہود کو جھٹلایا اور اپنے بتوں کی عبادت کرتے رہے۔ لیکن کوئی طاقت اللہ کے سامنے نہیں ٹھہر سکتی چنانچہ ایک زبردست ٹھنڈی آندھی آئی جس نے مغرور قوم کو مٹا دیا، اور صرف ایمان والے بچ گئے۔",
  },
  chapters: [
    {
      id: "the-proud-people",
      title: { en: "The People of 'Ad", ur: "عاد کی قوم" },
      paragraphs: [
        {
          en: "Long after the time of Nuh, a strong nation grew on the earth — the people of 'Ad. Allah had blessed them with beauty, strength and great riches. The Qur'an says: \"Have you not considered how your Lord dealt with 'Ad, whose pillars were never matched in the lands?\" (Qur'an 89:6–8).",
          ur: "نوح علیہ السلام کے بعد زمین پر ایک نئی طاقتور قوم پیدا ہوئی چھو عاد کی قوم۔ اللہ نے انہیں خوبصورتی، طاق اور دولت سے نوازا تھا۔ قرآن کہتا ہے: \"کیا تم نے نہیں دیکھا کہ تمہارے رب نے عاد کے ساتھ کیا کیا، جن کے ستون پورے شہروں میں کبھی نہیں دیکھے گئے؟\" (قرآن 89:6–8)۔",
        },
        {
          en: "The people of 'Ad were famous for being tall and strong. No army could defeat them, and they thought their power would last forever. But they used that power with cruelty and pride, bowing to idols made of stone instead of Him who created them.",
          ur: "عاد کی قوم اپنے لمبے قد اور طاقتور ہونے کے لیے مشہور تھی۔ کوئی لشکر انہیں شکست نہیں دے سکتا تھا اور وہ سمجھتے تھے کہ ان کی طاقت ہمیشہ رہے گی۔ لیکن وہ اپنی طاقت کا استعمال ظلم اور غرور کے ساتھ کرتے تھے، اور پتھر کے بتوں کی عبادت کرتے تھے۔",
        },
        {
          en: "Allah does not destroy a nation just for being strong — He looks at what is inside the heart. The 'Ad had forgotten that every strength on earth borrows its power from Allah, and that He alone is the Ever-Living, the One Who holds all truth.",
          ur: "اللہ کسی قوم کو صرف طاقت کی وجہ سے تباہ نہیں کرتا — وہ دلوں کی طرف دیکھتا ہے۔ عاد بھول گئے تھے کہ زمین کی ہر طاقت اللہ سے ادھار لی ہوئی ہے، اور وہی ہے جو ہمیشہ زندہ ہے اور سچائی پر قائم ہے۔",
        },
      ],
      ayahNote: {
        en: "The pillars of 'Ad were great buildings, taller than anything in the lands. But this chapter is a whisper to every proud heart: no pillar, no palace and no army can stand longer than Allah wills.",
        ur: "عاد کے ستون بہت بڑی عمارتیں تھیں جو تمام شہروں میں کبھی نہیں دیکھی گئیں۔ لیکن یہ باب ہر مغرور دل کے لیے آہٹ ہے۔ کوئی ستون، کوئی محل اور کوئی لشکر اللہ کی مرضی سے زیادہ دیر نہیں ٹھہر سکتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 89:6–8",
          label: { en: "Allah mentions the people of 'Ad and their tall pillars", ur: "اللہ عاد کی قوم اور ان کے بلند ستونوں کا ذکر کرتا ہے" },
          explanation: {
            en: "Allah tells the story of the 'Ad like a mirror: they were tall and strong, their pillars were unmatched, yet their strength did not save them. Strength without thankfulness becomes a burden.",
            ur: "اللہ عاد کی کہانی آئینے کی طرح بیان کرتا ہے۔ وہ لمبے اور طاقتور تھے، ان کے ستون بے مثال تھے، پھر بھی ان کی طاقت انہیں نہ بچا سکی۔ شکر کے بغیر طاقت بوجھ بن جاتی ہے۔",
          },
        },
      ],
    },
    {
      id: "hud-calls",
      title: { en: "Hud Calls to One God", ur: "ایک اللہ کی طرف دعوت" },
      paragraphs: [
        {
          en: "Allah chose Hud from among the 'Ad and sent him as a messenger to his own people. Hud stood before them with a gentle heart and said: \"O my people, worship Allah — you have no god besides Him\" (Qur'an 11:50).",
          ur: "اللہ نے ہود علیہ السلام کو عاد کی قوم میں سے چن کر انہیں اپنی قوم کی طرف رسول بنا کر بھیجا۔ ہود اپنی قوم کے سامنے نرم دل سے کھڑے ہوئے اور کہا: \"اے میری قوم، صرف اللہ کی عبادت کرو — اس کے سوا تمہارا کوئی معبود نہیں\" (قرآن 11:50)۔",
        },
        {
          en: "Hud reminded them of the One who gave them tall bodies, wide valleys and pouring rain. \"Seek forgiveness from your Lord and turn to Him in repentance; He will send rain upon you in abundance and add strength to your strength\" (Qur'an 11:52).",
          ur: "ہود نے انہیں اس رب کی نعمتوں کی یاد دلائی جس نے انہیں بلند قامت، کھلی وادیاں اور موسلادھار بارش دی۔ \"اپنے رب سے مغفرت مانگو اور اس کی طرف رجوع کرو — وہ تم پر موسلادھار بارش بھیجے گا اور تمہاری طاقت پر طاقت بڑھائے گا\" (قرآن 11:52)۔",
        },
        {
          en: "But the leaders refused and answered with pride: \"O Hud, you have brought us no clear proof, and we will not leave our gods at your word\" (Qur'an 11:53). Their idols — statues of stone carved by their own hands — were dearer to them than the One who made them.",
          ur: "لیکن سرداروں نے غرور سے جواب دیا: \"اے ہود، تم ہمارے پاس کوئی واضح دلیل نہیں لائے، اور ہم تمہارے کہنے پر اپنے معبودوں کو نہیں چھوڑیں گے\" (قرآن 11:53)۔ ان کے پتھر کے بت — جنہیں انہوں نے خود تراشا تھا — ان کے لیے اس سے بھی زیادہ عزیز تھے جس نے انہیں بنایا۔",
        },
      ],
      ayahNote: {
        en: "Hud's whole message was two things: worship Allah alone, and ask His forgiveness. Repentance brings rain and strength — this is Allah's promise, not a guess.",
        ur: "ہود کی پوری دعوت دو باتیں تھیں۔ صرف اللہ کی عبادت کرو، اور اس سے معافی مانگو۔ توبہ بارش اور طاقت لاتی ہے۔ یہ اللہ کا وعدہ ہے، اندازہ نہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:50–53",
          label: { en: "Hud calls his people to worship Allah alone and to ask His forgiveness", ur: "ہود اپنی قوم کو صرف اللہ کی عبادت اور اس سے مغفرت مانگنے کی دعوت دیتے ہیں" },
          explanation: {
            en: "Hud's call carried no heavy arguments — just the truth: you were made by One God, so worship Him alone. The leaders answered with pride because they loved their statues more than their Maker.",
            ur: "ہود کی دعوت میں کوئی بھاری دلیل نہیں تھی، صرف سچ تھا۔ تمہیں ایک اللہ نے بنایا ہے، تو اسی کی عبادت کرو۔ سرداروں نے غرور سے جواب دیا کیونکہ وہ اپنے بتوں کو اپنے خالق سے زیادہ پیار کرتے تھے۔",
          },
        },
      ],
    },
    {
      id: "the-challenge",
      title: { en: "They Dare the Punishment", ur: "عذاب کا چیلنج" },
      paragraphs: [
        {
          en: "At last the people of 'Ad said: \"Bring us the punishment you warn us about, if you are telling the truth\" (Qur'an 7:70). Their hearts were so hard and their pride so great that they dared the command of Allah to come.",
          ur: "آخر کار عاد کی قوم نے کہا: \"جو عذاب تم ہمیں ڈراتے ہو وہ لا کر دکھاؤ، اگر تم سچے ہو\" (قرآن 7:70)۔ ان کے دل اتنے سخت ہو چکے تھے اور ان کا غرور اتنا بڑھ گیا تھا کہ انہوں نے اللہ کے حکم کو للکارا۔",
        },
        {
          en: "Hud answered gently and firmly: \"I have placed my trust in Allah — so plot against me, all of you, and give me no respite\" (Qur'an 11:55). His heart was calm because he knew the One who holds every destiny.",
          ur: "ہود نے نرمی اور پختگی سے جواب دیا: \"میں نے اللہ پر بھروسہ کر لیا ہے — تم سب مل کر میرے خلاف چال چل لو اور مجھے مہلت نہ دو\" (قرآن 11:55)۔ ان کا دل پرسکون تھا کیونکہ وہ اس ذات کو جانتے تھے جو ہر تقدیر کو سنبھالے ہوئے ہے۔",
        },
        {
          en: "Facing the whole town, Hud's courage did not shake. He kept calling them with mercy: \"There is no creature but that its forelock is held by my Lord — indeed my Lord is upon a straight path\" (Qur'an 11:56).",
          ur: "پوری قوم کے سامنے ہود کا دل نہیں ڈگمگایا۔ وہ رحمت کے ساتھ کہتے رہے: \"کوئی چلنے والی مخلوق نہیں مگر اس کی پیشانی میرے رب کی گرفت میں ہے — بیشک میرا رب سیدھی راہ پر ہے\" (قرآن 11:56)۔",
        },
      ],
      ayahNote: {
        en: "When they dared the punishment, Hud answered with calm trust: every creature is held by Allah, and he walks on a straight path. True courage is trusting Allah when others boast.",
        ur: "جب انہوں نے عذاب کو للکارا تو ہود نے پرسکون بھروسے سے جواب دیا۔ ہر مخلوق اللہ کی گرفت میں ہے، اور وہ سیدھی راہ پر ہیں۔ سچی بہادری یہ ہے کہ جب دوسرے شیخی مارتے ہیں تو آپ اللہ پر بھروسہ کریں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:70",
          label: { en: "They ask Hud to bring the punishment he warns about", ur: "وہ ہود سے کہتے ہیں کہ جو عذاب تم ڈراتے ہو وہ لا کر دکھاؤ" },
          explanation: {
            en: "The people were so sure of their strength that they mocked the punishment before it came. This verse is a warning: do not be so proud that you dare the truth to prove itself.",
            ur: "لوگ اپنی طاقت پر اتنے یقین رکھتے تھے کہ عذاب آنے سے پہلے ہی اس کا مذاق اڑاتے تھے۔ یہ آیت آگاہی ہے۔ اتنا مغرور مت ہو کہ تم سچ کو ثبوت مانگنے پر مجبور کرو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:55–56",
          label: { en: "Hud trusts in Allah, in whose hand every creature lies", ur: "ہود اللہ پر بھروسہ کرتے ہیں جس کی گرفت میں ہر مخلوق ہے" },
          explanation: {
            en: "Hud's enemies could plot day and night, but he rested on one rock: every creature's forelock is in Allah's hand. Whoever holds Allah's rope cannot be shaken.",
            ur: "ہود کے دشمن دن رات چالیں چل سکتے تھے، لیکن ہود ایک چٹان پر ٹکے رہے۔ ہر مخلوق کی پیشانی اللہ کے ہاتھ میں ہے۔ جو اللہ کی رسی تھام لے اسے کوئی ہلا نہیں سکتا۔",
          },
        },
      ],
    },
    {
      id: "the-wind",
      title: { en: "The Punishing Wind", ur: "عذاب کی آندھی" },
      paragraphs: [
        {
          en: "Then the punishment arrived — one nobody expected. The people of 'Ad looked up and saw a dark cloud coming over their valleys. They rejoiced: \"This is a cloud that will bring us rain!\" But Allah said: \"It is what you wished to hasten — a wind in which is a painful torment\" (Qur'an 46:24).",
          ur: "پھر وہ عذاب آیا جس کی کسی نے توقع نہیں کی تھی۔ عاد کی قوم نے اوپر دیکھا تو ایک کالا بادل ان کی وادیوں پر چھاتا ہوا آیا۔ وہ خوش ہوئے: \"یہ بادل ہمیں بارش دینے والا ہے!\" لیکن اللہ نے فرمایا: \"یہ وہی ہے جس کی تم جلدی مانگ رہے تھے — ایک آندھی جس میں دردناک عذاب ہے\" (قرآن 46:24)۔",
        },
        {
          en: "Instead of rain, the cloud carried a furious, freezing, roaring wind. Allah said: \"A wind that destroyed everything by the command of its Lord — it blew for seven nights and eight days\" (Qur'an 69:7). Stones, towers, bodies — nothing could stand against it.",
          ur: "بارش کے بجائے اس بادل میں ایک زبردست، ٹھنڈی اور غضبناک آندھی تھی۔ اللہ نے فرمایا: \"ایک آندھی جس نے اپنے رب کے حکم سے ہر چیز کو تباہ کر دیا — وہ سات راتیں اور آٹھ دن چلتی رہی\" (قرآن 69:7)۔ پتھر، مینارے، جسموں — کوئی چیز اس کے سامنے نہ ٹھہر سکی۔",
        },
        {
          en: "All that looked so great — power, wealth, palaces — turned to dust in days. The Qur'an sums up: \"So those people of 'Ad became dead leaves of destruction\" — and the ruins became a lesson for every generation that thinks strength is forever.",
          ur: "جو کچھ بہت بڑا لگتا تھا — طاقت، دولت، محل — چند دنوں میں مٹ گیا۔ قرآن کا خلاصہ ہے: \"پس وہ عاد اس طرح مٹ گئے جیسے کھجور کے کھوکھلے تنے\" — اور ان کے کھنڈرات ہر اس نسل کے لیے سبق بن گئے جو سمجھتی ہے کہ طاقت ہمیشہ رہے گی۔",
        },
      ],
      ayahNote: {
        en: "The people rejoiced at the cloud, expecting rain — but it carried destruction. Seven nights and eight days the wind blew, and the proud towers turned to ruin. Never trade Allah's mercy for a moment of joy in sin.",
        ur: "لوگ بادل دیکھ کر خوش ہوئے، بارش کی امید تھی، لیکن اس میں تباہی تھی۔ سات راتیں اور آٹھ دن آندھی چلتی رہی، اور مغرور مینارے ملبہ بن گئے۔ اللہ کی رحمت کو گناہ کے لمحے کی خوشی پر کبھی مت بیچو۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 46:24–25",
          label: { en: "The cloud over the valleys brings a painful wind, not rain", ur: "وادیوں پر چھایا بادل بارش نہیں بلکہ دردناک آندھی لے کر آتا ہے" },
          explanation: {
            en: "The same cloud they hoped would water their fields brought their end. What looked like mercy was punishment, because they had rejected the truth for so long.",
            ur: "جس بادل سے وہ اپنے کھیتوں کے لیے بارش چاہتے تھے، اسی بادل سے ان کی تباہی آئی۔ جو چیز رحمت لگ رہی تھی وہ عذاب بن گئی، کیونکہ انہوں نے بہت عرصے سے سچ کو جھٹلایا تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 69:7–8",
          label: { en: "The wind destroyed the people of 'Ad over seven nights and eight days", ur: "آندھی نے سات راتیں اور آٹھ دن میں عاد کی قوم کو تباہ کر دیا" },
          explanation: {
            en: "The wind destroyed everything the 'Ad had built in their proud days. Their greatest buildings could not survive even one week of wind.",
            ur: "آندھی نے وہ سب کچھ تباہ کر دیا جو عاد نے اپنے غرور کے دنوں میں بنایا تھا۔ ان کی بڑی عمارتیں آندھی کے ایک ہفتے بھی سامنا نہ کر سکیں۔",
          },
        },
      ],
    },
    {
      id: "the-survivors",
      title: { en: "The Believers Were Saved", ur: "ایمان والے بچ گئے" },
      paragraphs: [
        {
          en: "Though the wind destroyed the town, the story does not end in ruin. Allah tells us: \"Yet when Our command came, We saved Hud and those who believed with him, by a mercy from Us\" (Qur'an 11:58).",
          ur: "اگر آندھی نے قوم کو تباہ کیا، کہانی یہیں ختم نہیں ہوتی۔ اللہ فرماتا ہے: \"پھر جب ہمارا حکم آیا، ہم نے ہود کو اور اس کے ساتھ ایمان لانے والوں کو اپنی رحمت سے بچا لیا\" (قرآن 11:58)۔",
        },
        {
          en: "The believers left the dead valley alive and unhurt — a powerful hand reached through the storm and pulled them to safety. The example of Hud is repeated in the Qur'an with this promise: those who hold on to Allah are never abandoned.",
          ur: "مومنین زندہ اور سالم اس ویران وادی سے نکل گئے — طوفان کے درمیان اللہ کے طاقتور ہاتھ نے انہیں کھینچ کر حفاظت میں لے لیا۔ ہود کی مثال قرآن میں اس وعدے کے ساتھ دہرائی گئی ہے: جو اللہ سے وابستہ ہوتے ہیں وہ کبھی تنہا نہیں چھوڑے جاتے۔",
        },
        {
          en: "So for every proud heart, the wind of 'Ad is a whisper: don't depend on your strength for even one hour; the Giver of strength is the only One who stands forever. And to every humble heart, the same wind brings good news: the ship of trust always sails.",
          ur: "چنانچہ ہر مغرور دل کے لیے عاد کی آندھی ایک آہٹ ہے: اپنی طاقت پر ایک گھنٹہ بھی نہ کرو؛ طاقت دینے والا ہی ہمیشہ قائم رہنے والا ہے۔ اور ہر فروتن دل کے لیے وہی آندھی خوشخبری ہے: بھروسے کی کشتی ہمیشہ سفر کرتی ہے۔",
        },
      ],
      ayahNote: {
        en: "The storm spared the believers. This is the real treasure of the story: mercy is for those who hold on to Allah, and the punishment falls on the wrongdoers alone.",
        ur: "طوفان نے ایمان والوں کو محفوظ رکھا۔ یہ کہانی کا اصل خزانہ ہے۔ رحمت انہی کے لیے ہے جو اللہ سے وابستہ رہیں، اور عذاب صرف ظالموں پر آتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 11:58",
          label: { en: "Allah saved Hud and those who believed from the punishment", ur: "اللہ نے ہود اور ایمان لانے والوں کو عذاب سے بچایا" },
          explanation: {
            en: "Hud and his people walked through the valley the wind destroyed, and not a hair of theirs was harmed. Allah saves those who believe — this is His promise.",
            ur: "ہود اور ان کی قوم اس وادی سے گزرے جسے آندھی نے تباہ کیا، اور ان کا ایک بال بھی نہ بگڑا۔ جو ایمان لاتے ہیں اللہ انہیں بچاتا ہے۔ یہ اس کا وعدہ ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 11:60",
          label: { en: "The punishment fell on the wrongdoers while the believers received mercy", ur: "عذاب ظالموں پر گرا اور مومنین پر رحمت اتری" },
          explanation: {
            en: "The same wind brought two different gifts: mercy for the believers and a curse for the wrongdoers. The difference was not in the wind — it was in the heart.",
            ur: "اسی آندھی نے دو طرح کے تحفے دیے۔ مومنین کے لیے رحمت اور ظالموں کے لیے لعنت۔ فرق آندھی میں نہیں تھا، فرق دلوں میں تھا۔",
          },
        },
      ],
    },
  ],
};
