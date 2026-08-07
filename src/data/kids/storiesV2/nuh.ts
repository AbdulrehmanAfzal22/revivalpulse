import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Nuh (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger who called his people for 950 years, built the great ark at
 * Allah's command, and carried the believers to safety through the flood.
 * Anchored to the true Nuh verses: Surah Nuh (71:1–28), Hud (11:25–48),
 * Al-Anbiya (21:76–77), As-Saffat (37:75–77) and Al-Ankabut (29:14).
 * Fully bilingual (English + Urdu) per the Phase 12 bilingual standard.
 */
export const STORY_NUH: KidsStoryV2 = {
  id: "nuh",
  type: "prophet",
  nameArabic: "نوح",
  nameEnglish: "Nuh (Noah)",
  illustrationSymbol: "Ship",
  accentColor: "#3d8bd6",
  summary: {
    en: "Nuh called his people to Allah for 950 years, with patience and love. When they refused to listen, Allah commanded him to build a great ark. The believers climbed aboard, and the flood came — but the ark and its people were safe, because those who trust Allah are never drowned.",
    ur: "نوح علیہ السلام نے 950 سال تک اپنی قوم کو صبر اور محبت کے ساتھ اللہ کی طرف بلایا۔ جب انہوں نے نہ سنا تو اللہ نے اُنہیں ایک بڑی کشتی بنانے کا حکم دیا۔ مومن کشتی پر سوار ہو گئے، پھر طوفان آیا — لیکن کشتی اور اُس میں سوار لوگ محفوظ رہے، کیونکہ جو اللہ پر بھروسہ کرتے ہیں وہ کبھی ڈوبتے نہیں۔",
  },
  chapters: [
    {
      id: "the-call",
      title: { en: "The Call of Nuh", ur: "نوح کی دعوت" },
      paragraphs: [
        {
          en: "Allah sent Nuh to his people, who had forgotten their Creator and worshipped statues made of wood and stone. The Qur'an tells us what Nuh said: \"O my people, worship Allah — you have no god other than Him. Indeed, I fear for you the punishment of a great Day\" (Qur'an 11:25–26).",
          ur: "اللہ نے نوح علیہ السلام کو اُن کی قوم کی طرف بھیجا، جو اپنے خالق کو بھول چکی تھی اور لکڑی اور پتھر کے بتوں کی پوجا کرتی تھی۔ قرآن ہمیں بتاتا ہے کہ نوح نے کہا: \"اے میری قوم! اللہ کی عبادت کرو — اُس کے سوا تمہارا کوئی معبود نہیں۔ بیشک میں تمہارے لیے ایک بڑے دن کے عذاب سے ڈرتا ہوں\" (قرآن 11:25–26)۔",
        },
        {
          en: "Nuh did not give up after one day, or one year, or one generation. The Qur'an says plainly: \"He remained among them a thousand years minus fifty years\" (Qur'an 29:14). For 950 years he called his people — morning and evening, in secret and in public.",
          ur: "نوح نے ایک دن، ایک سال یا ایک نسل کے بعد ہمت نہیں ہاری۔ قرآن صاف کہتا ہے: \"وہ اُن میں ایک ہزار سال کم پچاس سال رہے\" (قرآن 29:14)۔ 950 سال تک اُنہوں نے اپنی قوم کو بلایا — صبح و شام، چھپ کر اور کھلے عام۔",
        },
        {
          en: "Allah preserved Nuh's own words in Surah Nuh. Nuh told his people: \"Indeed, I am a clear warner to you — worship Allah, fear Him, and obey me. Allah will forgive you of your sins and delay you for a specified term\" (Qur'an 71:2–4).",
          ur: "اللہ نے سورہ نوح میں نوح کے اپنے الفاظ محفوظ رکھے ہیں۔ نوح نے اپنی قوم سے کہا: \"بیشک میں تمہارے لیے ایک واضح ڈرانے والا ہوں — اللہ کی عبادت کرو، اُس سے ڈرو اور میری اطاعت کرو۔ اللہ تمہارے گناہ معاف کر دے گا اور تمہیں ایک مقررہ وقت تک مہلت دے گا\" (قرآن 71:2–4)۔",
        },
        {
          en: "But the leaders of the people rejected him. They said: \"We do not see you as anything but a man like us\" (Qur'an 11:27), and they accused him of following the weak and the poor. They could not see that faith has no rich or poor — it belongs to the heart.",
          ur: "لیکن قوم کے سرداروں نے اُسے جھٹلایا۔ اُنہوں نے کہا: \"ہم تجھے اپنے جیسا ایک انسان ہی دیکھتے ہیں\" (قرآن 11:27)، اور اُنہوں نے الزام لگایا کہ وہ کمزوروں اور غریبوں کو ساتھ لے کر آیا ہے۔ وہ نہیں سمجھ سکے کہ ایمان کے لیے نہ امیر ہے نہ غریب — ایمان تو دل کا معاملہ ہے۔",
        },
      ],
      ayahNote: {
        en: "Nuh called his people for 950 years with patience and love — and the Qur'an kept his very words safe so we can still hear them. Never giving up on people is the most beautiful kind of love.",
        ur: "نوح نے 950 سال تک اپنی قوم کو صبر اور محبت سے بلایا — اور قرآن نے ان کے الفاظ محفوظ رکھے تاکہ آج بھی ہم انہیں سن سکیں۔ لوگوں سے کبھی مایوس نہ ہونا سب سے خوبصورت محبت ہے۔",
      },
      sources: [
        { type: "quran", reference: "Qur'an 11:25–26", label: { en: "Nuh warns his people to worship Allah alone and fears a great day of punishment", ur: "نوح اپنی قوم کو صرف اللہ کی عبادت کرنے کی تنبیہ کرتے ہیں اور ایک بڑے دن کے عذاب سے ڈراتے ہیں" }, explanation: { en: "Nuh tells his people that only Allah deserves worship — statues of wood and stone can neither help nor harm anyone.", ur: "نوح اپنی قوم کو بتاتے ہیں کہ عبادت صرف اللہ کی ہے — لکڑی اور پتھر کے بت نہ کسی کو فائدہ پہنچا سکتے ہیں نہ نقصان۔" } },
        { type: "quran", reference: "Qur'an 29:14", label: { en: "Nuh remained among his people for a thousand years minus fifty", ur: "نوح اپنی قوم میں ایک ہزار سال کم پچاس سال رہے" }, explanation: { en: "Allah counted the years of Nuh's calling: 950 long years of patience, morning and evening, in secret and in public.", ur: "اللہ نے نوح کی دعوت کا شمار رکھا: 950 لمبے سال صبر کے، صبح و شام، چھپ کر اور کھلے عام۔" } },
        { type: "quran", reference: "Qur'an 71:2–4", label: { en: "Nuh calls his people to worship Allah, fear Him and obey him", ur: "نوح اپنی قوم کو اللہ کی عبادت، تقویٰ اور اطاعت کی دعوت دیتے ہیں" }, explanation: { en: "Here Nuh promises his people the sweetest thing: if they believe and obey, Allah will forgive their sins and give them more time.", ur: "یہاں نوح اپنی قوم کو سب سے پیاری بات کا وعدہ دیتے ہیں: اگر وہ ایمان لائیں اور اطاعت کریں تو اللہ ان کے گناہ معاف کر دے گا اور انہیں مزید مہلت دے گا۔" } },
        { type: "quran", reference: "Qur'an 11:27", label: { en: "The leaders reject Nuh, saying he is only a man like them", ur: "سردار نوح کو جھٹلاتے ہیں کہ تم تو ہم جیسے ایک انسان ہو" }, explanation: { en: "The rich leaders mocked Nuh because the poor and weak believed him. But faith lives in the heart, not in money or power.", ur: "امیر سرداروں نے نوح کا مذاق اڑایا کیونکہ غریب اور کمزور لوگ ان پر ایمان لائے تھے۔ لیکن ایمان دل میں ہوتا ہے، مال یا طاقت میں نہیں۔" } },
      ],
    },
    {
      id: "the-ark-command",
      title: { en: "Build the Ark", ur: "کشتی بنانے کا حکم" },
      paragraphs: [
        {
          en: "After centuries of patient calling, Allah revealed to Nuh: \"None of your people will believe except those who have already believed. So do not be grieved by what they have been doing\" (Qur'an 11:36). And then came the great command: build a ship under Allah's care and guidance (Qur'an 11:37–38).",
          ur: "صدیوں کے صبر کے بعد اللہ نے نوح پر وحی بھیجی: \"تمہاری قوم میں سے جو ایمان لا چکے ہیں اُن کے سوا کوئی ایمان نہ لائے گا۔ پس اُس پر غم نہ کھاؤ جو وہ کر رہے ہیں\" (قرآن 11:36)۔ اور پھر عظیم حکم آیا: اللہ کی نگرانی اور رہنمائی میں ایک کشتی بناؤ (قرآن 11:37–38)۔",
        },
        {
          en: "So Nuh began to build the ark — a huge ship on dry land, far from any sea. His people walked past and laughed: \"Are you building a ship here?\" they joked. But Nuh answered them with calm and kept on working (Qur'an 11:38–39).",
          ur: "چنانچہ نوح نے کشتی بنانا شروع کر دی — خشک زمین پر ایک بہت بڑی کشتی، کسی سمندر سے دور۔ اُس کی قوم وہاں سے گزرتی اور ہنستی: \"یہاں کشتی بنا رہے ہو؟\" وہ مذاق اڑاتے۔ لیکن نوح اُنہیں سکون سے جواب دیتے اور کام جاری رکھتے (قرآن 11:38–39)۔",
        },
        {
          en: "The mockers did not know that the believers who laugh last are the ones who trust Allah. The ark grew plank by plank, while Nuh's heart stayed firm. He was preparing the way of safety for those who would believe.",
          ur: "مذاق اڑانے والے نہیں جانتے تھے کہ جو اللہ پر بھروسہ کرتے ہیں وہی آخر میں ہنستے ہیں۔ کشتی تختہ بہ تختہ بڑھتی گئی، جب کہ نوح کا دل مضبوط رہا۔ وہ ایمان لانے والوں کے لیے نجات کا راستہ تیار کر رہے تھے۔",
        },
      ],
      ayahNote: {
        en: "Allah told Nuh to build a huge ship on dry land — far from any sea — and not to grieve over those who refused to believe. Building the ark meant trusting Allah before anything had happened.",
        ur: "اللہ نے نوح کو حکم دیا کہ خشک زمین پر ایک بڑی کشتی بنائیں — کسی سمندر سے دور — اور انکار کرنے والوں پر غم نہ کھائیں۔ کشتی بنانے کا مطلب تھا ایسی چیز پر بھروسہ رکھنا جو ابھی نظر نہیں آتی۔",
      },
      sources: [
        { type: "quran", reference: "Qur'an 11:36–38", label: { en: "Allah commands Nuh to build the ship under His care and not to grieve over the disbelievers", ur: "اللہ نوح کو حکم دیتے ہیں کہ اپنی نگرانی میں کشتی بنائیں اور کافروں پر غم نہ کریں" }, explanation: { en: "Allah told Nuh that no one else would believe, and commanded him to build the ark under His care and guidance — no sea was needed, only obedience.", ur: "اللہ نے نوح کو بتایا کہ کوئی اور ایمان نہیں لائے گا، اور انہیں اپنی نگرانی میں کشتی بنانے کا حکم دیا — سمندر کی ضرورت نہیں تھی، صرف اطاعت کی۔" } },
        { type: "quran", reference: "Qur'an 11:38–39", label: { en: "The people mock Nuh as he builds the ship on dry land", ur: "لوگ خشک زمین پر کشتی بناتے دیکھ کر نوح کا مذاق اڑاتے ہیں" }, explanation: { en: "The people laughed at Nuh building a ship on land, far from water. This verse promises that the mockers will soon see whose end is safe.", ur: "لوگ پانی سے دور خشک زمین پر کشتی بناتے دیکھ کر نوح پر ہنسے۔ یہ آیت وعدہ کرتی ہے کہ مذاق اڑانے والے جلد دیکھ لیں گے کہ انجام کس کا محفوظ ہے۔" } },
      ],
    },
    {
      id: "the-flood-comes",
      title: { en: "The Flood Comes", ur: "طوفان آتا ہے" },
      paragraphs: [
        {
          en: "Then the day of the flood arrived. Allah told Nuh: \"Carry in it two of every kind, along with your family — except those already doomed — and those who have believed\" (Qur'an 11:40). So the believers came aboard, a small group of the faithful, and with them the animals, two by two.",
          ur: "پھر طوفان کا دن آ گیا۔ اللہ نے نوح سے کہا: \"اُس میں ہر قسم کے دو دو جانور لادو، اور اپنے گھر والوں کو — سوائے اُن کے جن کا حکم پہلے آ چکا ہے — اور اُن کو جو ایمان لا چکے ہیں\" (قرآن 11:40)۔ چنانچہ مومن سوار ہوئے، ایمان والوں کا ایک چھوٹا سا گروہ، اور اُن کے ساتھ جانور بھی دو دو۔",
        },
        {
          en: "When everyone was safe inside, the skies opened with heavy rain and the earth burst forth with springs. The Qur'an says: \"And the flood-water carried them, while they were in a ship under Our eyes\" (Qur'an 54:13–14). The waters rose and rose until they covered everything.",
          ur: "جب سب محفوظ اندر تھے تو آسمان موسلادھار بارش کے ساتھ کھل گیا اور زمین سے چشمے پھوٹ پڑے۔ قرآن کہتا ہے: \"اور طوفان اُنہیں لے کر چلا، جب کہ وہ ہماری آنکھوں کے سامنے ایک کشتی میں تھے\" (قرآن 54:13–14)۔ پانی چڑھتا گیا اور چڑھتا گیا یہاں تک کہ سب کچھ ڈوب گیا۔",
        },
        {
          en: "Nuh had called his son before the flood and begged him to come aboard. But the son refused and said he would climb a mountain to escape. Nuh called out: \"There is no protector today from the decree of Allah\" (Qur'an 11:43) — and the wave came between them, and the son drowned.",
          ur: "نوح نے طوفان سے پہلے اپنے بیٹے کو بلایا تھا اور کشتی پر چڑھنے کی التجا کی تھی۔ لیکن بیٹے نے انکار کیا اور کہا کہ وہ پہاڑ پر چڑھ کر بچ جائے گا۔ نوح نے پکارا: \"آج اللہ کے حکم سے بچانے والا کوئی نہیں\" (قرآن 11:43) — اور موج اُن کے درمیان آ گئی، اور بیٹا ڈوب گیا۔",
        },
        {
          en: "Then Nuh called to his Lord with the softest heart: \"My Lord, indeed my son is of my family\" (Qur'an 11:45). And Allah taught him a gentle truth: \"O Nuh, indeed he is not of your family. Indeed, he is of unrighteous conduct. So ask not of Me that of which you have no knowledge\" (Qur'an 11:46).",
          ur: "پھر نوح نے نرم دل سے اپنے رب کو پکارا: \"اے میرے رب! بیشک میرا بیٹا میرے گھرانے میں سے ہے\" (قرآن 11:45)۔ اور اللہ نے اُسے ایک نرم حقیقت سکھائی: \"اے نوح! وہ تیرے گھرانے میں سے نہیں۔ وہ تو ناپاک عمل ہے۔ پس مجھ سے اُس چیز کا سوال نہ کر جس کا تجھے علم نہیں\" (قرآن 11:46)۔",
        },
      ],
      ayahNote: {
        en: "The flood drowned everything except the ark and its people. Even Nuh's own son was lost, because what saves a person is not family or a mountain — it is faith in Allah.",
        ur: "طوفان نے کشتی اور اس کے سواروں کے سوا سب کچھ ڈبو دیا۔ نوح کا اپنا بیٹا بھی نہ بچا، کیونکہ انسان کو گھرانہ یا پہاڑ نہیں بچاتا — صرف اللہ پر ایمان بچاتا ہے۔",
      },
      sources: [
        { type: "quran", reference: "Qur'an 11:40", label: { en: "Allah commands Nuh to carry a pair of every kind and the believers into the ship", ur: "اللہ نوح کو حکم دیتے ہیں کہ ہر قسم کے دو دو جانور اور مومنین کو کشتی میں لے جائیں" }, explanation: { en: "Allah told Nuh exactly what to carry in the ark: the believers, two of every kind of animal, and his family — except those who had already rejected the truth.", ur: "اللہ نے نوح کو بتایا کہ کشتی میں کیا رکھنا ہے: مومن، ہر قسم کے دو دو جانور، اور گھر والے — سوائے ان کے جنہوں نے حق کو ٹھکرا دیا تھا۔" } },
        { type: "quran", reference: "Qur'an 54:13–14", label: { en: "The believers sail in the ship under Allah's care through the flood", ur: "مومن اللہ کی حفاظت میں طوفان کے درمیان کشتی پر سوار ہیں" }, explanation: { en: "The believers sailed through the storm while Allah watched over them. A ship under Allah's care is safer than any mountain.", ur: "مومن طوفان کے درمیان سفر کر رہے تھے جب اللہ انہیں دیکھ رہا تھا۔ اللہ کی حفاظت میں کشتی کسی پہاڑ سے زیادہ محفوظ ہے۔" } },
        { type: "quran", reference: "Qur'an 11:42–43", label: { en: "Nuh's son refuses to board, saying he will climb a mountain; the wave separates them and he drowns", ur: "نوح کا بیٹا کشتی پر چڑھنے سے انکار کرتا ہے؛ موج اُن کے درمیان حائل ہوتی ہے اور وہ ڈوب جاتا ہے" }, explanation: { en: "Nuh's son trusted the mountain more than Allah, and the mountain could not save him. Things we can see and hold can never take the place of trust in Allah.", ur: "نوح کے بیٹے نے پہاڑ پر اللہ سے زیادہ بھروسہ کیا، اور پہاڑ اسے نہ بچا سکا۔ جو چیزیں ہم دیکھتے اور پکڑتے ہیں وہ اللہ پر بھروسے کی جگہ کبھی نہیں لے سکتیں۔" } },
        { type: "quran", reference: "Qur'an 11:45–46", label: { en: "Nuh prays for his son and Allah tells him the son is not of his family because of his conduct", ur: "نوح اپنے بیٹے کے لیے دعا کرتے ہیں اور اللہ فرماتے ہیں کہ وہ ناپاک عمل کی وجہ سے تیرے گھرانے میں سے نہیں" }, explanation: { en: "Nuh begged Allah for his son, and Allah gently taught him: a family is not made by blood alone, but by faith and good conduct.", ur: "نوح نے اپنے بیٹے کے لیے اللہ سے التجا کی، اور اللہ نے نرمی سے سکھایا: گھرانہ صرف خون کا رشتہ نہیں ہوتا، ایمان اور نیک عمل سے بنتا ہے۔" } },
      ],
    },
    {
      id: "the-landing",
      title: { en: "The Ark Rests on the Mountain", ur: "کشتی پہاڑ پر رکتی ہے" },
      paragraphs: [
        {
          en: "At last the flood began to calm. The Qur'an says: \"It was said: O earth, swallow your water, and O sky, cease. And the water subsided, and the matter was concluded, and the ship settled upon al-Judi\" (Qur'an 11:44). The believers looked out and saw land again.",
          ur: "آخر کار طوفان پرسکون ہونے لگا۔ قرآن کہتا ہے: \"کہا گیا: اے زمین! اپنا پانی نگل لے، اور اے آسمان! تھم جا۔ اور پانی کم ہو گیا، اور معاملہ طے کر دیا گیا، اور کشتی جودی پہاڑ پر ٹھہر گئی\" (قرآن 11:44)۔ مومنین نے باہر دیکھا اور پھر سے زمین نظر آئی۔",
        },
        {
          en: "Nuh and the believers stepped out onto the blessed ground, grateful and safe. The Qur'an records Nuh's prayer: \"My Lord, let me land at a blessed landing place, and You are the best of those who bring to land\" (Qur'an 23:29).",
          ur: "نوح اور مومن شکر گزار اور محفوظ ہو کر برکت والی زمین پر اترے۔ قرآن نوح کی دعا درج کرتا ہے: \"اے میرے رب! مجھے بابرکت جگہ اترنے دے، اور تو سب سے بہتر اتارنے والا ہے\" (قرآن 23:29)۔",
        },
        {
          en: "From that day, the family of Nuh began the human family again. Allah says: \"We saved him and his family from the great distress, and We made his descendants those who remain\" (Qur'an 37:75–77).",
          ur: "اُس دن سے نوح کا خاندان دوبارہ سے انسانی خاندان کی شروعات بنا۔ اللہ فرماتا ہے: \"ہم نے اُسے اور اُس کے گھر والوں کو بڑی تکلیف سے بچایا، اور اُس کی اولاد کو باقی رہنے والا بنایا\" (قرآن 37:75–77)۔",
        },
        {
          en: "The ark stayed as a sign, so that the children of the world would remember: when the flood comes, the ship of trust in Allah sails. Nuh's story shows us that Allah never leaves His believers without a way of escape.",
          ur: "کشتی ایک نشانی کے طور پر رہ گئی، تاکہ دنیا کے بچے یاد رکھیں: جب طوفان آئے تو اللہ پر بھروسے کی کشتی سفر کرتی ہے۔ نوح کی کہانی ہمیں دکھاتی ہے کہ اللہ اپنے مومنین کو کبھی نجات کے بغیر نہیں چھوڑتا۔",
        },
      ],
      ayahNote: {
        en: "With a single command Allah ended the flood: \"O earth, swallow your water, and O sky, cease\" (Qur'an 11:44). The One who sends the storm can stop it in one moment, and the believers stepped out safe on the mountain.",
        ur: "ایک ہی حکم سے اللہ نے طوفان ختم کر دیا: \"اے زمین! اپنا پانی نگل لے، اور اے آسمان! تھم جا\" (قرآن 11:44)۔ جو طوفان بھیجتا ہے وہ ایک ہی لمحے میں اسے روک سکتا ہے، اور مومن پہاڑ پر محفوظ اترے۔",
      },
      sources: [
        { type: "quran", reference: "Qur'an 11:44", label: { en: "The earth swallows the water, the sky stops, and the ship settles on al-Judi", ur: "زمین پانی نگل لیتی ہے، آسمان تھم جاتا ہے، اور کشتی جودی پر ٹھہر جاتی ہے" }, explanation: { en: "Allah commanded the earth to drink the water and the sky to stop raining, and the ark rested safely on the mountain of Judi. Everything in nature obeys Allah's word.", ur: "اللہ نے زمین کو پانی نگلنے اور آسمان کو بارش روکنے کا حکم دیا، اور کشتی جودی پہاڑ پر محفوظ ٹھہر گئی۔ کائنات کی ہر چیز اللہ کے حکم پر چلتی ہے۔" } },
        { type: "quran", reference: "Qur'an 23:29", label: { en: "Nuh prays for a blessed landing place", ur: "نوح برکت والی جگہ اترنے کی دعا کرتے ہیں" }, explanation: { en: "Nuh's first prayer on the shore: 'My Lord, let me land at a blessed landing place.' Thanking Allah for every safe landing is what believers do.", ur: "ساحل پر نوح کی پہلی دعا: 'اے میرے رب! مجھے بابرکت جگہ اترنے دے۔' ہر محفوظ اترنے پر اللہ کا شکر کرنا ہی مومن کا کام ہے۔" } },
        { type: "quran", reference: "Qur'an 37:75–77", label: { en: "Allah saves Nuh and his family and makes his descendants the survivors", ur: "اللہ نوح اور اُن کے گھر والوں کو بچاتا ہے اور اُن کی اولاد کو باقی رکھتا ہے" }, explanation: { en: "Allah saved Nuh and his family from the great distress, and from his descendants the human family began again on the earth.", ur: "اللہ نے نوح اور ان کے گھر والوں کو بڑی تکلیف سے بچایا، اور انہی کی اولاد سے زمین پر انسانی خاندان پھر سے شروع ہوا۔" } },
      ],
    },
    {
      id: "the-lesson",
      title: { en: "The Lesson of the Ark", ur: "کشتی کا سبق" },
      paragraphs: [
        {
          en: "Nuh is one of the greatest examples of patience in the whole Qur'an. For 950 years he never stopped calling, never stopped hoping, never stopped loving his people even when they mocked him.",
          ur: "نوح پورے قرآن میں صبر کی سب سے بڑی مثالوں میں سے ایک ہیں۔ 950 سال تک اُنہوں نے دعوت نہیں چھوڑی، امید نہیں چھوڑی، اور اپنی قوم سے محبت نہیں چھوڑی، چاہے وہ اُن کا مذاق ہی اڑاتی رہی۔",
        },
        {
          en: "The flood was not the end of Nuh's story — it was the beginning of a new one. Allah honored Nuh among the prophets with the best of praises: \"Peace be upon Nuh among the worlds. Indeed, We thus reward the doers of good\" (Qur'an 37:79–80).",
          ur: "طوفان نوح کی کہانی کا خاتمہ نہیں تھا — یہ ایک نئی کہانی کی شروعات تھی۔ اللہ نے نوح کو جہانوں میں سلام سے نوازا: \"نوح پر سلام ہو تمام جہانوں میں۔ بیشک ہم نیکی کرنے والوں کو ایسا ہی بدلہ دیتے ہیں\" (قرآن 37:79–80)۔",
        },
        {
          en: "Every child who reads Nuh's story can learn the most beautiful lesson: keep doing what is right, even if nobody listens. And when trouble comes like a flood, put your trust in Allah — He will always make a way.",
          ur: "نوح کی کہانی پڑھنے والا ہر بچہ سب سے خوبصورت سبق سیکھ سکتا ہے: نیک کام کرتے رہو، چاہے کوئی سنے نہ سنے۔ اور جب مصیبت طوفان کی طرح آئے تو اللہ پر بھروسہ کرو — وہ ہمیشہ راستہ نکال دیتا ہے۔",
        },
      ],
      ayahNote: {
        en: "The Qur'an ends Nuh's story with the most beautiful honor: \"Peace be upon Nuh among the worlds\" (Qur'an 37:79). After 950 years of patience, Allah gave him peace in every time and every place.",
        ur: "قرآن نوح کی کہانی سب سے خوبصورت اعزاز کے ساتھ ختم کرتا ہے: \"نوح پر سلام ہو تمام جہانوں میں\" (قرآن 37:79)۔ 950 سال کے صبر کے بعد اللہ نے انہیں ہر زمانے اور ہر جگہ کی سلامتی عطا کی۔",
      },
      sources: [
        { type: "quran", reference: "Qur'an 37:79–80", label: { en: "Allah sends peace upon Nuh among the worlds and rewards the doers of good", ur: "اللہ نوح پر جہانوں میں سلام بھیجتا ہے اور نیکی کرنے والوں کو بدلہ دیتا ہے" }, explanation: { en: "This verse is like a crown for Nuh: peace from Allah, everywhere and forever. It shows how Allah rewards those who do good with patience.", ur: "یہ آیت نوح کے لیے تاج کی مانند ہے: اللہ کی طرف سے ہر جگہ اور ہمیشہ کے لیے سلامتی۔ یہ دکھاتی ہے کہ اللہ صبر کے ساتھ نیکی کرنے والوں کو کیسا بدلہ دیتا ہے۔" } },
      ],
    },
  ],
};
