import { router } from 'expo-router';
import { Image, StyleSheet, Switch, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FadeIn } from '../../components/FadeIn';
import { Header } from '../../components/Header';
import { Icon, type IconName } from '../../components/Icon';
import { ScalePressable } from '../../components/Pressable';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { apiMode } from '../../api/client';
import { images } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, setDailyGoal, toggleSound } from '../../store/sessionSlice';
import { colors, font } from '../../theme/tokens';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GOALS = [5, 10, 15];

// 11 Profile: learner info, badges, settings (daily goal cycles, sound toggle), log out.
export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, dailyGoal, soundEffects, level } = useAppSelector((s) => s.session);
  const streak = useAppSelector((s) => s.progress.bestStreak);
  const words = useAppSelector((s) => s.progress.wordsLearned);
  const joined = user ? new Date(user.joined) : new Date();
  const levelLabel = level[0].toUpperCase() + level.slice(1);

  const badges: { icon: IconName; title: string; sub: string }[] = [
    { icon: 'flame', title: `${Math.min(streak, 7)}-day streak`, sub: 'Consistency' },
    { icon: 'layers', title: `${words >= 50 ? 50 : words} words`, sub: 'Vocabulary' },
    { icon: 'award', title: 'Quiz ace', sub: '100% score' },
  ];
  const rows: { icon: IconName; label: string; value?: string; onPress?: () => void; testID?: string }[] = [
    { icon: 'flag', label: 'Daily goal', value: `${dailyGoal} words`, testID: 'row-goal', onPress: () => dispatch(setDailyGoal(GOALS[(GOALS.indexOf(dailyGoal) + 1) % GOALS.length])) },
    { icon: 'bell', label: 'Reminder', value: '8:00 PM' },
    { icon: 'bar-chart-2', label: 'English level', value: levelLabel, onPress: () => router.push('/level-setup') },
    { icon: 'server', label: 'Data source', value: apiMode === 'http' ? 'Node.js API' : 'Demo data' },
  ];

  return (
    <Screen testID="screen-profile">
      <Header title="Profile" />
      <FadeIn style={{ alignItems: 'center', marginTop: 16 }}>
        <View style={styles.avatarRing}>
          <Image source={images.avatarMaya} style={styles.avatar} accessibilityLabel={`${user?.name ?? 'Learner'} profile photo`} />
        </View>
        <T variant="title" style={{ marginTop: 10, fontFamily: font.bold }}>{user?.name ?? 'Maya Chen'}</T>
        {user?.email ? <T variant="label" style={{ color: colors.text2 }}>{user.email}</T> : null}
        <Chip label={`Learning since ${MONTHS[joined.getMonth()]} ${joined.getFullYear()}`} style={{ marginTop: 10 }} />
      </FadeIn>
      <FadeIn delay={80} style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        {badges.map((b) => (
          <Card key={b.title} style={{ flex: 1, alignItems: 'center', padding: 12 }}>
            <View style={styles.badgeIcon}><Icon name={b.icon} size={20} color={colors.accentFill} /></View>
            <T variant="caption" style={{ color: colors.text, fontFamily: font.semibold, marginTop: 8, textAlign: 'center' }}>{b.title}</T>
            <T variant="caption" style={{ textAlign: 'center' }}>{b.sub}</T>
          </Card>
        ))}
      </FadeIn>
      <FadeIn delay={140}>
        <Card style={{ marginTop: 16, paddingVertical: 4 }}>
          {rows.slice(0, 2).map((r, i) => (
            <Row key={r.label} {...r} first={i === 0} />
          ))}
          <View style={[styles.row, styles.rowBorder]}>
            <Icon name="volume-2" size={20} color={colors.text2} />
            <T variant="body" style={{ flex: 1 }}>Sound effects</T>
            <Switch
              testID="sound-toggle"
              accessibilityLabel="Sound effects"
              value={soundEffects}
              onValueChange={() => {
                dispatch(toggleSound());
              }}
              trackColor={{ true: colors.accentFill, false: colors.border }}
              thumbColor={colors.white}
            />
          </View>
          {rows.slice(2).map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </Card>
      </FadeIn>
      <Button
        label="Log out"
        kind="danger"
        icon="log-out"
        testID="logout"
        style={{ marginTop: 20 }}
        onPress={() => {
          dispatch(logout());
          router.dismissTo('/');
        }}
      />
    </Screen>
  );
}

function Row({ icon, label, value, onPress, testID, first }: { icon: IconName; label: string; value?: string; onPress?: () => void; testID?: string; first?: boolean }) {
  return (
    <ScalePressable testID={testID} accessibilityRole="button" accessibilityLabel={value ? `${label}, ${value}` : label} onPress={onPress} scaleTo={0.99} style={[styles.row, !first && styles.rowBorder]}>
      <Icon name={icon} size={20} color={colors.text2} />
      <T variant="body" style={{ flex: 1 }}>{label}</T>
      {value ? <T variant="label" style={{ color: colors.text2 }}>{value}</T> : null}
      <Icon name="chevron-right" size={18} color={colors.text3} />
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  avatarRing: { padding: 3, borderRadius: 54, borderWidth: 3, borderColor: colors.accent },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  badgeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
});
