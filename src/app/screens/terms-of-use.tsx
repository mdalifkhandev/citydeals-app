import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import CurvedHeader from "../../components/CurvedHeader";
import { useTermsOfUse } from "../../features/legal/hooks/useLegal";

interface Section {
  title?: string;
  body: string;
}

export default function TermsOfUseScreen() {
  const {
    data: terms,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useTermsOfUse();

  const formattedDate = useMemo(() => {
    if (!terms?.updatedAt) return "Recently Updated";
    try {
      const d = new Date(terms.updatedAt);
      return `Last updated: ${d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`;
    } catch {
      return "Recently Updated";
    }
  }, [terms?.updatedAt]);

  const parsedSections = useMemo<Section[]>(() => {
    if (!terms?.content) return [];

    const rawParagraphs = terms.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    const sections: Section[] = [];

    for (const paragraph of rawParagraphs) {
      if (paragraph.startsWith("#")) {
        const lines = paragraph.split("\n");
        const titleLine = lines[0].replace(/^#+\s*/, "").trim();
        const bodyText = lines.slice(1).join("\n").trim();
        sections.push({ title: titleLine, body: bodyText || titleLine });
      } else {
        const lines = paragraph.split("\n");
        const firstLine = lines[0].trim();
        const isHeaderLike =
          /^\d+\.\s+[A-Za-z0-9\s&/'-]+$/.test(firstLine) ||
          (firstLine.length < 50 && lines.length > 1);

        if (isHeaderLike && lines.length > 1) {
          sections.push({
            title: firstLine,
            body: lines.slice(1).join("\n").trim(),
          });
        } else {
          sections.push({ body: paragraph });
        }
      }
    }

    return sections;
  }, [terms?.content]);

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="light" />

      {/* Curved Navy Top Header */}
      <CurvedHeader title={terms?.title || "Terms of Use"} showBackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#ea580c"
            colors={["#ea580c"]}
          />
        }
      >
        <View className="bg-white rounded-3xl p-5 mx-4 mt-6 border border-neutral-100 shadow-xs">
          {/* Header Badges */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="self-start bg-orange-50 border border-orange-200/60 px-3.5 py-1.5 rounded-full">
              <Text className="text-orange-600 font-bold text-xs">
                {formattedDate}
              </Text>
            </View>
            {terms?.version && (
              <View className="bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-full">
                <Text className="text-neutral-600 font-semibold text-xs">
                  v{terms.version}
                </Text>
              </View>
            )}
          </View>

          {/* Loading State */}
          {isLoading && !isRefetching && (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#ea580c" />
              <Text className="text-neutral-500 text-sm mt-3 font-medium">
                Loading terms & conditions...
              </Text>
            </View>
          )}

          {/* Error State */}
          {isError && !isLoading && (
            <View className="py-12 items-center justify-center px-4">
              <View className="w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mb-3 border border-red-100">
                <Feather name="alert-circle" size={26} color="#ef4444" />
              </View>
              <Text className="text-neutral-800 font-bold text-base text-center">
                Unable to load terms
              </Text>
              <Text className="text-neutral-500 text-sm text-center mt-1 mb-5">
                Please check your network connection and try again.
              </Text>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-orange-500 px-5 py-2.5 rounded-xl flex-row items-center"
                activeOpacity={0.8}
              >
                <Feather name="refresh-cw" size={14} color="#ffffff" />
                <Text className="text-white font-bold text-sm ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content Loaded */}
          {!isLoading && !isError && (
            <>
              <Text className="text-neutral-600 text-sm leading-6 mb-6">
                Please read these terms and conditions carefully before using
                the CityDeals application. By accessing or using the platform,
                you agree to be bound by these terms.
              </Text>

              {parsedSections.map((sec, index) => (
                <View key={index} className="mb-6 last:mb-2">
                  {sec.title && (
                    <Text className="text-neutral-900 font-extrabold text-base mb-2">
                      {sec.title}
                    </Text>
                  )}
                  <Text className="text-neutral-600 text-sm leading-6">
                    {sec.body}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Contact Support Assistance Card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-neutral-100 flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3.5 border border-orange-100">
            <Feather name="help-circle" size={20} color="#ea580c" />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-900 font-bold text-sm">
              Questions about our Terms?
            </Text>
            <Text className="text-neutral-500 text-xs mt-0.5">
              Contact us at support@citydeals.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
