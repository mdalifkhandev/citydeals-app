import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

interface CurvedHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function CurvedHeader({
  title,
  showBackButton = false,
}: CurvedHeaderProps) {
  return (
    <View className="relative bg-[#0f3b5e] pt-14 pb-8 px-6 rounded-b-[28px] overflow-hidden">
      <Image
        source={require("../../assets/images/line-background.png")}
        className="absolute bottom-0 w-full"
        resizeMode="cover"
      />

      <View className="flex-row items-center justify-between z-10">
        {showBackButton ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white items-center justify-center shadow-sm"
          >
            <Feather name="arrow-left" size={22} color="#1e293b" />
          </TouchableOpacity>
        ) : (
          <View className="w-11" />
        )}

        <Text className="text-white font-bold text-lg tracking-wide text-center flex-1">
          {title}
        </Text>

        <View className="w-11" />
      </View>
    </View>
  );
}
