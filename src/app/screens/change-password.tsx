import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CurvedHeader from "../../components/CurvedHeader";
import PrimaryButton from "../../components/PrimaryButton";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    alert("Password updated successfully!");
    router.back();
  };

  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(newPassword);

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Curved Navy Header with Back Button */}
      <CurvedHeader title="Change Password" showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Container */}
          <View className="bg-white rounded-3xl p-5 mx-4 mt-6 shadow-sm border border-neutral-100">
            <Text className="text-neutral-900 font-bold text-lg mb-1">
              Update Password
            </Text>
            <Text className="text-neutral-500 text-base mb-5 leading-6">
              Ensure your account is using a secure and strong password.
            </Text>

            <View className="gap-y-5">
              {/* Current Password */}
              <View className="relative mt-2">
                <View className="flex-row items-center border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <Feather name="lock" size={18} color="#ea580c" />
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showCurrentPassword}
                    className="flex-1 ml-2.5 text-neutral-900 text-base font-medium py-0"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Feather
                      name={showCurrentPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Current Password
                  </Text>
                </View>
              </View>

              {/* New Password */}
              <View className="relative mt-2">
                <View className="flex-row items-center border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <Feather name="lock" size={18} color="#ea580c" />
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showNewPassword}
                    className="flex-1 ml-2.5 text-neutral-900 text-base font-medium py-0"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Feather
                      name={showNewPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    New Password
                  </Text>
                </View>
              </View>

              {/* Confirm New Password */}
              <View className="relative mt-2">
                <View className="flex-row items-center border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <Feather name="lock" size={18} color="#ea580c" />
                  <TextInput
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmNewPassword}
                    className="flex-1 ml-2.5 text-neutral-900 text-base font-medium py-0"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  >
                    <Feather
                      name={showConfirmNewPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Confirm New Password
                  </Text>
                </View>
              </View>
            </View>

            {/* Password Criteria Checklist */}
            <View className="mt-5 pt-4 border-t border-neutral-100 gap-y-2">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    hasMinLength
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={18}
                  color={hasMinLength ? "#16a34a" : "#9ca3af"}
                />
                <Text
                  className={`ml-2 text-base ${
                    hasMinLength
                      ? "text-emerald-700 font-medium"
                      : "text-neutral-500"
                  }`}
                >
                  Minimum 8 characters long
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name={
                    hasNumberOrSpecial
                      ? "checkmark-circle"
                      : "checkmark-circle-outline"
                  }
                  size={18}
                  color={hasNumberOrSpecial ? "#16a34a" : "#9ca3af"}
                />
                <Text
                  className={`ml-2 text-base ${
                    hasNumberOrSpecial
                      ? "text-emerald-700 font-medium"
                      : "text-neutral-500"
                  }`}
                >
                  Contains a number or special character
                </Text>
              </View>
            </View>
          </View>

          {/* Change Password CTA Button */}
          <View className="px-4 mt-8">
            <PrimaryButton
              title="Save Password"
              onPress={handleChangePassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
