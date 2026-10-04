import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import CurvedHeader from "../../components/CurvedHeader";
import PrimaryButton from "../../components/PrimaryButton";

export default function HelpSupportScreen() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const MAX_DESCRIPTION_LENGTH = 200;

  const handleSubmit = () => {
    if (!subject.trim()) {
      alert("Please enter a subject.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    alert("Your support request has been submitted successfully!");
    setSubject("");
    setDescription("");
    router.back();
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Curved Navy Top Header */}
      <CurvedHeader title="Help & Support" showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Form Card */}
          <View className="bg-white rounded-3xl p-5 mx-4 mt-6 shadow-sm border border-neutral-100">
            <Text className="text-neutral-900 font-bold text-lg mb-1">
              Contact Support
            </Text>
            <Text className="text-neutral-500 text-base mb-5 font-normal">
              Please provide details about your inquiry and our team will get back to you shortly.
            </Text>

            <View className="gap-y-5">
              {/* Subject Field */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 py-3.5 bg-white">
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Enter subject"
                    placeholderTextColor="#9ca3af"
                    className="text-neutral-900 text-base font-medium py-0"
                  />
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Subject
                  </Text>
                </View>
              </View>

              {/* Description Field with 200 Character Limit */}
              <View className="relative mt-2">
                <View className="border border-neutral-300 rounded-2xl px-4 pt-3.5 pb-2 bg-white h-44">
                  <TextInput
                    value={description}
                    onChangeText={(text) => {
                      if (text.length <= MAX_DESCRIPTION_LENGTH) {
                        setDescription(text);
                      }
                    }}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    placeholder="Describe your issue or question in detail..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                    className="text-neutral-900 text-base font-medium flex-1 py-0"
                  />
                  {/* Character Counter Indicator */}
                  <View className="items-end pt-1">
                    <Text
                      className={`text-base font-medium ${
                        description.length === MAX_DESCRIPTION_LENGTH
                          ? "text-red-500 font-bold"
                          : "text-neutral-400"
                      }`}
                    >
                      {description.length}/{MAX_DESCRIPTION_LENGTH}
                    </Text>
                  </View>
                </View>
                <View className="absolute -top-2.5 left-4 bg-white px-1.5 z-10">
                  <Text className="text-neutral-600 text-base font-medium">
                    Description
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Submit CTA Button */}
          <View className="px-4 mt-8">
            <PrimaryButton title="Send Message" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
