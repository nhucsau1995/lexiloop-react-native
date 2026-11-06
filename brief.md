# LexiLoop - Source Brief

## Title
LexiLoop - English vocabulary in short daily loops

## Description
LexiLoop is a mobile app for learning English vocabulary in a few minutes a day. A learner creates an account (or continues as a guest), picks an English level and a daily word goal, then works through short lessons: each new word comes on a card with a photo, phonetics, meaning and an example, followed by quick multiple-choice quizzes with instant feedback. Finishing a lesson awards XP, extends the daily streak and moves words from Learning to Mastered. The Progress tab shows the streak, a weekly XP chart, totals and progress to the next CEFR level; the Profile tab holds badges and settings.

## Store links
Not yet published (portfolio POC).

## Platform
Android demo, iOS-ready codebase (React Native / Expo).

## Category
Education - language learning.

## Features
- Registration with validation, guest mode, level (A1 to C1) and daily goal setup, profile with badges and settings
- Learn tab with today's lesson, word of the day and next topics; first-run empty state
- Word cards: photo, part of speech, phonetics, meaning, example, simulated pronunciation
- Multiple-choice quizzes with correct/wrong feedback sheet, hearts and XP
- Lesson complete summary: XP count-up, accuracy, time, words learned, streak
- My words list with Learning/Mastered filters, search and a mastery strip
- Progress: streak card, weekly XP bar chart, totals, level progress
- Animations: screen transitions, staggered entrances, spring press feedback, animated bars, sheet and counters

## Tech stack
- React Native 0.88 with Expo SDK 58 and Expo Router, TypeScript
- Redux Toolkit + react-redux (session, lesson, words, progress slices with async thunks)
- REST API client with an HTTP adapter and an in-app mock adapter
- expo-sqlite offline word cache
- Node.js REST API (no dependencies) in `server/`, with node:test tests
- Stack reason: the job names React Native, TypeScript, Redux, REST, SQLite and a Node.js backend, so the POC uses exactly that stack (job-pinned stack wins over the account default).

## Industry
EdTech / language learning.

## Metrics
Unpublished POC: no users or store metrics. The MVP target in the brief is a first version focused on the core loop (learn words, short exercises, track progress) for iOS and Android.

## Research notes
- Verified: every screen runs in the release build on an Android emulator (Maestro taps on testIDs), unit tests cover the learning rules and the API.
- Mocked: lesson content, the learner's history (streak, XP, words learned) and audio playback; the app uses the mock API adapter unless `EXPO_PUBLIC_API_URL` points at the Node.js server.
- Capture: GitHub Actions run 42160536054 (green on the first dispatch, about 20 min), 10 screenshots + demo GIF from the release APK.
- Design QA (screenshot mode): 97/100, grade A, no Critical or Major. Known Minor issues: Up next rows and the word-of-the-day speaker have no action yet; the third learned word on Lesson complete sits under the footer buttons; Saturday shows a streak check with 0 XP; status bar icons sit on the bright welcome photo.
- Next steps: persist the session token and user in SQLite/SecureStore, spaced-repetition review of Learning words, real audio (TTS or recorded clips), push reminders, content admin and a hosted Node.js API with a database.
