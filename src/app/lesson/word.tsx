import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FadeIn } from '../../components/FadeIn';
import { Icon } from '../../components/Icon';
import { LessonTop } from '../../components/LessonTop';
import { ScalePressable } from '../../components/Pressable';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { images, type ImageKey } from '../../data/images';
import { words } from '../../data/seed';
import { useAppDispatch, useAppSelector } from '../../store';
import { finishLesson, next } from '../../store/lessonSlice';
import { colors, font } from '../../theme/tokens';

// 06 Word card: meaning, example, simulated pronunciation.
export default function WordCard() {
  const dispatch = useAppDispatch();
  const { lesson, step } = useAppSelector((s) => s.lesson);
  const level = useAppSelector((s) => s.session.level);
  const cur = lesson?.steps[step];
  const word = words.find((w) => cur?.kind === 'word' && w.id === cur.wordId) ?? words[0];
  const [playing, setPlaying] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!playing) return;
    const loop = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1.12, duration: 300, useNativeDriver: true }), Animated.timing(pulse, { toValue: 1, duration: 300, useNativeDriver: true })]));
    loop.start();
    const t = setTimeout(() => setPlaying(false), 1500); // audio is simulated in the POC
    return () => {
      loop.stop();
      clearTimeout(t);
    };
  }, [playing, pulse]);

  const goNext = async () => {
    dispatch(next());
    const after = lesson?.steps[step + 1];
    if (after) {
      router.replace(after.kind === 'quiz' ? '/lesson/quiz' : '/lesson/word');
    } else {
      await dispatch(finishLesson());
      router.replace('/lesson/complete');
    }
  };

  const done = (lesson?.doneWords ?? 0) + step;
  return (
    <Screen
      testID="screen-word"
      footer={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="I know it" kind="secondary" testID="know-it" onPress={goNext} style={{ flex: 1 }} />
          <Button label="Next" icon="arrow-right" testID="next-word" onPress={goNext} style={{ flex: 1 }} />
        </View>
      }
    >
      <LessonTop done={done} total={lesson?.totalWords ?? 10} />
      <FadeIn delay={60}>
        <Card style={{ marginTop: 20, padding: 16 }}>
          {word.image ? <Image source={images[word.image as ImageKey]} style={styles.photo} accessibilityLabel="Commuter reading on a city train" /> : null}
          <View style={styles.meta}>
            <Chip label={word.partOfSpeech} />
            <T variant="caption">{level === 'beginner' ? 'A2' : level === 'advanced' ? 'C1' : 'B1'} Level</T>
          </View>
          <T variant="display" style={{ marginTop: 8 }}>{word.word}</T>
          <View style={styles.meta}>
            <T variant="body" style={{ fontFamily: font.mono, color: colors.text2 }}>{word.phonetic}</T>
            <ScalePressable testID="listen" accessibilityRole="button" accessibilityLabel={`Listen to ${word.word}`} onPress={() => setPlaying(true)}>
              <Animated.View style={[styles.listen, { transform: [{ scale: pulse }] }]}>
                <Icon name="volume-2" size={18} color={colors.accentFill} />
                <T variant="label" style={{ color: colors.accentFill }}>{playing ? 'Playing' : 'Listen'}</T>
              </Animated.View>
            </ScalePressable>
          </View>
          <View style={styles.divider} />
          <T variant="overline">Meaning</T>
          <T variant="body" style={{ marginTop: 4 }}>{word.meaning}</T>
          <T variant="overline" style={{ marginTop: 14 }}>Example</T>
          <View style={styles.example}>
            <T variant="body" style={{ fontStyle: 'italic' }}>"{word.example}"</T>
          </View>
        </Card>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: 190, borderRadius: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  listen: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentTint, borderRadius: 999, paddingHorizontal: 14, height: 40 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  example: { marginTop: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, backgroundColor: colors.bg },
});
