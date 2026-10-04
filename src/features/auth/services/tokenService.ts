import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { AuthTokens } from "../types";

class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async loadTokens(): Promise<void> {
    try {
      const [accToken, refToken] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      this.accessToken = accToken;
      this.refreshToken = refToken;
    } catch (error) {
      console.warn("Failed to load tokens", error);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  async getRefreshTokenAsync(): Promise<string | null> {
    if (this.refreshToken) return this.refreshToken;
    try {
      this.refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      return this.refreshToken;
    } catch {
      return null;
    }
  }

  async saveTokens(tokens?: AuthTokens | null): Promise<void> {
    if (!tokens || !tokens.accessToken) return;
    this.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      this.refreshToken = tokens.refreshToken;
    }

    try {
      const ops = [SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)];
      if (tokens.refreshToken) {
        ops.push(SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken));
      }
      await Promise.all(ops);
    } catch (error) {
      console.warn("Failed to save tokens", error);
    }
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;

    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN).catch(() => {}),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN).catch(() => {}),
      ]);
    } catch (error) {
      console.warn("Failed to clear tokens", error);
    }
  }
}

export const tokenService = new TokenService();
