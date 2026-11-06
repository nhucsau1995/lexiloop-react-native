import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FadeIn } from '../../components/FadeIn';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { ScalePressable } from '../../components/Pressable';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { images, type ImageKey } from '../../data/images';
import { upNext } from '../../data/seed';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLesson, start } from '../../store/lessonSlice';
import { colors, font, radius, shadow } from '../../theme/tokens';

function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

// 04 Home (Learn tab) and 05 its first-run empty state (guest / new learner).
export default function Learn() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.session.user);
  const lesson = useAppSelector((s) => s.lesson.lesson);
  const dailyGoal = useAppSelector((s) => s.session.dailyGoal);
  useEffect(() => {
    if (!lesson) dispatch(fetchLesson());
  }, [lesson, dispatch]);

  const first = user?.name.split(' ')[0] ?? 'there';
  const begin = () => {
    dispatch(start());
    router.push('/lesson/word');
  };

  if (user?.guest) {
    return (
      <Screen testID="screen-learn-empty">
        <Header title={`Welcome, ${first}`} />
        <FadeIn delay={80}>
          <Card style={{ marginTop: 32, alignItems: 'center', padding: 16 }}>
            <Image source={images.firstLesson} style={styles.emptyImg} accessibilityLabel="Open notebook and a cup of tea on a desk" />
            <T variant="title" style={{ marginTop: 20, textAlign: 'center' }}>Your first lesson is ready</T>
            <T variant="body" style={{ color: colors.text2, textAlign: 'center', marginTop: 6 }}>Learn {dailyGoal} everyday words in about 5 minutes</T>
            <Button label="Start lesson 1" testID="start-first" onPress={begin} style={{ alignSelf: 'stretch', marginTop: 20 }} />
            <T variant="caption" style={{ marginTop: 12, textAlign: 'center' }}>You can change your daily goal in Profile</T>
          </Card>
        </FadeIn>
      </Screen>
    );
  }

  const done = lesson?.doneWords ?? 0;
  const total = lesson?.totalWords ?? 10;
  const finished = done >= total;
  return (
    <Screen testID="screen-learn">
      <Header title={`${greeting()}, ${first}`} subtitle={finished ? 'Daily goal reached. Nice work!' : `Ready for ${dailyGoal} new words?`} />
      <FadeIn delay={60}>
        <LinearGradient colors={[...colors.gradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <T variant="overline" style={{ color: colors.white }}>Today's lesson</T>
              <T variant="title" style={{ color: colors.white, fontFamily: font.bold, marginTop: 6 }}>{lesson?.title ?? 'Loading...'}</T>
              <T variant="label" style={{ color: colors.white, marginTop: 4 }}>{finished ? 'Completed today' : `About ${Math.max(1, total - done)} min left`}</T>
            </View>
            <View style={styles.ring} accessibilityLabel={`${done} of ${total} words`}>
              <T variant="title" mono style={{ color: colors.white }}>{done}/{total}</T>
            </View>
          </View>
          <Button label={finished ? 'Review words' : 'Continue'} kind="inverse" icon="arrow-right" testID="continue-lesson" onPress={finished ? () => router.push('/words') : begin} style={{ marginTop: 24 }} />
        </LinearGradient>
      </FadeIn>
      <FadeIn delay={140}>
        <Card style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip label="WORD OF THE DAY" />
            <ScalePressable accessibilityRole="button" accessibilityLabel="Listen to wanderlust" style={styles.speaker}>
              <Icon name="volume-2" size={20} color={colors.accentFill} />
            </ScalePressable>
          </View>
          <T variant="display" style={{ marginTop: 14 }}>wanderlust</T>
          <T variant="label" mono style={{ color: colors.text2, fontFamily: font.mono }}>/ˈwɒn.də.lʌst/</T>
          <T variant="body" style={{ marginTop: 10 }}>a strong wish to travel</T>
        </Card>
      </FadeIn>
      <T variant="title" style={{ marginTop: 28, marginBottom: 12 }}>Up next</T>
      {upNext.map((u, i) => (
        <FadeIn key={u.id} delay={200 + i * 60}>
          <ScalePressable testID={`topic-${u.id}`} accessibilityRole="button" accessibilityLabel={`${u.title}, ${u.words} words`} style={styles.row}>
            <Image source={images[u.image as ImageKey]} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <T variant="label" style={{ fontSize: 16, fontFamily: font.semibold }}>{u.title}</T>
              <T variant="caption" mono style={{ fontFamily: font.mono, marginTop: 2 }}>{u.words} words</T>
            </View>
            <Icon name="chevron-right" size={20} color={colors.text2} />
          </ScalePressable>
        </FadeIn>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 20, borderRadius: radius.card, padding: 22 },
  ring: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  speaker: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: radius.card, padding: 12, marginBottom: 12, ...shadow, shadowOpacity: 0.04 },
  thumb: { width: 56, height: 56, borderRadius: radius.control },
  emptyImg: { width: '100%', height: 220, borderRadius: 24 },
});
