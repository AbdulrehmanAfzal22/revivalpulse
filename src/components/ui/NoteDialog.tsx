import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import useTranslation from 'hooks/useTranslation';
import Dialog from './Dialog';
import Button from './Button';
import styles from './NoteDialog.module.css';

export interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string | null;
  onSave: (text: string) => void;
  onDelete: () => void;
}

export default function NoteDialog({ isOpen, onClose, title, value, onSave, onDelete }: NoteDialogProps) {
  const [text, setText] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) setText(value ?? '');
  }, [isOpen, value]);

  const handleSave = (): void => {
    if (text.trim()) {
      onSave(text.trim());
    } else {
      onDelete();
    }
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t('common.notePlaceholder')}
        rows={5}
        autoFocus
      />
      <div className={styles.actions}>
        <Button
          variant="ghost"
          onClick={() => {
            onDelete();
            onClose();
          }}
          leadingIcon={<Trash2 size={16} />}
        >
          {t('common.delete')}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {t('common.save')}
        </Button>
      </div>
    </Dialog>
  );
}
