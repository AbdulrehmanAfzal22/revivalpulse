const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface LLMRequest {
  model: string;
  max_tokens: number;
  temperature: number;
  system: string;
  messages: Array<{ role: string; content: string }>;
}

/**
 * Calls OPENROUTER_API_KEY via fetch, no SDK needed.
 * System prompt instructs the model to answer using only the evidence
 * provided in the request, and to explicitly say if evidence is insufficient.
 */
export async function callLLM(
  evidence: string,
  query: string,
  sourceMode: string,
  language: string
): Promise<{ answer: string; sources: SourceCitation[]; confident: boolean }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      answer: 'LLM service is not configured. Please set OPENROUTER_API_KEY in server/.env.',
      sources: [],
      confident: false,
    };
  }

  // Build system prompt based on source mode
  let systemPrompt = `You are an Islamic knowledge assistant. Answer the user's question using ONLY the evidence provided below. 

Do NOT add facts, hadith, verses, or scholar names not present in the evidence. 
If the evidence is insufficient to answer the question, say so explicitly: "I couldn't find sufficient evidence in the provided sources to answer this question." Do not guess or fabricate.

Additional guidance for sourceMode="${sourceMode}": `;

  if (sourceMode === 'hadith') {
    systemPrompt += 'Note: The current hadith dataset does not include authenticity grading data. If a hadith is returned without grading information, state: "Authenticity grading is not available for this narration." Do not invent a grading or chain of narration.';
  }

  if (sourceMode === 'quran') {
    systemPrompt += 'Ensure any verse references are accurate and cite the surah:ayah reference.';
  }

  if (sourceMode === 'tafsir') {
    systemPrompt += 'Cite the tafsir scholar/author name for any interpretation provided.';
  }

  systemPrompt += ` Respond in ${language}.`;

  const request: LLMRequest = {
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0.1,
    system: systemPrompt,
    messages: [
      { role: 'user', content: `QUESTION: ${query}\n\nEVIDENCE:\n${evidence}` },
    ],
  };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', response.status, errorText);
      return {
        answer: 'Failed to get AI response. Please try again later.',
        sources: [],
        confident: false,
      };
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || 'No response from AI.';

    return {
      answer,
      sources: [], // Sources are handled at the retrieval level
      confident: true,
    };
  } catch (error) {
    console.error('LLM call failed:', error);
    return {
      answer: 'Error connecting to AI service. Please try again.',
      sources: [],
      confident: false,
    };
  }
}