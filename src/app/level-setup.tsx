import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { FadeIn } from '../components/FadeIn';
import { Icon, type IconName } from '../components/Icon';
import { ProgressBar } from '../components/ProgressBar';
import { ScalePressable } from '../components/Pressable';
import { Screen } from '../components/Screen';
import { T } from '../components/Text';
import type { Level } from '../data/types';
import { useAppDispatch, useAppSelector } from '../store';
import { saveLevel, setDailyGoal, setLevel } from '../store/sessionSlice';
import { colors, radius, shadow } from '../theme/tokens';

const LEVELS: { id: Level; title: string; tag: string; note: string; icon: IconName }[] = [
  { id: 'beginner', title: 'Beginner', tag: 'A1 - A2', note: 'I know some basic words', icon: 'feather' },
  { id: 'intermediate', title: 'Intermediate', tag: 'B1 - B2', note: 'I can hold simple conversations', icon: 'message-square' },
  { id: 'advanced', title: 'Advanced', tag: 'C1', note: 'I want to sound natural', icon: 'award' },
];
const GOALS = [5, 10, 15];

// 03 Level setup: level + daily goal personalise the lessons (saved to the profile).
export default function LevelSetup() {
  const dispatch = useAppDispatch();
  const { level, dailyGoal } = useAppSelector((s) => s.session);

  const start = async () => {
    await dispatch(saveLevel({ level, dailyGoal }));
    router.replace('/learn');
  };

  return (
    <Screen testID="screen-level" footer={<Button label="Start learning" testID="start-learning" onPress={start} />}>
      <View style={styles.top}>
        <ScalePressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={{ width: 44, height: 44, justifyContent: 'center' }}>
          <Icon name="arrow-left" />
        </ScalePressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <T variant="caption">Step 2 of 2</T>
          <ProgressBar value={1} style={{ width: 64 }} />
        </View>
      </View>
      <FadeIn>
        <T variant="display" style={{ marginTop: 12 }}>What is your English level?</T>
        <T variant="body" style={{ color: colors.text2, marginTop: 6 }}>We adapt your daily words to it.</T>
      </FadeIn>
      <View style={{ gap: 12, marginTop: 20 }}>
        {LEVELS.map((l, i) => {
          const on = l.id === level;
          return (
            <FadeIn key={l.id} delay={60 * i}>
              <ScalePressable
                testID={`level-${l.id}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => dispatch(setLevel(l.id))}
                style={[styles.card, on && styles.cardOn]}
              >
                <View style={styles.iconWrap}>
                  <Icon name={l.icon} size={20} color={colors.accentFill} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <T variant="label" style={{ fontSize: 16 }}>{l.title}</T>
                    <View style={styles.tag}><T variant="caption" style={{ color: colors.accentFill }}>{l.tag}</T></View>
                  </View>
                  <T variant="caption" style={{ marginTop: 2 }}>{l.note}</T>
                </View>
                {on ? <Icon name="check-circle" size={22} color={colors.accentFill} /> : null}
              </ScalePressable>
            </FadeIn>
          );
        })}
      </View>
      <T variant="title" style={{ marginTop: 28 }}>Daily goal</T>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        {GOALS.map((g) => (
          <Chip key={g} testID={`goal-${g}`} label={`${g} words`} tone={g === dailyGoal ? 'solid' : 'outline'} onPress={() => dispatch(setDailyGoal(g))} style={{ height: 40, paddingHorizontal: 18 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <Icon name="clock" size={14} color={colors.text2} />
        <T variant="caption">About {Math.round(dailyGoal / 2)} minutes a day</T>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, ...shadow, shadowOpacity: 0.03 },
  cardOn: { borderColor: colors.accentFill, borderWidth: 2, backgroundColor: colors.accentTint },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.surfaceAlt },
});
