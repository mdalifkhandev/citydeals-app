import React from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import CurvedHeader from "../../components/CurvedHeader";

export default function TermsOfUseScreen() {
  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Curved Navy Top Header */}
      <CurvedHeader title="Terms of Use" showBackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="bg-white rounded-3xl p-5 mx-4 mt-6 shadow-sm border border-neutral-100">
          {/* Last Updated Badge */}
          <View className="self-start bg-orange-50 border border-orange-200/60 px-3.5 py-1.5 rounded-full mb-4">
            <Text className="text-orange-600 font-bold text-base">
              Last updated: August 2026
            </Text>
          </View>

          <Text className="text-neutral-500 text-base leading-6 mb-6">
            Please read these terms and conditions carefully before using the CityDeals application. By accessing or using the platform, you agree to be bound by these terms.
          </Text>

          {/* Section 1 */}
          <View className="mb-6">
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              1. Acceptance of Terms
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-6">
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              2. User Accounts & Registration
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-6">
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              3. Coupon Redemption & Store Offers
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-6">
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              4. Merchant Terms & Availability
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-6">
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              5. Limitation of Liability
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna.
            </Text>
          </View>

          {/* Section 6 */}
          <View>
            <Text className="text-neutral-900 font-bold text-lg mb-2">
              6. Modifications & Contact
            </Text>
            <Text className="text-neutral-600 text-base leading-6">
              CityDeals reserves the right to modify or replace these terms at any time. If you have questions regarding these terms, please contact us at support@citydeals.ai.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
