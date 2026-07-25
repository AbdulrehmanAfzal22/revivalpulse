import { useCallback, useEffect, useRef, useState } from 'react';
import type { CompassSupport } from 'types/qibla.types';

/** iOS 13+ only — not in standard lib.dom.d.ts. */
interface IOSDeviceOrientationEventConstructor {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

type OrientationEventWithCompass = DeviceOrientationEvent & { webkitCompassHeading?: number };

export interface UseDeviceOrientationResult {
  /** Degrees from north the device is currently facing, or null until a reading arrives. */
  heading: number | null;
  support: CompassSupport;
  /** Must be called from a user gesture (e.g. a button click) — iOS requires this to grant access. */
  requestPermission: () => Promise<void>;
}

/**
 * How long to wait for a first genuine heading reading before concluding the
 * device has no usable compass (no magnetometer, insecure context, blocked
 * sensor Permissions-Policy, etc.) and falling back to the static-dial UI.
 */
const NO_READING_TIMEOUT_MS = 3000;

/**
 * Cross-browser compass heading has known platform inconsistencies in which
 * direction `alpha` increases — this uses the widely-used convention
 * (heading = 360 - alpha for non-webkit events). Treated as best-effort,
 * not lab-precise, which is why `support` still separately reports whether
 * live rotation is available at all.
 */
export default function useDeviceOrientation(): UseDeviceOrientationResult {
  const [heading, setHeading] = useState<number | null>(null);
  const [support, setSupport] = useState<CompassSupport>('unknown');
  const listenerAttached = useRef(false);
  const hasReading = useRef(false);
  const handlerRef = useRef<((event: Event) => void) | null>(null);

  const attachListener = useCallback(() => {
    if (listenerAttached.current) return;
    listenerAttached.current = true;

    const handleOrientation = (event: Event): void => {
      const orientationEvent = event as OrientationEventWithCompass;

      if (typeof orientationEvent.webkitCompassHeading === 'number') {
        hasReading.current = true;
        setHeading(orientationEvent.webkitCompassHeading);
        setSupport('supported');
        return;
      }

      // Plain `deviceorientation`'s `alpha`, without `absolute: true`, is only
      // referenced to whatever orientation the device had when tracking
      // started — not true north. Trusting it produces a needle that *moves*
      // convincingly but points a consistently wrong direction, so it's
      // ignored entirely rather than reported as a real heading.
      const isAbsolute = event.type === 'deviceorientationabsolute' || orientationEvent.absolute === true;

      // Per spec, a browser with no orientation sensor at all still fires a
      // single event with every field (including alpha) set to null — that
      // is NOT a reading. Without this null check, that one-time event would
      // permanently mark the device "supported" with a heading that never
      // arrives, and the "no live compass" fallback would never surface.
      if (isAbsolute && orientationEvent.alpha !== null) {
        hasReading.current = true;
        setHeading((360 - orientationEvent.alpha) % 360);
        setSupport('supported');
      }
    };

    handlerRef.current = handleOrientation;
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    // Some devices/browsers pass every feature-detection check yet never
    // actually deliver an orientation event (no magnetometer, insecure
    // context, blocked Permissions-Policy). Without this watchdog, `support`
    // stays optimistically 'supported' forever and the "no live compass"
    // fallback copy never surfaces — the compass just silently never moves.
    window.setTimeout(() => {
      if (!hasReading.current) setSupport('unsupported');
    }, NO_READING_TIMEOUT_MS);
  }, []);

  const requestPermission = useCallback(async () => {
    const ctor = window.DeviceOrientationEvent as unknown as IOSDeviceOrientationEventConstructor;
    if (typeof ctor.requestPermission !== 'function') {
      attachListener();
      return;
    }

    try {
      const result = await ctor.requestPermission();
      if (result === 'granted') {
        setSupport('supported');
        attachListener();
      } else {
        setSupport('unsupported');
      }
    } catch {
      setSupport('unsupported');
    }
  }, [attachListener]);

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setSupport('unsupported');
      return;
    }

    const ctor = window.DeviceOrientationEvent as unknown as IOSDeviceOrientationEventConstructor;
    if (typeof ctor.requestPermission === 'function') {
      setSupport('permission-required');
      return;
    }

    setSupport('supported');
    attachListener();
  }, [attachListener]);

  // Listener may attach either on mount (non-iOS branch above) or later, from
  // a user gesture via requestPermission (iOS) — this covers both by always
  // detaching whatever is in handlerRef.current on unmount. Resetting the
  // guard refs here (not just removing listeners) matters because React 18
  // StrictMode's dev-only mount→cleanup→remount simulation reuses the same
  // refs across that cycle: without resetting `listenerAttached`, attachListener's
  // own guard would see it still `true` from the first mount and silently
  // skip re-attaching on the simulated remount, leaving zero live listeners.
  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        window.removeEventListener('deviceorientationabsolute', handlerRef.current, true);
        window.removeEventListener('deviceorientation', handlerRef.current, true);
      }
      listenerAttached.current = false;
      hasReading.current = false;
      handlerRef.current = null;
    };
  }, []);

  return { heading, support, requestPermission };
}
