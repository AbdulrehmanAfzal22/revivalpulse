import { Loader2, Mic, Square } from 'lucide-react';
import styles from './MicButton.module.css';

export type MicButtonStatus = 'idle' | 'loading' | 'listening';

export interface MicButtonProps {
  status: MicButtonStatus;
  onClick: () => void;
  label: string;
}

/**
 * The single primary control for the whole recitation screen — start,
 * loading, and listening are all the same big circular button so there's
 * never more than one obvious next action.
 */
export default function MicButton({ status, onClick, label }: MicButtonProps) {
  const classes = [styles.button, styles[status]].join(' ');

  return (
    <button type="button" className={classes} onClick={onClick} disabled={status === 'loading'} aria-label={label}>
      {status === 'listening' && (
        <>
          <span className={styles.ripple} />
          <span className={[styles.ripple, styles.rippleDelayed].join(' ')} />
        </>
      )}
      <span className={styles.iconSlot}>
        {status === 'loading' && <Loader2 size={28} className={styles.spinner} />}
        {status === 'idle' && <Mic size={28} />}
        {status === 'listening' && <Square size={24} fill="currentColor" />}
      </span>
    </button>
  );
}
