import { Volume2 } from 'lucide-react';
import useWordAudio from 'features/quranReader/hooks/useWordAudio';
import useWordMorphology from 'features/quranReader/hooks/useWordMorphology';
import { usePlaybackStore } from 'stores/playbackStore';
import { useReadingPreferencesStore } from 'stores/readingPreferencesStore';
import type { Word } from 'types/word.types';
import type { ReadingDirection } from 'types/readingPreferences.types';
import useTranslation from 'hooks/useTranslation';
import styles from './WordByWord.module.css';

export interface WordByWordProps {
  words: Word[];
  surahId: number;
  direction: ReadingDirection;
}

export default function WordByWord({ words, surahId, direction }: WordByWordProps) {
  const { play } = useWordAudio();
  const morphologyQuery = useWordMorphology(surahId);
  const activeVerseKey = usePlaybackStore((state) => state.verseKey);
  const activeWordPosition = usePlaybackStore((state) => state.activeWordPosition);
  const wordHighlightEnabled = useReadingPreferencesStore((state) => state.preferences.wordHighlightEnabled);
  const { t } = useTranslation();

  const displayWords = words.filter((word) => word.charType === 'word');

  return (
    <p className={styles.line} dir={direction} lang="ar">
      {displayWords.map((word) => {
        const ayahNumber = word.verseKey.split(':')[1];
        const morphology = morphologyQuery.data?.[`${ayahNumber}:${word.position}`];
        const isActive =
          wordHighlightEnabled && activeVerseKey === word.verseKey && activeWordPosition === word.position;
        const hasInfo = Boolean(word.translation || word.transliteration || morphology);

        return (
          <button
            key={word.id}
            type="button"
            className={[styles.word, isActive && styles.wordActive].filter(Boolean).join(' ')}
            onClick={() => play(word)}
            disabled={!word.audioUrl}
          >
            <span className={styles.arabic}>{word.textUthmani}</span>

            {word.audioUrl && (
              <span className={styles.playIcon} aria-hidden="true">
                <Volume2 size={11} />
              </span>
            )}

            {hasInfo && (
              <span className={[styles.tooltip, isActive && styles.tooltipVisible].filter(Boolean).join(' ')}>
                {word.translation && <span className={styles.tooltipTranslation}>{word.translation}</span>}
                {word.transliteration && (
                  <span className={styles.tooltipTransliteration}>{word.transliteration}</span>
                )}
                {morphology?.root && (
                  <span className={styles.tooltipMeta}>{t('quran.rootLabel', { root: morphology.root })}</span>
                )}
                {morphology && (morphology.grammar.length > 0 || morphology.pos) && (
                  <span className={styles.tooltipMeta}>
                    {[morphology.pos, ...morphology.grammar].filter(Boolean).join(' · ')}
                  </span>
                )}
              </span>
            )}
          </button>
        );
      })}
    </p>
  );
}
