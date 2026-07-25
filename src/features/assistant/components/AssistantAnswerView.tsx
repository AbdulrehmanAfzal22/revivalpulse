import { AlertTriangle, BookText } from 'lucide-react';
import Typography from 'components/ui/Typography';
import AssistantSectionView from './AssistantSectionView';
import type { AssistantAnswer } from 'types/assistant.types';
import styles from './AssistantAnswerView.module.css';

export interface AssistantAnswerViewProps {
  answer: AssistantAnswer;
}

export default function AssistantAnswerView({ answer }: AssistantAnswerViewProps) {
  return (
    <div className={styles.wrapper}>
      {!answer.confident && (
        <div className={styles.notConfident}>
          <AlertTriangle size={16} />
          <Typography variant="caption">Not a confident, source-backed answer</Typography>
        </div>
      )}

      {answer.sections.map((section, index) => (
        <AssistantSectionView key={index} section={section} />
      ))}

      {answer.citations.length > 0 && (
        <div className={styles.citations}>
          <BookText size={14} />
          <Typography variant="caption" muted>
            {answer.citations.map((citation) => citation.label).join(' · ')}
          </Typography>
        </div>
      )}
    </div>
  );
}
