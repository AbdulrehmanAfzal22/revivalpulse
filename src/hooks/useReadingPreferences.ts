import { useReadingPreferencesStore } from 'stores/readingPreferencesStore';

export default function useReadingPreferences() {
  const preferences = useReadingPreferencesStore((state) => state.preferences);
  const update = useReadingPreferencesStore((state) => state.update);
  const applyMode = useReadingPreferencesStore((state) => state.applyMode);

  return { preferences, update, applyMode };
}
