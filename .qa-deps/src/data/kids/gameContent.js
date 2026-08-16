"use strict";
/**
 * Study content for the kids games (all game engines).
 *
 * Every item has two "sides": `face` (the thing to learn, rendered big and
 * in Arabic where applicable) and `name` (the English label it must be
 * matched to). No figurative depictions — text tiles only.
 *
 * `order` feeds the ordering games (alphabet, counting, spelling order).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KIDS_BUILDABLE_WORDS = exports.KIDS_STUDY_SETS = exports.KIDS_STUDY_WORDS = exports.KIDS_STUDY_NUMBERS = exports.KIDS_STUDY_LETTERS = void 0;
/** The 28 Arabic letters, letter ↔ name. `dots` = has tashkeel dots above/below. */
exports.KIDS_STUDY_LETTERS = [
    { id: 'alif', face: 'ا', name: 'Alif', order: 1, category: 'no-dots' },
    { id: 'ba', face: 'ب', name: 'Ba', order: 2, category: 'dots' },
    { id: 'ta', face: 'ت', name: 'Ta', order: 3, category: 'dots' },
    { id: 'tha', face: 'ث', name: 'Tha', order: 4, category: 'dots' },
    { id: 'jim', face: 'ج', name: 'Jim', order: 5, category: 'dots' },
    { id: 'ha', face: 'ح', name: 'Ha', order: 6, category: 'no-dots' },
    { id: 'kha', face: 'خ', name: 'Kha', order: 7, category: 'dots' },
    { id: 'dal', face: 'د', name: 'Dal', order: 8, category: 'no-dots' },
    { id: 'dhal', face: 'ذ', name: 'Dhal', order: 9, category: 'dots' },
    { id: 'ra', face: 'ر', name: 'Ra', order: 10, category: 'no-dots' },
    { id: 'zay', face: 'ز', name: 'Zay', order: 11, category: 'dots' },
    { id: 'sin', face: 'س', name: 'Sin', order: 12, category: 'no-dots' },
    { id: 'shin', face: 'ش', name: 'Shin', order: 13, category: 'dots' },
    { id: 'sad', face: 'ص', name: 'Sad', order: 14, category: 'no-dots' },
    { id: 'dad', face: 'ض', name: 'Dad', order: 15, category: 'dots' },
    { id: 'tah', face: 'ط', name: 'Tah', order: 16, category: 'no-dots' },
    { id: 'zah', face: 'ظ', name: 'Zah', order: 17, category: 'dots' },
    { id: 'ayn', face: 'ع', name: 'Ayn', order: 18, category: 'no-dots' },
    { id: 'ghayn', face: 'غ', name: 'Ghayn', order: 19, category: 'dots' },
    { id: 'fa', face: 'ف', name: 'Fa', order: 20, category: 'dots' },
    { id: 'qaf', face: 'ق', name: 'Qaf', order: 21, category: 'dots' },
    { id: 'kaf', face: 'ك', name: 'Kaf', order: 22, category: 'no-dots' },
    { id: 'lam', face: 'ل', name: 'Lam', order: 23, category: 'no-dots' },
    { id: 'mim', face: 'م', name: 'Mim', order: 24, category: 'dots' },
    { id: 'nun', face: 'ن', name: 'Nun', order: 25, category: 'dots' },
    { id: 'haa', face: 'ه', name: 'Haa', order: 26, category: 'no-dots' },
    { id: 'waw', face: 'و', name: 'Waw', order: 27, category: 'no-dots' },
    { id: 'ya', face: 'ي', name: 'Ya', order: 28, category: 'dots' },
];
/** Arabic-Indic numerals 1–10, numeral ↔ English name. */
exports.KIDS_STUDY_NUMBERS = [
    { id: 'one', face: '١', name: 'One', order: 1, category: 'odd' },
    { id: 'two', face: '٢', name: 'Two', order: 2, category: 'even' },
    { id: 'three', face: '٣', name: 'Three', order: 3, category: 'odd' },
    { id: 'four', face: '٤', name: 'Four', order: 4, category: 'even' },
    { id: 'five', face: '٥', name: 'Five', order: 5, category: 'odd' },
    { id: 'six', face: '٦', name: 'Six', order: 6, category: 'even' },
    { id: 'seven', face: '٧', name: 'Seven', order: 7, category: 'odd' },
    { id: 'eight', face: '٨', name: 'Eight', order: 8, category: 'even' },
    { id: 'nine', face: '٩', name: 'Nine', order: 9, category: 'odd' },
    { id: 'ten', face: '١٠', name: 'Ten', order: 10, category: 'even' },
];
/**
 * Simple, uncontroversial everyday nouns, Arabic word ↔ English meaning.
 * Words in `buildWordIds` have every Arabic letter in KIDS_STUDY_LETTERS
 * (no ة / ء / أ etc.), so they can be re-spelled with the letter bank.
 */
exports.KIDS_STUDY_WORDS = [
    { id: 'moon', face: 'قمر', name: 'Moon', order: 1, category: 'nature' },
    { id: 'sun', face: 'شمس', name: 'Sun', order: 2, category: 'nature' },
    { id: 'heart', face: 'قلب', name: 'Heart', order: 3, category: 'home' },
    { id: 'book', face: 'كتاب', name: 'Book', order: 4, category: 'home' },
    { id: 'water', face: 'ماء', name: 'Water', order: 5, category: 'nature' },
    { id: 'star', face: 'نجم', name: 'Star', order: 6, category: 'nature' },
    { id: 'house', face: 'بيت', name: 'House', order: 7, category: 'home' },
    { id: 'door', face: 'باب', name: 'Door', order: 8, category: 'home' },
    { id: 'sea', face: 'بحر', name: 'Sea', order: 9, category: 'nature' },
    { id: 'rose', face: 'وردة', name: 'Rose', order: 10, category: 'nature' },
    { id: 'lion', face: 'أسد', name: 'Lion', order: 11, category: 'animal' },
    { id: 'apple', face: 'تفاحة', name: 'Apple', order: 12, category: 'food' },
    { id: 'cat', face: 'قطة', name: 'Cat', order: 13, category: 'animal' },
    { id: 'bread', face: 'خبز', name: 'Bread', order: 14, category: 'food' },
];
exports.KIDS_STUDY_SETS = {
    letters: exports.KIDS_STUDY_LETTERS,
    numbers: exports.KIDS_STUDY_NUMBERS,
    words: exports.KIDS_STUDY_WORDS,
};
/** Words whose letters can all be built from the 28-letter bank. */
exports.KIDS_BUILDABLE_WORDS = ['moon', 'sun', 'book', 'star', 'house', 'door', 'sea', 'bread']
    .map((id) => exports.KIDS_STUDY_WORDS.find((item) => item.id === id))
    .filter((item) => Boolean(item));
