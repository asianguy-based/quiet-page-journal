import { Alert, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useJournal } from "@/lib/journal-context";
import { tapFeedback } from "@/lib/haptics";

export default function SettingsScreen() {
  const { day, history, resetAll } = useJournal();
  const totalDays = history.length + 1;
  const totalLogs = history.reduce((sum, d) => sum + d.entries.length, day.entries.length);
  const confirmReset = () => {
    tapFeedback();
    Alert.alert("Start fresh?", "This removes the journal stored on this device, including past pages. This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Reset journal", style: "destructive", onPress: resetAll }]);
  };
  return <ScreenContainer className="px-5" containerClassName="bg-background"><Text className="pt-6 text-xs font-semibold uppercase tracking-widest text-primary">Quiet Page</Text><Text className="mt-2 text-3xl font-bold text-foreground">A little space.</Text><Text className="mt-2 text-base leading-6 text-muted">Simple choices help the page stay yours.</Text>
    <View className="mt-8 rounded-3xl border border-border bg-surface p-5"><Text className="text-xs font-bold uppercase tracking-wider text-muted">Your record, so far</Text><View className="mt-3 flex-row"><View className="flex-1"><Text className="text-2xl font-bold text-foreground">{totalDays}</Text><Text className="mt-1 text-sm text-muted">{totalDays === 1 ? "page kept" : "pages kept"}</Text></View><View className="flex-1 ml-3"><Text className="text-2xl font-bold text-foreground">{totalLogs}</Text><Text className="mt-1 text-sm text-muted">rapid logs</Text></View></View><Text className="mt-3 text-xs leading-5 text-muted">Kept only on this device, up to your last 60 days.</Text></View>
    <View className="mt-4 rounded-3xl border border-border bg-surface p-5"><Text className="text-lg font-bold text-foreground">Private by default</Text><Text className="mt-2 text-sm leading-6 text-muted">Your journal is saved locally on this device. There are no accounts, feeds, streaks, or notifications competing for your attention.</Text></View><View className="mt-4 rounded-3xl border border-border bg-surface p-5"><Text className="text-lg font-bold text-foreground">The method</Text><Text className="mt-2 text-sm leading-6 text-muted">Capture quickly. Choose three priorities. Review with curiosity. Unfinished tasks migrate forward instead of vanishing. Adapt the page to your life instead of forcing your life into the page.</Text></View><Pressable onPress={confirmReset} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]} className="mt-8 rounded-2xl border border-error px-5 py-4"><Text className="text-center text-base font-semibold text-error">Reset local journal</Text></Pressable><Text className="mt-6 text-center text-xs leading-5 text-muted">Quiet Page · a calmer way to return to what matters</Text></ScreenContainer>;
}
