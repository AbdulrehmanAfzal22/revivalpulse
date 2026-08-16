import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpDown,
  Balloon,
  BookOpen,
  Brain,
  Eye,
  Hammer,
  Hash,
  Heart,
  Images,
  Languages,
  Layers,
  ListOrdered,
  MoveRight,
  Pencil,
  Puzzle,
  Repeat,
  Scale,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Timer,
  Volume2,
  Zap,
} from 'lucide-react';
import type { TranslationKey } from 'i18n';
import type { KidsStudyTopic } from 'data/kids/gameContent';

/**
 * KIDS GAMES REDESIGN — CONFIRMED CLASSIFICATION (source of truth)
 *
 * This block records the agreed-upon disposition for every game in the registry.
 * Do not deviate from this classification in later phases without explicit
 * discussion and updating this comment.
 *
 * KEEP — UI polish only (mechanics frozen, visual upgrades only):
 *   - matching (match)
 *   - memory (memory)
 *   - balloon-pop (pop)
 *   - spot-same (spot)
 *   - letter-hunt (hunt)
 *   - order-line (order)
 *   - build-word (spell)
 *   - count-stars (countstars)
 *   - letter-count (lettercount)
 *   - word-finder (wordfinder)
 *
 * KEEP — Content expansion only (mechanics frozen, grow question banks):
 *   - true-false (truefalse)
 *   - story-quiz (storyquiz)
 *
 * REPLACED — 8 games removed and replaced with new distinct mechanics:
 *   - catch → halal-haram (halalharam)
 *   - whack → good-manners (goodmanners)
 *   - big-small → wudu-order (wuduorder) — REMOVED, replaced by quran-echo
 *   - whats-missing → names-meaning (namesmeaning)
 *   - pattern-repeat → prophet-timeline (prophettimeline)
 *   - next-in-line → cause-effect (causeeffect)
 *   - missing-letter → dua-moment (duamoment)
 *   - more-or-less → letter-sound (lettersound)
 *
 * Last confirmed: Phase 8 Additions
 */

/** Engine ids → one per distinct interaction mechanic. */
export type EngineId =
  | 'match'
  | 'memory'
  | 'pop'
  | 'spot'
  | 'hunt'
  | 'order'
  | 'spell'
  | 'countstars'
  | 'lettercount'
  | 'wordfinder'
  | 'truefalse'
  | 'storyquiz'
  | 'halalharam'
  | 'goodmanners'
  | 'namesmeaning'
  | 'prophettimeline'
  | 'causeeffect'
  | 'duamoment'
  | 'lettersound'
  | 'quranecho';

export interface GameSpec {
  /** Stable id — route segment and per-game rewards tally. */
  id: string;
  engine: EngineId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: LucideIcon;
  color: string;
  gradient: string;
  /** Content packs the engine accepts (hub shows chips when more than one). */
  packs: KidsStudyTopic[];
}

/**
 * Kids game registry — the single source of truth for the games hub.
 * One entry per engine: each entry is a genuinely different interaction.
 */
