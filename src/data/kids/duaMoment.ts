/**
 * Dua for the Moment: situations and their matching duas for kids.
 * Practical application of daily supplications.
 *
 * Content standard (the same as the rest of the Islamic content in this project):
 *  - The pool is 100+ items so a child never repeats a round in normal play.
 *  - Every situation and every dua is grounded in the Quran or an authentic,
 *    well-known hadith. No invented supplications, no misrepresentations.
 *    `needsVerification` stays true so references are re-checked before ever
 *    being presented as verified.
 *  - Each dua's Arabic text is unique within the pool; decoy selection in the
 *    game also excludes any item with the same Arabic text as the target.
 */

export interface DuaMomentItem {
  id: string;
  situation: {
    en: string;
    icon: string; // emoji or identifier for the situation
  };
  dua: {
    arabic: string;
    transliteration: string;
    translation: { en: string };
  };
  /** Source reference */
  source: {
    type: 'hadith' | 'quran' | 'scholar';
    reference: string;
    needsVerification: boolean;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DUA_MOMENT_ITEMS: DuaMomentItem[] = [
  {
    id: 'before-eating',
    situation: { en: 'Before eating a meal', icon: '🍽️' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ وَبَرَكَةِ اللَّهِ',
      transliteration: 'Bismillahi wa barakatillah',
      translation: { en: 'In the name of Allah, and with the blessing of Allah' },
    },
    source: { type: 'hadith', reference: 'al-Mustadrak al-Hakim 7084 (sahih al-isnad)', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'after-eating',
    situation: { en: 'After finishing a meal', icon: '🍽️' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      transliteration: 'Alhamdulillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
      translation: { en: 'All praise is for Allah who fed us, gave us drink, and made us Muslims' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 3850', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'before-sleep',
    situation: { en: 'Before going to sleep', icon: '😴' },
    dua: {
      arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      transliteration: 'Bismika Allahumma amutu wa ahya',
      translation: { en: 'In Your name, O Allah, I die and I live' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6324', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'waking-up',
    situation: { en: 'When waking up', icon: '🌅' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      transliteration: 'Alhamdulillahil-lazi ahyana ba\'da ma amatana wa ilayhin-nushur',
      translation: { en: 'All praise is for Allah who gave us life after causing us to die, and to Him is the return' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6312', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'entering-home',
    situation: { en: 'When entering your home', icon: '🏠' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ دَخَلْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا',
      transliteration: 'Bismillahi walajna wa bismillahi kharajna wa \'ala rabbina tawakkalna',
      translation: { en: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely' },
    },
    source: { type: 'hadith', reference: 'Muslim 2018', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'leaving-home',
    situation: { en: 'When leaving your home', icon: '🚪' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: 'Bismillah, tawakkaltu \'ala Allah, la hawla wa la quwwata illa billah',
      translation: { en: 'In the name of Allah, I put my trust in Allah, there is no power nor strength except with Allah' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3426', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'after-sneeze',
    situation: { en: 'After sneezing', icon: '🤧' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ',
      transliteration: 'Alhamdulillah',
      translation: { en: 'All praise is for Allah' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6224', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'hearing-sneeze',
    situation: { en: 'When someone else sneezes and says Alhamdulillah', icon: '👂' },
    dua: {
      arabic: 'يَرْحَمُكَ اللَّهُ',
      transliteration: 'Yarhamuk Allah',
      translation: { en: 'May Allah have mercy on you' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6224', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'before-wudu',
    situation: { en: 'Before starting wudu', icon: '💧' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: 'Bismillah',
      translation: { en: 'In the name of Allah' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 101', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'after-wudu',
    situation: { en: 'After completing wudu', icon: '💧' },
    dua: {
      arabic: 'أَشْهَدُ أَن لَّا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration: 'Ashhadu an la ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan \'abduhu wa rasuluh',
      translation: { en: 'I bear witness that there is no deity but Allah alone, He has no partner, and I bear witness that Muhammad is His servant and Messenger' },
    },
    source: { type: 'hadith', reference: 'Muslim 234', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'entering-masjid',
    situation: { en: 'When entering the masjid', icon: '🕌' },
    dua: {
      arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
      transliteration: 'Allahummaftah li abwaba rahmatik',
      translation: { en: 'O Allah, open for me the doors of Your mercy' },
    },
    source: { type: 'hadith', reference: 'Muslim 713', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'leaving-masjid',
    situation: { en: 'When leaving the masjid', icon: '🕌' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
      transliteration: 'Allahumma inni as\'aluka min fadlik',
      translation: { en: 'O Allah, I ask You from Your bounty' },
    },
    source: { type: 'hadith', reference: 'Muslim 713', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'seeing-good',
    situation: { en: 'When seeing something beautiful or good', icon: '✨' },
    dua: {
      arabic: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: 'Masha\'Allah la quwwata illa billah',
      translation: { en: 'What Allah wills, there is no power except with Allah' },
    },
    source: { type: 'hadith', reference: 'Ibn Majah 3509', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'feeling-worried',
    situation: { en: 'When feeling worried or sad', icon: '😟' },
    dua: {
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
      transliteration: 'La ilaha illallahul-\'Azimul-Halim, la ilaha illallah Rabbul-\'Arshil-\'Azim, la ilaha illallah Rabbus-samawati wa rabbul-ard wa Rabbul-\'Arshil-Karim',
      translation: { en: 'There is no deity but Allah, the Magnificent, the Forbearing; there is no deity but Allah, Lord of the Mighty Throne; there is no deity but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6345', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'traveling',
    situation: { en: 'When starting a journey', icon: '🚗' },
    dua: {
      arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
      transliteration: 'Subhanallazi sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila rabbina lamunqaliboon',
      translation: { en: 'Glory to Him who has subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we will return' },
    },
    source: { type: 'quran', reference: '43:13-14', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'wearing-clothes',
    situation: { en: 'When putting on new clothes', icon: '👕' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
      transliteration: 'Alhamdulillahil-lazi kasani hadhath-thawba wa razaqanihi min ghayri hawlin minni wa la quwwatin',
      translation: { en: 'All praise is for Allah who clothed me with this garment and provided it for me without any power or might from me' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 1767', needsVerification: true },
    difficulty: 'hard',
  },

  // ---------------------------------------------------------------------------
  // EASY — short everyday phrases
  // ---------------------------------------------------------------------------
  {
    id: 'entering-toilet',
    situation: { en: 'Before entering the toilet', icon: '🚽' },
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
      transliteration: 'A\'udhu billahi minal-khubuthi wal-khaba\'ith',
      translation: { en: 'I seek refuge with Allah from male and female devils' },
    },
    source: { type: 'hadith', reference: 'Bukhari 142', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'leaving-toilet',
    situation: { en: 'After leaving the toilet', icon: '🚿' },
    dua: {
      arabic: 'غُفْرَانَكَ',
      transliteration: 'Ghufranak',
      translation: { en: 'I ask You for Your forgiveness' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 30', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'before-drinking-milk',
    situation: { en: 'Before drinking a glass of milk', icon: '🥛' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
      transliteration: 'Bismillah. Allahumma barik lana fihi wa zidna minhu',
      translation: { en: 'In the name of Allah. O Allah, bless us in it and give us more of it' },
    },
    source: { type: 'hadith', reference: 'Ibn Majah 3322', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'eating-at-guests',
    situation: { en: 'After eating at someone\'s house', icon: '🏡' },
    dua: {
      arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
      transliteration: 'Allahumma barik lahum fima razaqtahum waghfir lahum warhamhum',
      translation: { en: 'O Allah, bless them in what You provided them, forgive them, and have mercy on them' },
    },
    source: { type: 'hadith', reference: 'Muslim (Book of Drinks)', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'forgot-bismillah',
    situation: { en: 'When you forgot Bismillah at the start of eating', icon: '🍽️' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
      transliteration: 'Bismillahi awwalahu wa akhirahu',
      translation: { en: 'In the name of Allah, at its beginning and its end' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 3767', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'breaking-fast',
    situation: { en: 'When breaking your fast', icon: '🌙' },
    dua: {
      arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
      transliteration: 'Dhahabadh-dhama\'u wabtallatil-\'uruqu wa thabatal-ajru inshaAllah',
      translation: { en: 'The thirst is gone, the veins are moistened, and the reward is certain, if Allah wills' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 2357', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'seeing-new-moon',
    situation: { en: 'When you see the new moon', icon: '🌒' },
    dua: {
      arabic: 'اللَّهُ أَكْبَرُ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ',
      transliteration: 'Allahu Akbar. Allahumma ahillahu \'alayna bil-yumni wal-iman was-salamati wal-islam',
      translation: { en: 'Allah is the Greatest. O Allah, bring it over us with blessing and faith, with safety and Islam' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3451', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'before-studying',
    situation: { en: 'Before learning or studying', icon: '📚' },
    dua: {
      arabic: 'رَبِّ زِدْنِي عِلْمًا',
      transliteration: 'Rabbi zidni \'ilma',
      translation: { en: 'My Lord, increase me in knowledge' },
    },
    source: { type: 'quran', reference: 'Qur\'an 20:114', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'before-reading-quran',
    situation: { en: 'Before reading the Quran', icon: '📖' },
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
      transliteration: 'A\'udhu billahi minash-shaytanir-rajim. Bismillahir-Rahmanir-Rahim',
      translation: { en: 'I seek refuge with Allah from the accursed Shaytan. In the name of Allah, the Most Merciful, the Especially Merciful' },
    },
    source: { type: 'quran', reference: 'Qur\'an 16:98', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'when-it-rains',
    situation: { en: 'When it rains', icon: '🌧️' },
    dua: {
      arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
      transliteration: 'Allahumma sayyiban nafi\'an',
      translation: { en: 'O Allah, (make it) a beneficial rain' },
    },
    source: { type: 'hadith', reference: 'Bukhari 1032', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'when-angry',
    situation: { en: 'When you feel angry', icon: '😠' },
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'A\'udhu billahi minash-shaytanir-rajim',
      translation: { en: 'I seek refuge with Allah from the accursed Shaytan' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6115', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'hasbunallah',
    situation: { en: 'When something scary happens', icon: '🛡️' },
    dua: {
      arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      transliteration: 'Hasbunallahu wa ni\'mal wakeel',
      translation: { en: 'Sufficient for us is Allah, and He is the best Disposer of affairs' },
    },
    source: { type: 'quran', reference: 'Qur\'an 3:173', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'visiting-sick',
    situation: { en: 'When visiting someone who is sick', icon: '🏥' },
    dua: {
      arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ',
      transliteration: 'La ba\'sa tahurun inshaAllah',
      translation: { en: 'No harm; it is a purification, if Allah wills' },
    },
    source: { type: 'hadith', reference: 'Bukhari 3616', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'dua-for-sick',
    situation: { en: 'Making dua for a sick person', icon: '🤲' },
    dua: {
      arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
      transliteration: 'As\'alullahal-\'Azima Rabbal-\'Arshil-\'Azim an yashfiyak',
      translation: { en: 'I ask Allah, the Mighty, Lord of the Mighty Throne, to cure you' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 2075', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'in-ruku',
    situation: { en: 'Bowing in ruku during prayer', icon: '🕌' },
    dua: {
      arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      transliteration: 'Subhana Rabbiyal-\'Azim',
      translation: { en: 'Glory is to my Lord, the Magnificent' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 869', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'in-sujud',
    situation: { en: 'Prostrating in sujud during prayer', icon: '🕌' },
    dua: {
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
      transliteration: 'Subhana Rabbiyal-A\'la',
      translation: { en: 'Glory is to my Lord, the Most High' },
    },
    source: { type: 'hadith', reference: 'Muslim 482', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'after-prayer',
    situation: { en: 'After finishing the prayer', icon: '🕌' },
    dua: {
      arabic: 'أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
      transliteration: 'Astaghfirullah. Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram',
      translation: { en: 'I seek Allah\'s forgiveness. O Allah, You are Peace and from You is peace; blessed are You, O Possessor of majesty and honor' },
    },
    source: { type: 'hadith', reference: 'Muslim 591', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'jazakallah',
    situation: { en: 'Thanking someone who helped you', icon: '🤝' },
    dua: {
      arabic: 'جَزَاكَ اللَّهُ خَيْرًا',
      transliteration: 'Jazakallahu khairan',
      translation: { en: 'May Allah reward you with good' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 2034', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'for-parents',
    situation: { en: 'Making dua for your parents', icon: '👨‍👩‍👧‍👦' },
    dua: {
      arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: 'Rabbirhamhuma kama rabbayani saghira',
      translation: { en: 'My Lord, have mercy on them as they raised me when I was small' },
    },
    source: { type: 'quran', reference: 'Qur\'an 17:24', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'repentance-dua',
    situation: { en: 'When you make a mistake and want to repent', icon: '🧎' },
    dua: {
      arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
      transliteration: 'Rabbighfir li wa tub \'alayya innaka antat-tawwabur-rahim',
      translation: { en: 'My Lord, forgive me and accept my repentance, for You are the Accepter of Repentance, the Most Merciful' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3434', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'good-news',
    situation: { en: 'When you hear good news', icon: '🎉' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
      transliteration: 'Alhamdulillahil-ladhi bini\'matihi tatimmus-salihat',
      translation: { en: 'All praise is for Allah, by whose blessing good things are accomplished' },
    },
    source: { type: 'hadith', reference: 'Ibn Majah 3803', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'accept-my-deed',
    situation: { en: 'After giving charity or doing a good deed', icon: '🎁' },
    dua: {
      arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'Rabbana taqabbal minna innaka antas-sami\'ul-\'alim',
      translation: { en: 'Our Lord, accept from us; indeed You are the All-Hearing, the All-Knowing' },
    },
    source: { type: 'quran', reference: 'Qur\'an 2:127', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'amazement-subhanallah',
    situation: { en: 'When you are amazed by Allah\'s creation', icon: '🌟' },
    dua: {
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
      transliteration: 'Subhanallahi wa bihamdihi',
      translation: { en: 'Glory is to Allah and praise' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6406', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'mirror-dua',
    situation: { en: 'When you look in the mirror', icon: '🪞' },
    dua: {
      arabic: 'اللَّهُمَّ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
      transliteration: 'Allahumma hassanta khalqi fahassin khuluqi',
      translation: { en: 'O Allah, as You made my appearance good, make my character good too' },
    },
    source: { type: 'hadith', reference: 'Ibn Hibban (hasan chain)', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'la-hawla',
    situation: { en: 'When something is too hard for you alone', icon: '💪' },
    dua: {
      arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: 'La hawla wa la quwwata illa billah',
      translation: { en: 'There is no power nor strength except with Allah' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6476', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'rabbana-amanna',
    situation: { en: 'When you want Allah\'s mercy', icon: '🥰' },
    dua: {
      arabic: 'رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الرَّاحِمِينَ',
      transliteration: 'Rabbana amanna faghfir lana warhamna wa anta khayrur-rahimin',
      translation: { en: 'Our Lord, we have believed, so forgive us and have mercy on us, for You are the best of the merciful' },
    },
    source: { type: 'quran', reference: 'Qur\'an 23:109', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'zalamna-anfusa',
    situation: { en: 'When you did something wrong and feel sorry', icon: '🧡' },
    dua: {
      arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
      transliteration: 'Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin',
      translation: { en: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers' },
    },
    source: { type: 'quran', reference: 'Qur\'an 7:23', needsVerification: true },
    difficulty: 'easy',
  },
  {
    id: 'tawwabina',
    situation: { en: 'After wudu — asking Allah for purity', icon: '💧' },
    dua: {
      arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
      transliteration: 'Allahumma ij\'alni minat-tawwabina waj\'alni minal-mutatahhirin',
      translation: { en: 'O Allah, make me among those who repent and among those who purify themselves' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 55', needsVerification: true },
    difficulty: 'easy',
  },

  // ---------------------------------------------------------------------------
  // MEDIUM — phrases for daily situations
  // ---------------------------------------------------------------------------
  {
    id: 'ease-in-speech',
    situation: { en: 'When you have to present or speak in front of others', icon: '🗣️' },
    dua: {
      arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
      transliteration: 'Rabbish-rah li sadri wa yassir li amri wahlul \'uqdatam-min lisani yafqahu qawli',
      translation: { en: 'My Lord, expand my chest and make my task easy, and untie the knot from my tongue so they understand my speech' },
    },
    source: { type: 'quran', reference: 'Qur\'an 20:25-28', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'entering-market',
    situation: { en: 'When you enter the market or shops', icon: '🛒' },
    dua: {
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, yuhyi wa yumitu wa huwa hayyun la yamutu, biyadihil-khayru wa huwa \'ala kulli shay\'in qadir',
      translation: { en: 'There is no god but Allah alone, with no partner; His is the dominion and His is the praise; He gives life and death and He is Alive and never dies; in His hand is all good, and He has power over all things' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3428', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'after-adhan',
    situation: { en: 'After hearing the adhan', icon: '🔔' },
    dua: {
      arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
      transliteration: 'Allahumma rabba hadhihid-da\'watit-tammah was-salatil-qa\'imah, ati Muhammadan al-wasilata wal-fadilah, wab\'athhu maqamam-mahmudanil-ladhi wa\'adtah',
      translation: { en: 'O Allah, Lord of this perfect call and the established prayer, grant Muhammad the wasilah and the excellence, and raise him to the praised station You promised him' },
    },
    source: { type: 'hadith', reference: 'Bukhari 614', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'hearing-thunder',
    situation: { en: 'When you hear thunder', icon: '⛈️' },
    dua: {
      arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
      transliteration: 'Subhanalladhi yusabbihur-ra\'du bihamdihi wal-mala\'ikatu min khifatih',
      translation: { en: 'Glory is to Him whom the thunder glorifies with His praise, and the angels out of fear of Him' },
    },
    source: { type: 'hadith', reference: 'Al-Muwatta (Ibn \'Umar)', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'strong-wind',
    situation: { en: 'When the wind blows strongly', icon: '🌬️' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
      transliteration: 'Allahumma inni as\'aluka khayraha wa khayra ma fiha wa khayra ma ursilat bihi, wa a\'udhu bika min sharriha wa sharri ma fiha wa sharri ma ursilat bihi',
      translation: { en: 'O Allah, I ask You for its good and the good of what is in it and the good it was sent with; and I seek refuge with You from its evil and the evil of what is in it and the evil it was sent with' },
    },
    source: { type: 'hadith', reference: 'Ibn Majah 3727', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'bad-dream',
    situation: { en: 'When you wake up from a bad dream', icon: '😰' },
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ وَمِنْ شَرِّ مَا رَأَيْتُ',
      transliteration: 'A\'udhu billahi minash-shaytan wa min sharri ma ra\'ayt',
      translation: { en: 'I seek refuge with Allah from Shaytan and from the evil of what I saw' },
    },
    source: { type: 'hadith', reference: 'Bukhari 3292', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'anxious-dua',
    situation: { en: 'When you feel anxious and need help', icon: '🥵' },
    dua: {
      arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
      transliteration: 'Ya Hayyu ya Qayyumu birahmatika astaghith',
      translation: { en: 'O Ever-Living, O Self-Sustaining, by Your mercy I seek help' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3524', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'when-in-pain',
    situation: { en: 'When part of your body hurts', icon: '🤕' },
    dua: {
      arabic: 'بِسْمِ اللَّهِ، أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
      transliteration: 'Bismillah. A\'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir',
      translation: { en: 'In the name of Allah. I seek refuge with Allah and His power from the evil of what I find and fear' },
    },
    source: { type: 'hadith', reference: 'Muslim 2202', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'starting-prayer',
    situation: { en: 'When you start the prayer', icon: '🕌' },
    dua: {
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
      transliteration: 'Subhanaka Allahumma wa bihamdika wa tabarakasmuka wa ta\'ala jadduka wa la ilaha ghayruk',
      translation: { en: 'Glory is to You O Allah and praise; blessed is Your name and exalted is Your majesty, and there is no god but You' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 775', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'after-tashahhud',
    situation: { en: 'Before the final salam in prayer', icon: '🕌' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ جَهَنَّمَ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
      transliteration: 'Allahumma inni a\'udhu bika min \'adhabil-qabr wa min \'adhabi jahannam wa min fitnatil-mahya wal-mamat wa min sharri fitnatil-masihid-dajjal',
      translation: { en: 'O Allah, I seek refuge with You from the punishment of the grave, the punishment of Hellfire, the trials of life and death, and the trial of the False Messiah' },
    },
    source: { type: 'hadith', reference: 'Bukhari 1377', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'salawat-friday',
    situation: { en: 'On Friday — sending blessings on the Prophet ﷺ', icon: '🕌' },
    dua: {
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
      transliteration: 'Allahumma salli \'ala Muhammad wa \'ala ali Muhammad kama sallayta \'ala Ibrahim wa \'ala ali Ibrahim innaka Hamidun Majid',
      translation: { en: 'O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim; indeed You are Praiseworthy, Glorious' },
    },
    source: { type: 'hadith', reference: 'Bukhari 3370', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'salawat-when-mentioned',
    situation: { en: 'When you hear the name of the Prophet ﷺ', icon: '💛' },
    dua: {
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      transliteration: 'Allahumma salli \'ala Muhammad',
      translation: { en: 'O Allah, send blessings upon Muhammad' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3413', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'returning-from-travel',
    situation: { en: 'When you return home from a journey', icon: '🏠' },
    dua: {
      arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
      transliteration: 'Ayibuna, ta\'ibuna, \'abiduna, li-Rabbina hamidun',
      translation: { en: 'We are returning, repenting, worshipping, and praising our Lord' },
    },
    source: { type: 'hadith', reference: 'Muslim 1927', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'staying-somewhere-new',
    situation: { en: 'When you stay somewhere new', icon: '🏨' },
    dua: {
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'A\'udhu bikalimatillahit-tammati min sharri ma khalaq',
      translation: { en: 'I seek refuge with the perfect words of Allah from the evil of what He has created' },
    },
    source: { type: 'hadith', reference: 'Muslim 2708', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'when-calamity',
    situation: { en: 'When something sad or difficult happens', icon: '💔' },
    dua: {
      arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
      transliteration: 'Inna lillahi wa inna ilayhi raji\'un. Allahumma\'jurni fi musibati wa akhlif li khayran minha',
      translation: { en: 'Indeed we belong to Allah and to Him we return. O Allah, reward me in my affliction and give me something better in its place' },
    },
    source: { type: 'hadith', reference: 'Muslim 918', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'all-conditions-praise',
    situation: { en: 'When things do not go your way', icon: '🙏' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ',
      transliteration: 'Alhamdulillah \'ala kulli hal',
      translation: { en: 'All praise is for Allah in every situation' },
    },
    source: { type: 'hadith', reference: 'Authentic (hasan) — al-Adhkar, Ibn al-Sunni', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'gratitude-dua',
    situation: { en: 'When you want to be more grateful', icon: '🙌' },
    dua: {
      arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      transliteration: 'Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik',
      translation: { en: 'O Allah, help me to remember You, thank You, and worship You well' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 1522', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'both-worlds',
    situation: { en: 'When you ask for good in this world and the next', icon: '🌍' },
    dua: {
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina \'adhaban-nar',
      translation: { en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire' },
    },
    source: { type: 'quran', reference: 'Qur\'an 2:201', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'asking-jannah',
    situation: { en: 'When you ask Allah for Paradise', icon: '🌈' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ',
      transliteration: 'Allahumma inni as\'alukal-Jannah wa a\'udhu bika minan-nar',
      translation: { en: 'O Allah, I ask You for Paradise and seek refuge with You from the Fire' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 5079', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'morning-dhikr',
    situation: { en: 'When you begin your morning', icon: '🌅' },
    dua: {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'Asbahna wa asbahal-mulku lillah wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah',
      translation: { en: 'We have entered the morning and the dominion belongs to Allah; all praise is for Allah; there is no god but Allah alone, with no partner' },
    },
    source: { type: 'hadith', reference: 'Muslim 2723', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'evening-dhikr',
    situation: { en: 'When the evening comes', icon: '🌇' },
    dua: {
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      transliteration: 'Amsayna wa amsal-mulku lillah wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah',
      translation: { en: 'We have entered the evening and the dominion belongs to Allah; all praise is for Allah; there is no god but Allah alone, with no partner' },
    },
    source: { type: 'hadith', reference: 'Muslim 2723', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'before-sleep-counting',
    situation: { en: 'Counting praises before sleep', icon: '😴' },
    dua: {
      arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ — ٣٣، ٣٣، ٣٤',
      transliteration: 'SubhanAllah, Alhamdulillah, Allahu Akbar (33, 33, 34)',
      translation: { en: 'Glory to Allah, praise to Allah, Allah is Greatest — better than a servant and everything he owns' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6318', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'entrust-traveler',
    situation: { en: 'When someone you love travels', icon: '🧳' },
    dua: {
      arabic: 'أَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ',
      transliteration: 'Astawdi\'ullaha dinaka wa amanataka wa khawatima \'amalik',
      translation: { en: 'I entrust Allah with your religion, your trust, and the end of your deeds' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3443', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'steadfastness',
    situation: { en: 'When you want to stay firm in your faith', icon: '💓' },
    dua: {
      arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
      transliteration: 'Ya Muqallibal-qulub, thabbit qalbi \'ala dinik',
      translation: { en: 'O Turner of hearts, make my heart firm upon Your religion' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3522', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'la-sahla',
    situation: { en: 'When something feels difficult', icon: '🎯' },
    dua: {
      arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
      transliteration: 'Allahumma la sahla illa ma ja\'altahu sahla, wa anta taj\'alul-hazna idha shi\'ta sahla',
      translation: { en: 'O Allah, nothing is easy except what You make easy, and You make the difficult easy if You will' },
    },
    source: { type: 'hadith', reference: 'Ibn Hibban 974', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'do-not-deviate',
    situation: { en: 'When you feel lost or confused', icon: '🔍' },
    dua: {
      arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
      transliteration: 'Rabbana la tuzigh qulubana ba\'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-wahhab',
      translation: { en: 'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself; indeed You are the Bestower' },
    },
    source: { type: 'quran', reference: 'Qur\'an 3:8', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'love-of-allah',
    situation: { en: 'When you ask Allah for His love', icon: '❤️' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ وَحُبَّ مَنْ يُحِبُّكَ وَالْعَمَلَ الَّذِي يُبَلِّغُنِي حُبَّكَ',
      transliteration: 'Allahumma inni as\'aluka hubbaka wa hubba man yuhibbuka wal-\'amalal-ladhi yuballighuni hubbak',
      translation: { en: 'O Allah, I ask You for Your love and the love of those who love You, and the deeds that bring me to Your love' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3490', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'forget-or-err',
    situation: { en: 'When you forget or make a mistake', icon: '😅' },
    dua: {
      arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا',
      transliteration: 'Rabbana la tu\'akhidhna in nasina aw akhta\'na',
      translation: { en: 'Our Lord, do not hold us accountable if we forget or err' },
    },
    source: { type: 'quran', reference: 'Qur\'an 2:286', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'patience-dua',
    situation: { en: 'When you need patience', icon: '🧘' },
    dua: {
      arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
      transliteration: 'Rabbana afrigh \'alayna sabran wa thabbit aqdamana',
      translation: { en: 'Our Lord, pour upon us patience and make our feet firm' },
    },
    source: { type: 'quran', reference: 'Qur\'an 2:250', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'fasting-insult',
    situation: { en: 'When you are fasting and someone is rude to you', icon: '🌙' },
    dua: {
      arabic: 'إِنِّي صَائِمٌ، إِنِّي صَائِمٌ',
      transliteration: 'Inni sa\'im, inni sa\'im',
      translation: { en: 'I am fasting, I am fasting' },
    },
    source: { type: 'hadith', reference: 'Bukhari 1894', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'protection-children',
    situation: { en: 'When you seek protection for a little one', icon: '👶' },
    dua: {
      arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
      transliteration: 'U\'idhukuma bikalimatillahit-tammati min kulli shaytanin wa hammah wa min kulli \'aynin lammah',
      translation: { en: 'I seek protection for you with the perfect words of Allah from every devil and pest, and from every harmful eye' },
    },
    source: { type: 'hadith', reference: 'Bukhari 3371', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'love-reply',
    situation: { en: 'When someone says: I love you for Allah\'s sake', icon: '💞' },
    dua: {
      arabic: 'أَحَبَّكَ الَّذِي أَحْبَبْتَنِي لَهُ',
      transliteration: 'Ahabbakalladhi ahbabtani lahu',
      translation: { en: 'May the One for whose sake you love me love you' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 5125', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'seeing-someone-in-difficulty',
    situation: { en: 'When you see someone who is ill or in difficulty', icon: '🤒' },
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا',
      transliteration: 'Alhamdulillahil-ladhi \'afani mimma ibtalaka bihi wa faddalani \'ala kathirim mimman khalaqa tafdila',
      translation: { en: 'All praise is for Allah who saved me from what He tested you with, and favored me over many of His creation' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3432', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'afwa-wal-afiyah',
    situation: { en: 'When you ask for pardon and well-being', icon: '🛡️' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      transliteration: 'Allahumma inni as\'alukal-\'afwa wal-\'afiyah fid-dunya wal-akhirah',
      translation: { en: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 5074', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'ham-wa-hazan',
    situation: { en: 'When you feel worried or lazy', icon: '😔' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ',
      transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn',
      translation: { en: 'O Allah, I seek refuge with You from worry and grief, weakness and laziness, stinginess and cowardice' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6369', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'heavy-scales',
    situation: { en: 'When you want heavy rewards on your scales', icon: '⚖️' },
    dua: {
      arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
      transliteration: 'Subhanallahi wa bihamdihi, Subhanallahil-\'Azim',
      translation: { en: 'Glory is to Allah and praise; glory is to Allah the Magnificent — two phrases light on the tongue, heavy on the scales' },
    },
    source: { type: 'hadith', reference: 'Bukhari 6406', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'kaffarat-majlis',
    situation: { en: 'When you leave a gathering or class', icon: '🪑' },
    dua: {
      arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
      transliteration: 'Subhanaka Allahumma wa bihamdika, ashhadu an la ilaha illa anta, astaghfiruka wa atubu ilayk',
      translation: { en: 'Glory is to You O Allah and praise; I bear witness that there is no god but You; I seek Your forgiveness and repent to You' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 4859', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'hab-lana-rahmatan',
    situation: { en: 'When you start something new', icon: '🕊️' },
    dua: {
      arabic: 'رَبَّنَا هَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
      transliteration: 'Rabbana hab lana min ladunka rahmah wa hayyi\' lana min amrina rashada',
      translation: { en: 'Our Lord, grant us mercy from Yourself and prepare for us right guidance in our affair' },
    },
    source: { type: 'quran', reference: 'Qur\'an 18:10', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'awzi-ni',
    situation: { en: 'When you want to thank Allah for your blessings', icon: '🌸' },
    dua: {
      arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
      transliteration: 'Rabbi awzi\'ni an ashkura ni\'matakal-lati an\'amta \'alayya wa \'ala walidayya wa an a\'mala salihan tardah',
      translation: { en: 'My Lord, enable me to be grateful for Your favor which You bestowed on me and on my parents, and to do righteous deeds You approve' },
    },
    source: { type: 'quran', reference: 'Qur\'an 27:19', needsVerification: true },
    difficulty: 'medium',
  },
  {
    id: 'faqir-dua',
    situation: { en: 'When you are in need of Allah\'s help', icon: '🤲' },
    dua: {
      arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
      transliteration: 'Rabbi inni lima anzalta ilayya min khayrin faqir',
      translation: { en: 'My Lord, indeed I am in need of whatever good You send down to me' },
    },
    source: { type: 'quran', reference: 'Qur\'an 28:24', needsVerification: true },
    difficulty: 'medium',
  },

  // ---------------------------------------------------------------------------
  // HARD — longer or deeper supplications
  // ---------------------------------------------------------------------------
  {
    id: 'waking-at-night',
    situation: { en: 'When you wake up in the middle of the night', icon: '🌙' },
    dua: {
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
      transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir. SubhanAllahi wal-hamdu lillah wa la ilaha illallahu wallahu Akbar, wa la hawla wa la quwwata illa billahil-\'Aliyyil-\'Azim',
      translation: { en: 'There is no god but Allah alone with no partner; His is the dominion and His is the praise, and He has power over all things. Glory to Allah, praise to Allah, there is no god but Allah, Allah is Greatest, and there is no power nor strength except with Allah the Most High, the Magnificent' },
    },
    source: { type: 'hadith', reference: 'Bukhari 1154', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'laylatul-qadr',
    situation: { en: 'On the night of Laylatul Qadr', icon: '✨' },
    dua: {
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: 'Allahumma innaka \'afuwwun tuhibbul-\'afwa fa\'fu \'anni',
      translation: { en: 'O Allah, You are Forgiving and love forgiveness, so forgive me' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3513', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'pride-refuge',
    situation: { en: 'When you want to keep your deeds sincere', icon: '😌' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ',
      transliteration: 'Allahumma inni a\'udhu bika an ushrika bika wa ana a\'lam, wa astaghfiruka lima la a\'lam',
      translation: { en: 'O Allah, I seek refuge with You from associating partners with You knowingly, and I seek Your forgiveness for what I do not know' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 4850', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'zamzam-dua',
    situation: { en: 'When you drink Zamzam water', icon: '💧' },
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
      transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'an wa rizqan wasi\'an wa shifa\'an min kulli da\'',
      translation: { en: 'O Allah, I ask You for beneficial knowledge, plentiful provision, and cure from every illness' },
    },
    source: { type: 'hadith', reference: 'Ibn Majah 3062', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'guidance-qunut',
    situation: { en: 'When you ask Allah to guide you', icon: '🧭' },
    dua: {
      arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ',
      transliteration: 'Allahumma ihdini fiman hadayta wa \'afini fiman \'afayta wa tawallani fiman tawallayta',
      translation: { en: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, and take me into Your care among those You have taken into Your care' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 464', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'arafah-dhikr',
    situation: { en: 'On the Day of Arafah', icon: '🕋' },
    dua: {
      arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir',
      translation: { en: 'There is no god but Allah alone, with no partner; His is the dominion and His is the praise, and He has power over all things' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3585', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'passing-graveyard',
    situation: { en: 'When you pass by a graveyard', icon: '🌿' },
    dua: {
      arabic: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ',
      transliteration: 'As-salamu \'alaykum ahlad-diyari minal-mu\'minin, wa inna inshaAllahu bikum lahiqun',
      translation: { en: 'Peace be upon you, inhabitants of these dwellings from the believers; and indeed, if Allah wills, we will join you' },
    },
    source: { type: 'hadith', reference: 'Muslim 975', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'afini-badani',
    situation: { en: 'When you ask Allah for health', icon: '👁️' },
    dua: {
      arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ',
      transliteration: 'Allahumma \'afini fi badani, Allahumma \'afini fi sam\'i, Allahumma \'afini fi basari, la ilaha illa anta',
      translation: { en: 'O Allah, grant my body well-being; O Allah, grant my hearing well-being; O Allah, grant my sight well-being; there is no god but You' },
    },
    source: { type: 'hadith', reference: 'Abu Dawud 5090', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'fitnatil-qawm',
    situation: { en: 'When unfair people surround you', icon: '⚖️' },
    dua: {
      arabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ',
      transliteration: 'Rabbana la taj\'alna fitnatan lil-qawmiz-zalimin, wa najjina birahmatika minal-qawmil-kafirin',
      translation: { en: 'Our Lord, do not make us a trial for the wrongdoing people, and save us by Your mercy from the disbelieving people' },
    },
    source: { type: 'quran', reference: 'Qur\'an 10:85-86', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'fawwadtu',
    situation: { en: 'When you do not know what to do', icon: '🤷' },
    dua: {
      arabic: 'أُفَوِّضُ أَمْرِي إِلَى اللَّهِ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ',
      transliteration: 'Ufawwidu amri ilallah, innallaha basirun bil-\'ibad',
      translation: { en: 'I entrust my affair to Allah; indeed Allah is All-Seeing of His servants' },
    },
    source: { type: 'quran', reference: 'Qur\'an 40:44', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'yunus-dua',
    situation: { en: 'When you are in trouble and need rescue', icon: '🐟' },
    dua: {
      arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
      translation: { en: 'There is no god but You; glory is to You; indeed I have been among the wrongdoers' },
    },
    source: { type: 'quran', reference: 'Qur\'an 21:87', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'maghlubun',
    situation: { en: 'When you feel overwhelmed', icon: '🌊' },
    dua: {
      arabic: 'رَبِّ إِنِّي مَغْلُوبٌ فَانْتَصِرْ',
      transliteration: 'Rabbi inni maghlubun fantasir',
      translation: { en: 'My Lord, indeed I am overpowered, so help me' },
    },
    source: { type: 'quran', reference: 'Qur\'an 54:10', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'hamazatish-shayatin',
    situation: { en: 'When Shaytan whispers bad thoughts', icon: '👿' },
    dua: {
      arabic: 'رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَنْ يَحْضُرُونِ',
      transliteration: 'Rabbi a\'udhu bika min hamazatish-shayatin, wa a\'udhu bika Rabbi an yahdurun',
      translation: { en: 'My Lord, I seek refuge with You from the incitements of the devils, and I seek refuge with You, my Lord, lest they be present with me' },
    },
    source: { type: 'quran', reference: 'Qur\'an 23:97-98', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'hasbiyallah',
    situation: { en: 'When you fear people or harm', icon: '🏔️' },
    dua: {
      arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      transliteration: 'Hasbiyallahu la ilaha illa huwa \'alayhi tawakkaltu wa huwa Rabbul-\'Arshil-\'Azim',
      translation: { en: 'Allah is sufficient for me; there is no god but Him; upon Him I rely, and He is the Lord of the Mighty Throne' },
    },
    source: { type: 'hadith', reference: 'Tirmidhi 3345 (seven times morning and evening)', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'muqim-salah',
    situation: { en: 'When you want to keep praying well', icon: '🕌' },
    dua: {
      arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
      transliteration: 'Rabbij\'alni muqimas-salah wa min dhurriyati, Rabbana wa taqabbal du\'a\'',
      translation: { en: 'My Lord, make me an establisher of prayer and from my descendants; our Lord, accept my supplication' },
    },
    source: { type: 'quran', reference: 'Qur\'an 14:40', needsVerification: true },
    difficulty: 'hard',
  },
  {
    id: 'najjini',
    situation: { en: 'When you need to get away from a bad situation', icon: '🚪' },
    dua: {
      arabic: 'رَبِّ نَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ',
      transliteration: 'Rabbi najjini minal-qawmiz-zalimin',
      translation: { en: 'My Lord, save me from the wrongdoing people' },
    },
    source: { type: 'quran', reference: 'Qur\'an 28:21', needsVerification: true },
    difficulty: 'hard',
  },
];

export function getDuaMomentItems(count: number, difficulty?: 'easy' | 'medium' | 'hard'): DuaMomentItem[] {
  let filtered = [...DUA_MOMENT_ITEMS];
  if (difficulty) {
    filtered = filtered.filter(s => s.difficulty === difficulty);
  }
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
