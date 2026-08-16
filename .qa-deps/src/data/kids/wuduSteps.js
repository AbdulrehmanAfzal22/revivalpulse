"use strict";
/**
 * Wudu (ablution) steps in correct order.
 * Based on the authentic description of the Prophet's ﷺ wudu.
 * Each step has the body part, Arabic name, action, and illustration hint.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WUDU_HOTSPOTS = exports.getWuduSteps = exports.WUDU_STEPS_FULL = exports.WUDU_STEPS_EASY = exports.WUDU_STEPS = void 0;
exports.WUDU_STEPS = [
    {
        id: 'niyyah',
        order: 1,
        name: { en: 'Intention (Niyyah)', ar: 'نية' },
        bodyPart: 'heart',
        action: { en: 'Make intention in your heart for wudu' },
        illustrationHint: 'Heart icon',
        isFard: true,
        source: { type: 'hadith', reference: 'Bukhari 1', needsVerification: true },
    },
    {
        id: 'bismillah',
        order: 2,
        name: { en: 'Say Bismillah', ar: 'بسم الله' },
        bodyPart: 'mouth',
        action: { en: 'Say "Bismillah" before starting' },
        illustrationHint: 'Speech bubble with Bismillah',
        isFard: false,
        source: { type: 'hadith', reference: 'Tirmidhi 55', needsVerification: true },
    },
    {
        id: 'hands',
        order: 3,
        name: { en: 'Wash Hands', ar: 'غسل اليدين' },
        bodyPart: 'hands',
        action: { en: 'Wash both hands up to wrists 3 times' },
        illustrationHint: 'Water flowing over hands',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'mouth',
        order: 4,
        name: { en: 'Rinse Mouth', ar: 'المضمضة' },
        bodyPart: 'mouth',
        action: { en: 'Rinse mouth 3 times' },
        illustrationHint: 'Water swishing in mouth',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'nose',
        order: 5,
        name: { en: 'Clean Nose', ar: 'الاستنشاق' },
        bodyPart: 'nose',
        action: { en: 'Sniff water into nose and blow out 3 times' },
        illustrationHint: 'Water going into nose',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'face',
        order: 6,
        name: { en: 'Wash Face', ar: 'غسل الوجه' },
        bodyPart: 'face',
        action: { en: 'Wash entire face 3 times (hairline to chin, ear to ear)' },
        illustrationHint: 'Water covering whole face',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'arms',
        order: 7,
        name: { en: 'Wash Arms', ar: 'غسل الذراعين' },
        bodyPart: 'arms',
        action: { en: 'Wash right arm to elbow 3 times, then left arm 3 times' },
        illustrationHint: 'Water flowing down arms to elbows',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'head',
        order: 8,
        name: { en: 'Wipe Head', ar: 'مسح الرأس' },
        bodyPart: 'head',
        action: { en: 'Wipe whole head once with wet hands' },
        illustrationHint: 'Wet hands passing over hair',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'ears',
        order: 9,
        name: { en: 'Wipe Ears', ar: 'مسح الأذنين' },
        bodyPart: 'ears',
        action: { en: 'Wipe inside and outside of ears with same water' },
        illustrationHint: 'Fingers wiping ears',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
    {
        id: 'feet',
        order: 10,
        name: { en: 'Wash Feet', ar: 'غسل القدمين' },
        bodyPart: 'feet',
        action: { en: 'Wash right foot to ankles 3 times, then left foot 3 times' },
        illustrationHint: 'Water covering feet to ankles',
        isFard: true,
        source: { type: 'quran', reference: '5:6', needsVerification: true },
    },
];
/** Simplified version for easy mode (fard steps only) */
exports.WUDU_STEPS_EASY = exports.WUDU_STEPS.filter(s => s.isFard);
/** Full version for medium/hard */
exports.WUDU_STEPS_FULL = [...exports.WUDU_STEPS];
function getWuduSteps(mode) {
    if (mode === 'easy')
        return exports.WUDU_STEPS_EASY;
    return exports.WUDU_STEPS_FULL;
}
exports.getWuduSteps = getWuduSteps;
/** Hotspot coordinates for the wudu figure (percentages for responsive SVG) */
exports.WUDU_HOTSPOTS = {
    heart: { x: 50, y: 24, radius: 8 },
    mouth: { x: 50, y: 30, radius: 6 },
    hands: { x: 50, y: 55, radius: 15 },
    nose: { x: 50, y: 28, radius: 5 },
    face: { x: 50, y: 25, radius: 12 },
    arms: { x: 50, y: 48, radius: 18 },
    head: { x: 50, y: 15, radius: 12 },
    ears: { x: 50, y: 28, radius: 10 },
    feet: { x: 50, y: 85, radius: 12 },
};
