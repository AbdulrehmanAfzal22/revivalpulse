require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const GEMINI_NATIVE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function normalizeGroundingSources(groundingMetadata) {
  if (!groundingMetadata) return [];

  const chunks = Array.isArray(groundingMetadata.groundingChunks)
    ? groundingMetadata.groundingChunks
    : Array.isArray(groundingMetadata.groundingMetadata?.groundingChunks)
      ? groundingMetadata.groundingMetadata.groundingChunks
      : [];

  return chunks
    .map((chunk) => {
      const web = chunk?.web || chunk?.grounding?.web || {};
      const title = web.title || chunk?.title || 'Web source';
      const uri = web.uri || chunk?.uri || null;
      if (!uri) return null;
      return {
        type: 'google_search',
        reference: title,
        text: web.snippet || web.title || title,
        url: uri,
      };
    })
    .filter(Boolean);
}

async function callLLMWithSearch(query, sourceMode = 'general', language = 'en', conversationHistory = [], retrievalSources = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      answer: 'LLM service is not configured. Please set GEMINI_API_KEY in server/.env.',
      sources: [],
      confident: false,
    };
  }

  const model = 'gemini-3.6-flash';
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `QUESTION_CLASS: ISLAMIC_CLAIM\n\nQUESTION: ${query}\n\nLANGUAGE: ${language || 'en'}\n\nAnswer using real web-grounded sources and cite the real source links you used.` }],
      },
    ],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.1,
    },
  };

  try {
    const response = await fetch(`${GEMINI_NATIVE_API_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini native search error:', response.status, errorText);
      return {
        answer: 'The web-grounded AI search is temporarily unavailable. Please try again later.',
        sources: retrievalSources,
        confident: false,
      };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';
    const groundingSources = normalizeGroundingSources(candidate?.groundingMetadata || candidate?.grounding_metadata);
    const finalSources = groundingSources.length > 0 ? groundingSources : retrievalSources;

    console.log('NATIVE_GEMINI_SEARCH_RESPONSE:', JSON.stringify({
      text,
      groundingMetadata: candidate?.groundingMetadata || null,
      sourceCount: finalSources.length,
    }, null, 2));

    return {
      answer: text.trim() || 'I could not find a reliable web-grounded answer for that question.',
      sources: finalSources,
      confident: Boolean(text.trim()),
    };
  } catch (error) {
    console.error('Gemini native search request failed:', error.message);
    return {
      answer: 'Unable to connect to the web-grounded AI service. Please try again.',
      sources: retrievalSources,
      confident: false,
    };
  }
}

async function callLLM(evidence, query, sourceMode, language, conversationHistory = [], retrievalSources = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      answer: 'LLM service is not configured. Please set GEMINI_API_KEY in server/.env.',
      sources: [],
      confident: false,
    };
  }

  const modeInstructions = {
    quran: `QURAN_MODE_INSTRUCTIONS:
- Never invent, paraphrase as if literal, or misattribute a Quranic verse. Every verse cited must come directly from the evidence provided, with its real Surah and Ayah number.
- Distinguish clearly between the verse's actual text and any explanation or interpretation being added.
- If the evidence doesn't contain a verse relevant to the question, say so, do not approximate or guess at what verse might apply.
- Use this internal certainty framework before answering:
  * Certain/Established: direct evidence clearly supports the claim; answer directly and confidently, citing the relevant evidence and source after the answer rather than before it.
  * Strongly established: the evidence is strong and directly supports the claim, but wording should stay appropriately precise rather than overstating certainty.
  * Disputed: the evidence is genuinely mixed or scholars disagree; say that plainly and do not present one side as settled when the claim remains disputed.
  * Weak/Unverified: the support is limited, partial, or not strong enough to justify a firm conclusion; say so explicitly and avoid full confidence.
  * No reliable evidence: no trustworthy evidence is available; say so plainly and do not fill the gap by guessing.
- When real evidence is found and directly supports the claim, answer directly and confidently, put the evidence and source after the answer, not before it, and do not append the 'not verified' disclaimer in that case.
- Before finalizing any factual claim, check whether every important claim in this answer is supported by the evidence actually provided. If only partially supported, remove the unsupported parts or label them as uncertain rather than presenting them at full confidence.`,
    hadith: `HADITH_MODE_INSTRUCTIONS:
- Never invent a Hadith, a Hadith number, a collection name, or a narrator. Every Hadith cited must come directly from the evidence provided.
- State the authenticity grading exactly as given in the evidence (Sahih, Hasan, Da'if, or ungraded). If a Hadith in the evidence is Da'if or weaker, say so plainly and do not present it with the same confidence as a Sahih narration.
  - If the evidence doesn't contain a Hadith relevant to the question, or the retrieved Hadith don't actually support the specific claim being asked about, say so explicitly rather than using an unrelated Hadith as if it answers the question.
  - Answer the specific question directly and once. Do not repeat the full Hadith below your answer when you have already quoted or summarized it in the answer.
- A narration appearing on a reference website, including Sunnah.com, is not itself proof of authenticity. The grading must come from the actual grading data already being used (multi-scholar grading / stated authenticity), not from the mere existence of the narration online.
- Use this internal certainty framework before answering:
  * Certain/Established: direct evidence clearly supports the claim; answer directly and confidently, citing the evidence and source after the answer rather than before it.
  * Strongly established: the evidence is strong and directly supports the claim, but wording should remain precise rather than overstating certainty.
  * Disputed: the evidence is genuinely mixed or scholars disagree; say that plainly and do not present one side as settled when the claim remains disputed.
  * Weak/Unverified: the support is limited, partial, or not strong enough to justify a firm conclusion; say so explicitly and avoid full confidence.
  * No reliable evidence: no trustworthy evidence is available; say so plainly and do not fill the gap by guessing.
- When real evidence is found and directly supports the claim, answer directly and confidently, put the evidence and source after the answer, not before it, and do not append the 'not verified' disclaimer in that case.
- Before finalizing any factual claim, check whether every important claim in this answer is supported by the evidence actually provided. If only partially supported, remove the unsupported parts or label them as uncertain rather than presenting them at full confidence.`,
    tafsir: `TAFSIR_MODE_INSTRUCTIONS:
- Never invent a Tafsir explanation or attribute one to a scholar or source not present in the evidence.
- Clearly distinguish the Quran's actual text from the scholarly explanation being given about it, they are not the same thing and must not be blended together as if the Tafsir IS the verse.
- If scholars in the evidence disagree, say so rather than presenting one interpretation as the only one.
- Use this internal certainty framework before answering:
  * Certain/Established: direct evidence clearly supports the claim; answer directly and confidently, citing the evidence and source after the answer rather than before it.
  * Strongly established: the evidence is strong and directly supports the claim, but wording should remain precise rather than overstating certainty.
  * Disputed: the evidence is genuinely mixed or scholars disagree; say that plainly and do not present one side as settled when the claim remains disputed.
  * Weak/Unverified: the support is limited, partial, or not strong enough to justify a firm conclusion; say so explicitly and avoid full confidence.
  * No reliable evidence: no trustworthy evidence is available; say so plainly and do not fill the gap by guessing.
- When real evidence is found and directly supports the claim, answer directly and confidently, put the evidence and source after the answer, not before it, and do not append the 'not verified' disclaimer in that case.
- Before finalizing any factual claim, check whether every important claim in this answer is supported by the evidence actually provided. If only partially supported, remove the unsupported parts or label them as uncertain rather than presenting them at full confidence.`,
    general: `GENERAL_MODE_INSTRUCTIONS:
   First classify the question as either ISLAMIC_CLAIM or GENERAL_KNOWLEDGE. ISLAMIC_CLAIM means it asks about a religious ruling, Islamic history, Hadith authenticity, Quranic interpretation, or another claim requiring Quran, Hadith, or scholarly verification. GENERAL_KNOWLEDGE means it concerns ordinary topics such as programming, science, geography, or general facts unrelated to Islam.
   If evidence is insufficient for an ISLAMIC_CLAIM, say so plainly rather than filling the gap with confident-sounding language. For GENERAL_KNOWLEDGE, answer normally from reliable general knowledge without an Islamic-source disclaimer.
   Never use hedging language or a 'withheld / withheld in accordance with scholarly verification standards' style disclaimer for universally established Islamic facts. This includes basic facts about the Prophet Muhammad (peace be upon him), major prophets, foundational pillars of Islam, the meaning of Allah, tawhid, basic beliefs in the Quran, the Five Pillars, and other claims that are broadly agreed upon in mainstream Sunni Islamic belief and carry no genuine scholarly dispute. For those cases, answer plainly and confidently without saying the answer is 'withheld', 'uncertain', or 'subject to further verification.' Reserve caution only for genuinely disputed, apocryphal, unverifiable, or unsupported claims.
   If the evidence includes a note of the form "Note: the word 'X' closely resembles the Islamic term 'Y', but is not an exact match.", do not silently choose one meaning. Acknowledge both readings briefly and clearly, for example: "If you meant Y, here's that. If you actually meant the literal word X, here's that instead." Keep it brief and do not present a single answer as certain when the wording is ambiguous.
   Use this internal certainty framework before answering:
   * Certain/Established: direct evidence clearly supports the claim; answer directly and confidently, citing the evidence and source after the answer rather than before it.
   * Strongly established: the evidence is strong and directly supports the claim, but wording should remain precise rather than overstating certainty.
   * Disputed: the evidence is genuinely mixed or the answer is contested; say that plainly and do not present one side as settled when the claim remains disputed.
   * Weak/Unverified: the support is limited, partial, or not strong enough to justify a firm conclusion; say so explicitly and avoid full confidence.
   * No reliable evidence: no trustworthy evidence is available; say so plainly and do not fill the gap by guessing.
   When real evidence is found and directly supports the claim, answer directly and confidently, put the evidence and source after the answer, not before it, and do not append the 'not verified' disclaimer in that case.
   Before finalizing any factual claim, check whether every important claim in this answer is supported by the evidence actually provided. If only partially supported, remove the unsupported parts or label them as uncertain rather than presenting them at full confidence.
   Begin your response with exactly one line: QUESTION_CLASS: ISLAMIC_CLAIM or QUESTION_CLASS: GENERAL_KNOWLEDGE. Do not repeat this classification elsewhere.`,
  };

  const selectedMode = sourceMode === 'quran' && modeInstructions.quran
    ? modeInstructions.quran
    : sourceMode === 'hadith' && modeInstructions.hadith
    ? modeInstructions.hadith
    : sourceMode === 'tafsir' && modeInstructions.tafsir
    ? modeInstructions.tafsir
    : modeInstructions.general;

  const blockName = sourceMode === 'quran' ? 'QURAN_MODE_INSTRUCTIONS'
    : sourceMode === 'hadith' ? 'HADITH_MODE_INSTRUCTIONS'
    : sourceMode === 'tafsir' ? 'TAFSIR_MODE_INSTRUCTIONS'
    : 'GENERAL_MODE_INSTRUCTIONS';
  console.log('System prompt mode used:', sourceMode, '-> block:', blockName);

  const noUsableEvidence = !evidence || evidence.trim() === '' || evidence === '(No usable evidence was retrieved.)';

  const system = [
    'You are an Islamic knowledge assistant.',
    noUsableEvidence
      ? 'If this is an Islamic claim, do not invent specific citations, Hadith numbers, Surah:Ayah references, named scholar quotes, or URLs. If this is general knowledge, answer normally from reliable general knowledge.'
      : 'Answer using only the evidence provided in this request.',
    noUsableEvidence ? '' : 'Never add outside facts, hadith, verses, or scholar names.',
    selectedMode,
    "Detect the language of the user's question and respond in that same language, regardless of the app's interface language.",
  ].join(' ');

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `QUESTION: ${query}\n\nEVIDENCE:\n${evidence || '(No usable evidence was retrieved.)'}` },
  ];

  console.log('EXACT_SYSTEM_PROMPT_FOR_GENERAL_REQUEST:\n' + system);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/gemini-3.5-flash-lite',
        messages,
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return {
        answer: 'The AI service is temporarily unavailable. Please try again later.',
        sources: retrievalSources,
        confident: false,
      };
    }

    const data = await response.json();
    let answer = data.choices?.[0]?.message?.content || '';
    const classificationMatch = answer.match(/^\s*QUESTION_CLASS\s*:\s*(ISLAMIC_CLAIM|GENERAL_KNOWLEDGE)\s*\n?/i);
    const isIslamicClaim = classificationMatch?.[1].toUpperCase() === 'ISLAMIC_CLAIM';
    if (classificationMatch) answer = answer.slice(classificationMatch[0].length).trimStart();

    // Only Islamic claims without primary-source evidence need this warning.
    if (noUsableEvidence && isIslamicClaim) {
      answer = answer + '\n\n⚠️ This answer was not verified against a specific cited source. Please verify with a trusted scholar or reference before relying on it.';
    }

    return {
      answer,
      sources: noUsableEvidence ? [] : retrievalSources,
      confident: Boolean(answer),
    };
  } catch (error) {
    console.error('Gemini fetch failed:', error.message);
    return {
      answer: 'Unable to connect to the AI service. Please try again.',
      sources: [],
      confident: false,
    };
  }
}

module.exports = { callLLM, callLLMWithSearch };