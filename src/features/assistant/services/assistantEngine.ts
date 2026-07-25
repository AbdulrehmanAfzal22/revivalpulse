import { parseIntent } from './intentParser';
import {
  resolveDuaSearch,
  resolveHadithSearch,
  resolveTafsirRequest,
  resolveTranslationCompare,
  resolveVerseExplain,
} from './resolvers';
import type { AssistantAnswer } from 'types/assistant.types';

const UNRECOGNIZED_ANSWER: AssistantAnswer = {
  sections: [
    {
      kind: 'note',
      text: 'I don\'t have a confident, source-backed answer for that. Try asking about a specific verse (e.g. "2:255" or "Ayat al-Kursi"), a hadith topic ("hadith about intentions"), or a dua category ("dua for traveling").',
    },
  ],
  citations: [],
  confident: false,
};

const ERROR_ANSWER: AssistantAnswer = {
  sections: [{ kind: 'note', text: 'Something went wrong while looking that up — please try again.' }],
  citations: [],
  confident: false,
};

/**
 * The only entry point into the assistant. Deliberately not an LLM call:
 * parseIntent is rule-based pattern matching (no free-text generation), and
 * every branch below resolves through an existing, already-verified data
 * client (Phase 4/6/10/13) — see resolvers.ts. If nothing matches with
 * confidence, the caller gets an explicit `confident: false` answer instead
 * of a guess.
 */
export async function answerQuery(rawText: string): Promise<AssistantAnswer> {
  const intent = parseIntent(rawText);

  try {
    switch (intent.type) {
      case 'verse-explain':
        return await resolveVerseExplain(intent.verseKey);
      case 'translation-compare':
        return await resolveTranslationCompare(intent.verseKey);
      case 'tafsir':
        return await resolveTafsirRequest(intent.verseKey);
      case 'hadith-search':
        return await resolveHadithSearch(intent.query);
      case 'dua-search':
        return await resolveDuaSearch(intent.query, intent.categoryId);
      case 'unrecognized':
      default:
        return UNRECOGNIZED_ANSWER;
    }
  } catch {
    return ERROR_ANSWER;
  }
}
