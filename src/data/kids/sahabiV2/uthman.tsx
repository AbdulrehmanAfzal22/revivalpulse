import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Uthman ibn Affan (RA) — "Dhun-Nurayn," the Possessor of the Two Lights; the
 * Third Caliph who gathered the Qur’an into one standard Book (Phase 8 Batch 1).
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
export const SAHABI_UTHMAN: KidsStoryV2 = {
  id: 'uthman',
  type: 'sahabi',
  nameArabic: 'عثمان بن عفان',
  nameEnglish: 'Uthman ibn Affan',
  illustrationSymbol: 'BookOpen',
  accentColor: '#b08d3f',
  summary: {
    en: 'Uthman ibn Affan was a gentle, shy, and wonderfully generous companion of the Prophet ﷺ. He bought the sweet Well of Rumah so the whole city of Madinah could drink freely, and he spent his wealth to support the believers in their hardest days. As the third caliph, he gathered the words of the Qur’an into one standard Book that Muslims all over the world still read together today.',
  },
  chapters: [
    {
      id: 'well-of-rumah',
      title: { en: 'The Well That Belonged to Everyone' },
      paragraphs: [
        {
          en: 'In Madinah, fresh water could be more precious than gold. There was one sweet well called the Well of Rumah, but it belonged to a man who sold its water cup by cup, and the poor people could not drink unless they paid. One day the Prophet ﷺ stood before the companions and said: "Who will buy this well and give it freely to the Muslims?"',
        },
        {
          en: 'Uthman ibn Affan, a wealthy and generous man, agreed at once. He went to the owner and bought the well with his own money — paying every piece the man asked until the well was his. Then he opened it to all the people of Madinah, so that the rich and the poor, the guest and the stranger, could all drink from it freely.',
        },
        {
          en: 'From that day the sweet water of Rumah flowed for every traveller who was thirsty, and the gift of Uthman kept giving long after the seller had counted his coins. The Prophet ﷺ promised that such a gift would be a beloved treasure for Uthman. A gift that helps many people keeps growing in value in front of Allah.',
        },
        {
          en: 'Free water for everyone had become a shared treasure of the whole city. Uthman did not wait to be asked twice — his wealth flowed from his hand into the service of others. That is true generosity: not giving what the heart does not need, but giving quickly and quietly what someone else truly needs.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (Uthman buying the Well of Rumah)', needsVerification: true, label: { en: 'Uthman buys the Well of Rumah and gives it for all the Muslims of Madinah', ur: 'عثمان کنواں رومہ خرید کر اسے مدینہ کے تمام مسلمانوں کے لیے وقف کر دیتے ہیں' } },
      ],
    },
    {
      id: 'the-two-lights',
      title: { en: 'The Shyness of Uthman' },
      paragraphs: [
        {
          en: 'Uthman ibn Affan was a noble, gentle man, and the Prophet ﷺ loved him very much. He was honored to be married to one daughter of the Prophet ﷺ, and when she passed away, the Prophet ﷺ married him to another — so the people praised him as Dhun-Nurayn, "the Possessor of the Two Lights."',
        },
        {
          en: 'Uthman was famous for a beautiful quality: hayaa, the quiet, noble shyness. He spoke softly, lowered his gaze, and never moved forward with a rude or showy word. His modesty about living is a sign of a heart that loves Allah and respects the feelings of others.',
        },
        {
          en: 'The Prophet ﷺ honored him for this, and the companions remember how the Messenger of Allah ﷺ would say that the light of Uthman was a sign of his goodness and his closeness to the truth. Shyness did not make Uthman weak — it made him gentle, careful, and loved by everyone around him.',
        },
        {
          en: 'Being shy in a good way means guarding the tongue and feeling the feelings of others. A child does not lose courage by being gentle; the two go together, as Uthman showed. Kind eyes, soft words, and a heart that does not wound — that was the good shyness of Uthman ibn Affan.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (Uthman married to Ruqayyah and Umm Kulthum, the name Dhun-Nurayn)', needsVerification: true, label: { en: 'Uthman marries two daughters of the Prophet ﷺ and is called Dhun-Nurayn', ur: 'عثمان نبی کریم ﷺ کی دو بیٹیوں سے شادی کرتے ہیں اور ذو النورین کہلاتے ہیں' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari (the hayaa of Uthman)', needsVerification: true, label: { en: 'The Prophet ﷺ praised the good shyness called hayaa in Uthman', ur: 'نبی کریم ﷺ نے عثمان میں حیاء یعنی اچھی شرم کی تعریف کی' } },
      ],
    },
    {
      id: 'one-quran',
      title: { en: 'One Book for the Whole World' },
      paragraphs: [
        {
          en: 'The Qur’an is the Book of Allah, and it was revealed to the Prophet ﷺ and then quickly recorded by the scribes of the Prophet and memorized in the hearts of thousands. After the Prophet ﷺ passed away, the Islamic world grew, with Muslims in new lands, and sometimes they recited the same words in their own different ways of reading.',
        },
        {
          en: 'A wise companion named Hudhayfah came to the Caliph Uthman one day with a worried report. The people of the different places had begun to argue over the best way of reading. He urged him: "O leader of the believers, stop the people before they quarrel over the Book of Allah like those before them."',
        },
        {
          en: 'So Uthman gathered the scholars of the Qur’an, among them the great Zaid ibn Thabit, and commanded them to collect the words into one. They gathered all the pages together, checked them against the memory of the memorizers, and wrote out one complete, careful Book in the finest Arabic — the speech of the Prophet ﷺ.',
        },
        {
          en: 'Copies of this one Mushaf were sent to every far city of the Muslims, so that all would read from the same book and no one would lose a single letter of the Revelation. And that Book is the same one that a Muslim opens anywhere on the earth today, whether in Makkah, Madeenah, Cairo, or another home.',
        },
        {
          en: 'Because Uthman cared for the Qur’an and brought it together, the Word of Allah has never been lost. This story teaches: value the Book of Allah, learn it, and hold on to its words. And Uthman is rightly praised as the one who gathered the Qur’an into one.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (gathering of the Qur’an under Uthman, narrated by Zaid bin Thabit)', needsVerification: true, label: { en: 'Uthman gathers the Qur’an into one complete Book with Zaid bin Thabit', ur: 'عثمان زید بن ثابت کے ساتھ قرآن کو ایک مکمل کتاب میں جمع کرتے ہیں' } },
      ],
    },
    {
      id: 'army-of-hardship',
      title: { en: 'The Army of the Hard Days' },
      paragraphs: [
        {
          en: 'Once the Prophet ﷺ called the believers to a long and difficult expedition in the scorching heat, to the north, toward the land of Tabuk. The road was far, the weather was burning, and the believers had little to spend. It was hard, and only the ones whose hearts were strong stood up ready to go.',
        },
        {
          en: 'The Prophet ﷺ spoke of the great reward for the one who would give generously to equip this struggling army. Uthman came forward and gave with a wide open heart — camels, money, and supplies, until the whole of the expedition was ready thanks to him. He wanted no praise for these, and no return in themselves.',
        },
        {
          en: 'The companions all saw Uthman’s gift, and the Prophet ﷺ prayed a joyful prayer for him. The Messenger of Allah ﷺ spoke warmly of the one who gives for the advantage of the Muslims, and the companions remembered that Uthman’s charity would be a treasure for him in the sight of Allah. Whatever good he did after that day, it is a tree that keeps bearing its fruit.',
        },
        {
          en: 'Later, Uthman brought that same spirit to the caliphate. He taught order to the armies of the growing Ummah, divided the new lands with fairness and provided for the soldiers. Strong and organized armies, generous and honest — that was the way of the Prophet ﷺ for the Islamic rule that went out beyond.',
        },
        {
          en: 'Generosity is measured not in coins but in the readiness of the heart. Uthman equipped the army so completely that the entire team could move forward, and the hearts of the believers were filled with trust. A child can give a coin, share a snack, or welcome a new friend — that is the same generous spirit at work on their little scale.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim (the hadith of equipping the army of al-Usra)', needsVerification: true, label: { en: 'Uthman equips the struggling army of al-Usra so it can march', ur: 'عثمان مشکل حالات کے لشکر کو سامان دیتے ہیں تاکہ وہ آگے چل سکے' } },
        { type: 'hadith', reference: 'Seerah of the Prophet ﷺ (the Expedition of Tabuk)', needsVerification: true, label: { en: 'The Seerah tells of the long, scorching expedition of Tabuk', ur: 'سیرت تبوک کے طویل اور تپتا ہوا سفر کا ذکر کرتی ہے' } },
      ],
    },
    {
      id: 'third-caliph',
      title: { en: 'The Third Leader of the Muslims' },
      paragraphs: [
        {
          en: 'When the second caliph, Umar, passed away, the great companions gathered together to choose the next leader of the believers. After open and honest counsel they agreed with one heart on Uthman. So Uthman became the third Caliph, gently and humbly, the open book of his hands extended to all.',
        },
        {
          en: 'Uthman carried the justice and the order laid down by Abu Bakr and Umar, and he added his own gentle and generous spirit. He enlarged the Prophet’s mosque in Madinah and planned the streets and houses of the city, while at home he lived simply and kept nothing but a quiet heart.',
        },
        {
          en: 'During his time the light of the Islamic state reached new horizons and lands. The call of the faith crossed rivers and mountains, and the pattern of his gentle, careful leadership strengthened the kingdom that wanted peace and faith on both of them.',
        },
        {
          en: 'Above all, Uthman is the champion of the Qur’an: he made the Book one, and by that he held the whole Ummah together. A child today can open his own Mushaf and find the care of Uthman in it — together with a sweet well for the thirsty and an open hand for the believers. That is Uthman: the shy, the generous, the hero of the two lights and of the one Book.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah and histories of the Rightly-Guided Caliphs (the shura that agreed on Uthman)', needsVerification: true, label: { en: 'The companions counsel together and agree to choose Uthman as caliph', ur: 'صحابہ آپس میں مشورہ کرتے ہیں اور عثمان کو خلیفہ چننے پر متفق ہوتے ہیں' } },
        { type: 'hadith', reference: 'Histories of the Rightly-Guided Caliphate (Uthman’s expansion of the Prophet’s Mosque and the state)', needsVerification: true, label: { en: 'Uthman enlarged the Prophet’s Mosque and spread the Islamic state', ur: 'عثمان نے نبی کریم ﷺ کی مسجد کو بڑھایا اور اسلامی ریاست کو پھیلایا' } },
      ],
    },
  ],
};