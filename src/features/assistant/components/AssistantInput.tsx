import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import VoiceInputButton from './VoiceInputButton';
import styles from './AssistantInput.module.css';

const SUGGESTED_PROMPTS = ['Explain 2:255', 'Compare translations of 1:1', 'Hadith about intentions', 'Dua for traveling'];

export interface AssistantInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
  showSuggestions: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export default function AssistantInput({ onSubmit, disabled, showSuggestions, value: controlledValue, onChange }: AssistantInputProps) {
  const { t } = useTranslation();
  const [internalValue, setInternalValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const value = controlledValue ?? internalValue;
  const setValue = onChange ?? setInternalValue;

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap at 120px (roughly 4-5 lines)
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [value]);

  function submit(text: string) {
    if (!text.trim() || disabled) return;
    onSubmit(text);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, unless Shift+Enter (for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    const nextValue = value.trim() ? `${value.trim()} ${text}` : text;
    setValue(nextValue);
    textareaRef.current?.focus();
  };

  return (
    <div className={styles.wrapper}>
      {showSuggestions && (
        <div className={styles.suggestions}>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button key={prompt} type="button" className={styles.chip} onClick={() => submit(prompt)} disabled={disabled}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
      >
        <div className={styles.inputShell}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a verse, hadith, or dua… (Shift+Enter for new line)"
            disabled={disabled}
            className={styles.input}
            rows={1}
          />

          <div className={styles.actionCluster}>
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              disabled={disabled}
              className={styles.voiceButton}
              iconOnly
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={disabled || !value.trim()}
              aria-label="Send"
              leadingIcon={<Send size={16} />}
              className={styles.sendButton}
            />
          </div>
        </div>
      </form>

      <p className={styles.disclaimer}>This AI can make mistakes. Please double-check important answers.</p>
    </div>
  );
}
