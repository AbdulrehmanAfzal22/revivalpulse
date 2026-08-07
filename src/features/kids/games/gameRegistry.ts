import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpDown,
  Balloon,
  BookOpen,
  Eye,
  Hammer,
  Hash,
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
  Sparkles,
  Star,
  Target,
  ThumbsUp,
} from 'lucide-react';
import type { TranslationKey } from 'i18n';
import type { KidsStudyTopic } from 'data/kids/gameContent';

/** Engine ids → one per distinct interaction mechanic. */
export type EngineId =
  | 'match'
  | 'memory'
  | 'pop'
  | 'catch'
  | 'whack'
  | 'spot'
  | 'hunt'
  | 'order'
  | 'bigsmall'
  | 'spell'
  | 'whatsmissing'
  | 'countstars'
  | 'truefalse'
  | 'pattern'
  | 'nextinline'
  | 'lettercount'
  | 'missingletter'
  | 'storyquiz'
  | 'moreorless'
  | 'wordfinder';

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
    id: 'catch',
    engine: 'catch',
    titleKey: 'kids.gameCatch',
    descKey: 'kids.gameCatchDesc',
    icon: Star,
    color: '#f4a261',
    gradient: 'linear-gradient(135deg, #fff0b3, #ffd24d)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'whack',
    engine: 'whack',
    titleKey: 'kids.gameWhack',
    descKey: 'kids.gameWhackDesc',
    icon: Hammer,
    color: '#ef476f',
    gradient: 'linear-gradient(135deg, #ffd0db, #ff9ab0)',
    packs: ['letters', 'numbers', 'words'],
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
    id: 'big-small',
    engine: 'bigsmall',
    titleKey: 'kids.gameBigSmall',
    descKey: 'kids.gameBigSmallDesc',
    icon: ArrowUpDown,
    color: '#e76f51',
    gradient: 'linear-gradient(135deg, #ffd9c9, #ffab8e)',
    packs: ['numbers'],
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
    id: 'whats-missing',
    engine: 'whatsmissing',
    titleKey: 'kids.gameWhatMissing',
    descKey: 'kids.gameWhatMissingDesc',
    icon: Eye,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #e8ddff, #c9b2ff)',
    packs: ['letters', 'numbers', 'words'],
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
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'pattern-repeat',
    engine: 'pattern',
    titleKey: 'kids.gamePattern',
    descKey: 'kids.gamePatternDesc',
    icon: Repeat,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #d6ecff, #a8d4ff)',
    packs: ['letters', 'numbers', 'words'],
  },
  {
    id: 'next-in-line',
    engine: 'nextinline',
    titleKey: 'kids.gameNextInLine',
    descKey: 'kids.gameNextInLineDesc',
    icon: MoveRight,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #ffe3d6, #ffc0a8)',
    packs: ['letters', 'numbers', 'words'],
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
    id: 'missing-letter',
    engine: 'missingletter',
    titleKey: 'kids.gameMissingLetter',
    descKey: 'kids.gameMissingLetterDesc',
    icon: Puzzle,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #d9f6ea, #b3ecd2)',
    packs: ['words'],
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
    id: 'more-or-less',
    engine: 'moreorless',
    titleKey: 'kids.gameMoreLess',
    descKey: 'kids.gameMoreLessDesc',
    icon: Scale,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #d9efff, #b3dfff)',
    packs: ['numbers'],
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
];

export function getGame(gameId: string): GameSpec | undefined {
  return GAMES.find((game) => game.id === gameId);
}