import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type EntryType = "task" | "note" | "feeling" | "event";
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: "Heavy",
  2: "Low",
  3: "Steady",
  4: "Good",
  5: "Bright",
};

export type JournalEntry = {
  id: string;
  type: EntryType;
  text: string;
  createdAt: string;
  completed?: boolean;
  /** True when this entry was carried forward from a previous, unfinished day. */
  migrated?: boolean;
};

export type JournalDay = {
  date: string;
  intention: string;
  priorities: string[];
  entries: JournalEntry[];
  reflection: string;
  carryForward: string;
  mood: MoodLevel | null;
  /** Count of priorities marked done this day (they are removed from the list on completion). */
  priorityCompletions: number;
};

type JournalContextValue = {
  day: JournalDay;
  history: JournalDay[];
  /** Today plus history, newest first — the full browsable record. */
  recentDays: JournalDay[];
  hydrated: boolean;
  setIntention: (value: string) => void;
  addPriority: (value: string) => boolean;
  completePriority: (index: number) => void;
  carryPriorityForward: (index: number) => void;
  addEntry: (type: EntryType, text: string) => void;
  toggleEntry: (id: string) => void;
  deleteEntry: (id: string) => void;
  setReflection: (value: string) => void;
  setCarryForward: (value: string) => void;
  setMood: (level: MoodLevel) => void;
  resetAll: () => Promise<void>;
};

const STORAGE_KEY = "quiet-page-journal-v2";
const LEGACY_STORAGE_KEY = "quiet-page-journal-v1";
const MAX_HISTORY_DAYS = 60;
const todayKey = () => new Date().toISOString().slice(0, 10);

const blankDay = (date = todayKey()): JournalDay => ({
  date,
  intention: "",
  priorities: [],
  entries: [],
  reflection: "",
  carryForward: "",
  mood: null,
  priorityCompletions: 0,
});

/**
 * Closes out a finished day and starts a fresh one, migrating what still
 * matters instead of silently dropping it — the rapid-log "migration"
 * practice from analog bullet journaling.
 */
function rollDayForward(previous: JournalDay, newDate: string): { closed: JournalDay; next: JournalDay } {
  const unfinishedTasks = previous.entries.filter((entry) => entry.type === "task" && !entry.completed);

  const closed: JournalDay = {
    ...previous,
    entries: previous.entries.map((entry) =>
      unfinishedTasks.some((task) => task.id === entry.id) ? { ...entry, migrated: true } : entry,
    ),
  };

  const migratedEntries: JournalEntry[] = unfinishedTasks.map((task, index) => ({
    id: `${Date.now()}-migrated-${index}`,
    type: "task",
    text: task.text,
    createdAt: new Date().toISOString(),
    completed: false,
    migrated: true,
  }));

  // Priorities left unset are the ones the day didn't get to; carry them
  // forward first, then anything explicitly noted in "what can wait".
  const leftoverPriorities = [...previous.priorities];
  if (previous.carryForward.trim()) leftoverPriorities.push(previous.carryForward.trim());
  const carriedPriorities = leftoverPriorities.slice(0, 3);

  const next: JournalDay = {
    ...blankDay(newDate),
    priorities: carriedPriorities,
    entries: migratedEntries,
  };

  return { closed, next };
}

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [day, setDay] = useState<JournalDay>(blankDay());
  const [history, setHistory] = useState<JournalDay[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // One-time migration from the pre-history storage shape.
          const legacy = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacy) raw = legacy;
        }
        if (raw) {
          const saved = JSON.parse(raw) as { day: JournalDay; history: JournalDay[] };
          const savedDay: JournalDay = { ...blankDay(saved.day?.date), ...saved.day };
          const savedHistory = saved.history ?? [];

          if (savedDay.date === todayKey()) {
            setDay(savedDay);
            setHistory(savedHistory);
          } else {
            const { closed, next } = rollDayForward(savedDay, todayKey());
            setDay(next);
            setHistory([closed, ...savedHistory].slice(0, MAX_HISTORY_DAYS));
          }
        }
      } catch {
        // Ignore corrupt storage and start fresh.
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ day, history })).catch(() => undefined);
  }, [day, history, hydrated]);

  const updateDay = (patch: Partial<JournalDay>) => setDay((current) => ({ ...current, ...patch }));

  const recentDays = useMemo(() => [day, ...history], [day, history]);

  const value = useMemo<JournalContextValue>(() => ({
    day, history, recentDays, hydrated,
    setIntention: (intention) => updateDay({ intention }),
    addPriority: (value) => {
      const clean = value.trim();
      if (!clean || day.priorities.length >= 3) return false;
      updateDay({ priorities: [...day.priorities, clean] });
      return true;
    },
    completePriority: (index) => updateDay({
      priorities: day.priorities.filter((_, i) => i !== index),
      priorityCompletions: day.priorityCompletions + 1,
    }),
    carryPriorityForward: (index) => updateDay({
      carryForward: [day.carryForward, day.priorities[index]].filter(Boolean).join("; "),
      priorities: day.priorities.filter((_, i) => i !== index),
    }),
    addEntry: (type, text) => {
      const clean = text.trim();
      if (!clean) return;
      updateDay({ entries: [{ id: `${Date.now()}`, type, text: clean, createdAt: new Date().toISOString(), completed: false }, ...day.entries] });
    },
    toggleEntry: (id) => updateDay({ entries: day.entries.map((entry) => entry.id === id ? { ...entry, completed: !entry.completed } : entry) }),
    deleteEntry: (id) => updateDay({ entries: day.entries.filter((entry) => entry.id !== id) }),
    setReflection: (reflection) => updateDay({ reflection }),
    setCarryForward: (carryForward) => updateDay({ carryForward }),
    setMood: (mood) => updateDay({ mood }),
    resetAll: async () => {
      await AsyncStorage.multiRemove([STORAGE_KEY, LEGACY_STORAGE_KEY]);
      setDay(blankDay());
      setHistory([]);
    },
  }), [day, history, recentDays, hydrated]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error("useJournal must be used inside JournalProvider");
  return context;
}

export type { EntryType };
