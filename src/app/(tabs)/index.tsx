import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Pressable,
  RefreshControl,
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
import AreaSelectorModal from "../../components/AreaSelectorModal";
import DealCardSkeleton from "../../components/DealCardSkeleton";
import CategoryPillSkeleton from "../../components/CategoryPillSkeleton";
import { MOCK_DEALS } from "../../config/constants";
import { AnimatedFlashList as OriginalAnimatedFlashList } from "@shopify/flash-list";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useCurrentUser } from "../../features/auth/hooks/useCurrentUser";
import { useUserLocation } from "../../features/location/hooks/useUserLocation";
import { useLocationStore } from "../../features/location/store/useLocationStore";
import { useCategories } from "../../features/categories";
import { useCoupons, useToggleSaveCoupon } from "../../features/coupons";
import { useDebounce } from "../../utils/useDebounce";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner-native";

// Cast to any to bypass AnimatedProps typing bug with FlashListProps
const AnimatedFlashList = OriginalAnimatedFlashList as any;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery.trim(), 350);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAreaModalVisible, setIsAreaModalVisible] = useState(false);

  const { selectedArea, matchedArea, isAutoDetect, setSelectedArea } =
    useLocationStore(
      useShallow((state) => ({
        selectedArea: state.selectedArea,
        matchedArea: state.matchedArea,
        isAutoDetect: state.isAutoDetect,
        setSelectedArea: state.setSelectedArea,
      }))
    );

  const { user, isLoggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoggedIn: state.isAuthenticated,
    }))
  );

  // Sync fresh user profile & area details from backend
  const { refetch: refetchUser } = useCurrentUser();

  // Request & get live device location on app launch + reverse geocode
  const { locationName: gpsLocationName, refreshLocation } = useUserLocation();

  const avatarUri = useMemo(() => {
    if (isLoggedIn && user?.profilePictureUrl) {
      return user.profilePictureUrl;
    }
    if (isLoggedIn && user?.fullName) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=ea580c&color=ffffff&bold=true`;
    }
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
  }, [isLoggedIn, user?.profilePictureUrl, user?.fullName]);

  const locationDisplay = useMemo(() => {
    // 1. If user explicitly picked an area (or "All Areas") from the modal:
    if (!isAutoDetect && selectedArea) {
      if (selectedArea.slug === "all") {
        return "All Areas";
      }
      if (selectedArea.city && selectedArea.name !== selectedArea.city) {
        return `${selectedArea.name}, ${selectedArea.city}`;
      }
      return selectedArea.name;
    }

    // 2. If in GPS auto-detect mode, show the live device GPS location name:
    if (
      gpsLocationName &&
      gpsLocationName.trim().length > 0 &&
      gpsLocationName !== "Current Location"
    ) {
      return gpsLocationName;
    }

    // 3. Fallback to matched backend area if available:
    if (matchedArea?.name) {
      return matchedArea.name;
    }

    // 4. Fallback to user saved profile area:
    if (user?.area) {
      if (user.area.name && user.area.city) {
        return `${user.area.name}, ${user.area.city}`;
      }
      return user.area.name || user.area.city || user.area.state || "Current Location";
    }

    return gpsLocationName || "Current Location";
  }, [isAutoDetect, selectedArea, gpsLocationName, matchedArea, user]);

  const handleProfilePress = () => {
    if (isLoggedIn) {
      router.push("/(tabs)/profile" as any);
    } else {
      router.push("/(auth)/login" as any);
    }
  };

  const handleLocationPress = () => {
    setIsAreaModalVisible(true);
  };

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

  // Fetch live categories from backend
  const {
    data: serverCategories = [],
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useCategories();

  const categoryList = useMemo(() => {
    const allItem = { id: "all", name: "All", slug: "all" };
    if (!serverCategories || serverCategories.length === 0) {
      return [
        allItem,
        { id: "restaurants", name: "Restaurants", slug: "restaurants" },
        { id: "shopping", name: "Shopping", slug: "shopping" },
        { id: "groceries", name: "Groceries", slug: "groceries" },
        { id: "electronics", name: "Electronics", slug: "electronics" },
        { id: "beauty", name: "Beauty", slug: "beauty" },
        { id: "travel", name: "Travel", slug: "travel" },
        { id: "fitness", name: "Fitness", slug: "fitness" },
      ];
    }
    return [allItem, ...serverCategories];
  }, [serverCategories]);

  // Fetch live coupons scoped to category from backend
  // Fetch live coupons scoped to category & debounced search from backend
  const activeCategorySlug =
    selectedCategorySlug === "all" ? undefined : selectedCategorySlug;

  const activeSearch =
    debouncedSearch.length > 0 ? debouncedSearch : undefined;

  const activeAreaSlug = useMemo(() => {
    if (!isAutoDetect) {
      return !selectedArea || selectedArea.slug === "all" ? undefined : selectedArea.slug;
    }
    return matchedArea?.slug || undefined;
  }, [isAutoDetect, selectedArea, matchedArea]);

  const {
    data: serverCoupons = [],
    isLoading: isCouponsLoading,
    isRefetching: isCouponsRefetching,
    refetch: refetchCoupons,
  } = useCoupons({
    categorySlug: activeCategorySlug,
    search: activeSearch,
    areaSlug: activeAreaSlug,
  });

  const isSearching =
    searchQuery.trim() !== debouncedSearch ||
    (isCouponsLoading && debouncedSearch.length > 0);

  const toggleSaveMutation = useToggleSaveCoupon();

  const handleToggleFavorite = (deal: DealItem) => {
    if (!isLoggedIn) {
      toast.info("Sign In Required", {
        description: "Please sign in to save your favorite deals.",
      });
      return;
    }
    toggleSaveMutation.mutate({ couponId: deal.id, isSaved: !!deal.isFavorite });
  };

  const handleNotificationPress = () => {
    if (!isLoggedIn) {
      toast.info("Notifications", {
        description: "Sign in to receive instant deal alerts in your area.",
      });
      return;
    }
    toast.info("Notifications Up to Date", {
      description: `You are tuned in for the latest deals in ${locationDisplay}.`,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchCoupons(),
      refetchCategories(),
      isLoggedIn ? refetchUser() : Promise.resolve(),
      isAutoDetect ? refreshLocation() : Promise.resolve(),
    ]);
    setIsRefreshing(false);
  };

  const filteredDeals = useMemo(() => {
    let list: DealItem[] = [];

    if (serverCoupons && serverCoupons.length > 0) {
      list = serverCoupons.map((c) => ({
        id: c.id,
        category: c.category?.name || "General",
        dealHeading: c.title,
        dealDescription: c.description,
        image: c.imageUrl || require("../../../assets/images/placeholder-deal.jpg"),
        isFavorite: c.isSaved ?? false,
      }));
    } else if (
      !isCouponsLoading &&
      selectedCategorySlug === "all" &&
      debouncedSearch.length === 0
    ) {
      list = MOCK_DEALS;
    }

    return list;
  }, [serverCoupons, isCouponsLoading, selectedCategorySlug, debouncedSearch]);

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
    setSelectedCategorySlug("all");
    setSelectedArea({
      id: "all",
      name: "All Areas",
      slug: "all",
      city: "All Cities",
    });
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
          {/* User Profile & Location */}
          <View className="flex-row items-center flex-1 mr-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleProfilePress}
              className="relative"
            >
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 44, height: 44, borderRadius: 22 }}
                className="w-11 h-11 rounded-full bg-neutral-200 border border-orange-200"
                contentFit="cover"
              />
              {isLoggedIn && (
                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0f3b5e]" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleLocationPress}
              className="ml-3 flex-1"
            >
              <Text className="text-slate-300 text-xs font-normal" numberOfLines={1}>
                {isLoggedIn && user?.fullName
                  ? `Hi, ${user.fullName.trim().split(" ")[0]}`
                  : isAutoDetect
                  ? "Nearby Area (GPS)"
                  : "Active Area"}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Ionicons name="location-sharp" size={16} color="#ea580c" />
                <Text
                  numberOfLines={1}
                  className="text-white text-base font-bold ml-1 mr-1 flex-1"
                >
                  {locationDisplay}
                </Text>
                <Feather name="chevron-down" size={14} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNotificationPress}
            className="w-11 h-11 rounded-2xl bg-white items-center justify-center border border-neutral-100 relative"
          >
            <Feather name="bell" size={20} color="#1e293b" />
            {isLoggedIn && (
              <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-orange-500 border border-white" />
            )}
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
          <View className="bg-white rounded-2xl px-4 h-[52px] flex-row items-center z-10 border border-neutral-100/80">
            <Feather name="search" size={20} color="#ea580c" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search deals, stores, food..."
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
              className="flex-1 ml-2.5 text-neutral-900 font-medium text-base py-2.5"
            />
            {isSearching ? (
              <ActivityIndicator size="small" color="#ea580c" className="ml-1" />
            ) : searchQuery.trim().length > 0 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSearchQuery("")}
                className="w-7 h-7 rounded-full bg-neutral-100 items-center justify-center ml-1"
              >
                <Feather name="x" size={16} color="#64748b" />
              </TouchableOpacity>
            ) : null}
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || isCouponsRefetching}
            onRefresh={handleRefresh}
            colors={["#ea580c"]}
            tintColor="#ea580c"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 110 }}
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-center justify-between px-5 mb-3">
              <Text className="text-neutral-900 font-bold text-lg">
                Browse Categories
              </Text>
              {isCategoriesLoading && (
                <ActivityIndicator size="small" color="#ea580c" />
              )}
            </View>

            {isCategoriesLoading && categoryList.length <= 1 ? (
              <CategoryPillSkeleton count={5} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              >
                {categoryList.map((cat) => {
                  const isSelected = selectedCategorySlug === cat.slug;
                  return (
                    <Pressable
                      key={cat.id || cat.slug}
                      onPress={() => setSelectedCategorySlug(cat.slug)}
                      className={`px-5 py-2.5 rounded-full border flex-row items-center ${
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
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {isCouponsLoading && (
              <View className="mt-4 px-4">
                <DealCardSkeleton count={2} />
              </View>
            )}
          </View>
        }
        renderItem={({ item }: { item: DealItem }) => (
          <View className="px-4">
            <DealCard
              deal={item}
              onPressOpen={handleOpenDeal}
              onToggleFavorite={handleToggleFavorite}
            />
          </View>
        )}
        ListEmptyComponent={
          !isCouponsLoading ? (
            <View className="px-4">
              <EmptyDealsState
                query={debouncedSearch.length > 0 ? debouncedSearch : undefined}
                areaName={selectedArea?.slug !== "all" ? selectedArea?.name : undefined}
                onClearFilters={handleClearFilters}
                onSwitchArea={() => setIsAreaModalVisible(true)}
              />
            </View>
          ) : null
        }
      />

      <AreaSelectorModal
        isVisible={isAreaModalVisible}
        onClose={() => setIsAreaModalVisible(false)}
      />
    </View>
  );
}
