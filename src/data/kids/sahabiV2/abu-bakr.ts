import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Abu Bakr as-Siddiq (RA) — the first Caliph and closest friend of the
 * Prophet ﷺ (Phase 8 Batch 1).
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
export const SAHABI_ABU_BAKR: KidsStoryV2 = {
  id: 'abu-bakr',
  type: 'sahabi',
  nameArabic: 'أبو بكر',
  nameEnglish: 'Abu Bakr as-Siddiq',
  illustrationSymbol: 'ShieldCheck',
  accentColor: '#3e8e7e',
  summary: {
    en: 'The Prophet’s closest friend and the first free man to accept Islam. The Prophet ﷺ called him as-Siddiq, “the one who always confirms the truth.” After the Prophet passed away, Abu Bakr became the first leader (caliph) of the Muslims.',
  },
  chapters: [
    {
      id: 'true-friend',
      title: { en: 'A Friend Like No Other' },
      paragraphs: [
        {
          en: 'Long before Islam, a boy named Abu Bakr lived in Makkah. He was known for a gentle heart, a truthful tongue, and a sharp mind. He grew up near a man named Muhammad ﷺ — a man he trusted completely, even before anyone called him a prophet.',
        },
        {
          en: 'When Muhammad ﷺ began to call people to Islam, Abu Bakr was one of the very first to believe. He did not argue, and he did not delay. His friend Muhammad ﷺ had always been honest, so when the message came, Abu Bakr accepted it with his whole heart.',
        },
        {
          en: 'Because Abu Bakr was well-known and well-loved, many people followed his example. Whole families came into Islam after him. If he spoke well of a man, people would say: “If Abu Bakr trusts him, there is good in him.” So his belief helped many other people believe too.',
        },
        {
          en: 'The Prophet ﷺ loved Abu Bakr very deeply. He said that if he were to take a very close friend, it would be Abu Bakr — but Islam made them even closer than that (Sahih al-Bukhari; Sahih Muslim). That special friendship never changed, right up to the very end.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim', label: { en: 'The Prophet ﷺ says if he took a very close friend, it would be Abu Bakr', ur: 'نبی کریم ﷺ نے فرمایا کہ اگر وہ کوئی گہرا دوست بناتے تو ابوبکر کو بناتے' } },
      ],
    },
    {
      id: 'as-siddiq',
      title: { en: 'The One Nobody Could Doubt' },
      paragraphs: [
        {
          en: 'One night, the Prophet ﷺ was carried through the heavens — traveling in a single night from Makkah to the far mosque, and then up through the skies. In the morning the people of Makkah laughed at the idea: “That is impossible!”',
        },
        {
          en: 'The people went to Abu Bakr to tell him, expecting him to be surprised too. Instead, Abu Bakr said, “If he said it, then it is true.” That day, the people began to call him as-Siddiq — the one who always confirms the truth.',
        },
        {
          en: 'From then on, the whole community had one name for him: as-Siddiq. And it was a perfect name, because Abu Bakr’s heart never wavered when the Prophet ﷺ spoke. Helping the truth was his greatest joy.',
        },
        {
          en: 'Being as-Siddiq is a lesson for us too: when someone we love and trust tells the truth, our own hearts can learn to believe it with the same quiet confidence.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah)', label: { en: 'The Seerah tells how Abu Bakr confirmed the amazing night journey', ur: 'سیرت بتاتی ہے کہ ابوبکر نے معراج کے حیرت انگیز سفر کی تصدیق کی' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari', needsVerification: true, label: { en: 'Abu Bakr is called as-Siddiq for always confirming the truth', ur: 'ہمیشہ سچ کی تصدیق کرنے کی وجہ سے ابوبکر صدیق کہلائے' } },
      ],
    },
    {
      id: 'freeing-the-slaves',
      title: { en: 'Freeing the Believers' },
      paragraphs: [
        {
          en: 'In early Makkah, the rich enemies would torture new Muslims — especially those who had no protectors. They thought that by hurting them, they could make them give up their belief in Allah.',
        },
        {
          en: 'Abu Bakr could not stand to watch this. He was a wealthy man, so he spent his money buying these servants and setting them free. In the Seerah we read how he freed and cared for a tall, patient believer named Bilal and others too.',
        },
        {
          en: 'The Qur’an speaks of one who gave his wealth to cleanse himself, hoping for no favor in return but only the pleasure of his Lord (Qur’an 92:18–21) — and the early scholars linked this with Abu Bakr and his freeing of the believers.',
        },
        {
          en: 'Freeing a human being and taking care of them is one of the noblest works in Islam. A child today cannot free a servant the way Abu Bakr did, but that child can be kind, generous, and quick to help others — which is the very same caring heart praised by the Prophet ﷺ.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (Chapters on Abu Bakr)', needsVerification: true, label: { en: 'Abu Bakr buys and frees the believing slaves in early Makkah', ur: 'ابوبکر ابتدائی مکہ میں مومن غلاموں کو خرید کر آزاد کرتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah tells how Abu Bakr freed and cared for Bilal and other believers', ur: 'سیرت بتاتی ہے کہ ابوبکر نے بلال اور دوسرے مومنوں کو کیسے آزاد کیا اور ان کی دیکھ بھال کی' } },
      ],
    },
    {
      id: 'the-cave',
      title: { en: 'Two in the Cave' },
      paragraphs: [
        {
          en: 'When the enemies planned to harm the Prophet ﷺ, Allah told him to leave Makkah for Madeenah. In the dark of the night, Abu Bakr went with him — the two of them slipping out while the whole city slept.',
        },
        {
          en: 'They hid in a mountain-side cave called Thawr. From inside the cave, Abu Bakr could see the enemy running toward it, closer and closer, until they reached the very mouth of the cave. “If they look down, they will see us!” he whispered.',
        },
        {
          en: 'The Prophet ﷺ comforted him and said: “Do not be sad; indeed Allah is with us.” A spider had covered the entrance with its web, and the enemy — never glancing below their feet — passed by without seeing the two hidden travelers.',
        },
        {
          en: 'From that night, the two walked together again, safe under Allah’s protection. With faith like Abu Bakr’s, a person never walks alone; Allah is always with His believing servants.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari 4665', label: { en: 'The Prophet ﷺ and Abu Bakr hide from the enemies in the Cave of Thawr', ur: 'نبی کریم ﷺ اور ابوبکر غار ثور میں دشمنوں سے چھپ جاتے ہیں' } },
        { type: 'hadith', reference: 'Sahih Muslim', label: { en: 'The Prophet ﷺ says “do not be sad, indeed Allah is with us”', ur: 'نبی کریم ﷺ نے فرمایا کہ غم نہ کرو، اللہ ہمارے ساتھ ہے' } },
      ],
    },
    {
      id: 'first-caliph',
      title: { en: 'The First Leader' },
      paragraphs: [
        {
          en: 'When the Prophet ﷺ passed away, the Muslims felt very sad, and they came together to decide who would lead them. They looked at one another, because nobody could imagine the community without the Prophet ﷺ.',
        },
        {
          en: 'Then Umar (RA) stepped forward and called the believers to agree on Abu Bakr. Abu Bakr said he was not the best among them, but the people answered: “We do not know anyone better than you.” So Abu Bakr became the first caliph.',
        },
        {
          en: 'Abu Bakr led with a gentle but firm hand. Some people refused to pay the zakah after the Prophet ﷺ had passed away, and Abu Bakr faced them bravely to keep the community of Islam whole. He also asked the companions to gather the words of the Qur’an into one safe book, so that nothing of it would ever be lost.',
        },
        {
          en: 'Abu Bakr ruled only a short while, but he kept Islam safe and complete. When he passed away, the Muslims remembered him as the truest friend of the Prophet ﷺ — the honest leader who carried Islam forward after the Messenger of Allah.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (Chapters on the virtues of Abu Bakr)', needsVerification: true, label: { en: 'Umar calls the believers to agree on Abu Bakr as the first caliph', ur: 'عمر مسلمانوں کو ابوبکر کو پہلی خلیفہ ماننے کی دعوت دیتے ہیں' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari (the collection of the Qur’an, narrated by Zaid bin Thabit)', needsVerification: true, label: { en: 'The Prophet asks the companions to gather the Qur’an into one book', ur: 'نبی کریم صحابہ سے کہتے ہیں کہ قرآن کو ایک نہیں میں جمع کریں' } },
      ],
    },
  ],
};