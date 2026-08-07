import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Ali ibn Abi Talib (RA) — the Prophet's cousin and son-in-law, who grew up
 * in the Prophet's home and was the first of the children to accept Islam
 * (Phase 8 Batch 2).
 *
 * Citation discipline for Sahabah content: Hadith/Seerah sourced ONLY. No
 * Quran-narrated "personal" events are used as sources here — everything is
 * anchored to authentic hadith or an established Seerah work. Where a
 * specific authentic narration could not be confidently verified while
 * writing, the reference is marked `needsVerification: true` rather than
 * guessing a number.
 *
 * `ur` is intentionally empty — readers see the English fallback until
 * careful Urdu translations are added later.
 *
 * Review sign-off: single-reviewer (site owner). Sources get `reviewed: true`
 * + `reviewedBy`/`reviewedDate` in batches; confirm-read sign-off, not
 * scholarly/ijazah certification.
 */
export const SAHABI_ALI: KidsStoryV2 = {
  id: 'ali',
  type: 'sahabi',
  nameArabic: 'علي بن أبي طالب',
  nameEnglish: 'Ali ibn Abi Talib',
  illustrationSymbol: 'Swords',
  accentColor: '#8e5fc9',
  summary: {
    en: 'The cousin of the Prophet ﷺ who grew up in his own home. While he was still a child, his heart chose Islam, and he never changed his mind. He grew into a brave knight on the battlefield, a patient judge, and the most loyal of friends.',
  },
  chapters: [
    {
      id: 'boy-in-the-prophets-house',
      title: { en: 'A Boy in the Prophet’s House' },
      paragraphs: [
        {
          en: 'Long ago, Makkah had a year when the rain did not come and the ground grew hard and dry. Life was very hard for everyone, including a good uncle of the Prophet ﷺ named Abu Talib, who had many young ones to feed.',
        },
        {
          en: 'The Prophet ﷺ always helped people, so he took his little cousin Ali into his own home. Ali grew up eating, sleeping, and learning beside the most honest man in all of Makkah.',
        },
        {
          en: 'From a very small age, Ali watched everything the Prophet ﷺ did. He saw how gently he spoke to the little ones, how kindly he treated his neighbors, and how he never, ever told a lie.',
        },
        {
          en: 'Because of this, the Prophet ﷺ shaped the man Ali would become. Years later, everyone who knew him said the same thing: growing up in the Prophet’s house had filled his heart with light.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah tells how the Prophet ﷺ took young Ali into his home', ur: 'سیرت بتاتی ہے کہ نبی کریم ﷺ نے چھوٹے علی کو اپنے گھر رکھا' } },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari (the Prophet ﷺ raised Ali in his home)',
          needsVerification: true,
          label: { en: 'Ali grew up in the Prophet’s house, learning from the most honest man', ur: 'علی نبی کریم ﷺ کے گھر پلے بڑھے اور سب سے سچے انسان سے سیکھتے رہے' },
        },
      ],
    },
    {
      id: 'the-first-of-the-children',
      title: { en: 'The First of the Children' },
      paragraphs: [
        {
          en: 'When the Prophet ﷺ began to call people to worship Allah alone, some of his dearest listeners were his own family. Among them was a boy — Ali — who was still young, standing at the edge between childhood and the story of Islam.',
        },
        {
          en: 'One day the Prophet ﷺ asked his family to be the first to accept the message. Ali did not wait, and he did not ask for more signs. He already loved the Prophet ﷺ so much that his heart said “I believe” right away.',
        },
        {
          en: 'The Seerah tells us that among the boys and girls of Makkah, Ali was the first child to accept Islam. He was only around ten years old, but his courage stood taller than many grown-ups.',
        },
        {
          en: 'Being first is not about being the biggest or the strongest. Ali showed that even a child can lead the way with a brave heart, and that loving Allah from a young heart is a very real thing.',
        },
        {
          en: 'In those very first days, the household of the Prophet ﷺ was just three people: the Prophet ﷺ, his wife Khadijah, and young Ali. Together they carried the first small light of Islam before anyone else joined.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah records that Ali was the first child of Makkah to accept Islam', ur: 'سیرت لکھتی ہے کہ علی مکہ کے پہلے بچے تھے جنہوں نے اسلام قبول کیا' } },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari (Ali accepted Islam while a child)',
          needsVerification: true,
          label: { en: 'Ali still a young boy, eagerly believes in the Prophet’s message', ur: 'علی جو ابھی چھوٹے لڑکے تھے، دل سے نبی ﷺ کے پیغام پر ایمان لے آئے' },
        },
      ],
    },
    {
      id: 'the-brave-fighter',
      title: { en: 'The Brave Fighter' },
      paragraphs: [
        {
          en: 'When the believers moved to Madinah, enemies from Makkah still came to fight them. In the great battlefield of Badr, Ali was still a young man, yet he stood in the lines of the fighters with a heart as steady as the strongest shield.',
        },
        {
          en: 'At Badr, a small and faithful army of Muslims faced many enemies, and Allah gave them a wonderful victory. Ali fought with all his strength, protecting his Prophet ﷺ and the believers beside him.',
        },
        {
          en: 'Years later, when it came to the strong forts of Khaybar, the Prophet ﷺ said: “I will give the flag tomorrow to a man who loves Allah and His Messenger, and whom Allah and His Messenger love.” Everyone could hardly wait for the morning.',
        },
        {
          en: 'The next day, the Prophet ﷺ called for no one but Ali and placed the flag in his hand. With the flag in hand, Ali said he would first call the enemy to Islam — and only if they refused would there be a fight for the truth.',
        },
        {
          en: 'That day Ali carried the flag as boldly as a lion, and the people began to call him the lion of Allah. All his strength, he always said, belonged not to himself but to Allah.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (the flag of Khaybar given to Ali)',
          label: { en: 'The Prophet ﷺ gives the flag at Khaybar to Ali, the man who loves Allah', ur: 'نبی ﷺ خیبر کے دن جھنڈا علی کو دیتے ہیں، جو اللہ سے محبت کرنے والے ہیں' },
        },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham; the battle of Badr)', label: { en: 'Ali stands bravely among the Muslims who win the battle of Badr', ur: 'علی ان مسلمانوں میں بہادری سے لڑتے ہیں جو جنگ بدر میں فتح پاتے ہیں' } },
      ],
    },
    {
      id: 'the-prophets-praise',
      title: { en: 'Deep Praise From the Prophet ﷺ' },
      paragraphs: [
        {
          en: 'The Prophet ﷺ loved Ali very much and praised him on many special days. During a very long journey, Ali had to stay behind in Madinah for a while, and some troublemakers whispered: “Look, he was left behind!”',
        },
        {
          en: 'Ali hurried after the Prophet ﷺ to explain. The Prophet ﷺ then said to him those famous words: “Are you not satisfied to be to me like Harun to Musa?” — like Aaron, the brother and helper of the prophet Moses, peace be upon them.',
        },
        {
          en: 'And the Prophet ﷺ added the deepest of them all: “But there is no prophet after me.” For a while, Ali’s place beside the Messenger of Allah was the closest a companion could ever reach.',
        },
        {
          en: 'Makkah called the Prophet ﷺ “the trustworthy one” even before Islam, and he trusted Ali the same way. When they were together, the town knew that whatever the Prophet ﷺ said, and whatever Ali agreed to, could always be believed.',
        },
        {
          en: 'Such praise from the one he loved carried Ali for his whole life. It reminds us that when someone we love speaks into our hearts with kindness and trust, it can lift us higher than we ever knew we could go.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (the Prophet ﷺ comparing Ali to Aaron as Moses)',
          label: { en: 'The Prophet ﷺ tells Ali he is like Aaron to Moses, but no prophet after him', ur: 'نبی ﷺ علی کہتے ہیں کہ وہ موسیٰ کے لیے ہارون کی مانند ہیں، مگر ان کے بعد کوئی نبی نہیں' },
        },
      ],
    },
    {
      id: 'wise-and-fair',
      title: { en: 'Wise and Fair for Allah' },
      paragraphs: [
        {
          en: 'Many people remember Ali only as a swordsman. But the Prophet ﷺ also trusted him as a judge and a teacher, and he sent him to a distant land to lead the people. Ali had hands that could fight, and a heart that loved fairness.',
        },
        {
          en: 'When the Prophet ﷺ sent Ali to judge between people, he gave him this advice: listen to both sides before deciding, so that no innocent person is ever harmed. Ali carried those words like a lamp in his heart.',
        },
        {
          en: 'Everyone could see how fairly Ali decided. He never favored the rich over the poor, and he never took the side of his own family over a stranger. His wisdom flowed from his love of Allah, which made people trust him.',
        },
        {
          en: 'Ali also taught his students that a sharp mind is a person’s best weapon. Strength can win a single fight, but knowledge and fairness keep peace between people for a whole lifetime.',
        },
        {
          en: 'So Ali’s real title is not only “the Brave.” He is also “the Wise.” Fighting was just a small part of his story — the true story is a boy who grew into a man whose fairness and gentle mind made a whole generation trust him.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Hisham); Sunan works on Ali as judge in Yemen',
          needsVerification: true,
          label: { en: 'The Prophet ﷺ sends Ali to Yemen to judge fairly between people', ur: 'نبی ﷺ علی کو یمن بھیجتے ہیں تاکہ لوگوں کے درمیان انصاف سے فیصلہ کریں' },
        },
        {
          type: 'hadith',
          reference: 'Sayings of Ali recorded in Sunan collections',
          needsVerification: true,
          label: { en: 'Ali taught that a sharp mind and fairness are the best strength', ur: 'علی نے سکھایا کہ تیز دماغ اور انصاف بہترین طاقت ہے' },
        },
      ],
    },
  ],
};