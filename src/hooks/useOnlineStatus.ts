import { useEffect, useState } from 'react';
import { isOnline } from 'services/connectivity';
import { useDevModeStore } from 'stores/devModeStore';

export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(isOnline);
  const forceOffline = useDevModeStore((state) => state.flags.forceOffline);

  useEffect(() => {
    const handleChange = (): void => setOnline(isOnline());

    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
    };
  }, []);

  // The window events above only fire for real connectivity changes — toggling the
  // dev-mode flag itself needs its own re-check since it's not a browser event.
  useEffect(() => {
    setOnline(isOnline());
  }, [forceOffline]);

  return online;
}
