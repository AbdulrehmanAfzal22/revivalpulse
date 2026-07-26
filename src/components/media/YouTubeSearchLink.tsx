import { Video, ExternalLink } from 'lucide-react';
import styles from './YouTubeSearchLink.module.css';

export interface YouTubeSearchLinkProps {
  /** Passed straight to YouTube's own search-results page — never a hardcoded video id. */
  query: string;
  label: string;
}

/**
 * Links out to YouTube's real, live search-results page for a query,
 * opened in a new tab. Not an embed: YouTube's iframe `listType=search`
 * embed was deprecated years ago and returns an error page (confirmed live
 * before writing this) — a plain link to youtube.com/results is the only
 * approach that reliably shows real, current results without an API key.
 * Used for scholars/commentators with no digitized tafsir text on any
 * Quran API, so nothing here is a fabricated video link.
 */
export default function YouTubeSearchLink({ query, label }: YouTubeSearchLinkProps) {
  const href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
      <Video size={18} className={styles.icon} />
      <span className={styles.label}>{label}</span>
      <ExternalLink size={14} className={styles.externalIcon} />
    </a>
  );
}
