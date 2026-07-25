/**
 * No external AI API is called here — the assistant is deliberately a
 * closed-domain retrieval engine over this app's own verified Quran/Tafsir/
 * Hadith/Dua data (Phase 4/6/10/13), not a wrapper around a generative LLM.
 * The brief requires every answer to cite a specific source and never
 * free-generate on religious rulings; the reliable way to guarantee that is
 * to never generate text in the first place — only retrieve and cite real
 * text. See features/assistant/services/assistantEngine.ts for the actual
 * intent-parsing + retrieval logic this re-exports.
 */
export { answerQuery } from 'features/assistant/services/assistantEngine';
