import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FadeIn } from '../components/FadeIn';
import { Icon } from '../components/Icon';
import { ScalePressable } from '../components/Pressable';
import { Screen } from '../components/Screen';
import { T } from '../components/Text';
import { validateSignUp } from '../logic/learning';
import { useAppDispatch, useAppSelector } from '../store';
import { continueAsGuest, register } from '../store/sessionSlice';
import { colors } from '../theme/tokens';

// 02 Sign up: registration through the API client (mock adapter by default).
// The form starts filled with the demo learner so the walkthrough needs no typing.
export default function SignUp() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.session.status === 'loading');
  const apiError = useAppSelector((s) => s.session.error);
  const [name, setName] = useState('Maya Chen');
  const [email, setEmail] = useState('maya.chen@mail.com');
  const [password, setPassword] = useState('wordsaday2026');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    const e = validateSignUp(name, email, password);
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(r)) router.push('/level-setup');
  };
  const guest = async () => {
    await dispatch(continueAsGuest());
    router.push('/level-setup');
  };

  return (
    <Screen testID="screen-sign-up">
      <ScalePressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}>
        <Icon name="arrow-left" />
      </ScalePressable>
      <FadeIn>
        <T variant="display" style={{ marginTop: 12 }}>Create your account</T>
        <T variant="body" style={{ color: colors.text2, marginTop: 4 }}>Save your words and progress</T>
      </FadeIn>
      <FadeIn delay={100}>
        <Field label="Name" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" testID="input-name" />
        <Field label="Email" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" testID="input-email" />
        <Field label="Password" value={password} onChangeText={setPassword} error={errors.password} helper="At least 8 characters" secure testID="input-password" />
      </FadeIn>
      {apiError ? <T variant="caption" style={{ color: colors.danger, marginTop: 12 }}>{apiError}</T> : null}
      <FadeIn delay={180} style={{ marginTop: 32 }}>
        <Button label="Create account" testID="create-account" loading={loading} onPress={submit} />
        <View style={styles.or}>
          <View style={styles.line} />
          <T variant="caption" style={{ color: colors.text3 }}>or</T>
          <View style={styles.line} />
        </View>
        <Button label="Continue as guest" kind="secondary" testID="guest" onPress={guest} />
        <T variant="label" style={{ textAlign: 'center', color: colors.text2, marginTop: 20 }}>
          By continuing you agree to the <T variant="label" style={{ color: colors.accentFill, textDecorationLine: 'underline' }}>Terms</T>
        </T>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 44, height: 44, justifyContent: 'center' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
});
