import CustomHeader from "@/components/CustomHeader";
import ResponsiveText from "@/components/ResponsiveText";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, TouchableOpacity, View, useWindowDimensions } from "react-native";

const FestivalAndTradition = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { width } = useWindowDimensions(); 
  const isTablet = width >= 768; 

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setShowScrollTop(yOffset > 150); 
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View className="flex-1 bg-amber-100">
      <CustomHeader
        title={t("festival.title")}
        fontSize={isTablet ? 34 : 25}
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: width * 0.04,
          paddingBottom: 20,
        }}
        className="bg-amber-50"
      >
        {/* Intro Box */}
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: -width * 0.04,
            paddingVertical: isTablet ? 18 : 10,
            paddingHorizontal: isTablet ? 20 : 12,
          }}
        >
          <ResponsiveText
            baseSize={isTablet ? 16 : 12}
            style={{
              textAlign: "center",
              lineHeight: isTablet ? 26 : 20,
              color: "#374151",
            }}
          >
            {t("festival.intro")}
          </ResponsiveText>
        </View>

        {/* --- Kuraldal --- */}
        <ResponsiveText
          baseSize={isTablet ? 24 : 18}
          style={{ fontWeight: "bold", marginTop: 20, marginBottom: 6 }}
        >
          {t("festival.kuraldal.title")}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            textAlign: "justify",
            color: "#111827",
            lineHeight: isTablet ? 28 : 22,
            marginBottom: 16,
          }}
        >
          {t("festival.kuraldal.desc")}
        </ResponsiveText>

        <View className="items-center mb-6">
          <Image
            source={images.kuraldal}
            style={{
              width: width * (isTablet ? 0.7 : 0.85),
              height: width * (isTablet ? 0.5 : 0.55),
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
          <ResponsiveText
            baseSize={isTablet ? 14 : 10}
            style={{
              color: "#6b7280",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {t("festival.kuraldal.imageSource")}
          </ResponsiveText>
        </View>

        {/* --- Aguman Sanduk --- */}
        <ResponsiveText
          baseSize={isTablet ? 24 : 18}
          style={{ fontWeight: "bold", marginBottom: 6 }}
        >
          {t("festival.aguman.title")}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            textAlign: "justify",
            color: "#111827",
            lineHeight: isTablet ? 28 : 22,
            marginBottom: 16,
          }}
        >
          {t("festival.aguman.desc")}
        </ResponsiveText>

        <View className="items-center mb-6">
          <Image
            source={images.aguman}
            style={{
              width: width * (isTablet ? 0.7 : 0.85),
              height: width * (isTablet ? 0.5 : 0.55),
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
          <ResponsiveText
            baseSize={isTablet ? 14 : 10}
            style={{
              color: "#6b7280",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {t("festival.aguman.imageSource")}
          </ResponsiveText>
        </View>

        {/* --- Batalla Festival --- */}
        <ResponsiveText
          baseSize={isTablet ? 24 : 18}
          style={{ fontWeight: "bold", marginBottom: 6 }}
        >
          {t("festival.batalla.title")}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            textAlign: "justify",
            color: "#111827",
            lineHeight: isTablet ? 28 : 22,
            marginBottom: 16,
          }}
        >
          {t("festival.batalla.desc")}
        </ResponsiveText>

        {/* --- Piestang Danum --- */}
        <ResponsiveText
          baseSize={isTablet ? 24 : 18}
          style={{ fontWeight: "bold", marginBottom: 6 }}
        >
          {t("festival.danum.title")}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            textAlign: "justify",
            color: "#111827",
            lineHeight: isTablet ? 28 : 22,
            marginBottom: 16,
          }}
        >
          {t("festival.danum.desc")}
        </ResponsiveText>
        <View className="items-center mb-6">
          <Image
            source={images.apung}
            style={{
              width: width * (isTablet ? 0.7 : 0.85),
              height: width * (isTablet ? 0.5 : 0.55),
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
          <ResponsiveText
            baseSize={isTablet ? 14 : 10}
            style={{
              color: "#6b7280",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {t("festival.apung.imageSource")}
          </ResponsiveText>
        </View>
        {/* --- Apung Iru --- */}
        <ResponsiveText
          baseSize={isTablet ? 24 : 18}
          style={{ fontWeight: "bold", marginBottom: 6 }}
        >
          {t("festival.apung.title")}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            textAlign: "justify",
            color: "#111827",
            lineHeight: isTablet ? 28 : 22,
            marginBottom: 16,
          }}
        >
          {t("festival.apung.desc")}
        </ResponsiveText>
      </ScrollView>

      {/* Floating Scroll-to-top button */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: "#E6A817",
            padding: width * 0.035,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons
            name="chevron-up"
            size={Math.round(width * 0.06)}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FestivalAndTradition;
