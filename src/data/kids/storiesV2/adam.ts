import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Adam (AS) — the reference KidsStoryV2 implementation (Phase 3).
 *
 * Every other Prophet and Sahabi story copies this shape: a chapter list
 * where every chapter has 4–8 real narrative paragraphs and a non-empty
 * `sources` array. Quran-narrated events carry `type: "quran"` with the
 * actual verse; hadith is used only where a specific authentic hadith covers
 * the event. Anything whose citation was not confidently verified while
 * writing is marked `needsVerification: true` — never a guessed reference.
 *
 * `ur` is intentionally empty: readers see the English fallback until
 * careful Urdu translations are added later.
 *
 * Review sign-off: single-reviewer (site owner). Sources get `reviewed: true`
 * + `reviewedBy`/`reviewedDate` in batches; this is confirm-read sign-off,
 * not scholarly/ijazah certification.
 */
export const STORY_ADAM: KidsStoryV2 = {
  id: "adam",
  type: "prophet",
  nameArabic: "آدم",
  nameEnglish: "Prophet Adam",
  illustrationSymbol: "Leaf",
  accentColor: "#4caf6d",
  summary: {
    en: "The first man, created by Allah from clay and honored above the other creation. Adam slipped into a mistake, repented, and Allah forgave him. He became the first prophet and the father of all human beings.",
  },
  chapters: [
    {
      id: "creation",
      title: { en: "The Creation of Adam" },
      paragraphs: [
        {
          en: "Before Adam, there were the skies, the earth, the angels, and everything around them. But there was no human being yet. Then Allah decided to create a human being, and He told the angels: “Indeed, I am going to create a human being from clay” (Qur’an 38:71).",
        },
        {
          en: "So Allah shaped Adam from clay, and when He finished giving him a good shape, He breathed into him from His spirit. Allah said: “And when I have proportioned him and breathed into him of My spirit, then fall down to him in prostration” (Qur’an 38:72). At that moment the very first human being came to life.",
        },
        {
          en: "The Qur’an tells us that Allah “began the creation of humankind from clay” (Qur’an 32:8) and that He “perfected everything that He created” (Qur’an 32:7). Adam was never an accident — he was shaped slowly, carefully, and beautifully by his Lord.",
        },
        {
          en: "After creating Adam, Allah told the angels: “Indeed, I will place upon the earth a successor” (Qur’an 2:30). The angels asked why Allah would place people there who would cause trouble and shed blood, but Allah answered: “Indeed, I know that which you do not know” (Qur’an 2:30).",
        },
        {
          en: "Adam’s creation is a sign and a gift at the same time. The same Allah who shaped the first man from dust can create anything, and He gave Adam — and every child after him — a wonderful beginning.",
        },
      ],
      ayahNote: {
        en: "Allah made the first human being with His own hands from clay and breathed His spirit into him. Adam was not an accident — he was planned, shaped, and honored by Allah, and the angels were asked to honor him too.",
        ur: "اللہ نے پہلے انسان کو اپنے ہاتھوں سے مٹی سے بنایا اور اس میں اپنی روح پھونکی۔ آدم حادثہ نہیں تھے — اللہ نے انہیں خود بنایا، انہیں عزت دی، اور فرشتوں سے بھی کہا کہ وہ آدم کی عزت کریں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 38:71",
          label: { en: "Allah announces to the angels He will create a human being from clay", ur: "اللہ فرشتوں کو بتاتا ہے کہ وہ مٹی سے ایک انسان بنائے گا" },
          explanation: {
            en: "Before Adam existed, Allah told the angels His plan: He would make the first human from clay. This shows how special Adam was — his creation was announced by Allah Himself.",
            ur: "آدم کی پیدائش سے پہلے اللہ نے فرشتوں کو اپنا ارادہ بتایا کہ وہ مٹی سے پہلا انسان بنائے گا۔ اس سے پتہ چلتا ہے کہ آدم کتنے خاص تھے — اللہ نے خود ان کی تخلیق کا اعلان کیا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 38:72",
          label: { en: "Allah orders the angels to fall prostrate to Adam once He has perfected him and breathed from His spirit", ur: "اللہ فرشتوں کو حکم دیتا ہے کہ جب آدم کو مکمل کر دیا جائے اور ان میں اپنی روح پھونک دی جائے تو انہیں سجدہ کریں" },
          explanation: {
            en: "After shaping Adam beautifully, Allah breathed life into him. The angels were told to honor Adam, not to worship him — the bow was a way of honoring Allah's creation.",
            ur: "آدم کو خوبصورت شکل دینے کے بعد اللہ نے ان میں جان ڈالی۔ فرشتوں سے کہا گیا کہ آدم کی عزت کریں، ان کی عبادت نہیں — یہ جھکنا اللہ کی تخلیق کی عزت تھی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 32:8",
          label: { en: "Allah began the creation of humankind from clay and shaped Adam with His own care", ur: "اللہ نے انسانوں کی تخلیق مٹی سے شروع کی اور آدم کو اپنی محبت سے شکل دی" },
          explanation: {
            en: "Every human being came from the same beginning: clay shaped by Allah. This tells us that all people are equal — everyone's first parents were made by the same Creator.",
            ur: "ہر انسان کی شروعات ایک جیسی ہے: اللہ نے سب کو مٹی سے بنایا۔ اس سے معلوم ہوتا ہے کہ سب انسان برابر ہیں — سب کے پہلے ماں باپ کو اسی خالق نے بنایا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 2:30",
          label: { en: "Allah tells the angels He is placing a successor on the earth who will cause trouble and shed blood", ur: "اللہ فرشتوں کو بتاتا ہے کہ وہ زمین پر ایک جانشین بنائے گا اور فرشتے کہتے ہیں کہ وہاں لوگ فساد اور خونریزی کریں گے" },
          explanation: {
            en: "The angels wondered why people would live on earth and cause trouble, but Allah knew a beautiful secret: humans would also be prophets, worshippers, and builders of goodness.",
            ur: "فرشتوں نے سوچا کہ زمین پر ایسے لوگ کیوں آئیں گے جو فساد کریں گے، لیکن اللہ ایک خوبصورت راز جانتا تھا: انسانوں میں انبیاء، عبادت کرنے والے اور نیکی کرنے والے بھی ہوں گے۔",
          },
        },
      ],
    },
    {
      id: "names",
      title: { en: "The Knowledge of the Names" },
      paragraphs: [
        {
          en: "Adam had something very special: Allah taught him the names of everything. The Qur’an says: “And He taught Adam the names, all of them” (Qur’an 2:31). Nothing in the world was hidden from him, because Allah had shared some of His own knowledge with him.",
        },
        {
          en: "To show how great this gift was, Allah showed those things to the angels and asked them: “Tell Me the names of these, if you are truthful?” (Qur’an 2:31). But the angels, even though they are noble and pure, replied: “Glory be to You! We have no knowledge except what You have taught us” (Qur’an 2:32).",
        },
        {
          en: "Then Allah said: “O Adam, inform them of their names” (Qur’an 2:33). And Adam told them every name — the names of everything Allah had placed before them.",
        },
        {
          en: "This was a great honor for Adam. It also teaches us something lovely: learning is a gift from Allah. Every time we learn a new word, we are using a little bit of the wonderful gift Allah gave to the very first human being.",
        },
      ],
      ayahNote: {
        en: "Allah gave Adam a gift no one else had: the knowledge of all names. Learning is a gift from Allah, and every new word a child learns is part of the same beautiful gift.",
        ur: "اللہ نے آدم کو ایسا تحفہ دیا جو کسی اور کو نہیں ملا: سب چیزوں کے ناموں کا علم۔ علم اللہ کا تحفہ ہے، اور ہر نیا لفظ جو بچہ سیکھتا ہے وہ اسی خوبصورت تحفے کا حصہ ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 2:31",
          label: { en: "Allah teaches Adam the names of all things, then presents them to the angels", ur: "اللہ آدم کو سب چیزوں کے نام سکھاتا ہے اور پھر وہ چیزیں فرشتوں کے سامنے پیش کرتا ہے" },
          explanation: {
            en: "Adam knew the names of everything because Allah taught him. This made Adam a teacher even of the angels — knowledge was his first honor.",
            ur: "آدم کو ہر چیز کے نام معلوم تھے کیونکہ اللہ نے انہیں سکھائے تھے۔ اس سے آدم فرشتوں کے بھی استاد بن گئے — علم ہی ان کی پہلی عزت تھی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 2:32",
          label: { en: "The angels reply that they know only what Allah has taught them", ur: "فرشتے جواب دیتے ہیں کہ ہم صرف وہی جانتے ہیں جو آپ نے ہمیں سکھایا" },
          explanation: {
            en: "The angels answered humbly: we know nothing except what Allah taught us. Humility is the way of Allah's best servants.",
            ur: "فرشتوں نے عاجزی سے جواب دیا: ہم صرف وہی جانتے ہیں جو اللہ نے سکھایا۔ عاجزی اللہ کے بہترین بندوں کی نشانی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 2:33",
          label: { en: "Adam informs the angels of the names at Allah's command", ur: "اللہ کے حکم سے آدم فرشتوں کو سب چیزوں کے نام بتاتے ہیں" },
          explanation: {
            en: "At Allah's command, Adam told the angels every name. This was proof of Allah's mercy: He shared His knowledge with the first human being.",
            ur: "اللہ کے حکم سے آدم نے فرشتوں کو سارے نام بتا دیے۔ یہ اللہ کے فضل کا ثبوت تھا: اللہ نے اپنا علم پہلے انسان کے ساتھ بانٹا۔",
          },
        },
      ],
    },
    {
      id: "angels-bow",
      title: { en: "Angels Bow, Iblis Refuses" },
      paragraphs: [
        {
          en: "After the angels saw Adam name everything, Allah asked them to bow down their heads before Adam — not to worship him, but to honor what Allah had created. Allah said: “And when We said to the angels: prostrate yourselves to Adam, and they prostrated, except Iblis” (Qur’an 2:34).",
        },
        {
          en: "Every single angel obeyed that command. But Iblis refused. He said: “You created me from fire, and You created him from clay — I am better than him” (Qur’an 38:76). Because of his pride, he would not follow Allah’s order.",
        },
        {
          en: "Pride was Iblis’s biggest mistake. He thought he was better than Adam just because he came from fire and Adam came from clay. So Allah said: “Depart from here, for you are rejected” (Qur’an 38:78).",
        },
        {
          en: "Iblis asked Allah to keep him alive until the Day of Judgment, and Allah allowed it. Then Iblis made a promise: “I will surely lead Your servants astray” — but he had to admit: “except for Your chosen servants among them” (Qur’an 38:82–83).",
        },
        {
          en: "This is why Adam is so special: Allah chose him and honored him. And it teaches us how dangerous pride is. The moment we start thinking we are better than others, we should remember how pride sent Iblis away from Allah’s mercy.",
        },
      ],
      ayahNote: {
        en: "Every angel obeyed Allah's command to honor Adam — only Iblis refused, because he was proud. This chapter teaches the most dangerous lesson: pride can turn even the best worshipper away from Allah.",
        ur: "ہر فرشتے نے اللہ کا حکم مانا اور آدم کی عزت کی — صرف ابلیس نے انکار کیا، کیونکہ وہ مغرور تھا۔ یہ باب سب سے خطرناک سبق سکھاتا ہے: تکبر انسان کو اللہ سے دور کر سکتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 2:34",
          label: { en: "Allah commands the angels to bow before Adam; all do except Iblis", ur: "اللہ فرشتوں کو حکم دیتا ہے کہ آدم کے آگے جھکیں؛ سب جھکتے ہیں مگر ابلیس نہیں جھکتا" },
          explanation: {
            en: "The angels bowed to honor Adam because Allah commanded it. Obeying Allah is always right, even when we do not fully understand why.",
            ur: "فرشتے اللہ کے حکم سے آدم کے سامنے جھکے۔ اللہ کی اطاعت ہمیشہ درست ہے، چاہے ہم حکم کی حکمت پوری طرح نہ سمجھیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 38:76",
          label: { en: "Iblis refuses, claiming he was created from fire and Adam from clay", ur: "ابلیس انکار کرتا ہے اور کہتا ہے کہ میں آگ سے بنایا گیا ہوں اور آدم مٹی سے" },
          explanation: {
            en: "Iblis compared himself with Adam and said: I am better. Comparing yourself with others makes you forget who really matters — Allah.",
            ur: "ابلیس نے اپنا موازنہ آدم سے کیا اور کہا کہ میں بہتر ہوں۔ دوسروں سے موازنہ کرنے والا بھول جاتا ہے کہ اصل فیصلہ اللہ کرتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 38:78",
          label: { en: "Allah banishes Iblis as rejected and accursed", ur: "اللہ ابلیس کو رد شدہ اور لعنت کیا ہوا بنا کر نکال دیتا ہے" },
          explanation: {
            en: "Allah removed Iblis from His mercy because of his pride. One moment of arrogance cost him everything — this is how serious pride is.",
            ur: "اللہ نے تکبر کی وجہ سے ابلیس کو اپنی رحمت سے دور کر دیا۔ ایک لمحے کا تکبر اسے سب کچھ کھا گیا — یہ بتاتا ہے کہ تکبر کتنا بڑا گناہ ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 38:82–83",
          label: { en: "Iblis vows to mislead Allah's servants except the sincere chosen ones", ur: "ابلیس قسم کھاتا ہے کہ وہ اللہ کے بندوں کو گمراہ کرے گا سوائے ان مخلص اور چنے ہوئے بندوں کے" },
          explanation: {
            en: "Iblis promised to lead people away from Allah, but he could not touch the sincere believers. This is why we call on Allah in every prayer.",
            ur: "ابلیس نے قسم کھائی کہ وہ لوگوں کو اللہ کی راہ سے ہٹائے گا، لیکن وہ مخلص لوگوں کو گمراہ نہیں کر سکتا۔ اسی لیے ہم ہر نماز میں اللہ سے مدد مانگتے ہیں۔",
          },
        },
      ],
    },
    {
      id: "paradise",
      title: { en: "Life in Paradise" },
      paragraphs: [
        {
          en: "Allah said to Adam: “O Adam, dwell you and your wife in the Garden, and eat from wherever you wish” (Qur’an 2:35). So Adam and Hawwa (Eve) lived in the beautiful Garden Allah had created — a place with no hunger, no cold, and no fear.",
        },
        {
          en: "In Paradise, Adam never felt thirsty, never got uncomfortably hot, and never knew worry. Allah promised: “Truly it is for you that you will not be hungry therein or be unclothed, and that you will not be thirsty therein or be harmed by the heat of the sun” (Qur’an 20:118–119).",
        },
        {
          en: "Allah gave Adam and his wife only one simple rule: “Do not approach this tree, or you will be among the wrongdoers” (Qur’an 2:35). They could eat anything else — but this one tree was a test, a gentle reminder to obey their Creator.",
        },
        {
          en: "So the first days of humankind were peaceful. Adam and Hawaa had everything, and all that was asked of them was to obey the one command from the One who gave them the Garden.",
        },
      ],
      ayahNote: {
        en: "Paradise was a perfect home — no hunger, no thirst, no fear. Allah gave Adam and Hawaa everything and asked only one thing: to obey His one command.",
        ur: "جنت ایک کامل گھر تھا — نہ بھوک، نہ پیاس، نہ خوف۔ اللہ نے آدم اور حوا کو سب کچھ دیا اور صرف ایک چیز مانگی: اپنے ایک حکم کی اطاعت۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 2:35",
          label: { en: "Allah settles Adam and his wife in the Garden and points out the one forbidden tree", ur: "اللہ آدم اور ان کی بیوی کو جنت میں بساتا ہے اور ایک منع کی گئی درخت کے بارے میں بتاتا ہے" },
          explanation: {
            en: "Adam and Hawaa could eat everything in Paradise except for the one forbidden tree. Allah's rules are like a fence that keeps us safe — His commands are always for our good.",
            ur: "آدم اور حوا جنت کی ہر چیز کھا سکتے تھے سوائے ایک منع کی گئی درخت کے۔ اللہ کے حکم ہماری حفاظت کے لیے ہوتے ہیں — اللہ جو حکم دیتا ہے وہ ہمارے فائدے کے لیے دیتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 20:118–119",
          label: { en: "Allah promises Adam he will not go hungry, unclothed, thirsty or scorched in the Garden", ur: "اللہ آدم سے وعدہ کرتا ہے کہ جنت میں نہ بھوک لگے گی، نہ ننگا پن، نہ پیاس اور نہ دھوپ کی گرمی" },
          explanation: {
            en: "Allah gave Adam a beautiful promise: in Paradise there is no pain. This shows how much Allah loves His creation.",
            ur: "اللہ نے آدم سے خوبصورت وعدہ کیا: جنت میں کوئی تکلیف نہیں ہوگی۔ اس سے پتہ چلتا ہے کہ اللہ اپنی مخلوق سے کتنا پیار کرتا ہے۔",
          },
        },
      ],
    },
    {
      id: "test",
      title: { en: "The Test of the Tree" },
      paragraphs: [
        {
          en: "Iblis was waiting for his chance. He came to Adam and his wife and said: “O Adam, shall I lead you to the tree of eternity and a kingdom that never decays?” (Qur’an 20:120). He whispered softly to make them forget the one simple rule.",
        },
        {
          en: "In a moment of weakness, Adam and his wife both forgot the command. The Qur’an says: “Adam disobeyed his Lord, and he became confused with misguidance” (Qur’an 20:121).",
        },
        {
          en: "At once they felt ashamed. Their bodies exposed, and they began to cover themselves with leaves from the Garden (Qur’an 20:121). They understood that they had done something wrong against their kind Lord.",
        },
        {
          en: "Adam and Hawaa learned an important lesson: Iblis is a clear enemy of human beings. This is why Allah warns us again and again in the Qur’an (Qur’an 2:208). And in the same way Shaytan came to Adam and his wife, taking them away from their Lord.",
        },
        {
          en: "This chapter teaches us that even the best human being can slip. What matters after a mistake is what we do next — and Adam will show us in the final chapters how to come back to Allah.",
        },
      ],
      ayahNote: {
        en: "Iblis did not come with a sword — he came with soft whispering. Adam and Hawaa slipped, and they felt deep shame. The lesson of this chapter is that even the best can slip; what matters is what we do after the mistake.",
        ur: "ابلیس تلوار لے کر نہیں آیا — وہ نرم باتوں کے ساتھ آیا۔ آدم اور حوا نے غلطی کی اور وہ شرمندہ ہوئے۔ اس باب کا سبق یہ ہے کہ سب سے اچھے انسان سے بھی غلطی ہو سکتی ہے؛ اصل بات یہ ہے کہ غلطی کے بعد ہم کیا کرتے ہیں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 20:120",
          label: { en: "Iblis whispers to Adam, tempting him toward the tree of eternity and an endless kingdom", ur: "ابلیس آدم کو دھیرے سے بتاتا ہے کہ وہ انہیں ہمیشہ کی زندگی اور کبھی ختم نہ ہونے والی بادشاہی کا درخت بتائے" },
          explanation: {
            en: "Iblis tricked Adam by promising something eternal and endless. Shaytan's promises always sound sweet, but they lead us away from Allah.",
            ur: "ابلیس نے آدم کو دھوکہ دیا اور ہمیشہ کی زندگی اور ختم نہ ہونے والی بادشاہی کا وعدہ کیا۔ شیطان کے وعدے میٹھے لگتے ہیں، لیکن وہ اللہ سے دور لے جاتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 20:121",
          label: { en: "Adam and his wife eat from the tree, disobeying the one command", ur: "آدم اور ان کی بیوی درخت کا پھل کھاتے ہیں اور ایک ہی حکم کی خلاف ورزی کرتے ہیں" },
          explanation: {
            en: "Adam and Hawaa forgot Allah's command and ate from the tree. Immediately they felt ashamed and knew they had made a mistake.",
            ur: "آدم اور حوا اللہ کا حکم بھول گئے اور درخت کا پھل کھا لیا۔ انہیں فوراً شرم آئی اور انہیں معلوم ہوا کہ ان سے غلطی ہوئی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 2:208",
          label: { en: "Allah warns humankind that Shaytan is a clear enemy and to follow Him fully", ur: "اللہ انسانوں کو خبردار کرتا ہے کہ شیطان کھلا دشمن ہے اور یہ کہ مکمل طور پر اللہ کی پیروی کرو" },
          explanation: {
            en: "Allah tells us plainly: Shaytan is your enemy. Knowing our enemy is the first step to staying safe from his tricks.",
            ur: "اللہ ہمیں صاف کہہ دیتا ہے کہ شیطان تمہارا دشمن ہے۔ دشمن کو پہچاننا ہی اس کے چالوں سے بچنے کا پہلا قدم ہے۔",
          },
        },
      ],
    },
    {
      id: "descent",
      title: { en: "Coming Down to Earth" },
      paragraphs: [
        {
          en: "After the slip, Allah said to Adam and his wife: “Get down from here, some of you are enemies of others” (Qur’an 2:38). So Adam and Hawaa left the Garden and came to the earth — the home we all live in today.",
        },
        {
          en: "It must have felt strange and sad to leave such a beautiful Garden. But Allah did not leave them without comfort. Allah taught them the way back: “Whoever follows My guidance, no fear shall be upon them, nor will they grieve” (Qur’an 2:38).",
        },
        {
          en: "That is the great promise: the earth would not be random. Allah was sending guidance — prophets, books, and the knowledge of what Allah loves — so that every human being could stay safe, and so that Adam’s children could never be truly lost.",
        },
        {
          en: "Adam and Hawaa began their new life on the earth. They became the parents of all people, a human family that remembers a beginning, and learns the important lesson that our true home is forever with Allah.",
        },
      ],
      ayahNote: {
        en: "Leaving the Garden was sad, but Allah did not leave Adam alone — He sent guidance so that whoever follows it will never fear or grieve. The earth became the place to learn and to return to Allah.",
        ur: "جنت چھوڑنا دکھ بھرا تھا، لیکن اللہ نے آدم کو اکیلا نہیں چھوڑا — اس نے ہدایت بھیجی تاکہ جو اس پر چلے وہ نہ ڈرے اور نہ غمگین ہو۔ زمین سیکھنے اور اللہ کی طرف لوٹنے کی جگہ بنی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 2:38",
          label: { en: "Allah sends Adam and his wife down from the Garden and promises guidance for whoever follows it", ur: "اللہ آدم اور ان کی بیوی کو جنت سے نیچے بھیجتا ہے اور ہدایت کا وعدہ کرتا ہے جو اس پر چلے" },
          explanation: {
            en: "Even as Adam left Paradise, Allah gave him the way back: guidance. Whoever follows it will have no fear and no grief.",
            ur: "جنت سے اترتے وقت ہی اللہ نے آدم کو واپسی کا راستہ دیا: ہدایت۔ جو اس پر چلے گا اسے نہ ڈر ہوگا نہ غم۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 7:24",
          label: { en: "Allah drives Adam and his wife out to the earth for a limited stay", ur: "اللہ آدم اور ان کی بیوی کو ایک مقررہ وقت تک کے لیے زمین پر اتارتا ہے" },
          explanation: {
            en: "Life on earth is not forever — it is a short stay. Allah told Adam that the earth is temporary, and the real home is with Allah.",
            ur: "زمین پر زندگی ہمیشہ کے لیے نہیں — یہ تھوڑے دنوں کی قیام ہے۔ اللہ نے آدم کو بتایا کہ زمین عارضی ہے اور اصل گھر اللہ کے پاس ہے۔",
          },
        },
      ],
    },
    {
      id: "repentance",
      title: { en: "Adam Repents, and Allah Forgives" },
      paragraphs: [
        {
          en: "Adam felt very sorry for what he had done. So he and his wife called from their hearts with a beautiful prayer: “Our Lord! We have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers” (Qur’an 7:23).",
        },
        {
          en: "Allah answered their prayer. The Qur’an says: “Then Adam received from his Lord words of forgiveness, and He turned to him with mercy. Indeed, He is the Ever-Returning, the Most Merciful” (Qur’an 2:37).",
        },
        {
          en: "Allah did not just forgive Adam — He chose him and guided him. The Word of Allah continues: “Then his Lord chose him, and He turned to him with forgiveness, and He guided him” (Qur’an 20:122). So Adam, whose slip looked so big, became one of the noble chosen prophets of Allah.",
        },
        {
          en: "Adam taught his children the most important lesson for when we make mistakes: admit it, say that we have done wrong, and return to Allah from the heart. Allah, the Most Merciful, is always ready to forgive those who truly turn back to Him.",
        },
      ],
      ayahNote: {
        en: "Adam made a mistake, but he did not run away — he came back to Allah with a humble prayer. Allah forgave him, chose him, and guided him. This is the most beautiful lesson of the story: Allah's mercy is bigger than any mistake.",
        ur: "آدم سے غلطی ہوئی، لیکن انہوں نے بھاگ کر نہیں — وہ عاجزی سے دعا کرتے ہوئے اللہ کی طرف لوٹے۔ اللہ نے انہیں معاف کیا، چن لیا اور ہدایت دی۔ یہ کہانی کا سب سے خوبصورت سبق ہے: اللہ کی رحمت ہر غلطی سے بڑی ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 7:23",
          label: { en: "Adam and his wife pray, admitting they have wronged themselves and beg for mercy", ur: "آدم اور ان کی بیوی دعا کرتے ہیں، یہ مانتے ہوئے کہ ہم نے اپنی جانوں پر ظلم کیا اور اللہ سے رحمت کی بھیک مانگتے ہیں" },
          explanation: {
            en: "Adam and Hawaa's prayer shows us how to say sorry to Allah: admit the mistake, ask forgiveness, and ask for mercy.",
            ur: "آدم اور حوا کی دعا ہمیں سکھاتی ہے کہ اللہ سے معافی کیسے مانگیں: غلطی مانو، معافی مانگو اور رحمت مانگو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 2:37",
          label: { en: "Adam receives words from his Lord and Allah turns to him in mercy and accepts his repentance", ur: "آدم اپنے رب کی طرف سے کلمات حاصل کرتے ہیں اور اللہ ان پر رحمت سے متوجہ ہوتا ہے اور ان کی توبہ قبول کرتا ہے" },
          explanation: {
            en: "Allah taught Adam the words of repentance and accepted his prayer. Allah is always ready to forgive the one who truly turns back to Him.",
            ur: "اللہ نے آدم کو توبہ کے کلمات سکھائے اور ان کی دعا قبول کی۔ جو سچے دل سے اللہ کی طرف لوٹتا ہے، اللہ اسے معاف کرنے کے لیے ہمیشہ تیار ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur’an 20:122",
          label: { en: "Allah chooses Adam and guides him after forgiving him", ur: "اللہ آدم کو چن لیتا ہے اور انہیں معاف کرنے کے بعد ہدایت دیتا ہے" },
          explanation: {
            en: "After the mistake and the repentance, Allah did something amazing — He chose Adam as a prophet. A forgiven mistake can turn into an honor.",
            ur: "غلطی اور توبہ کے بعد اللہ نے حیرت انگیز کام کیا — اس نے آدم کو نبی چن لیا۔ معاف شدہ غلطی عزت بن سکتی ہے۔",
          },
        },
      ],
    },
    {
      id: "first-prophet",
      title: { en: "Adam, the First Prophet" },
      paragraphs: [
        {
          en: "Adam is called the father of all human beings. He is also honored as the very first prophet — the first person Allah chose to lead his family and the people after him toward the worship of Allah alone.",
        },
        {
          en: "Adam carried the message with a gentle heart. Allah taught him everything he needed to live on the earth, to grow food, to speak kindly, and to care for the children Allah gave him.",
        },
        {
          en: "Adam and Hawaa raised their family on earth. Their children learned from them that everyone is equal, and that we all come from one mother and one father. That is why the Qur’an reminds us: “O mankind, indeed We created you from a male and a female and made you into nations and tribes, so that you may know one another” (Qur’an 49:13).",
        },
        {
          en: "Prophet Muhammad, peace and blessings be upon him, reminded us how great Adam is. Adam is the very first human being, the first prophet, and the father of all later prophets. His story — from the honored clay, to the Garden, to the slip, and to the mercy of Allah — is the doorway through which all the other prophets followed.",
        },
        {
          en: "So when we look at the world Allah made, we can remember Adam’s story. His life whispers: do not fall into the pride of Iblis, and whenever you slip, the mercy of Allah is bigger than any mistake.",
        },
      ],
      ayahNote: {
        en: "Adam is the father of all people and the first prophet. Surah Al-Hujurat tells every child: all human beings come from one father and one mother — so everyone is family, and no one is better than another except by goodness.",
        ur: "آدم سب لوگوں کے باپ اور پہلے نبی ہیں۔ سورہ الحجرات ہر بچے کو بتاتی ہے: تمام انسان ایک ہی باپ اور ایک ہی ماں سے ہیں — اس لیے سب رشتہ دار ہیں، اور کوئی کسی سے بہتر نہیں سوائے نیکی کے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur’an 49:13",
          label: { en: "Allah created every human from a single man and woman, making nations and tribes so they may know one another", ur: "اللہ نے ہر انسان کو ایک مرد اور ایک عورت سے بنایا اور قومیں اور قبیلے بنائے تاکہ لوگ ایک دوسرے کو پہچانیں" },
          explanation: {
            en: "All people — in every country, with every color — come from Adam and Hawaa. Allah made different nations and tribes so we can know each other, not to feel better than one another.",
            ur: "تمام لوگ — ہر ملک کے، ہر رنگ کے — آدم اور حوا سے ہیں۔ اللہ نے قومیں اور قبیلے بنائے تاکہ ہم ایک دوسرے کو پہچانیں، نہ کہ ایک دوسرے سے بڑا بنیں۔",
          },
        },
        { type: "hadith", reference: "Sahih al-Bukhari; Sahih Muslim", needsVerification: true, label: { en: "The Prophet (PBUH) describes Adam as the first human being and the father of all people", ur: "نبی کریم ﷺ نے آدم کو پہلا انسان اور تمام لوگوں کا باپ بتایا" } },
      ],
    },
  ],
};