import * as Location from "expo-location";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UserLocationData {
  coords: LocationCoords | null;
  locationName: string;
  addressDetails: Location.LocationGeocodedAddress | null;
  permissionStatus: Location.PermissionStatus | "undetermined";
  isLoading: boolean;
  error: string | null;
}
