let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * A short, soft two-note descending chime for "that word was wrong" —
 * synthesized rather than an audio file, so there's nothing to load or
 * host. Deliberately brief (~220ms) and quiet: long enough to notice,
 * short enough that it can't itself get mistaken for a spoken word if it
 * bleeds into the next microphone chunk, and it plays through the normal
 * output path (not muted) so the mic's echoCancellation — already
 * enabled in useMicrophoneChunks — can actually suppress it from being
 * picked back up, the same mechanism that keeps a video call from hearing
 * its own audio.
 */
export function playMistakeTone(): void {
  const context = getAudioContext();
  const now = context.currentTime;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + 0.22);
  gain.connect(context.destination);

  const playNote = (frequency: number, startOffset: number, duration: number): void => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + startOffset);
    oscillator.connect(gain);
    oscillator.start(now + startOffset);
    oscillator.stop(now + startOffset + duration);
  };

  playNote(392, 0, 0.1); // G4
  playNote(311, 0.1, 0.12); // Eb4 — soft descending minor third, not a harsh alarm
}

/**
 * A short, bright two-note ascending chime for positive coaching feedback
 * (encouragement, recovery) — the rising interval is a deliberate contrast
 * to playMistakeTone's descending one, so the two are distinguishable by
 * ear alone. Same synthesis approach (no audio file to load/host), same
 * brevity/quietness rationale.
 */
export function playEncouragementChime(): void {
  const context = getAudioContext();
  const now = context.currentTime;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + 0.2);
  gain.connect(context.destination);

  const playNote = (frequency: number, startOffset: number, duration: number): void => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + startOffset);
    oscillator.connect(gain);
    oscillator.start(now + startOffset);
    oscillator.stop(now + startOffset + duration);
  };

  playNote(392, 0, 0.1); // G4
  playNote(494, 0.1, 0.12); // B4 — rising major third
}
