import { Asset } from "expo-asset";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";
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
 * ExpoSharing strictly requires 'file://' scheme.
 */
export async function resolveImageLocalUri(
  imageSource: ImageSourcePropType | string
): Promise<string | null> {
  try {
    let localPath: string | null = null;

    if (typeof imageSource === "number") {
      const asset = Asset.fromModule(imageSource);
      await asset.downloadAsync();
      localPath = asset.localUri || asset.uri || null;
    } else {
      const remoteUri =
        typeof imageSource === "string"
          ? imageSource
          : typeof imageSource === "object" && imageSource !== null && "uri" in imageSource
          ? (imageSource as any).uri
          : null;

      if (remoteUri) {
        if (remoteUri.startsWith("file://")) {
          localPath = remoteUri;
        } else if (remoteUri.startsWith("http://") || remoteUri.startsWith("https://")) {
          // Download remote image to device cache as a local file://
          const filename = "citydeals_share_deal.jpg";
          const cacheDir = FileSystem.cacheDirectory || "";
          const targetFile = `${cacheDir}${filename}`;
          const downloadResult = await FileSystem.downloadAsync(remoteUri, targetFile);
          localPath = downloadResult.uri;
        }
      }
    }

    if (localPath) {
      return localPath.startsWith("file://") ? localPath : `file://${localPath}`;
    }
  } catch (error) {
    console.warn("Failed to resolve local image URI for sharing:", error);
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
  const shareMessage = `🔥 Special Offer on CityDeals!\n\n🏷️ ${dealHeading}\n${dealDescription}\n\n👉 Get coupon: ${dealUrl}`;

  try {
    const localUri = await resolveImageLocalUri(imageSource);

    // Copy deal text to clipboard so it is always ready to paste in Facebook/Instagram
    await Clipboard.setStringAsync(shareMessage);

    if (localUri) {
      // Priority 1: Use RNShare.open because it passes BOTH the image (EXTRA_STREAM) AND the text message (EXTRA_TEXT)
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

      // Priority 2: expo-sharing fallback (shares the image file; user can paste the copied text)
      const canShareWithExpo = await Sharing.isAvailableAsync();
      if (canShareWithExpo) {
        onNotify?.("Details copied to clipboard! (Long press to paste)");
        await Sharing.shareAsync(localUri, {
          dialogTitle: dealHeading,
          mimeType: "image/jpeg",
          UTI: "public.jpeg",
        });
        return;
      }
    }

    // Fallback if no local image: React Native standard Share
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
      // Copy deal caption to clipboard so user can easily paste it into Facebook post
      await Clipboard.setStringAsync(shareMessage);

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
        } catch (rnErr: any) {
          if (rnErr?.message?.includes("User did not share")) {
            return;
          }
        }

        const canShareWithExpo = await Sharing.isAvailableAsync();
        if (canShareWithExpo) {
          onNotify?.("Details copied to clipboard! (Long press to paste)");
          await Sharing.shareAsync(localUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Share ${dealHeading} to Facebook`,
            UTI: "public.jpeg",
          });
          return;
        }
      }

      await shareCouponWithSystemSheet(options, onNotify);
      return;
    }

    if (platform === "instagram") {
      await Clipboard.setStringAsync(shareMessage);
      onNotify?.("Caption copied to clipboard! Tap 'Write a caption...' and Paste in Instagram.");

      if (localUri) {
        try {
          await RNShare.shareSingle({
            social: Social.Instagram,
            url: localUri,
            type: "image/jpeg",
            message: shareMessage,
          });
          return;
        } catch {
          // Fallback to expo-sharing
        }

        const canShareWithExpo = await Sharing.isAvailableAsync();
        if (canShareWithExpo) {
          await Sharing.shareAsync(localUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Share ${dealHeading} to Instagram`,
            UTI: "public.jpeg",
          });
          return;
        }
      }

      await shareCouponWithSystemSheet(options, onNotify);
      return;
    }

    if (platform === "tiktok") {
      await Clipboard.setStringAsync(shareMessage);
      onNotify?.("Deal info copied! Select TikTok to share the photo.");

      if (localUri) {
        const canShareWithExpo = await Sharing.isAvailableAsync();
        if (canShareWithExpo) {
          await Sharing.shareAsync(localUri, {
            mimeType: "image/jpeg",
            dialogTitle: `Share ${dealHeading} to TikTok`,
            UTI: "public.jpeg",
          });
          return;
        }
      }

      await shareCouponWithSystemSheet(options, onNotify);
      return;
    }

    if (platform === "sms") {
      const separator = Platform.OS === "ios" ? "&" : "?";
      const smsUrl = `sms:${separator}body=${encodeURIComponent(shareMessage)}`;
      try {
        const canOpen = await Linking.canOpenURL(smsUrl);
        if (canOpen) {
          await Linking.openURL(smsUrl);
          return;
        }
      } catch {
        // Fallback to system sheet
      }
      await shareCouponWithSystemSheet(options, onNotify);
      return;
    }
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error);
    await shareCouponWithSystemSheet(options, onNotify);
  }
}
