import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, font, radius } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

type Kind = 'primary' | 'secondary' | 'inverse' | 'danger';

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  loading,
  disabled,
  testID,
  style,
}: {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const fg = kind === 'primary' ? colors.white : kind === 'danger' ? colors.danger : kind === 'inverse' ? colors.accentFill : colors.text;
  return (
    <ScalePressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      containerStyle={style}
      style={[styles.base, styles[kind], disabled && { opacity: 0.4 }]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          <T variant="label" style={{ color: fg, fontFamily: font.semibold }}>
            {label}
          </T>
          {icon ? <Icon name={icon} size={18} color={fg} /> : null}
        </View>
      )}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primary: { backgroundColor: colors.accentFill },
  secondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderStrong },
  inverse: { backgroundColor: colors.surface },
  danger: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
});
