/**
 * Standard tajweed color legend — sourced from alquran.cloud's published
 * tajweed guide (https://alquran.cloud/tajweed-guide), which uses the same
 * rule-class names as quran.com's `text_uthmani_tajweed` markup this
 * parser consumes. Not invented: these are the conventional colors used
 * across tajweed-annotated mushafs and apps.
 */
export const TAJWEED_RULE_COLORS: Record<string, string> = {
  ham_wasl: '#AAAAAA',
  laam_shamsiyah: '#AAAAAA',
  slnt: '#AAAAAA',
  madda_normal: '#537FFF',
  madda_permissible: '#4050FF',
  madda_necessary: '#000EBC',
  madda_obligatory: '#2144C1',
  qalaqah: '#DD0008',
  ikhafa_shafawi: '#D500B7',
  ikhafa: '#9400A8',
  idgham_shafawi: '#58B800',
  iqlab: '#26BFFD',
  idgham_ghunnah: '#169777',
  idgham_wo_ghunnah: '#169200',
  idgham_mutajanisayn: '#A1A1A1',
  idgham_mutaqaribayn: '#A1A1A1',
  ghunnah: '#FF7E1E',
};

export const TAJWEED_RULE_LABELS: Record<string, string> = {
  ham_wasl: 'Hamzat al-wasl (silent connecting hamza)',
  laam_shamsiyah: 'Lam shamsiyyah (assimilated, silent)',
  slnt: 'Silent letter',
  madda_normal: 'Madd — 2 counts',
  madda_permissible: 'Madd jaiz — 2, 4 or 6 counts',
  madda_necessary: 'Madd lazim — 6 counts (obligatory)',
  madda_obligatory: 'Madd wajib — 4–5 counts',
  qalaqah: 'Qalqalah (echoing bounce)',
  ikhafa_shafawi: 'Ikhfa shafawi (hidden, with meem)',
  ikhafa: "Ikhfa (hidden noon/tanween)",
  idgham_shafawi: 'Idgham shafawi (merging with meem)',
  iqlab: "Iqlab (noon/tanween → meem sound)",
  idgham_ghunnah: 'Idgham with ghunnah (merging, nasalized)',
  idgham_wo_ghunnah: 'Idgham without ghunnah',
  idgham_mutajanisayn: 'Idgham mutajanisayn (same articulation point)',
  idgham_mutaqaribayn: 'Idgham mutaqaribayn (near articulation point)',
  ghunnah: 'Ghunnah (nasal resonance, 2 counts)',
};

/** Words containing any of these rules involve elongation — used by the madd-timing heuristic in wordTracker. */
export const MADD_RULE_CLASSES = new Set([
  'madda_normal',
  'madda_permissible',
  'madda_necessary',
  'madda_obligatory',
]);

export interface TajweedSegment {
  text: string;
  ruleClass: string | null;
}

export interface TajweedWord {
  segments: TajweedSegment[];
}

const TAJWEED_MARKUP_REGEX = /<tajweed class=([a-z_]+)>([^<]*)<\/tajweed>|<span class=end>([^<]*)<\/span>/g;

function parseRuns(markup: string): TajweedSegment[] {
  const runs: TajweedSegment[] = [];
  let lastIndex = 0;
  TAJWEED_MARKUP_REGEX.lastIndex = 0;

  let match = TAJWEED_MARKUP_REGEX.exec(markup);
  while (match !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: markup.slice(lastIndex, match.index), ruleClass: null });
    }
    if (match[1] !== undefined) {
      runs.push({ text: match[2] ?? '', ruleClass: match[1] });
    }
    // match[3] is the `<span class=end>` ayah-number marker — dropped, since
    // the app already renders its own ayah-number marker separately.
    lastIndex = TAJWEED_MARKUP_REGEX.lastIndex;
    match = TAJWEED_MARKUP_REGEX.exec(markup);
  }

  if (lastIndex < markup.length) {
    runs.push({ text: markup.slice(lastIndex), ruleClass: null });
  }
  return runs;
}

/**
 * Groups the flat, tag-boundary-preserving run list into words split on
 * whitespace, merging consecutive same-rule runs within a word into one
 * segment so a word made of several same-colored letters doesn't get
 * needlessly fragmented into one <span> per character.
 */
export function parseTajweedWords(markup: string): TajweedWord[] {
  const runs = parseRuns(markup);
  const words: TajweedWord[] = [];
  let currentWord: TajweedSegment[] = [];

  const flushWord = (): void => {
    if (currentWord.length > 0) {
      words.push({ segments: currentWord });
      currentWord = [];
    }
  };

  for (const run of runs) {
    const pieces = run.text.split(/(\s+)/);
    for (const piece of pieces) {
      if (piece === '') continue;
      if (/^\s+$/.test(piece)) {
        flushWord();
        continue;
      }
      const last = currentWord[currentWord.length - 1];
      if (last && last.ruleClass === run.ruleClass) {
        last.text += piece;
      } else {
        currentWord.push({ text: piece, ruleClass: run.ruleClass });
      }
    }
  }
  flushWord();

  return words;
}

export function isMaddWord(word: TajweedWord): boolean {
  return word.segments.some((segment) => segment.ruleClass !== null && MADD_RULE_CLASSES.has(segment.ruleClass));
}
