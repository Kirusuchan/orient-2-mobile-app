import CustomBackButton from "@/components/CustomBackButton";
import LanguageCard from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

const Index = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { t } = useTranslation();

  // scale text for phone vs tablet
  const headingFont = isTablet ? 18 : 14;
  const bodyFont = isTablet ? 16 : 13;

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "#FDF7E3",
          },
          headerLeft: () => <CustomBackButton color="#000" />,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 0,
          paddingHorizontal: isTablet ? 20 : 10,
          paddingBottom: 40,
        }}
      >
        {/* Intro */}
        <View className="px-6">
          <Text
            className="text-gray-700 text-justify font-semibold mb-3"
            style={{ fontSize: headingFont, lineHeight: headingFont * 1.4 }}
          >
            {t("language.introTitle")}
          </Text>

          <Text
            className="text-gray-700 text-justify"
            style={{ fontSize: bodyFont, lineHeight: bodyFont * 1.5 }}
          >
            {t("language.introText")}
          </Text>
        </View>

        {/* Cards */}
        <LanguageCard
          title={t("language.cards.grammar.title")}
          description={t("language.cards.grammar.description")}
          image={images.languagecardlogo}
          onPress={() => router.push("/KapampanganLanguage/grammarM")}
        />

        <LanguageCard
          title={t("language.cards.vocab.title")}
          description={t("language.cards.vocab.description")}
          image={images.languagecardlogo}
          onPress={() => router.push("/KapampanganLanguage/vocabM")}
        />

        <LanguageCard
          title={t("language.cards.alphabet.title")}
          description={t("language.cards.alphabet.description")}
          image={images.languagecardlogo}
          onPress={() => router.push("/KapampanganLanguage/alphabetsM")}
        />
      </ScrollView>
    </View>
  );
};

export default Index;
