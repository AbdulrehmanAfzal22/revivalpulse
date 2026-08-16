"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickDecoys = exports.pickTarget = exports.sample = exports.shuffle = void 0;
const gameContent_1 = require("../data/kids/gameContent");
/** Fisher–Yates shuffle — new array, original untouched. */
function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
exports.shuffle = shuffle;
/** `count` distinct random items from the pool. */
function sample(items, count) {
    return shuffle(items).slice(0, Math.min(count, items.length));
}
exports.sample = sample;
/** Round-robin target so every round of a session picks a new item. */
function pickTarget(pack, round) {
    const pool = gameContent_1.KIDS_STUDY_SETS[pack];
    return pool[round % pool.length];
}
exports.pickTarget = pickTarget;
/** `count` distinct decoys for the target (never the target itself). */
function pickDecoys(pack, target, count) {
    return sample(gameContent_1.KIDS_STUDY_SETS[pack].filter((item) => item.id !== target.id), count);
}
exports.pickDecoys = pickDecoys;
