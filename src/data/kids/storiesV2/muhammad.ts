import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Muhammad (SAW) — KidsStoryV2 (chapter-based) implementation.
 *
 * The final messenger of Allah, the beloved of the worlds. From the Makkah
 * before Islam, the orphan boy, the trustworthy merchant, the first
 * revelation, the years of hurt, the night journey, the two pledges of
 * Aqabah and the hijrah, to the battles, the treaty of peace, the letters to
 * the kings, the conquest, the farewell pilgrimage, the last days and the
 * mercy to all the worlds.
 * Anchored to the true verses: Al-Fil (105:1-5), Quraysh (106:1-4),
 * Ad-Duha (93:6-7), An-Nisa (4:58), Al-Alaq (96:1-5), Ash-Shu'ara (26:214),
 * Al-A'raf (7:199), Ash-Sharh (94:1-8), Al-Isra (17:1), An-Najm (53:13-18),
 * Muhammad (47:7), At-Tawbah (9:40), Al-Anfal (8:74), Al-Hashr (59:9),
 * Aal-Imran (3:123, 3:124-125, 3:139, 3:152, 3:144), Al-Ahzab (33:9-11),
 * Al-Fath (48:1-3), Aal-Imran (3:64), An-Nasr (110:1-3), Al-Ma'idah (5:3),
 * Al-Anbiya (21:107), Al-Ahzab (33:40) and Al-Qalam (68:4).
 * Fully bilingual (English + Urdu) per the bilingual standard.
 */
