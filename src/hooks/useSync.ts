import { useSyncStore } from 'stores/syncStore';

export default function useSync() {
  const snapshots = useSyncStore((state) => state.snapshots);
  const syncOne = useSyncStore((state) => state.syncOne);
  const syncAll = useSyncStore((state) => state.syncAll);

  return { snapshots, syncOne, syncAll };
}
