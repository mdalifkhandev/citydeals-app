import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import PrimaryButton from "./PrimaryButton";

export interface DealItem {
  id: string;
  category?: string;
  image?: ImageSourcePropType | string;
  dealHeading: string;
  dealDescription: string;
  isFavorite?: boolean;
}

interface DealCardProps {
  deal: DealItem;
  onPressOpen?: (deal: DealItem) => void;
  onToggleFavorite?: (deal: DealItem) => void;
}

export default function DealCard({
  deal,
  onPressOpen,
  onToggleFavorite,
}: DealCardProps) {
  const [favorite, setFavorite] = useState(deal.isFavorite ?? false);

  const handleFavoriteToggle = () => {
    const newState = !favorite;
    setFavorite(newState);
    onToggleFavorite?.({ ...deal, isFavorite: newState });
  };

  const imageSource =
    typeof deal.image === "string"
      ? { uri: deal.image }
      : deal.image || require("../../assets/images/placeholder-deal.jpg");

  return (
    <View className="bg-white rounded-[26px] p-4 mb-5 border border-neutral-100">
      {/* Banner Container */}
      <View className="rounded-2xl overflow-hidden bg-neutral-100 relative">
        {/* Favorite Heart Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleFavoriteToggle}
          className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-white items-center justify-center z-20 border border-neutral-100"
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? "#ef4444" : "#1e293b"}
          />
        </TouchableOpacity>

        {/* Poster Image */}
        <Image
          source={imageSource}
          className="w-full h-[55vh]"
          style={{ width: "100%", height: 350 }}
          contentFit="cover"
        />
      </View>

      {/* Card Info Details */}
      <View className="pt-3.5 pb-1 px-1">
        <Text className="text-neutral-900 font-bold text-lg">
          {deal.dealHeading}
        </Text>
        <Text className="text-neutral-500 text-base mt-0.5 font-normal">
          {deal.dealDescription}
        </Text>
      </View>

      {/* Action CTA Button */}
      <PrimaryButton
        title="Open"
        onPress={() => onPressOpen?.(deal)}
        className="mt-3.5"
      />
    </View>
  );
}