export const GAMES: GameSpec[] = [
  {
    id: 'matching',
    engine: 'match',
    titleKey: 'kids.gameMatching',
    descKey: 'kids.gameMatchingDesc',
    icon: Images,
    color: '#2f9e7f',
    gradient: 'linear-gradient(135deg, #d9f6ea, #a9e9cd)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'memory',
    engine: 'memory',
    titleKey: 'kids.gameMemory',
    descKey: 'kids.gameMemoryDesc',
    icon: Layers,
    color: '#5c6bc0',
    gradient: 'linear-gradient(135deg, #dfd9ff, #b8acff)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'balloon-pop',
    engine: 'pop',
    titleKey: 'kids.gameBalloon',
    descKey: 'kids.gameBalloonDesc',
    icon: Balloon,
    color: '#e76f51',
    gradient: 'linear-gradient(135deg, #ffd9c9, #ffab8e)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'halal-haram',
    engine: 'halalharam',
    titleKey: 'kids.gameHalalHaram',
    descKey: 'kids.gameHalalHaramDesc',
    icon: Shield,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
    packs: [],
  },
  {
    id: 'good-manners',
    engine: 'goodmanners',
    titleKey: 'kids.gameGoodManners',
    descKey: 'kids.gameGoodMannersDesc',
    icon: Heart,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    packs: [],
  },
  {
    id: 'spot-same',
    engine: 'spot',
    titleKey: 'kids.gameSpot',
    descKey: 'kids.gameSpotDesc',
    icon: Target,
    color: '#118ab2',
    gradient: 'linear-gradient(135deg, #c9ecff, #8fd4f5)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'letter-hunt',
    engine: 'hunt',
    titleKey: 'kids.gameHunt',
    descKey: 'kids.gameHuntDesc',
    icon: Search,
    color: '#3a0ca3',
    gradient: 'linear-gradient(135deg, #dcd4ff, #b3a0ff)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'order-line',
    engine: 'order',
    titleKey: 'kids.gameOrder',
    descKey: 'kids.gameOrderDesc',
    icon: ListOrdered,
    color: '#2a9d8f',
    gradient: 'linear-gradient(135deg, #cdf0ea, #9be2d6)',
    packs: ['letters', 'numbers'],
  },
  {
    id: 'build-word',
    engine: 'spell',
    titleKey: 'kids.gameSpell',
    descKey: 'kids.gameSpellDesc',
    icon: Pencil,
    color: '#d1637a',
    gradient: 'linear-gradient(135deg, #ffd9e0, #ffb0bf)',
    packs: ['words'],
  },
  {
    id: 'names-meaning',
    engine: 'namesmeaning',
    titleKey: 'kids.gameNamesMeaning',
    descKey: 'kids.gameNamesMeaningDesc',
    icon: BookOpen,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
    packs: [],
  },
  {
    id: 'count-stars',
    engine: 'countstars',
    titleKey: 'kids.gameCountStars',
    descKey: 'kids.gameCountStarsDesc',
    icon: Sparkles,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fff3c4, #ffd977)',
    packs: ['numbers'],
  },
  {
    id: 'true-false',
    engine: 'truefalse',
    titleKey: 'kids.gameTrueFalse',
    descKey: 'kids.gameTrueFalseDesc',
    icon: ThumbsUp,
    color: '#2f9e7f',
    gradient: 'linear-gradient(135deg, #d5f5ec, #a4e8d6)',
    packs: [],
  },
  {
    id: 'prophet-timeline',
    engine: 'prophettimeline',
    titleKey: 'kids.gameProphetTimeline',
    descKey: 'kids.gameProphetTimelineDesc',
    icon: Timer,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #ffedd5, #fed7aa)',
    packs: [],
  },
  {
    id: 'cause-effect',
    engine: 'causeeffect',
    titleKey: 'kids.gameCauseEffect',
    descKey: 'kids.gameCauseEffectDesc',
    icon: Brain,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    packs: [],
  },
  {
    id: 'letter-count',
    engine: 'lettercount',
    titleKey: 'kids.gameLetterCount',
    descKey: 'kids.gameLetterCountDesc',
    icon: Hash,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ffe0ec, #ffc1d8)',
    packs: ['words'],
  },
  {
    id: 'dua-moment',
    engine: 'duamoment',
    titleKey: 'kids.gameDuaMoment',
    descKey: 'kids.gameDuaMomentDesc',
    icon: Volume2,
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #fef9c3, #fef08a)',
    packs: [],
  },
  {
    id: 'story-quiz',
    engine: 'storyquiz',
    titleKey: 'kids.gameStoryQuiz',
    descKey: 'kids.gameStoryQuizDesc',
    icon: BookOpen,
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #fff0d0, #ffd98a)',
    packs: [],
  },
  {
    id: 'letter-sound',
    engine: 'lettersound',
    titleKey: 'kids.gameLetterSound',
    descKey: 'kids.gameLetterSoundDesc',
    icon: Volume2,
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #ece0ff, #d4b8ff)',
    packs: ['letters'],
  },
  {
    id: 'word-finder',
    engine: 'wordfinder',
    titleKey: 'kids.gameWordFinder',
    descKey: 'kids.gameWordFinderDesc',
    icon: Languages,
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #ece0ff, #d4b8ff)',
    packs: ['words'],
  },
  {
    id: 'quran-echo',
    engine: 'quranecho',
    titleKey: 'kids.gameQuranEcho',
    descKey: 'kids.gameQuranEchoDesc',
    icon: BookOpen,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #e9d8ff, #c4b5fd)',
    packs: [],
  },
];

/** Engine id → one per distinct interaction. */
export function getGame(gameId: string): GameSpec | undefined {
  return GAMES.find((game) => game.id === gameId);
}
