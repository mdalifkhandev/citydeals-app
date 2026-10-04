import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface EmptyDealsStateProps {
  query?: string;
  areaName?: string;
  onClearFilters?: () => void;
  onSwitchArea?: () => void;
}

export default function EmptyDealsState({
  query,
  areaName,
  onClearFilters,
  onSwitchArea,
}: EmptyDealsStateProps) {
  const getSubtitle = () => {
    if (query && query.trim().length > 0) {
      return `We couldn't find any deals matching "${query}". Try searching with different keywords.`;
    }
    if (areaName && areaName !== "All Areas") {
      return `There are currently no active deals in ${areaName}. Try switching to another area or view deals across all regions.`;
    }
    return "There are currently no deals available for this selection. Please check back soon!";
  };

  return (
    <View className="bg-white rounded-3xl py-12 px-6 items-center justify-center border border-neutral-100 my-4">
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
        {getSubtitle()}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row items-center gap-3 mt-6">
        {onSwitchArea && areaName && areaName !== "All Areas" && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSwitchArea}
            className="flex-row items-center bg-white border border-neutral-200 px-5 py-3 rounded-full"
          >
            <Ionicons name="location-outline" size={16} color="#ea580c" />
            <Text className="text-neutral-700 font-bold text-sm ml-1.5">
              Change Area
            </Text>
          </TouchableOpacity>
        )}

        {onClearFilters && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClearFilters}
            className="bg-orange-50 border border-orange-200 px-5 py-3 rounded-full active:bg-orange-100"
          >
            <Text className="text-orange-600 font-bold text-sm">
              Clear All Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
