import { useEffect, useRef } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';

// 8px pill track; the fill animates to the new value.
export function ProgressBar({ value, color = colors.accent, track = colors.surfaceAlt, style }: { value: number; color?: string; track?: string; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: Math.max(0, Math.min(1, value)), duration: 500, useNativeDriver: false }).start();
  }, [value, v]);
  const width = v.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={[{ height: 8, borderRadius: 999, backgroundColor: track, overflow: 'hidden' }, style]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}>
      <Animated.View style={{ height: 8, borderRadius: 999, backgroundColor: color, width }} />
    </View>
  );
}
