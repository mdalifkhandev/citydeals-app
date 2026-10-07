import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  useSafeAreaInsets,
  initialWindowMetrics,
} from "react-native-safe-area-context";

interface AppBottomSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  showDragIndicator?: boolean;
  children: React.ReactNode;
}

export default function AppBottomSheet({
  isPresented,
  onDismiss,
  showDragIndicator = true,
  children,
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const rawBottom = Math.max(
    insets.bottom,
    initialWindowMetrics?.insets?.bottom ?? 0
  );
  // Ensure comfortable clearance above the Android system navigation bar (typically ~48px) and iOS home indicator (~34px)
  const bottomPadding = Math.max(rawBottom, Platform.OS === "android" ? 36 : 20) + 24;

  return (
    <Modal
      visible={isPresented}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop touch area to dismiss */}
        <Pressable className="flex-1" onPress={onDismiss} />

        {/* Bottom Sheet Container */}
        <TouchableWithoutFeedback>
          <View
            style={{ paddingBottom: bottomPadding }}
            className="bg-white rounded-t-[32px] px-6 pt-3 border-t border-neutral-100 max-h-[90%]"
          >
            {/* Grabber indicator */}
            {showDragIndicator && (
              <View className="w-12 h-1.5 rounded-full bg-neutral-200 self-center mb-4" />
            )}
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
