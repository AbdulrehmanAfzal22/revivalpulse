import { create } from 'zustand';
import { answerQuery } from 'api/ai/aiClient';
import type { AssistantMessage } from 'types/assistant.types';

function createId(): string {
  return crypto.randomUUID();
}

interface AssistantStoreState {
  isOpen: boolean;
  messages: AssistantMessage[];
  isAnswering: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  askQuestion: (text: string) => Promise<void>;
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

  askQuestion: async (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().isAnswering) return;

    const userMessage: AssistantMessage = { id: createId(), role: 'user', text: trimmed, createdAt: Date.now() };
    set((state) => ({ messages: [...state.messages, userMessage], isAnswering: true }));

    const answer = await answerQuery(trimmed);

    const assistantMessage: AssistantMessage = { id: createId(), role: 'assistant', answer, createdAt: Date.now() };
    set((state) => ({ messages: [...state.messages, assistantMessage], isAnswering: false }));
  },
}));
