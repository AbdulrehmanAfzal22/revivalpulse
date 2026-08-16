"use strict";
/**
 * Dua for the Moment: situations and their matching duas for kids.
 * Practical application of daily supplications.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuaMomentItems = exports.DUA_MOMENT_ITEMS = void 0;
exports.DUA_MOMENT_ITEMS = [
    {
        id: 'before-eating',
        situation: { en: 'Before eating a meal', icon: '🍽️' },
        dua: {
            arabic: 'بِسْمِ اللَّهِ',
            transliteration: 'Bismillah',
            translation: { en: 'In the name of Allah' },
        },
        source: { type: 'hadith', reference: 'Bukhari 5376', needsVerification: true },
        difficulty: 'easy',
    },
    {
        id: 'after-eating',
        situation: { en: 'After finishing a meal', icon: '🍽️' },
        dua: {
            arabic: 'الْحَمْدُ لِلَّهِ',
            transliteration: 'Alhamdulillah',
            translation: { en: 'All praise is for Allah' },
        },
        source: { type: 'hadith', reference: 'Muslim 2734', needsVerification: true },
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
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
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
            arabic: 'بِسْمِ اللَّهِ دَخَلْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا',
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
            arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
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
            arabic: 'يَرْحَمُكَ اللَّهُ',
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
            arabic: 'بِسْمِ اللَّهِ',
            transliteration: 'Bismillah',
            translation: { en: 'In the name of Allah' },
        },
        source: { type: 'hadith', reference: 'Tirmidhi 55', needsVerification: true },
        difficulty: 'easy',
    },
    {
        id: 'after-wudu',
        situation: { en: 'After completing wudu', icon: '💧' },
        dua: {
            arabic: 'أَشْهَدُ أَن لَّا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
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
            arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
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
            arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
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
            arabic: 'مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ',
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
            arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
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
            arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
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
            arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
            transliteration: 'Alhamdulillahil-lazi kasani hadhath-thawba wa razaqanihi min ghayri hawlin minni wa la quwwatin',
            translation: { en: 'All praise is for Allah who clothed me with this garment and provided it for me without any power or might from me' },
        },
        source: { type: 'hadith', reference: 'Tirmidhi 1767', needsVerification: true },
        difficulty: 'hard',
    },
];
function getDuaMomentItems(count, difficulty) {
    let filtered = [...exports.DUA_MOMENT_ITEMS];
    if (difficulty) {
        filtered = filtered.filter(s => s.difficulty === difficulty);
    }
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
exports.getDuaMomentItems = getDuaMomentItems;
