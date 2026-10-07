import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import CurvedHeader from "../../components/CurvedHeader";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { supportApi } from "../../features/support/services/supportApi";
import { handleApiError } from "../../utils/errorHandler";

export default function HelpSupportScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_MESSAGE_LENGTH = 500;

  useEffect(() => {
    if (user) {
      if (user.fullName && !fullName) {
        setFullName(user.fullName);
      }
      if (user.email && !email) {
        setEmail(user.email);
      }
    }
  }, [user]);

  const handleSubmit = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      toast.error("Full Name Required", {
        description: "Please enter your name so we know who to address.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      toast.error("Valid Email Required", {
        description: "Please enter a valid email address so our team can reply.",
      });
      return;
    }

    if (!trimmedSubject) {
      toast.error("Subject Required", {
        description: "Please provide a subject describing your topic.",
      });
      return;
    }

    if (!trimmedMessage) {
      toast.error("Message Required", {
        description: "Please describe your question or issue in detail.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await supportApi.createTicket({
        fullName: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      });

      toast.success("Request Submitted Successfully", {
        description: "Our support team will review your inquiry and reply via email.",
      });

      setSubject("");
      setMessage("");
      setTimeout(() => {
        router.back();
      }, 700);
    } catch (error) {
      toast.error("Failed to Send Message", {
        description: handleApiError(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Curved Navy Top Header */}
      <CurvedHeader title="Help & Support" showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Form Card */}
          <View className="bg-white rounded-3xl p-5 mx-4 mt-6 border border-neutral-100 shadow-xs">
            <View className="flex-row items-center mb-1">
              <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-2.5 border border-orange-100">
                <Feather name="headphones" size={18} color="#ea580c" />
              </View>
              <Text className="text-neutral-900 font-extrabold text-lg">
                Contact Support
              </Text>
            </View>

            <Text className="text-neutral-500 text-sm mb-5 leading-5">
              Have questions, feedback, or need help with a coupon? Fill out the
              details below and our team will get back to you shortly.
            </Text>

            <View className="gap-y-4">
              {/* Full Name Field */}
              <View>
                <Text className="text-neutral-700 text-sm font-semibold mb-1.5 ml-1">
                  Full Name <Text className="text-orange-500">*</Text>
                </Text>
                <View className="border border-neutral-200 rounded-2xl px-4 py-3 bg-neutral-50/60 flex-row items-center">
                  <Feather name="user" size={18} color="#9ca3af" />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                    returnKeyType="next"
                    className="text-neutral-900 text-base font-medium flex-1 py-0 ml-2.5"
                    style={{ textAlignVertical: "center", color: "#171717" }}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Email Address Field */}
              <View>
                <Text className="text-neutral-700 text-sm font-semibold mb-1.5 ml-1">
                  Email Address <Text className="text-orange-500">*</Text>
                </Text>
                <View className="border border-neutral-200 rounded-2xl px-4 py-3 bg-neutral-50/60 flex-row items-center">
                  <Feather name="mail" size={18} color="#9ca3af" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    className="text-neutral-900 text-base font-medium flex-1 py-0 ml-2.5"
                    style={{ textAlignVertical: "center", color: "#171717" }}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Subject Field */}
              <View>
                <Text className="text-neutral-700 text-sm font-semibold mb-1.5 ml-1">
                  Subject <Text className="text-orange-500">*</Text>
                </Text>
                <View className="border border-neutral-200 rounded-2xl px-4 py-3 bg-neutral-50/60 flex-row items-center">
                  <Feather name="tag" size={18} color="#9ca3af" />
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Enter subject"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    className="text-neutral-900 text-base font-medium flex-1 py-0 ml-2.5"
                    style={{ textAlignVertical: "center", color: "#171717" }}
                    editable={!isSubmitting}
                  />
                </View>
              </View>

              {/* Message / Description Field */}
              <View>
                <Text className="text-neutral-700 text-sm font-semibold mb-1.5 ml-1">
                  Message <Text className="text-orange-500">*</Text>
                </Text>
                <View className="border border-neutral-200 rounded-2xl px-4 pt-3.5 pb-2.5 bg-neutral-50/60 min-h-[140px]">
                  <TextInput
                    value={message}
                    onChangeText={(text) => {
                      if (text.length <= MAX_MESSAGE_LENGTH) {
                        setMessage(text);
                      }
                    }}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="Describe your issue or question in detail..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                    className="text-neutral-900 text-base font-medium flex-1 py-0"
                    style={{ color: "#171717" }}
                    editable={!isSubmitting}
                  />
                  {/* Character Counter Indicator */}
                  <View className="items-end pt-1">
                    <Text
                      className={`text-xs font-medium ${
                        message.length === MAX_MESSAGE_LENGTH
                          ? "text-red-500 font-bold"
                          : "text-neutral-400"
                      }`}
                    >
                      {message.length}/{MAX_MESSAGE_LENGTH}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Submit CTA Button */}
            <View className="mt-7">
              <PrimaryButton
                title={isSubmitting ? "Sending..." : "Send Message"}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </View>
          </View>

          {/* Quick Support Info Cards */}
          <View className="mx-4 mt-5 gap-y-3">
            <View className="bg-white rounded-2xl p-4 border border-neutral-100 flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3.5">
                <Ionicons name="mail-outline" size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-900 font-bold text-sm">
                  Direct Email Support
                </Text>
                <Text className="text-neutral-500 text-xs mt-0.5">
                  support@citydeals.com
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-4 border border-neutral-100 flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center mr-3.5">
                <Ionicons name="time-outline" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-neutral-900 font-bold text-sm">
                  Operating Hours
                </Text>
                <Text className="text-neutral-500 text-xs mt-0.5">
                  Mon – Fri, 9:00 AM – 6:00 PM (Response within 24h)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
