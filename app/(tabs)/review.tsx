import { ScrollView, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useJournal } from "@/lib/journal-context";
import { useColors } from "@/hooks/use-colors";

export default function ReviewScreen() {
  const colors = useColors();
  const { day, setReflection, setCarryForward } = useJournal();
  const tasks = day.entries.filter((entry) => entry.type === "task");
  const completed = tasks.filter((entry) => entry.completed).length;
  return <ScreenContainer className="px-5" containerClassName="bg-background"><ScrollView contentContainerStyle={{ paddingTop: 22, paddingBottom: 36 }}><Text className="text-xs font-semibold uppercase tracking-widest text-primary">A softer close</Text><Text className="mt-2 text-3xl font-bold text-foreground">Notice, don’t measure.</Text><Text className="mt-2 text-base leading-6 text-muted">A few quiet minutes to see what supported you today.</Text>
    <View className="mt-7 rounded-3xl border border-border bg-surface p-5"><Text className="text-xs font-bold uppercase tracking-wider text-muted">Today at a glance</Text><View className="mt-4 flex-row"><View className="flex-1"><Text className="text-3xl font-bold text-foreground">{day.entries.length}</Text><Text className="mt-1 text-sm text-muted">rapid logs</Text></View><View className="flex-1 ml-3"><Text className="text-3xl font-bold text-foreground">{completed}</Text><Text className="mt-1 text-sm text-muted">done</Text></View><View className="flex-1 ml-3"><Text className="text-3xl font-bold text-foreground">{day.priorities.length}</Text><Text className="mt-1 text-sm text-muted">open</Text></View></View></View>
    <Text className="mt-8 text-lg font-bold text-foreground">What helped you move with care?</Text><TextInput value={day.reflection} onChangeText={setReflection} placeholder="No polished answer needed…" placeholderTextColor={colors.muted} multiline className="mt-3 min-h-32 rounded-2xl border border-border bg-surface p-4 text-base leading-6 text-foreground" />
    <Text className="mt-7 text-lg font-bold text-foreground">What can wait with you?</Text><Text className="mt-1 text-sm leading-5 text-muted">Keep one thread visible. Everything else can rest.</Text><TextInput value={day.carryForward} onChangeText={setCarryForward} placeholder="A gentle note for another day…" placeholderTextColor={colors.muted} multiline className="mt-3 min-h-24 rounded-2xl border border-border bg-surface p-4 text-base leading-6 text-foreground" />
    <View className="mt-8 rounded-2xl bg-primary/10 p-4"><Text className="text-base font-semibold text-foreground">Showing up counts.</Text><Text className="mt-1 text-sm leading-5 text-muted">There is no score here. The useful part is noticing what your own system is telling you.</Text></View>
  </ScrollView></ScreenContainer>;
}
