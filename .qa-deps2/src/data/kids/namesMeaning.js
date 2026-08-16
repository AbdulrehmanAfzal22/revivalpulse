"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamesMeaningItems = exports.NAMES_OF_ALLAH = void 0;
const namesOfAllah_json_1 = __importDefault(require("./namesOfAllah.json"));
/** Transform the raw names data into game-ready format */
function transformNamesData() {
    const rawNames = namesOfAllah_json_1.default;
    // Pool of all meanings for decoy selection
    const allMeanings = rawNames.map(n => n.meaning);
    return rawNames.map(name => {
        const otherMeanings = allMeanings.filter(m => m !== name.meaning);
        // Shuffle and pick decoys (will be randomized per round in the game)
        const shuffled = [...otherMeanings].sort(() => Math.random() - 0.5);
        const decoys = shuffled.slice(0, 6); // Up to 6 decoys available
        const meaningOptions = [name.meaning, ...decoys];
        return {
            id: `name-${name.number}`,
            number: name.number,
            arabic: name.arabic,
            transliteration: name.transliteration,
            meaning: name.meaning,
            meaningOptions,
        };
    });
}
exports.NAMES_OF_ALLAH = transformNamesData();
/** Get a subset of names for a specific difficulty */
function getNamesMeaningItems(difficulty) {
    let pool = [...exports.NAMES_OF_ALLAH];
    if (difficulty === 'easy') {
        // First 33 names (easier, more well-known)
        pool = pool.slice(0, 33);
    }
    else if (difficulty === 'medium') {
        // First 66 names
        pool = pool.slice(0, 66);
    }
    // Hard uses all 99
    return pool;
}
exports.getNamesMeaningItems = getNamesMeaningItems;
