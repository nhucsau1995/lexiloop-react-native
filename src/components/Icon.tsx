import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { colors } from '../theme/tokens';

// One icon style everywhere: Feather (Lucide-style rounded outline, 24px). Feather has no
// flame, so the streak flame comes from Ionicons' matching outline glyph.
export type IconName = ComponentProps<typeof Feather>['name'] | 'flame';

export function Icon({ name, size = 24, color = colors.text }: { name: IconName; size?: number; color?: string }) {
  if (name === 'flame') return <Ionicons name="flame-outline" size={size} color={color} />;
  return <Feather name={name} size={size} color={color} />;
}
