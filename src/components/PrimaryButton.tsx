import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

export interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  className = "",
  textClassName = "",
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      className={`w-full bg-orange-500 active:bg-orange-600 h-13 py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-500/25 ${
        isDisabled ? "opacity-60" : ""
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text
          className={`text-white font-bold text-lg tracking-wide ${textClassName}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
