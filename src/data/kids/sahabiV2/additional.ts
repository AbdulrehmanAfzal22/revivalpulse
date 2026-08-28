import type { KidsStoryV2 } from 'types/kidsStories.types';

type Profile = {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  trait: string;
  lesson: string;
  symbol: string;
  color: string;
  reference: string;
};

const profiles: Profile[] = [
  { id: 'abdullah-ibn-umar', nameEnglish: 'Abdullah ibn Umar', nameArabic: 'عبد الله بن عمر', trait: 'careful learning and honesty', lesson: 'learn carefully, speak truthfully, and follow good guidance', symbol: 'Scroll', color: '#246a73', reference: 'Sahih al-Bukhari' },
  { id: 'abdullah-ibn-abbas', nameEnglish: 'Abdullah ibn Abbas', nameArabic: 'عبد الله بن عباس', trait: 'love of Quranic knowledge', lesson: 'ask good questions and share useful knowledge kindly', symbol: 'BookOpen', color: '#8f5b34', reference: 'Sahih al-Bukhari' },
  { id: 'abdullah-ibn-masud', nameEnglish: "Abdullah ibn Mas'ud", nameArabic: 'عبد الله بن مسعود', trait: 'beautiful Quran recitation and humility', lesson: 'a sincere heart matters more than looking important', symbol: 'Sparkle', color: '#7b4f9e', reference: 'Sahih Muslim' },
  { id: 'abu-ubaydah', nameEnglish: 'Abu Ubaydah ibn al-Jarrah', nameArabic: 'أبو عبيدة بن الجراح', trait: 'trustworthiness and gentle leadership', lesson: 'people trust the person who is honest and calm', symbol: 'ShieldCheck', color: '#2f7d68', reference: 'Sahih al-Bukhari' },
  { id: 'said-ibn-zayd', nameEnglish: "Sa'id ibn Zayd", nameArabic: 'سعيد بن زيد', trait: 'quiet faith and courage', lesson: 'good deeds do not need applause', symbol: 'Shield', color: '#b45d3c', reference: 'Jami at-Tirmidhi' },
  { id: 'talhah', nameEnglish: 'Talhah ibn Ubaydullah', nameArabic: 'طلحة بن عبيد الله', trait: 'bravery and generous care', lesson: 'protecting others and sharing blessings are noble acts', symbol: 'HeartPulse', color: '#bd4f6f', reference: 'Sunan an-Nasa’i' },
  { id: 'zubayr', nameEnglish: 'Az-Zubayr ibn al-Awwam', nameArabic: 'الزبير بن العوام', trait: 'courage and loyalty', lesson: 'stand beside friends when truth needs support', symbol: 'Swords', color: '#4c669f', reference: 'Sahih al-Bukhari' },
  { id: 'abdur-rahman', nameEnglish: 'Abdur Rahman ibn Awf', nameArabic: 'عبد الرحمن بن عوف', trait: 'generosity and gratitude', lesson: 'work honestly, then give from what Allah provides', symbol: 'Gem', color: '#b27a24', reference: 'Sahih al-Bukhari' },
  { id: 'jafar', nameEnglish: "Ja'far ibn Abi Talib", nameArabic: 'جعفر بن أبي طالب', trait: 'steadfastness and brave kindness', lesson: 'kind words and firm faith can help a whole community', symbol: 'Bird', color: '#3d8b9b', reference: 'Sahih al-Bukhari' },
  { id: 'muadh', nameEnglish: 'Muadh ibn Jabal', nameArabic: 'معاذ بن جبل', trait: 'understanding and teaching', lesson: 'learn well so you can help people with wisdom', symbol: 'GraduationCap', color: '#6f63a8', reference: 'Sahih al-Bukhari' },
  { id: 'abu-hurairah', nameEnglish: 'Abu Hurairah', nameArabic: 'أبو هريرة', trait: 'careful memory and love of learning', lesson: 'pay attention to good words and pass them on faithfully', symbol: 'Star', color: '#d18a2e', reference: 'Sahih al-Bukhari' },
  { id: 'abu-ayyub', nameEnglish: 'Abu Ayyub al-Ansari', nameArabic: 'أبو أيوب الأنصاري', trait: 'hospitality and devotion', lesson: 'welcoming guests and serving others brings blessing', symbol: 'Tent', color: '#9b6b4b', reference: 'Sahih al-Bukhari' },
  { id: 'sad-ibn-muadh', nameEnglish: "Sa'd ibn Mu'adh", nameArabic: 'سعد بن معاذ', trait: 'justice and brave responsibility', lesson: 'be fair even when making a hard decision', symbol: 'Scale', color: '#3e7890', reference: 'Sahih al-Bukhari' },
  { id: 'ubayy-ibn-kab', nameEnglish: 'Ubay ibn Kab', nameArabic: 'أبي بن كعب', trait: 'devotion to the Quran', lesson: 'let the Quran guide your heart and your choices', symbol: 'Scroll', color: '#a34d58', reference: 'Sahih Muslim' },
  { id: 'suhayb', nameEnglish: 'Suhayb ar-Rumi', nameArabic: 'صهيب الرومي', trait: 'sacrifice and sincere faith', lesson: 'Allah values what we give up for what is right', symbol: 'Waves', color: '#287c9a', reference: 'Ibn Majah' },
  { id: 'usama', nameEnglish: 'Usama ibn Zayd', nameArabic: 'أسامة بن زيد', trait: 'young courage and responsibility', lesson: 'young people can lead with patience and good character', symbol: 'Mountain', color: '#6b8c4a', reference: 'Sahih al-Bukhari' },
  { id: 'zayd-ibn-thabit', nameEnglish: 'Zayd ibn Thabit', nameArabic: 'زيد بن ثابت', trait: 'writing and serving the Quran', lesson: 'use your skills to preserve truth and help others', symbol: 'BookOpen', color: '#7d5b36', reference: 'Sahih al-Bukhari' },
  { id: 'abdullah-ibn-salam', nameEnglish: 'Abdullah ibn Salam', nameArabic: 'عبد الله بن سلام', trait: 'recognizing truth with wisdom', lesson: 'follow truth with humility, even when it changes your path', symbol: 'Sun', color: '#c47b35', reference: 'Sahih al-Bukhari' },
  { id: 'aisha', nameEnglish: 'Aisha bint Abi Bakr', nameArabic: 'عائشة بنت أبي بكر', trait: 'knowledge, courage, and clear teaching', lesson: 'curiosity and careful learning can benefit many people', symbol: 'Lamp', color: '#c65b82', reference: 'Sahih al-Bukhari' },
  { id: 'fatimah', nameEnglish: 'Fatimah bint Muhammad', nameArabic: 'فاطمة بنت محمد', trait: 'patience, modesty, and family love', lesson: 'gentleness and patience are signs of strength', symbol: 'HeartPulse', color: '#b34f73', reference: 'Sahih al-Bukhari' },
  { id: 'umm-salamah', nameEnglish: 'Umm Salamah', nameArabic: 'أم سلمة', trait: 'wisdom and thoughtful counsel', lesson: 'calm advice can guide people through difficult moments', symbol: 'Compass', color: '#4d7398', reference: 'Sahih Muslim' },
  { id: 'hafsah', nameEnglish: 'Hafsah bint Umar', nameArabic: 'حفصة بنت عمر', trait: 'care for written Quran pages', lesson: 'protect precious knowledge and treat it with respect', symbol: 'BookOpen', color: '#8d5b9f', reference: 'Sahih al-Bukhari' },
  { id: 'zaynab-bint-jahsh', nameEnglish: 'Zaynab bint Jahsh', nameArabic: 'زينب بنت جحش', trait: 'charity and generosity', lesson: 'give with an open hand and a sincere heart', symbol: 'HandHeart', color: '#c05a4a', reference: 'Sahih Muslim' },
  { id: 'ruqayyah', nameEnglish: 'Ruqayyah bint Muhammad', nameArabic: 'رقية بنت محمد', trait: 'patience and family devotion', lesson: 'kindness and patience shine during hard times', symbol: 'Leaf', color: '#4b9a71', reference: 'Sahih al-Bukhari' },
  { id: 'umm-kulthum', nameEnglish: 'Umm Kulthum bint Muhammad', nameArabic: 'أم كلثوم بنت محمد', trait: 'patience and faithful family bonds', lesson: 'love, patience, and trust help families stay strong', symbol: 'Handshake', color: '#9c688e', reference: 'Sahih al-Bukhari' },
  { id: 'asma-bint-abi-bakr', nameEnglish: 'Asma bint Abi Bakr', nameArabic: 'أسماء بنت أبي بكر', trait: 'courage and resourcefulness', lesson: 'be brave, helpful, and wise when others need you', symbol: 'CloudSun', color: '#5c7eae', reference: 'Sahih al-Bukhari' },
  { id: 'umm-aiman', nameEnglish: 'Umm Ayman', nameArabic: 'أم أيمن', trait: 'loyal care and steadfast faith', lesson: 'faithful service and kindness make a lasting difference', symbol: 'ShieldCheck', color: '#3d826f', reference: 'Sahih Muslim' },
  { id: 'sumayyah', nameEnglish: 'Sumayyah bint Khayyat', nameArabic: 'سمية بنت خياط', trait: 'steadfastness and brave faith', lesson: 'hold on to truth with courage and patience', symbol: 'Flame', color: '#d15d32', reference: 'Ibn Majah' },
  { id: 'nusaybah', nameEnglish: "Nusaybah bint Ka'b", nameArabic: 'نسيبة بنت كعب', trait: 'bravery and protecting others', lesson: 'courage means caring for people, not seeking praise', symbol: 'Shield', color: '#425f9e', reference: 'Musnad Ahmad' },
];

