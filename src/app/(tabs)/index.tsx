import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DealCard, { DealItem } from "../../components/DealCard";
import EmptyDealsState from "../../components/EmptyDealsState";
import { CATEGORIES, MOCK_DEALS } from "../../config/constants";
import { AnimatedFlashList as OriginalAnimatedFlashList } from "@shopify/flash-list";

// Cast to any to bypass AnimatedProps typing bug with FlashListProps
const AnimatedFlashList = OriginalAnimatedFlashList as any;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;

  // Search bar collapse animation constants
  const HEADER_SCROLL_DISTANCE = 70;

  const searchBarHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [52, 0],
    extrapolate: "clamp",
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.65],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -18],
    extrapolate: "clamp",
  });

  const searchBarMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [16, 0],
    extrapolate: "clamp",
  });

  const filteredDeals = useMemo(() => {
    let list = MOCK_DEALS;

    if (selectedCategory !== "All") {
      list = list.filter((d) => d.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (deal) =>
          deal.dealHeading.toLowerCase().includes(q) ||
          deal.dealDescription.toLowerCase().includes(q) ||
          (deal.category && deal.category.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const handleOpenDeal = (deal: DealItem) => {
    router.push({
      pathname: "/screens/coupon-details" as any,
      params: {
        id: deal.id,
        dealHeading: deal.dealHeading,
        dealDescription: deal.dealDescription,
        category: deal.category ?? "",
      },
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Deep Navy Top Header (Sticky Profile Bar + Collapsible Search Bar) */}
      <View
        className="bg-[#0f3b5e] px-5 pb-4 rounded-b-[28px] overflow-hidden z-20"
        style={{ paddingTop: Math.max(insets.top, 20) + 6 }}
      >
        <Image
          source={require("../../../assets/images/line-background.png")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        {/* Sticky Profile / Location / Notification Row */}
        <View className="flex-row items-center justify-between z-10">
          {/* User Location */}
          <View className="flex-row items-center flex-1 mr-3">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              }}
              style={{ width: 44, height: 44, borderRadius: 22 }}
              className="w-11 h-11 rounded-full bg-neutral-200 border border-orange-200"
            />
            <View className="ml-3 flex-1">
              <Text className="text-slate-300 text-base font-normal">
                My Location
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Ionicons name="location-sharp" size={16} color="#ffffff" />
                <Text
                  numberOfLines={1}
                  className="text-white text-base font-bold ml-1 flex-1"
                >
                  4/A 28013 Madrid, Spain
                </Text>
              </View>
            </View>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-11 h-11 rounded-2xl bg-white items-center justify-center shadow-sm"
          >
            <Feather name="bell" size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Collapsible Search Bar */}
        <Animated.View
          style={{
            height: searchBarHeight,
            opacity: searchBarOpacity,
            marginTop: searchBarMarginTop,
            transform: [{ translateY: searchBarTranslateY }],
            overflow: "hidden",
          }}
        >
          <View className="bg-white rounded-2xl px-4 h-[52px] flex-row items-center z-10 shadow-sm border border-neutral-100/80">
            <Feather name="search" size={20} color="#ea580c" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search deals, stores, food..."
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              className="flex-1 ml-2.5 text-neutral-900 font-medium text-base py-2.5"
            />
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSearchQuery("")}
                className="w-7 h-7 rounded-full bg-neutral-100 items-center justify-center ml-1"
              >
                <Feather name="x" size={16} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Scrollable Content using FlashList for 60fps */}
      <AnimatedFlashList
        data={filteredDeals}
        estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 110 }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-neutral-900 font-bold text-lg px-5 mb-3">
              Browse Categories
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full border ${
                      isSelected
                        ? "bg-orange-500 border-orange-500"
                        : "bg-slate-100 border-slate-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-base ${
                        isSelected ? "text-white" : "text-neutral-700"
                      }`}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }: { item: DealItem }) => (
          <View className="px-4">
            <DealCard
              deal={item}
              onPressOpen={handleOpenDeal}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="px-4">
            <EmptyDealsState
              query={searchQuery}
              onClearFilters={handleClearFilters}
            />
          </View>
        }
      />
    </View>
  );
}
