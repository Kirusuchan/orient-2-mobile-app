import CustomBackButton from "@/components/CustomBackButton";
import LanguageCard from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

const Index = () => {
  const { width } = useWindowDimensions();
  const scale = width / 390; // Base scaling (iPhone 12 width)

  const isTablet = width >= 768; // Tablet breakpoint

  const { t } = useTranslation();

  return (
    <View className="flex-1" style={{ backgroundColor: "#FDF7E3" }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FDF7E3" },
          headerLeft: () => <CustomBackButton color="#000000ff" />,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 0,
          paddingHorizontal: isTablet ? 20 : 5,
          paddingBottom: 40,
        }}
      >
        {/* Intro text */}
        <View style={{ paddingHorizontal: isTablet ? 30 : 10 }}>
          <Text
            style={{
              fontSize: isTablet ? 22 : 16 * scale,
              lineHeight: isTablet ? 30 : 22 * scale,
              color: "#374151",
              textAlign: "justify",
              paddingTop: 4,
              marginBottom: 12,
              fontWeight: "700",
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            {t("tasteAndTune.introTitle")}
          </Text>

          <Text
            style={{
              fontSize: isTablet ? 18 : 15 * scale,
              lineHeight: isTablet ? 26 : 22 * scale,
              color: "#374151",
              textAlign: "justify",
              paddingTop: 4,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            {t("tasteAndTune.introText")}
          </Text>
        </View>

        {/* Cards */}
        <LanguageCard
          title={t("tasteAndTune.folkSongsTitle")}
          image={images.tasteandtunelogo}
          centerHeaderText
          imageOffset={5}
          description={t("tasteAndTune.folkSongsDescription")}
          titleStyle={{
            fontSize: isTablet ? 24 : 20 * scale,
          }}
          descriptionStyle={{
            fontSize: isTablet ? 16 : 14 * scale,
            lineHeight: isTablet ? 24 : 20 * scale,
          }}
          buttonText={t("common.learn")}
          onPress={() => router.push("/TasteAndTune/FolkSongsLibrary")}
        />

        <LanguageCard
          title={t("tasteAndTune.cuisineTitle")}
          image={images.tasteandtunelogo}
          centerHeaderText
          imageOffset={5}
          description={t("tasteAndTune.cuisineDescription")}
          titleStyle={{
            fontSize: isTablet ? 24 : 20 * scale,
          }}
          descriptionStyle={{
            fontSize: isTablet ? 16 : 14 * scale,
            lineHeight: isTablet ? 24 : 20 * scale,
          }}
          buttonText={t("common.learn")}  
          onPress={() => router.push("/TasteAndTune/CuisineGallery")}
        />
      </ScrollView>
    </View>
  );
};

export default Index;