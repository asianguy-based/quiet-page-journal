import { useMemo } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useJournal, type JournalDay, type MoodLevel } from "@/lib/journal-context";
import { useColors } from "@/hooks/use-colors";

const dayLetter = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });
const moodFaces: Record<MoodLevel, string> = { 1: "☹", 2: "⌢", 3: "–", 4: "⌣", 5: "☺" };

/** Builds the last 7 calendar days (oldest first), filling gaps with empty placeholders. */
function useWeekRows(recentDays: JournalDay[]) {
  return useMemo(() => {
    const byDate = new Map(recentDays.map((d) => [d.date, d]));
    const rows: { date: string; label: string; day: JournalDay | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      rows.push({ date: key, label: dayLetter.format(d), day: byDate.get(key) ?? null });
    }
    return rows;
  }, [recentDays]);
}

export default function ReviewScreen() {
  const colors = useColors();
  const { day, recentDays, setReflection, setCarryForward } = useJournal();
  const tasks = day.entries.filter((entry) => entry.type === "task");
  const completed = tasks.filter((entry) => entry.completed).length;
  const weekRows = useWeekRows(recentDays);
  const daysWithMood = weekRows.filter((row) => row.day?.mood).length;

  return <ScreenContainer className="px-5" containerClassName="bg-background"><ScrollView contentContainerStyle={{ paddingTop: 22, paddingBottom: 36 }}><Text className="text-xs font-semibold uppercase tracking-widest text-primary">A softer close</Text><Text className="mt-2 text-3xl font-bold text-foreground">Notice, don’t measure.</Text><Text className="mt-2 text-base leading-6 text-muted">A few quiet minutes to see what supported you today.</Text>
    <View className="mt-7 rounded-3xl border border-border bg-surface p-5"><Text className="text-xs font-bold uppercase tracking-wider text-muted">Today at a glance</Text><View className="mt-4 flex-row"><View className="flex-1"><Text className="text-3xl font-bold text-foreground">{day.entries.length}</Text><Text className="mt-1 text-sm text-muted">rapid logs</Text></View><View className="flex-1 ml-3"><Text className="text-3xl font-bold text-foreground">{completed}</Text><Text className="mt-1 text-sm text-muted">tasks done</Text></View><View className="flex-1 ml-3"><Text className="text-3xl font-bold text-foreground">{day.priorityCompletions}</Text><Text className="mt-1 text-sm text-muted">priorities met</Text></View><View className="flex-1 ml-3"><Text className="text-3xl font-bold text-foreground">{day.priorities.length}</Text><Text className="mt-1 text-sm text-muted">open</Text></View></View></View>

    <View className="mt-6 rounded-3xl border border-border bg-surface p-5">
      <Text className="text-xs font-bold uppercase tracking-wider text-muted">This week&apos;s pattern</Text>
      <Text className="mt-1 text-sm leading-5 text-muted">A gentle tracker, not a scoreboard.</Text>
      <View className="mt-4 flex-row justify-between">
        {weekRows.map((row) => {
          const isToday = row.date === day.date;
          const hasMood = !!row.day?.mood;
          return (
            <View key={row.date} className="items-center" style={{ width: "12.5%" }}>
              <Text className={`text-xs font-semibold ${isToday ? "text-primary" : "text-muted"}`}>{row.label}</Text>
              <View
                style={{
                  marginTop: 6,
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: hasMood ? colors.primary : "transparent",
                  borderWidth: 1,
                  borderColor: isToday ? colors.primary : colors.border,
                }}
              >
                <Text style={{ color: hasMood ? colors.background : colors.muted, fontSize: 13 }}>
                  {hasMood ? moodFaces[row.day!.mood as MoodLevel] : "·"}
                </Text>
              </View>
              <Text className="mt-1 text-[10px] text-muted">{row.day ? row.day.entries.length : 0}</Text>
            </View>
          );
        })}
      </View>
      <Text className="mt-4 text-xs leading-5 text-muted">
        {daysWithMood === 0
          ? "Check in once a day and a shape will start to show here."
          : `You checked in on ${daysWithMood} of the last 7 days. Numbers below each day are rapid logs, just for reference.`}
      </Text>
    </View>

    <Text className="mt-8 text-lg font-bold text-foreground">What helped you move with care?</Text><TextInput value={day.reflection} onChangeText={setReflection} placeholder="No polished answer needed…" placeholderTextColor={colors.muted} multiline className="mt-3 min-h-32 rounded-2xl border border-border bg-surface p-4 text-base leading-6 text-foreground" />
    <Text className="mt-7 text-lg font-bold text-foreground">What can wait with you?</Text><Text className="mt-1 text-sm leading-5 text-muted">Keep one thread visible. Everything else can rest.</Text><TextInput value={day.carryForward} onChangeText={setCarryForward} placeholder="A gentle note for another day…" placeholderTextColor={colors.muted} multiline className="mt-3 min-h-24 rounded-2xl border border-border bg-surface p-4 text-base leading-6 text-foreground" />
    <View className="mt-8 rounded-2xl bg-primary/10 p-4"><Text className="text-base font-semibold text-foreground">Showing up counts.</Text><Text className="mt-1 text-sm leading-5 text-muted">There is no score here. The useful part is noticing what your own system is telling you.</Text></View>
  </ScrollView></ScreenContainer>;
}
