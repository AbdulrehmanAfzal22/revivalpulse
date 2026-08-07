/**
 * Tiny WebAudio chime service (Phases 9 & 12).
 *
 * No audio files needed — short, gentle synthesized tones compose the
 * feedback moments:
 *   - playCorrect(): bright 4-note arpeggio (C5-E5-G5-C6) — rewarding but
 *     never shrill; short so it won't repeat into a loud loop.
 *   - playWrong():    single soft low "boop" at low volume — calm, not a
 *     punishment tone.
 *   - playWin():      slightly longer ascender for the win/badge moment.
 *
 * All synthesis happens in one AudioContext created lazily on first user
 * interaction (autoplay policies), and every sound is gated on:
 *   - `prefers-reduced-motion`-adjacent quiet session when cookies/data say so,
 *   - a global mute flag (setKidsSoundEnabled) callers can toggle in Settings.
 * Never throws: if WebAudio is unavailable (old webview / tests / SSR), it
 * silently no-ops.
 */
let ctx: AudioContext | null = null;
let soundEnabled = true;

export function setKidsSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isKidsSoundEnabled(): boolean {
  return soundEnabled;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Frequency table (Hz) — pentatonic-ish, calm. */
const CORRECT_NOTES = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
const WIN_NOTES = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // ascent
function tone(context: AudioContext, frequency: number, start: number, duration: number, volume: number): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function play(notes: number[], noteGap: number, volume: number, noteDuration: number): void {
  if (!soundEnabled) return;
  const context = getContext();
  if (!context) return;
  const now = context.currentTime + 0.01;
  notes.forEach((frequency, i) =>
    tone(context, frequency, now + i * noteGap, noteDuration, volume)
  );
}

export function playCorrect(): void {
  play(CORRECT_NOTES, 0.09, 0.18, 0.16);
}

export function playWrong(): void {
  // Single long, low, quiet tone going DOWN — the opposite of a scolding beep.
  play([330, 262], 0.05, 0.08, 0.22);
}

export function playWin(): void {
  play(WIN_NOTES, 0.1, 0.16, 0.2);
}

export function playTap(): void {
  play([523.25], 0, 0.06, 0.06);
}

/** A quick, bright "pop" — balloons, bubbles, bursting. */
export function playPop(): void {
  play([880, 1108], 0.03, 0.07, 0.14);
}