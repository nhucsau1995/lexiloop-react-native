import { router } from 'expo-router';
import { View } from 'react-native';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { ScalePressable } from './Pressable';
import { T } from './Text';
import { colors, font } from '../theme/tokens';

// Full-screen lesson top bar: close, progress, counter or hearts.
export function LessonTop({ done, total, hearts }: { done: number; total: number; hearts?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <ScalePressable testID="close-lesson" accessibilityRole="button" accessibilityLabel="Close lesson" onPress={() => router.dismissTo('/learn')} style={{ width: 44, height: 44, justifyContent: 'center' }}>
        <Icon name="x" color={colors.text2} />
      </ScalePressable>
      <ProgressBar value={done / total} style={{ flex: 1 }} />
      {hearts !== undefined ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 12, height: 32, borderWidth: 1, borderColor: colors.border }}>
          <T variant="label" style={{ fontFamily: font.monoBold }}>{hearts}</T>
          <Icon name="heart" size={16} color={colors.danger} />
        </View>
      ) : (
        <T variant="caption" style={{ fontFamily: font.mono }}>{done} / {total}</T>
      )}
    </View>
  );
}
