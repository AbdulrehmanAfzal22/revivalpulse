import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Yunus (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger who left his people before he was commanded to, was swallowed
 * by a huge fish, and from its darkness cried out the beloved dua all believers
 * still learn today. Anchored to the true Yunus verses: Surah As-Saffat
 * (37:139–148), Surah Al-Anbiya (21:87–88) and Surah Yunus (10:98).
 * Urdu shown on the summary only; paragraphs use the English fallback.
 */
export const STORY_YUNUS: KidsStoryV2 = {
  id: "yunus",
  type: "prophet",
  nameArabic: "يونس",
  nameEnglish: "Yunus (Jonah)",
  illustrationSymbol: "Fish",
  accentColor: "#2b7a9e",
  summary: {
    en: "Yunus left his people before he was told to. He was swallowed by a huge fish, and in its darkness he called out to Allah — a dua many people still learn today.",
    ur: "یونس علیہ السلام نے اپنی قوم کو چھوڑ دیا تھا جب اُنہیں جانے کی اجازت نہیں ملی تھی۔ اُنہیں ایک بڑی مچھلی نے نگل لیا، اور اُس کی تاریکی میں اُنہوں نے اللہ کو پکارا — یہ وہ دعا ہے جو آج بھی بہت سے لوگ سیکھتے ہیں۔",
  },
  chapters: [
    {
      id: "sent-to-a-town",
      title: { en: "A Messenger Sent to a Stubborn Town" },
      paragraphs: [
        {
          en: "Allah sent His messenger Yunus to a town whose people had forgotten Him. The Qur'an begins his story with honour: “And indeed, Yunus was among the messengers” (Qur'an 37:139).",
        },
        {
          en: "Yunus called his people, morning and evening, telling them to worship Allah alone. He warmed their hearts with soft words and asked them to turn away from their wrongdoings before it was too late.",
        },
        {
          en: "Day after day he tried, but the people would not listen. They mocked him and went on with their own lives, as if he had never spoken to them.",
        },
        {
          en: "A prophet's heart grows heavy when people refuse his message. Yunus waited and he grew sorrowful, wondering when the hearts around him would ever soften.",
        },
      ],
      ayahNote: {
        en: "The Qur'an introduces Yunus with honour before his story begins: he was one of Allah's messengers (Qur'an 37:139). Even when his town refused to listen, he kept calling them with kind words.",
        ur: "قرآن یونس کی کہانی شروع ہونے سے پہلے ہی اُنہیں عزت دیتا ہے: وہ اللہ کے رسولوں میں سے تھے (قرآن 37:139)۔ جب بستی نے سُننا چھوڑ دیا تب بھی وہ نرم الفاظ سے اُنہیں بلاتے رہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:139",
          label: {
            en: "Allah names Yunus among the messengers",
            ur: "اللہ یونس کا نام رسولوں میں لیتا ہے",
          },
          explanation: {
            en: "Allah starts the story with honour: Yunus was one of His chosen messengers. Even before his mistake, he is named among the prophets.",
            ur: "اللہ کہانی عزت کے ساتھ شروع کرتا ہے: یونس اُس کے چنے ہوئے رسولوں میں سے تھے۔ غلطی سے پہلے ہی وہ نبیوں میں شمار کیے جاتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:143",
          label: {
            en: "Yunus is remembered as one of those who glorify Allah",
            ur: "یونس اللہ کی تسبیح کرنے والوں میں یاد کیے جاتے ہیں",
          },
          explanation: {
            en: "This verse plants a small seed: because Yunus always remembered Allah and praised Him, that habit would save him later inside the fish.",
            ur: "یہ آیت ایک چھوٹا بیج لگاتی ہے: کیونکہ یونس ہمیشہ اللہ کو یاد کرتے تھے، یہی عادت بعد میں اُنہیں مچھلی کے پیٹ میں بچائے گی۔",
          },
        },
      ],
    },
    {
      id: "leaves-in-haste",
      title: { en: "Leaving Before He Was Commanded" },
      paragraphs: [
        {
          en: "One day, upset and tired of waiting, Yunus made a big decision: he left his town and walked all the way down to the harbour. He was leaving before Allah had ever given him the leave to go.",
        },
        {
          en: "The Qur'an tells it softly but truly: “When he ran away to the laden ship” (Qur'an 37:140) — a messenger setting out on his own road, hoping to leave his troubles behind.",
        },
        {
          en: "He climbed aboard a heavy ship loaded with goods, and the sailors pushed it out toward the open waves. Soon the sea around him became dark and wild.",
        },
        {
          en: "He thought the town's trouble would stay behind him. He did not know that no sea is deep enough, and no distance far enough, to carry a servant away from the One Who watches.",
        },
      ],
      ayahNote: {
        en: "Yunus left before he was allowed to go (Qur'an 37:140). A messenger who leaves before Allah's command walks into trouble by himself. Leaving a hard task without a command is never the answer.",
        ur: "یونس نے اجازت ملنے سے پہلے ہی چلے گئے (قرآن 37:140)۔ جو رسول اللہ کے حکم سے پہلے جگہ چھوڑے، وہ خود اپنی مشکلیں بلاتا ہے۔ بغیر حکم کے کام چھوڑنا کبھی حل نہیں ہوتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:140",
          label: {
            en: "Yunus runs away to the loaded ship before he was commanded to leave",
            ur: "یونس جانے کے حکم سے پہلے بھری ہوئی کشتی کی طرف بھاگ کر جاتے ہیں",
          },
          explanation: {
            en: "The Qur'an tells the soft truth: the prophet ran to a ship before he was commanded. Leaving Allah's place without leave brings the trouble that makes us return.",
            ur: "قرآن نرم حقیقت بیان کرتا ہے: یونس نے حکم سے پہلے کشتی کی طرف بھاگ۔ جہاں سے حکم آنا تھا، اُسے چھوڑ کر روانہ ہونا ہی مسئلہ بناتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 21:87",
          label: {
            en: "Yunus departs in anger, thinking he could escape his task",
            ur: "یونس غصے میں نکل جاتے ہیں، یہ سوچتے ہوئے کہ وہ اپنی ذمہ داری سے بچ سکیں گے",
          },
          explanation: {
            en: "This verse says Yunus left in anger. Anger brought him to the sea, but no anger can escape the One Who sees everything.",
            ur: "یہ آیت بتاتی ہے کہ یونس غصے میں نکلے۔ غصہ اُنہیں سمندر تک لے آیا، لیکن کوئی غصہ اُس سے نہیں بچ سکتا جو سب کچھ دیکھتا ہے۔",
          },
        },
      ],
    },
    {
      id: "the-storm",
      title: { en: "Storm at Sea" },
      paragraphs: [
        {
          en: "Far out on the water, the weather turned fierce. Mighty waves began to toss the loaded ship to and fro, and the frightened sailors feared the boat would sink with all of them.",
        },
        {
          en: "They gathered to decide who must be lowered into the sea to lighten the load and calm the wind. They cast lots — and the name that came out was Yunus (Qur'an 37:141).",
        },
        {
          en: "Then they cast again, and again the same name came out. Whatever they tried, the lots kept pointing to the prophet of Allah.",
        },
        {
          en: "Yunus understood then that his flight had been a mistake, and that the storm was a loving call from Allah to turn back. So with a quiet heart, he gave himself to the sea.",
        },
        {
          en: "He was thrown overboard, the waves swallowed him, and then — the Quran says: “Then the great fish swallowed him, while he was blameworthy” (Qur'an 37:142).",
        },
      ],
      ayahNote: {
        en: "The storm itself was the mercy of Allah calling Yunus back. The lots chose him again and again (Quran 37:141), and the sea, the wind and even the fish all obeyed Allah's plan.",
        ur: "طوفان خود اللہ کی رحمت تھی جو یونس کو واپس بلا رہی تھی۔ قرعہ بار بار یونس کا نام لے کر آیا (قرآن 37:141)، اور سمندر، ہوا اور مچھلی سب اللہ کے منصوبے پر چلے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:141",
          label: {
            en: "Yunus draws lots with the sailors and is the one chosen to be cast into the sea",
            ur: "یونس کا ملاحوں کے ساتھ قرعہ ڈالا جاتا ہے اور انہی کا نام نکلتا ہے کہ انہیں سمندر میں ڈالا جائے",
          },
          explanation: {
            en: "Whenever the sailors cast lots, Yunus's name came out. It was a sign that no sea can hide anyone from Allah's plan.",
            ur: "جب بھی ملاح قرعہ ڈالتے، یونس کا نام نکلتا۔ یہ نشانی تھی کہ کوئی سمندر اللہ کے منصوبے سے نہیں بچا سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:142",
          label: {
            en: "A great fish swallows Yunus while he is to be blamed",
            ur: "ایک بڑی مچھلی یونس کو نگل لیتی ہے جبکہ وہ الزام کے مستحق تھے",
          },
          explanation: {
            en: "The fish swallowed Yunus at the moment he was at fault. The flight had led him to the darkest place — the very place where he would finally call his Lord.",
            ur: "مچھلی نے یونس کو اسی وقت نگلا جب وہ قصور وار تھے۔ بھاگ اُنہیں گہری جگہ لے گئی — اسی جگہ جہاں سے اُنہوں نے اپنے رب کو پکارا۔",
          },
        },
      ],
    },
    {
      id: "in-the-fish",
      title: { en: "In the Darkness of the Fish" },
      paragraphs: [
        {
          en: "Inside the belly of the fish, it was dark, and wet, and cold. There were no friends, no lamps, and no hope that anyone could hear him — only Yunus and his memory of the town he had wanted to escape.",
        },
        {
          en: "The Qur'an describes what happened next: “But he cried out through the darkness: 'There is no god except You — Glory be to You — indeed, I have been of the wrongdoers'” (Qur'an 21:87).",
        },
        {
          en: "In that moment, Yunus did not blame the fish or the sailors. He looked at himself honestly and admitted: I made the mistake. I was among the wrongdoers.",
        },
        {
          en: "And the blessed words of As-Saffat add: “Had he not been among those who glorify Allah, he would indeed have remained inside its belly until the Day of Resurrection” (Qur'an 37:143–144).",
        },
        {
          en: "Inside the darkest prison beneath the sea, Yunus found the light of remembrance. He remembered Allah — and that remembrance was his finest treasure.",
        },
      ],
      ayahNote: {
        en: "In the darkness inside the fish, Yunus said the dua of the wrongdoer: “There is no god except You, Glory be to You, indeed I have been of the wrongdoers” (Qur'an 21:87). The One who had scattered the years and the seas found in that dua the lamp of rescue.",
        ur: "مچھلی کے پیٹ کی تاریکی میں یونس نے ظالموں والی دعا پڑھی: “تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ظالموں میں سے تھا” (قرآن 21:87)۔ اور اسی دعا میں اُسے نجات کا چراغ ملا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 21:87",
          label: {
            en: "Yunus calls out from the darkness with the dua: 'There is no god but You, Glory be to You' — admitting he was among the wrongdoers",
            ur: "یونس تاریکی میں دعا سے پکارتے ہیں: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے' — یہ مانتے ہوئے کہ وہ ظالموں میں سے تھے",
          },
          explanation: {
            en: "The dua of Yunus holds two things: glory for Allah alone, and the honest truth about ourselves. Admitting our own wrong is the first step to rescue.",
            ur: "یونس کی دعا میں دو چیزیں ہیں: صرف اللہ کے لیے پاکیزگی، اور اپنے بارے میں سچ۔ اپنی غلطی کا اقرار نجات کا پہلا قدم ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:143–144",
          label: {
            en: "Had Yunus not been among those who glorify Allah, he would have stayed in the fish until the Day of Resurrection",
            ur: "اگر یونس اللہ کی تسبیح کرنے والوں میں سے نہ ہوتے تو وہ قیامت کے دن تک مچھلی کے پیٹ میں رہتے",
          },
          explanation: {
            en: "The habit of remembering Allah was Yunus's way out. Because his heart was full of His glory, the darkness could not hold him forever.",
            ur: "اللہ کی یاد یونس کے نکلنے کا راستہ تھی۔ کیونکہ اُن کے دل میں اُس کی تعریف تھی، تاریکی اُنہیں ہمیشہ قید نہیں کر سکی۔",
          },
        },
      ],
    },
    {
      id: "the-dua",
      title: { en: "The Dua That Everyone Still Learns" },
      paragraphs: [
        {
          en: "The prayer of Yunus — “La ilaha illa anta, subhanaka, inni kuntu min al-dhalimin” — means: “There is no god but You, Glory be to You, truly I have been among the wrongdoers” (Qur'an 21:87).",
        },
        {
          en: "This dua is perfect and strong because it contains two things: full praise falling to Allah alone, and a gentle, honest admittance of our own mistake.",
        },
        {
          en: "Allah answered that tiny voice lost at the bottom of the sea. The Qur'an says: “So We responded to his call and saved him from the distress, and thus do We save the believers” (Qur'an 21:88).",
        },
        {
          en: "That is why this dua is still loved and learned by Muslims today. Whenever someone is in trouble and whispers these same words from the heart, Allah is just as near to them as He was to Yunus in the belly of the fish.",
        },
      ],
      ayahNote: {
        en: "The dua of Yunus is a strong prayer because it holds two keys: glory for Allah only and honesty about ourselves. Allah's answer, “and thus do We save the believers” (Qur'an 21:88), stays open for others who read it.",
        ur: "یونس کی دعا ایک مضبوط دعا ہے کیونکہ اس میں دو چابیاں ہیں: صرف اللہ کی تعریف اور اپنے بارے میں سچ۔ اللہ کا وعدہ “اسی طرح ہم مومنین کو نجات دیتے ہیں” (قرآن 21:88) اُن کے لیے بھی ہے جو آج اس پر عمل کریں۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 21:87",
          label: {
            en: "Yunus prays from the darkness: there is no god but You, Glory be to You, I was among the wrongdoers",
            ur: "یونس تاریکی میں دعا کرتے ہیں: تیرے سوا کوئی معبود نہیں تو پاک ہے، میں ظالموں میں سے تھا",
          },
          explanation: {
            en: "The dua that comes from deep honesty: it declares Allah is pure, and the servant is not. From that truth, the darkness opens.",
            ur: "یہ دعا دل کی سچائی سے نکلتی ہے: اللہ کو پاک کہتی ہے اور بندہ اپنی غلطی مان لیتا ہے۔ اسی سچ سے تاریکی کھلتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 21:88",
          label: {
            en: "Allah answers his call and saves him from the distress, and saves the believers the same way",
            ur: "اللہ ان کی پکار کا جواب دیتا ہے اور انہیں مصیبت سے نجات دلا کر مومنوں کو اسی طرح نجات دیتا ہے",
          },
          explanation: {
            en: "This verse shows the pattern of mercy: the same rescue that came to Yunus is for every believer who calls to Allah from the heart.",
            ur: "یہ آیت رحمت کا طریقہ دکھاتی ہے: وہی نجات جو یونس کو ملی، ہر اُس مومن کے لیے ہے جو دل سے اللہ کو پکارے۔",
          },
        },
      ],
    },
    {
      id: "saved-on-shore",
      title: { en: "Saved on the Shore, With a Shade Plant" },
      paragraphs: [
        {
          en: "The great fish obeyed its Lord and carried Yunus across the sea. In the Qur'an, Allah describes the rescue: “We cast him out onto the empty shore, while he was sick” (Qur'an 37:145).",
        },
        {
          en: "Yunus was weak after his long, dark journey. But Allah was kind to His servant — the Qur'an continues, “And We caused to grow over him a tree from the gourd family” (Genie: 37:146).",
        },
        {
          en: "A fresh green vine bush grew above him to give him shade, so the long-awaited sun would not sting his tired body. Mercy after the storm, shade after the darkness — that is the pattern of Allah with His patient servants.",
        },
        {
          en: "On that quiet shore, Yunus rested and grew strong again, one simple tree serving as his shelter, and in his heart the Greatest Light of all.",
        },
      ],
      ayahNote: {
        en: "After the belly of the fish came the green shade plant (Qur'an 37:146). Allah rescued Yunus from the sea, then cared for him with shade — mercy after mercy, proving his Lord never left him.",
        ur: "مچھلی کے پیٹ کے بعد ساحل کے کنارے سایہ کرنے والا پودا آیا (قرآن 37:146)۔ اللہ نے یونس کو سمندر سے بچایا، پھر اُن پر سایہ کیا — رحمت کے بعد رحمت، یہ ثبوت ہے کہ اُن کا رب اُنہیں کبھی نہیں چھوڑتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:145",
          label: {
            en: "Allah casts Yunus out onto the empty, shore while he was sick",
            ur: "اللہ یونس کو خالی ساحل پر ڈال دیتا ہے جبکہ وہ بیمار تھے",
          },
          explanation: {
            en: "The fish let Yunus go at its Lord's command, and Allah placed His servant gently on the empty shore, weak from the days inside.",
            ur: "مچھلی نے اپنے رب کے حکم سے یونس کو چھوڑ دیا، اور اللہ نے اپنے بندے کو خالی ساحل پر نرمی سے اتارا، اندر کے دنوں کی کمزوری کے ساتھ۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 37:146",
          label: {
            en: "Allah causes a gourd plant to grow over Yunus to give him shade",
            ur: "اللہ یونس کے اوپر کدو کا پودا اگاتا ہے تاکہ انہیں سایہ ملے",
          },
          explanation: {
            en: "Allah did not only save Yunus, He gave him shade and food. His mercy cares for the body and the heart together.",
            ur: "اللہ نے یونس کو نہ صرف بچایا، بلکہ اُن کے لیے سایہ اور پودے کی برکت دی۔ اُس کی رحمت جسم اور دل دونوں کا خیال رکھتی ہے۔",
          },
        },
      ],
    },
    {
      id: "town-believed",
      title: { en: "The Town That Believed" },
      paragraphs: [
        {
          en: "When strength returned to Yunus, Allah sent him back to his town. And there the greatest surprise of his life was waiting: the people had believed in Allah!",
        },
        {
          en: "The Qur'an says: “And We sent him to a hundred thousand people, or even more — and they believed, so We granted them enjoyment for a while” (Qur'an 37:147–148).",
        },
        {
          en: "And there is a very special verse about them: “Was there any town that believed, and its faith benefited it, except the town of Yunus? When they believed, We removed from them the punishment of disgrace in the life of this world” (quran:10:98).",
        },
        {
          en: "They are the only town in the Qur'an whose belief in that final moment saved them from the punishment. All because they finally listened.",
        },
        {
          en: "It is a grateful finish for the whole journey: a prophet who ran, a fish that swallowed him, a darkness, a beautiful dua, and then — a whole town saved. Mercy is always bigger than every mistake.",
        },
      ],
      ayahNote: {
        en: "The town of Yunus is the only town in the Qur'an whose belief, even at the very last moment, removed the punishment (Qur'an 10:98). It shows that Allah's mercy can reach even a whole town that turns back.",
        ur: "یونس کی بستی وہ واحد بستی ہے جس کے آخری لمحے کے ایمان سے عذاب ٹال دیا گیا (قرآن 10:98)۔ یہ دکھاتا ہے کہ اللہ کی رحمت اُس پوری بستی تک پہنچ گئی جو لوٹ آئی۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 37:147–148",
          label: {
            en: "Allah sent Yunus back to over a hundred thousand people and they believed",
            ur: "اللہ نے یونس کو ایک لاکھ سے زیادہ لوگوں کی طرف واپس بھیجا اور وہ ایمان لے آئے",
          },
          explanation: {
            en: "Yunus returned to his town and found them all believers. The patience of the prophet brought the whole town to Allah.",
            ur: "یونس اپنی بستی لوٹے تو سارے لوگ ایمان لے آئے تھے۔ نبی کے صبر نے پوری بستی کو اللہ تک پہنچا دیا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 10:98",
          label: {
            en: "The town of Yunus is the only town whose late belief profited it at all; punishment was removed",
            ur: "یونس کی بستی وہ واحد بستی ہے جسے دیر سے ایمان لانا کچھ فائدہ پہنچا؛ اس سے عذاب بھی ٹال دیا گیا",
          },
          explanation: {
            en: "Only the town of Yunus received mercy at the final moment: when they believed, the punishment was lifted. It is the brightest proof that mercy waits for those who turn back.",
            ur: "صرف یونس کی بستی کو آخری لمحے رحمت ملی: جب وہ ایمان لائے تو عذاب ہٹ گیا۔ یہ روشن ثبوت ہے کہ رحمت لوٹنے والوں کا انتظار کرتی ہے۔",
          },
        },
      ],
    },
  ],
};
