import { Asset } from "expo-asset";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { ImageSourcePropType, Linking, Platform, Share as RNNativeShare } from "react-native";
import RNShare, { Social } from "react-native-share";

export interface ShareCouponOptions {
  dealHeading: string;
  dealDescription: string;
  dealUrl: string;
  imageSource: ImageSourcePropType | string;
}

/**
 * Resolves bundled require() assets or remote URLs to a local file:// URI.
 */
export async function resolveImageLocalUri(
  imageSource: ImageSourcePropType | string
): Promise<string | null> {
  try {
    if (typeof imageSource === "number") {
      const asset = Asset.fromModule(imageSource);
      await asset.downloadAsync();
      return asset.localUri || asset.uri || null;
    }

    if (typeof imageSource === "string") {
      if (imageSource.startsWith("file://")) {
        return imageSource;
      }
      const asset = Asset.fromURI(imageSource);
      await asset.downloadAsync();
      return asset.localUri || asset.uri || null;
    }

    if (
      typeof imageSource === "object" &&
      imageSource !== null &&
      "uri" in imageSource &&
      typeof imageSource.uri === "string"
    ) {
      if (imageSource.uri.startsWith("file://")) {
        return imageSource.uri;
      }
      const asset = Asset.fromURI(imageSource.uri);
      await asset.downloadAsync();
      return asset.localUri || asset.uri || null;
    }
  } catch (error) {
    console.warn("Failed to resolve local image URI:", error);
  }
  return null;
}

/**
 * Shares the coupon using the native system share sheet with both the image file and link.
 */
export async function shareCouponWithSystemSheet(
  options: ShareCouponOptions,
  onNotify?: (msg: string) => void
): Promise<void> {
  const { dealHeading, dealDescription, dealUrl, imageSource } = options;
  const shareMessage = `Check out this special offer on CityDeals!\n\n${dealHeading}\n${dealDescription}\n\nGet the coupon: ${dealUrl}`;

  try {
    const localUri = await resolveImageLocalUri(imageSource);

    // Try react-native-share if localUri is available
    if (localUri) {
      try {
        await RNShare.open({
          title: dealHeading,
          message: shareMessage,
          url: localUri,
          subject: dealHeading,
          type: "image/jpeg",
          failOnCancel: false,
        });
        return;
      } catch (rnShareError: any) {
        if (rnShareError?.message?.includes("User did not share")) {
          return;
        }
        console.warn("RNShare open failed, attempting expo-sharing fallback:", rnShareError);
      }

      // Fallback 1: expo-sharing
      const canShareWithExpo = await Sharing.isAvailableAsync();
      if (canShareWithExpo) {
        await Clipboard.setStringAsync(shareMessage);
        onNotify?.("Deal info copied to clipboard. Select an app to share the image.");
        await Sharing.shareAsync(localUri, {
          dialogTitle: dealHeading,
          mimeType: "image/jpeg",
        });
        return;
      }
    }

    // Fallback 2: React Native standard Share
    await RNNativeShare.share({
      title: dealHeading,
      message: shareMessage,
      url: dealUrl,
    });
  } catch (error) {
    console.error("Error sharing coupon:", error);
    onNotify?.("Unable to complete share at this time.");
  }
}

/**
 * Direct social app sharing with fallback to the system share dialog.
 */
export async function shareToSocialPlatform(
  platform: "facebook" | "instagram" | "tiktok" | "sms",
  options: ShareCouponOptions,
  onNotify?: (msg: string) => void
): Promise<void> {
  const { dealHeading, dealDescription, dealUrl, imageSource } = options;
  const shareMessage = `Check out this special offer on CityDeals!\n\n${dealHeading}\n${dealDescription}\n\nGet the coupon: ${dealUrl}`;

  try {
    const localUri = await resolveImageLocalUri(imageSource);

    if (platform === "facebook") {
      if (localUri) {
        try {
          await RNShare.shareSingle({
            social: Social.Facebook,
            url: localUri,
            message: shareMessage,
            title: dealHeading,
          });
          return;
        } catch {
          // Fallback to system sheet with image attached
          await shareCouponWithSystemSheet(options, onNotify);
          return;
        }
      } else {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          dealUrl
        )}&quote=${encodeURIComponent(shareMessage)}`;
        await Linking.openURL(fbUrl);
        return;
      }
    }

    if (platform === "instagram") {
      if (localUri) {
        try {
          await Clipboard.setStringAsync(shareMessage);
          onNotify?.("Deal text copied! Paste it into your Instagram chat.");
          await RNShare.shareSingle({
            social: Social.Instagram,
            url: localUri,
            type: "image/jpeg",
          });
          return;
        } catch {
          await shareCouponWithSystemSheet(options, onNotify);
          return;
        }
      }
    }

    if (platform === "tiktok") {
      // TikTok sharing: Launch system share sheet with image and link pre-attached
      await Clipboard.setStringAsync(shareMessage);
      onNotify?.("Deal text copied! Sharing image to TikTok...");
      await shareCouponWithSystemSheet(options, onNotify);
      return;
    }

    if (platform === "sms") {
      if (localUri) {
        try {
          await RNShare.shareSingle({
            social: Social.Sms,
            url: localUri,
            message: shareMessage,
            recipient: "",
          });
          return;
        } catch {
          await shareCouponWithSystemSheet(options, onNotify);
          return;
        }
      } else {
        const separator = Platform.OS === "ios" ? "&" : "?";
        const smsUrl = `sms:${separator}body=${encodeURIComponent(shareMessage)}`;
        await Linking.openURL(smsUrl);
        return;
      }
    }
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error);
    await shareCouponWithSystemSheet(options, onNotify);
  }
}
