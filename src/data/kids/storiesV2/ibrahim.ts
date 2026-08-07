import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Ibrahim (AS) — KidsStoryV2 story (Phase 12).
 *
 * Follows the Adam reference shape: every chapter has 4–8 real narrative
 * paragraphs and a non-empty `sources` array. Qur'an anchors come only from
 * the verified verses (9:114, 2:127); other events are anchored to Ibn Kathir's
 * Tafsir / Qasas at book level with `needsVerification: true`, or to a hadith
 * in Sahih al-Bukhari / Sahih Muslim that the author is confident in.
 *
 * `ur` is empty except for `summary`: readers see the English fallback until
 * careful Urdu translations are added in a later pass.
 */
export const STORY_IBRAHIM: KidsStoryV2 = {
  id: "ibrahim",
  type: "prophet",
  nameArabic: "إبراهيم",
  nameEnglish: "Ibrahim (Abraham)",
  illustrationSymbol: "Flame",
  accentColor: "#e2622a",
  summary: {
    en: "Ibrahim questioned idol worship from a young age and stayed firm in believing in the One God, even when his people threw him into a great fire. Allah kept the fire safe for him and honored him as His close friend. He and his son Ismail built the Kaaba together, and his story teaches us to trust Allah completely, even in the hardest tests.",
    ur: "ابراہیم علیہ السلام نے چھوٹی عمر ہی سے بتوں کی عبادت سے سوال کیا اور ایک اللہ پر ایمان رکھنے پر مضبوط رہے، حتی کہ ان کی قوم نے انہیں بڑی آگ میں ڈال دیا۔ اللہ نے آگ کو ان کے لیے ٹھنڈی کیا اور انہیں اپنا خلیل یعنی دوست بنایا۔ انہوں نے اپنے بیٹے اسماعیل کے ساتھ مل کر کعبہ بنایا، اور ان کی کہانی سکھاتی ہے کہ مشکل ترین آزمائش میں بھی اللہ پر مکمل بھروسا رکھنا چاہیے۔",
  },
  chapters: [
    {
      id: "searching-for-truth",
      title: { en: "A Boy Looking for the Truth" },
      paragraphs: [
        {
          en: "Prophet Ibrahim grew up in a town where the people worshipped statues made from stone. His father and the whole town around him would bow before these idols and ask them for help, believing that the stones could give them whatever they wanted.",
        },
        {
          en: "But even as a young boy, Ibrahim's heart was not at peace with this. He knew that the true Lord should be someone very great, someone who never disappears. So he looked up at the night sky and studied the bright stars that sparkled overhead.",
        },
        {
          en: "When he saw a beautiful star he asked himself: could this be my Lord? But then the star set and disappeared, and he understood with a gentle heart that anything which can fade away can never be the Creator, who is always there.",
        },
        {
          en: "He then looked at the moon, and it too rose and set. He looked at the sun, warm and brilliant, and still the evening came and the sun vanished as well. One by one the lights of the sky slipped away, and Ibrahim knew in his heart that only Allah, the One who made them all, deserves to be worshipped.",
        },
        {
          en: "So, even before the people knew him as a prophet, the truth was already growing inside him like a treasure: there is no god except Allah. A young honest heart had found the straight path all on its own, being guided by its Creator.",
        },
      ],
      ayahNote: {
        en: "A young heart searched the stars, the moon and the sun, and one by one each light faded away. The truth it found is this: the real Lord is the One who never disappears, and a sincere heart can find Him on its own.",
        ur: "ایک جوان دل نے ستاروں، چاند اور سورج کو باری باری آزمایا، اور ہر ایک کی روشنی کسی نہ کسی وقت غروب ہو گئی۔ سچائی یہ ہے: اصل رب وہی ہے جو کبھی غائب نہیں ہوتا، اور ایک خالص دل اُسے خود بھی ڈھونڈ سکتا ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 6:74-79)",
          label: { en: "Ibn Kathir narrates how young Ibrahim tried the star, the moon and the sun before reaching the truth of Allah's oneness", ur: "ابن کثیر بیان کرتے ہیں کہ چھوٹے ابراہیم نے اللہ کی توحید کی سچائی تک پہنچنے سے پہلے ستارے، چاند اور سورج کو آزمایا" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "calling-the-family",
      title: { en: "Calling the Family to Faith" },
      paragraphs: [
        {
          en: "When Ibrahim grew up, Allah chose him as a prophet and sent him to his town. His task was gentle yet bold: to call the people, starting with his own dear family, to leave the statues and to worship Allah alone.",
        },
        {
          en: "He spoke with tenderness and love. He asked his father why he bowed before a stone that could neither hear nor help him, and he told him that true knowledge had come to him. But the father did not want to change and went on serving the idols.",
        },
        {
          en: "Ibrahim was patient every day. He invited the whole town with kind words, but the people had loved their idols for so long that they made fun of what he said. Still he kept calling, never harsh, never surrendering the truth for the sake of their anger.",
        },
        {
          en: "Because he loved his father so dearly, he made a promise to him and asked Allah to forgive him, hoping in his heart that his father would be guided. The Qur'an says: \"And Ibrahim's praying for forgiveness for his father was only because of a promise he had made to him\" (Qur'an 9:114).",
        },
        {
          en: "From this a child can learn a lovely lesson: you can love people very deeply and still wish for them what is true and good. Even when people stay with their old ways, a gentle heart keeps hoping and keeps behaving with kindness.",
        },
      ],
      ayahNote: {
        en: "The key verse of this chapter is from Qur'an 9:114: Ibrahim only asked Allah to forgive his father because of a promise he had once made. It teaches children that you can love someone with your whole heart — and still hold on to the truth of Allah.",
        ur: "اس باب کی مرکزی آیت سورہ توبہ کی ہے: ابراہیم نے اپنے باپ کے لیے مغفرت کی دعا صرف اس وجہ سے کی تھی کہ اُنہوں نے ایک بار اُس سے وعدہ کیا تھا۔ یہ بچوں کو سکھاتی ہے کہ تم کسی سے دل سے محبت کر سکتے ہو — اور پھر بھی اللہ کے سچ کو نہ چھوڑو۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 9:114",
          label: { en: "Ibrahim prayed for forgiveness for his father because of a promise he had made to him", ur: "ابراہیم نے اپنے باپ کے لیے مغفرت کی دعا کی کیونکہ انہوں نے اپنے باپ سے ایک وعدہ کیا تھا" },
          explanation: {
            en: "This ayah does not say that Ibrahim loved his father's idols — it shows he kept a promise made with love. Kindness and truth can live together in the same heart.",
            ur: "اس آیت کا مطلب یہ نہیں کہ ابراہیم کو اپنے باپ کے بت پسند تھے — یہ بتاتی ہے کہ اُنہوں نے محبت کے ساتھ کیے گئے وعدے کو ہی نبھایا۔ نرمی اور سچائی ایک ہی دل میں اکٹھی رہ سکتی ہیں۔",
          },
        },
      ],
    },
    {
      id: "the-fire",
      title: { en: "The Miracle of the Fire" },
      paragraphs: [
        {
          en: "The people of Ibrahim grew more and more angry, because their idols could not help them and the young messenger would not stop. So the town gathered together and its leaders chose a very cruel punishment for him.",
        },
        {
          en: "They built a huge fire, a great blazing furnace so tall that its warm light could be seen from far away. Then they put Ibrahim into the middle of the flames, hoping that the fire would finish what their words could not.",
        },
        {
          en: "But Ibrahim trusted his Lord completely. As the flames drew near, he simply placed his whole heart in the hand of Allah, saying that Allah alone was enough for him. His body entered the heat, but his heart was safe in the care of his Lord.",
        },
        {
          en: "And then the miracle happened: Allah told the fire to become cool and safe for Ibrahim. The great blaze turned calm and gentle around him. When the smoke cleared, Ibrahim stepped out completely safe, as if he had only rested in the shade of a garden.",
        },
        {
          en: "That was a lesson no statue could ever give: the hot fire of an entire people cannot harm a heart that truly trusts in Allah. Even fire obeys the command of the Only One who deserves to be worshipped.",
        },
      ],
      ayahNote: {
        en: "The fire of an entire town blazed around Ibrahim, yet the Qur'an tells us Allah's words were obeyed by the fire itself: become cool and safe. The key lesson for a child: a heart that truly trusts in Allah is stronger than any heat in the world.",
        ur: "پوری قوم کی آگ ابراہیم کے گرد بھڑکی، مگر اللہ کے حکم نے خود آگ کو کہا: ٹھنڈی ہو جاؤ اور محفوظ رہو۔ بچوں کے لیے یہ سبق ہے: جو دل سچے دل سے اللہ پر بھروسہ کرتا ہے، وہ دنیا کی ہر آگ سے زیادہ مضبوط ہوتا ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir (Qur'an 21:68-70)",
          label: { en: "Ibn Kathir narrates how the great fire was made cool and safe for the Prophet Ibrahim", ur: "ابن کثیر بیان کرتے ہیں کہ کس طرح بڑی آگ ابراہیم علیہ السلام کے لیے ٹھنڈی اور محفوظ بنا دی گئی" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-sacrifice",
      title: { en: "The Test of the Sacrifice" },
      paragraphs: [
        {
          en: "In his old age, after many years of travel and trust, Allah blessed Ibrahim with a dear son named Ismail. The boy grew up gentle, obedient and strong, and he filled his father's heart with joy.",
        },
        {
          en: "Then came the most difficult test a father could ever face. Ibrahim saw in a dream that he was asked to offer his beloved son to Allah. The dreams of the prophets are true, so he knew the command was real and that no love could ever compete with the love of Allah.",
        },
        {
          en: "He talked with his son about the dream. Instead of crying or running away, Ismail answered with a peace that the whole world admires: \"O my father, do as you are commanded. You will find me, if Allah wills, among the patient.\"",
        },
        {
          en: "Both father and son obeyed Allah with all their hearts, and at that moment Allah held back the hand and sent a great sacrifice in the place of the son. It was a beautiful gift of mercy from the Lord, and the test was accepted.",
        },
        {
          en: "That is why the believers remember this event every year on Eid al-Adha, the festival of the sacrifice, when families share meat with relatives and with people in need. It is a beautiful yearly reminder that submitting to Allah brings safety and mercy in the end.",
        },
      ],
      ayahNote: {
        en: "This chapter's heart beats in the Qur'an's account of the dreams of the prophets (37:102-109): Ibrahim and Ismail obeyed a hard command together, and Allah sent a great sacrifice instead. Obedience that is tested and passed becomes a mercy remembered forever — that is the story of the Eid, the day of the festival.",
        ur: "اس باب کا دل سورہ صافات کی باتوں میں دھڑکتا ہے: ابراہیم اور اسماعیل نے سخت حکم پر مل کر اطاعت کی، اور اللہ نے ایک بڑا ذبیحہ اُن کی جگہ بھیجا۔ آزمائی ہوئی اطاعت ہمیشہ یاد رکھی جانے والی رحمت بن جاتی ہے — یہی عید کے دن کی کہانی ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Ibn Kathir's Tafsir of Qur'an 37:100-109",
          label: { en: "Ibn Kathir narrates Ibrahim's dream to offer his son, the son's faithful patience, and the great sacrifice sent in his place", ur: "ابن کثیر بیان کرتے ہیں کہ ابراہیم کا خواب کہ وہ اپنے بیٹے کو قربان کریں گے، بیٹے کا وفاداری سے صبر، اور ان کی جگہ بھیجا گیا بڑا ذبیحہ" },
          needsVerification: true,
        },
      ],
    },
    {
      id: "the-kaaba",
      title: { en: "Building the Kaaba" },
      paragraphs: [
        {
          en: "After the great test, Allah gave Ibrahim another wonderful task: to raise a House of prayer in the valley of Makkah, the very first House built for the worship of Allah alone, and a safe refuge for all who come to it.",
        },
        {
          en: "The builders of this House show the beauty of a family of faith: a father and his son, Ibrahim and Ismail together. They worked hand in hand, raising stone upon stone, and their hearts were full of dua as the wall grew taller.",
        },
        {
          en: "When the two of them raised the foundations, they prayed together from the heart: \"Our Lord, accept this from us. Truly You are the All-Hearing, the All-Knowing\" (Qur'an 2:127). They did not build it to be praised by people; they built it so that Allah would be pleased.",
        },
        {
          en: "They also asked that among their children would grow a nation that submits to the one Creator, and that Allah would show them the ways of worship and turn toward them out of mercy. This part of their prayer has indeed been accepted to this very day.",
        },
        {
          en: "That House is the sacred Kaaba that still stands in Makkah. Whenever a child sees the picture of the Kaaba, they can remember: this blessed building was raised by the hands of a great prophet and his obedient son, and Allah blessed their work forever.",
        },
      ],
      ayahNote: {
        en: "The prayer that built the Kaaba is the sweetest ayah of this chapter: Our Lord, accept this from us, for You are the All-Hearing, the All-Knowing. It teaches a child that a deed done for Allah — done in love — is the kind of work Allah builds into forever.",
        ur: "جس دعا نے کعبہ بنایا وہ اس باب کی سب سے میٹھی آیت ہے: اے ہمارے رب، ہم سے یہ قبول فرما، بیشک تو ہی سننے والا اور جاننے والا ہے۔ یہ بچوں کو سکھاتی ہے کہ جو کام اللہ کے لیے اور محبت سے کیا جائے، یہی وہ کام ہے جسے اللہ ہمیشہ کے لیے قائم کر دیتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 2:127",
          label: { en: "Ibrahim and Ismail raise the foundations of the House and pray that Allah accepts their work", ur: "ابراہیم اور اسماعیل کعبہ کی بنیادیں اٹھاتے ہیں اور دعا کرتے ہیں کہ اللہ ان کا کام قبول فرمائے" },
          explanation: {
            en: "This is the two faithful builders at their best moment: stone upon stone, and with every stone a prayer — accept this from us. It shows a child what to ask Allah for every kind deed: not praise, but acceptance.",
            ur: "یہ دو وفادار معماروں کا سب سے خوبصورت لمحہ ہے: ایک پتھر پر ایک پتھر، اور ہر پتھر کے ساتھ دعا: اے اللہ، یہ ہم سے قبول فرما۔ یہ بچوں کو سکھاتی ہے کہ ہر نیک کام کے لیے اللہ سے کیا مانگنا ہے — تعریف نہیں، قبولیت۔",
          },
        },
      ],
    },
    {
      id: "friend-of-allah",
      title: { en: "The Friend of Allah" },
      paragraphs: [
        {
          en: "Through fire and thirst, through travel and trial, and through the hardest test of offering his own dear son, Ibrahim never left the path. And for that pure devotion, Allah honored him with a title of the sublime greatness: the close friend of Allah.",
        },
        {
          en: "The beloved Prophet Muhammad peace be upon him told us that Prophet Ibrahim, may peace be upon him, is Al-Khalil of the Most Merciful — that means the close, intimate friend. It is a risen rank given to this great prophet, and his memory is honored by the whole family of believers.",
        },
        {
          en: "Allah did not take Ibrahim as a friend because he was rich or powerful. He chose him because of the pure heart of tawhid inside him — the heart that trusts once, and trusts again, in fire, in the empty desert, and in the moment of the sacrifice. Nothing could shake him back.",
        },
        {
          en: "So every child who loves Ibrahim can carry a small part of this gift: when days become hard or unfair, we can also simply say, \"Allah is sufficient for me, and He is the best of trustees.\" A heart that belongs to Allah is never really alone.",
        },
        {
          en: "Such is the whole lesson of the prophet of faith: trust Allah with a certain heart, in the little moments on the biggest tests. And whenever the fire of a difficulty or the trial of a decision looks too big, we remember the friend of the Merciful and call the same Lord he called.",
        },
      ],
      ayahNote: {
        en: "Fire, thirst, travel and the hardest sacrifice — Ibrahim passed every test, so Allah gave him the highest title of all: His close friend, the Khalil. The lesson of this chapter for a child: trust in Allah, kept again and again, turns a servant into a friend of the Most Merciful.",
        ur: "آگ، پیاس، سفر اور سب سے مشکل قربانی — ابراہیم ہر آزمائش میں کامیاب ہوئے، اس لیے اللہ نے اُنہیں سب سے بڑا لقب دیا: اپنا قریبی دوست یعنی خلیل۔ اس باب کا بچوں کے لیے سبق یہ ہے: اللہ پر بھروسہ جو بار بار رکھا جائے، بندے کو رحمٰن کا دوست بنا دیتا ہے۔",
      },
      sources: [
        {
          type: "hadith",
          reference: "Sahih al-Bukhari; Sahih Muslim",
          label: { en: "The Prophet (PBUH) says that Allah took Ibrahim as His close and intimate friend, the Khalil", ur: "نبی کریم ﷺ نے فرمایا کہ اللہ نے ابراہیم کو اپنا قریبی اور پیارا دوست یعنی خلیل بنایا" },
        },
      ],
    },
  ],
};