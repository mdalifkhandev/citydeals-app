import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en.json";
import es from "./es.json";
import pt from "./pt.json";

export const LANGUAGE_STORAGE_KEY = "user_selected_language";
export const SUPPORTED_LANGUAGES = ["en", "es", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const defaultNS = "translation";
export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  pt: {
    translation: pt,
  },
} as const;

// Synchronous initial language detection from device
const getDeviceLanguage = (): SupportedLanguage => {
  try {
    const deviceLang = Localization.getLocales()?.[0]?.languageCode?.slice(0, 2);
    if (deviceLang && SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage)) {
      return deviceLang as SupportedLanguage;
    }
  } catch (error) {
    console.warn("Failed to read device locale:", error);
  }
  return "en";
};

// 1. Initialize i18n synchronously at module import time
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    defaultNS,
    lng: getDeviceLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

// 2. Asynchronously load and apply persisted user language preference
export const syncStoredLanguage = async () => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as SupportedLanguage)) {
      if (i18n.language !== saved) {
        await i18n.changeLanguage(saved);
      }
    }
  } catch (error) {
    console.warn("Failed to load saved language:", error);
  }
};

syncStoredLanguage();

// Change language globally & persist
export const changeAppLanguage = async (languageCode: string) => {
  try {
    const normalized = SUPPORTED_LANGUAGES.includes(languageCode as SupportedLanguage)
      ? languageCode
      : "en";
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    await i18n.changeLanguage(normalized);
  } catch (error) {
    console.error("Failed to change app language:", error);
  }
};

export default i18n;

