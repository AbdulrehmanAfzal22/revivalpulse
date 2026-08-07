import type { KidsStoryV2 } from 'types/kidsStories.types';

/**
 * Bilal ibn Rabah (RA) — the first mu'adhin (caller to prayer) of Islam
 * (Phase 8 Batch 1).
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
export const SAHABI_BILAL: KidsStoryV2 = {
  id: 'bilal',
  type: 'sahabi',
  nameArabic: 'بلال بن رباح',
  nameEnglish: 'Bilal ibn Rabah',
  illustrationSymbol: 'Sparkle',
  accentColor: '#e0902f',
  summary: {
    en: 'A patient believer whose heart never broke, even under painful treatment in Makkah. The Prophet ﷺ chose him to be the very first person to call the adhan (the call to prayer). Bilal taught us that true strength is a heart that stays close to Allah.',
  },
  chapters: [
    {
      id: 'steadfast-heart',
      title: { en: 'A Heart That Would Not Break' },
      paragraphs: [
        {
          en: 'Bilal was a tall, strong man who was a servant in Makkah. When he accepted Islam, his owner grew very angry. The owner threw Bilal on the hot sand and placed a heavy stone on his chest, hoping Bilal would give up his faith.',
        },
        {
          en: 'But Bilal only repeated one word again and again: “Ahad, Ahad — One, One (Allah).” The hotter the day, the stronger his words became. The stones and the heat could hurt his body, but they could never touch his heart.',
        },
        {
          en: 'The Seerah tells us how much goodness Bilal had inside him. Even while he was hurting, he did not become angry at people. He only remembered Allah, because His love was stronger than any pain.',
        },
        {
          en: 'Bilal’s story teaches children a very strong lesson: your heart can be worth more than your physical strength. When we hold on to Allah even through small troubles, our hearts grow as strong as the hearts of the heroes of Islam.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari, Kitab al-Manakib (Virtues of Bilal)', needsVerification: true, label: { en: 'Bilal repeats Ahad, Ahad under the heavy stone and burning sand', ur: 'بلال بھاری پتھر اور تپتی ریت کے نیچے احد، احد دہراتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah tells how patient and strong Bilal’s heart stayed', ur: 'سیرت بتاتی ہے کہ بلال کا دل کتنا صابر اور مضبوط رہا' } },
      ],
    },
    {
      id: 'bought-and-freed',
      title: { en: 'Bought and Freed by Abu Bakr' },
      paragraphs: [
        {
          en: 'Abu Bakr (RA) could not watch his believing brother suffer. He gave money to Bilal’s owner and freed him, so that Bilal could finally stand up, tall and free, and praise his Lord out loud without fear.',
        },
        {
          en: 'Bilal the student was a free man, and free same heart he had kept in confinement came out whole. He found his place beside the Prophet ﷺ, close to him night and day, loving him more and more.',
        },
        {
          en: 'Some people once said that Abu Bakr had bought Bilal for a small profit, so the Prophet ﷺ corrected them: “If you underpaid him, we would repay it; if you overpaid him, we would accept him.” And he made sure everyone knew that Abu Bakr’s payment-turing was accepted (Sahih al-Bukhari; Seerah).',
        },
        {
          en: 'So freedom came twice for Bilal: first his body was freed, and then his voice was freed to praise. And freedom is a blessing we should always be thankful for, and use to worship Allah and help others.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari (Virtues of Abu Bakr / Bilal)', needsVerification: true, label: { en: 'Abu Bakr gives money to free Bilal and sets him free', ur: 'ابوبکر بلال کو آزاد کرنے کے لیے پیسے دیتے ہیں اور انہیں آزاد کر دیتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Hisham)', label: { en: 'The Seerah tells that Abu Bakr freed and cared for Bilal', ur: 'سیرت بتاتی ہے کہ ابوبکر نے بلال کو آزاد کیا اور ان کی دیکھ بھال کی' } },
      ],
    },
    {
      id: 'first-adhan',
      title: { en: 'The First Voice of the Adhan' },
      paragraphs: [
        {
          en: 'When the Muslims moved to Madeenah, the Prophet ﷺ wanted a special sign to call people to the prayer. One night, a friend of the Prophet saw the adhan in a dream — the beautiful words that call “Allah is Greatest, Allah is Greatest… Come to prayer!”',
        },
        {
          en: 'The Prophet ﷺ loved the idea, and told Bilal to rise and call the adhan with these words. So the first voice of the adhan ever heard in Islam belonged to Bilal, with his deep and sweet voice calling the city to the prayer.',
        },
        {
          en: 'The Prophet ﷺ said that the mu’adhins — the people who call the prayer — are the longest ones in the necks on the Day of Judgment, honored because their voices spent their whole lives calling people to Allah (Sahih Muslim).',
        },
        {
          en: 'Every time a child hears the adhan today, they are hearing the echo of Bilal’s voice through the world. The same turn to the prayer is the one he called with his honest heart in the very first years of Islam.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari; Sahih Muslim', needsVerification: true, label: { en: 'The Prophet ﷺ tells Bilal to call the adhan with the words of the dream', ur: 'نبی کریم ﷺ بلال سے کہتے ہیں کہ وہ خواب کے الفاظ کے ساتھ اذان دیں' } },
        { type: 'hadith', reference: 'Sahih Muslim (chapter on adhān)', needsVerification: true, label: { en: 'On the Day of Judgment, the mu’adhins are honored for their call to prayer', ur: 'قیامت کے دن اذان دینے والوں کو عزت دی جائے گی کیونکہ وہ لوگوں کو اللہ کی طرف بلاتے ہیں' } },
      ],
    },
    {
      id: 'voice-after-the-prophet',
      title: { en: 'The Voice Behind the Prophet' },
      paragraphs: [
        {
          en: 'Bilal stayed close to the Prophet ﷺ every year of his life. When the Prophet called prayer, Bilal called, and when the Messenger traveled, Bilal went with him, and his famous shoe threw the sand of Madeenah, the Prophet ﷺ heard him in Paradise and smiled.',
        },
        {
          en: 'The Prophet ﷺ once told Bilal that he had heard the sound of his steps ahead of him in Paradise because of a beautiful prayer Bilal had learned. Being a companion so near the Prophet ﷺ was the biggest reward a human heart could hold.',
        },
        {
          en: 'When the Prophet ﷺ passed away, Bilal’s voice became heavy. He asked the first caliph, Abu Bakr (RA), to let him stop calling the adhan in Madinah, because every call to prayer reminded him of the Messenger ﷺ he loved best of all.',
        },
        {
          en: 'Today the name Bilal reminds Muslims of a believer who lost everything except Allah — and from that poverty Allah raised him to honor. He is a shining proof that Allah chooses His servants not by their worldly wealth, but by the purity of their hearts.',
        },
      ],
      sources: [
        { type: 'hadith', reference: 'Sahih al-Bukhari 1002 (hadith of Paradise with Bilal)', needsVerification: true, label: { en: 'The Prophet ﷺ tells Bilal he hears his footsteps in Paradise', ur: 'نبی کریم ﷺ بلال سے کہتے ہیں کہ وہ جنت میں ان کے قدموں کی آواز سنتے ہیں' } },
        { type: 'hadith', reference: 'Seerah (Ibn Sa’d)', needsVerification: true, label: { en: 'After the Prophet ﷺ passes away, Bilal asks to stop the adhan in Madinah', ur: 'نبی کریم ﷺ کے انتقال کے بعد بلال مدینہ میں اذان دینا چھوڑنے کی اجازت مانگتے ہیں' } },
      ],
    },
  ],
};