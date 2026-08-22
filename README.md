# Quiet Page

Quiet Page is a calm, local-first rapid-log journal for people who want a gentler way to organize attention. It is inspired by the Bullet Journal philosophy of intentionality, flexibility, self-awareness, and compassionate reflection.

## What it includes

The Today page is the main workspace. It supports a daily intention, up to three priorities, and rapid logging for tasks, notes, feelings, and events. Tasks can be completed or carried forward without creating an endless list.

The Review tab provides end-of-day prompts and a small summary focused on noticing rather than scoring. Pages shows recent entries with simple type filters. Settings explains the local-only storage model and offers a protected reset action.

Journal data is persisted on-device with AsyncStorage. The app does not require an account, cloud sync, or external API key.

## Stack

- Expo SDK 54
- React Native 0.81
- Expo Router 6
- React 19
- TypeScript
- NativeWind 4
- React Native Animated focus transitions
- AsyncStorage for local persistence

## Run locally

Install dependencies with `pnpm install`, then start the Expo web preview with `pnpm dev:metro`. Use `pnpm check` for TypeScript validation, `pnpm lint` for linting, and `pnpm test` for the test suite.

## Design notes

The interface uses warm parchment surfaces, deep ink typography, muted moss accents, and restrained motion. The Today and Pages views use a reusable focus-aware fade-and-lift transition so navigation feels continuous without becoming distracting.

The full interface plan and implementation checklist are in [`design.md`](./design.md) and [`todo.md`](./todo.md).
