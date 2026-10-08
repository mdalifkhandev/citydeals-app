import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales";
import { useUserLocation } from "../features/location/hooks/useUserLocation";
import { tokenService } from "../features/auth/services/tokenService";

const queryClient = new QueryClient();

function LocationInitializer() {
  useUserLocation(true);
  return null;
}

function AuthInitializer() {
  useEffect(() => {
    tokenService.loadTokens();
  }, []);
  return null;
}

function NotificationInitializer() {
  useEffect(() => {
    import("../features/notifications/services/pushNotificationService").then(
      ({ setupNotificationListeners }) => {
        const cleanup = setupNotificationListeners();
        return cleanup;
      }
    );
  }, []);
  return null;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <AuthInitializer />
            <LocationInitializer />
            <NotificationInitializer />
            {children}
            <Toaster />
          </QueryClientProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

