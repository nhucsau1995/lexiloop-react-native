import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { FadeIn } from '../components/FadeIn';
import { ScalePressable } from '../components/Pressable';
import { T } from '../components/Text';
import { images } from '../data/images';
import { colors, space } from '../theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 01 Welcome: real photo hero, promise, entry to sign up.
export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root} testID="screen-welcome">
      <View style={styles.heroWrap}>
        <LinearGradient colors={[colors.accent, colors.support]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.blob} />
        <Image source={images.welcomeHero} style={styles.hero} resizeMode="cover" accessibilityLabel="Learner smiling while practising words on a phone at a cafe" />
      </View>
      <View style={[styles.body, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <FadeIn delay={80}>
          <T variant="overline" style={{ color: colors.accentFill }}>LexiLoop</T>
          <T variant="display" style={{ marginTop: 8 }}>Learn 5 new English words a day</T>
          <T variant="body" style={{ color: colors.text2, marginTop: 8 }}>Short lessons, quick quizzes, real progress</T>
        </FadeIn>
        <View style={{ flex: 1 }} />
        <FadeIn delay={220}>
          <Button label="Get started" testID="get-started" onPress={() => router.push('/sign-up')} />
          <ScalePressable testID="have-account" accessibilityRole="button" onPress={() => router.push('/sign-up')} style={styles.link}>
            <T variant="label" style={{ color: colors.accentFill }}>I already have an account</T>
          </ScalePressable>
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  heroWrap: { height: '52%' },
  blob: { position: 'absolute', right: -40, bottom: -30, width: 180, height: 180, borderRadius: 90, opacity: 0.55 },
  hero: { width: '100%', height: '100%', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  body: { flex: 1, paddingHorizontal: space.edge + 4, paddingTop: 24 },
  link: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});
