import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Musa (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The greatest and longest of the prophet stories: the baby in a basket under
 * Pharaoh's cruelty, the raising in the royal home, the flight to Madyan, the
 * calling at the burning bush, the battle of signs before Pharaoh, the parting
 * of the sea, the tablets and the golden calf, and the lesson of Kalimullah.
 * Anchored to the true Musa verses: Surah Taha (20:11–80), Al-Qasas (28:4–29),
 * Al-A'raf (7:130–151), Ash-Shu'ara (26:52–67), Al-Baqarah (2:51–53) and
 * An-Nisa (4:164).
 * Fully bilingual (English + Urdu) per the Phase 12 bilingual standard.
 */
export const STORY_MUSA: KidsStoryV2 = {
  id: "musa",
  type: "prophet",
  nameArabic: "موسى",
  nameEnglish: "Musa (Moses)",
  illustrationSymbol: "Waves",
  accentColor: "#2f8f9d",
  summary: {
    en: "Musa was a baby who should never have survived — a cruel king was hunting every baby boy. But Allah put him in a basket on the river, and even the king's own house raised him. Allah made him a messenger, gave him nine signs, and split the sea for him. His story teaches us that the plan of Allah is always greater than the power of any king.",
    ur: "موسیٰ علیہ السلام ایک ایسا بچہ تھا جس کا زندہ رہنا ناممکن لگتا تھا — ایک ظالم بادشاہ ہر لڑکے کو ڈھونڈ کر مار ڈالتا تھا۔ لیکن اللہ نے اُسے دریا میں ایک ٹوکرے کے اندر بہا دیا، اور بادشاہ کے اپنے گھر نے ہی اُسے پالا۔ اللہ نے اُسے رسول بنایا، نو نشانیاں عطا کیں اور اُس کے لیے سمندر دو حصوں میں تقسیم کر دیا۔ اُس کی کہانی ہمیں سکھاتی ہے کہ اللہ کا منصوبہ کسی بھی بادشاہ کی طاقت سے ہمیشہ بڑا ہوتا ہے۔",
  },
  chapters: [
    {
      id: "a-baby-in-a-basket",
      title: { en: "A Baby in a Basket", ur: "ٹوکرے میں ایک بچہ" },
      paragraphs: [
        {
          en: "Many, many years ago there lived a very cruel king called Pharaoh. The Qur'an tells us how he treated his people: \"Indeed, Pharaoh was haughty in the land and made its people factions — he oppressed one group among them, slaughtering their sons and keeping alive their women\" (Qur'an 28:4). He was afraid a boy would take his kingdom, so he killed every baby boy he could.",
          ur: "بہت بہت سال پہلے فرعون نام کا ایک بہت ظالم بادشاہ رہتا تھا۔ قرآن ہمیں بتاتا ہے کہ وہ اپنی قوم کے ساتھ کیسا سلوک کرتا تھا: \"بیشک فرعون زمین میں سرکش ہو گیا اور اُس نے وہاں کے لوگوں کو گروہوں میں تقسیم کر دیا — ایک گروہ کو کمزور کر رکھا تھا، اُس کے بیٹوں کو ذبح کرتا اور اُس کی عورتوں کو زندہ رکھتا\" (قرآن 28:4)۔ اُسے ڈر تھا کہ کوئی لڑکا پیدا ہو کر اُس کی سلطنت چھین لے گا، اِس لیے وہ ہر لڑکے کو مار ڈالتا تھا۔",
        },
        {
          en: "In this world of fear, a baby was born into a home that believed in Allah. His mother was a noble woman, and her heart broke when she thought of him being taken away. Allah knew her fear, so He sent her a wonderful secret. The Qur'an says: \"And We inspired the mother of Musa: 'Suckle the child, and when you fear for him, cast him into the river, and do not fear and do not grieve — indeed, We are returning him to you and making him one of the messengers'\" (Qur'an 28:7).",
          ur: "اس ڈر بھری دنیا میں ایک ایسے گھر میں ایک بچہ پیدا ہوا جو اللہ پر ایمان رکھتا تھا۔ اُس کی ماں ایک شریف خاتون تھیں، اور جب بھی وہ اپنے بچے کے چھن جانے کا سوچتیں تو اُن کا دل ٹوٹ جاتا۔ اللہ نے اُن کا خوف جانا اور اُنہیں ایک خوبصورت راز بتایا۔ قرآن کہتا ہے: \"اور ہم نے موسیٰ کی ماں کو حکم دیا: 'اُسے دودھ پلاؤ، اور جب تمہیں اُس پر ڈر ہو تو اُسے دریا میں ڈال دو، اور نہ ڈرو اور نہ غم کرو — بیشک ہم اُسے تمہاری طرف لوٹانے والے ہیں اور اُسے پیغمبروں میں سے بنانے والے ہیں'\" (قرآن 28:7)۔",
        },
        {
          en: "So the mother did a brave and difficult thing. With tears in her eyes, she placed her baby in a small basket and let it float on the river. The basket drifted on the water until the waves carried it to the shore of the royal palace. The Qur'an says: \"And the family of Pharaoh picked him up\" (Qur'an 28:8). Nobody knew that inside that little basket was the boy who would one day face the king.",
          ur: "چنانچہ ماں نے ایک بڑی ہمت والا کام کیا۔ آنکھوں میں آنسو لیے اُس نے اپنے بچے کو ایک چھوٹے سے ٹوکرے میں رکھا اور اُسے دریا کے پانی پر بہا دیا۔ ٹوکرا پانی پر تیرتا رہا یہاں تک کہ موجیں اُسے لے کر شاہی محل کے کنارے پر لے آئیں۔ قرآن کہتا ہے: \"اور فرعون کے گھر والوں نے اُسے (دریا سے) اٹھا لیا\" (قرآن 28:8)۔ کسی کو معلوم نہ تھا کہ اُس چھوٹے سے ٹوکرے کے اندر وہ لڑکا ہے جو ایک دن بادشاہ کے سامنے کھڑا ہو گا۔",
        },
        {
          en: "Allah had also inspired the mother with a beautiful promise, and it was already spoken in the message from the beginning: \"We will return him to you and make him one of the messengers\" (Qur'an 28:7). The same river that seemed so frightening became the ship that carried Musa to safety. Nothing that Allah plans can ever be stopped by a king's order.",
          ur: "اللہ نے ماں کو شروعات ہی سے ایک خوبصورت وعدہ دیا تھا: \"ہم اُسے تمہاری طرف لوٹا دیں گے اور اُسے رسولوں میں سے بنائیں گے\" (قرآن 28:7)۔ وہی دریا جو بہت ڈراونا لگتا تھا، وہ کشتی بن گیا جو موسیٰ کو سلامتی تک لے گئی۔ اللہ جو منصوبہ بنائے اُسے کوئی بادشاہ کا حکم روک نہیں سکتا۔",
        },
        {
          en: "Musa's sister was asked by her mother to watch the basket. She kept an eye on it from a distance (Qur'an 28:11). So the little baby floated safely, guarded by the eyes of his sister, the love of his mother, and the power of Allah — even while the river carried him straight into the palace of his enemy.",
          ur: "موسیٰ کی بہن کو ماں نے ٹوکرے پر نظر رکھنے کو کہا۔ وہ دور سے اُس پر نظر رکھتی رہی (قرآن 28:11)۔ پس چھوٹا سا بچہ محفوظ تیرتا رہا، جس کی حفاظت کر رہی تھیں بہن کی آنکھیں، ماں کی محبت اور اللہ کی قدرت — جب کہ دریا اُسے سیدھا اُس کے دشمن کے محل تک لے جا رہا تھا۔",
        },
      ],
      ayahNote: {
        en: "The river that looked so scary became the baby's safe road. Allah planned everything: the baby the king wanted to kill floated safely into the king's own palace. Nobody can stop Allah's plan.",
        ur: "وہی دریا جو ڈراہنا لگتا تھا، اُس بچے کے لیے محفوظ راستہ بن گیا۔ اللہ نے سب کچھ پہلے ہی طے کر لیا تھا: جس بچے کو بادشاہ مارنا چاہتا تھا، وہ اللہ کی حفاظت سے خود بادشاہ کے محل میں پہنچا۔ اللہ کے منصوبے کو کوئی بادشاہ نہیں روک سکتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 28:4",
          label: { en: "Pharaoh's cruelty — killing baby boys and keeping women alive", ur: "فرعون کا ظلم — لڑکوں کو ذبح کرنا اور عورتوں کو زندہ رکھنا" },
          explanation: {
            en: "Pharaoh feared that a boy would take his kingdom, so he killed every baby boy. But the baby Allah wanted to protect could not be captured by him.",
            ur: "فرعون کو ڈر تھا کہ کوئی لڑکا اس کی سلطنت چھین لے گا، اس لیے وہ ہر لڑکے کو مار دتا تھا۔ مگر اللہ جس بچے کی حفاظت کرنا چاہتا تھا، فرعون اسے کچھ نہ کر سکا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:7",
          label: { en: "Allah inspires Musa's mother to cast him into the river, promising to return him", ur: "اللہ موسیٰ کی ماں کو حکم دیتا ہے کہ اُسے دریا میں ڈال دیں، اور واپسی کا وعدہ کرتا ہے" },
          explanation: {
            en: "Allah gave the mother a secret: put the baby in the river and do not fear, because Allah will bring him back and make him a messenger. Allah's promise always comes true.",
            ur: "اللہ نے ماں کو ایک راز بتایا: بچے کو دریا میں ڈال دو اور ڈرو مت، کیونکہ اللہ اسے واپس لائے گا اور اسے رسول بنائے گا۔ اللہ کا وعدہ ہمیشہ پورا ہوتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:8",
          label: { en: "The family of Pharaoh picks the baby up from the river", ur: "فرعون کا گھرانہ بچے کو دریا سے اٹھا لیتا ہے" },
          explanation: {
            en: "The river carried the basket straight to the palace of the very king who hunted the babies. The enemy's own family saved the baby Allah had chosen.",
            ur: "دریا اس ٹوکرے کو سیدھا بادشاہ کے محل کے کنارے لے گیا، اور بادشاہ کے گھر والوں نے بچے کو اٹھا لیا۔ جس بادشاہ کے ہاتھوں بچے مارے جاتے تھے، اسی کے گھر میں اللہ نے اس بچے کو پناہ دی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:11",
          label: { en: "Musa's sister watches the basket from a distance", ur: "موسیٰ کی بہن دور سے ٹوکرے پر نظر رکھتی ہے" },
          explanation: {
            en: "Musa's sister watched the basket from afar, so the little baby was never truly alone. Allah keeps His protection close to His chosen ones.",
            ur: "موسیٰ کی بہن دور سے ٹوکرے پر نظر رکھتی رہی، اس لیے چھوٹا بچہ کبھی اکیلا نہیں تھا۔ اللہ اپنے چنے ہوئے بندوں کی حفاظت ہر وقت کرتا ہے۔",
          },
        },
      ],
    },
    {
      id: "raised-in-the-royal-home",
      title: { en: "Raising in the Royal Home", ur: "شاہی محل میں پرورش" },
      paragraphs: [
        {
          en: "The people of the palace opened the basket and found a beautiful baby. The wife of Pharaoh said: \"A comfort for the eye for me and for you! Do not kill him — perhaps he may benefit us, or we may take him as a son\" (Qur'an 28:9). So the baby who was hunted by the king was now safe in the king's own house, under Allah's protection.",
          ur: "محل والوں نے ٹوکرا کھولا تو ایک حسین سا بچہ نظر آیا۔ فرعون کی بیوی نے کہا: \"میرے اور تمہارے لیے آنکھوں کی ٹھنڈک ہے! اُسے قتل نہ کرو — شاید وہ ہمیں فائدہ پہنچائے یا ہم اُسے بیٹا بنا لیں\" (قرآن 28:9)۔ پس وہ بچہ جسے بادشاہ تلاش کر کے مارتا تھا، اللہ کی حفاظت میں اب خود بادشاہ کے گھر میں محفوظ تھا۔",
        },
        {
          en: "Allah had given the little baby a gift of love, as He said: \"And I cast upon you love from Me, so that you might be raised under My eye\" (Qur'an 20:39). Everyone who saw Musa loved him. But far away, the heart of his real mother was aching. The Qur'an says: \"And the heart of Musa's mother became empty of patience — she almost disclosed him\" (Qur'an 28:10).",
          ur: "اللہ نے چھوٹے بچے کو محبت کا تحفہ دیا تھا، جیسا اُس نے فرمایا: \"اور میں نے اپنی طرف سے تم پر محبت ڈال دی تاکہ تم میری آنکھ کے سامنے پالے جاؤ\" (قرآن 20:39)۔ جو بھی موسیٰ کو دیکھتا اُس سے محبت کر بیٹھتا۔ لیکن بہت دور اُس کی حقیقی ماں کا دل کڑھ رہا تھا۔ قرآن کہتا ہے: \"اور موسیٰ کی ماں کا دل صبر سے خالی ہو گیا — وہ قریب تھیں کہ اُسے ظاہر کر دیتیں\" (قرآن 28:10)۔",
        },
        {
          en: "Then Allah planned something amazing. He had already forbidden every wet nurse in the city for the baby, so the royal family searched for someone to feed him (Qur'an 28:12). Baby after baby refused — but why? Because his mother's milk was waiting for him. In this way, the story began to lead the baby back home.",
          ur: "پھر اللہ نے ایک عجیب تدبیر کی۔ اُس نے شہر کی تمام دایوں کے لیے بچے کا دودھ پینا بند کر دیا تھا، اِس لیے شاہی خاندان کوئی دودھ پلانے والی ڈھونڈنے لگا (قرآن 28:12)۔ بچہ ہر دائی کا دودھ پینے سے منہ پھیر لیتا — مگر کیوں؟ کیونکہ اُس کی اپنی ماں کا دودھ اُس کا انتظار کر رہا تھا۔ یوں کہانی بچے کو آہستہ آہستہ اُس کے اپنے گھر واپس لے جانے لگی۔",
        },
        {
          en: "Musa's clever sister had been watching all along. She walked up to the palace people and said: \"Shall I show you a family that will raise him for you and will be sincere to him?\" (Qur'an 28:12). She brought her own mother — and the royal family, not knowing, gave the baby back to his own mother's arms. Some scholars say the royal family even tested children with gold and burning coal; that story belongs to the old traditions, not to the Qur'an itself.",
          ur: "موسیٰ کی ذہین بہن سب کچھ دیکھ رہی تھی۔ وہ محل والوں کے پاس گئی اور بولی: \"کیا میں تمہیں ایسا گھرانہ بتاؤں جو تمہارے لیے اُسے پالے اور اُس کا خیرخواہ ہو؟\" (قرآن 28:12)۔ وہ اپنی ماں کو لے آئی — اور شاہی خاندان بے خبر یہ سمجھ کر کہ یہ کوئی دایہ ہے، بچے کو اُس کی اپنی ماں کی گود میں واپس دے دیا۔ کچھ لوگ یہ بھی کہتے ہیں کہ شاہی خاندان نے بچوں کو سونے اور جلتی آگ کے ذریعے آزمایا تھا؛ یہ قصہ پرانی روایتوں سے ہے، خود قرآن میں نہیں۔",
        },
        {
          en: "At last Allah's promise came true: \"So We returned him to his mother, that her eye might be comforted, and she would not grieve\" (Qur'an 28:13). Allah had kept His word — the baby was back with his mother, the mother's heart was happy again, and nobody in the palace ever knew. This is how Allah works: He plans, and no one can stop His plan.",
          ur: "آخر کار اللہ کا وعدہ پورا ہوا: \"پس ہم نے اُسے اُس کی ماں کی طرف لوٹا دیا، تاکہ اُس کی آنکھ ٹھنڈی رہے اور وہ غم نہ کھائے\" (قرآن 28:13)۔ اللہ نے اپنا وعدہ پورا کیا — بچہ ماں کے پاس واپس آ گیا، ماں کا دل پھر سے خوش ہو گیا، اور محل میں کسی کو پتا نہ چلا۔ اللہ کا طریقہ یہی ہے: وہ تدبیر بناتا ہے اور اُس کی تدبیر کو کوئی نہیں روک سکتا۔",
        },
      ],
      ayahNote: {
        en: "The baby was loved in the king's palace, but his true mother's heart would not rest. Allah kept His promise and returned the baby to his own mother through a gentle plan.",
        ur: "بچہ محل میں تو پیار پا گیا، مگر اس کی حقیقی ماں کا دل کڑھتا رہا۔ اللہ نے نرم تدبیر بنائی اور بچے کو اس کی اپنی ماں کی گود میں واپس پہنچا دیا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 28:9",
          label: { en: "The wife of Pharaoh says the child will be a comfort and asks not to kill him", ur: "فرعون کی بیوی کہتی ہے کہ بچہ آنکھوں کی ٹھنڈک ہو گا اور اُسے قتل نہ کرو" },
          explanation: {
            en: "The queen stopped the soldiers and told Pharaoh: do not kill this baby, he may be a comfort to us. Her love saved Musa's life and gave him a home.",
            ur: "فرعون کی بیوی نے بچے کو دیکھا تو کہا: اسے قتل مت کرو، یہ ہماری آنکھوں کی ٹھنڈک ہے۔ اس طرح اللہ نے موسیٰ کو اسی محل میں محفوظ رکھا جہاں بچے مارے جاتے تھے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:39",
          label: { en: "Allah casts His love over Musa so he is raised under His eye", ur: "اللہ موسیٰ پر اپنی محبت ڈالتا ہے تاکہ وہ اُس کی آنکھ کے سامنے پلا بڑھے" },
          explanation: {
            en: "Allah placed love for Musa in every heart, so even the enemy's household grew fond of him. When Allah loves someone, He makes others love them too.",
            ur: "اللہ نے موسیٰ کے لیے سب کے دلوں میں محبت ڈال دی، چنانچہ محل والے بھی اس سے پیار کرنے لگے۔ جس سے اللہ محبت کرتا ہے، دوسروں کے دل بھی اس سے محبت کرتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:10",
          label: { en: "The heart of Musa's mother aches and she almost reveals him", ur: "موسیٰ کی ماں کا دل کڑھتا ہے اور وہ قریب تھیں کہ اُسے ظاہر کر دیتیں" },
          explanation: {
            en: "Musa's true mother missed him so much that she almost told everyone he was her son. But Allah gave her strength and patience for the sake of His plan.",
            ur: "موسیٰ کی ماں کو اپنے بچے کی بےحد یاد آتی تھی اور وہ قریب تھیں کہ سچ کہہ دیں۔ مگر اللہ نے انہیں صبر عطا کیا تاکہ اس کا منصوبہ پورا ہو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:12",
          label: { en: "Allah forbids wet nurses for Musa, so his own mother becomes his nurse", ur: "اللہ موسیٰ کے لیے دایوں کا دودھ بند کر دیتا ہے تاکہ اُس کی اپنی ماں اُسے دودھ پلائے" },
          explanation: {
            en: "Allah made the baby refuse every nurse, so nobody could feed him. Then his own mother was brought to him, and the royal family never knew the secret.",
            ur: "اللہ نے تدبیر کی کہ بچہ ہر دایہ سے دودھ نہ پئے، پھر اس کی اپنی ماں کو بلایا گیا اور اس نے بچے کو دودھ پلایا۔ محل والوں کو راز کبھی معلوم نہیں ہوا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:13",
          label: { en: "Allah returns Musa to his mother so her eye is comforted", ur: "اللہ موسیٰ کو اُس کی ماں کی طرف لوٹاتا ہے تاکہ اُس کی آنکھ ٹھنڈی ہو" },
          explanation: {
            en: "Allah kept His promise: the baby came back to his own mother's arms, and the palace never knew. Allah's words are always kept, no matter how long the wait.",
            ur: "اللہ اپنا وعدہ پورا کرتا ہے: بچہ اپنی ماں کی گود میں واپس آ جاتا ہے اور محل والوں کو خبر نہیں ہوتی۔ اللہ کا وعدہ ہمیشہ پورا ہوتا ہے، چاہے انتظار کتنا ہی لمبا ہو۔",
          },
        },
        { type: "hadith", reference: "Classical prophet-stories tradition (Ibn Kathir, Al-Bidayah wan-Nihayah)", needsVerification: true, label: { en: "The royal family's gold-and-coal test for Musa — an old tradition, not in the Qur'an", ur: "موسیٰ کے لیے شاہی خاندان کا سونا اور کوئلے والا امتحان — پرانی روایت، قرآن میں نہیں" } },
      ],
    },
    {
      id: "fleeing-to-madyan",
      title: { en: "A Man Flees to Madyan", ur: "مدین کی طرف سفر" },
      paragraphs: [
        {
          en: "Musa grew up strong and handsome in the city, still not knowing that he was one of the people of Allah. One day he entered the city when its people were not paying attention. He found two men fighting — one was from his own people, and the other was from the enemy. The man from his people cried for help: \"O Musa, help me against this oppressor!\"",
          ur: "موسیٰ شہر میں مضبوط اور حسین جوان ہو کر پلے بڑھے، اور ابھی اُنہیں معلوم نہ تھا کہ وہ اللہ والی قوم میں سے ہیں۔ ایک دن وہ شہر میں ایسے وقت داخل ہوئے جب لوگ غافل تھے۔ اُنہوں نے دیکھا کہ دو آدمی لڑ رہے ہیں — ایک اُن کی اپنی قوم کا تھا اور دوسرا دشمن قوم کا۔ اپنی قوم والے نے پکارا: \"اے موسیٰ! اس ظالم کے خلاف میری مدد کرو!\"",
        },
        {
          en: "Musa struck the enemy with his fist, meaning to stop the fight. But the strike was harder than he thought, and the man fell dead. The Qur'an tells us that Musa was sad at once and said: \"This is from the work of Shaytan. My Lord, I have wronged myself, so forgive me\" (Qur'an 28:15–16). He had not meant to kill — but the deed was done, and it changed his life.",
          ur: "موسیٰ نے لڑائی روکنے کے لیے دشمن کو مکا مارا۔ مگر وہ ضرب سوچ سے زیادہ کاری نکلی اور وہ آدمی زمین پر گر کر مر گیا۔ قرآن بتاتا ہے کہ موسیٰ فوراً پریشان ہو گئے اور بولے: \"یہ شیطان کے کام میں سے ہے۔ اے میرے رب! میں نے اپنے اوپر ظلم کیا، پس مجھے معاف فرما\" (قرآن 28:15–16)۔ اُنہوں نے قتل کا ارادہ نہیں کیا تھا — مگر یہ واقعہ ہو چکا تھا، اور اُس نے اُن کی زندگی بدل دی۔",
        },
        {
          en: "The next morning Musa walked in the city, afraid and watching. The same man from yesterday came running to him again, crying for help against another enemy. As Musa raised his hand, the enemy shouted: \"O Musa, do you intend to kill me as you killed a soul yesterday?\" (Qur'an 28:18–19). Now everyone knew — the whole city heard that Musa had struck down a man.",
          ur: "اگلی صبح موسیٰ شہر میں ڈرتے ہوئے آہستہ پاؤں چل رہے تھے۔ کل والا آدمی پھر بھاگا بھاگا آیا اور ایک اور دشمن کے خلاف مدد مانگنے لگا۔ جیسے ہی موسیٰ نے ہاتھ اٹھایا، دشمن چلایا: \"اے موسیٰ! کیا تم مجھے اُسی طرح قتل کرنا چاہتے ہو جیسے تم نے کل ایک جان لے لی؟\" (قرآن 28:18–19)۔ اب سب کو خبر ہو گئی — پورے شہر میں پھیل گیا کہ موسیٰ نے ایک شخص کو مارا ہے۔",
        },
        {
          en: "Quickly a man came running from the farthest part of the city and warned him: \"O Musa, the leaders are plotting to kill you — so leave, for I am a sincere advisor to you\" (Qur'an 28:20). Musa left the city at once, afraid and looking behind him, and prayed: \"My Lord, save me from the wrongdoing people\" (Qur'an 28:21). Then he walked alone toward a faraway land called Madyan, saying: \"Perhaps my Lord will guide me to the right way\" (Qur'an 28:22).",
          ur: "اتنے میں شہر کے سب سے دور حصے سے ایک آدمی بھاگا ہوا آیا اور اُنہیں خبردار کیا: \"اے موسیٰ! سردار تمہیں قتل کرنے کا مشورہ کر رہے ہیں — پس نکل جاؤ، میں تمہارا خیرخواہ ہوں\" (قرآن 28:20)۔ موسیٰ فوراً شہر سے نکل گئے، خوف کے ساتھ پیچھے دیکھتے ہوئے، اور دعا کی: \"اے میرے رب! مجھے ظالم قوم سے بچا لے\" (قرآن 28:21)۔ پھر وہ اکیلے مدین نامی دور ملک کی طرف چل پڑے، یہ کہتے ہوئے: \"شاید میرا رب مجھے سیدھا راستہ دکھائے\" (قرآن 28:22)۔",
        },
        {
          en: "After a long journey, Musa reached the well of Madyan, tired and thirsty. He found a crowd of men watering their flocks, and beside them two young women holding their sheep back. He asked them kindly: \"What is your matter?\" They answered: \"We cannot water our flocks until the shepherds go away, and our father is a very old man\" (Qur'an 28:23). So strong Musa watered their flocks for them, then rested in the shade and prayed: \"My Lord, I am in need of whatever good You send down to me\" (Qur'an 28:24).",
          ur: "لمبے سفر کے بعد موسیٰ مدین کے کنویں پر پہنچے، تھکے ہوئے اور پیاسے۔ اُنہوں نے دیکھا کہ کچھ آدمی اپنے جانوروں کو پانی پلا رہے ہیں، اور تھوڑی دور دو لڑکیاں اپنی بھیڑیں روکے کھڑی ہیں۔ اُنہوں نے نرمی سے پوچھا: \"تمہارا کیا معاملہ ہے؟\" اُنہوں نے جواب دیا: \"ہم اس وقت تک اپنی بھیڑوں کو پانی نہیں پلا سکتیں جب تک چرواہے ہٹ نہ جائیں، اور ہمارے والد بہت بوڑھے ہیں\" (قرآن 28:23)۔ پس طاقتور موسیٰ نے اُن کے لیے جانوروں کو پانی پلایا، پھر سائے میں بیٹھ کر دعا کی: \"اے میرے رب! جو بھلائی تو مجھ پر اتارے، میں اُس کا محتاج ہوں\" (قرآن 28:24)۔",
        },
      ],
      ayahNote: {
        en: "After an accident in the city, Musa had to run away from home. In his fear he trusted Allah and prayed for help, and Allah guided him to a new country where kindness was waiting.",
        ur: "ایک حادثے کے بعد موسیٰ کو شہر چھوڑ کر بھاگنا پڑا۔ اس خوف میں انہوں نے اللہ پر بھروسہ کیا اور مدد کی دعا کی، اور اللہ نے انہیں ایک نئی سرزمین کی راہ دکھائی جہاں بھلائی کا انتظار تھا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 28:15–16",
          label: { en: "Musa accidentally strikes and kills a man, then repents to Allah", ur: "موسیٰ غلطی سے ایک شخص کو مار بیٹھتے ہیں، پھر اللہ سے معافی مانگتے ہیں" },
          explanation: {
            en: "Musa did not mean to kill; he only wanted to stop a fight. He felt sad at once and asked Allah to forgive him. When you make a mistake, Allah loves it when you say sorry.",
            ur: "موسیٰ نے جان بوجھ کر نہیں مارا تھا، وہ صرف جھگڑا روکنا چاہتے تھے۔ جب یہ ہو گیا تو انہوں نے فوراً سچ قلب سے اللہ سے معافی مانگی۔ جب بندہ کوئی غلطی کرے تو اللہ معافی چاہنے والوں سے محبت کرتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:18–19",
          label: { en: "The news spreads in the city and Musa is recognized as the one who killed", ur: "شہر میں خبر پھیل جاتی ہے اور لوگ جان لیتے ہیں کہ قتل موسیٰ نے کیا" },
          explanation: {
            en: "The secret could not stay hidden — the whole city learned what had happened. From that day Musa was in danger, so he had to leave quietly and quickly.",
            ur: "یہ راز چھپا نہ رہ سکا — پورے شہر کو پتا چل گیا کہ موسیٰ نے ایسا کیا ہے۔ اس دن سے موسیٰ کی جان خطرے میں تھی، اس لیے انہیں جلدی سے شہر چھوڑنا پڑا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:20–21",
          label: { en: "A man warns Musa that the leaders plot to kill him, so he flees", ur: "ایک آدمی موسیٰ کو خبردار کرتا ہے کہ سردار قتل کی سازش کر رہے ہیں، پس وہ نکل جاتے ہیں" },
          explanation: {
            en: "A kind man came running to warn Musa: the leaders are planning to kill you. Musa left the city at once and prayed: my Lord, save me from the wrongdoers.",
            ur: "ایک مہربان آدمی بھاگا ہوا آیا اور خبردار کیا کہ سردار قتل کی سازش کر رہے ہیں۔ موسیٰ فوراً نکل گئے اور دعا کی: اے میرے رب، مجھے ظالموں سے بچا لے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:22–24",
          label: { en: "At the well of Madyan, Musa waters the flocks of two women and prays for good", ur: "مدین کے کنویں پر موسیٰ دو لڑکیوں کی بھیڑوں کو پانی پلاتے ہیں اور بھلائی کی دعا کرتے ہیں" },
          explanation: {
            en: "Filled with worry, Musa sat at the well of Madyan. Even then he quietly helped two kind girls, then prayed: my Lord, I am in need of whatever good You send down to me.",
            ur: "تھکے ہوئے موسیٰ مدین کے کنویں پر آئے اور انہوں نے نرمی سے دو لڑکیوں کی بھیڑوں کو پانی پلایا، پھر دعا کی: اے میرے رب، جو بھلائی تو مجھ پر اتارے میں اس کا محتاج ہوں۔",
          },
        },
      ],
    },
    {
      id: "marriage-and-the-journey",
      title: { en: "Marriage in Madyan and the Journey", ur: "مدین میں شادی اور سفر" },
      paragraphs: [
        {
          en: "One of the two young women came to Musa, walking shyly, and said: \"Indeed, my father calls you, to reward you for watering our flocks for us\" (Qur'an 28:25). So Musa went with her to meet her father, an old, kind man. When he told the old man his whole story, the father said: \"Do not fear — you have escaped from the wrongdoing people\" (Qur'an 28:25).",
          ur: "اُن دو لڑکیوں میں سے ایک شرماتے ہوئے موسیٰ کے پاس آئی اور بولی: \"میرے والد آپ کو بلا رہے ہیں، تاکہ ہمارے جانوروں کو پانی پلانے کا بدلہ دیں\" (قرآن 28:25)۔ پس موسیٰ اُس کے ساتھ اُس کے والد سے ملنے گئے — ایک بوڑھا اور نرم مزاج آدمی۔ جب موسیٰ نے اُسے اپنی ساری کہانی سنائی تو باپ نے کہا: \"ڈرو نہیں — تم ظالم قوم سے نکل آئے ہو\" (قرآن 28:25)۔",
        },
        {
          en: "Then the daughter whispered to her father a wise suggestion: \"O my father, hire him. Indeed, the best of those you can hire is the strong and the trustworthy\" (Qur'an 28:26). The old man looked at Musa and said: \"I wish to marry you to one of these two daughters of mine, on condition that you serve me eight years; and if you complete ten, it is from you. I do not wish to burden you — you will find me, Allah willing, among the righteous\" (Qur'an 28:27).",
          ur: "پھر بیٹی نے باپ کے کان میں عقلمندی کی بات کہی: \"ابا جان! اِنہیں نوکر رکھ لیں۔ بیشک سب سے بہتر نوکر وہ ہے جو مضبوط اور امانت دار ہو\" (قرآن 28:26)۔ بوڑھے آدمی نے موسیٰ کی طرف دیکھ کر کہا: \"میں چاہتا ہوں کہ تمہیں اپنی اِن دو بیٹیوں میں سے ایک سے شادی کر دوں، اس شرط پر کہ تم آٹھ سال میری خدمت کرو؛ اور اگر دس سال پورے کر دو تو یہ تمہاری طرف سے (نیکی) ہے۔ میں تم پر بوجھ نہیں ڈالنا چاہتا — اللہ نے چاہا تو تم مجھے نیک لوگوں میں پاؤ گے\" (قرآن 28:27)۔",
        },
        {
          en: "Musa agreed with all his heart. He said: \"That is between me and you — whichever of the two terms I complete, there is no injustice against me. And Allah is Guardian over what we say\" (Qur'an 28:28). So Musa served the old man faithfully, year after year, and married one of his daughters. He found peace and a new home in Madyan, far from the city that had wanted to kill him.",
          ur: "موسیٰ پورے دل سے راضی ہو گئے۔ اُنہوں نے کہا: \"یہ معاملہ میرے اور آپ کے درمیان ہے — میں دونوں میں سے جو مدت پوری کروں، مجھ پر کوئی زیادتی نہ ہو۔ اور جو بات ہم کہہ رہے ہیں اُس پر اللہ گواہ ہے\" (قرآن 28:28)۔ پس موسیٰ نے سال در سال بوڑھے آدمی کی وفاداری سے خدمت کی اور اُس کی ایک بیٹی سے شادی کر لی۔ اُنہوں نے مدین میں سکون اور نیا گھر پا لیا، اُس شہر سے بہت دور جہاں وہ اُنہیں قتل کرنا چاہتے تھے۔",
        },
        {
          en: "After many years, the time of service ended and Musa decided to travel back with his family. The road was long, the night was cold, and the desert was dark. Then, far away on the side of the mountain, Musa saw something strange — a fire was burning! The Qur'an says: \"And when Musa completed the term and travelled with his family, he perceived from the direction of the mountain a fire\" (Qur'an 28:29).",
          ur: "کئی سالوں کے بعد خدمت کی مدت پوری ہوئی اور موسیٰ نے اپنے گھر والوں کے ساتھ واپس سفر کرنے کا ارادہ کیا۔ راستہ لمبا تھا، رات ٹھنڈی تھی اور صحرا اندھیرا۔ پھر بہت دور پہاڑ کی طرف موسیٰ نے ایک عجیب چیز دیکھی — آگ جل رہی تھی! قرآن کہتا ہے: \"پس جب موسیٰ نے مدت پوری کی اور اپنے گھر والوں کے ساتھ چلے، تو اُنہوں نے پہاڑ کی طرف سے آگ دیکھی\" (قرآن 28:29)۔",
        },
        {
          en: "Musa said to his family: \"Stay here — indeed I perceive a fire. Perhaps I can bring you news from it, or a burning ember, so you may warm yourselves\" (Qur'an 28:29). He walked toward the fire with hope in his heart. But this was not an ordinary fire — it was the light of Allah calling His prophet. Musa was about to meet his Lord in the most wonderful way.",
          ur: "موسیٰ نے اپنے گھر والوں سے کہا: \"تم یہاں رہو — مجھے آگ دکھائی دی ہے۔ شاید میں اُس سے کوئی خبر لاؤں، یا آگ کا انگارا، تاکہ تم آگ سینک سکو\" (قرآن 28:29)۔ وہ امید بھرے دل سے آگ کی طرف چل پڑے۔ لیکن یہ کوئی عام آگ نہ تھی — یہ اللہ کا نور تھا جو اپنے نبی کو بلا رہا تھا۔ موسیٰ اپنے رب سے سب سے خوبصورت ملاقات کرنے والے تھے۔",
        },
      ],
      ayahNote: {
        en: "Allah turned Musa's troubles into a blessing: he found a kind father-in-law, a wife, a home and work — all because he stayed honest and prayed to Allah.",
        ur: "اللہ نے موسیٰ کی پریشانیوں کو برکت میں بدل دیا: انہیں ایک نیک گھرانہ، بیوی، گھر اور کام ملا — یہ سب اس لیے کہ وہ ایماندار رہے اور اللہ سے دعا کرتے رہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 28:25–26",
          label: { en: "The father invites Musa and the daughter advises hiring the strong and trustworthy man", ur: "باپ موسیٰ کو بلا لیتا ہے اور بیٹی مضبوط اور امانت دار آدمی کو رکھنے کا مشورہ دیتی ہے" },
          explanation: {
            en: "The wise daughter saw that Musa was strong and trustworthy. The Qur'an praises a worker who is strong and honest — that is what Allah loves in a helper.",
            ur: "عقلمند بیٹی نے دیکھا کہ موسیٰ مضبوط اور امانت دار ہیں۔ قرآن ہمیں بتاتا ہے کہ سب سے بہتر نوکر وہ ہے جو مضبوط اور امانت دار ہو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:27",
          label: { en: "The father offers his daughter in marriage for eight years of service, ten optional", ur: "باپ آٹھ سال خدمت پر بیٹی کی شادی کی پیشکش کرتا ہے، دس سال اختیاری" },
          explanation: {
            en: "The old man gave Musa the chance to earn his home by honest work — eight years of service. Musa agreed happily, and Allah blessed the home.",
            ur: "بوڑھے آدمی نے موسیٰ کو ایمانداری سے کام کرنے کا موقع دیا — آٹھ سال خدمت کے بدلے شادی۔ موسیٰ نے خوشی سے قبول کیا اور اللہ نے اس گھر میں برکت ڈالی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:28",
          label: { en: "Musa agrees to the terms and Allah is witness over their agreement", ur: "موسیٰ شرائط مان لیتے ہیں اور اللہ کو معاہدے پر گواہ بناتے ہیں" },
          explanation: {
            en: "Musa promised to keep his word, and made Allah the witness of their agreement. Keeping promises is important to Allah — even small ones.",
            ur: "موسیٰ نے اپنے وعدے کو نبھانا قبول کیا اور اللہ کو اپنے معاہدے کا گواہ بنایا۔ وعدہ نبھنا اللہ کو پسند ہے — چاہے وہ چھوٹا ہی کیوں نہ ہو۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 28:29",
          label: { en: "On the journey home, Musa sees a fire on the side of the mountain", ur: "واپسی کے سفر میں موسیٰ پہاڑ کی طرف آگ دیکھتے ہیں" },
          explanation: {
            en: "That small fire was not an ordinary fire — it was the light of Allah calling Musa. What seems like an ordinary moment can be the start of something wonderful.",
            ur: "وہ چھوٹی سی آگ کوئی عام آگ نہیں تھی — یہ اللہ کا نور تھا جو موسیٰ کو بلا رہا تھا۔ جو چیز عام لگتی ہے، اللہ اس میں بڑی تبدیلی چھپا دیتا ہے۔",
          },
        },
      ],
    },
    {
      id: "the-burning-bush",
      title: { en: "The Calling at the Burning Bush", ur: "جلتی جھاڑی کی پکار" },
      paragraphs: [
        {
          en: "As Musa came near the fire, a voice called out: \"O Musa — indeed, I am your Lord, so take off your sandals; you are in the blessed valley of Tuwa. I have chosen you, so listen to what is revealed\" (Qur'an 20:11–13). Musa stood still and listened with his whole heart. The Creator of the heavens and the earth was speaking to him directly.",
          ur: "جب موسیٰ آگ کے قریب پہنچے تو ایک آواز نے پکارا: \"اے موسیٰ! بیشک میں ہی تیرا رب ہوں، پس اپنی جوتیاں اتار دے؛ تو طویٰ نامی برکت والی وادی میں ہے۔ میں نے تجھے چن لیا ہے، پس سن جو وحی کی جاتی ہے\" (قرآن 20:11–13)۔ موسیٰ خاموش کھڑے ہو کر پورے دل سے سننے لگے۔ آسمانوں اور زمین کے خالق اُن سے براہِ راست گفتگو فرما رہے تھے۔",
        },
        {
          en: "Then Allah said the most precious words: \"Indeed, I am Allah — there is no god except Me, so worship Me and establish prayer for My remembrance\" (Qur'an 20:14). This was the message of all the prophets in one sentence: only Allah deserves our worship, and prayer keeps our hearts close to Him. Musa the shepherd had become Musa the messenger.",
          ur: "پھر اللہ نے سب سے قیمتی الفاظ فرمائے: \"بیشک میں ہی اللہ ہوں — میرے سوا کوئی معبود نہیں، پس میری عبادت کرو اور میری یاد کے لیے نماز قائم کرو\" (قرآن 20:14)۔ یہ تمام نبیوں کا پیغام ایک جملے میں تھا: صرف اللہ ہی عبادت کا مستحق ہے، اور نماز ہمارے دلوں کو اُس سے قریب رکھتی ہے۔ بکریاں چرانے والے موسیٰ اب اللہ کے رسول بن چکے تھے۔",
        },
        {
          en: "Then Allah asked Musa a gentle question: \"And what is that in your right hand, O Musa?\" (Qur'an 20:17). Musa answered: \"It is my staff; I lean upon it, and I beat down leaves with it for my sheep, and I have other uses for it\" (Qur'an 20:18). Then Allah said: \"Throw it down, O Musa\" — and when he threw it, the staff became a snake, moving quickly (Qur'an 20:19–20).",
          ur: "پھر اللہ نے موسیٰ سے نرمی سے پوچھا: \"اے موسیٰ! تیرے داہنے ہاتھ میں کیا ہے؟\" (قرآن 20:17)۔ موسیٰ نے جواب دیا: \"یہ میری لاٹھی ہے، میں اُس پر ٹیک لگاتا ہوں، اور اُس سے اپنی بکریوں کے لیے پتے جھاڑتا ہوں، اور اُس میں میرے اور بھی کام ہیں\" (قرآن 20:18)۔ پھر اللہ نے فرمایا: \"اے موسیٰ! اُسے پھینک دے\" — جب اُنہوں نے پھینکا تو لاٹھی تیز حرکت کرنے والا سانپ بن گئی (قرآن 20:19–20)۔",
        },
        {
          en: "Musa was afraid and turned away. But Allah said lovingly: \"O Musa, do not fear. Indeed, the messengers do not fear in My presence\" (Qur'an 27:10). Then He told him: \"Catch hold of it and do not fear — We will return it to its first state. And place your hand inside your garment — it will come out white without any illness — as another sign\" (Qur'an 20:21–22). Now Musa had two amazing signs: a staff and a shining hand.",
          ur: "موسیٰ ڈر گئے اور پیچھے ہٹنے لگے۔ لیکن اللہ نے محبت سے فرمایا: \"اے موسیٰ! ڈرو نہیں۔ بیشک میرے پاس رسول نہیں ڈرتے\" (قرآن 27:10)۔ پھر فرمایا: \"اُسے پکڑ لو اور ڈرو نہیں — ہم اُسے پہلی حالت پر لوٹا دیں گے۔ اور اپنا ہاتھ اپنے گریبان میں ڈالو — وہ بغیر کسی بیماری کے سفید چمکتا ہوا نکلے گا — یہ دوسری نشانی ہے\" (قرآن 20:21–22)۔ اب موسیٰ کے پاس دو حیرت انگیز نشانیاں تھیں: لاٹھی اور چمکتا ہوا ہاتھ۔",
        },
        {
          en: "Then came the great task: \"Go to Pharaoh — indeed, he has transgressed\" (Qur'an 20:24). Musa's heart was humble, and he asked Allah for help in the most beautiful prayer: \"My Lord, expand my chest for me, and ease my task for me, and untie the knot of my tongue, that they may understand my speech. And appoint for me a helper from my family — Harun, my brother. Strengthen me through him and share in my task with him, so that we may glorify You much and remember You much\" (Qur'an 20:25–34).",
          ur: "پھر عظیم ذمہ داری آئی: \"فرعون کے پاس جاؤ — بیشک اُس نے سرکشی کی ہے\" (قرآن 20:24)۔ موسیٰ کا دل عاجز تھا، اور اُنہوں نے سب سے خوبصورت دعا میں اللہ سے مدد مانگی: \"اے میرے رب! میرا سینہ کھول دے، میرا کام آسان کر دے، اور میری زبان کی گرہ کھول دے تاکہ وہ میری بات سمجھ سکیں۔ اور میرے گھرانے میں سے میرا مددگار مقرر فرما — میرا بھائی ہارون۔ اُس کے ذریعے میری کمر مضبوط کر اور اُسے میرے کام میں شریک کر، تاکہ ہم تیری کثرت سے تسبیح کریں اور تیری کثرت سے یاد کریں\" (قرآن 20:25–34)۔",
        },
      ],
      ayahNote: {
        en: "At the burning bush, Allah spoke to Musa gently: I am your Lord. He taught Musa that prayer keeps our hearts close to Him, and gave Musa and Harun their great mission of calling people to Allah.",
        ur: "جلتی جھاڑی کے پاس اللہ نے موسیٰ سے نرمی سے کلام کیا: میں تیرا رب ہوں۔ اس نے موسیٰ کو سکھایا کہ نماز دل کو اللہ کی یاد سے جوڑتی ہے، اور اُسے لوگوں کو اللہ کی طرف بلانے کی بڑی ذمہ داری سونپی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 20:11–14",
          label: { en: "Allah calls Musa at the blessed valley of Tuwa and reveals His oneness", ur: "اللہ موسیٰ کو طویٰ کی برکت والی وادی میں پکارتا ہے اور اپنی توحید بتاتا ہے" },
          explanation: {
            en: "In the blessed valley, Allah told Musa who He is: the One and Only God, and no god except Him is worthy of worship. Prayer keeps our hearts close to Allah.",
            ur: "برکت والی وادی میں اللہ نے موسیٰ کو بتایا کہ وہی ایک اللہ ہے اور اُس کے سوا کوئی عبادت کا مستحق نہیں۔ نماز دل کو اللہ کی یاد سے قریب رکھتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:17–21",
          label: { en: "Musa's staff becomes a moving snake and then returns to a staff", ur: "موسیٰ کی لاٹھی تیز حرکت کرنے والا سانپ بن جاتی ہے اور پھر لاٹھی بن جاتی ہے" },
          explanation: {
            en: "Musa told Allah about his little staff, but in Allah's hands it became a moving snake. What is ordinary for us becomes powerful in Allah's hands.",
            ur: "موسیٰ نے اپنی چھوٹی سی لاٹھی کا ذکر کیا، مگر اللہ کے حکم سے وہ تیز حرکت کرنے والا سانپ بن گئی۔ ہماری نظر میں جو چیز معمولی ہوتی ہے، اللہ کے ہاتھ میں وہ طاقت بن جاتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:22–23",
          label: { en: "Allah gives Musa the sign of the white shining hand", ur: "اللہ موسیٰ کو سفید چمکتے ہاتھ کی نشانی دیتا ہے" },
          explanation: {
            en: "Allah gave Musa a second sign: his hand would shine bright white without any sickness. Two signs to show that Allah's power has no limits.",
            ur: "اللہ نے موسیٰ کو دوسری نشانی دی: ان کا ہاتھ بغیر کسی مرض کے چمکتا ہوا سفید ہو گا۔ دو نشانیاں اس لیے دی گئیں تاکہ معلوم ہو کہ اللہ کی قدرت کی کوئی حد نہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:24",
          label: { en: "Allah commands Musa to go to Pharaoh who has transgressed", ur: "اللہ موسیٰ کو سرکش فرعون کے پاس جانے کا حکم دیتا ہے" },
          explanation: {
            en: "After the signs, Allah gave Musa a big task: go to Pharaoh, the ruler who was proud and cruel. Allah always sends help before He sends a task.",
            ur: "نشانیوں کے بعد اللہ نے موسیٰ کو بڑی ذمہ داری دی: جا کر سرکش بادشاہ فرعون کو سمجھاؤ۔ اللہ جب بھی کوئی کام سونپتا ہے، اپنے بندے کو پہلے طاقت اور سہارا دیتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:25–34",
          label: { en: "Musa prays for an open heart, an easy task, a clear tongue, and Harun as his helper", ur: "موسیٰ دعا کرتے ہیں کھلے سینے، آسان کام، صاف زبان اور بھائی ہارون کو مددگار بنانے کی" },
          explanation: {
            en: "Musa asked Allah for a brave heart, an easy task, clear words and his brother Harun as a helper. Asking Allah for help before a hard job is the best preparation.",
            ur: "موسیٰ نے اللہ سے بہادر دل، آسان کام، صاف زبان اور بھائی ہارون کو مددگار بنانے کی دعا کی۔ مشکل کام سے پہلے اللہ سے مدد مانگنا سب سے اچھی تیاری ہے۔",
          },
        },
      ],
    },
    {
      id: "before-pharaoh",
      title: { en: "Before Pharaoh: Signs That Never Stopped", ur: "فرعون کے سامنے: نہ رکنے والی نشانیاں" },
      paragraphs: [
        {
          en: "Musa and Harun went together to Pharaoh, gentle and brave. Pharaoh laughed at them and asked: \"So who is the Lord of you two, O Musa?\" (Qur'an 20:49). Musa answered with knowledge and calm: \"Our Lord is He who gave everything its form, and then guided it\" (Qur'an 20:50). The king of Egypt stood before the messengers of the King of the heavens — and he did not even know it.",
          ur: "موسیٰ اور ہارون نرمی اور دلیری کے ساتھ ایک ساتھ فرعون کے پاس گئے۔ فرعون اُنہیں دیکھ کر ہنسا اور پوچھا: \"اے موسیٰ! تم دونوں کا رب کون ہے؟\" (قرآن 20:49)۔ موسیٰ نے علم اور سکون سے جواب دیا: \"ہمارا رب وہ ہے جس نے ہر چیز کو اُس کی صورت دی، پھر راہ دکھائی\" (قرآن 20:50)۔ مصر کا بادشاہ آسمانوں کے بادشاہ کے رسولوں کے سامنے کھڑا تھا — اور اُسے پتا بھی نہ تھا۔",
        },
        {
          en: "Pharaoh wanted to prove that Musa was a magician. He gathered the strongest magicians in his kingdom and said: \"We will throw first — then your magic will be shown\" (Qur'an 20:61–65). The magicians threw their ropes and staffs, and by their magic the ropes seemed to be crawling snakes — the whole crowd was amazed and afraid.",
          ur: "فرعون یہ ثابت کرنا چاہتا تھا کہ موسیٰ جادوگر ہے۔ اُس نے اپنی سلطنت کے سب سے طاقتور جادوگر بلائے اور کہا: \"ہم پہلے ڈالے جاتے ہیں — پھر تمہارا جادو دیکھا جائے گا\" (قرآن 20:61–65)۔ جادوگروں نے اپنی رسیاں اور لاٹھیاں پھینکیں، اور اپنے جادو سے رسیاں رینگتے سانپوں جیسی لگنے لگیں — پورا ہجوم حیران اور خوفزدہ تھا۔",
        },
        {
          en: "Musa felt a little fear in his heart, but Allah said to him: \"Do not fear — indeed, you will be the higher. And throw what is in your right hand; it will swallow what they have made\" (Qur'an 20:68–69). Musa threw his staff, and it became a huge snake that swallowed all the magicians' ropes and staffs — until nothing of their magic was left. The crowd gasped: this was no magic — this was the power of Allah.",
          ur: "موسیٰ کے دل میں ہلکا سا ڈر پیدا ہوا، لیکن اللہ نے اُن سے فرمایا: \"ڈرو نہیں — بیشک تم ہی غالب ہو گے۔ اور جو تمہارے داہنے ہاتھ میں ہے وہ پھینک دو؛ وہ اُن کی بنائی ہوئی چیزوں کو نگل لے گا\" (قرآن 20:68–69)۔ موسیٰ نے لاٹھی پھینکی، اور وہ ایک بڑا سانپ بن گئی جس نے جادوگروں کی ساری رسیاں اور لاٹھیاں نگل لیں — یہاں تک کہ اُن کا جادو کچھ باقی نہ رہا۔ ہجوم دنگ رہ گیا: یہ جادو نہیں تھا — یہ اللہ کی قدرت تھی۔",
        },
        {
          en: "When the magicians saw the truth, they fell down in prostration and said: \"We have believed in the Lord of Harun and Musa!\" (Qur'an 20:70). Even when Pharaoh threatened to cut off their hands and feet, they answered bravely: \"We will never prefer you over what has come to us of clear proofs\" (Qur'an 20:71–73). The very magicians whom Pharaoh hired became the first believers in the palace that day.",
          ur: "جب جادوگروں نے سچائی دیکھ لی تو وہ سجدے میں گر پڑے اور بولے: \"ہم ہارون اور موسیٰ کے رب پر ایمان لے آئے!\" (قرآن 20:70)۔ چاہے فرعون نے اُن کے ہاتھ پاؤں کاٹنے کی دھمکی دی، اُنہوں نے دلیری سے جواب دیا: \"ہم کبھی تمہیں اُن واضح دلائل پر ترجیح نہیں دیں گے جو ہمارے پاس آ چکے ہیں\" (قرآن 20:71–73)۔ فرعون کے بلائے ہوئے جادوگر ہی اُس دن محل میں سب سے پہلے ایمان لانے والے بن گئے۔",
        },
        {
          en: "But Pharaoh still refused to believe. Allah had given Musa nine clear signs (Qur'an 17:101), and He sent test after test upon Pharaoh's people: years of drought, floods, locusts, lice, frogs, and blood (Qur'an 7:130–133). Each time, Pharaoh's people cried: \"O Musa, call upon your Lord for us — and if you remove the punishment, we will surely believe in you\" (Qur'an 7:134). But when the punishment was removed, they broke their promise again (Qur'an 7:135).",
          ur: "لیکن فرعون پھر بھی ایمان نہ لایا۔ اللہ نے موسیٰ کو نو واضح نشانیاں دی تھیں (قرآن 17:101)، اور اُس نے فرعون کی قوم پر ایک کے بعد ایک آزمائش بھیجی: قحط کے سال، طوفان، ٹڈیاں، جوئیں، مینڈک اور خون (قرآن 7:130–133)۔ ہر بار فرعون کی قوم چیخ اٹھتی: \"اے موسیٰ! ہمارے لیے اپنے رب سے دعا کرو — اگر تم نے عذاب ہٹا دیا تو ہم ضرور تم پر ایمان لے آئیں گے\" (قرآن 7:134)۔ لیکن جب عذاب ہٹ جاتا تو وہ پھر اپنا وعدہ توڑ دیتے (قرآن 7:135)۔",
        },
      ],
      ayahNote: {
        en: "Musa faced the proud Pharaoh with only a staff and a shining hand. Allah's truth defeated the greatest magic, and the king's own magicians became the first believers of that day.",
        ur: "موسیٰ اپنی لاٹھی اور چمکتے ہاتھ کے ساتھ سرکش فرعون کے سامنے کھڑے ہوئے۔ اللہ کا سچ بڑے سے بڑے جادو پر غالب آیا، اور بادشاہ کے اپنے جادوگر ہی اس دن سب سے پہلے ایمان لائے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 20:49–50",
          label: { en: "Pharaoh asks who is the Lord of Musa, and Musa answers with tawhid", ur: "فرعون پوچھتا ہے کہ موسیٰ کا رب کون ہے، اور موسیٰ توحید کا جواب دیتے ہیں" },
          explanation: {
            en: "Pharaoh asked: who is your Lord? Musa answered with calm wisdom: He is the One who shaped everything and then guided it. True knowledge means knowing your Lord.",
            ur: "فرعون نے پوچھا: تمہارا رب کون ہے؟ موسیٰ نے سکون سے جواب دیا: ہمارا رب وہ ہے جس نے ہر چیز بنائی اور پھر راہ دکھائی۔ سچا علم یہ ہے کہ انسان اپنے رب کو پہچانے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:65–69",
          label: { en: "The magicians throw their ropes, and Musa's staff swallows their magic", ur: "جادوگر اپنی رسیاں پھینکتے ہیں اور موسیٰ کی لاٹھی اُن کا جادو نگل لیتی ہے" },
          explanation: {
            en: "The magicians made their ropes look like crawling snakes. But Musa's staff, with Allah's power, swallowed all their fake snakes. Allah's truth always beats their tricks.",
            ur: "جادوگروں نے اپنی رسیوں کو سانپوں کی شکل دی۔ مگر موسیٰ کی لاٹھی اللہ کے حکم سے ان سارے جھوٹے سانپوں کو نگل گئی۔ اللہ کا سچ ہمیشہ چالوں پر غالب آتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:70–73",
          label: { en: "The magicians prostrate and believe, even under Pharaoh's threats", ur: "جادوگر سجدہ کر کے ایمان لے آتے ہیں، چاہے فرعون دھمکائے" },
          explanation: {
            en: "When the magicians saw the truth, they fell in prostration and believed, even though Pharaoh threatened to hurt them. Seeing the truth clearly makes a heart brave.",
            ur: "جادوگروں نے سچ دیکھ لیا تو سجدے میں گر گئے اور ایمان لے آئے، چاہے فرعون نے انہیں دھمکیاں دیں۔ جب دل پر سچ ظاہر ہو جائے تو دل بہادر بن جاتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 17:101",
          label: { en: "Allah gave Musa nine clear signs", ur: "اللہ نے موسیٰ کو نو واضح نشانیاں دیں" },
          explanation: {
            en: "Allah gave Musa nine clear signs to show Pharaoh the truth. With each sign, Pharaoh's people promised to believe, but they kept breaking their promise.",
            ur: "اللہ نے موسیٰ کو نو واضح نشانیاں دیں تاکہ فرعون کو سچ دکھایا جائے۔ ہر نشانی پر فرعون کی قوم ایمان کا وعدہ کرتی، مگر وعدہ توڑ دیتی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:130–135",
          label: { en: "The plagues — drought, flood, locusts, lice, frogs, blood — and Pharaoh's people breaking their promise", ur: "عذاب — قحط، طوفان، ٹڈیاں، جوئیں، مینڈک، خون — اور فرعون کی قوم وعدہ توڑتی رہتی ہے" },
          explanation: {
            en: "Allah sent many trials upon Pharaoh's people: drought, flood, locusts, lice, frogs and blood. Each time they cried for help and promised to believe, but then forgot their promise.",
            ur: "اللہ نے فرعون کی قوم پر ایک کے بعد ایک آزمائشیں بھیجیں: قحط، طوفان، ٹڈیاں، جوئیں، مینڈک اور خون۔ ہر بار وہ مدد کے لیے چیختے اور ایمان کا وعدہ کرتے، مگر پھر وعدہ بھول جاتے۔",
          },
        },
      ],
    },
    {
      id: "the-night-of-the-sea",
      title: { en: "The Night of the Sea", ur: "سمندر کی رات" },
      paragraphs: [
        {
          en: "At last Allah revealed to Musa: \"Travel by night with My servants, and strike for them a dry path in the sea — not fearing to be overtaken, and not fearing the sea\" (Qur'an 20:77). So in the darkness of the night, Musa led his people out of Egypt, walking quietly toward the sea. Behind them was the land of Pharaoh; in front of them was a huge sea with no bridge at all.",
          ur: "آخر کار اللہ نے موسیٰ پر وحی بھیجی: \"میرے بندوں کو لے کر رات میں نکل جاؤ، اور اُن کے لیے سمندر میں خشک راستہ بنا لو — نہ پکڑے جانے کا ڈر، نہ سمندر کا خوف\" (قرآن 20:77)۔ پس اندھیری رات میں موسیٰ نے اپنی قوم کو خاموشی سے مصر سے نکالا اور سمندر کی طرف چل پڑے۔ اُن کے پیچھے فرعون کی سرزمین تھی؛ اُن کے سامنے ایک بہت بڑا سمندر تھا جس پر کوئی پل نہیں تھا۔",
        },
        {
          en: "Pharaoh woke up to find them gone, and his anger burned: \"Indeed, these are only a small party, and indeed, they have enraged us\" (Qur'an 26:54–55). He gathered his great army and chased them with the rising of the sun (Qur'an 26:53, 26:60). The children of Israel looked back and saw the dust of the army coming closer and closer, and the sea still blocking the way ahead.",
          ur: "فرعون صبح اٹھا تو دیکھا کہ وہ نکل چکے ہیں، اور اُس کا غصہ بھڑک اٹھا: \"بیشک یہ لوگ ایک چھوٹی سی جماعت ہیں، اور بیشک اُنہوں نے ہمیں غصہ دلا رکھا ہے\" (قرآن 26:54–55)۔ اُس نے اپنی بڑی فوج جمع کی اور سورج نکلتے ہی اُن کا پیچھا کیا (قرآن 26:53، 26:60)۔ بنی اسرائیل نے پیچھے مڑ کر دیکھا تو فوج کی دھول قریب آتی جا رہی تھی، اور سامنے سمندر راستہ روکے کھڑا تھا۔",
        },
        {
          en: "When the two groups saw each other, the people of Musa cried out in fear: \"Indeed, we will be overtaken!\" (Qur'an 26:61). But Musa stood tall and calm and said the most famous words of his life: \"No! Indeed, with me is my Lord — He will guide me\" (Qur'an 26:62). He did not look at the army, he did not look at the sea — he looked only to his Lord.",
          ur: "جب دونوں گروہوں نے ایک دوسرے کو دیکھا تو موسیٰ کی قوم ڈر سے چیخ اٹھی: \"بیشک ہم پکڑ لیے گئے!\" (قرآن 26:61)۔ لیکن موسیٰ سیدھے اور پرسکون کھڑے رہے اور اپنی زندگی کے سب سے مشہور الفاظ کہے: \"ہرگز نہیں! بیشک میرے ساتھ میرا رب ہے — وہ مجھے راستہ دکھائے گا\" (قرآن 26:62)۔ اُنہوں نے نہ فوج کی طرف دیکھا، نہ سمندر کی طرف — اُنہوں نے صرف اپنے رب کی طرف دیکھا۔",
        },
        {
          en: "Then Allah said: \"Strike the sea with your staff\" (Qur'an 26:63). Musa raised his staff and struck the water — and by the power of Allah, the sea split into two! \"Each part became like a great mountain\" (Qur'an 26:63). A dry road appeared through the middle of the sea, and Musa's people walked across on the dry path, safe on both sides of towering walls of water (Qur'an 20:77).",
          ur: "پھر اللہ نے فرمایا: \"اپنی لاٹھی سے سمندر پر مارو\" (قرآن 26:63)۔ موسیٰ نے لاٹھی اٹھائی اور پانی پر ضرب لگائی — اور اللہ کی قدرت سے سمندر دو حصوں میں پھٹ گیا! \"ہر حصہ ایک بڑے پہاڑ جیسا ہو گیا\" (قرآن 26:63)۔ سمندر کے بیچ میں خشک راستہ نکل آیا، اور موسیٰ کی قوم اُس خشک راستے پر چل کر گزر گئی، دونوں طرف پانی کی بلند دیواریں کھڑی تھیں اور وہ محفوظ تھے (قرآن 20:77)۔",
        },
        {
          en: "When Pharaoh saw the sea split, he was amazed — but his pride pushed him forward. \"So Pharaoh pursued them with his soldiers, and there covered them from the sea that which covered them\" (Qur'an 20:78). The waters closed over Pharaoh and his army, and they drowned — \"And Allah saved Musa and his people, and Pharaoh led his people astray and did not guide them\" (Qur'an 20:78–79). The same sea that was a wall of fear for the believers became a wall of victory.",
          ur: "جب فرعون نے سمندر کو پھٹتے دیکھا تو حیران رہ گیا — لیکن اُس کے تکبر نے اُسے آگے دھکیل دیا۔ \"پس فرعون نے اپنے لشکروں سمیت اُن کا پیچھا کیا، اور سمندر سے اُن پر ایسی چیز آ گئی جو اُن پر آ گئی\" (قرآن 20:78)۔ پانی فرعون اور اُس کی فوج پر بند ہو گیا اور وہ ڈوب گئے — \"اور اللہ نے موسیٰ اور اُن کی قوم کو بچا لیا، اور فرعون نے اپنی قوم کو گمراہ کیا، ہدایت نہ دی\" (قرآن 20:78–79)۔ جو سمندر ایمان والوں کے لیے خوف کی دیوار تھا، وہی اُن کے لیے فتح کی دیوار بن گیا۔",
        },
      ],
      ayahNote: {
        en: "When the army chased them and the sea blocked the way, Musa said: 'My Lord is with me, He will guide me.' And Allah split the sea. The same sea that was fear for the believers became their victory.",
        ur: "جب فوج نے پیچھا کیا اور سمندر نے راستہ روکا تو موسیٰ نے کہا: \"میرا رب میرے ساتھ ہے، وہ مجھے راستہ دکھائے گا۔\" اور اللہ نے سمندر کو چیر دیا۔ وہی سمندر ایمان والوں کے لیے خوف کی دیوار تھا، وہی ان کی فتح بن گیا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 20:77",
          label: { en: "Allah commands Musa to travel by night and strike a dry path in the sea", ur: "اللہ موسیٰ کو رات میں نکلنے اور سمندر میں خشک راستہ بنانے کا حکم دیتا ہے" },
          explanation: {
            en: "Allah told Musa: take My servants at night, and do not fear the sea — I will make a dry road for you. Where there seemed no way, Allah opened a way.",
            ur: "اللہ نے فرمایا: رات میں اپنے بندوں کو لے کر نکل جاؤ اور سمندر سے مت ڈرو — میں تمہارے لیے خشک راستہ بنا دوں گا۔ جہاں کوئی راستہ نہیں لگتا تھا، اللہ نے راستہ کھول دیا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 26:53–62",
          label: { en: "Pharaoh gathers his army and pursues; Musa's people fear being overtaken", ur: "فرعون فوج جمع کر کے پیچھا کرتا ہے؛ موسیٰ کی قوم پکڑے جانے سے ڈرتی ہے" },
          explanation: {
            en: "Pharaoh chased them with a great army. The people cried: we are caught! But Musa did not panic — he trusted Allah and said: indeed, with me is my Lord, He will guide me.",
            ur: "فرعون بڑی فوج کے ساتھ ان کے پیچھے لگا۔ قوم نے کہا: ہم پکڑے گئے! مگر موسیٰ گھبرائے نہیں — انہوں نے اللہ پر بھروسہ کیا اور کہا: بیشک میرا رب میرے ساتھ ہے، وہ مجھے راستہ دکھائے گا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 26:63",
          label: { en: "Allah commands Musa to strike the sea, and it splits into mountain-like parts", ur: "اللہ موسیٰ کو سمندر پر لاٹھی مارنے کا حکم دیتا ہے اور سمندر پہاڑ جیسے حصوں میں پھٹ جاتا ہے" },
          explanation: {
            en: "Musa struck the sea with his staff, and by Allah's power the water split like huge mountains, leaving a dry road in the middle. Allah's power is greater than the sea and the army together.",
            ur: "موسیٰ نے اپنی لاٹھی سے سمندر پر ضرب لگائی اور اللہ کی قدرت سے پانی بڑے پہاڑوں کی طرح پھٹ گیا، بیچ میں خشک راستہ نکل آیا۔ اللہ کی قدرت سمندر اور فوج دونوں سے بڑی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:78–80",
          label: { en: "Pharaoh and his soldiers drown in the sea while Allah saves Musa's people", ur: "فرعون اور اُس کی فوج سمندر میں ڈوب جاتی ہے جب کہ اللہ موسیٰ کی قوم کو بچا لیتا ہے" },
          explanation: {
            en: "Pharaoh followed them into the sea, and the waters closed over him and his army. The proud king who hunted the believers ended in the same sea that saved them.",
            ur: "فرعون بھی ان کے پیچھے سمندر میں گھس آیا، اور پانی اس کے اوپر بند ہو گیا۔ جو ظالم بادشاہ مومنوں کا شکار کرتا تھا، وہی سمندر اس کے لیے انجام بن گیا جو ایمان والوں کے لیے نجات تھا۔",
          },
        },
      ],
    },
    {
      id: "the-tablets-and-the-calf",
      title: { en: "The Tablets and the Golden Calf", ur: "لوحیں اور سونے کا بچھڑا" },
      paragraphs: [
        {
          en: "Safe on the other side of the sea, Allah called Musa to meet Him for forty nights (Qur'an 2:51). Before he left, Musa told his people: stay firm in worship, and wait for my return. The mountain would be their meeting place. The people agreed — but forty nights is a long time, and their hearts were not strong.",
          ur: "سمندر کے پار محفوظ ہو کر اللہ نے موسیٰ کو چالیس راتوں کے لیے اپنی ملاقات کے لیے بلایا (قرآن 2:51)۔ جانے سے پہلے موسیٰ نے اپنی قوم سے کہا: عبادت پر جمے رہو، اور میری واپسی کا انتظار کرو۔ پہاڑ اُن کی ملاقات کی جگہ ہو گی۔ قوم نے مان لیا — لیکن چالیس راتیں بہت لمبی مدت ہے، اور اُن کے دل کمزور تھے۔",
        },
        {
          en: "While Musa was away, a man named Samiri appeared among the people. He collected the gold ornaments of the people and melted them, and made a golden calf — a body of a calf that made a mooing sound (Qur'an 20:88). Then he told the people: \"This is your god and the god of Musa — but Musa has forgotten\" (Qur'an 20:88). Many people were fooled, and began to worship the golden calf!",
          ur: "جب موسیٰ دور تھے تو قوم میں سامری نام کا ایک شخص آیا۔ اُس نے لوگوں کے سونے کے زیورات جمع کیے، اُنہیں پگھلایا، اور ایک سونے کا بچھڑا بنا ڈالا — ایک ایسا بچھڑا جس سے آواز نکلتی تھی (قرآن 20:88)۔ پھر اُس نے لوگوں سے کہا: \"یہ تمہارا معبود ہے اور موسیٰ کا بھی — لیکن موسیٰ بھول گئے\" (قرآن 20:88)۔ بہت سے لوگ دھوکہ کھا گئے اور سونے کے بچھڑے کی عبادت کرنے لگے!",
        },
        {
          en: "Allah revealed to Musa what his people had done, and he returned to them \"angry and grieved\" (Qur'an 7:150). He said: \"O my people, did your Lord not promise you a good promise? Did the time become too long for you?\" (Qur'an 20:86). Then he threw down the tablets of the Torah in his sorrow, and he took hold of his brother's head, pulling him close, and said: \"O Harun, what prevented you when you saw them going astray?\" (Qur'an 20:92).",
          ur: "اللہ نے موسیٰ کو بتا دیا کہ اُن کی قوم نے کیا کیا، اور وہ \"غصے اور افسوس کی حالت میں\" واپس آئے (قرآن 7:150)۔ اُنہوں نے کہا: \"اے میری قوم! کیا تمہارے رب نے تم سے اچھا وعدہ نہیں کیا تھا؟ کیا تمہیں یہ مدت لمبی لگ گئی؟\" (قرآن 20:86)۔ پھر اُنہوں نے غم میں توریت کی لوحیں پھینک دیں، اور اپنے بھائی کا سر پکڑ کر اپنی طرف کھینچا، اور کہا: \"اے ہارون! جب تم نے اُنہیں گمراہ ہوتے دیکھا تو تمہیں کس چیز نے روکا؟\" (قرآن 20:92)۔",
        },
        {
          en: "Harun answered with a soft and wise heart: \"O son of my mother! Do not take hold of my beard nor my head. Indeed, I feared that you would say: 'You have divided the children of Israel, and you did not keep my word'\" (Qur'an 20:94). The people had become too many and too strong for him, and he did not want to split the believers. His answer made Musa's anger cool down, and he turned to Samiri instead.",
          ur: "ہارون نے نرم اور عقلمند دل سے جواب دیا: \"اے میری ماں کے بیٹے! میری داڑھی اور سر نہ پکڑو۔ بیشک مجھے ڈر تھا کہ تم کہو گے: 'تم نے بنی اسرائیل میں پھوٹ ڈال دی، اور تم نے میری بات نہ مانی'\" (قرآن 20:94)۔ قوم بہت بڑی اور بہت ضدی ہو چکی تھی، اور وہ نہیں چاہتے تھے کہ مومنین آپس میں بٹ جائیں۔ اُن کے جواب سے موسیٰ کا غصہ ٹھنڈا ہوا اور اُنہوں نے سامری کی طرف رخ کیا۔",
        },
        {
          en: "Musa said to Samiri: \"Go away! And indeed, you are to say in this life: 'Do not touch me.' And you have a promise from Allah that will not fail\" (Qur'an 20:97). As for the golden calf, Musa's people burned it and scattered it in the sea (Qur'an 7:148, 20:97). But even in their weak moment, Allah was merciful: \"Then We forgave you after that, so that you might be grateful\" (Qur'an 2:52), and He gave Musa the tablets — the Torah — \"and the criterion, that you might be guided\" (Qur'an 2:53).",
          ur: "موسیٰ نے سامری سے کہا: \"چلا جا! اور تیرے لیے اس زندگی میں یہ ہے کہ تو کہے: 'مجھے نہ چھونا۔' اور تیرا ایک وعدہ ہے جسے اللہ نہیں ٹالے گا\" (قرآن 20:97)۔ رہا سونے کا بچھڑا تو موسیٰ کی قوم نے اُسے جلا کر سمندر میں بکھیر دیا (قرآن 7:148، 20:97)۔ لیکن کمزوری کے اُس لمحے میں بھی اللہ رحم کرنے والا تھا: \"پھر ہم نے اُس کے بعد تمہیں معاف کر دیا، تاکہ تم شکر کرو\" (قرآن 2:52)، اور اُس نے موسیٰ کو لوحیں — توریت — اور \"فرقان عطا کیا، تاکہ تم ہدایت پاؤ\" (قرآن 2:53)۔",
        },
      ],
      ayahNote: {
        en: "While Musa was away meeting Allah, his people lost patience and worshipped a golden calf. Musa came back sad and angry, but Allah showed mercy and forgave them, and gave Musa the tablets of guidance.",
        ur: "جب موسیٰ اللہ کی ملاقات کے لیے گئے ہوئے تھے تو قوم نے صبر کھو دیا اور سونے کے بچھڑے کی عبادت کرنے لگی۔ موسیٰ غم اور غصے میں واپس آئے، مگر اللہ نے رحم کیا اور انہیں معاف کر دیا اور لوحوں کی راہنمائی عطا کی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 2:51–53",
          label: { en: "The forty-night appointment, the calf, and Allah's forgiveness and the tablets", ur: "چالیس راتوں کا وعدہ، بچھڑا، اللہ کی معافی اور لوحوں کا عطا ہونا" },
          explanation: {
            en: "Allah chose Musa for forty nights apart, but in that time the people slipped into a wrong worship. Even so, Allah forgave them and gave Musa the tablets of the Torah so they could be guided.",
            ur: "اللہ نے موسیٰ کو چالیس راتوں کے لیے بلایا، مگر اتنے میں قوم بھٹک گئی اور غلط عبادت میں پڑ گئی۔ پھر بھی اللہ نے انہیں معاف کیا اور موسیٰ کو توریت کی لوحیں عطا کیں تاکہ لوگ ہدایت پائیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:83–89",
          label: { en: "Samiri makes the golden calf that mooed, and the people worship it", ur: "سامری وہ بچھڑا بناتا ہے جس سے آواز نکلتی تھی، اور لوگ اُس کی عبادت کرتے ہیں" },
          explanation: {
            en: "A man named Samiri melted the people's gold and made a calf that mooed. The people were fooled and forgot that no statue can be their Lord.",
            ur: "سامری نامی شخص نے لوگوں کا سونا پگھلا کر ایک بچھڑا بنایا جس سے آواز نکلتی تھی۔ لوگ دھوکہ کھا گئے اور بھول گئے کہ کوئی بنا ہوا بت رب نہیں ہو سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:92–94",
          label: { en: "Musa returns angry, questions Harun, and Harun explains he feared splitting the believers", ur: "موسیٰ غصے میں واپس آ کر ہارون سے پوچھتے ہیں، اور ہارون کہتے ہیں کہ اُنہیں پھوٹ کا ڈر تھا" },
          explanation: {
            en: "Musa asked his brother Harun: why did you not stop them? Harun answered gently: I feared you would blame me for dividing the people. Kind words cooled Musa's anger.",
            ur: "موسیٰ نے اپنے بھائی ہارون سے پوچھا: تم نے انہیں کیوں نہیں روکا؟ ہارون نے نرمی سے جواب دیا: مجھے ڈر تھا کہ تم کہو گے کہ میں نے قوم میں پھوٹ ڈالی۔ نرم باتوں نے موسیٰ کا غصہ ٹھنڈا کر دیا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 20:95–97",
          label: { en: "Musa turns to Samiri, who is told to go away in this life", ur: "موسیٰ سامری کی طرف رخ کرتے ہیں، جسے زندگی میں دور جانے کا حکم ہوتا ہے" },
          explanation: {
            en: "Musa did not forgive the man who made the calf. Samiri was told to go away from people in this life, as a punishment for his wicked trick.",
            ur: "موسیٰ نے اس آدمی کو معاف نہیں کیا جس نے بچھڑا بنایا تھا۔ سامری کو یہ کہا گیا کہ اس زندگی میں لوگوں سے دور رہو — یہ اس کی بری چال کی سزا تھی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 7:148–150",
          label: { en: "The calf made from ornaments, Musa's anger, and his throwing down the tablets", ur: "زیورات سے بچھڑا بننا، موسیٰ کا غصہ اور اُن کا لوحیں پھینکنا" },
          explanation: {
            en: "The people made the calf from their own gold ornaments, then worshipped it. Musa was so sad that he threw down the tablets; it was a painful moment for the whole people.",
            ur: "قوم نے اپنے سونے کے زیورات سے بچھڑا بنا کر اس کی عبادت کی۔ موسیٰ اس قدر غمگین ہوئے کہ لوحیں پھینک دیں — یہ پوری قوم کے لیے بہت دکھ کا لمحہ تھا۔",
          },
        },
      ],
    },
    {
      id: "kalimullah",
      title: { en: "The Lesson of Musa: Kalimullah", ur: "کلیم اللہ کا سبق" },
      paragraphs: [
        {
          en: "Of all the prophets, Musa was given a very special honor: Allah spoke to him directly. The Qur'an says: \"And Allah spoke to Musa with direct speech\" (Qur'an 4:164). Because of this, Musa is called Kalimullah — the one to whom Allah spoke. He did not receive the message through a dream or through an angel only; his Lord spoke to him with His own speech.",
          ur: "تمام نبیوں میں موسیٰ کو ایک بہت خاص عزت ملی: اللہ نے اُن سے براہِ راست گفتگو کی۔ قرآن کہتا ہے: \"اور اللہ نے موسیٰ سے براہِ راست کلام فرمایا\" (قرآن 4:164)۔ اِسی لیے موسیٰ کو کلیم اللہ کہا جاتا ہے — یعنی وہ نبی جس سے اللہ نے کلام کیا۔ اُن تک پیغام نہ صرف خواب یا فرشتے کے ذریعے آیا؛ اُن کے رب نے اُن سے خود اپنا کلام فرمایا۔",
        },
        {
          en: "The Qur'an remembers Musa with beautiful praise: \"And mention in the Book Musa — indeed he was chosen, and he was a messenger and a prophet. And We called him from the right side of the mountain, and brought him near in private conversation\" (Qur'an 19:51–52). A shepherd who once prayed in the shade of Madyan became the one who spoke with the Lord of the worlds.",
          ur: "قرآن موسیٰ کو خوبصورت تعریف کے ساتھ یاد کرتا ہے: \"اور کتاب میں موسیٰ کا ذکر کرو — بیشک وہ چنا ہوا تھا، اور وہ رسول اور نبی تھا۔ اور ہم نے اُسے پہاڑ کی داہنی جانب سے پکارا، اور راز کی باتیں کرنے کے لیے قریب کیا\" (قرآن 19:51–52)۔ جو چرواہا کبھی مدین کے سائے میں دعا کرتا تھا، وہ جہانوں کے رب سے کلام کرنے والا بن گیا۔",
        },
        {
          en: "What can we learn from Musa's life? First: tawhid — Musa told Pharaoh again and again that Allah alone is the Lord, and nothing else deserves worship. Even when the whole palace worshipped idols, he stood for the one true God. The very first words Allah spoke to him were: \"Indeed, I am Allah — there is no god except Me, so worship Me\" (Qur'an 20:14).",
          ur: "ہم موسیٰ کی زندگی سے کیا سیکھ سکتے ہیں؟ پہلا سبق: توحید — موسیٰ نے فرعون کو بار بار بتایا کہ صرف اللہ ہی رب ہے، اور اُس کے سوا کوئی عبادت کا مستحق نہیں۔ جب پورا محل بتوں کی عبادت کرتا تھا، وہ ایک سچے معبود پر قائم رہے۔ اللہ نے اُن سے پہلے الفاظ میں یہی فرمایا تھا: \"بیشک میں ہی اللہ ہوں — میرے سوا کوئی معبود نہیں، پس میری عبادت کرو\" (قرآن 20:14)۔",
        },
        {
          en: "Second: patience. Musa faced a cruel king, magic, a stubborn people, a golden calf, and an impossible sea — yet he never stopped trusting Allah. When the army came closer and the sea blocked the way, he did not panic. He said: \"No! Indeed, with me is my Lord — He will guide me\" (Qur'an 26:62). Patience and trust in Allah made the impossible possible.",
          ur: "دوسرا سبق: صبر۔ موسیٰ کو ظالم بادشاہ، جادو، ضدی قوم، سونے کا بچھڑا اور ناممکن سمندر جیسے حالات کا سامنا کرنا پڑا — لیکن اُنہوں نے کبھی اللہ پر بھروسہ نہیں چھوڑا۔ جب فوج قریب آ رہی تھی اور سمندر راستہ روکے تھا، وہ گھبرائے نہیں۔ اُنہوں نے کہا: \"ہرگز نہیں! بیشک میرے ساتھ میرا رب ہے — وہ مجھے راستہ دکھائے گا\" (قرآن 26:62)۔ صبر اور اللہ پر بھروسے نے ناممکن کو ممکن بنا دیا۔",
        },
        {
          en: "Third: never lose hope in Allah's help. Musa began as a baby in a basket, hunted by a king. But the plan of Allah carried him to safety, and the same enemy raised him. His story ends with a nation saved and a king drowned. So when your problems look as big as the sea, remember Musa at the shore: the Lord who split the sea for him is the same Lord who watches over you — and His plan is always better than any plan of men.",
          ur: "تیسرا سبق: اللہ کی مدد سے کبھی مایوس نہ ہونا۔ موسیٰ نے شروعات ایک بادشاہ کے شکار کے طور پر، ایک ٹوکرے میں پڑے بچے کے طور پر کی۔ لیکن اللہ کا منصوبہ اُنہیں سلامتی تک لے گیا، اور اُسی دشمن کے گھر نے اُنہیں پالا۔ اُن کی کہانی کا اختتام ایک قوم کی نجات اور ایک ظالم بادشاہ کے ڈوبنے پر ہوتا ہے۔ پس جب تمہاری مشکلات سمندر جیسی بڑی لگیں، تو ساحل پر کھڑے موسیٰ کو یاد کرو: جس رب نے اُن کے لیے سمندر کو چیرا، وہی رب تمہارا بھی نگہبان ہے — اور اُس کا منصوبہ ہمیشہ کسی بھی انسان کے منصوبے سے بہتر ہوتا ہے۔",
        },
      ],
      ayahNote: {
        en: "Allah gave Musa a special honor: He spoke to him directly, which is why Musa is called Kalimullah, the one to whom Allah spoke. His life teaches us tawhid, patience, and never losing hope in Allah's help.",
        ur: "اللہ نے موسیٰ کو خاص عزت دی: اس نے ان سے براہ راست کلام فرمایا، اسی لیے موسیٰ کو کلیم اللہ کہا جاتا ہے۔ ان کی زندگی سے ہمیں توحید، صبر اور اللہ کی مدد سے کبھی مایوس نہ ہونے کا سبق ملتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 4:164",
          label: { en: "Allah spoke to Musa with direct speech — the honor of Kalimullah", ur: "اللہ نے موسیٰ سے براہِ راست کلام فرمایا — کلیم اللہ کا شرف" },
          explanation: {
            en: "This verse tells of the greatest honor given to Musa: Allah spoke to him without any messenger in between. That is why he is called Kalimullah.",
            ur: "یہ آیت موسیٰ کو ملی سب سے بڑی عزت بتاتی ہے: اللہ نے کسی فرشتے کے بغیر خود ان سے کلام فرمایا۔ اسی لیے وہ کلیم اللہ کہلاتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 19:51–52",
          label: { en: "Allah praises Musa as chosen, and calls him near from the right side of the mountain", ur: "اللہ موسیٰ کی تعریف کرتا ہے اور اُنہیں پہاڑ کی داہنی جانب سے قریب کرتا ہے" },
          explanation: {
            en: "Allah speaks about Musa with love: he was chosen, a messenger and a prophet, and Allah called him close for a private conversation. A shepherd became the friend of Allah's speech.",
            ur: "اللہ موسیٰ کا ذکر محبت سے کرتا ہے: وہ چنا ہوا، رسول اور نبی تھا، اور اللہ نے اسے راز کی باتیں کرنے کے لیے قریب بلایا۔ ایک چرواہا اللہ کے کلام کا مقرب بن گیا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 26:62",
          label: { en: "Musa trusts Allah at the sea — 'with me is my Lord, He will guide me'", ur: "موسیٰ سمندر پر اللہ پر بھروسہ کرتے ہیں — 'میرے ساتھ میرا رب ہے، وہ مجھے راہ دکھائے گا'۔" },
          explanation: {
            en: "At the hardest moment, Musa did not fear the army or the sea. He trusted Allah completely: with me is my Lord, He will guide me. That trust split the sea.",
            ur: "سب سے مشکل لمحے میں موسیٰ نہ فوج سے ڈرے نہ سمندر سے۔ انہوں نے پورا بھروسہ اللہ پر کیا: میرا رب میرے ساتھ ہے، وہ مجھے راہ دکھائے گا۔ اسی بھروسے نے سمندر کو چیر دیا۔",
          },
        },
      ],
    },
  ],
};
