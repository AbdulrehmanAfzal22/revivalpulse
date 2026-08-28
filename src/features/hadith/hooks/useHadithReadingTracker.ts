import { useEffect, useRef } from 'react';
import { useReadingPositionStore } from 'stores/readingPositionStore';
import type { Hadith } from 'types/hadith.types';

export default function useHadithReadingTracker(bookSlug: string, chapterId: number, hadiths: Hadith[] | undefined): void {
  const savePosition = useReadingPositionStore((state) => state.savePosition);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hadiths || hadiths.length === 0 || !Number.isInteger(chapterId)) return;
    const observer = new IntersectionObserver((entries) => {
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!mostVisible) return;

      const hadithNumber = Number(mostVisible.target.id.replace('hadith-', ''));
      const hadith = hadiths.find((item) => item.idInBook === hadithNumber);
      if (!hadith) return;
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        savePosition({
          module: 'hadith',
          bookSlug,
          chapterId,
          hadithNumber,
          scrollTop: window.scrollY,
          preview: hadith.englishText,
          updatedAt: Date.now(),
        });
      }, 1200);
    }, { threshold: [0.5] });

    hadiths.forEach((hadith) => {
      const element = document.getElementById(`hadith-${hadith.idInBook}`);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [bookSlug, chapterId, hadiths, savePosition]);
}
