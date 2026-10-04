import * as Location from "expo-location";
import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { useLocationStore } from "../store/useLocationStore";
import { LocationCoords } from "../types";
import { areasApi } from "../../areas/services/areasApi";

export const formatLocationName = (
  address: Location.LocationGeocodedAddress
): string => {
  let areaPart =
    address.district || address.street || address.name || address.subregion;

  if (
    address.street &&
    address.name &&
    address.name !== address.street &&
    isNaN(Number(address.street))
  ) {
    areaPart = address.street;
  }

  const cityPart = address.city || address.subregion || address.region;
  const countryPart = address.country;

  if (
    areaPart &&
    cityPart &&
    areaPart.toLowerCase() !== cityPart.toLowerCase()
  ) {
    return `${areaPart}, ${cityPart}`;
  }

  if (
    cityPart &&
    countryPart &&
    cityPart.toLowerCase() !== countryPart.toLowerCase()
  ) {
    return `${cityPart}, ${countryPart}`;
  }

  return areaPart || cityPart || countryPart || "Current Location";
};

export const locationService = {
  /**
   * Request user permission and fetch current GPS position + reverse geocode location name
   */
  requestAndGetLocation: async (): Promise<{
    coords: LocationCoords | null;
    locationName: string;
    addressDetails: Location.LocationGeocodedAddress | null;
  }> => {
    const locationStore = useLocationStore.getState();
    locationStore.setIsLoading(true);

    try {
      // 1. Check existing permission status first
      let { status } = await Location.getForegroundPermissionsAsync();

      // Only prompt user for permission ONCE if undetermined and not requested before
      if (
        status === Location.PermissionStatus.UNDETERMINED &&
        !locationStore.hasRequestedPermission
      ) {
        locationStore.setHasRequestedPermission(true);
        const req = await Location.requestForegroundPermissionsAsync();
        status = req.status;
      }
      locationStore.setPermissionStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        locationStore.setHasRequestedPermission(true);
        locationStore.setError("Location permission was denied");
        return {
          coords: null,
          locationName: locationStore.locationName || "Madrid, Spain",
          addressDetails: null,
        };
      }

      // 2. Fetch current GPS position (fast with balanced accuracy, with fallback)
      let position: Location.LocationObject | null = null;
      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        // Fallback to last known position if immediate GPS lock fails
        position = await Location.getLastKnownPositionAsync();
      }

      if (!position) {
        throw new Error("Unable to retrieve device coordinates");
      }

      const coords: LocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // 3. Reverse geocode to get human-readable address
      let locationName = "Current Location";
      let addressDetails: Location.LocationGeocodedAddress | null = null;

      try {
        const addresses = await Location.reverseGeocodeAsync(coords);
        if (addresses && addresses.length > 0) {
          addressDetails = addresses[0];
          locationName = formatLocationName(addressDetails);
        }
      } catch (geocodeErr) {
        console.warn("Reverse geocode failed, using coordinates", geocodeErr);
        locationName = `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
      }

      // 4. Update local location store
      locationStore.setLocation(coords, locationName, addressDetails);

      // 5. Auto resolve closest Area from backend
      try {
        const resolvedArea = await areasApi.resolveArea(coords);
        if (resolvedArea && useLocationStore.getState().isAutoDetect) {
          useLocationStore.getState().setSelectedArea(resolvedArea);
        }
      } catch (areaErr) {
        console.warn("Failed to resolve nearest area:", areaErr);
      }

      // 6. If user is logged in, sync location with backend API
      const authState = useAuthStore.getState();
      if (authState.isAuthenticated) {
        locationService.syncLocationWithBackend(coords).catch((err) => {
          console.warn("Failed to sync location with backend:", err);
        });
      }

      return { coords, locationName, addressDetails };
    } catch (err: any) {
      console.warn("Location error:", err);
      locationStore.setError(err.message || "Failed to get location");
      return {
        coords: null,
        locationName: locationStore.locationName || "Madrid, Spain",
        addressDetails: null,
      };
    } finally {
      locationStore.setIsLoading(false);
    }
  },

  /**
   * Sync coordinates with backend to update user's location and nearest area
   */
  syncLocationWithBackend: async (coords: LocationCoords) => {
    try {
      const response = await apiClient.post<any>(ENDPOINTS.AUTH.LOCATION_SYNC, {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const updatedData = response.data?.data || response.data;
      if (updatedData) {
        useAuthStore.getState().updateUser({
          latitude: coords.latitude,
          longitude: coords.longitude,
          areaId: updatedData.areaId,
          area: updatedData.area,
        });
      }
      return updatedData;
    } catch (error) {
      console.warn("Backend location sync failed:", error);
    }
  },
};
