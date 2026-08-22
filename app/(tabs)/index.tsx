import { useMemo, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PageTransition } from "@/components/page-transition";
import { useJournal, type EntryType } from "@/lib/journal-context";
import { useColors } from "@/hooks/use-colors";

const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const symbols: { type: EntryType; symbol: string; label: string }[] = [
  { type: "task", symbol: "•", label: "Task" },
  { type: "note", symbol: "–", label: "Note" },
  { type: "feeling", symbol: "=", label: "Feeling" },
  { type: "event", symbol: "○", label: "Event" },
];

export default function HomeScreen() {
  const colors = useColors();
  const { day, hydrated, setIntention, addPriority, completePriority, carryPriorityForward, addEntry, toggleEntry } = useJournal();
  const [priorityText, setPriorityText] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entryType, setEntryType] = useState<EntryType>("task");
  const [editingIntention, setEditingIntention] = useState(false);
  const dayDate = useMemo(() => dateLabel.format(new Date(`${day.date}T12:00:00`)), [day.date]);

  if (!hydrated) return <ScreenContainer className="items-center justify-center"><Text className="text-muted">Opening your page…</Text></ScreenContainer>;

  const submitPriority = () => { if (addPriority(priorityText)) setPriorityText(""); };
  const submitEntry = () => { addEntry(entryType, entryText); setEntryText(""); };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <PageTransition offset={6}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={day.entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 18, paddingBottom: 32 }}
          ListHeaderComponent={<>
            <View className="flex-row items-start justify-between mb-7">
              <View><Text className="text-xs font-semibold uppercase tracking-widest text-primary">Quiet Page</Text><Text className="mt-2 text-3xl font-bold text-foreground">{dayDate}</Text></View>
              <View className="rounded-full bg-surface px-3 py-2"><Text className="text-xs font-semibold text-muted">{day.entries.length} logs</Text></View>
            </View>
            <View className="mb-6 rounded-3xl border border-border bg-surface p-5">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted">Your intention</Text>
              {editingIntention || !day.intention ? <TextInput value={day.intention} onChangeText={setIntention} onBlur={() => setEditingIntention(false)} autoFocus={!day.intention} placeholder="What matters today?" placeholderTextColor={colors.muted} className="mt-3 min-h-12 text-xl font-semibold text-foreground" multiline returnKeyType="done" /> : <Pressable onPress={() => setEditingIntention(true)}><Text className="mt-3 text-xl font-semibold leading-7 text-foreground">{day.intention}</Text><Text className="mt-2 text-sm text-muted">Tap to revise · keep it kind</Text></Pressable>}
            </View>
            <View className="mb-6">
              <View className="mb-3 flex-row items-center justify-between"><View><Text className="text-lg font-bold text-foreground">Three priorities</Text><Text className="mt-1 text-sm text-muted">Small enough to hold in your head.</Text></View><Text className="text-sm font-bold text-primary">{day.priorities.length}/3</Text></View>
              {day.priorities.map((priority, index) => <View key={`${priority}-${index}`} className="mb-2 flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3"><Text className="mr-3 text-lg font-bold text-primary">{index + 1}</Text><Text className="flex-1 text-base text-foreground">{priority}</Text><Pressable onPress={() => carryPriorityForward(index)} hitSlop={10}><Text className="mr-4 text-xs font-semibold text-muted">Later</Text></Pressable><Pressable onPress={() => completePriority(index)} hitSlop={10}><Text className="text-xl text-primary">✓</Text></Pressable></View>)}
              {day.priorities.length < 3 && <View className="mt-2 flex-row items-center rounded-2xl border border-dashed border-border px-4 py-1"><TextInput value={priorityText} onChangeText={setPriorityText} onSubmitEditing={submitPriority} placeholder="Add a priority" placeholderTextColor={colors.muted} className="flex-1 py-3 text-base text-foreground" returnKeyType="done"/><Pressable onPress={submitPriority} style={({ pressed }) => [{ opacity: pressed ? 0.55 : 1 }]}><Text className="px-2 text-2xl text-primary">+</Text></Pressable></View>}
              {day.priorities.length === 3 && <Text className="mt-3 text-xs leading-5 text-muted">Three is the limit on purpose. Carry something forward when the time is right.</Text>}
            </View>
            <View className="mb-3"><Text className="text-lg font-bold text-foreground">Rapid log</Text><Text className="mt-1 text-sm text-muted">One sentence is enough.</Text></View>
            <View className="mb-3 flex-row gap-2">{symbols.map((item) => <Pressable key={item.type} onPress={() => setEntryType(item.type)} style={({ pressed }) => [{ width: "23%", opacity: pressed ? 0.65 : 1, backgroundColor: entryType === item.type ? colors.primary : colors.surface, borderColor: entryType === item.type ? colors.primary : colors.border }]} className="items-center rounded-2xl border py-3"><Text style={{ color: entryType === item.type ? colors.background : colors.primary }} className="text-xl font-bold">{item.symbol}</Text><Text style={{ color: entryType === item.type ? colors.background : colors.muted }} className="mt-1 text-xs font-semibold">{item.label}</Text></Pressable>)}</View>
            <View className="mb-5 flex-row items-end rounded-2xl border border-border bg-surface px-4 py-2"><TextInput value={entryText} onChangeText={setEntryText} onSubmitEditing={submitEntry} placeholder={entryType === "task" ? "What needs doing?" : entryType === "feeling" ? "Name what you notice…" : "Capture it quickly…"} placeholderTextColor={colors.muted} className="min-h-11 flex-1 py-2 text-base text-foreground" multiline returnKeyType="done"/><Pressable onPress={submitEntry} style={({ pressed }) => [{ opacity: pressed ? 0.55 : 1 }]}><Text className="px-1 pb-2 text-2xl font-bold text-primary">↑</Text></Pressable></View>
            {day.entries.length > 0 && <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Today, in your words</Text>}
          </>}
          renderItem={({ item }) => <View className="mb-3 flex-row items-start rounded-2xl border border-border bg-surface px-4 py-4"><Text className="mr-3 mt-0.5 text-xl font-bold text-primary">{symbols.find((s) => s.type === item.type)?.symbol}</Text><Pressable onPress={() => item.type === "task" && toggleEntry(item.id)} className="flex-1"><Text className={`text-base leading-6 text-foreground ${item.completed ? "line-through opacity-50" : ""}`}>{item.text}</Text><Text className="mt-1 text-xs capitalize text-muted">{item.type} · {new Date(item.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Text></Pressable></View>}
          ListEmptyComponent={<Text className="rounded-2xl bg-surface px-4 py-5 text-center text-sm leading-6 text-muted">A blank page is not behind. It is a place to begin.</Text>}
        />
        </KeyboardAvoidingView>
      </PageTransition>
    </ScreenContainer>
  );
}
