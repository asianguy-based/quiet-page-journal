import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { Animated, Platform, type StyleProp, type ViewStyle } from "react-native";

type PageTransitionProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  offset?: number;
};

export function PageTransition({ children, style, offset = 8 }: PageTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(offset)).current;

  useFocusEffect(useCallback(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();
    opacity.setValue(0);
    translateY.setValue(offset);

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [offset, opacity, translateY]));

  return <Animated.View style={[{ flex: 1, opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}
