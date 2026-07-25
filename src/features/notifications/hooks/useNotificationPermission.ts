import { useCallback, useEffect, useState } from 'react';

export type NotificationPermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

export interface UseNotificationPermissionResult {
  permission: NotificationPermissionState;
  request: () => Promise<NotificationPermissionState>;
}

function currentPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export default function useNotificationPermission(): UseNotificationPermissionResult {
  const [permission, setPermission] = useState<NotificationPermissionState>(currentPermission);

  useEffect(() => {
    setPermission(currentPermission());
  }, []);

  const request = useCallback(async (): Promise<NotificationPermissionState> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  return { permission, request };
}
