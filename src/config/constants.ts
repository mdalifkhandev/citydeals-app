import { ImageSourcePropType } from "react-native";
import { DealItem } from "../components/DealCard";

export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    id: "en",
    name: "English",
    nativeName: "English (US)",
    flag: "🇺🇸",
  },
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  {
    id: "pt",
    name: "Brazilian",
    nativeName: "Português",
    flag: "🇧🇷",
  },
];

export interface OnboardingSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export const ONBOARDING_DATA: OnboardingSlide[] = [
  {
    id: "1",
    badge: "Special Discounts",
    title: "Save More on\nWhat You Love",
    description:
      "Discover Amazing local deals, exclusive coupons, and special offers near you",
    image: require("../../assets/images/coupons-1.png"),
  },
  {
    id: "2",
    badge: "Nearby Locations",
    title: "Find Great Deals\nNear You",
    description:
      "Browse nearby coupon locations, restaurants, and special offers around your area in seconds.",
    image: require("../../assets/images/coupons-2.png"),
  },
  {
    id: "3",
    badge: "Instant Checkout",
    title: "Ready to Save\nEvery Day",
    description:
      "Save your favorite coupons. Show them at checkout and enjoy local saving anytime.",
    image: require("../../assets/images/coupons-3.png"),
  },
];

export const CATEGORIES = [
  "All",
  "Shopping",
  "Groceries",
  "Electronics",
  "Restaurants",
  "Beauty",
];

export const MOCK_DEALS: DealItem[] = [
  {
    id: "1",
    category: "Restaurants",
    image: require("../../assets/images/placeholder-deal.jpg"),
    dealHeading: "Buy 2 main dishes",
    dealDescription: "& get 1 order of croquettes for free.",
    isFavorite: false,
  },
  {
    id: "2",
    category: "Shopping",
    image: require("../../assets/images/placeholder-deal2.jpg"),
    dealHeading: "Nationwide Fast Food Deals",
    dealDescription: "Exclusive coupons, $6 Big Box & BOGO 50% Off.",
    isFavorite: true,
  },
  {
    id: "3",
    category: "Groceries",
    image: require("../../assets/images/placeholder-deal3.jpg"),
    dealHeading: "Special Summer Treats",
    dealDescription: "Get $2.50 Slush Floats & 1/2 Price Drinks all summer.",
    isFavorite: false,
  },
  {
    id: "4",
    category: "Electronics",
    image: require("../../assets/images/placeholder-deal.jpg"),
    dealHeading: "Smart Tech & Gadgets Discount",
    dealDescription: "Up to 35% off on smart accessories & audio gear.",
    isFavorite: false,
  },
  {
    id: "5",
    category: "Beauty",
    image: require("../../assets/images/placeholder-deal2.jpg"),
    dealHeading: "Burger & Fries 50% Discount",
    dealDescription: "Complimentary burger and fries with cold drinks.",
    isFavorite: true,
  },
];
