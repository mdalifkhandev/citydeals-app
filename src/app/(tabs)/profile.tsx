import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import CurvedHeader from "../../components/CurvedHeader";
import LanguageBottomSheet from "../../components/LanguageBottomSheet";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { useAuthMutations } from "../../features/auth/hooks/useAuthMutations";
import { useShallow } from "zustand/react/shallow";

export default function ProfileScreen() {
  const { isLoggedIn, user } = useAuthStore(
    useShallow((state) => ({
      isLoggedIn: state.isAuthenticated,
      user: state.user,
    }))
  );
  const { logoutMutation } = useAuthMutations();
  const [pushNotification, setPushNotification] = useState(true);

  // Language state & bottom sheet visibility
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleGoToAuth = () => {
    router.push("/login" as any);
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Reusable Curved Header */}
      <CurvedHeader title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* User Card */}
        <View className="bg-white rounded-3xl p-5 mx-4 mt-4 shadow-sm border border-neutral-100">
          {/* User Info Row */}
          <View className="flex-row items-center mb-5">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              }}
              className="w-14 h-14 rounded-full bg-neutral-200 border-2 border-orange-100"
            />
            <View className="ml-3.5 flex-1">
              <Text className="text-neutral-500 text-base font-normal">
                {isLoggedIn ? "Welcome back," : "Browsing as"}
              </Text>
              <Text className="text-neutral-900 font-bold text-lg mt-0.5">
                {isLoggedIn ? user?.fullName || "Nasimul Noyon" : "Guest User"}
              </Text>
            </View>

            {!isLoggedIn && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoToAuth}
                className="bg-orange-50 border border-orange-200 px-3.5 py-2 rounded-2xl"
              >
                <Text className="text-orange-600 font-bold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Row */}
          <View className="flex-row items-center justify-between">
            {/* Stat 1: Save coupons */}
            <View className="flex-1 bg-neutral-50/70 border border-neutral-100/90 rounded-2xl p-4 mr-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-black text-[#0f3455]">
                  {isLoggedIn ? "12" : "0"}
                </Text>
                <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center">
                  <MaterialCommunityIcons
                    name="ticket-percent-outline"
                    size={22}
                    color="#ea580c"
                  />
                </View>
              </View>
              <Text className="text-neutral-600 text-base font-semibold mt-2">
                Save coupons
              </Text>
            </View>

            {/* Stat 2: Coupon redeemed */}
            <View className="flex-1 bg-neutral-50/70 border border-neutral-100/90 rounded-2xl p-4 ml-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-black text-[#0f3455]">
                  {isLoggedIn ? "06" : "0"}
                </Text>
                <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color="#ea580c"
                  />
                </View>
              </View>
              <Text className="text-neutral-600 text-base font-semibold mt-2">
                Coupon redeemed
              </Text>
            </View>
          </View>
        </View>

        {/* General Section */}
        <Text className="text-neutral-900 font-bold text-lg px-5 mt-6 mb-3">
          General
        </Text>

        {/* Menu Items with Uniform Fixed Height (h-[60px]) */}
        <View className="px-4 gap-y-3">
          {/* Account Info */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!isLoggedIn) {
                router.push("/login" as any);
              } else {
                router.push("/screens/account" as any);
              }
            }}
            className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <Feather name="user" size={20} color="#ea580c" />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Account Info
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Change password */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!isLoggedIn) {
                router.push("/login" as any);
              } else {
                router.push("/screens/change-password" as any);
              }
            }}
            className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <Feather name="lock" size={20} color="#ea580c" />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Change password
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Push notification */}
          <View className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1">
              <Feather name="bell" size={20} color="#ea580c" />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Push notification
              </Text>
            </View>
            <Switch
              value={pushNotification}
              onValueChange={setPushNotification}
              trackColor={{ false: "#e2e8f0", true: "#ea580c" }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Language */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLanguageSheetOpen(true)}
            className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <MaterialCommunityIcons
                name="translate"
                size={20}
                color="#ea580c"
              />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Language
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-neutral-500 text-base font-medium mr-2">
                {selectedLanguage}
              </Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/screens/help-support" as any)}
            className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <Feather name="shield" size={20} color="#ea580c" />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Help & Support
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Terms of Use */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/screens/terms-of-use" as any)}
            className="bg-white border border-neutral-100 rounded-2xl px-4 h-[60px] flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <Feather name="file-text" size={20} color="#ea580c" />
              <Text className="text-neutral-800 font-semibold text-lg ml-3.5">
                Terms of Use
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Log Out or Sign In CTA Button */}
        {isLoggedIn ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogout}
            className="bg-red-50 border border-red-100/80 rounded-2xl py-4 flex-row items-center justify-center mx-4 mt-5 active:bg-red-100"
          >
            <Feather name="log-out" size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold text-lg ml-2">Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGoToAuth}
            className="bg-orange-500 rounded-2xl py-4 flex-row items-center justify-center mx-4 mt-5 shadow-md shadow-orange-500/25"
          >
            <Feather name="log-in" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-lg ml-2">
              Sign In / Register
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modular Reusable LanguageBottomSheet */}
      <LanguageBottomSheet
        isPresented={isLanguageSheetOpen}
        onDismiss={() => setIsLanguageSheetOpen(false)}
        selectedLanguage={selectedLanguage}
        onSaveLanguage={(lang) => setSelectedLanguage(lang)}
      />
    </View>
  );
}
