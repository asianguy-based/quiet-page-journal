# Quiet Page — Mobile Interface Design

## Product direction

Quiet Page is a private, offline-first rapid-log journal for people who want a gentler way to organize attention. It follows the reference philosophy: choose what matters, capture quickly, keep the system flexible, and return without shame. The app should feel like opening a calm paper notebook, not managing a productivity dashboard.

The experience assumes portrait orientation and one-handed use. The home screen is a single Daily Page with a clear next action and generous touch targets. The app uses a warm paper background, ink-like typography, restrained motion, and no streaks, badges, or pressure language.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Daily Page | Shows the current date, a short welcome, one daily intention field, a one-tap mood check-in, the three-priority rail, and a rapid-log composer. Users can add tasks, notes, feelings, and events, complete or delete entries, and navigate to the review tab. Unfinished tasks from a previous day appear with a migrated marker and a gentle notice. |
| Review | Shows a compassionate end-of-day prompt, a short reflection field, a completion summary, and a 7-day pattern card (mood + log counts). It emphasizes noticing rather than scoring. |
| Entries | Shows a daily index strip of recent pages (today plus history) and lets the user select any day to browse its entries, with filters for task, note, feeling, and event. |
| Settings | Shows a running count of pages kept and total rapid logs, local-only storage reassurance, the current visual theme, and a reset option with confirmation. No account or sync is proposed. |

## Key user flows

### Start the day

The user opens Quiet Page and sees the current date plus a small prompt: “What matters today?” They write an intention, then choose up to three priorities. The app does not allow a fourth active priority; instead it explains that keeping the list small protects attention.

### Rapid log

The user taps one of four symbol buttons — task, note, feeling, or event — then types a single sentence. Saving returns them to the Daily Page and places the entry in the timeline. Tasks can be marked complete with a single tap; other entries remain lightweight and editable.

### Close the day

The user opens Review, sees what they captured, and answers “What helped me move with care today?” They can also record one thing to carry forward. The flow ends with a quiet confirmation rather than a score or streak.

### Return after a gap

If there are no entries for the current day, the home screen simply welcomes the user back with “A fresh page is enough.” There are no missed-day warnings, streak breaks, or guilt-inducing alerts.

### Migrate, don't lose

When the user opens the app on a new day, the previous day is quietly closed: any unfinished tasks are copied onto the fresh page with a small arrow marker and a "carried forward, no judgment" notice, and the previous day itself is preserved in history rather than discarded. This mirrors the analog bullet-journal habit of migrating unfinished items instead of losing them, while keeping the tone free of guilt.

## Visual system

| Element | Choice |
|---|---|
| Background | Warm parchment `#F7F3EA`, with a subtle cream surface `#FFFDF8` for cards. |
| Primary ink | Deep charcoal `#252522`; secondary ink `#77736B`. |
| Accent | Moss green `#6E7F63` for primary actions and completed states. |
| Warm accent | Muted clay `#C78363` for feelings and gentle emphasis. |
| Borders | Soft sand `#E6DED1`, one-pixel separators only. |
| Typography | System rounded sans for readability, with bold weights for hierarchy and relaxed line height. |
| Shape language | Rounded 18–24px cards, pill controls, and small circular symbol markers. |

Primary actions use filled moss green with dark text or white text as contrast requires. Secondary actions use transparent surfaces with sand borders. The interface should stay visually quiet: one strong action per region, no dense grids, and no decorative illustrations competing with the journal content.

## Interaction principles

Every primary tap receives light haptic feedback on native platforms and a clear pressed state. The composer stays close to the bottom of the screen for thumb reach. Text inputs use concise prompts and return-key submission. The app persists all journal state locally with AsyncStorage and restores it on launch.
