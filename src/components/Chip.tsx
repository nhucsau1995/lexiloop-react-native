import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, font, radius } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

type Tone = 'accent' | 'success' | 'info' | 'outline' | 'solid';

const tones: Record<Tone, { bg: string; fg: string; border?: string }> = {
  accent: { bg: colors.accentTint, fg: colors.accentFill },
  success: { bg: colors.successTint, fg: colors.success },
  info: { bg: colors.infoTint, fg: colors.info },
  outline: { bg: colors.surface, fg: colors.text, border: colors.borderStrong },
  solid: { bg: colors.accentFill, fg: colors.white },
};

export function Chip({ label, tone = 'accent', icon, mono, onPress, testID, style }: { label: string; tone?: Tone; icon?: IconName; mono?: boolean; onPress?: () => void; testID?: string; style?: StyleProp<ViewStyle> }) {
  const t = tones[tone];
  const body = (
    <View style={[{ height: 32, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: t.bg, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: t.border ? 1.5 : 0, borderColor: t.border }, style]}>
      {icon ? <Icon name={icon} size={16} color={t.fg} /> : null}
      <T variant="caption" style={{ color: t.fg, fontFamily: mono ? font.monoBold : font.semibold }}>
        {label}
      </T>
    </View>
  );
  if (!onPress) return body;
  return (
    <ScalePressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ minHeight: 44, justifyContent: 'center' }}>
      {body}
    </ScalePressable>
  );
}

export function StreakChip({ days }: { days: number }) {
  return <Chip icon="flame" label={String(days)} mono testID="streak-chip" />;
}
