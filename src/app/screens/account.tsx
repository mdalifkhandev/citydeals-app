import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import CurvedHeader from "../../components/CurvedHeader";
import PrimaryButton from "../../components/PrimaryButton";

export default function AccountSettingScreen() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSaveChange = () => {
    alert("Account settings saved successfully!");
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Reusable Curved Header with Back Button */}
      <CurvedHeader title="Account" showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View className="items-center mt-6">
            <View className="relative">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
                }}
                className="w-24 h-24 rounded-full bg-neutral-200 border-2 border-orange-100"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-neutral-200 items-center justify-center shadow-sm"
              >
                <Feather name="camera" size={16} color="#1e293b" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.7} className="mt-2.5">
              <Text className="text-neutral-500 text-base font-normal">
                Tap to change photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information Card */}
          <View className="bg-white rounded-3xl p-5 mx-4 mt-6 shadow-sm border border-neutral-100">
            <Text className="text-neutral-900 font-bold text-lg mb-4">
              Personal Information
            </Text>

            <View className="gap-y-5">
              {/* Full Name Field */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full Name"
                    placeholderTextColor="#9ca3af"
                    className="text-neutral-900 text-base font-medium py-0"
                  />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Full Name
                  </Text>
                </View>
              </View>

              {/* Phone Number Field */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Phone Number"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    className="text-neutral-900 text-base font-medium py-0"
                  />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Phone Number
                  </Text>
                </View>
              </View>

              {/* Email Field */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-neutral-900 text-base font-medium py-0"
                  />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Email
                  </Text>
                </View>
              </View>

              {/* Date of Birth Field */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <TextInput
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="Date of Birth"
                    placeholderTextColor="#9ca3af"
                    className="text-neutral-900 text-base font-medium py-0"
                  />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Date of Birth
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Save Change CTA Button */}
          <View className="px-4 mt-8">
            <PrimaryButton
              title="Save Change"
              onPress={handleSaveChange}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
