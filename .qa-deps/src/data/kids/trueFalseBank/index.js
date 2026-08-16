"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRUE_FALSE_CONTENT_REVIEW_BANNER = exports.TRUE_FALSE_CONTENT_REVIEWED = exports.TRUE_FALSE_BANK = void 0;
const prophets_1 = require("./prophets");
const worshipSalah_1 = require("./worshipSalah");
const duasAdab_1 = require("./duasAdab");
const quranBasics_1 = require("./quranBasics");
const arabicBasics_1 = require("./arabicBasics");
const calendar_1 = require("./calendar");
/**
 * Phase 4 expanded true/false bank (1000+ statements across 6 topics).
 *
 * Content discipline:
 * - Every statement carries at least one source (Qur'an, hadith, seerah, or
 *   mainstream-fiqh consensus) in `sources` with `needsVerification: true`.
 * - A TRUE statement asserts a sourced fact; a FALSE statement contradicts a
 *   sourced fact (its `sources` support the correct answer).
 * - Written for a kids audience (plain language, no unnecessary scare or
 *   gore details).
 * - ids are unique across the whole bank (`topic-slug` pattern).
 * - `TRUE_FALSE_CONTENT_REVIEWED` stays false until a human has fact-checked
 *   the expanded bank.
 */
exports.TRUE_FALSE_BANK = [
    ...prophets_1.TRUE_FALSE_PROPHETS,
    ...worshipSalah_1.TRUE_FALSE_WORSHIP_SALAH,
    ...duasAdab_1.TRUE_FALSE_DUAS_ADAB,
    ...quranBasics_1.TRUE_FALSE_QURAN_BASICS,
    ...arabicBasics_1.TRUE_FALSE_ARABIC_BASICS,
    ...calendar_1.TRUE_FALSE_CALENDAR,
];
exports.TRUE_FALSE_CONTENT_REVIEWED = false;
exports.TRUE_FALSE_CONTENT_REVIEW_BANNER = 'True/false content is a draft pending human review (see src/data/kids/trueFalseBank/).';
