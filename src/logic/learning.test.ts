/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Word } from '../data/types.ts';
import { accuracy, filterWords, lessonXp, masteryCounts, nextMastery, nextStreak, validateSignUp } from './learning.ts';

const w = (id: string, mastery: Word['mastery']): Word => ({ id, word: id, phonetic: '', partOfSpeech: 'noun', meaning: '', short: `${id} gloss`, example: '', mastery });

test('lessonXp gives 10 per correct answer plus a bonus', () => {
  assert.equal(lessonXp(6, 10), 80);
  assert.equal(lessonXp(12, 10), 120);
  assert.equal(lessonXp(0, 0), 0);
});

test('accuracy rounds to whole percent', () => {
  assert.equal(accuracy(9, 10), 90);
  assert.equal(accuracy(2, 3), 67);
  assert.equal(accuracy(0, 0), 0);
});

test('mastery moves up on correct and back on wrong', () => {
  assert.equal(nextMastery('new', true), 'learning');
  assert.equal(nextMastery('learning', true), 'mastered');
  assert.equal(nextMastery('mastered', false), 'learning');
  assert.equal(nextMastery('new', false), 'new');
});

test('streak continues on consecutive days and resets after a gap', () => {
  assert.equal(nextStreak(12, '2026-11-05', '2026-11-06'), 13);
  assert.equal(nextStreak(12, '2026-11-06', '2026-11-06'), 12);
  assert.equal(nextStreak(12, '2026-11-01', '2026-11-06'), 1);
  assert.equal(nextStreak(0, null, '2026-11-06'), 1);
});

test('filterWords applies tab filter and search', () => {
  const list = [w('commute', 'mastered'), w('itinerary', 'learning'), w('wanderlust', 'new')];
  assert.deepEqual(filterWords(list, 'mastered', '').map((x) => x.id), ['commute']);
  assert.deepEqual(filterWords(list, 'learning', '').map((x) => x.id), ['itinerary', 'wanderlust']);
  assert.deepEqual(filterWords(list, 'all', 'ITIN').map((x) => x.id), ['itinerary']);
});

test('masteryCounts adds words learned outside the list', () => {
  const c = masteryCounts([w('a', 'mastered'), w('b', 'learning')], 51, 33);
  assert.deepEqual(c, { mastered: 52, learning: 34, total: 86, percent: 60 });
});

test('validateSignUp flags each bad field', () => {
  assert.deepEqual(validateSignUp('Maya Chen', 'maya.chen@mail.com', 'longenough'), {});
  const e = validateSignUp('M', 'nope', 'short');
  assert.deepEqual(Object.keys(e).sort(), ['email', 'name', 'password']);
});
