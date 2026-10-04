import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AppBottomSheet from "./AppBottomSheet";
import { useAreas, AreaItem } from "../features/areas";
import { useLocationStore } from "../features/location/store/useLocationStore";
import { locationService } from "../features/location/services/locationService";
import { toast } from "sonner-native";

interface AreaSelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AreaSelectorModal({
  isVisible,
  onClose,
}: AreaSelectorModalProps) {
  const { data: areas = [], isLoading: isAreasLoading } = useAreas();
  const { selectedArea, isAutoDetect, setSelectedArea, setIsAutoDetect } =
    useLocationStore();

  const handleUseGPS = async () => {
    onClose();
    setIsAutoDetect(true);
    toast.info("Detecting your location...", {
      description: "Fetching GPS coordinates and matching nearby area",
    });

    const res = await locationService.requestAndGetLocation();
    if (res?.locationName) {
      toast.success("Location updated", {
        description: `Active area: ${res.locationName}`,
      });
    }
  };

  const handleSelectArea = (area: AreaItem) => {
    setSelectedArea(area);
    onClose();
    toast.success(`Switched to ${area.name}`);
  };

  const handleSelectAllAreas = () => {
    setSelectedArea({
      id: "all",
      name: "All Areas",
      slug: "all",
      city: "All Cities",
    });
    onClose();
    toast.success("Showing deals from all areas");
  };

  const isAllSelected = selectedArea?.slug === "all";

  return (
    <AppBottomSheet isPresented={isVisible} onDismiss={onClose}>
      <View className="pb-2">
        {/* Header */}
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-100">
          <View>
            <Text className="text-xl font-bold text-neutral-900">
              Select Your Area
            </Text>
            <Text className="text-sm text-neutral-500 mt-0.5">
              Explore deals and discounts in your city
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
          >
            <Feather name="x" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="max-h-[420px] mt-3"
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        >
          {/* Option: Current GPS Location */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleUseGPS}
            className={`flex-row items-center p-3.5 rounded-2xl border ${
              isAutoDetect
                ? "bg-orange-50/70 border-orange-300"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isAutoDetect ? "bg-orange-500" : "bg-neutral-200"
              }`}
            >
              <Ionicons
                name="navigate"
                size={18}
                color={isAutoDetect ? "#ffffff" : "#475569"}
              />
            </View>
            <View className="ml-3.5 flex-1">
              <View className="flex-row items-center">
                <Text
                  className={`font-bold text-base ${
                    isAutoDetect ? "text-orange-900" : "text-neutral-900"
                  }`}
                >
                  Use My Current Location
                </Text>
                {isAutoDetect && (
                  <View className="bg-orange-200/80 px-2 py-0.5 rounded-full ml-2">
                    <Text className="text-[10px] font-bold text-orange-800 uppercase">
                      Active GPS
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-xs text-neutral-500 mt-0.5">
                Automatically finds nearest deals around you
              </Text>
            </View>
            {isAutoDetect && (
              <Feather name="check" size={20} color="#ea580c" />
            )}
          </TouchableOpacity>

          {/* Option: All Areas */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleSelectAllAreas}
            className={`flex-row items-center p-3.5 rounded-2xl border ${
              isAllSelected && !isAutoDetect
                ? "bg-orange-50/70 border-orange-300"
                : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isAllSelected && !isAutoDetect
                  ? "bg-orange-500"
                  : "bg-neutral-200"
              }`}
            >
              <Feather
                name="globe"
                size={18}
                color={isAllSelected && !isAutoDetect ? "#ffffff" : "#475569"}
              />
            </View>
            <View className="ml-3.5 flex-1">
              <Text
                className={`font-bold text-base ${
                  isAllSelected && !isAutoDetect
                    ? "text-orange-900"
                    : "text-neutral-900"
                }`}
              >
                All Cities & Areas
              </Text>
              <Text className="text-xs text-neutral-500 mt-0.5">
                Show deals across all regions
              </Text>
            </View>
            {isAllSelected && !isAutoDetect && (
              <Feather name="check" size={20} color="#ea580c" />
            )}
          </TouchableOpacity>

          {/* Divider with label */}
          <View className="flex-row items-center my-1">
            <View className="flex-1 h-[1px] bg-neutral-200" />
            <Text className="text-xs font-semibold text-neutral-400 mx-3 uppercase tracking-wider">
              Available Cities
            </Text>
            <View className="flex-1 h-[1px] bg-neutral-200" />
          </View>

          {/* Server Areas List */}
          {isAreasLoading ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator size="small" color="#ea580c" />
              <Text className="text-neutral-400 text-xs mt-2">
                Loading available cities...
              </Text>
            </View>
          ) : (
            areas.map((area) => {
              const isSelected =
                !isAutoDetect && selectedArea?.id === area.id;

              return (
                <TouchableOpacity
                  key={area.id}
                  activeOpacity={0.75}
                  onPress={() => handleSelectArea(area)}
                  className={`flex-row items-center p-3.5 rounded-2xl border ${
                    isSelected
                      ? "bg-orange-50/70 border-orange-300"
                      : "bg-white border-neutral-100"
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      isSelected ? "bg-orange-500" : "bg-neutral-100"
                    }`}
                  >
                    <Ionicons
                      name="location"
                      size={18}
                      color={isSelected ? "#ffffff" : "#64748b"}
                    />
                  </View>
                  <View className="ml-3.5 flex-1">
                    <Text
                      className={`font-bold text-base ${
                        isSelected ? "text-orange-900" : "text-neutral-900"
                      }`}
                    >
                      {area.name}
                    </Text>
                    <Text className="text-xs text-neutral-500 mt-0.5">
                      {area.city}
                      {area.state ? `, ${area.state}` : ""}
                    </Text>
                  </View>
                  {isSelected && (
                    <Feather name="check" size={20} color="#ea580c" />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </AppBottomSheet>
  );
}
