import type { HadithBook } from 'types/hadith.types';

/**
 * Book metadata only — hadith text is fetched on demand (too large to bundle,
 * ~66MB across all 11 books). Source: AhmedBaset/hadith-json @v1.2.0, a
 * single consistently-scraped dataset so chapter/hadith numbering stays
 * aligned within a book. Verified live (id, hadith counts, titles, authors).
 *
 * Mishkat al-Masabih is included ("if available" per the brief) — it's on
 * this source. Urdu translation is not: no source here has it, and merging
 * a different Urdu dataset by hadith number was checked and rejected —
 * counts diverge from this source part way through at least one book
 * (Bukhari: 7277 here vs 7589 there), which would silently misalign text.
 */
export const HADITH_BOOKS: HadithBook[] = [
  {
    id: 1,
    slug: 'bukhari',
    sourcePath: 'the_9_books/bukhari.json',
    nameArabic: 'صحيح البخاري',
    nameEnglish: 'Sahih al-Bukhari',
    authorArabic: 'الإمام محمد بن إسماعيل البخاري',
    authorEnglish: 'Imam Muhammad ibn Ismail al-Bukhari',
    totalHadiths: 7277,
  },
  {
    id: 2,
    slug: 'muslim',
    sourcePath: 'the_9_books/muslim.json',
    nameArabic: 'صحيح مسلم',
    nameEnglish: 'Sahih Muslim',
    authorArabic: 'الإمام مسلم بن الحجاج القشيري النيسابوري',
    authorEnglish: 'Imam Muslim ibn al-Hajjaj al-Naysaburi',
    totalHadiths: 7459,
  },
  {
    id: 4,
    slug: 'abudawud',
    sourcePath: 'the_9_books/abudawud.json',
    nameArabic: 'سنن أبي داود',
    nameEnglish: 'Sunan Abi Dawud',
    authorArabic: 'الإمام سليمان بن الأشعث أبو داود السجستاني',
    authorEnglish: "Imam Sulayman ibn al-Ash'ath Abu Dawud al-Sijistani",
    totalHadiths: 5276,
  },
  {
    id: 5,
    slug: 'tirmidhi',
    sourcePath: 'the_9_books/tirmidhi.json',
    nameArabic: 'جامع الترمذي',
    nameEnglish: "Jami' al-Tirmidhi",
    authorArabic: 'الإمام أبو عيسى محمد بن عيسى الترمذي',
    authorEnglish: 'Imam Abu Isa Muhammad ibn Isa al-Tirmidhi',
    totalHadiths: 4053,
  },
  {
    id: 3,
    slug: 'nasai',
    sourcePath: 'the_9_books/nasai.json',
    nameArabic: 'سنن النسائي',
    nameEnglish: "Sunan al-Nasa'i",
    authorArabic: 'الإمام أبو عبد الرحمن أحمد بن شعيب النسائي',
    authorEnglish: "Imam Ahmad ibn Shu'ayb al-Nasa'i",
    totalHadiths: 5768,
  },
  {
    id: 6,
    slug: 'ibnmajah',
    sourcePath: 'the_9_books/ibnmajah.json',
    nameArabic: 'سنن ابن ماجه',
    nameEnglish: 'Sunan Ibn Majah',
    authorArabic: 'الإمام محمد بن يزيد بن ماجه القزويني',
    authorEnglish: 'Imam Muhammad ibn Yazid Ibn Majah al-Qazwini',
    totalHadiths: 4345,
  },
  {
    id: 7,
    slug: 'malik',
    sourcePath: 'the_9_books/malik.json',
    nameArabic: 'موطأ مالك',
    nameEnglish: 'Muwatta Malik',
    authorArabic: 'الإمام مالك بن أنس',
    authorEnglish: 'Imam Malik ibn Anas',
    totalHadiths: 1985,
  },
  {
    id: 13,
    slug: 'riyad_assalihin',
    sourcePath: 'other_books/riyad_assalihin.json',
    nameArabic: 'رياض الصالحين',
    nameEnglish: 'Riyad as-Salihin',
    authorArabic: 'الإمام يحيى بن شرف النووي',
    authorEnglish: 'Imam Yahya ibn Sharaf al-Nawawi',
    totalHadiths: 1896,
  },
  {
    id: 17,
    slug: 'bulugh_almaram',
    sourcePath: 'other_books/bulugh_almaram.json',
    nameArabic: 'بلوغ المرام',
    nameEnglish: 'Bulugh al-Maram',
    authorArabic: 'الإمام ابن حجر العسقلاني',
    authorEnglish: 'Ibn Hajar al-Asqalani',
    totalHadiths: 1767,
  },
  {
    id: 14,
    slug: 'mishkat_almasabih',
    sourcePath: 'other_books/mishkat_almasabih.json',
    nameArabic: 'مشكاة المصابيح',
    nameEnglish: 'Mishkat al-Masabih',
    authorArabic: 'الإمام الكاتب التبريزي',
    authorEnglish: 'Al-Khatib Al-Tabrizi',
    totalHadiths: 4428,
  },
  {
    id: 10,
    slug: 'nawawi40',
    sourcePath: 'forties/nawawi40.json',
    nameArabic: 'الأربعون النووية',
    nameEnglish: 'The Forty Hadith of Imam Nawawi',
    authorArabic: 'الإمام يحيى بن شرف النووي',
    authorEnglish: 'Imam Yahya ibn Sharaf al-Nawawi',
    totalHadiths: 42,
  },
];