export const STORY_MUHAMMAD: KidsStoryV2 = {
  id: "muhammad",
  type: "prophet",
  nameArabic: "محمد",
  nameEnglish: "Muhammad",
  illustrationSymbol: "Scroll",
  accentColor: "#2e8b57",
  summary: {
    en: "Muhammad grew up an orphan in Makkah, known as the truthful and the trustworthy. At forty, Allah chose him as the final prophet, and the angel Jibreel brought him the Qur'an. He called people to worship Allah alone with patience and gentleness, faced the hardest trials with mercy, and Allah honored him as a mercy to all the worlds.",
    ur: "محمد صلی اللہ علیہ وسلم مکہ میں یتیم بڑے ہوئے، اور صادق اور امین کہلاتے تھے۔ چالیس سال کی عمر میں اللہ نے انہیں آخری نبی بنایا، اور فرشتہ جبرائیل ان کے پاس قرآن لائے۔ انہوں نے لوگوں کو صبر اور محبت کے ساتھ صرف اللہ کی عبادت کی دعوت دی، سب سے سخت مصیبتیں رحمت سے برداشت کیں، اور اللہ نے انہیں تمام جہانوں کے لیے رحمت بنا کر بھیجا۔",
  },
  chapters: [
    {
      id: "mekka-before",
      title: { en: "Makkah Before Islam", ur: "اسلام سے پہلے مکہ" },
      paragraphs: [
        {
          en: "Long before Muhammad was born, the city of Makkah stood in a dry valley in the middle of Arabia. Around its heart stood the Kaaba, the first house ever built for the worship of Allah. Pilgrims came from many lands to visit it, and the people of Makkah honored it greatly.",
          ur: "محمد کی پیدائش سے پہلے مکہ شہر عرب کے بیچ میں ایک خشک وادی میں آباد تھا۔ اس کے مرکز میں کعبہ کھڑا تھا جو اللہ کی عبادت کے لیے بنایا گیا پہلا گھر تھا۔ دور دور سے لوگ اس کی زیارت کے لیے آتے تھے۔",
        },
        {
          en: "But the people had slowly forgotten the message of Ibrahim, the prophet who built the Kaaba. Around the sacred house they placed icons made of stone and wood, and they stood before these icons asking for what only Allah could give. Their faith had become mixed with carved statues.",
          ur: "لیکن لوگ آہستہ آہستہ ابراہیم کے پیغام کو بھول گئے جنہوں نے کعبہ بنایا تھا۔ انہوں نے کعبہ کے ارد گرد پتھر اور لکڑی کے بنائے بت رکھ دیے، اور ان بتوں کے آگے وہ چیزیں مانگتے تھے جو صرف اللہ دیتا ہے۔",
        },
        {
          en: "Then one year an event shook the whole city. A great army came from Yemen with huge elephants, and it had come to destroy the Kaaba. The people of Makkah could not fight, so they climbed the hills and asked Allah to protect His own sacred house.",
          ur: "ایک سال پورا شہر ہل گیا۔ یمن سے ایک بڑی فوج بڑے ہاتھیوں کے ساتھ آئی اور کعبہ ڈھانے کے لیے آئی تھی۔ مکہ کے لوگ اس کے ساتھ لڑ نہیں سکتے تھے۔ وہ پہاڑیوں پر چڑھ گئے اور اللہ سے کہنے لگے کہ اپنا گھر محفوظ رکھ۔",
        },
        {
          en: "Allah answered them in a wonderful way: \"Have you not seen how your Lord dealt with the army of the elephant?\" (Qur'an 105:1). He sent flocks of birds carrying small stones, and the proud army was scattered. The Kaaba stayed safe.",
          ur: "اللہ نے خوبصورت انداز میں جواب دیا: \"کیا تم نے نہیں دیکھا کہ اللہ نے ہاتھیوں کے لشکر کو کیا نہیں؟\" (قرآن ۱۰۵:۱)۔ اللہ نے پرندوں کے جھنڈ بھیجو جو چھوٹے پتھر لے کر آئے، اور لشکر بھاگنے لگا۔ کعبہ محفوظ رہا۔",
        },
        {
          en: "Into this very city, the city of the sacred house, the final messenger was about to be born. Allah had kept the Quraysh safe and made their trade easy for the home of His house (Qur'an 106:1–4). Makkah was waiting for its greatest child.",
          ur: "اسی شہر میں جہاں یہ مقدس گھر ہے، آخری رسول کی پیدائش ہونی تھی۔ اللہ نے قریش کو حفاظت دی اور ان کی تجارت آسان کی (قرآن ۱۰۶:۱–۴)۔ مکہ اپنے سب سے عظیم بچے کا انتظار کر رہا تھا۔",
        },
      ],
      ayahNote: {
        en: "Surah Al-Fil tells how little birds stopped a great army, and Surah Quraysh tells how the Kaaba brought peace. Both are a promise: whoever trusts Allah is never lost.",
        ur: "سورہ الفیل بتاتی ہے کہ چھوٹے پرندوں نے بڑی فوج کو کس طرح روکا، اور سورہ قریش بتاتی ہے کہ کعبہ کی برکت سے امن ملا۔ دونوں سورتیں وعدہ ہیں۔ جو اللہ پر بھروسہ کرتا ہے وہ کبھی خسارا نہیں اٹھاتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 105:1",
          label: { en: "Allah turned back the army of the elephant and protected the Kaaba", ur: "اللہ نے ہاتھیوں والوں کو شکست دی اور کعبہ کی حفاظت کی" },
          explanation: {
            en: "The small birds carried Allah's power. However strong the army, Allah is stronger, and He protects what He loves.",
            ur: "چھوٹے پرندوں سے اللہ کی قدرت ظاہر ہوئی۔ لشکر چاہے کتنا ہی بڑا ہو، اللہ اس سے زیادہ قوی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 106:1–4",
          label: { en: "Allah gave the Quraysh peace and food through His sacred house", ur: "اللہ نے قریش کو اپنے گھر کے سبب امن اور روزی دی" },
          explanation: {
            en: "The Quraysh were the Prophet's own tribe; their peace and trade were mercy preparing the way for Islam.",
            ur: "قریش نبی کا اپنا قبیلہ تھا، ان کا امن بعد میں اسلام کے آنے کی تیاری تھی۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham; Ibn Kathir, Al-Bidayah wan-Nihayah) — the Year of the Elephant",
          needsVerification: true,
          label: {
            en: "The Seerah books recorded the year of the elephant army that came against the Kaaba",
            ur: "سیرت کی کتابوں میں ہاتھیوں والے سال کا ذکر ہے جب ایک فوج کعبہ ڈھانے آئی",
          },
        },
      ],
    },
  {
      id: "the-call",
      title: { en: "The Call Begins", ur: "دعوت کا آغاز" },
      paragraphs: [
        {
          en: "The Prophet began to call his family first, with the softest words. His wife Khadijah, his friend Abu Bakr, his young cousin Ali, and his servant Zayd, they all believed at once. Then the Prophet opened his door to everyone who would listen.",
          ur: "نبی نے سب سے پہلے اپنے گھر والوں کو نرم الفاظ میں دعوت دی۔ ان کی بیوی خدیجہ، ان کے دوست ابو بکر، ان کے چھوٹے چچا زاد علی، اور ان کا خادم زید، سب نے فوراً ایمان لایا۔ پھر نبی نے اپنا دروازہ ہر سننے والے کے لیے کھول دیا۔",
        },
        {
          en: "Then Allah commanded him: \"And warn your nearest relatives\" (Qur'an 26:214). So the Prophet stood on the hill of Safa and called out loudly to the people of Makkah. He asked them: \"If I told you an army was coming from behind this hill, would you believe me?\" They all said yes, because he was the truthful one.",
          ur: "پھر اللہ نے حکم دیا: \"اور اپنے قریب ترین رشتہ داروں کو خبردار کرو\" (قرآن ۲۶:۲۱۴)۔ چنانچہ نبی پہاڑی صفا پر کھڑے ہوئے اور مکہ کے لوگوں کو آواز دی۔ انہوں نے پوچھا: \"اگر میں کہوں کہ اس پہاڑی کے پیچھے سے ایک لشکر آرہا ہے تو کیا تم مانو گے؟\" سب نے کہا: ہاں، کیونکہ وہ صادق تھے۔",
        },
        {
          en: "Then the Prophet said: \"I am a warner to you before a great punishment. There is no god but Allah.\" His uncle Abu Lahab shouted angrily, but others listened with wonder. Slowly, like a small light growing in the dark, the call of Allah spread.",
          ur: "پھر نبی نے فرمایا: \"میں تمہیں بڑے عذاب سے پہلے خبردار کرنے والا ہوں۔ اللہ کے سوا کوئی معبود نہیں۔\" ان کے چچا ابو لہب نے غصے سے چلایا، لیکن کچھ لوگ حیرت سے سنتے رہے۔ آہستہ آہستہ اللہ کی دعوت پھیلتی گئی۔",
        },
        {
          en: "The Prophet never forced anyone. He only spoke the truth with patience, and let the truth speak for itself. Those who listened with an honest heart found the light, and the first believers became the first bricks of the most beautiful building in history, the ummah.",
          ur: "نبی نے کبھی کسی پر زور نہیں ڈالا۔ وہ صبر سے سچ کہتے رہے، اور سچ کو خود بولنے دیا۔ جنہوں نے کھلے دل سے سنا انہوں نے نور پایا، اور پہلے مومن امتِ مسلمہ کی پہلی اینٹیں بنے۔",
        },
      ],
      ayahNote: {
        en: "The Prophet began with his own family before inviting strangers. Loving your family means telling them the truth first, with the softest voice.",
        ur: "نبی نے اجنبیوں سے پہلے اپنے گھر والوں کو دعوت دی۔ گھر والوں سے محبت کا مطلب ہے کہ نرمی سے۔ انہیں سچ سب سے پہلے سنایا جائے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 26:214",
          label: { en: "Allah commands the Prophet to call his nearest relatives", ur: "اللہ نبی کو حکم دیتا ہے کہ اپنے قریبی رشتہ داروں کو بلائیں" },
          explanation: {
            en: "The very first door of the call opened on the family. Telling your loved ones the truth first is a sign of deep love.",
            ur: "دعوت کا پہلا دروازہ گھر والوں پر کھلا۔ پہلے پیاروں کو سچ سنانا محبت کی نشانی ہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari — the Prophet's call on the hill of Safa",
          label: { en: "The Prophet gathers the people of Makkah and asks if they would believe him", ur: "نبی مکہ کے لوگوں کو جمع کر کے پوچھتے ہیں کہ کیا وہ ان پر ایمان لائیں گے" },
        },
      ],
    },
    {
      id: "patience-in-hurt",
      title: { en: "Patience in the Days of Hurt", ur: "مصیبت کے دنوں میں صبر" },
      paragraphs: [
        {
          en: "The people of Makkah did not like the new call. They mocked the Prophet, threw dirt on his path, and hurt the weak believers. But the Prophet never answered hurt with hurt. He stayed gentle, like the Qur'an teaches: \"Take what is given with gentleness and turn away from the ignorant\" (Qur'an 7:199).",
          ur: "مکہ کے لوگ نئی دعوت پسند نہیں کرتے تھے۔ وہ نبی کا مذاق اڑاتے، ان کے راستے میں کانٹے ڈالتے، اور کمزور مومنوں کو ستاتے تھے۔ لیکن نبی نے کبھی کسی اذیت کا بدلہ اذیت سے نہیں دیا۔ وہ نرم رہے جیسا قرآن سکھاتا ہے: \"معاف کرو اور جاہلوں سے منہ موڑ لو\" (قرآن ۷:۱۹۹)۔",
        },
        {
          en: "The hardest days came when the enemies of Makkah starved the believers. For two long years the Muslims could not buy food or visit their friends, and they ate the leaves of trees to stay alive. Yet their faith never left them, because their hearts were full of Allah.",
          ur: "سب سے سخت دن تب آئے جب مکہ کے دشمنوں نے مومنوں کو بھوکا رکھا۔ دو سال تک مسلمان کھانا نہیں خرید سکتے تھے اور نہ کسی سے مل سکتے تھے۔ وہ زندہ رہنے کے لیے درختوں کے پتے کھاتے تھے۔ پھر بھی ان کے دل اللہ سے بھرے تھے۔",
        },
        {
          en: "In those years, the Prophet lost the two people who loved him most, his dear uncle Abu Talib and his beloved wife Khadijah. The year became known as the year of sorrow. But even in the deepest grief, the Prophet did not complain; he only prayed more.",
          ur: "انہی سالوں میں نبی نے اپنے دو پیارے لوگ کھوئے، مہربان چچا ابو طالب اور محبوب بیوی خدیجہ۔ وہ سال غم کا سال کہلایا۔ لیکن سب سے بڑے دکھ میں بھی نبی نے شکایت نہیں کی، وہ صرف زیادہ دعا کرتے رہے۔",
        },
        {
          en: "The Prophet once walked all the way to the city of Ta'if to invite its people to Allah, but they refused and threw stones at him until his blessed feet bled. And then the Prophet prayed: \"O Allah, guide my people, for they do not know.\" He did not curse the ones who hurt him; he asked Allah to guide them. That is the mercy of Muhammad.",
          ur: "نبی ایک بار طائف شہر تک پیدل گئے تاکہ وہاں کے لوگوں کو اللہ کی دعوت دیں، لیکن انہوں نے انکار کیا اور نبی پر پتھر پھینکے یہاں تک کہ ان کے بابرکت پاؤں سے خون بہا۔ پھر نبی نے دعا کی: \"اے اللہ، میری قوم کو ہدایت دے، کیونکہ وہ نہیں جانتے۔\" انہوں نے ستانے والوں کو بددعا نہیں دی، انہوں نے ان کے لیے بھلائی مانگی۔ یہی محمد کی رحمت ہے۔",
        },
        {
          en: "The days of hurt taught the believers the deepest secret of faith: patience is a shield, and forgiveness is a sword of mercy. When the world closes every door, Allah opens the doors of the sky for those who trust Him.",
          ur: "مصیبت کے دنوں نے سکھایا: صبر ڈھال ہے، اور معافی رحمت کی تلوار ہے۔ جب بھی دنیا ہر دروازہ بند کر دے، اللہ اس کے لیے آسمانی دروازے کھول دیتا ہے جو اس پر بھروسہ کرتا ہے۔",
        },
      ],
      ayahNote: {
        en: "Two verses comforted the Prophet in these years: \"Take what is given with gentleness and turn from the ignorant\" (7:199) and \"Indeed, with hardship comes ease\" (94:5). The harder the hardship, the closer the ease.",
        ur: "اس عرصے میں دو آیتیں نبی کو تسلی دیتی تھیں: \"معاف کرو اور جاہلوں سے منہ موڑ لو\" (قرآن ۷:۱۹۹) اور \"بیشک مشکل کے ساتھ آسانی ہے\" (قرآن ۹۴:۵)۔ جتنی بڑی مشکل ہوتی ہے، اس کے بعد آنے والی آسانی اتنی ہی قریب ہوتی ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 7:199",
          label: { en: "Allah commands the Prophet to be gentle and to forgive", ur: "اللہ نبی کو حکم دیتا ہے کہ نرمی سے پیش آئیں اور معاف کریں" },
          explanation: {
            en: "When someone is unkind to you, this verse asks you to be the forgiving one. The Prophet prayed for his enemies at Ta'if.",
            ur: "جب کوئی آپ کے ساتھ برا کرے تو یہ آیت آپ کو معاف کرنے کو کہتی ہے۔ نبی نے طائف میں ستانے والوں کے لیے دعا کی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 94:1–8",
          label: { en: "Allah promises that with hardship comes ease", ur: "اللہ وعدہ کرتا ہے کہ مشکل کے ساتھ آسانی آتی ہے" },
          explanation: {
            en: "This surah was sent for the hardest days: after every difficulty, Allah opens a way, and ease always follows hardship.",
            ur: "یہ سورہ مشکل دنوں کے لیے اتری: ہر مشکل کے بعد اللہ راستہ کھولتا ہے، اور آسانی ہمیشہ آتی ہے।",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim — the Prophet's dua for his people at Ta'if",
          needsVerification: true,
          label: { en: "After being hurt at Ta'if, the Prophet prays for his people to be guided", ur: "طائف میں اذیت ملنے کے بعد نبی اپنی قوم کے لیے ہدایت کی دعا کرتے ہیں" },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) — the boycott and the year of sorrow",
          needsVerification: true,
          label: { en: "The Seerah tells of the boycott, of the passing of Khadijah and Abu Talib, and the year of sorrow", ur: "سیرت میں قحط کی بندے، خدیجہ اور ابو طالب کی وفات اور غم کے سال کا ذکر ہے" },
        },
      ],
    },
  {
      id: "orphan-boy",
      title: { en: "The Orphan Boy of Makkah", ur: "مکہ کا یتیم لڑکا" },
      paragraphs: [
        {
          en: "Long ago, in the city of Makkah, a baby boy was born whose father had passed away before he was born. His name was Muhammad, which means \"the praised one.\" His grandfather Abdul-Muttalib loved him dearly and took care of him.",
          ur: "بہت عرصہ پہلے مکہ شہر میں ایک بچہ پیدا ہوا جس کے والد اس کی پیدائش سے پہلے ہی وفات پا چکے تھے۔ اس کا نام محمد تھا جس کا مطلب ہے \"قابلِ تعریف\"۔ اس کے دادا عبدالمطلب اس سے بہت محبت کرتے تھے اور اس کی پرورش کرتے تھے۔",
        },
        {
          en: "Soon his grandfather also passed away, and his kind uncle Abu Talib took him into his home. Muhammad grew up as a gentle boy with a quiet heart, loved by everyone who knew him. He worked as a shepherd, caring for the sheep with mercy.",
          ur: "تھوڑے عرصے بعد اس کے دادا بھی وفات پا گئے، اور اس کے مہربان چچا ابو طالب نے اسے اپنے گھر میں پالا۔ محمد ایک نرم دل اور خاموش لڑکے کے طور پر بڑے ہوئے، اور ہر کوئی ان سے محبت کرتا تھا۔ وہ بکریاں چراتے تھے اور جانوروں کے ساتھ رحم کا سلوک کرتے تھے۔",
        },
        {
          en: "Allah had not forgotten His beloved orphan. Years later, Allah reminded him of those early days with tender words: \"Did He not find you an orphan and give you shelter? And He found you lost and guided you?\" (Qur'an 93:6-7).",
          ur: "اللہ اپنے پیارے یتیم کو نہیں بھولا تھا۔ کئی سال بعد اللہ نے انہیں نرم الفاظ میں وہ پرانے دن یاد دلائے: \"کیا اس نے تجھے یتیم پا کر پناہ نہیں دی؟ اور تجھے بھٹکا ہوا پا کر راہ نہیں دکھائی؟\" (قرآن ۹۳:۶–۷)۔",
        },
        {
          en: "The orphan of Makkah became the greatest man in history, because Allah was with him. His childhood teaches every child that even when life is hard and parents are lost, Allah never leaves the one who trusts in Him.",
          ur: "مکہ کا یتیم تاریخ کا سب سے عظیم انسان بنا، کیونکہ اللہ اس کے ساتھ تھا۔ اس کا بچپن ہر بچے کو سکھاتا ہے کہ زندگی کتنی ہی مشکل ہو، اللہ اسے کبھی نہیں چھوڑتا جو اس پر بھروسہ کرتا ہے۔",
        },
      ],
      ayahNote: {
        en: "Surah Ad-Duha tells children that being an orphan is never a failure. Allah was already the Guardian of young Muhammad, giving him a home and guiding his way.",
        ur: "سورہ الضحیٰ بچوں کو بتاتی ہے کہ یتیم ہونا کبھی نقصان نہیں۔ اللہ نبی کے محافظ تھے اور انہیں راہ دکھاتا رہا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 93:6-7",
          label: { en: "Allah reminds the Prophet that He sheltered him as an orphan and guided him", ur: "اللہ نبی کو یاد دلاتا ہے کہ اس نے یتیم پا کر پناہ دی اور راہ دکھائی" },
          explanation: {
            en: "This ayah is like a warm hug from Allah to every orphan child: \"I found you when you were alone, and I gave you a home and a path.\"",
            ur: "یہ آیت ہر یتیم بچے کے لیے اللہ کی محبت ہے: میں نے تجھے اکیلے پایا اور تجھے گھر دیا اور راستہ دیا۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) - the childhood of the Prophet",
          needsVerification: true,
          label: {
            en: "The Seerah tells of the Prophet's early life as an orphan cared for by his grandfather and uncle",
            ur: "سیرت میں نبی کے بچپن کا ذکر ہے جو یتیم تھے اور دادا و چچا نے پرورش کی",
          },
        },
      ],
    },
    {
      id: "the-trustworthy",
      title: { en: "The Truthful and the Trustworthy", ur: "صادق اور امین" },
      paragraphs: [
        {
          en: "Muhammad grew up to be an honest merchant. His words were always true, and his hands were always honest. The people of Makkah gave him two beautiful titles: as-Sadiq, \"the truthful,\" and al-Amin, \"the trustworthy.\"",
          ur: "محمد بڑے ہو کر ایک ایماندار تاجر بنے۔ ان کی بات ہمیشہ سچی ہوتی تھی اور ان کے ہاتھ ہمیشہ صاف رہتے تھے۔ مکہ کے لوگوں نے انہیں دو پیارے لقب دیے: صادق یعنی \"سچا\"، اور امین یعنی \"امانت دار\"۔",
        },
        {
          en: "People would leave their money and their precious things with Muhammad when they traveled, because they knew he would return everything safely. He returned every single thing, and nobody was ever deceived by him.",
          ur: "لوگ سفر پر جاتے وقت اپنے مال اور قیمتی چیزیں محمد کے پاس رکھ جاتے تھے، کیونکہ وہ جانتے تھے کہ وہ سب کچھ محفوظ واپس کر دیں گے۔ وہ ہر چیز واپس کرتے تھے، اور ان سے کبھی کسی کو دھوکا نہیں ہوا۔",
        },
        {
          en: "One day, the tribes of Makkah disagreed about who would place the sacred Black Stone in the Kaaba, and they almost fought. Then someone said: \"Let the first man to enter the gate decide.\" That man was Muhammad, and with his wise hands he placed the stone on a cloth and asked every tribe to carry it together, so that everyone was happy.",
          ur: "ایک دن مکہ کے قبیلوں میں جھگڑا ہوا کہ خانہ کعبہ میں حجر اسود کون رکھے گا، اور وہ لڑنے ہی والے تھے۔ تب کسی نے کہا: \"جو پہلا شخص اس دروازے سے داخل ہو وہی فیصلہ کرے۔\" وہ شخص محمد تھے، اور انہوں نے دانشمندی سے پتھر کو کپڑے پر رکھا اور ہر قبیلے سے ایک کونا پکڑوایا تاکہ سب خوش رہیں۔",
        },
        {
          en: "Long before the Qur'an came, the people already trusted Muhammad with everything they had. When Allah chose him as a prophet, the first words from the people's hearts were: \"We never knew you to lie.\" Honesty had prepared the way for the truth.",
          ur: "قرآن آنے سے بہت پہلے لوگ محمد پر اپنی ہر چیز کا بھروسہ کرتے تھے۔ جب اللہ نے انہیں نبی بنایا تو لوگوں کے دل سے سب سے پہلے یہی الفاظ نکلے: \"ہم نے تمہیں کبھی جھوٹا نہیں جانا۔\" سچائی نے حق کے لیے راستہ تیار کر دیا تھا۔",
        },
      ],
      ayahNote: {
        en: "Later Allah made it a rule for everyone: return trusts to their people (Qur'an 4:58). The Prophet kept this rule even before it was revealed, and that is why everyone trusted him.",
        ur: "بعد میں اللہ نے حکم دیا کہ امانتیں ان کے مالکوں کو واپس کرو (قرآن ۴:۵۸)۔ نبی اس حکم سے پہلے ہی اس پر عمل کرتے تھے، اس لیے سب ان پر بھروسہ کرتے تھے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 4:58",
          label: { en: "Allah commands the believers to return every trust to its owner", ur: "اللہ مومنین کو حکم دیتا ہے کہ ہر امانت اس کے مالک کو واپس کریں" },
          explanation: {
            en: "When you keep your promise and return what is not yours, you are following this verse. A trust can be a toy, a secret, or a word.",
            ur: "جب آپ وعدہ نبھاتے ہیں اور جو چیز آپ کی نہیں اسے واپس کرتے ہیں تو آپ اس آیت پر چلتے ہیں۔ امانت کھلونا بھی ہو سکتی ہے، راز بھی، وعدہ بھی۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) - the titles as-Sadiq and al-Amin",
          needsVerification: true,
          label: { en: "The people of Makkah called Muhammad as-Sadiq and al-Amin for his honesty", ur: "مکہ کے لوگ محمد کو سچائی اور امانت کی وجہ سے صادق اور امین کہتے تھے" },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim - the placing of the Black Stone",
          needsVerification: true,
          label: { en: "The Prophet wisely settled the disagreement over placing the Black Stone", ur: "نبی حجر اسود رکھنے کے جھگڑے کو دانشمندی سے حل کرتے ہیں" },
        },
      ],
    },
    {
      id: "first-revelation",
      title: { en: "The First Words from Allah", ur: "اللہ کے پہلے الفاظ" },
      paragraphs: [
        {
          en: "As Muhammad grew older, he loved to be alone and think about the One who made the skies and the earth. He would walk to a quiet cave on Mount Hira, far above the city, and sit there thinking and remembering Allah.",
          ur: "جب محمد کی عمر بڑھی تو وہ اکیلے رہنا پسند کرتے تھے، اور آسمان و زمین بنانے والے کے بارے میں سوچتے تھے۔ وہ شہر سے اوپر پہاڑ حرا کی ایک خاموش غار میں جاتے، اور وہاں بیٹھ کر سوچتے اور اللہ کو یاد کرتے تھے۔",
        },
        {
          en: "In the year he turned forty, in the month of Ramadan, something wonderful happened in that cave. The angel Jibreel came to him with the first words of the Qur'an: \"Read in the name of your Lord who created\" (Qur'an 96:1).",
          ur: "چالیس سال کی عمر میں، ماہ رمضان میں، اس غار میں ایک حیرت انگیز واقعہ ہوا۔ فرشتہ جبرائیل ان کے پاس قرآن کا پہلا کلام لے کر آئے: \"پڑھ اپنے رب کے نام سے جس نے پیدا کیا\" (قرآن ۹۶:۱)۔",
        },
        {
          en: "Muhammad was amazed and afraid. He hurried home to his dear wife Khadijah, trembling: \"Cover me, cover me!\" She wrapped him warmly and said the most beautiful words: \"Allah will never disgrace you — you keep family ties, you speak the truth, you help the needy.\"",
          ur: "محمد حیران اور ڈرے ہوئے تھے۔ وہ جلدی سے گھر آئے اپنی پیاری بیوی خدیجہ کے پاس، کانپتے ہوئے: \"مجھے ڈھانپ دو، مجھے ڈھانپ دو!\" انہوں نے انہیں گرمجوشی سے ڈھانپ لیا اور سب سے پیارے الفاظ کہے: \"اللہ تمہیں کبھی رسوا نہیں کرے گا — تم رشتے جوڑتے ہو، سچ بولتے ہو، محتاجوں کی مدد کرتے ہو۔\"",
        },
        {
          en: "Khadijah believed him at once. Then she took him to her cousin Waraqah, a wise man who knew the books of Allah. Waraqah heard the story and said: \"This is the same angel who came to Musa and Isa. I wish I could live to see the day your people drive you out.\"",
          ur: "خدیجہ نے فوراً ایمان لایا۔ پھر وہ اسے اپنے چچا کے بیٹے ورقة بن نوفل کے پاس لے گئیں جو کتابوں کا علم رکھتے تھے۔ ورقة نے یہ سنا تو کہا: \"یہ وہی فرشتہ ہے جو موسیٰ اور عیسیٰ کے پاس آیا تھا۔ کاش میں وہ دن دیکھوں جب تمہاری قوم تمہیں نکال دے۔\"",
        },
        {
          en: "From that night, Muhammad became the Messenger of Allah. The cave of Hira, the mountain that had been silent for so long, became the place where the light of the Qur'an first touched the earth. And the whole world would never be the same again.",
          ur: "اسی رات سے محمد اللہ کے رسول بن گئے۔ حرا کی غار، وہ پہاڑ جو کبھی خاموش رہتا تھا، وہ جگہ بن گیا جہاں قرآن کا نور پہلی بار زمین پر اترا۔ اور پوری دنیا پھر کبھی ویسی نہیں رہی۔",
        },
      ],
      ayahNote: {
        en: "Surah Al-Alaq begins with the word \"Read\" — Allah taught that true knowledge comes from the One who created everything. The first word of the Qur'an is still a call to learn.",
        ur: "سورہ العلق کا آغاز \"پڑھ\" سے ہے — اللہ نے سکھایا کہ سچا علم اسی کا دیا ہوا ہے جس نے سب کچھ بنایا۔ قرآن کا پہلا لفظ آج بھی علم کی دعوت ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 96:1-5",
          label: { en: "The first revelation: read in the name of your Lord who created", ur: "پہلا کلام: پڑھ اپنے رب کے نام سے جس نے پیدا کیا" },
          explanation: {
            en: "Allah began the Qur'an with knowledge and creation: read, learn, and remember that your Lord is the Creator of every human being.",
            ur: "اللہ نے قرآن کا آغاز علم سے کیا: پڑھو، سیکھو، اور یاد رکھو کہ تمہارا رب ہر انسان کا خالق ہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari 3 (Kitab Bad' al-Wahy) - the story of the cave of Hira",
          label: {
            en: "The hadith tells of Jibreel bringing the first revelation, Khadijah's comfort and Waraqah's words",
            ur: "حدیث میں جبرائیل کا پہلا کلام لانا، خدیجہ کی تسلی اور ورقة کے الفاظ کا ذکر ہے",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim - Waraqah's words",
          needsVerification: true,
          label: {
            en: "Waraqah says this is the same angel that came to Musa, and warns of persecution",
            ur: "ورقة کہتے ہیں کہ یہ وہی فرشتہ ہے جو موسیٰ کے پاس آیا، اور اذیتوں کی پیش گوئی کرتے ہیں",
          },
        },
      ],
    },
    {
      id: "night-journey",
      title: { en: "The Night Journey and the Ascension", ur: "معراج کا سفر" },
      paragraphs: [
        {
          en: "One night, in the deepest hours of the dark, the greatest journey of history began. Allah says: \"Exalted is He who took His servant by night from the Sacred Mosque to the Farthest Mosque\" (Qur'an 17:1). The Prophet traveled from Makkah to Jerusalem in one night.",
          ur: "ایک رات، اندھیرے کے سب سے گہرے پہر میں، تاریخ کا سب سے بڑا سفر شروع ہوا۔ اللہ فرماتا ہے: \"پاک ہے وہ جو اپنے بندے کو رات میں مسجد حرام سے دور والی مسجد تک لے گیا\" (قرآن ۱۷:۱)۔ نبی ایک ہی رات میں مکہ سے یروشلم پہنچ گئے۔",
        },
        {
          en: "There, the Prophet met the other prophets — Ibrahim, Musa, Isa and many more — and led them in prayer. Then Allah lifted His beloved servant higher and higher, through the seven skies, to a place where no human had ever gone before.",
          ur: "وہاں نبی کی ملاقات دوسرے انبیاء سے ہوئی — ابراہیم، موسیٰ، عیسیٰ اور بہت سے اور — اور انہوں نے ان کی امامت کی۔ پھر اللہ نے اپنے محبوب بندے کو اور اونچا اٹھایا، سات آسمانوں کے پار، اس مقام تک جہاں پہلے کوئی انسان نہیں گیا تھا۔",
        },
        {
          en: "On that journey, Allah gave the Prophet a gift for the whole ummah: the five daily prayers. Every time a Muslim prays today, they are touching that blessed night. And the Qur'an describes what the Prophet saw: \"And he certainly saw him in a second descent\" (Qur'an 53:13).",
          ur: "اس سفر میں اللہ نے نبی کو پوری امت کے لیے ایک تحفہ دیا: پانچ وقت کی نماز۔ آج جب بھی کوئی مسلمان نماز پڑھتا ہے، وہ اس برکت والی رات کو چھوتا ہے۔ اور قرآن بیان کرتا ہے کہ نبی نے کیا دیکھا: \"اور اس نے اسے دوسری بار اترتے ہوئے بھی دیکھا\" (قرآن ۵۳:۱۳)۔",
        },
        {
          en: "When the Prophet came back and told the people about the journey, the mockers laughed: \"One night to Jerusalem and back? Impossible!\" But Abu Bakr, the truthful, said at once: \"If Muhammad said it, then it is true.\" That is why Abu Bakr became known as as-Siddiq, the one who confirms the truth.",
          ur: "جب نبی واپس آئے اور لوگوں کو سفر کے بارے میں بتایا تو مذاق اڑانے والے ہنسے: \"ایک رات میں یروشلم اور واپس؟ ناممکن!\" لیکن ابو بکر صادق نے فوراً کہا: \"اگر محمد نے کہا ہے تو یہ سچ ہے۔\" اسی لیے ابو بکر صدیق کہلائے، سچ کی تصدیق کرنے والے۔",
        },
        {
          en: "The night journey teaches every child that Allah's power has no limits. The One who made the stars can carry His servant through the skies. And when the world says \"impossible,\" the believer says: \"Allah is able to do all things.\"",
          ur: "معراج کا سفر ہر بچے کو سکھاتا ہے کہ اللہ کی قدرت کی کوئی حد نہیں۔ جس نے ستارے بنائے وہ اپنے بندے کو آسمانوں میں لے جا سکتا ہے۔ اور جب دنیا کہے \"ناممکن\"، مومن کہتا ہے: \"اللہ ہر چیز پر قادر ہے۔\"",
        },
      ],
      ayahNote: {
        en: "Surah Al-Isra tells how Allah took His servant on the night journey, and Surah An-Najm describes the highest places the Prophet saw. The gift of that night, the five daily prayers, still belongs to every Muslim today.",
        ur: "سورہ بنی اسرائیل بتاتی ہے کہ اللہ نے اپنے بندے کو معراج پر لے گیا، اور سورہ نجم ان اونچے مقامات کا ذکر کرتی ہے جو نبی نے دیکھے۔ اس رات کا تحفہ، پانچ وقت کی نماز، آج بھی ہر مسلمان کا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 17:1",
          label: {
            en: "Allah takes His servant by night from the Sacred Mosque to the Farthest Mosque",
            ur: "اللہ اپنے بندے کو رات میں مسجد حرام سے مسجد اقصیٰ تک لے جاتا ہے",
          },
          explanation: {
            en: "This verse is the story of the night journey: one night, in one trip, Allah carried His prophet from Makkah to Jerusalem to show His great power.",
            ur: "یہ آیت معراج کی کہانی ہے: ایک رات، ایک سفر میں، اللہ نے اپنے نبی کو مکہ سے یروشلم لے گیا تاکہ اپنی عظیم قدرت دکھائے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 53:13-18",
          label: {
            en: "The Prophet sees the angel in the highest horizon on the night of ascension",
            ur: "معراج کی رات نبی بلند افق پر فرشتے کو دیکھتے ہیں",
          },
          explanation: {
            en: "These verses describe the wonders the Prophet was shown in the highest skies, sights that no eyes had ever seen before.",
            ur: "یہ آیات ان عجائبات کو بیان کرتی ہیں جو نبی کو سب سے اونچے آسمانوں میں دکھائے گئے، ایسے مناظر جو کبھی کسی آنکھ نے نہیں دیکھے تھے۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim - the journey of Isra and Mi'raj",
          needsVerification: true,
          label: {
            en: "The hadith tells of the night journey, meeting the prophets, and the gift of the five prayers",
            ur: "احادیث میں معراج کا سفر، انبیاء سے ملاقات اور پانچ نمازوں کے تحفے کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "pledges-of-aqabah",
      title: { en: "The Two Pledges of Aqabah", ur: "عقبہ کی دو بیعتیں" },
      paragraphs: [
        {
          en: "The Prophet called his people in Makkah for ten years, and only a few believed. Those believers were hurt every day. Then Allah opened a new door in the city of Yathrib.",
          ur: "نبی نے دس سال مکہ میں لوگوں کو دعوت دی، اور صرف کچھ لوگ ایمان لائے۔ ان مومنوں کو ہر روز ستایا جاتا تھا۔ پھر اللہ نے یثرب شہر میں ایک نیا دروازہ کھولا۔",
        },
        {
          en: "Every year in the season of pilgrimage, people from Yathrib came to Makkah. They met the Prophet and heard his beautiful words. Their hearts opened, and they carried the message of Islam back to their city.",
          ur: "ہر سال حج کے موسم میں یثرب کے لوگ مکہ آتے تھے۔ وہ نبی سے ملتے تھے اور ان کی خوبصورت باتیں سنتے تھے۔ ان کے دل کھل گئے، اور وہ اسلام کا پیغام اپنے شہر لے گئے۔",
        },
        {
          en: "In the next year, a small group came by night to a place called Aqabah and made the first pledge. They promised to worship only Allah and to obey the Prophet. Islam began to grow in Yathrib.",
          ur: "اگلے سال ایک چھوٹا سا گروہ رات کو عقبہ نامی جگہ آیا اور پہلی بیعت کی۔ انہوں نے وعدہ کیا کہ صرف اللہ کی عبادت کریں گے اور نبی کی اطاعت کریں گے۔ یثرب میں اسلام پھیلنے لگا۔",
        },
        {
          en: "A year later, seventy men and two women came by night and made the second pledge. They promised to protect the Prophet as they protected their own children. The Prophet accepted them with a smiling heart.",
          ur: "ایک سال بعد ستر مرد اور دو عورتیں رات کو آئیں اور دوسری بیعت کی۔ انہوں نے وعدہ کیا کہ نبی کی حفاظت کریں گے جیسے اپنی اولاد کی حفاظت کرتے ہیں۔ نبی نے خوشی سے انہیں قبول کیا۔",
        },
        {
          en: "These were the two pledges of Aqabah. The people of Yathrib became known as the Ansar, the helpers. And Allah promised: \"If you help Allah's cause, He will help you and make your feet firm\" (Qur'an 47:7).",
          ur: "یہ عقبہ کی دو بیعتیں تھیں۔ یثرب کے لوگ انصار یعنی مددگار کہلائے۔ اور اللہ نے وعدہ کیا: \"اگر تم اللہ کے دین کی مدد کرو گے تو اللہ تمہاری مدد کرے گا اور تمہیں ثابت قدم رکھے گا\" (قرآن ۴۷:۷)۔",
        },
      ],
      ayahNote: {
        en: "The Ansar made a huge promise: to give the Prophet a home and to protect him like their own family. Allah answered their brave faith: whoever helps the truth, Allah helps him (Qur'an 47:7).",
        ur: "انصار نے بڑا وعدہ کیا: نبی کو گھر دینا اور اپنے بچوں کی طرح حفاظت کرنا۔ اللہ نے ان کے ایمان کا جواب دیا: جو سچ کی مدد کرے، اللہ اس کی مدد کرتا ہے (قرآن ۴۷:۷)۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 47:7",
          label: { en: "Allah promises: whoever helps His cause, Allah will help him", ur: "اللہ وعدہ کرتا ہے: جو اس کے دین کی مدد کرے گا، اللہ اس کی مدد کرے گا" },
          explanation: {
            en: "The Ansar promised to protect the Prophet even with their lives. This verse tells every helper: when you stand for the truth, Allah stands with you.",
            ur: "انصار نے نبی کی جان سے بھی حفاظت کا وعدہ کیا۔ یہ آیت ہر مددگار کو بتاتی ہے: جب تم سچ کے ساتھ کھڑے ہوتے ہو تو اللہ تمہارے ساتھ ہوتا ہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham; Ibn Kathir, Al-Bidayah wan-Nihayah) - the two Pledges of Aqabah",
          needsVerification: true,
          label: {
            en: "The Seerah tells of the first and second pledges of Aqabah and how the Ansar embraced Islam",
            ur: "سیرت میں عقبہ کی پہلی اور دوسری بیعت اور انصار کے اسلام قبول کرنے کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "the-hijrah",
      title: { en: "The Hijrah — A New Home", ur: "ہجرت — نیا گھر" },
      paragraphs: [
        {
          en: "The enemies of Makkah became more cruel, and they even planned to kill the Prophet. But Allah had a beautiful plan: He commanded the believers to move to the city of Madinah, where kind hearts were waiting to welcome them. The Prophet stayed last, to guide everyone out safely.",
          ur: "مکہ کے دشمن اور ظالم ہوتے گئے، اور انہوں نے نبی کو قتل کرنے کی بھی سازش کی۔ لیکن اللہ کا ایک خوبصورت منصوبہ تھا: اس نے مومنوں کو حکم دیا کہ مدینہ شہر کی طرف ہجرت کریں، جہاں محبت کرنے والے دل ان کا استقبال کرنے کے لیے تیار تھے۔ نبی سب سے آخر میں رہے، تاکہ سب کو محفوظ باہر نکالیں۔",
        },
        {
          en: "When the night came, the enemy surrounded the Prophet's house. But Ali slept in the Prophet's bed, and the Prophet walked out between the enemies while Allah made them unable to see. In the dark of the night, the Prophet set out with his dearest friend, Abu Bakr.",
          ur: "جب رات آئی تو دشمنوں نے نبی کے گھر کو گھیر لیا۔ لیکن علی نبی کے بستر پر سو گئے، اور نبی دشمنوں کے درمیان سے چلے گئے جب اللہ نے انہیں دیکھنے سے روک دیا۔ رات کے اندھیرے میں نبی اپنے سب سے پیارے دوست ابو بکر کے ساتھ نکلے۔",
        },
        {
          en: "They hid in a cave called Thawr for three days. The enemies came right to the mouth of the cave. Abu Bakr whispered: \"If any of them looks down, they will see us.\" The Prophet said with perfect calm: \"Do not grieve — indeed Allah is with us\" (Qur'an 9:40).",
          ur: "وہ تین دن ثور نامی غار میں چھپے رہے۔ دشمن غار کے منہ تک آ گئے۔ ابو بکر نے سرگوشی کی: \"اگر ان میں سے کوئی نیچے دیکھ لے تو وہ ہمیں دیکھ لیں گے۔\" نبی نے پورے سکون سے فرمایا: \"غم نہ کھاؤ — بیشک اللہ ہمارے ساتھ ہے\" (قرآن ۹:۴۰)۔",
        },
        {
          en: "After the danger passed, the Prophet rode on his camel to Madinah. The people of Madinah had heard of the Prophet and ran out to welcome him, singing songs of joy. Everyone wanted him to stay in their home. So the Prophet said: \"Leave the camel free — she will stop where Allah wishes.\"",
          ur: "خطرہ ٹلنے کے بعد نبی اپنی اونٹنی پر سوار ہو کر مدینہ پہنچے۔ مدینہ والوں نے نبی کا ذکر سنا تھا اور وہ خوشی کے گیت گاتے ہوئے ان کا استقبال کرنے دوڑے۔ ہر کوئی چاہتا تھا کہ نبی اس کے گھر رہیں۔ چنانچہ نبی نے فرمایا: \"اونٹنی کو چھوڑ دو — وہ جہاں اللہ چاہے گا رک جائے گی۔\"",
        },
        {
          en: "Where the camel knelt, the Prophet built the first mosque, and from that day Madinah became the city of light. The Muslims who left Makkah and the Muslims who welcomed them in Madinah became brothers. The hijrah taught the world that leaving your home for Allah is never a loss, it is the greatest gain.",
          ur: "جہاں اونٹنی بیٹھ گئی، نبی نے پہلی مسجد بنائی، اور اسی دن سے مدینہ نور کا شہر بن گیا۔ مکہ چھوڑنے والے مسلمان اور مدینہ میں خوش آمدید کہنے والے مسلمان بھائی بن گئے۔ ہجرت نے دنیا کو سکھایا کہ اللہ کے لیے اپنا گھر چھوڑنا کبھی نقصان نہیں، یہ سب سے بڑا نفع ہے۔",
        },
      ],
      ayahNote: {
        en: "In the dark cave with the enemy at the door, the Prophet carried the sweetest promise: \"Do not grieve; indeed, Allah is with us\" (Qur'an 9:40). When Allah is with you, the whole world cannot hurt you.",
        ur: "اندھیری غار میں جب دشمن منہ تک آ گیا تو نبی کے ساتھ سب سے پیارا وعدہ تھا: \"غم نہ کھاؤ؛ بیشک اللہ ہمارے ساتھ ہے\" (قرآن ۹:۴۰)۔ جب اللہ آپ کے ساتھ ہو تو پوری دنیا مل کر بھی آپ کو نقصان نہیں پہنچا سکتی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 9:40",
          label: {
            en: "In the cave, the Prophet tells Abu Bakr: do not grieve, Allah is with us",
            ur: "غار میں نبی ابو بکر سے فرماتے ہیں: غم نہ کھاؤ، اللہ ہمارے ساتھ ہے",
          },
          explanation: {
            en: "Even when the enemy stood at the mouth of the cave, the Prophet's heart was at peace, because he truly trusted Allah. Fear flies away when trust in Allah is strong.",
            ur: "جب دشمن غار کے منہ تک آ گئے تو نبی کا دل پرسکون تھا، کیونکہ ان کا بھروسہ اللہ پر تھا۔ جب اللہ پر بھروسہ مضبوط ہوتا ہے تو خوف دور بھاگتا ہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari - the hijrah and the story of the cave of Thawr",
          needsVerification: true,
          label: {
            en: "The hadith tells of Ali sleeping in the Prophet's bed and the journey to Madinah",
            ur: "حدیث میں علی کا نبی کے بستر پر سونا اور مدینہ کے سفر کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "the-mosque-and-brotherhood",
      title: { en: "The First Mosque and Brotherhood", ur: "پہلی مسجد اور بھائی چارہ" },
      paragraphs: [
        {
          en: "When the Prophet came to Madinah, the first thing he did was build a mosque with his own hands. It was a simple place made of clay bricks and palm leaves, but it became the heart of the new city.",
          ur: "جب نبی مدینہ آئے تو انہوں نے اپنے ہاتھوں سے پہلی مسجد بنائی۔ یہ مٹی کی اینٹوں اور کھجور کے پتوں سے بنی تھی، لیکن یہ نئے شہر کا دل بن گئی۔",
        },
        {
          en: "The Muslims who came from Makkah were called the Muhajirun, the emigrants. They had left their homes and their money behind. The Muslims of Madinah were called the Ansar, the helpers, and they shared everything with love.",
          ur: "جو مسلمان مکہ سے آئے وہ مہاجرین کہلائے۔ انہوں نے اپنے گھر اور مال پیچھے چھوڑ دیے تھے۔ مدینہ کے مسلمان انصار کہلائے، اور انہوں نے محبت سے سب کچھ بانٹ لیا۔",
        },
        {
          en: "The Prophet joined every Muhajir with an Ansari as a brother. The Ansar said: \"Brother, take half of my garden and half of my money.\" The Muhajirun said: \"Just show us the market, and may Allah bless your home.\"",
          ur: "نبی نے ہر مہاجر کو ایک انصاری کا بھائی بنایا۔ انصار نے کہا: \"بھائی، میرا آدھا باغ اور آدھا مال لے لو۔\" مہاجرین نے کہا: \"ہمیں صرف بازار دکھا دو، اللہ تمہارے گھر کو برکت دے۔\"",
        },
        {
          en: "Allah praised both groups in the Qur'an: \"The believers who emigrated and strove in the cause of Allah, and the ones who gave them refuge and helped them — those are the believers in truth\" (Qur'an 8:74).",
          ur: "اللہ نے قرآن میں دونوں گروہوں کی تعریف کی: \"جو ایمان لائے اور ہجرت کی اور اللہ کی راہ میں کوشش کی، اور جنہوں نے انہیں پناہ دی اور مدد کی — یہی سچے مومن ہیں\" (قرآن ۸:۷۴)۔",
        },
        {
          en: "That is how the city of Madinah became one big family. The mosque was not only for prayer; it was also a school where children learned, and a home where the poor were fed. It was the house of mercy.",
          ur: "اسی طرح مدینہ ایک بڑا خاندان بن گیا۔ مسجد صرف نماز کے لیے نہیں تھی؛ وہ اسکول بھی تھی جہاں بچے سیکھتے تھے، اور گھر بھی جہاں غریبوں کو کھانا ملتا تھا۔ یہ رحمت کا گھر تھا۔",
        },
      ],
      ayahNote: {
        en: "Surah Al-Anfal praises the Muhajirun and the Ansar together (8:74), and Surah Al-Hashr praises the Ansar for giving others first (59:9). Sharing makes a community strong.",
        ur: "سورہ انفال مہاجرین اور انصار کی ایک ساتھ تعریف کرتی ہے (قرآن ۸:۷۴)، اور سورہ حشر انصار کی تعریف کرتی ہے جنہوں نے دوسروں کو خود پر مقدم رکھا (قرآن ۵۹:۹)۔ بانٹنا امت کو مضبوط کرتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 8:74",
          label: {
            en: "Allah praises the Muhajirun and the Ansar who sheltered and helped them",
            ur: "اللہ مہاجرین اور انصار کی تعریف کرتا ہے جنہوں نے انہیں پناہ دی اور مدد کی",
          },
          explanation: {
            en: "This verse makes one family of two groups: the ones who left everything for Allah and the ones who opened their doors to them. Both are true believers.",
            ur: "یہ آیت دو گروہوں کو ایک خاندان بناتی ہے: وہ جنہوں نے اللہ کے لیے سب کچھ چھوڑا، اور وہ جنہوں نے اپنے دروازے ان کے لیے کھول دیے۔ دونوں سچے مومن ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 59:9",
          label: {
            en: "Allah praises the Ansar who gave others first even when they were in need",
            ur: "اللہ انصار کی تعریف کرتا ہے جنہوں نے محتاج ہوتے ہوئے بھی دوسروں کو مقدم رکھا",
          },
          explanation: {
            en: "The Ansar shared their food and gardens even when they had little. Giving others first is a beautiful treasure in Islam.",
            ur: "انصار نے خود کم ہوتے ہوئے بھی اپنا کھانا اور باغ بانٹ دیے۔ دوسروں کو مقدم رکھنا اسلام کی خوبصورت دولت ہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) - the building of the Prophet's Mosque and the brotherhood",
          needsVerification: true,
          label: {
            en: "The Seerah tells of building the first mosque and joining the Muhajirun and Ansar as brothers",
            ur: "سیرت میں پہلی مسجد کی تعمیر اور مہاجرین و انصار کی بھائی چارگی کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "badr",
      title: { en: "Badr — The Great Battle and Allah's Help", ur: "بدر — عظیم جنگ اور اللہ کی مدد" },
      paragraphs: [
        {
          en: "After the hijrah, the enemies of Islam grew angrier. They gathered a big army and marched toward Madinah to destroy the Muslims. The believers were only a small group, but they trusted Allah.",
          ur: "ہجرت کے بعد اسلام کے دشمن اور زیادہ غصے ہوئے۔ انہوں نے ایک بڑی فوج جمع کی اور مسلمانوں کو ختم کرنے کے لیے مدینہ کی طرف چلے۔ مومن بہت کم تھے، لیکن ان کا بھروسہ اللہ پر تھا۔",
        },
        {
          en: "The Prophet asked his companions to decide, and the Ansar said: \"O Messenger of Allah, we will stand with you wherever you go, just as we stand for our own families.\" So the small Muslim army went out to meet the enemy at the wells of Badr.",
          ur: "نبی نے صحابہ سے مشورہ کیا، اور انصار نے کہا: \"اے اللہ کے رسول، ہم آپ کے ساتھ کھڑے ہیں جہاں بھی آپ جائیں گے، جیسے اپنے خاندانوں کے لیے کھڑے ہوتے ہیں۔\" چنانچہ چھوٹی سی مسلم فوج دشمن سے ملنے بدر کے کنوؤں تک گئی۔",
        },
        {
          en: "The Muslims were only about three hundred, and the enemy was a thousand. But Allah had promised: \"Allah had already given you victory at Badr while you were few\" (Qur'an 3:123).",
          ur: "مسلمان صرف تین سو کے قریب تھے، اور دشمن ایک ہزار تھا۔ لیکن اللہ نے وعدہ کیا تھا: \"اللہ تمہیں بدر میں پہلے بھی فتح دے چکا ہے جب تم کم تھے\" (قرآن ۳:۱۲۳)۔",
        },
        {
          en: "The Prophet prayed all night before the battle. Allah answered: \"Is it not sufficient for you that your Lord should support you with three thousand angels?\" (Qur'an 3:124). When the morning came, the Muslims fought bravely, and Allah gave them victory.",
          ur: "جنگ سے پہلے نبی نے ساری رات دعا کی۔ اللہ نے جواب دیا: \"کیا تمہارے لیے کافی نہیں کہ تمہارا رب تین ہزار فرشتوں سے تمہاری مدد کرے؟\" (قرآن ۳:۱۲۴)۔ صبح ہوئی تو مسلمانوں نے بہادری سے لڑے، اور اللہ نے انہیں فتح دی۔",
        },
        {
          en: "That day the Muslims learned that numbers do not win battles, Allah does. The victory of Badr was the first great sign that Islam was here to stay.",
          ur: "اس دن مسلمانوں نے سیکھا کہ جنگیں فوج نہیں جیتتیں، اللہ جیتتا ہے۔ بدر کی فتح پہلی بڑی نشانی تھی کہ اسلام ہمیشہ کے لیے آیا ہے۔",
        },
      ],
      ayahNote: {
        en: "Surah Aal-Imran remembers Badr: \"Allah had already given you victory at Badr while you were few\" (3:123), and He helped with angels (3:124-125). Trust in Allah is stronger than any army.",
        ur: "سورہ آل عمران بدر کی یاد دلاتی ہے: \"اللہ تمہیں بدر میں فتح دے چکا ہے جب تم کم تھے\" (قرآن ۳:۱۲۳)، اور اللہ نے فرشتوں سے مدد کی (قرآن ۳:۱۲۴–۱۲۵)۔ اللہ پر بھروسہ کسی بھی فوج سے زیادہ طاقتور ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:123",
          label: { en: "Allah gave the believers victory at Badr when they were few", ur: "اللہ نے بدر میں مومنوں کو فتح دی جب وہ کم تھے" },
          explanation: {
            en: "This verse tells the story of Badr in one line: few believers, many enemies, and still a victory, because Allah was with them.",
            ur: "یہ آیت بدر کی کہانی ایک جملے میں سناتی ہے: کم مومن، زیادہ دشمن، پھر بھی فتح، کیونکہ اللہ ان کے ساتھ تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:124-125",
          label: { en: "Allah supported the believers with angels at Badr", ur: "اللہ نے بدر میں مومنوں کی فرشتوں سے مدد کی" },
          explanation: {
            en: "The believers saw angels helping them in the battle. Allah's help can come in ways we cannot see.",
            ur: "مومنوں نے جنگ میں فرشتوں کو اپنی مدد کرتے دیکھا۔ اللہ کی مدد ایسے طریقوں سے آتی ہے جنہیں ہم نہیں دیکھ سکتے۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) - the battle of Badr",
          needsVerification: true,
          label: {
            en: "The Seerah tells of the night of prayer and the victory at the wells of Badr",
            ur: "سیرت میں شب دعا اور بدر کے کنوؤں پر فتح کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "uhud",
      title: { en: "Uhud — The Archers' Lesson", ur: "احد — تیر اندازوں کا سبق" },
      paragraphs: [
        {
          en: "A year after Badr, the enemy returned with a huge army of three thousand to take revenge. The Muslims went out to meet them near the mountain of Uhud, and the Prophet placed a small group of archers on a hill with a clear order: \"Stay here, whatever happens.\"",
          ur: "بدر کے ایک سال بعد دشمن بدلہ لینے کے لیے تین ہزار کی بڑی فوج لے کر آیا۔ مسلمان پہاڑ احد کے پاس ان سے ملنے گئے، اور نبی نے تیر اندازوں کے ایک چھوٹے گروہ کو ایک پہاڑی پر رکھا اور صاف حکم دیا: \"یہاں رہو، چاہے کچھ بھی ہو۔\"",
        },
        {
          en: "At first the Muslims were winning. But when the archers saw that the enemy was running away and the treasure was being gathered, some of them forgot the Prophet's order and left the hill. Then the enemy came from behind, and the battle turned.",
          ur: "شروع میں مسلمان جیت رہے تھے۔ لیکن جب تیر اندازوں نے دیکھا کہ دشمن بھاگ رہا ہے اور مال جمع ہو رہا ہے تو کچھ نے نبی کا حکم بھول کر پہاڑی چھوڑ دی۔ پھر دشمن پیچھے سے آیا، اور جنگ الٹ گئی۔",
        },
        {
          en: "Many brave believers fell as martyrs that day, among them the Prophet's dear uncle Hamzah. The Prophet himself was hurt, but he kept saying: \"O Allah, guide my people, for they do not know.\"",
          ur: "اس دن بہت سے بہادر مومن شہید ہوئے، ان میں نبی کے پیارے چچا حمزہ بھی تھے۔ نبی خود زخمی ہوئے، لیکن پھر بھی کہتے رہے: \"اے اللہ، میری قوم کو ہدایت دے، کیونکہ وہ نہیں جانتے۔\"",
        },
        {
          en: "Allah told the believers what had happened: \"You indeed lost courage and disagreed about the order and disobeyed\" (Qur'an 3:152). The mistake was not an end; it was a lesson.",
          ur: "اللہ نے مومنوں کو بتایا کہ کیا ہوا: \"بیشک تم نے ہمت ہاری، حکم میں اختلاف کیا اور نافرمانی کی\" (قرآن ۳:۱۵۲)۔ یہ غلطی ختم نہیں تھی؛ یہ ایک سبق تھا۔",
        },
        {
          en: "After the hurt, Allah said: \"Do not weaken and do not grieve, for you will be superior if you are believers\" (Qur'an 3:139). The believers stood up again, stronger and wiser.",
          ur: "دکھ کے بعد اللہ نے فرمایا: \"تم کمزور نہ ہو اور غم نہ کھاؤ، تم ہی بلند ہو گے اگر ایمان والے ہو\" (قرآن ۳:۱۳۹)۔ مومن پھر کھڑے ہوئے، مضبوط اور زیادہ سمجھ دار۔",
        },
      ],
      ayahNote: {
        en: "The lesson of Uhud is in two verses: obeying the leader matters (3:152), and failure is not the end for believers (3:139). Even when we fall, we stand again with faith.",
        ur: "احد کا سبق دو آیات میں ہے: رہنما کی اطاعت ضروری ہے (قرآن ۳:۱۵۲)، اور مومن کے لیے شکست ختم نہیں (قرآن ۳:۱۳۹)۔ گر کر بھی ایمان کے ساتھ دوبارہ کھڑے ہو جاتے ہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:152",
          label: { en: "Allah tells of the archers losing courage, disagreeing and disobeying the order", ur: "اللہ تیر اندازوں کی ہمت ہارنے، اختلاف اور نافرمانی کا ذکر کرتا ہے" },
          explanation: {
            en: "This verse kindly explains what went wrong at Uhud: a small mistake by a few people changed the day. Obeying the leader protects everyone.",
            ur: "یہ آیت نرمی سے بتاتی ہے کہ احد میں کیا غلطی ہوئی: چند لوگوں کی چھوٹی غلطی نے دن بدل دیا۔ رہنما کی اطاعت سب کی حفاظت کرتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:139",
          label: { en: "Allah tells the believers not to weaken or grieve, for they will be superior", ur: "اللہ مومنوں سے کہتا ہے کہ کمزور نہ ہو اور غم نہ کھاؤ، تم ہی بلند ہو گے" },
          explanation: {
            en: "After a hard day, this verse picks the believers up: a believer is never defeated inside, even when the battle goes wrong.",
            ur: "مشکل دن کے بعد یہ آیت مومنوں کو اٹھاتی ہے: مومن دل سے کبھی شکست نہیں کھاتا، چاہے جنگ الٹ جائے۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham) - the battle of Uhud and the martyrdom of Hamzah",
          needsVerification: true,
          label: {
            en: "The Seerah tells of the archers' mistake, the martyrs of Uhud and the Prophet's mercy",
            ur: "سیرت میں تیر اندازوں کی غلطی، احد کے شہدا اور نبی کی رحمت کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "the-trench",
      title: { en: "The Trench — Khandaq", ur: "خندق — گڑھا" },
      paragraphs: [
        {
          en: "After Uhud, the enemies did not give up. They gathered tribes from every side and came with a huge army of ten thousand to finish the Muslims. Madinah was in danger.",
          ur: "احد کے بعد دشمنوں نے ہار نہیں مانی۔ انہوں نے ہر طرف سے قبیلے جمع کیے اور دس ہزار کی بڑی فوج لے کر آئے تاکہ مسلمانوں کو ختم کر دیں۔ مدینہ خطرے میں تھا۔",
        },
        {
          en: "The Prophet took advice from his companions. Salman, the wise companion from Persia, suggested: \"O Messenger of Allah, in our land, when an enemy comes, we dig a trench around the city.\" The Prophet loved the idea, and all the believers began to dig with joy.",
          ur: "نبی نے صحابہ سے مشورہ لیا۔ فارس کے عقلمند صحابی سلمان نے مشورہ دیا: \"اے اللہ کے رسول، ہماری سرزمین میں جب دشمن آتا ہے تو شہر کے چاروں طرف خندق کھودتے ہیں۔\" نبی کو یہ مشورہ پسند آیا، اور تمام مومن خوشی سے خندق کھودنے لگے۔",
        },
        {
          en: "They dug through cold days and hungry nights. The Prophet worked with his own hands, and the believers sang as they worked. When the enemy arrived, they were surprised: they could not cross the trench with their horses.",
          ur: "انہوں نے ٹھنڈے دنوں اور بھوکی راتوں میں خندق کھودی۔ نبی اپنے ہاتھوں سے کام کرتے تھے، اور مومن کام کرتے ہوئے گیت گاتے تھے۔ جب دشمن آیا تو وہ حیران رہ گیا: وہ اپنے گھوڑوں کے ساتھ خندق پار نہیں کر سکتا تھا۔",
        },
        {
          en: "Allah says about those days: \"When they came upon you from above you and from below you, and eyes became crazed and hearts reached the throats\" (Qur'an 33:10). It was a hard time, but the believers did not break.",
          ur: "اللہ ان دنوں کے بارے میں فرماتا ہے: \"جب وہ تم پر اوپر سے اور نیچے سے چڑھ آئے، اور آنکھیں پتھرا گئیں اور دل گلوں تک آ گئے\" (قرآن ۳۳:۱۰)۔ وہ بہت مشکل وقت تھا، لیکن مومن نہیں ٹوٹے۔",
        },
        {
          en: "Then Allah sent a cold wind and fear into the hearts of the enemy. Their army scattered in the night, and the battle of the Trench ended with peace. The believers learned that patience and trust in Allah defeat every siege.",
          ur: "پھر اللہ نے سرد ہوا بھیجی اور دشمن کے دلوں میں خوف ڈال دیا۔ ان کی فوج رات ہی میں بکھر گئی، اور جنگ خندق امن کے ساتھ ختم ہوئی۔ مومنوں نے سیکھا کہ صبر اور اللہ پر بھروسہ ہر گھیرے کو شکست دیتا ہے۔",
        },
      ],
      ayahNote: {
        en: "Surah Al-Ahzab describes the days of the Trench: enemies from above and below, fear all around (33:9-11). But Allah gave the believers help, and the siege ended with peace.",
        ur: "سورہ احزاب خندق کے دنوں کو بیان کرتی ہے: اوپر سے اور نیچے سے دشمن، چاروں طرف خوف (قرآن ۳۳:۹–۱۱)۔ لیکن اللہ نے مومنوں کی مدد کی، اور گھیراؤ امن پر ختم ہوا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 33:9-11",
          label: {
            en: "Allah describes the danger of the confederates around the trench and the patience of the believers",
            ur: "اللہ خندق کے گرد دشمنوں کے خطرے اور مومنوں کے صبر کو بیان کرتا ہے",
          },
          explanation: {
            en: "These verses show how scary the siege was, and how the believers stayed firm in their faith even then.",
            ur: "یہ آیات بتاتی ہیں کہ گھیراؤ کتنا خوفناک تھا، اور پھر بھی مومن اپنے ایمان پر قائم رہے۔",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Hisham; Ibn Kathir, Al-Bidayah wan-Nihayah) - the battle of the Trench (Khandaq)",
          needsVerification: true,
          label: {
            en: "The Seerah tells of digging the trench and the enemy scattering by Allah's command",
            ur: "سیرت میں خندق کھودنے اور اللہ کے حکم سے دشمن کے بکھرنے کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "hudaybiyyah",
      title: { en: "Hudaybiyyah — The Treaty of Peace", ur: "حدیبیہ — صلح کا معاہدہ" },
      paragraphs: [
        {
          en: "In the sixth year after the hijrah, the Prophet's heart longed to visit the Kaaba. He set out with more than a thousand believers, wearing the simple clothes of pilgrimage, carrying no weapons. They only wanted to visit the sacred house of Allah.",
          ur: "ہجرت کے چھٹے سال نبی کے دل نے کعبہ کی زیارت چاہی۔ وہ ہزار سے زیادہ مومنین کے ساتھ چلے، سادہ لباس میں، بغیر ہتھیار کے۔ وہ صرف اللہ کے گھر کی زیارت چاہتے تھے۔",
        },
        {
          en: "But the people of Makkah stopped them at a place called Hudaybiyyah and said: \"You may not enter this year.\" The Muslims were sad, but the Prophet accepted peace talks with patience and sent a message of peace.",
          ur: "لیکن مکہ والوں نے انہیں حدیبیہ نامی جگہ روک دیا اور کہا: \"اس سال تم اندر نہیں جا سکتے۔\" مسلمان غمگین ہوئے، لیکن نبی نے صبر سے صلح کی بات قبول کی اور امن کا پیغام بھیجا۔",
        },
        {
          en: "While they were waiting, the believers made a pledge under a tree, promising to stay with the Prophet until the end. Allah was pleased with them: \"Indeed, Allah was pleased with the believers when they pledged allegiance to you under the tree\" (Qur'an 48:18).",
          ur: "انتظار کے دوران مومنین نے ایک درخت کے نیچے بیعت کی اور وعدہ کیا کہ نبی کا ساتھ نہیں چھوڑیں گے۔ اللہ ان سے راضی ہوا: \"بیشک اللہ مومنوں سے راضی ہوا جب انہوں نے درخت کے نیچے تم سے بیعت کی\" (قرآن ۴۸:۱۸)۔",
        },
        {
          en: "Then a peace treaty was written: ten years of peace, the Muslims would come for pilgrimage the next year, and anyone who wished could join either side. Many companions were sad, because they wanted to enter Makkah. But the Prophet accepted, and Allah called it a clear victory.",
          ur: "پھر ایک صلح نامہ لکھا گیا: دس سال کا امن، مسلمان اگلے سال عمرہ کے لیے آئیں گے، اور جو چاہے کسی بھی طرف شامل ہو سکتا ہے۔ بہت سے صحابہ غمگین تھے کیونکہ وہ مکہ جانا چاہتے تھے۔ لیکن نبی نے قبول کیا، اور اللہ نے اسے واضح فتح کہا۔",
        },
        {
          en: "Allah said: \"Indeed, We have granted you a clear victory\" (Qur'an 48:1). The treaty opened doors of peace, and in the two years that followed, more people entered Islam than in all the years before. Peace was the Prophet's greatest weapon.",
          ur: "اللہ نے فرمایا: \"بیشک ہم نے تمہیں ایک واضح فتح دی\" (قرآن ۴۸:۱)۔ صلح نے امن کے دروازے کھول دیے، اور اگلے دو سالوں میں پہلے کے تمام سالوں سے زیادہ لوگ اسلام لائے۔ صلح نبی کا سب سے بڑا ہتھیار تھی۔",
        },
      ],
      ayahNote: {
        en: "Allah called the peace treaty of Hudaybiyyah a clear victory (Qur'an 48:1), and the pledge under the tree pleased Allah (Qur'an 48:18). Peace that opens hearts is a real victory.",
        ur: "اللہ نے حدیبیہ کی صلح کو واضح فتح کہا (قرآن ۴۸:۱)، اور درخت کے نیچے کی بیعت سے اللہ راضی ہوا (قرآن ۴۸:۱۸)۔ جو صلح دل کھول دے وہی سچی فتح ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 48:1-3",
          label: { en: "Allah calls the treaty of Hudaybiyyah a clear victory", ur: "اللہ حدیبیہ کی صلح کو واضح فتح کہتا ہے" },
          explanation: {
            en: "This surah was revealed after the treaty. It tells us that a peaceful agreement can be a bigger win than a battle.",
            ur: "یہ سورہ صلح کے بعد اتری۔ یہ بتاتی ہے کہ امن کا معاہدہ جنگ سے بڑی فتح ہو سکتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 48:18",
          label: { en: "Allah was pleased with the believers who pledged under the tree", ur: "اللہ مومنوں سے راضی ہوا جنہوں نے درخت کے نیچے بیعت کی" },
          explanation: {
            en: "The pledge of Ridwan under the tree was a promise of loyalty. Allah showed His love for those who keep their promise.",
            ur: "درخت کے نیچے بیعت رضوان وفا کا وعدہ تھا۔ اللہ نے ان لوگوں سے محبت ظاہر کی جو وعدہ نبھاتے ہیں۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari - the treaty of Hudaybiyyah",
          needsVerification: true,
          label: {
            en: "The hadith tells of the peace treaty and the believers' return in the following year",
            ur: "حدیث میں صلح حدیبیہ اور اگلے سال عمرہ کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "letters-to-kings",
      title: { en: "Letters to the Kings", ur: "بادشاہوں کے نام خطوط" },
      paragraphs: [
        {
          en: "After the treaty of peace, the Prophet wanted the whole world to hear about Islam. He sent letters with his trusted companions to the kings of the world, inviting them to worship Allah alone.",
          ur: "صلح کے بعد نبی چاہتے تھے کہ پوری دنیا اسلام کے بارے میں سنے۔ انہوں نے اپنے معتبر صحابیوں کے ہاتھوں دنیا کے بادشاہوں کو خط بھیجے اور انہیں صرف اللہ کی عبادت کی دعوت دی۔",
        },
        {
          en: "He wrote to Heraclius, the king of Rome, to Khosrow, the king of Persia, and to the Negus, the king of Abyssinia. Each letter began with the Prophet's seal and the gentle greeting: \"Peace be upon whoever follows the guidance.\"",
          ur: "انہوں نے روم کے بادشاہ ہرقل کو، فارس کے بادشاہ کسریٰ کو اور حبشہ کے بادشاہ نجاشی کو خط لکھے۔ ہر خط نبی کی مہر سے شروع ہوتا تھا اور نرم سلام سے: \"سلام اس پر جو ہدایت کی پیروی کرے۔\"",
        },
        {
          en: "In the letters, the Prophet called the people of the Book to the one word that unites everyone: \"Say: O People of the Book, come to a word common between us — that we worship none but Allah\" (Qur'an 3:64).",
          ur: "خطوط میں نبی نے اہل کتاب کو اس ایک کلمے کی دعوت دی جو سب کو جوڑتا ہے: \"کہہ دو: اے اہل کتاب، آؤ اس بات کی طرف جو ہمارے اور تمہارے درمیان مشترک ہے — کہ ہم اللہ کے سوا کسی کی عبادت نہ کریں\" (قرآن ۳:۶۴)۔",
        },
        {
          en: "Some kings welcomed the message with respect, and some tore the letter. But the news of Islam reached every corner of the earth. The Negus of Abyssinia was so moved that he accepted Islam with all his heart.",
          ur: "کچھ بادشاہوں نے پیغام کو عزت سے سنا اور کچھ نے خط پھاڑ دیا۔ لیکن اسلام کی خبر زمین کے کونے کونے تک پہنچ گئی۔ حبشہ کے بادشاہ نجاشی اس قدر متاثر ہوئے کہ انہوں نے پورے دل سے اسلام قبول کر لیا۔",
        },
        {
          en: "The letters taught the world a beautiful lesson: Islam is not only for one city or one people. It is a mercy for all the worlds, and every person is invited to its light.",
          ur: "خطوط نے دنیا کو ایک خوبصورت سبق سکھایا: اسلام صرف ایک شہر یا ایک قوم کے لیے نہیں۔ یہ تمام جہانوں کے لیے رحمت ہے اور ہر انسان اس کے نور کی دعوت رکھتا ہے۔",
        },
      ],
      ayahNote: {
        en: "The Prophet invited the kings with the verse of the common word (Qur'an 3:64): worship Allah alone and treat each other fairly. The message of Islam belongs to everyone.",
        ur: "نبی نے بادشاہوں کو کلمہ مشترک کی آیت سے دعوت دی (قرآن ۳:۶۴): صرف اللہ کی عبادت اور ایک دوسرے کے ساتھ انصاف۔ اسلام کا پیغام ہر ایک کے لیے ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:64",
          label: { en: "Allah tells the Prophet to invite the People of the Book to a word common between us", ur: "اللہ نبی کو حکم دیتا ہے کہ اہل کتاب کو مشترک کلمے کی دعوت دیں" },
          explanation: {
            en: "This verse is the heart of the letters: everyone, Muslim or not, can agree that we worship Allah alone and deal fairly with each other.",
            ur: "یہ آیت خطوط کا مرکز ہے: ہر شخص، مسلم ہو یا نہ ہو، اس بات پر متفق ہو سکتا ہے کہ صرف اللہ کی عبادت کریں اور ایک دوسرے کے ساتھ انصاف کریں۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari - the Prophet's letter to Heraclius",
          needsVerification: true,
          label: {
            en: "The hadith tells of Heraclius asking about the Prophet and reading his letter",
            ur: "حدیث میں ہرقل کے نبی کے بارے میں پوچھنے اور خط پڑھنے کا ذکر ہے",
          },
        },
        {
          type: "hadith",
          reference: "Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah) - the letters to the kings",
          needsVerification: true,
          label: {
            en: "The Seerah records the letters sent to the kings of Rome, Persia and Abyssinia",
            ur: "سیرت میں روم، فارس اور حبشہ کے بادشاہوں کو بھیجے گئے خطوط کا ذکر ہے",
          },
        },
      ],
    },
    {
      id: "conquest-of-mekka",
      title: { en: "The Conquest of Makkah", ur: "فتح مکہ" },
      paragraphs: [
        {
          en: "The people of Makkah broke the peace treaty, so the Prophet prepared to enter the city that had hurt him for so long. He marched with ten thousand believers, not to take revenge, but to bring peace.",
          ur: "مکہ والوں نے صلح توڑ دی، چنانچہ نبی نے اس شہر میں جانے کی تیاری کی جس نے انہیں اتنے سال ستایا تھا۔ وہ دس ہزار مومنین کے ساتھ چلے، بدلہ لینے کے لیے نہیں بلکہ امن لانے کے لیے۔",
        },
        {
          en: "Allah had announced it: \"When the victory of Allah has come and the conquest\" (Qur'an 110:1). The city of Makkah opened its doors, and the Prophet entered with his head lowered in humility to Allah.",
          ur: "اللہ نے پہلے ہی اعلان کر دیا تھا: \"جب اللہ کی مدد اور فتح آ جائے\" (قرآن ۱۱۰:۱)۔ مکہ نے اپنے دروازے کھول دیے اور نبی اللہ کے سامنے عاجزی کے ساتھ داخل ہوئے۔",
        },
        {
          en: "The Prophet entered the Kaaba and cleaned it from the idols. Then he stood before the people of Makkah, the people who had starved him, mocked him and thrown stones at him, and said the words that melted every heart: \"Go — you are free.\"",
          ur: "نبی کعبہ میں داخل ہوئے اور اسے بتوں سے صاف کیا۔ پھر وہ مکہ والوں کے سامنے کھڑے ہوئے، جنہوں نے انہیں بھوکا رکھا، مذاق اڑایا اور پتھر پھینکے، اور وہ الفاظ کہے جنہوں نے ہر دل پگھلا دیا: \"جاؤ — تم آزاد ہو۔\"",
        },
        {
          en: "The city that had hurt him the most expected punishment, but found mercy. Thousands of people entered Islam that day, and the Kaaba became the pure house of Allah again.",
          ur: "جس شہر نے انہیں سب سے زیادہ ستایا تھا وہ سزا کی توقع کر رہا تھا، لیکن اسے رحمت ملی۔ اس دن ہزاروں لوگ اسلام لائے اور کعبہ دوبارہ اللہ کا پاک گھر بن گیا۔",
        },
        {
          en: "That was the Prophet's greatest victory: not the conquest of a city, but the conquest of hearts. Forgiveness won what swords could never win.",
          ur: "یہ نبی کی سب سے بڑی فتح تھی: شہر کی فتح نہیں، دلوں کی فتح۔ معافی نے وہ جیت حاصل کی جو تلوار کبھی حاصل نہیں کر سکتی تھی۔",
        },
      ],
      ayahNote: {
        en: "Surah An-Nasr announced the victory and the conquest (Qur'an 110:1-3) and asked the Prophet to praise Allah for it. Mercy, not revenge, opened the city.",
        ur: "سورہ نصر نے فتح کی خبر دی (قرآن ۱۱۰:۱–۳) اور نبی کو اللہ کی حمد کی تلقین کی۔ رحمت نے شہر کھولا، انتقام نے نہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 110:1-3",
          label: { en: "Allah announces the victory and the conquest, and people entering Islam in crowds", ur: "اللہ فتح کا اعلان کرتا ہے اور لوگوں کے جھرمٹ میں اسلام لانے کا ذکر کرتا ہے" },
          explanation: {
            en: "This short surah is about the day Makkah opened its doors. It tells the Prophet to thank Allah, because the victory came from Allah alone.",
            ur: "یہ چھوٹی سورہ اس دن کے بارے میں ہے جب مکہ نے دروازے کھولے۔ یہ نبی کو اللہ کا شکر کرنے کو کہتی ہے کیونکہ فتح صرف اللہ کی طرف سے تھی۔",
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim - the Conquest of Makkah and the general amnesty",
          needsVerification: true,
          label: {
            en: "The hadith tells of the conquest of Makkah, the cleaning of the Kaaba and the words: you are free",
            ur: "حدیث میں فتح مکہ، کعبہ کی صفائی اور الفاظ کا ذکر ہے: تم آزاد ہو",
          },
        },
      ],
    },
    {
      id: "farewell-pilgrimage",
      title: { en: "The Farewell Pilgrimage", ur: "حج الوداع" },
      paragraphs: [
        {
          en: "In the tenth year after the hijrah, the Prophet announced that he would go to Makkah and perform the great pilgrimage of the House of Allah. The happy news spread quickly, and thousands of believers from every town joined him on the road.",
          ur: "ہجرت کے دسویں سال نبی کریم نے اعلان فرمایا کہ وہ مکہ جائیں گے اور اللہ کے گھر کا عظیم حج کریں گے۔ خوشی کی خبر تیزی سے پھیلی اور ہر شہر سے ہزاروں مومنین نبی کے ساتھ چلے۔"
        },
        {
          en: "Because this was the first and the last Hajj of the Prophet, he taught the people every rite with care: the tawaf around the Kaaba, the sa'i between Safa and Marwah, and the standing on the plain of Arafah. Everyone watched the Prophet and learned each rite from him.",
          ur: "چونکہ یہ نبی کا پہلا اور آخری حج تھا، نبی نے لوگوں کو ہر عمل سکھایا: کعبہ کا طواف، صفا اور مروہ کے درمیان سعی، اور عرفات کے میدان میں کھڑے ہونا۔ سب لوگ نبی کو دیکھتے تھے اور ہر عمل نبی سے سیکھتے تھے۔"
        },
        {
          en: "On the day of Arafah, Allah sent down a beautiful verse: \"This day I have perfected for you your religion and completed My favour upon you, and have chosen for you Islam as your religion\" (Qur'an 5:3). The religion of the Muslims was now complete.",
          ur: "عرفات کے دن اللہ نے خوبصورت آیت نازل فرمائی: \"آج میں نے تمہارے لیے تمہارا دین مکمل کر دیا اور تم پر اپنی نعمت پوری کر دی اور تمہارے لیے اسلام کو دین بنا کر پسند کیا\" (قرآن ۵:۳)۔ اس دن مسلمانوں کا دین مکمل ہو گیا۔"
        },
        {
          en: "Then the Prophet stood before the huge gathering and delivered the Farewell Address. He said: protect your lives, your wealth and your honour; be kind to your wives; and remember that all believers are brothers and sisters, and no one is better than another except in piety.",
          ur: "پھر نبی بڑے مجمع کے سامنے کھڑے ہوئے اور الوداع کا خطبہ دیا۔ آپ نے فرمایا: اپنی جان، اپنا مال اور اپنی عزت محفوظ رکھو؛ اپنی بیویوں کے ساتھ نرمی کرو؛ اور یاد رکھو کہ تمام مومنین بھائی بھائی ہیں اور کوئی کسی سے بہتر نہیں سوائے اس کے جو پرہیزگار ہو۔"
        },
        {
          en: "At the end the Prophet asked: \"O people, have I delivered the message?\" They answered together: \"Yes, we bear witness!\" Then the Prophet said: \"Let the one who is present tell the one who is absent.\" That was the Farewell Hajj — a precious farewell whose blessed words still guide the believers today.",
          ur: "آخر میں نبی نے پوچھا: \"اے لوگو، کیا میں نے پیغام پہنچا دیا؟\" سب نے ایک ساتھ جواب دیا: \"جی ہاں، ہم گواہ ہیں!\" پھر نبی نے فرمایا: \"جو حاضر ہے وہ غائب کو پیغام پہنچائے۔\" یہ الوداع کا حج تھا، ایک قیمتی الوداع جس کی برکت والی باتیں آج بھی مومنین کو راہ دکھاتی ہیں۔"
        }
      ],
      ayahNote: {
        en: "Surah Al-Ma'idah 5:3 was revealed during the Farewell Hajj on the day of Arafah. It announced that the religion of Islam was completed. This is the verse of the farewell: the message of the Prophet had been fully delivered.",
        ur: "سورہ المائدہ کی آیت ۵:۳ حج الوداع کے دوران عرفات کے دن نازل ہوئی۔ اس نے اعلان کیا کہ دین اسلام مکمل ہو گیا۔ یہ الوداع کی آیت ہے: نبی کا پیغام پوری طرح پہنچا دیا گیا۔"
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 5:3",
          label: { en: "Allah perfected the religion and completed His favour on the day of Arafah", ur: "اللہ نے عرفات کے دن دین مکمل کیا اور اپنی نعمت پوری کی" },
          explanation: {
            en: "A mighty verse revealed during the Farewell Hajj: it announced that the religion of the Muslims was made complete. Nothing was left missing; Allah had sent down every teaching the believers needed.",
            ur: "یہ عظیم آیت حج الوداع کے دوران نازل ہوئی: اس نے اعلان کیا کہ مومنین کا دین مکمل ہو گیا۔ کوئی چیز کم نہ رہی؛ اللہ نے ہر وہ تعلیم نازل کر دی جس کی مومنین کو ضرورت تھی۔"
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim - the Farewell Address",
          needsVerification: true,
          label: {
            en: "The Farewell Address: the Prophet asks the people if he has delivered the message",
            ur: "خطبہ الوداع: نبی لوگوں سے پوچھتے ہیں کہ کیا انہوں نے پیغام پہنچا دیا"
          },
        },
      ],
    },
    {
      id: "the-last-days",
      title: { en: "The Last Days", ur: "آخری دن" },
      paragraphs: [
        {
          en: "Not long after the Farewell Hajj, the Prophet fell ill. Even while he was sick, he kept helping the people and speaking to them with gentleness. The believers watched him with love and prayed for his health.",
          ur: "حج الوداع کے کچھ ہی عرصے بعد نبی بیمار پڑ گئے۔ بیماری میں بھی آپ لوگوں کی مدد کرتے رہے اور ان سے نرمی سے باتیں کرتے رہے۔ مومنین آپ کو محبت سے دیکھتے تھے اور آپ کی صحت کے لیے دعا کرتے تھے۔"
        },
        {
          en: "The illness grew heavier, and the Prophet asked Abu Bakr to lead the people in prayer. The companions understood that the end was near, and their hearts were filled with sorrow. Abu Bakr led the prayer while the Prophet lay weak and peaceful.",
          ur: "بیماری بڑھتی گئی اور نبی نے ابو بکر سے فرمایا کہ وہ لوگوں کو نماز پڑھائیں۔ صحابہ سمجھ گئے کہ وقت قریب ہے اور ان کے دل غم سے بھر گئے۔ ابو بکر نے نماز پڑھائی اور نبی کمزور ہو کر سکون سے لیٹے رہے۔"
        },
        {
          en: "Then the Prophet left this world, in his room, beside his blessed wife Aisha. The news spread and Madinah was filled with tears. Umar could not believe it at first, and he stood in the mosque, telling the people that the Prophet had not passed away.",
          ur: "پھر نبی اس دنیا سے رخصت ہو گئے۔ آپ اپنے حجرے میں تھے اور ان کی بابرکت بیوی عائشہ ان کے پاس تھیں۔ خبر پھیلی تو مدینہ آنسوؤں سے بھر گیا۔ عمر پہلے یقین نہیں کر پائے اور مسجد میں کھڑے ہو کر لوگوں سے کہتے رہے کہ نبی وفات نہیں پائے۔"
        },
        {
          en: "Then Abu Bakr stood and recited the verse of Allah: \"Muhammad is not but a messenger; messengers have passed on before him\" (Qur'an 3:144). He said: \"Whoever worshipped Muhammad, then Muhammad has passed away; but whoever worshipped Allah — Allah is Ever-Living and never dies.\" These words calmed every heart.",
          ur: "پھر ابو بکر کھڑے ہوئے اور اللہ کی آیت پڑھی: \"محمد ایک رسول ہی ہیں، ان سے پہلے بھی رسول گزر چکے ہیں\" (قرآن ۳:۱۴۴)۔ انہوں نے فرمایا: \"جس نے محمد کی عبادت کی تو محمد وفات پا گئے، لیکن جس نے اللہ کی عبادت کی تو اللہ زندہ ہے اور کبھی نہیں مرتا۔\" ان الفاظ نے ہر دل کو سکون دیا۔"
        },
        {
          en: "The believers realized the deep truth: the Prophet had delivered the message, and the religion of Allah was complete. They walked forward on the path he had taught them. The sun of the Prophet set, but the light of his message will never fade.",
          ur: "مومنین کو سمجھ آ گئی کہ نبی پیغام پہنچا چکے تھے اور اللہ کا دین مکمل تھا۔ وہ اسی راہ پر آگے بڑھتے رہے جو نبی نے سکھائی تھی۔ نبی کی زندگی کی شام ڈھلی مگر ان کے پیغام کا نور کبھی نہیں مٹے گا۔"
        }
      ],
      ayahNote: {
        en: "Surah Al-Imran 3:144 teaches that Muhammad is a messenger, and messengers before him have passed away. Believers should not stop worshipping Allah because of the passing of any man. That is why Abu Bakr recited this verse on the day the Prophet left this world.",
        ur: "سورہ آل عمران کی آیت ۳:۱۴۴ سکھاتی ہے کہ محمد ایک رسول ہیں اور ان سے پہلے بھی رسول گزر چکے ہیں۔ مومنین کو کسی انسان کے جانے کی وجہ سے اللہ کی عبادت نہیں چھوڑنی چاہیے۔ اسی لیے ابو بکر نے نبی کی رخصت والے دن یہ آیت پڑھی۔"
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:144",
          label: { en: "Muhammad is a messenger; messengers have passed away before him", ur: "محمد ایک رسول ہیں، ان سے پہلے بھی رسول گزر چکے ہیں" },
          explanation: {
            en: "This verse comforted the believers on the day the Prophet passed away: prophets are human beings, and human beings die. True faith is in Allah, who is Ever-Living and never dies.",
            ur: "یہ آیت نبی کی رخصت والے دن مومنین کو تسلی دیتی ہے: رسول انسان ہیں اور انسان مر جاتا ہے۔ سچا ایمان اللہ پر ہے جو زندہ ہے اور کبھی نہیں مرتا۔"
          },
        },
        {
          type: "hadith",
          reference: "Sahih al-Bukhari - the passing of the Prophet and Abu Bakr's words",
          needsVerification: true,
          label: {
            en: "Abu Bakr recites the verse of Aal-Imran and speaks the words that calmed the hearts",
            ur: "ابو بکر آل عمران کی آیت پڑھتے ہیں اور وہ الفاظ کہتے ہیں جنہوں نے دلوں کو سکون دیا"
          },
        },
      ],
    },
    {
      id: "mercy-to-the-worlds",
      title: { en: "A Mercy to All the Worlds", ur: "تمام جہانوں کے لیے رحمت" },
      paragraphs: [
        {
          en: "Why was the Prophet sent to the world? Allah answers in one beautiful verse: \"And We have not sent you except as a mercy to the worlds\" (Qur'an 21:107). He was mercy for the orphan, for the poor, for the traveller, for the animals, and for every child who reads his story.",
          ur: "نبی دنیا میں کیوں بھیجے گئے؟ اللہ ایک خوبصورت آیت میں جواب دیتا ہے: \"اور ہم نے آپ کو نہیں بھیجا مگر تمام جہانوں کے لیے رحمت بنا کر\" (قرآن ۲۱:۱۰۷)۔ آپ یتیم کے لیے رحمت تھے، غریب کے لیے رحمت، مسافر کے لیے رحمت، جانوروں کے لیے رحمت اور ہر اس بچے کے لیے رحمت جو آپ کی کہانی پڑھتا ہے۔"
        },
        {
          en: "Allah praised his character in the Qur'an: \"And indeed, you are of great moral character\" (Qur'an 68:4). His whole life was one long lesson in kindness — to the lonely, to the weak, to the sad and to the strangers.",
          ur: "اللہ نے قرآن میں آپ کے اخلاق کی تعریف کی: \"اور بیشک آپ عظیم اخلاق والے ہیں\" (قرآن ۶۸:۴)۔ آپ کی پوری زندگی نرمی کا ایک لمبا سبق تھی — تنہوں کے لیے، کمزوروں کے لیے، غمگینوں کے لیے اور اجنبیوں کے لیے۔"
        },
        {
          en: "The Prophet is the final messenger of Allah: \"Muhammad is not the father of any of your men, but he is the Messenger of Allah and the seal of the prophets\" (Qur'an 33:40). No messenger will come after him, and his message is for every land and every time.",
          ur: "نبی اللہ کے آخری رسول ہیں: \"محمد تمہارے مردوں میں سے کسی کے باپ نہیں، لیکن وہ اللہ کے رسول اور آخری نبی ہیں\" (قرآن ۳۳:۴۰)۔ آپ کے بعد کوئی رسول نہیں آئے گا اور آپ کا پیغام ہر ملک اور ہر زمانے کے لیے ہے۔"
        },
        {
          en: "So when you hear the name Muhammad, remember the mercy he brought: a light for the world, a hand for the weak, a smile for the sad, and a path to Allah for everyone. Peace and blessings be upon him and upon all the prophets of Allah.",
          ur: "چنانچہ جب آپ محمد کا نام سنیں تو وہ رحمت یاد کریں جو وہ لائے تھے: دنیا کے لیے روشنی، کمزوروں کے لیے ہاتھ، غمگینوں کے لیے مسکراہٹ اور ہر ایک کے لیے اللہ کا راستہ۔ آپ پر اور اللہ کے تمام نبیوں پر سلامتی اور برکتیں ہوں۔"
        }
      ],
      ayahNote: {
        en: "Surah Al-Anbiya 21:107 tells us the reason the Prophet was sent: he was mercy for all the worlds. His character was praised by Allah himself (68:4), and he is the seal of the prophets (33:40). To love him is to follow his mercy, his honesty and his kindness.",
        ur: "سورہ الانبیاء کی آیت ۲۱:۱۰۷ بتاتی ہے کہ نبی کو کیوں بھیجا گیا: وہ تمام جہانوں کے لیے رحمت تھے۔ اللہ نے خود ان کے اخلاق کی تعریف کی (قرآن ۶۸:۴) اور وہ آخری نبی ہیں (قرآن ۳۳:۴۰)۔ آپ سے محبت کا مطلب ہے آپ کی رحمت، سچائی اور نرمی پر چلنا۔"
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 21:107",
          label: { en: "The Prophet was sent as a mercy to the worlds", ur: "نبی تمام جہانوں کے لیے رحمت بنا کر بھیجے گئے" },
          explanation: {
            en: "This verse sums up the whole mission of the Prophet: he came to show mercy to all creation — to humans, to animals and to the whole world.",
            ur: "یہ آیت نبی کی پوری رسالت کا خلاصہ ہے: وہ تمام مخلوق پر رحمت بن کر آئے — انسانوں پر، جانوروں پر اور پوری دنیا پر۔"
          },
        },
        {
          type: "quran",
          reference: "Qur'an 68:4",
          label: { en: "Allah praises the great moral character of the Prophet", ur: "اللہ نبی کے عظیم اخلاق کی تعریف کرتا ہے" },
          explanation: {
            en: "Allah himself praised the character of the Prophet. This is the highest praise: the greatest man was also the kindest and the most truthful.",
            ur: "اللہ نے خود نبی کے اخلاق کی تعریف کی۔ یہ سب سے بڑی تعریف ہے: سب سے عظیم انسان سب سے زیادہ نرم اور سچا بھی تھا۔"
          },
        },
        {
          type: "quran",
          reference: "Qur'an 33:40",
          label: { en: "Muhammad is the final messenger and the seal of the prophets", ur: "محمد آخری رسول اور آخری نبی ہیں" },
          explanation: {
            en: "This verse teaches that the line of messengers ends with Muhammad. We follow his message, and no prophet will come after him.",
            ur: "یہ آیت سکھاتی ہے کہ رسالت کا سلسلہ محمد پر ختم ہوتا ہے۔ ہم انہیں کے پیغام پر چلتے ہیں اور ان کے بعد کوئی نبی نہیں آئے گا۔"
          },
        },
      ],
    },
  ],
};