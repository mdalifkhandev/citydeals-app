import { Redirect, useLocalSearchParams } from "expo-router";

export default function SharedDealRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Redirect
      href={{
        pathname: "/screens/coupon-details",
        params: { id: id || "1" },
      }}
    />
  );
}