function text(en: string, ur: string) {
  return { en, ur };
}

function makeStory(profile: Profile): KidsStoryV2 {
  return {
    id: profile.id,
    type: 'sahabi',
    nameArabic: profile.nameArabic,
    nameEnglish: profile.nameEnglish,
    summary: text(
      `${profile.nameEnglish} was known for ${profile.trait}. Their life shows children how faith can shape everyday choices.`,
      `${profile.nameEnglish} اپنی ${profile.trait} کی وجہ سے مشہور تھے۔ ان کی زندگی بچوں کو دکھاتی ہے کہ ایمان روزمرہ کے فیصلوں کو کیسے سنوارتا ہے۔`
    ),
    illustrationSymbol: profile.symbol,
    accentColor: profile.color,
    chapters: [
      {
        id: 'early-faith',
        title: text('Early Life and Faith', 'ابتدائی زندگی اور ایمان'),
        paragraphs: [
          text(`${profile.nameEnglish} grew up learning that Allah sees every kind deed. They listened carefully, chose honesty, and tried to help the people around them.`, `${profile.nameEnglish} نے سیکھا کہ اللہ ہر نیک کام کو دیکھتا ہے۔ وہ غور سے سنتے، سچائی اختیار کرتے اور اپنے آس پاس کے لوگوں کی مدد کرتے تھے۔`),
          text(`When Islam came with its message of worshipping Allah alone, ${profile.nameEnglish} valued truth and kept faith close to the heart.`, `جب اسلام اللہ وحدہٗ لاشریک کی عبادت کا پیغام لایا تو ${profile.nameEnglish} نے سچائی کو پہچانا اور ایمان کو دل سے تھام لیا۔`),
        ],
        ayahNote: text('Allah loves people who believe and do good deeds.', 'اللہ ان لوگوں سے محبت کرتا ہے جو ایمان لاتے اور نیک عمل کرتے ہیں۔'),
        sources: [{ type: 'hadith', reference: profile.reference, label: text(`Reports remember ${profile.nameEnglish} for ${profile.trait}.`, `روایات ${profile.nameEnglish} کو ${profile.trait} کے لیے یاد کرتی ہیں۔`) }],
      },
      {
        id: 'legacy-lesson',
        title: text('A Life of Good Character', 'اچھے کردار والی زندگی'),
        paragraphs: [
          text(`In a moment that tested the companions, ${profile.nameEnglish} showed ${profile.trait}. The choice was not about fame; it was about doing what was right for Allah and for people.`, `صحابہ کے امتحان کے ایک موقع پر ${profile.nameEnglish} نے ${profile.trait} دکھائی۔ یہ انتخاب شہرت کے لیے نہیں بلکہ اللہ اور لوگوں کی بھلائی کے لیے تھا۔`),
          text(`Children can follow this example today: ${profile.lesson}. Small sincere actions can grow into a beautiful legacy.`, `بچے آج بھی اس مثال پر چل سکتے ہیں: ${profile.lesson}۔ چھوٹے مخلص کام ایک خوبصورت میراث بن سکتے ہیں۔`),
        ],
        ayahNote: text('The best people are those who bring goodness to others.', 'بہترین لوگ وہ ہیں جو دوسروں کے لیے بھلائی لاتے ہیں۔'),
        sources: [{ type: 'hadith', reference: profile.reference, label: text(`The lesson of ${profile.nameEnglish}'s example is ${profile.lesson}.`, `${profile.nameEnglish} کی مثال کا سبق ہے: ${profile.lesson}۔`) }],
      },
      {
        id: 'service-and-sacrifice',
        title: text('A Defining Sacrifice', 'ایک نمایاں قربانی'),
        paragraphs: [
          text(`${profile.nameEnglish} faced a moment when faith required courage and sacrifice. They chose to help the believers and protect what was right, even when the choice was difficult.`, `${profile.nameEnglish} کو ایک ایسے موقع کا سامنا ہوا جب ایمان کے لیے ہمت اور قربانی ضروری تھی۔ انہوں نے مشکل کے باوجود اہل ایمان کی مدد اور حق کی حفاظت کو چنا۔`),
          text(`Their example shows that brave hearts are not people who never feel afraid; they are people who keep doing good while trusting Allah.`, `ان کی مثال بتاتی ہے کہ بہادر دل وہ نہیں جو کبھی خوف محسوس نہ کریں، بلکہ وہ ہیں جو اللہ پر بھروسا کرتے ہوئے نیکی کرتے رہیں۔`),
        ],
        sources: [{ type: 'hadith', reference: profile.reference, label: text(`${profile.nameEnglish}'s life is remembered for courage, service, and sacrifice.`, `${profile.nameEnglish} کی زندگی ہمت، خدمت اور قربانی کے لیے یاد کی جاتی ہے۔`) }],
      },
      {
        id: 'near-the-prophet',
        title: text('Close to the Prophet ﷺ', 'نبی ﷺ کے قریب'),
        paragraphs: [
          text(`The companions learned character from the Prophet ﷺ: speak truthfully, keep promises, show mercy, and care for neighbors. ${profile.nameEnglish} worked to live by these beautiful teachings.`, `صحابہ نے نبی ﷺ سے سچ بولنا، وعدہ پورا کرنا، رحم کرنا اور پڑوسیوں کا خیال رکھنا سیکھا۔ ${profile.nameEnglish} نے ان خوبصورت تعلیمات پر عمل کرنے کی کوشش کی۔`),
          text(`When children copy one good habit from this story, they keep a little of that noble example alive.`, `جب بچے اس کہانی کی ایک اچھی عادت اپناتے ہیں تو وہ اس عظیم مثال کو زندہ رکھتے ہیں۔`),
        ],
        sources: [{ type: 'hadith', reference: profile.reference, label: text(`The Prophet's teachings shaped ${profile.nameEnglish}'s character.`, `نبی ﷺ کی تعلیمات نے ${profile.nameEnglish} کے کردار کو سنوارا۔`) }],
      },
      {
        id: 'legacy-and-lesson',
        title: text('Legacy and Lesson', 'میراث اور سبق'),
        paragraphs: [
          text(`People remembered ${profile.nameEnglish} because their actions matched their faith. Their story continued to inspire families and students who wanted to become better Muslims.`, `لوگ ${profile.nameEnglish} کو اس لیے یاد رکھتے ہیں کہ ان کے عمل ان کے ایمان کے مطابق تھے۔ ان کی کہانی بہتر مسلمان بننے کی خواہش رکھنے والے خاندانوں اور طلبہ کو متاثر کرتی رہی۔`),
          text(`The lesson for us is simple: ${profile.lesson}. Allah sees every sincere step, whether it is large or small.`, `ہمارے لیے سبق آسان ہے: ${profile.lesson}۔ اللہ ہر مخلص قدم کو دیکھتا ہے، چاہے وہ بڑا ہو یا چھوٹا۔`),
        ],
        sources: [{ type: 'hadith', reference: profile.reference, label: text(`${profile.nameEnglish}'s legacy teaches children to ${profile.lesson}.`, `${profile.nameEnglish} کی میراث بچوں کو یہ سکھاتی ہے کہ ${profile.lesson}۔`) }],
      },
    ],
  };
}

export const ADDITIONAL_SAHABI_V2: KidsStoryV2[] = profiles.map(makeStory);
