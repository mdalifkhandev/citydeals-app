import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DealCard, { DealItem } from "../../components/DealCard";
import { MOCK_DEALS } from "../../config/constants";
import PrimaryButton from "../../components/PrimaryButton";

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const [savedDeals, setSavedDeals] = useState<DealItem[]>(() =>
    MOCK_DEALS.filter((deal) => deal.isFavorite || deal.id === "1" || deal.id === "2")
  );

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

  const handleToggleFavorite = (toggledDeal: DealItem) => {
    if (!toggledDeal.isFavorite) {
      setSavedDeals((prev) => prev.filter((d) => d.id !== toggledDeal.id));
    }
  };

  const handleExploreDeals = () => {
    router.push("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Deep Navy Top Header with Starry Backdrop */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Image
          source={require("../../../assets/images/line-background.png")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Saved Coupons</Text>
            <Text style={styles.headerSubtitle}>
              {savedDeals.length} {savedDeals.length === 1 ? "deal" : "deals"} saved for later
            </Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="heart" size={16} color="#ea580c" />
            <Text style={styles.badgeText}>{savedDeals.length} Saved</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {savedDeals.length > 0 ? (
          <View style={styles.feedContainer}>
            {savedDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={{ ...deal, isFavorite: true }}
                onPressOpen={handleOpenDeal}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/images/coupons-3.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Saved Deals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any deal from the Home tab to save and access them anytime here.
            </Text>
            <PrimaryButton
              title="Explore Deals"
              onPress={handleExploreDeals}
              className="mt-6 w-full max-w-xs"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#0f3b5e",
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    marginTop: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeText: {
    color: "#ea580c",
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 110,
  },
  feedContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 280,
  },
});
