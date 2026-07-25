import { useEffect, useState } from 'react';
import useGeolocation from 'features/prayerTimes/hooks/useGeolocation';
import usePrayerTimes from 'features/prayerTimes/hooks/usePrayerTimes';
import { usePrayerTimesPreferencesStore } from 'stores/prayerTimesPreferencesStore';
import { useNotificationPreferencesStore } from 'stores/notificationPreferencesStore';
import { clearScheduledNotifications, scheduleTodayNotifications } from 'features/notifications/services/prayerNotificationScheduler';

function msUntilNextMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 5, 0);
  return midnight.getTime() - now.getTime();
}

/**
 * Invisible — mounted once in MainLayout. Re-renders itself once per day
 * (a local tick, not a query invalidation) so usePrayerTimes' dateKey rolls
 * over to tomorrow and today's notifications get rescheduled automatically.
 */
export default function PrayerNotificationScheduler() {
  const [, forceTick] = useState(0);
  const enabled = useNotificationPreferencesStore((state) => state.enabled);
  const enabledPrayers = useNotificationPreferencesStore((state) => state.enabledPrayers);
  const manualLocation = usePrayerTimesPreferencesStore((state) => state.manualLocation);
  const calculationMethodId = usePrayerTimesPreferencesStore((state) => state.calculationMethodId);
  const geolocation = useGeolocation();

  useEffect(() => {
    if (!enabled) return;
    if (!manualLocation) geolocation.requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    const timer = setTimeout(() => forceTick((tick) => tick + 1), msUntilNextMidnight());
    return () => clearTimeout(timer);
  }, []);

  const activeCoordinates = manualLocation ?? geolocation.coordinates;
  const prayerTimes = usePrayerTimes(enabled ? activeCoordinates : null, calculationMethodId);

  useEffect(() => {
    if (enabled && prayerTimes.data) {
      scheduleTodayNotifications(prayerTimes.data, enabledPrayers);
    } else {
      clearScheduledNotifications();
    }
    return clearScheduledNotifications;
  }, [enabled, prayerTimes.data, enabledPrayers]);

  return null;
}
