import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { FadeIn } from '../../components/FadeIn';
import { Icon } from '../../components/Icon';
import { LessonTop } from '../../components/LessonTop';
import { ScalePressable } from '../../components/Pressable';
import { T } from '../../components/Text';
import { XP_PER_CORRECT } from '../../logic/learning';
import { useAppDispatch, useAppSelector } from '../../store';
import { finishLesson, next, pick, retry } from '../../store/lessonSlice';
import { colors, font, radius, space } from '../../theme/tokens';

// 07 Quiz: pick the meaning, instant feedback sheet, shake on a wrong answer.
export default function Quiz() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { lesson, step, selected, answered, correct } = useAppSelector((s) => s.lesson);
  const cur = lesson?.steps[step];
  const quiz = cur?.kind === 'quiz' ? cur.quiz : null;
  const sheet = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const isRight = quiz && selected === quiz.answer;
  const hearts = 3 - (answered - correct);

  useEffect(() => {
    Animated.spring(sheet, { toValue: selected === null ? 0 : 1, useNativeDriver: true, speed: 14, bounciness: 4 }).start();
    if (selected !== null && !isRight) {
      Animated.sequence([10, -10, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true }))).start();
    }
  }, [selected, isRight, sheet, shake]);

  if (!quiz || !lesson) return null;

  const cont = async () => {
    dispatch(next());
    if (step + 1 >= lesson.steps.length) {
      await dispatch(finishLesson());
      router.replace('/lesson/complete');
    } else {
      router.replace('/lesson/word');
    }
  };

  const translateY = sheet.interpolate({ inputRange: [0, 1], outputRange: [260, 0] });
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 12 }} testID="screen-quiz">
      <View style={{ paddingHorizontal: space.edge }}>
        <LessonTop done={lesson.doneWords + step} total={lesson.totalWords} hearts={hearts} />
        <FadeIn delay={60}>
          <T variant="label" style={{ color: colors.text2, marginTop: 28 }}>{quiz.prompt}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <T variant="display" style={{ fontSize: 32 }}>{quiz.wordId}</T>
            <View style={styles.speaker}><Icon name="volume-2" size={18} color={colors.accentFill} /></View>
          </View>
        </FadeIn>
        <Animated.View style={{ gap: 12, marginTop: 24, transform: [{ translateX: shake }] }}>
          {quiz.options.map((o, i) => {
            const chosen = selected === i;
            const good = chosen && i === quiz.answer;
            const bad = chosen && i !== quiz.answer;
            return (
              <FadeIn key={o} delay={100 + i * 50}>
                <ScalePressable
                  testID={`option-${i}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: chosen }}
                  accessibilityLabel={o}
                  onPress={() => dispatch(pick(i))}
                  style={[styles.option, good && styles.good, bad && styles.bad]}
                >
                  <T variant="body" style={[good && { color: colors.success, fontFamily: font.semibold }, bad && { color: colors.danger, fontFamily: font.semibold }]}>{o}</T>
                  {good ? (
                    <View style={[styles.dot, { backgroundColor: colors.success, borderWidth: 0 }]}><Icon name="check" size={16} color={colors.white} /></View>
                  ) : bad ? (
                    <View style={[styles.dot, { backgroundColor: colors.danger, borderWidth: 0 }]}><Icon name="x" size={16} color={colors.white} /></View>
                  ) : (
                    <View style={styles.dot} />
                  )}
                </ScalePressable>
              </FadeIn>
            );
          })}
        </Animated.View>
      </View>
      <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16), backgroundColor: isRight ? colors.successTint : colors.dangerTint, transform: [{ translateY }] }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[styles.badge, { backgroundColor: isRight ? colors.success : colors.danger }]}>
              <Icon name={isRight ? 'check' : 'x'} size={20} color={colors.white} />
            </View>
            <T variant="title" style={{ color: isRight ? colors.success : colors.danger }}>{isRight ? 'Correct!' : 'Not quite'}</T>
          </View>
          {isRight ? (
            <View style={styles.xp}><T variant="label" style={{ fontFamily: font.monoBold, color: colors.success }}>+{XP_PER_CORRECT} XP</T></View>
          ) : null}
        </View>
        {!isRight ? <T variant="body" style={{ marginTop: 8 }}>"{quiz.wordId}" means: {quiz.options[quiz.answer]}</T> : null}
        <Button label={isRight ? 'Continue' : 'Try again'} icon={isRight ? 'arrow-right' : 'rotate-ccw'} testID="quiz-continue" onPress={isRight ? cont : () => dispatch(retry())} style={{ marginTop: 16 }} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  speaker: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  option: { minHeight: 56, borderRadius: radius.option, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  good: { backgroundColor: colors.successTint, borderColor: colors.success },
  bad: { backgroundColor: colors.dangerTint, borderColor: colors.danger },
  dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: space.edge, paddingTop: 20 },
  badge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  xp: { borderWidth: 1, borderColor: colors.success, borderRadius: 999, paddingHorizontal: 12, height: 32, justifyContent: 'center', backgroundColor: colors.surface },
});
