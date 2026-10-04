import { Feather, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { toast } from "sonner-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_DEALS } from "../../config/constants";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import {
  shareCouponWithSystemSheet,
  shareToSocialPlatform,
} from "../../utils/shareUtils";

export default function CouponDetailsScreen() {
  const insets = useSafeAreaInsets();
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthPromptVisible, setIsAuthPromptVisible] = useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);

  const params = useLocalSearchParams<{
    id: string;
    dealHeading?: string;
    dealDescription?: string;
    category?: string;
  }>();

  const dealId = params.id || "1";
  const matchedDeal = MOCK_DEALS.find((d) => d.id === dealId);

  const dealHeading = params.dealHeading || matchedDeal?.dealHeading || "Exclusive Coupon Deal";
  const dealDescription = params.dealDescription || matchedDeal?.dealDescription || "Show this coupon to get instant savings at checkout.";
  const dealImage = matchedDeal?.image || require("../../../assets/images/placeholder-deal.jpg");
  const dealUrl = `https://citydeals.ai/deals/${dealId}`;
  const couponCode = `CITY-${dealId.padStart(4, "0")}-SAVE`;
  const shareMessage = `Check out this special offer on CityDeals! 🎉\n\n${dealHeading}\n${dealDescription}\n\nGet the coupon: ${dealUrl}`;

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  // Redeem button handler (checks if guest vs authenticated)
  const handleRedeemCoupon = () => {
    if (!isLoggedIn) {
      setIsAuthPromptVisible(true);
    } else {
      setIsRedeemModalVisible(true);
    }
  };

  // Copy coupon code
  const handleCopyCouponCode = async () => {
    await Clipboard.setStringAsync(couponCode);
    showToast("Coupon code copied to clipboard!");
  };

  // Download App Handler
  const handleDownloadApp = () => {
    Linking.openURL("https://citydeals.ai/download").catch(() => {
      showToast("Opening app store download page...");
    });
  };

  // General share handler: Shares image file + app link via system share sheet
  const handleShareDeal = async () => {
    await shareCouponWithSystemSheet(
      {
        dealHeading,
        dealDescription,
        dealUrl,
        imageSource: dealImage,
      },
      showToast
    );
  };

  // Open store / deal website
  const handleOpenWebsite = () => {
    Linking.openURL("https://mariaspizzeria.com").catch(() => {
      Linking.openURL(dealUrl).catch(() => {});
    });
  };

  // Share via Email
  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Exclusive Deal: ${dealHeading}`);
    const body = encodeURIComponent(shareMessage);
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(() => {
      showToast("Unable to open email app.");
    });
  };

  // Share to Facebook (with image file + app link)
  const handleShareFacebook = async () => {
    await shareToSocialPlatform(
      "facebook",
      {
        dealHeading,
        dealDescription,
        dealUrl,
        imageSource: dealImage,
      },
      showToast
    );
  };

  // Share to Instagram (with image file + app link)
  const handleShareInstagram = async () => {
    await shareToSocialPlatform(
      "instagram",
      {
        dealHeading,
        dealDescription,
        dealUrl,
        imageSource: dealImage,
      },
      showToast
    );
  };

  // Share to TikTok (with image file + app link)
  const handleShareTikTok = async () => {
    await shareToSocialPlatform(
      "tiktok",
      {
        dealHeading,
        dealDescription,
        dealUrl,
        imageSource: dealImage,
      },
      showToast
    );
  };

  // Share via SMS / Message (with image file + app link)
  const handleShareSMS = async () => {
    await shareToSocialPlatform(
      "sms",
      {
        dealHeading,
        dealDescription,
        dealUrl,
        imageSource: dealImage,
      },
      showToast
    );
  };

  // Header height = status bar + 12 top padding + 44 button + 16 bottom padding
  const headerHeight = insets.top + 12 + 44 + 16;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {/* Floating Header */}
      <View
        className="absolute top-0 left-0 right-0 z-10 bg-[#0f3b5e] rounded-b-[28px] flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 12, height: headerHeight }}
        pointerEvents="box-none"
      >
        {/* Background texture clipped separately to the rounded shape */}
        <View className="absolute inset-0 rounded-b-[28px] overflow-hidden">
          <Image
            source={require("../../../assets/images/line-background.png")}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)" as any);
            }
          }}
          className="w-11 h-11 rounded-2xl bg-white items-center justify-center z-10 shadow-sm"
        >
          <Feather name="arrow-left" size={20} color="#1e293b" />
        </TouchableOpacity>

        <Text className="text-white text-lg font-bold z-10">Coupon Details</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleShareDeal}
          className="w-11 h-11 rounded-2xl bg-white items-center justify-center z-10 shadow-sm"
        >
          <Ionicons name="share-social-outline" size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Smart App Download Banner for Shared Link Visitors */}
        {!isLoggedIn && (
          <View className="mx-4 mt-4 bg-orange-50/90 border border-orange-200 rounded-3xl p-4 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-11 h-11 rounded-2xl bg-orange-500 items-center justify-center mr-3 shadow-sm">
                <Ionicons name="sparkles" size={20} color="#ffffff" />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-900 font-bold text-base">
                  Get the CityDeals App
                </Text>
                <Text className="text-neutral-600 text-sm mt-0.5">
                  Download free to redeem this coupon in-store.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDownloadApp}
              className="bg-neutral-900 px-3.5 py-2.5 rounded-xl active:bg-neutral-800 shadow-sm"
            >
              <Text className="text-white font-bold text-sm">Get App</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Poster card with padding and border */}
        <View className="px-4 pt-4">
          <View className="rounded-3xl overflow-hidden border border-neutral-200">
            <Image
              source={typeof dealImage === "string" ? { uri: dealImage } : dealImage}
              className="w-full h-[420px]"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Info Section */}
        <View className="px-5 pt-5 bg-white">
          {/* Store logo + deal title row */}
          <View className="flex-row items-center mb-5">
            <View className="w-13 h-13 rounded-full bg-amber-100 border-2 border-amber-400 items-center justify-center mr-3.5">
              <Text className="text-2xl font-extrabold text-amber-700">
                {dealHeading.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-neutral-900">
                {dealHeading}
              </Text>
              <Text className="text-base text-neutral-500 mt-0.5">
                {dealDescription}
              </Text>
            </View>
          </View>

          {/* Primary Action: Redeem Coupon */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRedeemCoupon}
            className="flex-row items-center justify-center gap-2.5 rounded-2xl py-4 mb-3 bg-orange-500 shadow-md shadow-orange-500/25"
          >
            <Ionicons name="ticket" size={22} color="#ffffff" />
            <Text className="text-white text-lg font-bold">Redeem Coupon</Text>
          </TouchableOpacity>

          {/* Secondary Action: Save coupon */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setIsSaved(!isSaved);
              showToast(isSaved ? "Coupon removed from saved." : "Coupon saved successfully!");
            }}
            className={`flex-row items-center justify-center gap-2.5 rounded-2xl py-4 mb-6 border ${
              isSaved
                ? "bg-orange-50 border-orange-200"
                : "bg-[#111827] border-neutral-900"
            } shadow-sm`}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={20}
              color={isSaved ? "#ea580c" : "#ffffff"}
            />
            <Text
              className={`text-lg font-bold ${
                isSaved ? "text-orange-600" : "text-white"
              }`}
            >
              {isSaved ? "Coupon Saved" : "Save coupon"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="h-px bg-neutral-100 mb-5" />

          {/* Store location row */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-neutral-900 mb-1">
                Maria's Pizzeria
              </Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="location-outline" size={15} color="#6b7280" />
                <Text className="text-base text-neutral-500 flex-shrink">
                  2347 Arthur Ave, Bronx, NY 10458
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center gap-1.5 rounded-2xl px-3.5 py-3 bg-[#111827] shadow-sm"
            >
              <Ionicons name="location-outline" size={16} color="#ffffff" />
              <Text className="text-white text-base font-semibold">
                Where to use
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="h-px bg-neutral-100 mb-5" />

          {/* Website + Email Row */}
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenWebsite}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <Ionicons name="globe-outline" size={18} color="#ffffff" />
              <Text className="text-white text-base font-semibold">Website</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareEmail}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <Ionicons name="mail-outline" size={18} color="#ffffff" />
              <Text className="text-white text-base font-semibold">Email</Text>
            </TouchableOpacity>
          </View>

          {/* Social & Sharing Links: Facebook, Instagram, TikTok, Message/SMS */}
          <View className="flex-row gap-2">
            {/* Facebook */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareFacebook}
              className="flex-1 items-center justify-center rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <FontAwesome name="facebook" size={22} color="#ffffff" />
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareInstagram}
              className="flex-1 items-center justify-center rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <FontAwesome name="instagram" size={22} color="#ffffff" />
            </TouchableOpacity>

            {/* TikTok */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareTikTok}
              className="flex-1 items-center justify-center rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <FontAwesome6 name="tiktok" size={20} color="#ffffff" />
            </TouchableOpacity>

            {/* Message / SMS */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleShareSMS}
              className="flex-1 items-center justify-center rounded-2xl py-4 bg-[#111827] shadow-sm"
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Guest Authentication Required Modal */}
      <Modal
        visible={isAuthPromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAuthPromptVisible(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-2xl">
            <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center mb-4 border border-orange-200">
              <Ionicons name="lock-closed" size={28} color="#ea580c" />
            </View>

            <Text className="text-xl font-extrabold text-neutral-900 text-center tracking-tight">
              Sign In to Redeem
            </Text>
            <Text className="text-neutral-500 text-base text-center mt-2 leading-6">
              You are currently browsing as a guest. Please sign in or create an account to redeem this discount coupon.
            </Text>

            <View className="w-full gap-y-2.5 mt-6">
              {/* Log In Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setIsAuthPromptVisible(false);
                  router.push("/(auth)/login" as any);
                }}
                className="w-full bg-orange-500 rounded-2xl py-3.5 items-center justify-center shadow-md shadow-orange-500/25"
              >
                <Text className="text-white font-bold text-lg">Log In</Text>
              </TouchableOpacity>

              {/* Create Account Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setIsAuthPromptVisible(false);
                  router.push("/(auth)/register" as any);
                }}
                className="w-full bg-neutral-100 rounded-2xl py-3.5 items-center justify-center border border-neutral-200"
              >
                <Text className="text-neutral-800 font-bold text-base">
                  Create Free Account
                </Text>
              </TouchableOpacity>

              {/* Download App CTA for Web Visitors */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setIsAuthPromptVisible(false);
                  handleDownloadApp();
                }}
                className="w-full bg-orange-50 border border-orange-200 rounded-2xl py-3 items-center justify-center"
              >
                <Text className="text-orange-600 font-bold text-base">
                  📲 Download CityDeals App
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsAuthPromptVisible(false)}
                className="w-full py-2 items-center justify-center mt-1"
              >
                <Text className="text-neutral-500 font-semibold text-base">
                  Keep Browsing as Guest
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Authenticated Coupon Redemption Modal */}
      <Modal
        visible={isRedeemModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRedeemModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[32px] px-6 pt-6 pb-10 items-center">
            {/* Grabber indicator */}
            <View className="w-12 h-1.5 rounded-full bg-neutral-200 mb-5" />

            <View className="w-14 h-14 rounded-full bg-emerald-100 items-center justify-center mb-3">
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            </View>

            <Text className="text-2xl font-extrabold text-neutral-900 text-center tracking-tight">
              Ready to Redeem!
            </Text>
            <Text className="text-neutral-500 text-base text-center mt-1">
              Scan this QR code or show the coupon code to the cashier at checkout.
            </Text>

            {/* QR Code Container */}
            <View className="w-full bg-neutral-50 rounded-3xl p-5 items-center border border-neutral-200 mt-5">
              <View className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm items-center justify-center mb-4">
                <Ionicons name="qr-code" size={160} color="#0f172a" />
              </View>

              {/* Coupon Code Pill */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopyCouponCode}
                className="flex-row items-center bg-white border border-orange-200 px-5 py-2.5 rounded-full shadow-sm"
              >
                <Text className="text-orange-600 font-extrabold text-lg tracking-wider mr-2">
                  {couponCode}
                </Text>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color="#ea580c"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-neutral-400 text-sm mt-3">
              Valid until September 30, 2026 • Single Use Only
            </Text>

            {/* Done CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setIsRedeemModalVisible(false)}
              className="w-full bg-neutral-900 rounded-2xl py-4 items-center justify-center mt-6 shadow-sm"
            >
              <Text className="text-white font-bold text-lg">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
