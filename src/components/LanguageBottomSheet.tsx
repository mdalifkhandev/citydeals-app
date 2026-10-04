import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AppBottomSheet from "./AppBottomSheet";
import PrimaryButton from "./PrimaryButton";

export const LANGUAGES = [
  { id: "en", label: "English", flag: "🇺🇸", nativeName: "English (US)" },
  { id: "es", label: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { id: "pt", label: "Brazilian", flag: "🇧🇷", nativeName: "Português" },
];

interface LanguageBottomSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  selectedLanguage: string;
  onSaveLanguage: (language: string) => void;
}

export default function LanguageBottomSheet({
  isPresented,
  onDismiss,
  selectedLanguage,
  onSaveLanguage,
}: LanguageBottomSheetProps) {
  const [tempLanguage, setTempLanguage] = useState(selectedLanguage);

  useEffect(() => {
    if (isPresented) {
      setTempLanguage(selectedLanguage);
    }
  }, [isPresented, selectedLanguage]);

  const handleSave = () => {
    onSaveLanguage(tempLanguage);
    onDismiss();
  };

  return (
    <AppBottomSheet isPresented={isPresented} onDismiss={onDismiss}>
      <Text className="text-neutral-900 font-extrabold text-xl text-center mt-1 mb-5">
        Choose Your Language
      </Text>

      {/* Language Options */}
      <View className="gap-y-3 w-full">
        {LANGUAGES.map((lang) => {
          const isSelected = tempLanguage === lang.label;
          return (
            <TouchableOpacity
              key={lang.id}
              activeOpacity={0.8}
              onPress={() => setTempLanguage(lang.label)}
              className={`w-full h-16 rounded-2xl flex-row items-center justify-between px-4 border ${
                isSelected
                  ? "bg-orange-50 border-orange-500"
                  : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center mr-3.5 ${
                    isSelected
                      ? "bg-orange-100"
                      : "bg-white border border-neutral-200"
                  }`}
                >
                  <Text className="text-2xl">{lang.flag}</Text>
                </View>
                <View>
                  <Text
                    className={`font-bold text-lg ${
                      isSelected ? "text-orange-600" : "text-neutral-900"
                    }`}
                  >
                    {lang.label}
                  </Text>
                  <Text className="text-neutral-500 text-base">
                    {lang.nativeName}
                  </Text>
                </View>
              </View>

              <View
                className={`w-6 h-6 rounded-full items-center justify-center border ${
                  isSelected
                    ? "bg-orange-500 border-orange-500"
                    : "border-neutral-300 bg-white"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Save CTA Button */}
      <PrimaryButton
        title="Save Language"
        onPress={handleSave}
        className="mt-6"
      />
    </AppBottomSheet>
  );
}
