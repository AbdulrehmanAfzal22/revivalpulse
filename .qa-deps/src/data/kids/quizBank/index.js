"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizQuestionsByCategory = exports.QUIZ_CONTENT_REVIEW_BANNER = exports.QUIZ_CONTENT_REVIEWED = exports.QUIZ_BANK = void 0;
const prophets_1 = require("./prophets");
const salah_1 = require("./salah");
const duas_1 = require("./duas");
const adab_1 = require("./adab");
const quran_1 = require("./quran");
const worship_1 = require("./worship");
const calendar_1 = require("./calendar");
/**
 * Phase 4 expanded quiz bank (1000+ questions across 7 topics).
 *
 * Content discipline:
 * - Every question carries at least one source (Qur'an, hadith, seerah, or
 *   mainstream-fiqh consensus) in `sources` with `needsVerification: true`.
 * - Every question is written for a kids audience (plain language, no
 *   unnecessary scare or gore details).
 * - ids are unique across the whole bank (`topic-slug` pattern).
 * - `QUIZ_CONTENT_REVIEWED` stays false until a human has fact-checked the
 *   expanded bank; the banner is shown in the quiz UI.
 */
exports.QUIZ_BANK = [
    ...prophets_1.QUIZ_PROPHETS,
    ...salah_1.QUIZ_SALAH,
    ...duas_1.QUIZ_DUAS,
    ...adab_1.QUIZ_ADAB,
    ...quran_1.QUIZ_QURAN,
    ...worship_1.QUIZ_WORSHIP,
    ...calendar_1.QUIZ_CALENDAR,
];
exports.QUIZ_CONTENT_REVIEWED = false;
exports.QUIZ_CONTENT_REVIEW_BANNER = 'Quiz content is a draft pending human review (see src/data/kids/quizBank/).';
function quizQuestionsByCategory(category) {
    return exports.QUIZ_BANK.filter((q) => q.category === category);
}
exports.quizQuestionsByCategory = quizQuestionsByCategory;
