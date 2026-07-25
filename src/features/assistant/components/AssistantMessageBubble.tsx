import Typography from 'components/ui/Typography';
import AssistantAnswerView from './AssistantAnswerView';
import type { AssistantMessage } from 'types/assistant.types';
import styles from './AssistantMessageBubble.module.css';

export interface AssistantMessageBubbleProps {
  message: AssistantMessage;
}

export default function AssistantMessageBubble({ message }: AssistantMessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className={styles.userRow}>
        <Typography variant="body" className={styles.userBubble}>
          {message.text}
        </Typography>
      </div>
    );
  }

  return <div className={styles.assistantRow}>{message.answer && <AssistantAnswerView answer={message.answer} />}</div>;
}
