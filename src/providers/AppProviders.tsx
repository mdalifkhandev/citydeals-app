import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer />
          <LocationInitializer />
          {children}
          <Toaster />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
