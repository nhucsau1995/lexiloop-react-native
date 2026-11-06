import { useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FadeIn } from '../../components/FadeIn';
import { Header } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import type { Mastery } from '../../data/types';
import { filterWords, masteryCounts, type WordFilter } from '../../logic/learning';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWords, setFilter, setQuery } from '../../store/wordsSlice';
import { colors, font, radius, size } from '../../theme/tokens';

const STATUS: Record<Mastery, { label: string; tone: 'success' | 'accent' | 'info' }> = {
  mastered: { label: 'Mastered', tone: 'success' },
  learning: { label: 'Learning', tone: 'accent' },
  new: { label: 'New', tone: 'info' },
};
const FILTERS: { id: WordFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'learning', label: 'Learning' },
  { id: 'mastered', label: 'Mastered' },
];

// 09 My words: saved words from the API (SQLite cache offline), filter + search.
export default function Words() {
  const dispatch = useAppDispatch();
  const { list, filter, query } = useAppSelector((s) => s.words);
  const total = useAppSelector((s) => s.progress.wordsLearned);
  useEffect(() => {
    if (!list.length) dispatch(fetchWords());
  }, [list.length, dispatch]);

  // words learned outside this list (earlier lessons) split about 60/40
  const extra = Math.max(0, total - list.length);
  const extraMastered = Math.round(extra * 0.6);
  const c = masteryCounts(list, extraMastered, extra - extraMastered);
  const shown = filterWords(list, filter, query);

  return (
    <Screen testID="screen-words">
      <Header title="My words" badge={String(c.total)} />
      <View style={styles.search}>
        <Icon name="search" size={20} color={colors.text2} />
        <TextInput
          testID="search-words"
          accessibilityLabel="Search words"
          placeholder="Search words"
          placeholderTextColor={colors.text3}
          value={query}
          onChangeText={(t) => dispatch(setQuery(t))}
          style={styles.input}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        {FILTERS.map((f) => (
          <Chip key={f.id} testID={`filter-${f.id}`} label={f.label} tone={filter === f.id ? 'solid' : 'outline'} onPress={() => dispatch(setFilter(f.id))} />
        ))}
      </View>
      <FadeIn>
        <Card style={{ marginTop: 12, paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T variant="caption" style={{ fontFamily: font.mono }}>
              <T variant="caption" style={{ fontFamily: font.monoBold, color: colors.success }}>{c.mastered}</T> mastered · <T variant="caption" style={{ fontFamily: font.monoBold, color: colors.accentFill }}>{c.learning}</T> learning
            </T>
            <T variant="caption" style={{ fontFamily: font.mono }}>{c.percent}% complete</T>
          </View>
          <View style={styles.split}>
            <View style={{ flex: c.mastered, backgroundColor: colors.supportStrong }} />
            <View style={{ flex: c.learning, backgroundColor: colors.accent }} />
          </View>
        </Card>
      </FadeIn>
      <Card style={{ marginTop: 12, paddingVertical: 4 }}>
        {shown.length === 0 ? (
          <T variant="body" style={{ color: colors.text2, paddingVertical: 20, textAlign: 'center' }}>No words match "{query}"</T>
        ) : (
          shown.map((w, i) => (
            <FadeIn key={w.id} delay={i * 40}>
              <View style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]} testID={`word-${w.id}`}>
                <View style={{ flex: 1 }}>
                  <T variant="body" style={{ fontFamily: font.semibold }}>{w.word}</T>
                  <T variant="caption">{w.short}</T>
                </View>
                <Chip label={STATUS[w.mastery].label} tone={STATUS[w.mastery].tone} />
              </View>
            </FadeIn>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { marginTop: 16, height: 52, borderRadius: radius.input, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  input: { flex: 1, fontFamily: font.regular, fontSize: size.body, color: colors.text, height: 50 },
  split: { flexDirection: 'row', height: 8, borderRadius: 999, overflow: 'hidden', marginTop: 10, backgroundColor: colors.surfaceAlt },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
});
