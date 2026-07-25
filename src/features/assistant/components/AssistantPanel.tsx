import { useEffect, useRef } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import Drawer from 'components/ui/Drawer';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import AssistantMessageBubble from './AssistantMessageBubble';
import AssistantInput from './AssistantInput';
import { useAssistantStore } from 'stores/assistantStore';
import useTranslation from 'hooks/useTranslation';
import styles from './AssistantPanel.module.css';

export default function AssistantPanel() {
  const { t } = useTranslation();
  const isOpen = useAssistantStore((state) => state.isOpen);
  const close = useAssistantStore((state) => state.close);
  const messages = useAssistantStore((state) => state.messages);
  const isAnswering = useAssistantStore((state) => state.isAnswering);
  const askQuestion = useAssistantStore((state) => state.askQuestion);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isAnswering]);

  return (
    <Drawer isOpen={isOpen} onClose={close} side="right">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Sparkles size={18} />
            <Typography variant="h4" as="p">
              {t('assistant.title')}
            </Typography>
          </div>
          <Button variant="icon" aria-label={t('assistant.close')} onClick={close} leadingIcon={<X size={18} />} />
        </div>

        <div ref={listRef} className={styles.messages} role="log" aria-live="polite" aria-busy={isAnswering}>
          {messages.length === 0 && (
            <EmptyState
              icon={<Sparkles size={20} />}
              title={t('emptyState.assistant.title')}
              description={t('emptyState.assistant.description')}
            />
          )}

          {messages.map((message) => (
            <AssistantMessageBubble key={message.id} message={message} />
          ))}

          {isAnswering && (
            <div className={styles.typing}>
              <Loader2 size={16} className={styles.spin} />
              <Typography variant="caption" muted>
                {t('assistant.lookingThatUp')}
              </Typography>
            </div>
          )}
        </div>

        <AssistantInput onSubmit={(text) => void askQuestion(text)} disabled={isAnswering} showSuggestions={messages.length === 0} />
      </div>
    </Drawer>
  );
}
