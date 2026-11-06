import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FadeIn } from '../../components/FadeIn';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { words } from '../../data/seed';
import { useAppSelector } from '../../store';
import { colors, font } from '../../theme/tokens';

// 08 Lesson complete: XP count-up, stats, new words, streak.
export default function Complete() {
  const { result, lesson, learned } = useAppSelector((s) => s.lesson);
  const streak = useAppSelector((s) => s.progress.streak);
  const xp = result?.xp ?? 0;
  const scale = useRef(new Animated.Value(0.6)).current;
  const count = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 10 }).start();
    const id = count.addListener(({ value }) => setShown(Math.round(value)));
    Animated.timing(count, { toValue: xp, duration: 900, delay: 200, useNativeDriver: false }).start();
    return () => count.removeListener(id);
  }, [xp, scale, count]);

  const met = words.filter((w) => learned.includes(w.id) || w.id === 'itinerary').slice(0, 3);
  return (
    <Screen
      testID="screen-complete"
      footer={
        <View style={{ gap: 10 }}>
          <Button label="Back to home" testID="back-home" onPress={() => router.dismissTo('/learn')} />
          <Button label="Review mistakes" kind="secondary" testID="review" onPress={() => router.replace('/words')} />
        </View>
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T variant="title" style={{ fontFamily: font.bold }}>LexiLoop</T>
        <Chip icon="flame" label={`${streak} day streak`} />
      </View>
      <FadeIn>
        <T variant="display" style={{ textAlign: 'center', marginTop: 16 }}>Lesson complete!</T>
        <T variant="caption" style={{ textAlign: 'center', marginTop: 2 }}>{lesson?.title}</T>
      </FadeIn>
      <Animated.View style={[styles.ringOuter, { transform: [{ scale }] }]}>
        <LinearGradient colors={[...colors.gradient]} style={styles.ring}>
          <Icon name="star" size={22} color={colors.white} />
          <T variant="display" style={{ color: colors.white, fontFamily: font.monoBold }} testID="xp-earned">+{shown} XP</T>
          <T variant="label" style={{ color: colors.white }}>Reward earned</T>
        </LinearGradient>
      </Animated.View>
      <FadeIn delay={200} style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        {[
          [String(result?.words ?? 10), 'words'],
          [`${result?.accuracy ?? 0}%`, 'accuracy'],
          [`${result?.minutes ?? 0} min`, 'time'],
        ].map(([v, l]) => (
          <Card key={l} style={{ flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 }}>
            <T variant="title" style={{ fontFamily: font.monoBold, color: l === 'accuracy' ? colors.success : colors.text }}>{v}</T>
            <T variant="caption">{l}</T>
          </Card>
        ))}
      </FadeIn>
      <FadeIn delay={300}>
        <Card style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T variant="title">New words learned</T>
            <T variant="label" style={{ fontFamily: font.mono, color: colors.text2 }}>{met.length} / {met.length}</T>
          </View>
          {met.map((w) => (
            <View key={w.id} style={styles.wordRow}>
              <Icon name="check-circle" size={20} color={colors.success} />
              <View style={{ flex: 1 }}>
                <T variant="label" style={{ fontFamily: font.semibold }}>{w.word} <T variant="caption">{w.partOfSpeech}</T></T>
                <T variant="caption">{w.meaning}</T>
              </View>
            </View>
          ))}
        </Card>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ringOuter: { alignSelf: 'center', marginTop: 20, padding: 8, borderRadius: 112, borderWidth: 4, borderColor: colors.support },
  ring: { width: 196, height: 196, borderRadius: 98, alignItems: 'center', justifyContent: 'center', gap: 2 },
  wordRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 10 },
});
