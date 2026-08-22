import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type EntryType = "task" | "note" | "feeling" | "event";
export type JournalEntry = { id: string; type: EntryType; text: string; createdAt: string; completed?: boolean };
export type JournalDay = { date: string; intention: string; priorities: string[]; entries: JournalEntry[]; reflection: string; carryForward: string };

type JournalContextValue = {
  day: JournalDay;
  history: JournalDay[];
  hydrated: boolean;
  setIntention: (value: string) => void;
  addPriority: (value: string) => boolean;
  completePriority: (index: number) => void;
  carryPriorityForward: (index: number) => void;
  addEntry: (type: EntryType, text: string) => void;
  toggleEntry: (id: string) => void;
  setReflection: (value: string) => void;
  setCarryForward: (value: string) => void;
  resetAll: () => Promise<void>;
};

const STORAGE_KEY = "quiet-page-journal-v1";
const todayKey = () => new Date().toISOString().slice(0, 10);
const blankDay = (date = todayKey()): JournalDay => ({ date, intention: "", priorities: [], entries: [], reflection: "", carryForward: "" });

const JournalContext = createContext<JournalContextValue | null>(null);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [day, setDay] = useState<JournalDay>(blankDay());
  const [history, setHistory] = useState<JournalDay[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        const saved = JSON.parse(raw) as { day: JournalDay; history: JournalDay[] };
        setDay(saved.day?.date === todayKey() ? saved.day : blankDay());
        setHistory(saved.history ?? []);
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ day, history })).catch(() => undefined);
  }, [day, history, hydrated]);

  const updateDay = (patch: Partial<JournalDay>) => setDay((current) => ({ ...current, ...patch }));
  const value = useMemo<JournalContextValue>(() => ({
    day, history, hydrated,
    setIntention: (intention) => updateDay({ intention }),
    addPriority: (value) => {
      const clean = value.trim();
      if (!clean || day.priorities.length >= 3) return false;
      updateDay({ priorities: [...day.priorities, clean] });
      return true;
    },
    completePriority: (index) => updateDay({ priorities: day.priorities.filter((_, i) => i !== index) }),
    carryPriorityForward: (index) => updateDay({ carryForward: day.priorities[index] ?? "", priorities: day.priorities.filter((_, i) => i !== index) }),
    addEntry: (type, text) => {
      const clean = text.trim();
      if (!clean) return;
      updateDay({ entries: [{ id: `${Date.now()}`, type, text: clean, createdAt: new Date().toISOString(), completed: false }, ...day.entries] });
    },
    toggleEntry: (id) => updateDay({ entries: day.entries.map((entry) => entry.id === id ? { ...entry, completed: !entry.completed } : entry) }),
    setReflection: (reflection) => updateDay({ reflection }),
    setCarryForward: (carryForward) => updateDay({ carryForward }),
    resetAll: async () => { await AsyncStorage.removeItem(STORAGE_KEY); setDay(blankDay()); setHistory([]); },
  }), [day, history, hydrated]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error("useJournal must be used inside JournalProvider");
  return context;
}

export type { EntryType };
