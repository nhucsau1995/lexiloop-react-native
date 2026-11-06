import type { DayXp, Lesson, User, Word } from './types';

// Mock content served by the local API adapter (and by server/ for the Node.js backend).
export const demoUser: User = {
  id: 'u-maya',
  name: 'Maya Chen',
  email: 'maya.chen@mail.com',
  level: 'intermediate',
  dailyGoal: 10,
  joined: '2026-09-02',
  guest: false,
};

export const words: Word[] = [
  { id: 'commute', word: 'commute', phonetic: '/kəˈmjuːt/', partOfSpeech: 'verb', meaning: 'to travel regularly between home and work', short: 'to travel to work', example: 'I commute to the office by train.', mastery: 'learning', image: 'wordCommute' },
  { id: 'reliable', word: 'reliable', phonetic: '/rɪˈlaɪ.ə.bəl/', partOfSpeech: 'adjective', meaning: 'able to be trusted to do what is expected', short: 'can be trusted', example: 'The bus is cheap and reliable.', mastery: 'learning' },
  { id: 'itinerary', word: 'itinerary', phonetic: '/aɪˈtɪn.ər.ər.i/', partOfSpeech: 'noun', meaning: 'a planned route or journey', short: 'a planned route', example: 'Our itinerary includes two days in the mountains.', mastery: 'learning' },
  { id: 'wanderlust', word: 'wanderlust', phonetic: '/ˈwɒn.də.lʌst/', partOfSpeech: 'noun', meaning: 'a strong wish to travel', short: 'strong wish to travel', example: 'Her wanderlust took her to twelve countries.', mastery: 'new' },
  { id: 'deadline', word: 'deadline', phonetic: '/ˈded.laɪn/', partOfSpeech: 'noun', meaning: 'the latest time by which something must be finished', short: 'latest time to finish', example: 'The deadline for the report is Friday.', mastery: 'learning' },
  { id: 'borrow', word: 'borrow', phonetic: '/ˈbɒr.əʊ/', partOfSpeech: 'verb', meaning: 'to take something and promise to give it back', short: 'take and give back', example: 'Can I borrow your pen?', mastery: 'mastered' },
  { id: 'luggage', word: 'luggage', phonetic: '/ˈlʌɡ.ɪdʒ/', partOfSpeech: 'noun', meaning: 'the bags you take when you travel', short: 'travel bags', example: 'Please keep your luggage with you.', mastery: 'mastered' },
  { id: 'schedule', word: 'schedule', phonetic: '/ˈʃed.juːl/', partOfSpeech: 'noun', meaning: 'a plan of times when things will happen', short: 'a plan of times', example: 'The train schedule changed this week.', mastery: 'mastered' },
];

// Words already learned before this lesson (the list shows 86 in total).
export const learnedBefore = 78;

export const todayLesson: Lesson = {
  id: 'travel',
  title: 'Travel and transport',
  totalWords: 10,
  doneWords: 8,
  image: 'wordCommute',
  steps: [
    { kind: 'word', wordId: 'commute' },
    {
      kind: 'quiz',
      quiz: { wordId: 'reliable', prompt: 'Choose the meaning of', options: ['easy to break', 'can be trusted', 'very expensive', 'hard to find'], answer: 1 },
    },
  ],
};

export const upNext = [
  { id: 'food', title: 'Food and cooking', words: 10, image: 'topicFood' },
  { id: 'work', title: 'Work and office', words: 8, image: 'topicWork' },
  { id: 'feelings', title: 'Feelings', words: 12, image: 'topicFeelings' },
] as const;

export const weekXp: DayXp[] = [
  { day: 'Mon', xp: 40 },
  { day: 'Tue', xp: 80 },
  { day: 'Wed', xp: 60 },
  { day: 'Thu', xp: 120 },
  { day: 'Fri', xp: 90 },
  { day: 'Sat', xp: 0 },
  { day: 'Sun', xp: 70 },
];

export const stats = { streak: 12, bestStreak: 15, accuracy: 88, minutes: 47, levelProgress: 62 };
