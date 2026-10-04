import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useLocationStore } from "../store/useLocationStore";
import { locationService } from "../services/locationService";
import { useShallow } from "zustand/react/shallow";

export const useUserLocation = (autoFetch: boolean = true) => {
  const { coords, locationName, permissionStatus, isLoading, error } =
    useLocationStore(
      useShallow((state) => ({
        coords: state.coords,
        locationName: state.locationName,
        permissionStatus: state.permissionStatus,
        isLoading: state.isLoading,
        error: state.error,
      }))
    );

  useEffect(() => {
    if (autoFetch) {
      locationService.requestAndGetLocation();
    }

    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState === "active") {
          locationService.requestAndGetLocation();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [autoFetch]);

  const refreshLocation = async () => {
    return await locationService.requestAndGetLocation();
  };

  return {
    coords,
    locationName,
    permissionStatus,
    isLoading,
    error,
    refreshLocation,
  };
};
