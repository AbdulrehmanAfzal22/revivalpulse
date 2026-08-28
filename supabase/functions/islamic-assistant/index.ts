import { corsHeaders, type SourceCitation } from './_shared/cors';
import { resolveByMode } from './retrieval';
import { callLLM } from './llmClient';

interface IslamicAssistantRequest {
  query: string;
  sourceMode: 'general' | 'quran' | 'hadith' | 'tafsir' | 'history';
  language: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface IslamicAssistantResponse {
  answer: string;
  sources: SourceCitation[];
  confident: boolean;
}

export async function handler(request: Request): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: IslamicAssistantRequest = await request.json();

    // Validate sourceMode
    const validModes: IslamicAssistantRequest['sourceMode'][] = [
      'general',
      'quran',
      'hadith',
      'tafsir',
      'history',
    ];
    if (!validModes.includes(body.sourceMode)) {
      return new Response(
        JSON.stringify({
          answer: 'Invalid source mode specified.',
          sources: [],
          confident: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Step 1: Retrieve evidence based on source mode
    const sources = await resolveByMode(body.query, body.sourceMode);

    // Step 2: Build evidence text for LLM from retrieved sources
    const evidenceText = sources
      .map(
        (src) =>
          `${src.reference}: ${src.text?.substring(0, 200)?.trim() || ''}`
          .trim()
          .substring(0, 500)
      )
      .filter((s) => s.length > 0)
      .slice(0, 5)
      .join('\n\n');

    // Step 3: Synthesize answer using LLM
    const { answer, confident } = await callLLM(
      evidenceText,
      body.query,
      body.sourceMode,
      body.language
    );

    // Step 4: If no confident answer from LLM and no sources, return clear message
    if (!confident && sources.length === 0) {
      return new Response(
        JSON.stringify({
          answer: 'I couldn\'t find sufficient evidence in the available Islamic sources to answer your question. Try being more specific (e.g., "verse 2:255 about patience", "hadith about intentions", or "dua for traveling").',
          sources: [],
          confident: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        answer,
        sources,
        confident,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Islamic Assistant edge function error:', error);
    return new Response(
      JSON.stringify({
        answer: 'An error occurred while processing your request. Please try again.',
        sources: [],
        confident: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}

// Export the handler for Supabase Edge Functions
export default handler;