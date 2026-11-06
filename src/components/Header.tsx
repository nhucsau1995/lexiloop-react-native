import { View } from 'react-native';
import { useAppSelector } from '../store';
import { StreakChip } from './Chip';
import { T } from './Text';
import { colors } from '../theme/tokens';

// Shared header: screen title left, streak chip right.
export function Header({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  const streak = useAppSelector((s) => (s.session.user?.guest ? 0 : s.progress.streak));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <T variant="display" accessibilityRole="header">{title}</T>
          {badge ? <T variant="label" mono style={{ color: colors.accentFill, backgroundColor: colors.accentTint, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2, overflow: 'hidden' }}>{badge}</T> : null}
        </View>
        {subtitle ? <T variant="body" style={{ color: colors.text2, marginTop: 2 }}>{subtitle}</T> : null}
      </View>
      <View style={{ marginTop: 4 }}>
        <StreakChip days={streak} />
      </View>
    </View>
  );
}
