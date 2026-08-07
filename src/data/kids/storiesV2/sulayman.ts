import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Sulayman (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * Son of Dawud who inherited his father's kingdom and was given the gifts
 * of speaking the language of the birds, commanding the wind, and ruling
 * the jinn. Every Quran-narrated event carries its actual verse from Surah
 * An-Naml (27), Surah Saba (34) and Surah Al-Anbiya (21). Urdu summary
 * only; paragraphs show the English fallback until translated.
 */
export const STORY_SULAYMAN: KidsStoryV2 = {
  id: "sulayman",
  type: "prophet",
  nameArabic: "سليمان",
  nameEnglish: "Sulayman (Solomon)",
  illustrationSymbol: "Bird",
  accentColor: "#6a5acd",
  summary: {
    en: "Dawud's son, given the gift of understanding the speech of birds and command over the wind. He ruled with wisdom and justice.",
    ur: "سلیمان علیہ السلام داؤد علیہ السلام کے بیٹے تھے، جنہیں اللہ نے پرندوں کی زبان سمجھنے اور ہوا پر حکمرانی کی نعمت عطا کی۔ اُنہوں نے حکمت اور انصاف کے ساتھ حکومت کی۔",
  },
  chapters: [
    {
      id: "inherited-kingdom",
      title: { en: "A Great Kingdom and Wonderful Gifts" },
      paragraphs: [
        {
          en: "Sulayman was the son of Dawud, and Allah gave him an amazing kingdom — even bigger and fuller of wonders than the kingdom of his father. The Qur'an says: “And Solomon inherited David, and he said: 'O people, we have been taught the language of birds, and we have been given from all things. Indeed, this is evident bounty'” (Qur'an 27:16).",
        },
        {
          en: "You see, Allah gave Sulayman the most wonderful gift: he could understand the language of the birds! A bird singing outside his window was not just making a sound — Sulayman knew what it was saying.",
        },
        {
          en: "And that was not all. Allah gave him command over the wind and made it obedient to him, and some of the jinn worked for him as well. His people, his soldiers and even the creatures of the sky lived under the care of a kind and wise king.",
        },
        {
          en: "Sulayman knew that all these gifts came from Allah. He praised his Lord for every single blessing instead of feeling proud, and he never used his powers to harm anyone.",
        },
        {
          en: "This is a lovely lesson for us: when we are given something special — a talent, a gift, or a responsibility — we should say Alhamdulillah and use it to help others, exactly as Sulayman did.",
        },
      ],
      ayahNote: {
        en: "Sulayman was given the greatest kingdom in the world, but he never became proud. He knew every gift comes from Allah, so he stayed humble and thankful.",
        ur: "سلیمان کو دنیا کی سب سے بڑی سلطنت ملی، لیکن وہ کبھی مغرور نہیں ہوئے۔ وہ جانتے تھے کہ ہر نعمت اللہ کی ہے، اس لیے عاجز رہے اور شکر ادا کرتے رہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 27:16",
          label: { en: "Sulayman inherits from Dawud and is taught the language of birds as evident bounty", ur: "سلیمان داؤد کے وارث بنتے ہیں اور انہیں پرندوں کی زبان سکھائی جاتی ہے جو اللہ کی کھلی نعمت ہے" },
          explanation: {
            en: "Sulayman inherited both the kingdom and the knowledge of the speech of birds, and he called it an evident bounty. A gifted person stays humble and praises Allah for every talent.",
            ur: "سلیمان کو سلطنت ملی اور پرندوں کی زبان کا علم بھی، اور انہوں نے اسے اللہ کی کھلی نعمت کہا۔ نعمت ملے تو غرور نہیں، شکر کرنا چاہیے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 27:17",
          label: { en: "Sulayman's army is gathered from jinn, men and birds, marching in rows", ur: "سلیمان کا لشکر جنوں، انسانوں اور پرندوں سے جمع ہوتا ہے اور قطاروں میں چلتا ہے" },
          explanation: {
            en: "Jinn, men and birds all marched in Sulayman's armies, yet they obeyed him only by Allah's command. Great power is a trust from Allah, to be used with justice.",
            ur: "سلیمان کے لشکر میں جن، انسان اور پرندے سب تھے، مگر وہ اللہ کے حکم سے ہی اس کی اطاعت کرتے تھے۔ بڑی طاقت اللہ کی امانت ہے، اسے انصاف کے ساتھ استعمال کرنا چاہیے۔",
          },
        },
      ],
    },
    {
      id: "valley-of-ants",
      title: { en: "The Valley of the Ants" },
      paragraphs: [
        {
          en: "One day, Sulayman and his great army marched through a valley — his soldiers of men, the jinn and the birds, all walking in perfect rows. But as they came near a hill of ants, a tiny voice called out in alarm.",
        },
        {
          en: "The Qur'an tells us what the ant said: “O ants, enter your dwellings so that Sulayman and his soldiers do not crush you while they do not realize it” (Qur'an 27:18).",
        },
        {
          en: "The little ant was frightened for her friends, because the army was so huge. But Sulayman could hear her — he could understand exactly what she said!",
        },
        {
          en: "Instead of getting angry, Sulayman smiled, amused at her words, and thanked Allah. He prayed: “My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do righteousness of which You approve. And admit me, by Your mercy, into the ranks of Your righteous servants” (Qur'an 27:19).",
        },
        {
          en: "Think of it — the king of a mighty kingdom stopped to smile at a tiny ant and asked Allah for help to be thankful. This is a big lesson: even small creatures matter, and gratitude comes before pride.",
        },
      ],
      ayahNote: {
        en: "The king of a huge kingdom stopped and smiled at the warning of a tiny ant, then asked Allah for gratitude. No creature is too small to matter, and no blessing is too small for thanks.",
        ur: "بہت بڑے بادشاہ نے ایک چھوٹی چیونٹی کی بات سن کر مسکراہٹ کے ساتھ اللہ کا شکر ادا کیا۔ اللہ کی ہر مخلوق اہم ہے اور ہر نعمت کا شکر ضروری ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 27:18",
          label: { en: "An ant warns its friends to enter their dwellings before Sulayman's army passes", ur: "ایک چیونٹی اپنے ساتھیوں کو خبردار کرتی ہے کہ سلیمان کے لشکر کے گزرنے سے پہلے اپنے گھروں میں چلے جائیں" },
          explanation: {
            en: "The little ant warned her friends to hide so that the army would not crush them. Even the smallest creature cares for its friends, and Allah loves that caring.",
            ur: "چیونٹی نے اپنے ساتھیوں کو خبردار کیا کہ لشکر انہیں کچل نہ دے۔ چھوٹی مخلوق بھی اپنے دوستوں کا خیال رکھتی ہے، اور اللہ ایسا خیال پسند کرتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 27:19",
          label: { en: "Sulayman smiles at the ant's words and prays for gratitude and righteousness", ur: "سلیمان چیونٹی کی بات پر مسکراتے ہیں اور شکر اور نیکی کی دعا کرتے ہیں" },
          explanation: {
            en: "Sulayman smiled at the ant's words and prayed: O Lord, help me be grateful and do good. The king asked for gratitude, not glory — that is true wisdom.",
            ur: "سلیمان چیونٹی کی بات پر مسکرائے اور دعا کی: اے رب، مجھے شکر اور نیکی کی توفیق دے۔ بادشاہ نے عزت نہیں، شکر مانگا — یہی حقیقی حکمت ہے۔",
          },
        },
      ],
    },
    {
      id: "hoopoe-news",
      title: { en: "The Hoopoe's Message from a Faraway Land" },
      paragraphs: [
        {
          en: "One day Sulayman took attendance of his birds and noticed that the hoopoe was missing. \"Why do I not see the hoopoe — or is he among the absent?\" he asked (Qur'an 27:20). He knew that even a clever bird must explain its absence.",
        },
        {
          en: "After a short wait, the hoopoe came flying back with an urgent message: “I have encompassed that which you have not encompassed, and I have come to you from Sheba with certain news” (Qur'an 27:22).",
        },
        {
          en: "The hoopoe said: “I found a woman ruling over them, and she has been given of all things, and she has a great throne” (Qur'an 27:23). And then came the most important news of all: “I found her and her people prostrating to the sun instead of Allah” (Qur'an 27:24).",
        },
        {
          en: "The Queen of Sheba and her people were praying to the sun, not to Allah. But the sun is only a creation — it is Allah who made it rise and set, and He alone deserves our worship.",
        },
        {
          en: "Sulayman did not want just news or gossip. He wanted the truth about Allah to reach those faraway people, so he decided to act with wisdom and mercy toward a whole nation he had never met.",
        },
      ],
      ayahNote: {
        en: "A little bird flew far away and came back with the truth: a whole nation worshipped the sun. Sulayman listened, and instead of pride or war he chose mercy and the call to Allah.",
        ur: "ایک چھوٹا سا ہدہد دور سے سچی خبر لایا کہ ایک پوری قوم سورج کو پوجتی ہے۔ سلیمان نے خبر سن کر غرور نہیں کیا، بلکہ رحمت کے ساتھ انہیں اللہ کی طرف بلایا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 27:20–21",
          label: { en: "Sulayman notices the hoopoe is absent and asks why he is missing", ur: "سلیمان کو ہدہد نظر نہیں آتا اور وہ پوچھتے ہیں کہ یہ کیوں غائب ہے" },
          explanation: {
            en: "The king noticed that the hoopoe was absent. A wise leader keeps watch over everything Allah has entrusted to him, even the smallest of his subjects.",
            ur: "بادشاہ نے دیکھا کہ ہدہد غائب ہے۔ دانا بادشاہ اللہ کی دی ہوئی ہر چیز کا خیال رکھتا ہے، چاہے وہ چھوٹی ہی کیوں نہ ہو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 27:22–25",
          label: { en: "The hoopoe reports a queen of Sheba whose people worship the sun instead of Allah", ur: "ہدہد بتاتا ہے کہ ملکہ سبا ہے جس کی قوم اللہ کے بجائے سورج کی عبادت کرتی ہے" },
          explanation: {
            en: "The hoopoe reported a queen whose people bowed to the sun. Only Allah created the sun, so only Allah deserves worship — this news moved Sulayman to act with mercy.",
            ur: "ہدہد نے بتایا کہ ملکہ سبا کی قوم سورج کے آگے جھکتی ہے۔ سورج کو تو اللہ نے بنایا ہے، اس لیے عبادت صرف اللہ کی ہے — یہی خبر سلیمان کو رحمت کی راہ پر لے چلی۔",
          },
        },
      ],
    },
    {
      id: "letter-to-queen",
      title: { en: "A Letter to the Queen of Sheba" },
      paragraphs: [
        {
          en: "Sulayman wrote a gentle but clear letter and gave it to the hoopoe to deliver. “Take this letter of mine and deliver it to them, then leave them and see what answer they will return” (Qur'an 27:28). And the hoopoe flew across the lands until it reached the queen.",
        },
        {
          en: "The letter began: \"In the name of Allah, the Most Gracious, the Most Merciful. Do not act towards me with arrogance, but come to me in submission to Allah alone\" (Qur'an 27:30–31).",
        },
        {
          en: "When the Queen read it, she called her advisors. They said: \"We possess great strength and great might, but the command is yours, so see what you will command\" (Qur'an 27:33). The wise queen decided to send a gift to Sulayman instead of a war.",
        },
        {
          en: "But Sulayman refused the gift with grace: \"Would you provide me with wealth? But what Allah has given me is better than what He has given you\" (Qur'an 27:36). He did not want treasure — he wanted her heart to turn toward Allah.",
        },
        {
          en: "The queen began to understand that this king was different. His letter was kind, his wisdom was deep, and his words carried light. So she set out herself to meet him.",
        },
      ],
      ayahNote: {
        en: "Sulayman did not send an army; he sent a letter that began with the name of Allah. A kind and true invitation can open the heart that weapons never could.",
        ur: "سلیمان نے فوج نہیں بھیجی، انہوں نے ایک خط بھیجا جو اللہ کے نام سے شروع ہوا۔ نرم اور سچی دعوت وہ دل کھول دیتی ہے جو ہتھیار کبھی نہیں کھول سکتے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 27:28–31",
          label: { en: "Sulayman sends a letter inviting the queen to submit to Allah alone", ur: "سلیمان ایک خط بھیجتے ہیں جس میں ملکہ کو صرف اللہ کی اطاعت کی دعوت دیتے ہیں" },
          explanation: {
            en: "The letter said: do not be arrogant, come to Allah in submission. Inviting others gently, without force, is the way of the prophets.",
            ur: "خط میں لکھا تھا: تکبر نہ کرو، اللہ کی اطاعت پر آ جاؤ۔ زبردستی نہیں، نرمی سے دعوت دینا ہی انبیاء کا طریقہ ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 27:32–36",
          label: { en: "The queen consults her chiefs, sends a gift, and Sulayman declines it, relying on Allah's bounty", ur: "ملکہ اپنے سرداروں سے مشورہ کرتی ہے اور تحفہ بھیجتی ہے، اور سلیمان اللہ کی نعمت پر بھروسہ کرتے ہوئے تحفہ واپس کر دیتے ہیں" },
          explanation: {
            en: "The queen asked her advisors, then sent a gift. Sulayman refused it, saying: what Allah gave me is better. He wanted her heart, not her treasure.",
            ur: "ملکہ نے اپنے سرداروں سے مشورہ کیا اور تحفہ بھیجا۔ سلیمان نے فرمایا: اللہ نے مجھے جو دیا ہے وہ بہتر ہے۔ وہ تحفہ نہیں، ملکہ کا دل چاہتے تھے۔",
          },
        },
      ],
    },
    {
      id: "queen-submits",
      title: { en: "The Queen Submits to Allah" },
      paragraphs: [
        {
          en: "At last the Queen of Sheba travelled to meet Sulayman. He welcomed her with honour and showed her the wonders of his kingdom, including the most amazing palace of all.",
        },
        {
          en: "When she stepped into the great hall, she saw what looked like a pool of water and lifted her skirt to wade through it. But it was not water at all — the floor was made of smooth, shining glass (Qur'an 27:44).",
        },
        {
          en: "At that moment her eyes opened wide. She said: \"My Lord, indeed I have wronged myself, and I submit with Sulayman to Allah, Lord of the worlds\" (Qur'an 27:44).",
        },
        {
          en: "The proud queen bowed instead to Allah alone. She left the sun she had worshipped behind her and came to the One Who had created the sun, the glass, the ants and everything else.",
        },
        {
          en: "This was one of Sulayman's dearest rewards: his message had reached a heart in a faraway land, and a whole nation had come to the truth. Sharing Allah's message with gentleness is a treasure that lasts forever.",
        },
      ],
      ayahNote: {
        en: "When the queen saw the palace of glass, she bowed to the true Lord of the worlds. The truth entered her heart, and she left the sun to worship its Creator.",
        ur: "جب ملکہ نے شیشے کے محل کا عجوبہ دیکھا تو وہ رب العالمین کے آگے جھک گئی۔ سچ نے اس کا دل بدل دیا، اور اس نے سورج چھوڑ کر اس کے خالق کی عبادت کی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 27:44",
          label: { en: "The queen sees the glass floor of Sulayman's palace and submits to Allah, Lord of the worlds", ur: "ملکہ سلیمان کے محل کا شیشے کا فرش دیکھتی ہے اور رب العالمین اللہ کے سامنے جھک جاتی ہے" },
          explanation: {
            en: "The queen lifted her skirt to cross what she thought was water — but it was glass. In that moment she knew: the One who made these wonders is greater than the sun, and she submitted to Him.",
            ur: "ملکہ نے پانی سمجھ کر دامن اٹھایا، مگر وہ شیشہ تھا۔ اس پر اس نے پہچان لیا کہ ان عجوبوں کا خالق سورج سے بڑا ہے، اور وہ اللہ کے آگے جھک گئی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 27:37–39",
          label: { en: "Sulayman warns the queen not to come in defiance and a strong jinn offers to bring her throne", ur: "سلیمان ملکہ کو خبردار کرتے ہیں کہ وہ نافرمانی میں نہ آئے اور ایک طاقتور جن اس کا تخت لانے کی پیشکش کرتا ہے" },
          explanation: {
            en: "Sulayman warned the queen not to come in defiance, and a mighty jinn offered to bring her throne. The kingdom's power was real, yet it pointed to Allah, not to Sulayman.",
            ur: "سلیمان نے ملکہ کو خبردار کیا کہ نافرمانی نہ کرے، اور ایک طاقتور جن نے اس کا تخت لانے کی پیشکش کی۔ یہ طاقت اللہ کی طرف اشارہ کرتی تھی، سلیمان کی طرف نہیں۔",
          },
        },
      ],
    },
    {
      id: "wind-and-jinn",
      title: { en: "The Wind and the Jinn Obey Him" },
      paragraphs: [
        {
          en: "Allah gave Sulayman a special command over the wind. The Qur'an says: \"And to Sulayman We subjected the wind — its morning journey is a month's journey and its afternoon journey is a month's journey\" (Qur'an 34:12).",
        },
        {
          en: "Imagine that! With a favourable breeze, Sulayman could travel in one morning what would take other travellers a whole month. The wind carried his ships wherever he wished to go.",
        },
        {
          en: "The Qur'an also tells us: \"And of the devils were some who dived for him and did other work besides that\" (Qur'an 21:82). Some of the jinn worked for Sulayman — diving for pearls and building for him — but always by the command of Allah.",
        },
        {
          en: "Allah says about those workers: \"Whoever deviated among them from Our command — We will make him taste the punishment of the Blaze\" (Qur'an 34:12). So even the jinn who served Sulayman were kept in line by Allah.",
        },
        {
          en: "Sulayman had the wind and the jinn at his call, yet he remained humble. True power in Islam is not about showing off — it is about receiving a gift from Allah and using it with thankfulness and justice.",
        },
      ],
      ayahNote: {
        en: "The wind carried Sulayman a month's journey in a single morning, and the jinn worked at his command — all by the leave of Allah. Power is a gift; using it justly is worship.",
        ur: "ہوا سلیمان کو ایک صبح میں ایک مہینے کا راستہ طے کرا دیتی تھی، اور جن اس کے حکم سے کام کرتے تھے — سب اللہ کی اجازت سے۔ طاقت نعمت ہے، اسے انصاف سے استعمال کرنا عبادت ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 34:12",
          label: { en: "Allah subjects the wind and some jinn to work for Sulayman by His permission", ur: "اللہ اپنے حکم سے ہوا اور کچھ جنوں کو سلیمان کی خدمت کے لیے مسخر کرتا ہے" },
          explanation: {
            en: "Allah subjected the wind and some of the jinn to Sulayman, and warned that whoever disobeys His command will taste the Blaze. Even a king's servants answer to Allah.",
            ur: "اللہ نے ہوا اور کچھ جنوں کو سلیمان کے تابع کیا، اور فرمایا کہ جو حکم کی خلاف ورزی کرے گا اسے آگ کا عذاب چکھنا پڑے گا۔ اللہ کے حکم کے آگے سب برابر ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 21:81–82",
          label: { en: "The strongly raging wind runs by Sulayman's command and the devils dive and work for him", ur: "تیز چلنے والی ہوا سلیمان کے حکم سے چلتی ہے اور کچھ شیاطین غوطہ لگا کر ان کے لیے کام کرتے ہیں" },
          explanation: {
            en: "The stormy wind ran by his order, and some of the devils dived for pearls and worked for him. What a blessing — yet Sulayman kept his heart low before Allah.",
            ur: "تیز ہوا ان کے حکم سے چلتی تھی اور کچھ شیاطین ان کے لیے غوطہ لگا کر کام کرتے تھے۔ اتنی بڑی نعمت کے باوجود سلیمان اللہ کے آگے عاجز رہے۔",
          },
        },
      ],
    },
  ],
};
