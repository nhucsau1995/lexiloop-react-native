import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

// Entrance animation: fade + short rise, staggered with `delay`.
export function FadeIn({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 380, delay, useNativeDriver: true }).start();
  }, [a, delay]);
  const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  return <Animated.View style={[style, { opacity: a, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
