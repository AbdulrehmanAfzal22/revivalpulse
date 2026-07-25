import { create } from 'zustand';

const useThemeStore = create<Record<string, never>>(() => ({}));

export default useThemeStore;
