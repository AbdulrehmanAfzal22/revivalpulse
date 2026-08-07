/**
 * Normalized timeline (melodic intro offset).
 *
 * The recitation audio file starts with `introSeconds` of instrumental /
 * harmonized material that the user must never see or scrub through: in their
 * view the session starts at 0:00 the moment the first name could be heard.
 *
 * Two timelines therefore coexist:
 *  - REAL time: what the <audio> element and the store hold (`currentTime`,
 *    `duration`, seek targets, and the timestamps in namesTimestamps.json —
 *    which are ALWAYS measured against the real file).
 *  - DISPLAY time: real time minus the intro, clamped at 0. Every clock,
 *    progress fill, tick mark, and keyboard step in the UI is expressed in
 *    display time; fhe ONLY place it converts back is when the seek bar maps
 *    an on-screen position to a real element seek (display + intro).
 *
 * The TimestampSynchronizer (name lookup) deliberately stays in REAL time: a
 * name whose timestamp is `t` in the file must appear at real `t`, and its
 * display position is then `t - intro`. Only the presentation layer ever
 * applies these conversions.
 *
 * All helpers are pure and defensive: non-finite input yields a safe value so
 * a misbehaving media element can never produce NaN in the UI.
 */

/** Non-finite-friendly numeric default of 0. */
const ZERO = 0;

/** Maps a REAL playback instant to DISPLAY seconds, clamped at 0 (the intro is
 * invisible; the display never rings negative). */
export function toDisplaySeconds(realTime: number, introSeconds = ZERO): number {
  if (!Number.isFinite(realTime)) return ZERO;
  return Math.max(ZERO, realTime - introSeconds);
}

/** Maps a DISPLAY position back to REAL seconds (for actual element seeks). */
export function toRealSeconds(displayTime: number, introSeconds = ZERO): number {
  if (!Number.isFinite(displayTime)) return ZERO;
  return Math.max(ZERO, displayTime + introSeconds);
}

/** Total display duration = file duration minus the intro (seek-bar maximum). */
export function toDisplayDuration(duration: number, introSeconds = ZERO): number {
  if (!Number.isFinite(duration)) return ZERO;
  return Math.max(ZERO, duration - introSeconds);
}

/** The real position the player must seek to for a fresh pass (the intro itself). */
export function playbackStartRealSeconds(introSeconds = ZERO): number {
  return Number.isFinite(introSeconds) ? Math.max(ZERO, introSeconds) : ZERO;
}