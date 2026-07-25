export interface DivineName {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  description: string;
  /** public/audio/asma-ul-husna/{number}.mp3 — see public/audio/asma-ul-husna/ATTRIBUTION.md */
  audioUrl: string;
}
