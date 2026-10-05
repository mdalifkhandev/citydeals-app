import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { useQueryClient } from "@tanstack/react-query";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CurvedHeader from "../../components/CurvedHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { authApi } from "../../features/auth/services/authApi";

export default function AccountSettingScreen() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const avatarUri =
    user?.profilePictureUrl ||
    (user?.fullName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.fullName
        )}&background=ea580c&color=ffffff&bold=true`
      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80");

  const dateValue = useMemo(() => {
    if (dateOfBirth && dateOfBirth.includes("-")) {
      const parts = dateOfBirth.split("-").map(Number);
      if (
        parts.length >= 3 &&
        !isNaN(parts[0]) &&
        !isNaN(parts[1]) &&
        !isNaN(parts[2])
      ) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
      }
    }
    return new Date(2000, 0, 1);
  }, [dateOfBirth]);

  const handlePhotoTap = () => {
    toast.info("Profile Picture", {
      description: "Avatar is generated automatically from your full name.",
    });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setIsDatePickerOpen(false);
    }
    if (event.type === "set" && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setDateOfBirth(formatted);
    }
  };

  const handleSaveChange = async () => {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    try {
      setIsSaving(true);

      let formattedDob: string | undefined = undefined;
      if (dateOfBirth.trim().length > 0) {
        const parsed = new Date(dateOfBirth.trim());
        if (isNaN(parsed.getTime())) {
          toast.error("Please enter a valid date of birth (YYYY-MM-DD)");
          setIsSaving(false);
          return;
        }
        formattedDob = parsed.toISOString();
      }

      const updatedUser = await authApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        dateOfBirth: formattedDob,
      });

      if (updatedUser) {
        useAuthStore.getState().updateUser(updatedUser);
      }

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Account settings updated successfully!");
      router.back();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSaving(false);
    }
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
                source={{ uri: avatarUri }}
                className="w-24 h-24 rounded-full bg-neutral-200 border-2 border-orange-100"
                contentFit="cover"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePhotoTap}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-neutral-200 items-center justify-center shadow-xs"
              >
                <Feather name="camera" size={16} color="#1e293b" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePhotoTap}
              className="mt-2.5"
            >
              <Text className="text-neutral-500 text-sm font-normal">
                Tap to change photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information Card */}
          <View className="bg-white rounded-3xl p-5 mx-4 mt-6 border border-neutral-100 shadow-sm">
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
                  <Text className="text-neutral-600 text-xs font-semibold">
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
                  <Text className="text-neutral-600 text-xs font-semibold">
                    Phone Number
                  </Text>
                </View>
              </View>

              {/* Email Field (Read Only) */}
              <View className="relative mt-2">
                <View className="border border-neutral-200 rounded-2xl px-4 py-3.5 bg-neutral-100/70 flex-row items-center justify-between">
                  <TextInput
                    value={email}
                    editable={false}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    className="text-neutral-500 text-base font-medium py-0 flex-1"
                  />
                  <Feather name="lock" size={15} color="#9ca3af" />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-500 text-xs font-semibold">
                    Email (Read Only)
                  </Text>
                </View>
              </View>

              {/* Date of Birth Field */}
              <View className="relative mt-2">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsDatePickerOpen(true)}
                  className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white flex-row items-center justify-between"
                >
                  <Text
                    className={`text-base font-medium ${
                      dateOfBirth ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {dateOfBirth || "Select Date of Birth"}
                  </Text>
                  <Feather name="calendar" size={18} color="#ea580c" />
                </TouchableOpacity>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-xs font-semibold">
                    Date of Birth
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Save Change CTA Button */}
          <View className="px-4 mt-8">
            <PrimaryButton
              title="Save Changes"
              onPress={handleSaveChange}
              loading={isSaving}
              disabled={isSaving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Android Native DateTimePicker Dialog */}
      {isDatePickerOpen && Platform.OS === "android" && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* iOS DateTimePicker Modal */}
      {isDatePickerOpen && Platform.OS === "ios" && (
        <Modal
          transparent
          animationType="fade"
          visible={isDatePickerOpen}
          onRequestClose={() => setIsDatePickerOpen(false)}
        >
          <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white rounded-t-3xl p-5 pb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-neutral-900">
                  Select Date of Birth
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsDatePickerOpen(false)}
                >
                  <Text className="text-base font-bold text-orange-600">
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
