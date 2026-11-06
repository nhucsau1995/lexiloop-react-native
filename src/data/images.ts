// Real photos harvested from the Stitch design (design/assets), bundled locally.
export const images = {
  welcomeHero: require('../../assets/images/welcome-hero.jpg'),
  topicFood: require('../../assets/images/topic-food.jpg'),
  topicWork: require('../../assets/images/topic-work.jpg'),
  topicFeelings: require('../../assets/images/topic-feelings.jpg'),
  firstLesson: require('../../assets/images/first-lesson.jpg'),
  wordCommute: require('../../assets/images/word-commute.jpg'),
  avatarMaya: require('../../assets/images/avatar-maya.jpg'),
} as const;

export type ImageKey = keyof typeof images;
