"use strict";
/**
 * Prophet timeline data for the Prophet Timeline Sort game.
 * Uses the existing PROPHET_STORIES from stories.ts but simplified for ordering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProphetTimelineItemsShuffled = exports.getProphetTimelineItems = exports.PROPHET_TIMELINE = void 0;
exports.PROPHET_TIMELINE = [
    { id: 'adam', nameArabic: 'آدم', nameEnglish: 'Adam', order: 1, period: 'Beginning', color: '#4caf6d', icon: '🌿' },
    { id: 'idris', nameArabic: 'إدريس', nameEnglish: 'Idris', order: 2, period: 'Early', color: '#5c6bc0', icon: '⭐' },
    { id: 'nuh', nameArabic: 'نوح', nameEnglish: 'Nuh', order: 3, period: 'Early', color: '#3d8bd6', icon: '🚢' },
    { id: 'hud', nameArabic: 'هود', nameEnglish: 'Hud', order: 4, period: 'Ancient', color: '#7d9db5', icon: '🌪️' },
    { id: 'salih', nameArabic: 'صالح', nameEnglish: 'Salih', order: 5, period: 'Ancient', color: '#a97449', icon: '🏔️' },
    { id: 'ibrahim', nameArabic: 'إبراهيم', nameEnglish: 'Ibrahim', order: 6, period: '~2000 BCE', color: '#e2622a', icon: '🔥' },
    { id: 'lut', nameArabic: 'لوط', nameEnglish: 'Lut', order: 7, period: '~1900 BCE', color: '#5c6bc0', icon: '☁️' },
    { id: 'ismail', nameArabic: 'إسماعيل', nameEnglish: 'Ismail', order: 8, period: '~1900 BCE', color: '#f0a63a', icon: '☀️' },
    { id: 'ishaq', nameArabic: 'إسحاق', nameEnglish: 'Ishaq', order: 9, period: '~1900 BCE', color: '#e8b44f', icon: '😊' },
    { id: 'yaqub', nameArabic: 'يعقوب', nameEnglish: 'Yaqub', order: 10, period: '~1800 BCE', color: '#8bc34a', icon: '🌱' },
    { id: 'yusuf', nameArabic: 'يوسف', nameEnglish: 'Yusuf', order: 11, period: '~1700 BCE', color: '#9c27b0', icon: '👑' },
    { id: 'ayyub', nameArabic: 'أيوب', nameEnglish: 'Ayyub', order: 12, period: '~1500 BCE', color: '#795548', icon: '🤲' },
    { id: 'shuayb', nameArabic: 'شعيب', nameEnglish: 'Shuayb', order: 13, period: '~1500 BCE', color: '#607d8b', icon: '⚖️' },
    { id: 'musa', nameArabic: 'موسى', nameEnglish: 'Musa', order: 14, period: '~1300 BCE', color: '#2196f3', icon: '📜' },
    { id: 'harun', nameArabic: 'هارون', nameEnglish: 'Harun', order: 15, period: '~1300 BCE', color: '#03a9f4', icon: '🗣️' },
    { id: 'dawud', nameArabic: 'داوود', nameEnglish: 'Dawud', order: 16, period: '~1000 BCE', color: '#673ab7', icon: '🎵' },
    { id: 'sulayman', nameArabic: 'سليمان', nameEnglish: 'Sulayman', order: 17, period: '~970 BCE', color: '#3f51b5', icon: '💍' },
    { id: 'ilyas', nameArabic: 'إلياس', nameEnglish: 'Ilyas', order: 18, period: '~850 BCE', color: '#e91e63', icon: '🏔️' },
    { id: 'alysa', nameArabic: 'اليسع', nameEnglish: 'Alysa', order: 19, period: '~800 BCE', color: '#ff5722', icon: '🌊' },
    { id: 'yunus', nameArabic: 'يونس', nameEnglish: 'Yunus', order: 20, period: '~780 BCE', color: '#00bcd4', icon: '🐟' },
    { id: 'zakariya', nameArabic: 'زكريا', nameEnglish: 'Zakariya', order: 21, period: '~1st Century BCE', color: '#9e9e9e', icon: '🕊️' },
    { id: 'yahya', nameArabic: 'يحيى', nameEnglish: 'Yahya', order: 22, period: '~1st Century CE', color: '#78909c', icon: '🌊' },
    { id: 'isa', nameArabic: 'عيسى', nameEnglish: 'Isa', order: 23, period: '~1st Century CE', color: '#4caf50', icon: '✝️' },
    { id: 'muhammad', nameArabic: 'محمد', nameEnglish: 'Muhammad ﷺ', order: 24, period: '570-632 CE', color: '#146356', icon: '☪️' },
];
/** Get a subset for a specific difficulty */
function getProphetTimelineItems(count) {
    const shuffled = [...exports.PROPHET_TIMELINE].sort(() => Math.random() - 0.5);
    // Sort the selected subset by chronological order for the game
    const selected = shuffled.slice(0, count).sort((a, b) => a.order - b.order);
    return selected;
}
exports.getProphetTimelineItems = getProphetTimelineItems;
/** Get items in random order for dragging */
function getProphetTimelineItemsShuffled(count) {
    const selected = getProphetTimelineItems(count);
    return [...selected].sort(() => Math.random() - 0.5);
}
exports.getProphetTimelineItemsShuffled = getProphetTimelineItemsShuffled;
