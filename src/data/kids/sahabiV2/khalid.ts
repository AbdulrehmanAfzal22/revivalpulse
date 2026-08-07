import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Khalid ibn al-Walid (RA) — "Sayf Allah", the Sword of Allah, one of the
 * greatest commanders of Islam (Phase 8 Batch 1).
 *
 * Citation discipline for Sahabah content: Hadith/Seerah sourced ONLY.
 * References that could not be confidently pinned to a specific authentic
 * narration while writing are marked `needsVerification: true`.
 *
 * `ur` is intentionally empty — readers see the English fallback until
 * careful Urdu translations are added later.
 *
 * Review sign-off: single-reviewer (site owner). Sources get `reviewed: true`
 * + `reviewedBy`/`reviewedDate` in batches; confirm-read sign-off, not
 * scholarly/ijazah certification.
 */
export const SAHABI_KHALID: KidsStoryV2 = {
  id: 'khalid',
  type: 'sahabi',
  nameArabic: 'خالد بن الوليد',
  nameEnglish: 'Khalid ibn al-Walid',
  illustrationSymbol: 'Shield',
  accentColor: '#5b7583',
  summary: {
    en: 'A famous warrior who first fought against the Muslims — and then, when Allah opened his heart, became a champion of Islam. The Prophet ﷺ honored him with the title "the Sword of Allah." Khalid shows us that it is never too late to leave the wrong path and embrace the truth.',
  },
  chapters: [
    {
      id: 'great-warrior',
      title: { en: 'A Warrior Before Islam' },
      paragraphs: [
        {
          en: 'Khalid was a brave and clever man from Makkah. Even before Islam he was famous for his courage and his skill in battle. At the battle of Uhud, he commanded the cavalry that passed beside the Muslims, and for a while his boldness shook the believers.',
        },
        {
          en: 'But in the middle of the battlefield, Khalid also noticed something strange and beautiful. Even when the Muslims began to stumble, they did not run or break. They gathered around their Prophet ﷺ and around the truth, and that silent strength stayed in Khalid’s mind for a long time.',
        },
        {
          en: 'Years later, when the two armies met again at the trench, the same feeling came back to him. The truth did not win with endless weapons; it won because it was truly the truth, and Khalid’s own heart began to lean toward it more and more.',
        },
        {
          en: 'We can learn from Khalid that a person’s past is not his future. Where a soul was headed yesterday does not decide today. The heart can be turned around, and Khalid’s chapter shows us exactly that in a way almost no other story does.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Hisham) — Khalid before Islam', label: { en: 'Khalid commands the horsemen against the Muslims at the battle of Uhud', ur: 'خالد جنگ احد میں مسلمانوں کے خلاف گھڑ سواروں کی قیادت کرتے ہیں' } },
      ],
    },
    {
      id: 'the-day-he-came',
      title: { en: 'The Day He Came to the Prophet' },
      paragraphs: [
        {
          en: 'In the year of the treaty, the peace of the Treaty of Hudaybiyyah, Khalid felt his heart ready. He rode to the Prophet ﷺ together with his brother, and both of them were welcomed warmly into Islam.',
        },
        {
          en: 'The Prophet ﷺ received him with a smile and a free heart. The same hands that had held a sword against the believers became hands raised in prayer, and the same courage turned to the side of the faith.',
        },
        {
          en: 'From that day, Khalid used his talent — the same talent he had used on a bad side — now completely for the good. When Allah turns a heart, He does not discard its gifts; He aims the same gifts at the right targets.',
        },
        {
          en: 'It was the most important victory in Khalid’s whole life, and it was not won on any battlefield. It was won quietly, inside his chest, the day he said yes to the truth.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Seerah (Ibn Hisham) — Khalid accepting Islam', label: { en: 'After the treaty, Khalid rides to the Prophet ﷺ and accepts Islam', ur: 'صلح کے بعد خالد نبی کریم ﷺ کے پاس آتے ہیں اور اسلام قبول کرتے ہیں' } },
        { type: 'hadith', reference: 'Sahih al-Bukhari', needsVerification: true, label: { en: 'The Prophet ﷺ warmly welcomes Khalid into Islam', ur: 'نبی کریم ﷺ خالد کو محبت سے اسلام میں خوش آمدید کہتے ہیں' } },
      ],
    },
    {
      id: 'sword-of-allah',
      title: { en: 'The Sword of Allah' },
      paragraphs: [
        {
          en: 'Khalid soon became one of the bravest soldiers of the Prophet ﷺ. At the battle of Mutah, when the first great commanders of the Muslims fell one after another, Khalid stepped up and took the banner, keeping the Muslim army true night of those days.',
        },
        {
          en: 'The Prophet ﷺ was overjoyed and thanks a praiseworthy name for him: Khalid is the Sword of Allah against the enemies. The whole world of Islam would remember his name forever as "Sayf Allah," the Sword of Allah.',
        },
        {
          en: 'A sword is not always a symbol of breaking. Khalid used his courage to protect the people, guard the faith, and face those who wanted to harm the believers. That is the story of a hero — strength turned into mercy and safety.',
        },
        {
          en: 'Every child has some own skill — a strong arm, a loud patient, a quick mind. What Khalid’s life says is: place your skill into Allah’s hands, and it will be shaped into something that protects and heals and helps the whole world.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (chapter of Mutah)', needsVerification: true, label: { en: 'Khalid takes the flag at Mutah when the three commanders fall', ur: 'خالد جنگ موتہ میں جھنڈا سنبھالتے ہیں جب تین کمانڈر شہید ہو جاتے ہیں' } },
        { type: 'hadith', reference: 'Sahih Muslim', needsVerification: true, label: { en: 'The Prophet ﷺ calls Khalid the Sword of Allah', ur: 'نبی کریم ﷺ خالد کو اللہ کی تلوار کہتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah tells how Khalid was praised as Sayf Allah, the Sword of Allah', ur: 'سیرت بتاتی ہے کہ خالد کو سیف اللہ یعنی اللہ کی تلوار کے طور پر کیسے سراہا گیا' } },
      ],
    },
    {
      id: 'second-service',
      title: { en: 'Serving Faith with a Second Courage' },
      paragraphs: [
        {
          en: 'After the Prophet ﷺ passed away, Khalid kept serving the community under the first caliph, Abu Bakr (RA). He led the Muslim armies through the dark days when several tribes tried to end their faith once more — pushing the confusion away with his courage.',
        },
        {
          en: 'He commanded the armies of the believers in the wars of apostasy, and then the victories in Syria and beyond. Little by little, through his plan and bravery, great lands came together under justice and the fear/prayer of Allah.',
        },
        {
          en: 'For all his strength, Khalid was a man who the heart. In his last days he asked Allah for a death of a hero, and his old friends remember how he cared his treasures away, avoiding the wealth and the vanity like a saadiq.',
        },
        {
          en: 'Khalid finished as he had lived — strong, humble, and true. The sword of Allah was finally resting in the hand of the One who manages every soldier and every heart.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Tarikh (At-Tabari) — the dirwins of the Ridda and of Syria', needsVerification: true, label: { en: 'Khalid leads the armies of the Ridda wars and the conquests of Syria', ur: 'خالد جنگِ ارتداد اور شام کی فتوحات میں لشکروں کی قیادت کرتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Sa’d)', needsVerification: true, label: { en: 'In his last days, Khalid pleads for a death like a hero and refuses vanity', ur: 'آخری ایام میں خالد بہادر کی موت کی دعا کرتے ہیں اور دنیا کی چمک دور کرتے ہیں' } },
      ],
    },
  ],
};