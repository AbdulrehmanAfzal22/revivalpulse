import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Khadijah bint Khuwaylid (RA) — the first wife of the Prophet ﷺ and the
 * first person to believe in his message (Phase 8 Batch 2).
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
export const SAHABI_KHADIJAH: KidsStoryV2 = {
  id: 'khadijah',
  type: 'sahabi',
  nameArabic: 'خديجة بنت خويلد',
  nameEnglish: 'Khadija bint Khuwaylid',
  illustrationSymbol: 'Gem',
  accentColor: '#d472a0',
  summary: {
    en: 'A wise and gentle merchant from Makkah who people called “the pure one.” She was the very first person to believe in the Prophet ﷺ, and her home was the soft, safe place where he found comfort when the world around him grew hard.',
  },
  chapters: [
    {
      id: 'fair-merchant-of-makkah',
      title: { en: 'A Fair and Honest Merchant' },
      paragraphs: [
        {
          en: 'Long before Islam, a girl named Khadijah grew up in Makkah. As she became an adult, she proved to be one of the wisest merchants in the whole city, sending her caravans to faraway lands loaded with fine goods.',
        },
        {
          en: 'She was so honest and pure in her dealings that people called her at-Tahira, “the pure one.” Even though she was very wealthy, she never cheated a single customer and she always treated her helpers with kindness.',
        },
        {
          en: 'When she needed a trustworthy man to lead one of her great trading journeys, everyone told her the same name: Muhammad ﷺ, the man the whole city called al-Ameen, “the trustworthy one.”',
        },
        {
          en: 'Muhammad ﷺ led the journey with perfect honesty, and it returned with good profit. But the true treasure was something else: Khadijah saw his beautiful character with her own eyes, and her respect and love for him grew very deep.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'Khadijah sends Muhammad ﷺ to lead her caravan and sees his honesty', ur: 'خدیجہ محمد ﷺ کو اپنا قافلہ لے جانے کے لیے بھیجتی ہیں اور ان کی دیانتداری دیکھتی ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah)', label: { en: 'Khadijah is known as the pure and fair merchant of Makkah', ur: 'خدیجہ مکہ کی پاک اور دیانتدار تاجر کے طور پر مشہور تھیں' } },
      ],
    },
    {
      id: 'the-first-to-believe',
      title: { en: 'The First to Believe' },
      paragraphs: [
        {
          en: 'One day the Prophet ﷺ returned home carrying news that would change the world: Allah had made him the Messenger for all of mankind. His dearest wife Khadijah sat beside him, and his heart needed someone to hold the secret.',
        },
        {
          en: 'Khadijah listened, and she did not hesitate for a single moment. She was the very first person in the entire world to accept Islam — before Abu Bakr, before Ali, before anyone. She said: “I bear witness that you are the Messenger of Allah.”',
        },
        {
          en: 'She did not need fireworks or miracles to believe. She had lived with this man for many years, and she knew with certainty that he had never told a lie in his whole life. So when he spoke the truth, her whole heart trusted him.',
        },
        {
          en: 'Her quick belief was a great blessing to the Prophet ﷺ. When the city of Makkah was difficult and most people refused him, the one part of the world where he always felt believed and loved was the home of Khadijah.',
        },
        {
          en: 'The very first “yes” in the story of Islam did not come from a grand hall or a mighty king. It came quietly from the gentle heart of a wife, inside a small home — and that first yes carried the whole religion on its back.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (Khadijah was the first to believe)',
          needsVerification: true,
          label: { en: 'Khadijah is the very first person to accept and believe in Islam', ur: 'خدیجہ وہ پہلی شخصیت ہیں جنہوں نے اسلام قبول کیا اور ایمان لائیں' },
        },
        { type: 'hadith', reference: 'Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah)', label: { en: 'Khadijah trusted the Prophet ﷺ with her entire heart and soul', ur: 'خدیجہ نے پورے دل و جان سے نبی کریم ﷺ پر بھروسہ کیا' } },
      ],
    },
    {
      id: 'warmth-in-the-dark-room',
      title: { en: 'Warmth in a Dark Hour' },
      paragraphs: [
        {
          en: 'At the very beginning of revelation, the Prophet ﷺ came down from the mountain cave trembling, carrying a beautiful but enormous weight. He hurried into his home saying: “Cover me! Cover me!” and Khadijah wrapped him in a blanket.',
        },
        {
          en: 'Then Khadijah spoke the most comforting words found anywhere in the stories of Makkah: “By Allah, He will never put you to shame. You keep your family ties, you carry the burden of others, you help the poor, and you give to the needy.”',
        },
        {
          en: 'She confirmed his heart and then took him to her wise and elderly relative, a man who knew the old scriptures. He said to both of them: the same angel that came to Moses has now come to him, and he is the prophet of this people.',
        },
        {
          en: 'From that night on, the Prophet ﷺ knew that he was not alone on this new road. The revelation fell onto his heart like heavy rain — but Khadijah was the kind roof that kept him warm and safe.',
        },
        {
          en: 'Every child who loves the story of the first revelation should also learn this beautiful part: when the mountain shook and the darkness closed, the Prophet ﷺ found his light in the comfort of Khadijah’s kind words.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (the beginning of revelation; Khadijah comforting the Prophet ﷺ)',
          label: { en: 'Khadijah comforts the Prophet ﷺ in the first scary moment of revelation', ur: 'خدیجہ وحی کے پہلے ڈراؤنے لمحے میں نبی کریم ﷺ کو تسلی دیتی ہیں' },
        },
      ],
    },
    {
      id: 'the-year-of-sorrow',
      title: { en: 'The Year of Sorrow' },
      paragraphs: [
        {
          en: 'For many years the Prophet ﷺ and his family carried their faith under hard trials in the city of Makkah. The enemies treated his people harshly, and the one big protector, his kind uncle Abu Talib, passed away after many years of watching over him.',
        },
        {
          en: 'Then, very soon after, Khadijah’s gentle body became weak, and she returned to Allah. In one short stretch of time, the Prophet ﷺ had lost the two people who had protected and comforted him his whole life — and the people called it the “Year of Sorrow.”',
        },
        {
          en: 'The believers recalled that the Prophet ﷺ missed Khadijah with such a deep and long love that even years later, when her old friends came to visit, tears of memory would gather right at the edge of his eyes.',
        },
        {
          en: 'That hardest of years taught the believers about patience. From the Prophet ﷺ they learned that even a heart filled with grief never stops trusting Allah and never stops serving the mission, and that the year of the hardest seasons still only passes in a moment.',
        },
        {
          en: 'We honor Khadijah every time we retell the early beauty of Islam. Her years helped the Prophet ﷺ stand, and her passing taught the whole world that great love does not end — it only changes where it rests.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah)', label: { en: 'In the Year of Sorrow, the Prophet ﷺ loses his uncle and his wife', ur: 'غم کے سال میں نبی کریم ﷺ اپنے چچا اور اپنی بیوی دونوں سے محروم ہو جاتے ہیں' } },
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (the death of Khadijah, the Year of Sorrow)',
          needsVerification: true,
          label: { en: 'Khadijah passes away in the sad, hard year called the Year of Sorrow', ur: 'خدیجہ اس اداس اور مشکل سال میں وفات پاتی ہیں جسے غم کا سال کہا گیا' },
        },
      ],
    },
    {
      id: 'he-never-stopped-loving-her',
      title: { en: 'He Never Stopped Loving Her' },
      paragraphs: [
        {
          en: 'Long after Khadijah passed away, the Prophet ﷺ married again, and one of his wives, Aisha, shared a famous honest secret: even though she had never met her, she felt the loving shadow of Khadijah in their home.',
        },
        {
          en: 'Whenever the Prophet ﷺ cooked a sheep or received a gift, he sent part of it to her families and old friends — quietly, no fanfare — so that the memory of his first wife would never grow thirsty in the world.',
        },
        {
          en: 'One day he mentioned her to Aisha, and Aisha, in her loving teasing, said she wished she could be like her. The Prophet ﷺ did not scold her; he just nodded, and reminded them both that the treasure he treasured most in marriage was the love of a true and gentle heart.',
        },
        {
          en: 'Because of this, the whole world remembers him as a faithful husband. He remembered Khadijah’s kindness after she was gone, and did not let it grow cold — he kept sharing that kindness with her friends and family.',
        },
        {
          en: 'Kindness that we remember and share, as the Prophet ﷺ shared Khadijah’s, is the kind of love that never grows tired. We can honor this precious mother of the believers by being soft, honest, and generous — just as she was.',
        },
      ],
      sources: [
        {
          type: 'hadith',
          reference: 'Sahih al-Bukhari; Sahih Muslim (the Prophet ﷺ remembers Khadijah after her death)',
          needsVerification: true,
          label: { en: 'The Prophet ﷺ still remembers and honors Khadijah many years later', ur: 'نبی کریم ﷺ کئی سال بعد بھی خدیجہ کو یاد کرتے ہیں اور ان کی عزت کرتے ہیں' },
        },
        {
          type: 'hadith',
          reference: 'Seerah (Ibn Kathir, Al-Bidayah wan-Nihayah)',
          label: { en: 'The Prophet ﷺ sends gifts to Khadijah’s friends and family, with love', ur: 'نبی کریم ﷺ محبت کے ساتھ خدیجہ کی سہیلیوں اور خاندان کو تحفے بھیجتے ہیں' },
        },
      ],
    },
  ],
};