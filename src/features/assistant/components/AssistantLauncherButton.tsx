import { Sparkles } from 'lucide-react';
import { useAssistantStore } from 'stores/assistantStore';
import styles from './AssistantLauncherButton.module.css';

export default function AssistantLauncherButton() {
  const toggle = useAssistantStore((state) => state.toggle);
  const isOpen = useAssistantStore((state) => state.isOpen);

  if (isOpen) return null;

  return (
    <button type="button" className={styles.button} onClick={toggle} aria-label="Open Islamic assistant">
      <Sparkles size={22} />
    </button>
  );
}
