import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PageTransition } from "@/components/page-transition";
import { useJournal, type EntryType } from "@/lib/journal-context";
import { useColors } from "@/hooks/use-colors";

const filters: { label: string; value: EntryType | "all" }[] = [{ label: "All", value: "all" }, { label: "Tasks", value: "task" }, { label: "Notes", value: "note" }, { label: "Feelings", value: "feeling" }, { label: "Events", value: "event" }];
export default function EntriesScreen() {
  const colors = useColors();
  const { day } = useJournal();
  const [filter, setFilter] = useState<EntryType | "all">("all");
  const entries = useMemo(() => filter === "all" ? day.entries : day.entries.filter((entry) => entry.type === filter), [day.entries, filter]);
  return <ScreenContainer className="px-5" containerClassName="bg-background"><PageTransition offset={10}><ScrollView contentContainerStyle={{ paddingTop: 22, paddingBottom: 36 }}><Text className="text-xs font-semibold uppercase tracking-widest text-primary">Your pages</Text><Text className="mt-2 text-3xl font-bold text-foreground">Keep what matters.</Text><Text className="mt-2 text-base leading-6 text-muted">A small, searchable trail of your attention.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6"><View className="flex-row gap-2">{filters.map((item) => <Pressable key={item.value} onPress={() => setFilter(item.value)} style={{ backgroundColor: filter === item.value ? colors.primary : colors.surface, borderColor: filter === item.value ? colors.primary : colors.border }} className="rounded-full border px-4 py-2"><Text style={{ color: filter === item.value ? colors.background : colors.foreground }} className="text-sm font-semibold">{item.label}</Text></Pressable>)}</View></ScrollView><View className="mt-6">{entries.length === 0 ? <View className="rounded-3xl border border-border bg-surface p-6"><Text className="text-base font-semibold text-foreground">Nothing here yet.</Text><Text className="mt-2 text-sm leading-5 text-muted">Your notes will stay here as a record of what you noticed.</Text></View> : entries.map((entry) => <View key={entry.id} className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center justify-between"><Text className="text-xs font-bold uppercase tracking-wider text-primary">{entry.type}</Text><Text className="text-xs text-muted">Today</Text></View><Text className="mt-2 text-base leading-6 text-foreground">{entry.text}</Text></View>)}</View></ScrollView></PageTransition></ScreenContainer>;
}
