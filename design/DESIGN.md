# LexiLoop Design System

Bright, modern mobile app for learning English vocabulary. Clean, friendly, focused. Light theme.

## Color (use ONLY these colors; no default violet or indigo, no flat neutral grey)
- Background: #F4FBFC (tinted near-white)
- Surface (cards, sheets): #FFFFFF; Surface alt (grouped rows): #EAF5F7
- Accent (bright, large fills, icons, active states, big numerals): #00A9CE
- Accent fill (any button or chip with a WHITE label, links): #007791; pressed #006F88
- Accent tint (selected states, chip fills): #DDF3F8
- Support (decoration, illustration accents): #A7F797; support strong (chart second series, data): #25AA08
- Text primary #0C1B1F, secondary #46595E, tertiary #5F7277
- Hairline divider #D5E4E7; input and control borders #699C9F
- Status (text on tint): success #0E7C3A on #E3F4E9, warning #A75906 on #FAEFE1, danger #CE2020 on #FBE5E5, info #00738C on #E0EFF2
- Hero gradient (any surface carrying white text): #007791 -> #006F88. The soft accent -> support blend (#00A9CE -> #A7F797) is decoration only, never behind text.

## Typography
- Family: Chakra Petch for all UI and body text; JetBrains Mono for numerals (XP, counts, stats).
- Display 32 / 700 / -0.02em (screen titles, hero numbers)
- Title 20 / 600 (section headers, card titles)
- Body 16 / 400
- Label 14 / 500 (buttons, tabs)
- Caption 13 / 500 (metadata, secondary color)
- Use only these 5 sizes. Minimum text 12px (13px chips and tags, 14px legal text).

## Frame and layout
- 393x852 mobile frame. Keep top ~59px (status bar) and bottom ~34px (home indicator) clear of tappable content.
- 8pt spacing (4, 8, 12, 16, 24, 32), screen edge padding 20px, generous vertical rhythm.
- Radius: card 20, control 14, input 12, pill 999.
- Elevation: soft only, card = 0 1px 2px rgba(12,27,31,.04) + 0 8px 24px rgba(12,27,31,.06). No hard or black shadows.
- Icons: one set only, Lucide-style rounded outline, 24px, 1.75 stroke. Do not mix filled and outline.

## Controls (one spec each, reused on every screen)
- Primary button: pill, 56px tall, fill #007791, white 14/500 label; pressed #006F88; disabled 40% opacity.
- Secondary button: pill, white fill, 1.5px #699C9F border, ink label.
- Text input: 12px radius, 52px tall, white, 1px #699C9F border; focus = 2px #007791 ring; error = #CE2020 border + 13px helper.
- Card: white, 20px radius, soft shadow.
- Chip: pill, 32px tall, #DDF3F8 fill, #007791 13px label. Chips on a gradient use a dark translucent fill with white text, never white fill.
- Quiz option: 16px radius white card, 1.5px #D5E4E7 border; correct = #E3F4E9 fill + #0E7C3A check; wrong = #FBE5E5 fill + #CE2020 x.
- Progress bar: 8px pill track #EAF5F7, fill #00A9CE.

## Shared components
- Bottom tab bar (exactly 4 tabs, this order): Learn (book-open icon), Words (layers icon), Progress (bar-chart icon), Profile (user icon). Flat white bar, 1px #D5E4E7 top border, no gradient. Active tab: icon + label in #007791 with a small #DDF3F8 pill behind the icon. Inactive: #46595E. Never rename, reorder, add or remove tabs.
- Header: screen title left in Display style; streak chip right (flame icon + number, #DDF3F8 fill, #007791 text).
- Lesson screens (word card, quiz, lesson complete) are full-screen: close X top-left, progress bar, no tab bar.

## Focal element
One bold focal element per screen (hero lesson card, big word, big XP numeral, streak stat). Everything else stays quiet.

## Imagery
Real photography only; empty states and onboarding also use real photos or flat 2D vector art. NO 3D renders, claymorphism, isometric, CGI or glossy plastic objects.

## Meaning of color
Red only for errors, wrong answers and destructive actions. Warnings use the warning color with an icon.

## Copy scope
Do not mention: AI tutor, Speech recognition, Certificate, Live class, Premium. No invented integrations or person names beyond Maya Chen.
