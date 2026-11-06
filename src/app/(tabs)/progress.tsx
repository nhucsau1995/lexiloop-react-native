import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { FadeIn } from '../../components/FadeIn';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { useAppSelector } from '../../store';
import { colors, font } from '../../theme/tokens';

const CHART_H = 110;

function Bar({ xp, max, today, delay }: { xp: number; max: number; today: boolean; delay: number }) {
  const h = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(h, { toValue: max ? (xp / max) * CHART_H : 0, duration: 600, delay, useNativeDriver: false }).start();
  }, [xp, max, delay, h]);
  return <Animated.View style={{ width: 26, height: h, minHeight: 4, borderRadius: 8, backgroundColor: today ? colors.accentFill : colors.accent }} />;
}

// 10 Progress: streak, weekly XP chart, totals, level progress.
export default function Progress() {
  const p = useAppSelector((s) => s.progress);
  const level = useAppSelector((s) => s.session.level);
  const max = Math.max(...p.week.map((d) => d.xp), 1);
  const total = p.week.reduce((a, d) => a + d.xp, 0);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const doneToday = p.lastActive === new Date().toISOString().slice(0, 10);
  const levelName = level === 'beginner' ? 'Beginner A2' : level === 'advanced' ? 'Advanced C1' : 'Intermediate B1';
  const nextName = level === 'beginner' ? 'B1' : level === 'advanced' ? 'C2' : 'B2';

  return (
    <Screen testID="screen-progress">
      <Header title="Progress" />
      <FadeIn>
        <LinearGradient colors={[...colors.gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.streak}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.flame}><Icon name="flame" size={24} color={colors.white} /></View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <T variant="display" style={{ color: colors.white, fontFamily: font.monoBold }} testID="streak-count">{p.streak}</T>
                <T variant="label" style={{ color: colors.white }}>day streak</T>
              </View>
              <T variant="caption" style={{ color: colors.white }}>Best: {p.bestStreak} days</T>
            </View>
          </View>
          <View style={styles.week}>
            {days.map((d, i) => {
              const isToday = i === 6;
              const done = isToday ? doneToday : true; // earlier days of the 12-day streak
              return (
                <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                  <T variant="caption" style={{ color: colors.white }}>{d}</T>
                  <View style={[styles.day, done ? { backgroundColor: colors.white } : { borderWidth: 2, borderColor: colors.white }]}>
                    {done ? <Icon name="check" size={14} color={colors.accentFill} /> : null}
                  </View>
                </View>
              );
            })}
          </View>
        </LinearGradient>
      </FadeIn>
      <FadeIn delay={100}>
        <Card style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <T variant="title">XP this week</T>
            <T variant="title" style={{ fontFamily: font.monoBold, color: colors.accentFill }}>{total} XP</T>
          </View>
          <View style={styles.chart} accessibilityLabel={`XP per day: ${p.week.map((d) => `${d.day} ${d.xp}`).join(', ')}`}>
            {p.week.map((d, i) => (
              <View key={d.day} style={{ alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <T variant="caption" style={{ fontFamily: font.mono, color: i === 6 ? colors.accentFill : colors.text2 }}>{d.xp}</T>
                <Bar xp={d.xp} max={max} today={i === 6} delay={i * 60} />
                <T variant="caption" style={i === 6 ? { color: colors.accentFill, fontFamily: font.bold } : undefined}>{d.day}</T>
              </View>
            ))}
          </View>
        </Card>
      </FadeIn>
      <FadeIn delay={180} style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        {[
          ['Words learned', String(p.wordsLearned)],
          ['Accuracy', `${p.accuracy}%`],
          ['Minutes', String(p.minutes)],
        ].map(([l, v]) => (
          <Card key={l} style={{ flex: 1, padding: 14 }}>
            <T variant="caption">{l}</T>
            <T variant="title" style={{ fontFamily: font.monoBold, marginTop: 10, fontSize: 20 }}>{v}</T>
          </Card>
        ))}
      </FadeIn>
      <FadeIn delay={240}>
        <Card style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="award" size={20} color={colors.accentFill} />
              <T variant="label">Current level</T>
            </View>
            <T variant="label" style={{ fontFamily: font.semibold }}>{levelName}</T>
          </View>
          <ProgressBar value={p.levelProgress / 100} style={{ marginTop: 14 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <T variant="caption">{p.levelProgress}% completed</T>
            <T variant="caption" style={{ color: colors.accentFill }}>{100 - p.levelProgress}% to {nextName}</T>
          </View>
        </Card>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  streak: { marginTop: 20, borderRadius: 20, padding: 20 },
  flame: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.18)', alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.25)' },
  day: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16, height: CHART_H + 50 },
});
