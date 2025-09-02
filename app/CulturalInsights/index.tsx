import CustomBackButton from "@/components/CustomBackButton";
import LanguageCard from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

const Index = () => {
  const { t } = useTranslation();

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
          paddingHorizontal: 5,
          paddingBottom: 35,
        }}
      >
        <View className="px-12">
          <Text
            className=" text-justify pt-1 mb-3"
            style={{ fontFamily: "SegoeUIBold" }}
          >
            {t("culturalInsights.introTitle")}
          </Text>

          <Text
            className=" text-justify pt-1"
            style={{ fontFamily: "SegoeUI" }}
          >
            {t("culturalInsights.introText")}
          </Text>
        </View>

        {/* Cards */}
        <LanguageCard
          title={t("culturalInsights.beliefsTitle")}  
          image={images.culturalinsightlogo}
          subtitle={t("culturalInsights.beliefsSubtitle")}
          centerHeaderText
          imageOffset={5}
          description={t("culturalInsights.beliefsDescription")}
          buttonText={t("common.learn")}
          onPress={() =>
            router.push("/CulturalInsights/BeliefsAndPractices")
          }
        />

        <LanguageCard
          title={t("culturalInsights.festivalTitle")}  
          image={images.culturalinsightlogo}
          subtitle={t("culturalInsights.festivalSubtitle")}
          centerHeaderText
          imageOffset={5}
          description={t("culturalInsights.festivalDescription")}
          buttonText={t("common.learn")}
          onPress={() =>
            router.push("/CulturalInsights/FestivalAndTradition")
          }
        />

        <LanguageCard
          title={t("culturalInsights.indigenousTitle")}
          image={images.culturalinsightlogo}
          subtitle={t("culturalInsights.indigenousSubtitle")}
          centerHeaderText
          imageOffset={5}
          description={t("culturalInsights.indigenousDescription")}
          buttonText={t("common.learn")}
          onPress={() =>
            router.push("/CulturalInsights/IndegenousReligion")
          }
        />
      </ScrollView>
    </View>
  );
};
export default Index;
