// Assessment.tsx
import AssessmentCard from "@/components/AssessmentCard";
import CustomHeader from "@/components/CustomHeader";
import ResponsiveText from "@/components/ResponsiveText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Add this import
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  BackHandler,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const Assessment = () => {
  const { t } = useTranslation();
  const [statuses, setStatuses] = useState<
    Record<string, "Locked" | "Unlocked" | "Passed">
  >({});
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const [showExitModal, setShowExitModal] = useState(false);
  
  const scale = width / 375;
  const isTablet = width >= 768;

  // Handle back button press on Android only when screen is focused
  useFocusEffect(
    React.useCallback(() => {
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

  // List of assessments
  const testList = [
    { key: "beliefs", title: t("assessment.cards.beliefs"), route: "/Assessment/beliefs/multiple" },
    { key: "festivals", title: t("assessment.cards.festivals"), route: "/Assessment/festivals/multiple" },
    { key: "religion", title: t("assessment.cards.religion"), route: "/Assessment/religion/multiple" },
    { key: "grammar", title: t("assessment.cards.grammar"), route: "/Assessment/grammar/matching" },
    { key: "vocabulary", title: t("assessment.cards.vocabulary"), route: "/Assessment/vocabulary/matching" },
    { key: "alphabets", title: t("assessment.cards.alphabets"), route: "/Assessment/alphabets/matching" },
  ];

  // Load progress from AsyncStorage
  const loadStatuses = async () => {
    let newStatuses: typeof statuses = {};
    for (let i = 0; i < testList.length; i++) {
      const { key } = testList[i];
      const scoreStr = await AsyncStorage.getItem(`score_${key}`);
      const totalStr = await AsyncStorage.getItem(`total_${key}`);
      let isPassed = false;

      if (scoreStr && totalStr) {
        const score = Number(scoreStr);
        const total = Number(totalStr);
        const percent = (score / total) * 100;
        if (percent >= 75) isPassed = true;
      }

      if (isPassed) {
        newStatuses[key] = "Passed";
      } else if (i === 0 || newStatuses[testList[i - 1].key] === "Passed") {
        newStatuses[key] = "Unlocked";
      } else {
        newStatuses[key] = "Locked";
      }
    }
    setStatuses(newStatuses);
  };

  useEffect(() => {
    loadStatuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress bar animation
  const passedCount = Object.values(statuses).filter((s) => s === "Passed").length;
  const progressPercent = (passedCount / testList.length) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressPercent]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FDF7E3" }}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }} 
      />

      {/* Header */}
      <View style={{ backgroundColor: "#FDF7E3" }}>
        <CustomHeader
          title={t("assessment.title")}
          style={{
            paddingVertical: isTablet ? 16 : 12,
          }}
        />
      </View>

      {/* Intro */}
      <View style={{ backgroundColor: "white" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: isTablet ? 14 : Math.min(Math.round(12 * scale), 14),
            lineHeight: isTablet ? 20 : Math.min(Math.round(18 * scale), 20),
            color: "#374151",
            paddingVertical: isTablet ? 12 : 6 * scale,
            paddingHorizontal: isTablet ? 16 : 8 * scale,
          }}
        >
          {t("assessment.introText")}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={{
          paddingHorizontal: isTablet ? 40 : 16 * scale,
          marginTop: isTablet ? 20 : 14 * scale,
          paddingBottom: isTablet ? 30 : 30 * scale,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: isTablet ? 16 : Math.min(Math.round(14 * scale), 16),
            color: "#555",
            marginBottom: isTablet ? 8 : 6 * scale,
          }}
        >
          {t("assessment.progress")}: {passedCount} / {testList.length}
        </Text>

        <View
          style={{
            height: isTablet ? 16 : 14 * scale,
            backgroundColor: "#ddd",
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              height: "100%",
            }}
          >
            <LinearGradient
              colors={["#E9A924", "#FFD65A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
      </View>

      {/* Assessment cards */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: isTablet ? 8 : 5 * scale,
          paddingHorizontal: isTablet ? 36 : 10 * scale,
          paddingBottom: isTablet ? 100 : 90 * scale,
          flexDirection: isTablet ? "row" : "column",
          flexWrap: isTablet ? "wrap" : "nowrap",
          justifyContent: isTablet ? "space-between" : "flex-start",
        }}
      >
        {testList.map((test, index) => (
          <View
            key={index}
            style={{
              width: isTablet ? "48%" : "100%",
              marginBottom: isTablet ? 16 : 12 * scale,
            }}
          >
            <AssessmentCard
              title={test.title}
              status={statuses[test.key] || "Locked"}
              onPress={() => {
                if (statuses[test.key] !== "Locked") {
                  router.push(test.route as any);
                }
              }}
              buttonText={t("assessment.buttonStart")}
            />
          </View>
        ))}
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
};

export default Assessment;