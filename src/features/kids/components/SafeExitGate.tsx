import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldQuestion } from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import { playTap } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './SafeExitGate.module.css';

/**
 * Phase 13 — soft "please get an adult" speed bump on every path OUT of /kids.
 *
 * This is NOT a security feature: it's one gentle tap in front of anything
 * that leaves the Kids section — the main site, the parent dashboard's
 * external links, a story's YouTube embeds. A young child who taps the exit
 * icon (or a random navbar-less external link) gets the "Ask a grown-up to
 * help you leave" confirmation instead of silently ending 3 feet into the
 * adult app.
 *
 * Mechanics:
 *  - A capture-phase document click listens for the nearest <a> target.
 *  - Same-origin paths outside /kids AND all cross-origin links are blocked
 *    until confirmed. Anything still inside /kids / a pure #hash / tel:/
 *    mailto: passes straight through.
 *  - On confirm, navigation proceeds exactly as the link intended
 *    (window.location.href absolutes the decision — SPA vs external at once).
 *
 * Mounted once in KidsLayout, so every kids route is covered.
 */

const KIDS_ROOT = '/kids';

function linkBlocked(href: string): boolean {
  const url = new URL(href, window.location.href);
  // Non-http(s) schemes (mailto:, tel:) are fine — they don't wander the app.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  // Cross-origin links (stories' YouTube embeds, parent external links) leave the app.
  if (url.origin !== window.location.origin) return true;
  // Same-origin: block anything that leaves the kids area.
  const path = url.pathname;
  return path !== KIDS_ROOT && !path.startsWith(`${KIDS_ROOT}/`);
}

export default function SafeExitGate() {
  const { t } = useTranslation();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pendingUrlRef = useRef<string | null>(null);

  const handleClick = useCallback((event: Event) => {
    const target = event.target as Element | null;
    const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!anchor || !anchor.href) return;

    if (!anchor.href.startsWith('#')) {
      try {
        if (!linkBlocked(anchor.href)) return;
      } catch {
        return; // unparsable href — let it through
      }
      event.preventDefault();
      event.stopPropagation();
      pendingUrlRef.current = anchor.href;
      setPendingHref(anchor.href);
      playTap();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [handleClick]);

  const stayHere = () => {
    pendingUrlRef.current = null;
    setPendingHref(null);
  };

  const leaveKidsMode = () => {
    const target = pendingUrlRef.current;
    pendingUrlRef.current = null;
    setPendingHref(null);
    if (target) window.location.assign(target);
  };

  const isOpen = pendingHref !== null;

  return (
    <Dialog isOpen={isOpen} onClose={stayHere}>
      <div className={styles.gate}>
        <span className={styles.icon}>
          <ShieldQuestion size={44} aria-hidden="true" />
        </span>
        <Typography variant="h3" as="h2" className={styles.title}>
          {t('kids.safeExitTitle')}
        </Typography>
        <Typography variant="body" muted className={styles.body}>
          {t('kids.safeExitBody')}
        </Typography>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={stayHere} className={styles.stayButton}>
            {t('kids.safeExitStay')}
          </Button>
          <Button variant="primary" onClick={leaveKidsMode} className={styles.leaveButton}>
            {t('kids.safeExitLeave')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}