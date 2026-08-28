import { useEffect, useRef } from 'react';
import { useCollectionsStore } from 'stores/collectionsStore';
import type { Ayah } from 'types/quran.types';
import { useReadingPositionStore } from 'stores/readingPositionStore';

/** Logs the ayah that's stayed most visible for a moment as "read" (last read + history). */
export default function useReadingTracker(surahId: number, verses: Ayah[] | undefined): void {
  const logReading = useCollectionsStore((state) => state.logReading);
  const savePosition = useReadingPositionStore((state) => state.savePosition);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!verses || verses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;

        const verseNumber = mostVisible.target.id.replace('ayah-', '');
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          logReading(surahId, `${surahId}:${verseNumber}`);
          const ayah = verses.find((item) => item.verseNumber === Number(verseNumber));
          savePosition({
            module: 'quran',
            surahId,
            ayahNumber: Number(verseNumber),
            verseKey: `${surahId}:${verseNumber}`,
            scrollTop: window.scrollY,
            preview: ayah?.translations[0]?.text ?? ayah?.textUthmani ?? '',
            updatedAt: Date.now(),
          });
        }, 1500);
      },
      { threshold: [0.5] }
    );

    verses.forEach((ayah) => {
      const element = document.getElementById(`ayah-${ayah.verseNumber}`);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [surahId, verses, logReading, savePosition]);
}
