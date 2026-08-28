import { create } from 'zustand';
import { answerQuery } from 'api/ai/aiClient';
import type { AssistantMessage, SourceMode } from 'types/assistant.types';

function createId(): string {
  return crypto.randomUUID();
}

interface AskQuestionParams {
  text: string;
  language?: string;
  sourceMode?: SourceMode;
}

interface AssistantStoreState {
  isOpen: boolean;
  messages: AssistantMessage[];
  isAnswering: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  askQuestion: (params: AskQuestionParams) => Promise<void>;
}

/**
 * Session-only (no persist middleware, no sync domain) — conversation
 * history isn't asked for as something that follows the user across
 * devices, so it resets on reload rather than adding sync surface for it.
 */
export const useAssistantStore = create<AssistantStoreState>((set, get) => ({
  isOpen: false,
  messages: [],
  isAnswering: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  askQuestion: async ({ text, language, sourceMode }) => {
    const trimmed = text.trim();
    if (!trimmed || get().isAnswering) return;

    const userMessage: AssistantMessage = { id: createId(), role: 'user', text: trimmed, createdAt: Date.now() };
    set((state) => ({ messages: [...state.messages, userMessage], isAnswering: true }));

    try {
      const answer = await answerQuery(trimmed, sourceMode, language);
      const assistantMessage: AssistantMessage = { id: createId(), role: 'assistant', answer, createdAt: Date.now() };
      set((state) => ({ messages: [...state.messages, assistantMessage] }));
    } finally {
      set({ isAnswering: false });
    }
  },
}));
