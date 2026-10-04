import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { LocationCoords } from "../types";
import { AreaItem } from "../../areas/types";

interface LocationStoreState {
  coords: LocationCoords | null;
  locationName: string;
  addressDetails: Location.LocationGeocodedAddress | null;
  permissionStatus: Location.PermissionStatus | "undetermined";
  hasRequestedPermission: boolean;
  isLoading: boolean;
  error: string | null;
  selectedArea: AreaItem | null;
  isAutoDetect: boolean;

  setLocation: (
    coords: LocationCoords,
    locationName: string,
    addressDetails?: Location.LocationGeocodedAddress | null
  ) => void;
  setSelectedArea: (area: AreaItem | null) => void;
  setIsAutoDetect: (auto: boolean) => void;
  setPermissionStatus: (status: Location.PermissionStatus | "undetermined") => void;
  setHasRequestedPermission: (hasRequested: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationStoreState>()(
  persist(
    (set) => ({
      coords: null,
      locationName: "Madrid, Spain",
      addressDetails: null,
      permissionStatus: "undetermined",
      hasRequestedPermission: false,
      isLoading: false,
      error: null,
      selectedArea: null,
      isAutoDetect: true,

      setLocation: (coords, locationName, addressDetails = null) =>
        set({
          coords,
          locationName,
          addressDetails,
          isLoading: false,
          error: null,
        }),

      setSelectedArea: (selectedArea) =>
        set({
          selectedArea,
          isAutoDetect: false,
        }),

      setIsAutoDetect: (isAutoDetect) =>
        set({
          isAutoDetect,
        }),

      setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
      setHasRequestedPermission: (hasRequestedPermission) =>
        set({ hasRequestedPermission }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: "citydeals-location-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        coords: state.coords,
        locationName: state.locationName,
        permissionStatus: state.permissionStatus,
        hasRequestedPermission: state.hasRequestedPermission,
        selectedArea: state.selectedArea,
        isAutoDetect: state.isAutoDetect,
      }),
    }
  )
);
