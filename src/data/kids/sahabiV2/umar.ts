import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Umar ibn al-Khattab (RA) — the Second Caliph, called al-Faruq, "the one who
 * separates truth from falsehood" (Phase 8 Batch 1).
 *
 * Citation discipline for Sahabah content: Hadith/Seerah sourced ONLY. Where
 * a specific authentic narration could not be verified with certainty while
 * writing, the reference is marked `needsVerification: true` rather than
 * guessing a hadith number.
 *
 * `ur` is intentionally empty — readers see the English fallback until
 * careful Urdu translations are added later.
 *
 * Review sign-off: single-reviewer (site owner). Sources get `reviewed: true`
 * + `reviewedBy`/`reviewedDate` in batches; confirm-read sign-off, not
 * scholarly/ijazah certification.
 */
export const SAHABI_UMAR: KidsStoryV2 = {
  id: 'umar',
  type: 'sahabi',
  nameArabic: 'عمر بن الخطاب',
  nameEnglish: 'Umar ibn al-Khattab',
  illustrationSymbol: 'Scale',
  accentColor: '#4472ca',
  summary: {
    en: 'Umar ibn al-Khattab was one of the strongest and bravest men of Makkah — at first a fierce enemy of Islam, and later one of its greatest protectors. Allah changed his heart, and he became a close companion of the Prophet ﷺ and a protector of the believers. When he became the second caliph, Muslims never forgot his courage, his simple life, and his love of fairness.',
  },
  chapters: [
    {
      id: 'conversion',
      title: { en: 'The Sword That Became a Shield' },
      paragraphs: [
        {
          en: 'Before he accepted Islam, Umar ibn al-Khattab was one of the strongest and most respected men in Makkah. He was tall, quick-tempered, and utterly fearless, and the people of the city were careful never to cross him. When the Prophet ﷺ began to call people to Allah, Umar was one of the fiercest opponents, and he meant to use all his strength to stop the new faith.',
        },
        {
          en: 'One day Umar became so angry that he took up his sword and walked out across Makkah, determined to confront the Prophet ﷺ himself. On the way a friend stopped him and said: "Before you go anywhere, Umar, look at your own family first." So Umar turned instead toward the house of his sister and her husband — and he learned that they had quietly accepted Islam.',
        },
        {
          en: 'At his sister’s house, Umar heard the words of the Qur’an being read in a gentle voice. He asked to see them, and as he read he came upon a beautiful verse: "Indeed, it is I — I am Allah — there is no god except Me" (Qur’an 20:14). The words entered his heart like cool water on thirsty earth, and he wanted to hear more.',
        },
        {
          en: 'Then and there, Umar went to the Prophet ﷺ and said, plainly and sincerely, that he believed. He accepted Islam with his whole strong heart, and the Muslims of Makkah felt a new safety from that very day. A proud voice that had been raised against the truth now spoke for it.',
        },
        {
          en: 'The sword that Umar had carried against the believers became a shield for them. He used the same courage and boldness to stand beside the companions and to protect the young Muslims who were weak. His story teaches every child that an honest heart can change, and that the strongest hearts belong to the truth of Allah.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (the coming of Umar to Islam)', label: { en: 'Umar hears the Qur’an, and accepts Islam on that day', ur: 'عمر قرآن سنتے ہیں اور اسی دن اسلام قبول کر لیتے ہیں' } },
        { type: 'hadith', reference: 'Seerah of the Prophet ﷺ (Ibn Hisham) — the detailed story of Umar’s conversion', needsVerification: true, label: { en: 'The Seerah tells the full story of how Umar came to Islam', ur: 'سیرت بتاتی ہے کہ عمر اسلام میں کیسے آئے اس کی مکمل کہانی' } },
      ],
    },
    {
      id: 'days-of-hardship',
      title: { en: 'The Days of Hardship' },
      paragraphs: [
        {
          en: 'When the Muslims came from Makkah to Madinah, they left behind their homes and much of their wealth. The people of Madinah opened their doors and shared whatever they had, and the two groups became one large family. Even so, no one pretended the first months were easy.',
        },
        {
          en: 'There were days when food was scarce and money was lighter than a leaf. Umar never forgot how the Prophet ﷺ would sometimes tie a stone over his own stomach to press down the hunger, living on the simplest meals the earth could give. The believers knew those hard days well — every cup of water was counted and shared.',
        },
        {
          en: 'Yet nobody grumbled or lost heart. The Muhajirun, who had left Makkah, and the Ansar, who welcomed them in Madinah, worked, ate, and prayed as brothers. When one had nothing, the other gave more than what was needed, and the tie of faith grew stronger than jewels.',
        },
        {
          en: 'The hard days taught them patience, and the patience brought fruit. They became grateful for every bite of bread and every cup of water, and their hearts stayed soft even after wealth came. That is the lesson for every child: a thankful heart turns the smallest gift into a great treasure.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (the Prophet ﷺ tying a stone over his stomach in hunger)', needsVerification: true, label: { en: 'The Prophet ﷺ ties a stone over his stomach to press down his hunger', ur: 'نبی کریم ﷺ بھوک کو دبانے کے لیے اپنے پیٹ پر پتھر باندھتے تھے' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (the brotherhood between the Muhajirun and the Ansar)', label: { en: 'The Muhajirun and the Ansar become brothers and share everything', ur: 'مہاجرین اور انصار بھائی بن جاتے ہیں اور سب کچھ آپس میں بانٹتے ہیں' } },
      ],
    },
    {
      id: 'treaty-of-hudaybiyyah',
      title: { en: 'A Victory That Looked Like Peace' },
      paragraphs: [
        {
          en: 'In the sixth year of the hijrah, the Prophet ﷺ and more than a thousand companions set out for the little journey of umrah, hoping only to visit the Kaaba. They carried no swords and no war plan. But the people of Makkah would not let them enter the city, and the believers stopped at a place called Hudaybiyyah.',
        },
        {
          en: 'For many days the two sides talked, and at last a peace treaty was written down. The Muslims would return home that year and come back next year for their umrah, and for ten years no one would fight the other. To Umar, those old terms looked like giving up, and his chest was filled with sadness and doubt.',
        },
        {
          en: 'Heavy with worry, Umar went to the Prophet ﷺ and asked: "Are we not upon the truth, and are they not upon falsehood?" The Prophet ﷺ answered gently: "I am the Messenger of Allah, and I will not go against His command." Abu Bakr gave the same calm answer, and at last Umar accepted the treaty and found peace.',
        },
        {
          en: 'Then Allah made clear what no one saw, revealing: "Indeed, We have granted you a clear victory" (Qur’an 48:1). A victory with no battle at all. The next year, the Prophet ﷺ and the believers entered Makkah and made their umrah, exactly as the treaty promised.',
        },
        {
          en: 'With peace in time the door of Makkah opened to Islam itself, and many people entered the faith in great numbers. Umar learned — and every child can learn too — that what looks like a bitter wait can be a victory that Allah has hidden inside patience.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (the treaty of Hudaybiyyah)', label: { en: 'The Prophet ﷺ and the people of Makkah write the peace treaty of Hudaybiyyah', ur: 'نبی کریم ﷺ اور مکہ کے لوگ صلح حدیبیہ کا معاہدہ لکھتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham) — the story of Hudaybiyyah and Umar’s concern', needsVerification: true, label: { en: 'The Seerah tells how worried Umar was about the terms of the treaty', ur: 'سیرت بتاتی ہے کہ عمر معاہدے کی شرائط پر کتنے پریشان تھے' } },
      ],
    },
    {
      id: 'al-faruq',
      title: { en: 'Al-Faruq, the One Who Knew the Truth' },
      paragraphs: [
        {
          en: 'The believers gave Umar a proud name: al-Faruq, which means the one who sees truth apart from falsehood. Because his mind was sharp and his heart was honest, he went for the right thing and called the wrong thing wrong. That quality of his gave him praise all his life.',
        },
        {
          en: 'Umar was a commander of strict justice but also of soft kindness for the weak. He slept on the floor, ate simple food, and lived in Madinah like one of the working people, even while he protected the rights and property of all with a lion’s courage. If a leader was unfair, even a little, Umar called him back to the path of honesty.',
        },
        {
          en: 'People still remember how the Caliph Umar would wander the lanes of Madinah with a lamp at night, to be sure that no one was hungry and no one had been forgotten. The lonely and the widows and the weary travelers were never a stranger to his lamp. He guarded the city like a shepherd whose head stays alert all night.',
        },
        {
          en: 'Allah invites the believers to this justice: "Hold firmly to justice, being witnesses for Allah, and let the hatred of a nation not cause you to stray from the good" (Qur’an 5:8). A child can follow al-Faruq in a small way: return what you found, read a true word, and be fair to the one who is smaller than you.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah and stories of the companions about the name al-Faruq', needsVerification: true, label: { en: 'The believers call Umar al-Faruq, the one who sees truth apart from falsehood', ur: 'مسلمان عمر کو فاروق کہتے ہیں یعنی سچ اور جھوٹ میں فرق کرنے والے' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari, Kitab al-Manakib (Virtues of Umar)', needsVerification: true, label: { en: 'The Virtues of Umar chapter records his justice, kindness and simple life', ur: 'فضائل عمر کا باب ان کے انصاف، مہربانی اور سادہ زندگی کو درج کرتا ہے' } },
        { type: 'hadith', reference: 'Reports of Umar’s night walks in Madinah', needsVerification: true, label: { en: 'Umar walks the lanes of Madinah at night so no one is forgotten or hungry', ur: 'عمر رات کو مدینہ کی گلیوں میں چلتے ہیں تاکہ کوئی بھوکا یا بھولا ہوا نہ ہو' } },
      ],
    },
    {
      id: 'second-caliph',
      title: { en: 'The Second and Just Leader' },
      paragraphs: [
        {
          en: 'When the first caliph, Abu Bakr, became ill and his time was near, he chose the man he trusted the most to lead the Muslims after him. He chose Umar, and the whole community accepted his choice with love. So when Abu Bakr passed away, Umar became the second Caliph of the Muslims.',
        },
        {
          en: 'Umar ruled a wide land, yet even then he lived like the simplest of the people. His clothes were often patched, and he guarded the public treasury of the Muslims with more care than his own purse. Power did not change him; it only made his heart more careful.',
        },
        {
          en: 'Under his rule the light of Islam went into Syria and Persia and far beyond. He built cities for the Muslim people, laid out roads and marketplaces, and arranged the affairs of the state. He encouraged the believers to count the years from the hijrah, the blessed journey of the Prophet ﷺ, so that time itself would praise that beginning.',
        },
        {
          en: 'Above everything, Umar kept his scales of fairness upright until the very end — nobody, whether rich or weak, was above the law. In every land under his rule, the weak slept in peace, for they knew the Caliph guarded their rights. That is why he remains the symbol of fairness: he was never afraid to tell the truth, and he always sided with the one being wronged.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (the appointment of Umar after Abu Bakr)', needsVerification: true, label: { en: 'Abu Bakr chooses Umar to lead the Muslims after him', ur: 'ابوبکر عمر کو اپنے بعد مسلمانوں کی قیادت کے لیے چنتے ہیں' } },
        { type: 'hadith', reference: 'Seerah and historical accounts of the Caliphate of Umar (the hijri calendar and the expansion)', needsVerification: true, label: { en: 'Under Umar, Islam spreads far and the years are counted from the hijrah', ur: 'عمر کے دور میں اسلام دور تک پھیلتا ہے اور سالوں کا شمار ہجرت سے ہونے لگتا ہے' } },
      ],
    },
  ],
};