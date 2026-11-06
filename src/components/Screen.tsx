import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../theme/tokens';

export function Screen({ children, scroll = true, footer, testID, contentStyle }: { children: ReactNode; scroll?: boolean; footer?: ReactNode; testID?: string; contentStyle?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 12, paddingHorizontal: space.edge };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} testID={testID}>
      {scroll ? (
        <ScrollView contentContainerStyle={[pad, { paddingBottom: 24 }, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={{ paddingHorizontal: space.edge, paddingBottom: Math.max(insets.bottom, 16), paddingTop: 8 }}>{footer}</View> : null}
    </View>
  );
}
