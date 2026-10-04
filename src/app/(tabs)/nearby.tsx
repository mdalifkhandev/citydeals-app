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

export default function NearbyScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRadius, setSelectedRadius] = useState("< 2 km");
  const [nearbyDeals, setNearbyDeals] = useState<DealItem[]>(() => MOCK_DEALS);

  const radiusFilters = ["< 1 km", "< 2 km", "< 5 km", "All Nearby"];

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
    setNearbyDeals((prev) =>
      prev.map((d) =>
        d.id === toggledDeal.id ? { ...d, isFavorite: toggledDeal.isFavorite } : d
      )
    );
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
            <Text style={styles.headerTitle}>Nearby Deals</Text>
            <Text style={styles.headerSubtitle}>
              Discover offers within walking distance
            </Text>
          </View>

          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={15} color="#ea580c" />
            <Text style={styles.locationBadgeText}>Madrid, ES</Text>
          </View>
        </View>

        {/* Radius Filter Pills */}
        <View style={styles.radiusRow}>
          {radiusFilters.map((radius) => {
            const isSelected = selectedRadius === radius;
            return (
              <TouchableOpacity
                key={radius}
                activeOpacity={0.8}
                onPress={() => setSelectedRadius(radius)}
                style={[
                  styles.radiusChip,
                  isSelected ? styles.radiusChipActive : styles.radiusChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.radiusText,
                    isSelected ? styles.radiusTextActive : styles.radiusTextInactive,
                  ]}
                >
                  {radius}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.feedContainer}>
          {nearbyDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onPressOpen={handleOpenDeal}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </View>
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
    paddingBottom: 18,
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
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  locationBadgeText: {
    color: "#ea580c",
    fontSize: 13,
    fontWeight: "700",
  },
  radiusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    zIndex: 10,
  },
  radiusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  radiusChipActive: {
    backgroundColor: "#ea580c",
  },
  radiusChipInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  radiusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  radiusTextActive: {
    color: "#ffffff",
  },
  radiusTextInactive: {
    color: "#e2e8f0",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 110,
  },
  feedContainer: {
    paddingHorizontal: 16,
  },
});
