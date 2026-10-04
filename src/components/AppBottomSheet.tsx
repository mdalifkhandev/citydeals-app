import React from "react";
import {
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
  return (
    <Modal
      visible={isPresented}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop touch area to dismiss */}
        <Pressable className="flex-1" onPress={onDismiss} />

        {/* Bottom Sheet Container */}
        <TouchableWithoutFeedback>
          <View className="bg-white rounded-t-[32px] px-6 pt-3 pb-10 shadow-2xl border-t border-neutral-100">
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
