"use strict";
/**
 * Halal/Haram categorization data for kids.
 * Each item has a clear, well-known ruling appropriate for children's learning.
 * Sources: Quran and authentic Hadith (needsVerification: true for human review).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemsByCategory = exports.getHalalHaramItems = exports.HALAL_HARAM_ITEMS = void 0;
exports.HALAL_HARAM_ITEMS = [
    // CLEARLY HALAL
    {
        id: 'water',
        name: { en: 'Water', ar: 'ماء' },
        category: 'halal',
        explanation: { en: 'Water is a pure blessing from Allah for all living things.' },
        icon: '💧',
        sources: [{ type: 'quran', reference: '21:30', needsVerification: true }],
    },
    {
        id: 'milk',
        name: { en: 'Milk', ar: 'لبن' },
        category: 'halal',
        explanation: { en: 'Milk is a pure, nutritious drink mentioned in the Quran.' },
        icon: '🥛',
        sources: [{ type: 'quran', reference: '16:66', needsVerification: true }],
    },
    {
        id: 'honey',
        name: { en: 'Honey', ar: 'عسل' },
        category: 'halal',
        explanation: { en: 'Honey is mentioned in the Quran as a healing food.' },
        icon: '🍯',
        sources: [{ type: 'quran', reference: '16:69', needsVerification: true }],
    },
    {
        id: 'dates',
        name: { en: 'Dates', ar: 'تمر' },
        category: 'halal',
        explanation: { en: 'Dates are a blessed fruit, the Prophet ﷺ loved them.' },
        icon: '🌴',
        sources: [{ type: 'hadith', reference: 'Bukhari 5445', needsVerification: true }],
    },
    {
        id: 'bread',
        name: { en: 'Bread', ar: 'خبز' },
        category: 'halal',
        explanation: { en: 'Bread made from permissible grains is a staple halal food.' },
        icon: '🍞',
        sources: [{ type: 'quran', reference: '2:172', needsVerification: true }],
    },
    {
        id: 'fish',
        name: { en: 'Fish', ar: 'سمك' },
        category: 'halal',
        explanation: { en: 'All seafood is halal according to most scholars.' },
        icon: '🐟',
        sources: [{ type: 'quran', reference: '5:96', needsVerification: true }],
    },
    {
        id: 'chicken',
        name: { en: 'Chicken', ar: 'دجاج' },
        category: 'halal',
        explanation: { en: 'Chicken is halal when slaughtered in the Islamic way.' },
        icon: '🍗',
        sources: [{ type: 'hadith', reference: 'Tirmidhi 1476', needsVerification: true }],
    },
    {
        id: 'rice',
        name: { en: 'Rice', ar: 'أرز' },
        category: 'halal',
        explanation: { en: 'Rice is a pure grain, halal and nutritious.' },
        icon: '🍚',
        sources: [{ type: 'quran', reference: '2:172', needsVerification: true }],
    },
    {
        id: 'apple',
        name: { en: 'Apple', ar: 'تفاح' },
        category: 'halal',
        explanation: { en: 'All fruits are halal unless fermented into alcohol.' },
        icon: '🍎',
        sources: [{ type: 'quran', reference: '16:114', needsVerification: true }],
    },
    {
        id: 'vegetables',
        name: { en: 'Vegetables', ar: 'خضار' },
        category: 'halal',
        explanation: { en: 'All vegetables are halal and good for health.' },
        icon: '🥕',
        sources: [{ type: 'quran', reference: '2:172', needsVerification: true }],
    },
    {
        id: 'olive-oil',
        name: { en: 'Olive Oil', ar: 'زيت زيتون' },
        category: 'halal',
        explanation: { en: 'The Quran mentions olives as a blessed tree.' },
        icon: '🫒',
        sources: [{ type: 'quran', reference: '23:20', needsVerification: true }],
    },
    {
        id: 'pomegranate',
        name: { en: 'Pomegranate', ar: 'رمان' },
        category: 'halal',
        explanation: { en: 'Pomegranate is mentioned in the Quran as a fruit of Paradise.' },
        icon: '🫐',
        sources: [{ type: 'quran', reference: '55:68', needsVerification: true }],
    },
    // CLEARLY HARAM
    {
        id: 'wine',
        name: { en: 'Wine/Alcohol', ar: 'خمر' },
        category: 'haram',
        explanation: { en: 'Alcohol is strictly forbidden in Islam, it clouds the mind.' },
        icon: '🍷',
        sources: [{ type: 'quran', reference: '5:90', needsVerification: true }],
    },
    {
        id: 'pork',
        name: { en: 'Pork', ar: 'لحم خنزير' },
        category: 'haram',
        explanation: { en: 'Pig meat is explicitly forbidden in the Quran.' },
        icon: '🐷',
        sources: [{ type: 'quran', reference: '2:173', needsVerification: true }],
    },
    {
        id: 'dead-meat',
        name: { en: 'Dead Meat (not slaughtered)', ar: 'ميتة' },
        category: 'haram',
        explanation: { en: 'Animals that die without proper Islamic slaughter are haram.' },
        icon: '🦴',
        sources: [{ type: 'quran', reference: '5:3', needsVerification: true }],
    },
    {
        id: 'blood',
        name: { en: 'Blood', ar: 'دم' },
        category: 'haram',
        explanation: { en: 'Consuming blood is forbidden, it must be drained during slaughter.' },
        icon: '🩸',
        sources: [{ type: 'quran', reference: '5:3', needsVerification: true }],
    },
    {
        id: 'gambling',
        name: { en: 'Gambling Games', ar: 'قمار' },
        category: 'haram',
        explanation: { en: 'Gambling is forbidden alongside alcohol in the Quran.' },
        icon: '🎰',
        sources: [{ type: 'quran', reference: '5:90', needsVerification: true }],
    },
];
function getHalalHaramItems(count) {
    const shuffled = [...exports.HALAL_HARAM_ITEMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
exports.getHalalHaramItems = getHalalHaramItems;
function getItemsByCategory(category, count) {
    const filtered = exports.HALAL_HARAM_ITEMS.filter(item => item.category === category);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
exports.getItemsByCategory = getItemsByCategory;
