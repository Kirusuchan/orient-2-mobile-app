  import HomeCard from "@/components/HomeCard";
import ResponsiveText from "@/components/ResponsiveText";
import { images } from "@/constants/images";
import { useFocusEffect } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Image,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

  function HomeContent() {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const [showExitModal, setShowExitModal] = useState(false);

    // Detect tablet (iPad / Surface Pro etc.)
    const isLargeScreen = width >= 768;
    const isTablet = width >= 768;

    // Handle back button press on Android only when screen is focused
    useFocusEffect(
      useCallback(() => {
        if (Platform.OS === "android") {
          const backAction = () => {
            setShowExitModal(true);
            return true;
          };

          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );

          return () => {
            backHandler.remove();
            setShowExitModal(false); // Hide modal when screen loses focus
          };
        }
      }, [])
    );

    // Handle exit confirmation
    const handleExit = () => {
      BackHandler.exitApp();
    };

    // Scale factor for spacing only
    const scale = width / 375;
    const logoSize = Math.round(40 * scale); // mobile only
    const baseHeight = 60;
    const tabBarHeight = baseHeight * scale;

    return (
      <View style={{ flex: 1, backgroundColor: "#FDF7E3" }}>
        <Stack.Screen 
          options={{ 
            headerShown: false,
            // Disable swipe back gesture on iOS
            gestureEnabled: false 
          }} 
        />

        {/* Greeting Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20 * scale,
            paddingTop: (isLargeScreen ? 24 : 40) * scale,
          }}
        >
          <View>
            <ResponsiveText
              baseSize={isLargeScreen ? 22 : 22}
              style={{
                color: "#5A4633",
                fontFamily: "SegoeUIBlack",
              }}
            >
              {t("home.greetingHi")}
            </ResponsiveText>

            <ResponsiveText
              baseSize={isLargeScreen ? 12 : 12}
              style={{
                color: "#8C7A6B",
                fontFamily: "SegoeUI",
                marginTop: 2 * scale,
              }}
            >
              {t("home.explorePrompt")}
            </ResponsiveText>
          </View>

          {/* Logo visible only on mobile */}
          {!isLargeScreen && (
            <Image
              source={images.logo}
              style={{
                width: logoSize,
                height: logoSize,
                resizeMode: "contain",
              }}
            />
          )}
        </View>

        {/* Cards Section */}
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10 * scale,
            paddingHorizontal: isLargeScreen ? 30 : 10 * scale,
            paddingBottom: tabBarHeight + insets.bottom + 30,
          }}
        >
          <HomeCard
            title={t("home.culturalInsightsTitle")}
            kulitantext={`Panimanman king Kultura`}
            description={t("home.culturalInsightsDescription")}
            image={images.homecardlogo}
            buttonText={t("home.buttonStart")}
            onPress={() => router.push("/CulturalInsights")}
          />

          <HomeCard
            title={t("home.tasteAndTuneTitle")}
            kulitantext={`Lasa ampong tugtug`}
            description={t("home.tasteAndTuneDescription")}
            image={images.homecardlogo}
            buttonText={t("home.buttonStart")}
            onPress={() => router.push("/TasteAndTune")}
          />

          <HomeCard
            title={t("home.languageTitle")}
            kulitantext={`Amanung Sisuan`}
            description={t("home.languageDescription")}
            image={images.homecardlogo}
            buttonText={t("home.buttonStart")}
            onPress={() => router.push("/KapampanganLanguage")}
          />
        </ScrollView>

        {/* Exit Confirmation Modal */}
        <Modal transparent visible={showExitModal} animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FDF7E3",
                padding: isTablet ? 30 : 20,
                borderRadius: 15,
                width: isTablet ? "70%" : "80%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <ResponsiveText
                baseSize={isTablet ? 22 : 18}
                style={{
                  fontFamily: "SegoeUI",
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {t("home.exitTitle")}
              </ResponsiveText>

              <ResponsiveText
                baseSize={isTablet ? 20 : 16}
                style={{
                  fontFamily: "SegoeUI",
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#444",
                }}
              >
                {t("home.exitMessage")}
              </ResponsiveText>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
                <TouchableOpacity
                  onPress={() => setShowExitModal(false)}
                  style={{
                    backgroundColor: "#BFBFBF",
                    paddingVertical: isTablet ? 12 : 10,
                    paddingHorizontal: isTablet ? 28 : 24,
                    borderRadius: 50,
                  }}
                >
                  <ResponsiveText
                    baseSize={isTablet ? 16 : 14}
                    style={{
                      color: "white",
                      fontFamily: "SegoeUI",
                      fontWeight: "bold",
                    }}
                  >
                    {t("home.cancel")}
                  </ResponsiveText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleExit}
                  style={{
                    backgroundColor: "#E6A817",
                    paddingVertical: isTablet ? 12 : 10,
                    paddingHorizontal: isTablet ? 28 : 24,
                    borderRadius: 50,
                  }}
                >
                  <ResponsiveText
                    baseSize={isTablet ? 16 : 14}
                    style={{
                      color: "white",
                      fontFamily: "SegoeUI",
                      fontWeight: "bold",
                    }}
                  >
                    {t("home.exit")}
                  </ResponsiveText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  export default function Index() {
    return <HomeContent />;
  }