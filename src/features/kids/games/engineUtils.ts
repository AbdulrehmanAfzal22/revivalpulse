import type { StudyItem, KidsStudyTopic } from 'data/kids/gameContent';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';

/** Fisher–Yates shuffle — new array, original untouched. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/** `count` distinct random items from the pool. */
export function sample<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

/** Round-robin target so every round of a session picks a new item. */
export function pickTarget(pack: KidsStudyTopic, round: number): StudyItem {
  const pool = KIDS_STUDY_SETS[pack];
  return pool[round % pool.length] as StudyItem;
}

/** `count` distinct decoys for the target (never the target itself). */
export function pickDecoys(pack: KidsStudyTopic, target: StudyItem, count: number): StudyItem[] {
  return sample(
    KIDS_STUDY_SETS[pack].filter((item) => item.id !== target.id),
    count,
  );
}
