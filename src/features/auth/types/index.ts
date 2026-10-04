export type Role = "ADMIN" | "ADVERTISER" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  role: Role;
  status: UserStatus;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}
