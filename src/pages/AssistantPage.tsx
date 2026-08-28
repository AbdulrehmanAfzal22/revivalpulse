import { useEffect, useState, useRef } from 'react';
import { useAssistantStore } from 'stores/assistantStore';
import { SourceMode, SourceDropdown } from 'features/assistant/components/SourceDropdown';
import { SourcesUsed } from 'features/assistant/components/SourcesUsed';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AssistantInput from 'features/assistant/components/AssistantInput';
import VoiceInputButton from 'features/assistant/components/VoiceInputButton';
import Typography from 'components/ui/Typography';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './AssistantPage.module.css';

export default function AssistantPage() {
  const { t } = useTranslation();
  const isAnswering = useAssistantStore((state) => state.isAnswering);
  const messages = useAssistantStore((state) => state.messages);
  const askQuestion = useAssistantStore((state) => state.askQuestion);
  const [sourceMode, setSourceMode] = useState<SourceMode>('general');
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmitMessage = (text: string) => {
    // Insert the transcribed text into the chat input and send it
    // This goes through the exact same pipeline as typed questions
    askQuestion({ text, sourceMode });
    setDraft('');
  };

  const handleVoiceTranscript = (text: string) => {
    setDraft((current) => (current.trim() ? `${current.trim()} ${text}` : text));
  };

  return (
    <div className={styles.page}>
      {/* Header with title and dropdown - sticky at top */}
      <div className={styles.header}>
        <div className={styles.contentWidth}>
          <div className="flex items-center justify-between gap-4">
            <Typography variant="h2" className="text-lg md:text-xl">
              {t('assistant.title')}
            </Typography>
            <SourceDropdown mode={sourceMode} onModeChange={setSourceMode} />
          </div>
        </div>
      </div>

      {/* Messages area - scrollable, takes remaining space */}
      <div className={styles.messagesArea}>
        <div className={styles.contentWidth}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <EmptyState
                icon={<Sparkles size={24} />}
                title={t('emptyState.assistant.title')}
                description={t('emptyState.assistant.description')}
              />
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${message.role === 'user' ? styles.userRow : styles.assistantRow}`}
                >
                  <div
                    className={`${styles.messageBubble} ${message.role === 'user' ? styles.userBubble : styles.assistantBubble}`}
                  >
                    {message.role === 'user' && (
                      <p className="text-sm leading-relaxed">{message.text ?? ''}</p>
                    )}

                    {message.role === 'assistant' && (
                      <div className="space-y-2 text-sm">
                        {message.answer && message.answer.sections && message.answer.sections.length > 0 && (
                          <div className="space-y-2">
                            {message.answer.sections.map((section, sectionIdx) => {
                              if (section.kind === 'verse') {
                                return (
                                  <div key={sectionIdx} className="space-y-1">
                                    <p className="text-xs font-medium text-primary">
                                      {section.surahLabel} {section.verseKey}
                                    </p>
                                    <p className="text-sm leading-relaxed">{section.arabic}</p>
                                    {section.translations?.length > 0 && (
                                      <p className="text-xs opacity-75">
                                        {section.translations.map((tr) => tr.label).join(', ')}
                                      </p>
                                    )}
                                  </div>
                                );
                              }

                              if (section.kind === 'hadith') {
                                return (
                                  <div key={sectionIdx} className="space-y-1">
                                    <p className="text-xs font-medium text-primary">
                                      {section.bookName} #{section.idInBook}
                                    </p>
                                    <p className="text-sm leading-relaxed">
                                      {section.arabic || section.englishText}
                                    </p>
                                    <p className="text-xs opacity-75">
                                      Narrated by {section.narrator || 'Unknown'}
                                    </p>
                                  </div>
                                );
                              }

                              if (section.kind === 'dua') {
                                return (
                                  <div key={sectionIdx} className="space-y-1">
                                    <p className="text-xs font-medium text-primary">{section.title}</p>
                                    <p className="text-sm leading-relaxed">{section.arabic}</p>
                                    {section.translation && (
                                      <p className="text-xs opacity-75">{section.translation}</p>
                                    )}
                                  </div>
                                );
                              }

                              if (section.kind === 'tafsir') {
                                return (
                                  <div key={sectionIdx} className="space-y-1">
                                    <p className="text-xs font-medium text-primary">
                                      Tafsir: {section.authorName}
                                    </p>
                                    <p className="text-sm leading-relaxed">{section.text}</p>
                                  </div>
                                );
                              }

                              if (section.kind === 'note') {
                                return (
                                  <div key={sectionIdx} className="text-xs italic opacity-75">
                                    <ReactMarkdown>{section.text}</ReactMarkdown>
                                  </div>
                                );
                              }

                              return null;
                            })}
                          </div>
                        )}

                        {message.answer && message.answer.confident && message.answer.sources && (message.answer.sources as any[]).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/20">
                            <SourcesUsed sources={message.answer.sources} confident={message.answer.confident} />
                          </div>
                        )}

                        {!message.answer && message.text && (
                          <p className="text-xs italic text-muted-foreground">
                            {t('assistant.lookingThatUp')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed input bar at bottom of viewport */}
      <div className={styles.composerBar}>
        <div className={styles.contentWidth}>
          <div className={styles.composer}>
            <div className={styles.inputWrap}>
              <AssistantInput
                onSubmit={handleSubmitMessage}
                disabled={isAnswering}
                showSuggestions={messages.length === 0}
                value={draft}
                onChange={setDraft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}