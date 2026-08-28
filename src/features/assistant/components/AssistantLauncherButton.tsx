import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import styles from './AssistantLauncherButton.module.css';

export default function AssistantLauncherButton() {
  const navigate = useNavigate();

  return (
    <button type="button" className={styles.button} onClick={() => navigate('/assistant')} aria-label="Open Islamic assistant">
      <Sparkles size={22} />
    </button>
  );
}