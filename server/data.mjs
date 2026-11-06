// Seed content for the API (mirrors src/data/seed.ts).
export const words = [
  { id: 'commute', word: 'commute', phonetic: '/kəˈmjuːt/', partOfSpeech: 'verb', meaning: 'to travel regularly between home and work', short: 'to travel to work', example: 'I commute to the office by train.', mastery: 'learning', image: 'wordCommute' },
  { id: 'reliable', word: 'reliable', phonetic: '/rɪˈlaɪ.ə.bəl/', partOfSpeech: 'adjective', meaning: 'able to be trusted to do what is expected', short: 'can be trusted', example: 'The bus is cheap and reliable.', mastery: 'learning' },
  { id: 'itinerary', word: 'itinerary', phonetic: '/aɪˈtɪn.ər.ər.i/', partOfSpeech: 'noun', meaning: 'a planned route or journey', short: 'a planned route', example: 'Our itinerary includes two days in the mountains.', mastery: 'learning' },
];

export const lesson = {
  id: 'travel',
  title: 'Travel and transport',
  totalWords: 10,
  doneWords: 8,
  image: 'wordCommute',
  steps: [
    { kind: 'word', wordId: 'commute' },
    { kind: 'quiz', quiz: { wordId: 'reliable', prompt: 'Choose the meaning of', options: ['easy to break', 'can be trusted', 'very expensive', 'hard to find'], answer: 1 } },
  ],
};
