Design a responsive web application (mobile, tablet, and desktop) for Thai-speaking stroke survivors with aphasia to practice speech and language at home between sessions with their speech-language therapist. All UI text must be in Thai.

## Users and accessibility (most important)
Users have aphasia after stroke: their ability to understand and produce language is impaired. Many are older adults, and many have weakness in their right arm/hand. A family caregiver often helps with setup.

Design principles:
- Minimal text. Every instruction uses a large icon or picture plus very short Thai text (max ~6 words).
- Every instruction and question has a large "listen" (speaker) button that reads it aloud with TTS.
- Large touch targets (min 56px), large font (body min 20px), high contrast, generous spacing.
- One main action per screen. Avoid nested menus, small icons, and dense layouts.
- Usable with one hand; primary buttons reachable at the bottom on mobile.
- Never show harsh failure states (no red X, no "wrong"). Use warm, encouraging feedback and offer help instead.
- Friendly and calm, but not childish or cartoonish (users are adults).

## Visual style: blue and white theme
- Overall feel: clean, calm, trustworthy, and welcoming, like a modern friendly health app. Lots of white space.
- Color palette:
  - Primary blue: #2F80ED (main buttons, active states, key highlights)
  - Light blue: #EAF3FF (card backgrounds, selected items, soft sections)
  - Deep navy: #1E3A5F (headings and main text, for strong contrast)
  - White: #FFFFFF (page background and cards)
  - Soft gray: #6B7A90 (secondary text), #E3E8EF (borders and dividers)
  - Warm accent: #FF9F43 (streak flame and celebrations only)
  - Success green: #27AE60 (gentle positive feedback only)
- Typography: Thai font such as Sarabun, Noto Sans Thai, or IBM Plex Sans Thai. Clear hierarchy with large headings; body text min 20px.
- Shapes: rounded corners (16-24px) on cards and buttons, soft shadows, no harsh lines.
- Icons: simple, rounded, outlined style, always paired with a short label.
- Illustrations: soft, flat illustrations of everyday objects and situations in the blue palette, showing adult or older-adult characters.
- Motion: subtle and slow (gentle fades, soft scale on press, a small celebration animation for achievements). Avoid fast or flashing animations.
- Must meet WCAG AA contrast for all text.

## Screens

1. Login / Register
- Simple, welcoming form on a white card over a soft light-blue background, with the app logo and a friendly illustration.
- Clearly note that a caregiver can help fill it in.
- Register collects: full name, profile photo (optional), and caregiver contact (optional).

2. First-time assessment (shown only to new users after register)
- Short preliminary screening (5-8 items), mostly picture- and audio-based: e.g. "tap the picture you hear", "say the name of this picture", "repeat this sentence".
- Progress indicator, one question per screen, a "skip" option, and a "listen again" button.
- Result screen shows the user's starting level in friendly, encouraging language, with a note that this is a preliminary result, not a medical diagnosis, and that their therapist can adjust it.

3. Home
- Greeting with name and profile photo (e.g. "สวัสดีค่ะ คุณสมชาย").
- A small streak badge in the top corner: a flame icon in the warm accent color with the number of consecutive practice days (e.g. "🔥 5"). Tapping it opens a simple weekly calendar showing which days were practiced.
- The flame should feel rewarding: it grows slightly or glows at milestones (e.g. 3, 7, 30 days), with a short celebration animation when the streak increases.
- If the user missed a day, never show shame or loss messaging. Show a gentle message such as "กลับมาฝึกด้วยกันนะ" and let the streak restart warmly.
- Current level card (light blue background).
- Today's progress (e.g. exercises done today, shown as a simple progress ring or bar).
- One very large primary blue button: "เริ่มฝึก" (start practice), leading to the Exercise page at the user's current level.

4. Navigation
- Collapsible sidebar on desktop/tablet: white background, collapsed shows icons only; clicking expands to icons + labels. Active item highlighted in light blue with a primary blue icon.
- Items: Home, Exercise. Logout pinned at the bottom.
- On mobile, use a bottom navigation bar instead of the sidebar.

5. Exercise (level and mode selection)
- Exercises are organized into levels from easier to harder. The exact number of levels and the content of each level will be defined later; use placeholder levels (e.g. Level 1, Level 2, Level 3) for now.
- At the top, show a level selector (tabs or large pill buttons). It opens on the user's current level by default, highlighted in primary blue.
- Lower levels are unlocked so the user can go back and review. Higher levels are locked with a lock icon on a light gray tab and a friendly hint on how to unlock, never a discouraging message.
- Below the level selector, show the practice modes for the selected level as large cards with an illustration, short Thai title, and estimated time:
  a) Picture naming (ใบ้คำด้วยรูปภาพ)
  b) Word clues (ใบ้คำด้วยคำอธิบาย)
  c) Everyday conversation (ตอบคำถามชีวิตประจำวัน)
  d) Everyday phrases (ฝึกพูดประโยคที่ใช้บ่อย)
- Some modes may not be available at every level; show these as locked cards.

6. Exercise screens
All speaking exercises share one recording component with clear states:
ready (large round blue microphone button) → recording (animated waveform, large stop button) → processing (calm loading animation) → feedback.
Feedback shows what the system heard, an encouraging message, and buttons: "ลองอีกครั้ง" (try again) and "ข้อต่อไป" (next).

a) Picture naming
- Shows a large picture on a white card. User says the name.
- If the user cannot answer or answers incorrectly, offer step-by-step hints (category hint → first syllable → full word), each with audio.
- If still incorrect, log it and start a "copy and recall" sequence:
  Step 1: show picture + word, user says/writes it (copy)
  Step 2: hide picture and word, user says/writes it from memory (recall)
  Show a clear step indicator for these steps.

b) Word clues
- Shows a text clue with audio, e.g. "สิ่งที่ใช้โทรคุยกัน". User says the answer (e.g. "โทรศัพท์").
- Same hint and feedback behavior as picture naming.

c) Everyday conversation
- Chat-like screen with soft blue bubbles for the AI and white bubbles for the user.
- AI asks a simple daily-life question (e.g. "วันนี้คุณทำอะไรมา") with audio.
- User answers by speaking. Show the AI's short, encouraging follow-up.
- Offer optional suggestion chips (example answers) if the user is stuck.

d) Everyday phrases
- AI presents a common phrase for a real-life situation (e.g. ordering food, asking for water) with an illustration of the situation and audio.
- User listens and repeats. Feedback as above.

7. Session complete
- Warm celebration screen with gentle confetti in blue and warm accent colors, a summary (exercises done, current streak with flame), and a button back to Home.

## Out of scope for now
- No therapist dashboard (patient side only).
- Use mock data; no real backend required.

## Deliverables
- All screens above, including empty, loading, recording, and feedback states.
- A consistent design system: color palette, typography scale, button styles, card styles, the streak badge, the level selector, and the shared recording component.