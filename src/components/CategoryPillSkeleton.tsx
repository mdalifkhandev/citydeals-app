import React, { useEffect, useRef } from "react";
import { View, Animated, ScrollView } from "react-native";

interface CategoryPillSkeletonProps {
  count?: number;
}

export default function CategoryPillSkeleton({ count = 5 }: CategoryPillSkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={{ opacity: pulseAnim }}
          className="h-10 w-24 rounded-full bg-slate-200 border border-slate-300/40"
        />
      ))}
    </ScrollView>
  );
}
