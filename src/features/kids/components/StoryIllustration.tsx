import {
  Baby,
  BookOpen,
  Bird,
  CloudRain,
  CloudSun,
  Droplet,
  Fish,
  Flame,
  Handshake,
  HandHeart,
  HeartPulse,
  Leaf,
  Lamp,
  Mountain,
  Scale,
  Scroll,
  Shield,
  ShieldCheck,
  Ship,
  Sparkle,
  Star,
  Sun,
  Swords,
  Tent,
  Waves,
  Wind,
  Gem,
  Compass,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './StoryIllustration.module.css';

const ICONS: Record<string, LucideIcon> = {
  Baby,
  BookOpen,
  Bird,
  CloudRain,
  CloudSun,
  Droplet,
  Fish,
  Flame,
  Handshake,
  HandHeart,
  HeartPulse,
  Leaf,
  Lamp,
  Mountain,
  Scale,
  Scroll,
  Shield,
  ShieldCheck,
  Ship,
  Sparkle,
  Star,
  Sun,
  Swords,
  Tent,
  Waves,
  Wind,
  Gem,
  Compass,
};

export interface StoryIllustrationProps {
  symbol: string;
  color: string;
  size?: number;
}

/** Symbolic (non-figurative) illustration — see data/kids/stories.ts for why. */
export default function StoryIllustration({ symbol, color, size = 96 }: StoryIllustrationProps) {
  const Icon = ICONS[symbol] ?? Sparkle;

  return (
    <div className={styles.badge} style={{ backgroundColor: `${color}26`, width: size, height: size }}>
      <Icon size={size * 0.5} color={color} strokeWidth={1.75} />
    </div>
  );
}
