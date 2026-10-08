export interface AreaItem {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  radiusMeters?: number | null;
  qrCodeUrl?: string | null;
  distanceMeters?: number;
}
