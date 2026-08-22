import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Fires a light haptic tap on native platforms only. Safe to call on web
 * and safe to call anywhere without worrying about unhandled rejections.
 */
export function tapFeedback() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

/** A slightly stronger confirmation tap for completing something. */
export function successFeedback() {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}
