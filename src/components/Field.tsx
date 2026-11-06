import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { colors, font, radius, size } from '../theme/tokens';
import { Icon } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

export function Field({ label, error, helper, secure, ...rest }: TextInputProps & { label: string; error?: string; helper?: string; secure?: boolean }) {
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(true);
  const border = error ? colors.danger : focus ? colors.accentFill : colors.borderStrong;
  return (
    <View style={{ marginTop: 16 }}>
      <T variant="label" style={{ marginBottom: 6 }}>{label}</T>
      <View style={{ height: 52, borderRadius: radius.input, backgroundColor: colors.surface, borderWidth: focus || error ? 2 : 1, borderColor: border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
        <TextInput
          {...rest}
          accessibilityLabel={label}
          secureTextEntry={secure && hidden}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholderTextColor={colors.text3}
          style={{ flex: 1, fontFamily: font.regular, fontSize: size.body, color: colors.text, height: 50 }}
        />
        {secure ? (
          <ScalePressable accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'} onPress={() => setHidden((h) => !h)} style={{ padding: 10 }}>
            <Icon name={hidden ? 'eye' : 'eye-off'} size={20} color={colors.text2} />
          </ScalePressable>
        ) : null}
      </View>
      {error || helper ? (
        <T variant="caption" style={{ marginTop: 6, color: error ? colors.danger : colors.text3 }}>{error ?? helper}</T>
      ) : null}
    </View>
  );
}
