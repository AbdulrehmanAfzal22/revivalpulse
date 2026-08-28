import styles from './SourcesUsed.module.css';

export interface SourceCitation {
  type: 'quran' | 'hadith' | 'tafsir' | 'dua' | 'google_search';
  reference: string;
  text: string;
  url?: string;
  collection?: string;
  number?: number;
}

export interface SourcesUsedProps {
  sources: SourceCitation[];
  confident: boolean;
}

function getSourceUrl(source: SourceCitation): string | undefined {
  if (source.url) return source.url;
  if (source.type === 'quran') {
    const match = source.reference.match(/(\d{1,3})\s*:\s*(\d{1,3})/);
    return match ? `https://quran.com/${match[1]}/${match[2]}` : undefined;
  }
  if (source.type === 'hadith' && source.collection && source.number !== undefined) {
    return `https://sunnah.com/${source.collection}:${source.number}`;
  }
  return undefined;
}

export function SourcesUsed({ sources }: SourcesUsedProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className={styles.list}>
      {sources.map((source) => {
        const typeLabel =
          source.type === 'quran'
            ? 'Quran'
            : source.type === 'hadith'
            ? 'Hadith'
            : source.type === 'tafsir'
            ? 'Tafsir'
            : source.type === 'google_search'
            ? 'Web Search'
            : 'Source';

        const referenceLabel = source.type === 'quran' ? source.reference : `${typeLabel}: ${source.reference}`;
        const url = getSourceUrl(source);

        return (
          url ? (
            <a key={`${source.reference}-${source.url}`} href={url} target="_blank" rel="noreferrer" className={styles.quoteBlock}>
              <span className={styles.label}>{referenceLabel}</span>
              <span className={styles.quote}>{source.text}</span>
              <span className={styles.externalHint}>Open public source</span>
            </a>
          ) : (
            <div key={source.reference} className={styles.quoteBlock}>
              <span className={styles.label}>{referenceLabel}</span>
              <span className={styles.quote}>{source.text}</span>
            </div>
          )
        );
      })}
    </div>
  );
}