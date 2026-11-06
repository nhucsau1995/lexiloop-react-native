import { View, type ViewProps } from 'react-native';
import { colors, radius, shadow } from '../theme/tokens';

export function Card({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[{ backgroundColor: colors.surface, borderRadius: radius.card, padding: 20, ...shadow }, style]} />;
}
