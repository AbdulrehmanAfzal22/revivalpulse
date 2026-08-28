import type { AssistantAnswer, SourceMode, SourceCitation } from 'types/assistant.types';

const EMPTY_ANSWER_TEXT = "I don't have a confident, source-backed answer for that. Try asking about a specific verse (e.g. '2:255' or 'Ayat al-Kursi'), a hadith topic ('hadith about intentions'), or a dua category ('dua for traveling').";

const ERROR_ANSWER: AssistantAnswer = {
  sections: [{ kind: 'note', text: 'Something went wrong while looking that up — please try again.' }],
  citations: [],
  confident: false,
  sources: [],
};

const ASSISTANT_REQUEST_TIMEOUT_MS = 30000;

export async function answerQuery(
  rawText: string,
  sourceMode: SourceMode = 'general',
  language: string = 'en',
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<AssistantAnswer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ASSISTANT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: rawText, sourceMode, language, conversationHistory }),
      signal: controller.signal,
    });

    if (!response.ok) return ERROR_ANSWER;

    const data = (await response.json()) as {
      answer?: string;
      sources?: SourceCitation[];
      confident?: boolean;
    };
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const answerText = typeof data.answer === 'string' ? data.answer.trim() : '';

    return {
      sections: [{ kind: 'note', text: answerText || (data.confident === false ? EMPTY_ANSWER_TEXT : 'No answer was returned.') }],
      citations: sources.map((source) => ({ type: source.type, label: source.reference })),
      confident: data.confident ?? false,
      sources,
    };
  } catch {
    return ERROR_ANSWER;
  } finally {
    clearTimeout(timeout);
  }
}