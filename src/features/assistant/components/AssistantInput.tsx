import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from 'components/ui/Button';
import styles from './AssistantInput.module.css';

const SUGGESTED_PROMPTS = ['Explain 2:255', 'Compare translations of 1:1', 'Hadith about intentions', 'Dua for traveling'];

export interface AssistantInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
  showSuggestions: boolean;
}

export default function AssistantInput({ onSubmit, disabled, showSuggestions }: AssistantInputProps) {
  const [value, setValue] = useState('');

  function submit(text: string) {
    if (!text.trim() || disabled) return;
    onSubmit(text);
    setValue('');
  }

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
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about a verse, hadith, or dua…"
          disabled={disabled}
          className={styles.input}
        />
        <Button type="submit" variant="primary" size="sm" disabled={disabled || !value.trim()} aria-label="Send" leadingIcon={<Send size={16} />} />
      </form>
    </div>
  );
}
