import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { router } from "expo-router";

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let cachedPushToken: string | null = null;
let isPushConfiguredOnDevice = true;

/**
 * Register for push notifications and return the native device push token.
 * On Android this is the FCM token. On iOS this is the APNs token.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  // If already fetched, return cached token
  if (cachedPushToken) {
    return cachedPushToken;
  }

  // If already determined that push/Firebase is unconfigured, avoid repeated failing calls
  if (!isPushConfiguredOnDevice) {
    return null;
  }

  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log("[PUSH] Must use physical device for push notifications");
    return null;
  }

  // Check existing permission
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ask for permission if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("[PUSH] Notification permission denied");
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ea580c",
    });

    await Notifications.setNotificationChannelAsync("deals", {
      name: "Deals & Offers",
      description: "Notifications about nearby deals and offers",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ea580c",
    });
  }

  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const token = String(tokenData.data);
    console.log("[PUSH] Native device push token:", token);
    cachedPushToken = token;
    return token;
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    if (
      errorMessage.includes("Firebase") ||
      errorMessage.includes("googleServicesFile")
    ) {
      isPushConfiguredOnDevice = false;
      console.warn(
        "[PUSH] Push notifications (FCM/APNs) are not fully configured yet. Push token registration will be skipped for this session."
      );
    } else {
      console.warn("[PUSH] Failed to get push token:", errorMessage);
    }
    return null;
  }
}

/**
 * Listen for incoming notifications (foreground) and taps (background / killed)
 */
export function setupNotificationListeners() {
  // When a notification is received while app is in foreground
  const receivedSubscription =
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("[PUSH] Notification received:", notification.request.content.title);
    });

  // When user taps on a notification
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("[PUSH] Notification tapped, data:", data);

      // Navigate based on notification data
      if (data?.couponId) {
        router.push({
          pathname: "/screens/coupon-details" as any,
          params: { id: data.couponId as string },
        });
      } else {
        // Default: go to notifications screen
        router.push("/screens/notifications" as any);
      }
    });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
