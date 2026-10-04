import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface EmptyDealsStateProps {
  query?: string;
  onClearFilters?: () => void;
}

export default function EmptyDealsState({
  query,
  onClearFilters,
}: EmptyDealsStateProps) {
  return (
    <View className="bg-white rounded-3xl py-12 px-6 items-center justify-center border border-neutral-100 my-4 shadow-sm">
      {/* Icon Circle */}
      <View className="w-16 h-16 rounded-full bg-orange-50 items-center justify-center mb-4 border border-orange-100/80">
        <Feather name="search" size={28} color="#ea580c" />
      </View>

      {/* Heading */}
      <Text className="text-neutral-900 font-bold text-lg text-center">
        No Deals Found
      </Text>

      {/* Subtitle / Description */}
      <Text className="text-neutral-500 text-base text-center mt-2 max-w-xs leading-6">
        {query && query.trim().length > 0
          ? `We couldn't find any deals matching "${query}". Try searching with different keywords.`
          : "There are currently no deals available in this category. Please check back soon!"}
      </Text>

      {/* Clear Filters CTA */}
      {onClearFilters && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClearFilters}
          className="mt-6 bg-orange-50 border border-orange-200 px-6 py-3 rounded-full active:bg-orange-100"
        >
          <Text className="text-orange-600 font-bold text-base">
            Clear Filters
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
