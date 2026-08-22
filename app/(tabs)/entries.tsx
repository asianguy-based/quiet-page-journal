import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PageTransition } from "@/components/page-transition";
import { useJournal, type EntryType, type JournalDay } from "@/lib/journal-context";
import { useColors } from "@/hooks/use-colors";
import { tapFeedback } from "@/lib/haptics";

const filters: { label: string; value: EntryType | "all" }[] = [{ label: "All", value: "all" }, { label: "Tasks", value: "task" }, { label: "Notes", value: "note" }, { label: "Feelings", value: "feeling" }, { label: "Events", value: "event" }];
const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const todayKey = () => new Date().toISOString().slice(0, 10);

function formatDay(date: string) {
  if (date === todayKey()) return "Today";
  return dayLabel.format(new Date(`${date}T12:00:00`));
}

export default function EntriesScreen() {
  const colors = useColors();
  const { recentDays } = useJournal();
  const [filter, setFilter] = useState<EntryType | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>(recentDays[0]?.date ?? todayKey());

  const selectedDay: JournalDay | undefined = useMemo(
    () => recentDays.find((d) => d.date === selectedDate) ?? recentDays[0],
    [recentDays, selectedDate],
  );
  const entries = useMemo(
    () => (!selectedDay ? [] : filter === "all" ? selectedDay.entries : selectedDay.entries.filter((entry) => entry.type === filter)),
    [selectedDay, filter],
  );

  const selectDay = (date: string) => { setSelectedDate(date); tapFeedback(); };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <PageTransition offset={10}>
        <ScrollView contentContainerStyle={{ paddingTop: 22, paddingBottom: 36 }}>
          <Text className="text-xs font-semibold uppercase tracking-widest text-primary">Your pages</Text>
          <Text className="mt-2 text-3xl font-bold text-foreground">Keep what matters.</Text>
          <Text className="mt-2 text-base leading-6 text-muted">A small, searchable trail of your attention.</Text>

          <Text className="mt-6 text-xs font-bold uppercase tracking-wider text-muted">Index</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            <View className="flex-row gap-2">
              {recentDays.length === 0 && <Text className="py-2 text-sm text-muted">No pages yet.</Text>}
              {recentDays.map((d) => {
                const isActive = d.date === selectedDay?.date;
                return (
                  <Pressable
                    key={d.date}
                    onPress={() => selectDay(d.date)}
                    style={{ backgroundColor: isActive ? colors.primary : colors.surface, borderColor: isActive ? colors.primary : colors.border }}
                    className="min-w-[84px] items-center rounded-2xl border px-3 py-2"
                  >
                    <Text style={{ color: isActive ? colors.background : colors.foreground }} className="text-xs font-bold">{formatDay(d.date)}</Text>
                    <Text style={{ color: isActive ? colors.background : colors.muted }} className="mt-1 text-[10px]">{d.entries.length} logs</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5">
            <View className="flex-row gap-2">
              {filters.map((item) => (
                <Pressable key={item.value} onPress={() => { setFilter(item.value); tapFeedback(); }} style={{ backgroundColor: filter === item.value ? colors.primary : colors.surface, borderColor: filter === item.value ? colors.primary : colors.border }} className="rounded-full border px-4 py-2">
                  <Text style={{ color: filter === item.value ? colors.background : colors.foreground }} className="text-sm font-semibold">{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {selectedDay && (selectedDay.intention || selectedDay.priorities.length > 0) && (
            <View className="mt-5 rounded-2xl border border-border bg-surface p-4">
              {selectedDay.intention ? <Text className="text-sm italic leading-5 text-foreground">“{selectedDay.intention}”</Text> : null}
              {selectedDay.priorities.length > 0 && (
                <Text className="mt-2 text-xs leading-5 text-muted">Priorities: {selectedDay.priorities.join(" · ")}</Text>
              )}
            </View>
          )}

          <View className="mt-6">
            {entries.length === 0 ? (
              <View className="rounded-3xl border border-border bg-surface p-6">
                <Text className="text-base font-semibold text-foreground">Nothing here yet.</Text>
                <Text className="mt-2 text-sm leading-5 text-muted">Your notes will stay here as a record of what you noticed.</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <View key={entry.id} className="mb-3 rounded-2xl border border-border bg-surface p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase tracking-wider text-primary">{entry.migrated ? "migrated · " : ""}{entry.type}</Text>
                    <Text className="text-xs text-muted">{formatDay(selectedDay!.date)}</Text>
                  </View>
                  <Text className={`mt-2 text-base leading-6 text-foreground ${entry.completed ? "line-through opacity-50" : ""}`}>{entry.text}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </PageTransition>
    </ScreenContainer>
  );
}
