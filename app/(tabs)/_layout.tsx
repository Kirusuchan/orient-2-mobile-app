import { icons } from "@/constants/icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const tabCount = 4;

// base values
const baseMargin = 30;
const baseHeight = 60;
const baseRadius = 30;
const baseIcon = 20;
const basePadding = 12;


const TabIcon = ({
  focused,
  icon,
  tabName,
  scale,
}: {
  focused: boolean;
  icon: any;
  tabName: string;
  scale: number;
}) => {
  let translateX = 0;
  if (focused) {
    if (tabName === "index") translateX = 17;
    else if (tabName === "about") translateX = -17;
  }

  return (
    <View
      className="items-center justify-center"
      style={{
        transform: [
          { translateY: focused ? -15 * scale : 8 * scale },
          { translateX },
        ],
      }}
    >
      <View
        style={{
          backgroundColor: "#E6A817",
          padding: basePadding * scale,
          borderRadius: 9999,
        }}
      >
        <Image
          source={icon}
          style={{ width: baseIcon * scale, height: baseIcon * scale }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

// ---------------- SVG Background ----------------
const getSvgPath = (
  focusedIndex: number,
  barWidth: number,
  tabBarHeight: number,
  barRadius: number
): { path: string } => {
  const tabWidth = barWidth / tabCount;
  const widerTabs = [0, 3];
  const isWide = widerTabs.includes(focusedIndex);

  const notchWidth = isWide ? 90 : 60;
  const notchDepth = 36;
  const curveControl = 30;
  const cornerRadius = barRadius;

  const notchCenter = tabWidth * focusedIndex + tabWidth / 2;
  const notchLeft = Math.max(notchCenter - notchWidth / 2, curveControl);
  const notchRight = Math.min(
    notchCenter + notchWidth / 2,
    barWidth - curveControl
  );

  const removeTopLeft = focusedIndex === 0;
  const removeTopRight = focusedIndex === 3;

  const topLeftRadius = removeTopLeft ? 0 : cornerRadius;
  const topRightRadius = removeTopRight ? 0 : cornerRadius;

  return {
    path: `
      M${topLeftRadius},0
      H${notchLeft - curveControl}
      C${notchLeft},0 ${notchLeft},${notchDepth} ${
      notchLeft + curveControl
    },${notchDepth}
      H${notchRight - curveControl}
      C${notchRight},${notchDepth} ${notchRight},0 ${
      notchRight + curveControl
    },0
      H${barWidth - topRightRadius}
      ${
        topRightRadius > 0
          ? `A${topRightRadius},${topRightRadius} 0 0 1 ${barWidth},${topRightRadius}`
          : ""
      }
      V${tabBarHeight - cornerRadius}
      A${cornerRadius},${cornerRadius} 0 0 1 ${
      barWidth - cornerRadius
    },${tabBarHeight}
      H${cornerRadius}
      A${cornerRadius},${cornerRadius} 0 0 1 0,${
      tabBarHeight - cornerRadius
    }
      V${topLeftRadius > 0 ? topLeftRadius : 0}
      ${
        topLeftRadius > 0
          ? `A${topLeftRadius},${topLeftRadius} 0 0 1 ${topLeftRadius},0`
          : ""
      }
      Z
    `,
  };
};

const CustomTabBarBackground = ({
  index,
  layoutWidth,
  cardHorizontalMargin,
  tabBarHeight,
  barRadius,
}: {
  index: number;
  layoutWidth: number;
  cardHorizontalMargin: number;
  tabBarHeight: number;
  barRadius: number;
}) => {
  const barWidth = layoutWidth - cardHorizontalMargin * 2;
  const { path } = getSvgPath(index, barWidth, tabBarHeight, barRadius);

  return (
    <Svg
      width={barWidth}
      height={tabBarHeight}
      viewBox={`0 0 ${barWidth} ${tabBarHeight}`}
      style={{
        position: "absolute",
        bottom: 0,
        left: (layoutWidth - barWidth) / 2,
        zIndex: 0,
        overflow: "visible",
      }}
    >
      <Path d={path} fill="#E6A817" />
    </Svg>
  );
};

// ---------------- MOBILE NAVBAR ----------------
const MobileTabs = () => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const scale = screenWidth / 375;
  const cardHorizontalMargin = baseMargin * scale;
  const tabBarHeight = baseHeight * scale;
  const barRadius = baseRadius * scale;
  const rawTabBarHeight = baseHeight * scale;

  return (
    <Tabs
      screenOptions={({ route, navigation }) => {
        const state = navigation.getState();
        const focusedIndex =
          state?.routes?.findIndex((r) => r.key === route.key) ?? 0;

        return {
          tabBarShowLabel: true,
          tabBarLabel: ({ focused }) => {
            let translateX = 0;
            if (focused) {
              if (route.name === "index") translateX = 17;
              else if (route.name === "about") translateX = -12;
            }

            return (
              <Text
                style={{
                  fontSize: 10 * scale,
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: 5 * scale,
                  maxWidth: 80 * scale,
                  color: "black",
                  transform: [{ translateX }],
                }}
              >
                {t(`nav.${route.name === "index" ? "home" : route.name}`)}
              </Text>
            );
          },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          bottom: 35, 
          height: rawTabBarHeight, 
          borderRadius: barRadius,
          elevation: 0,
          overflow: "visible",
          borderTopWidth: 0,
          zIndex: 10,
          paddingHorizontal: cardHorizontalMargin,
          paddingBottom: insets.bottom > 0 ? insets.bottom * 0.3 : 0, 
        },
        tabBarBackground: () => (
          <CustomTabBarBackground
            index={focusedIndex}
            layoutWidth={screenWidth}
            cardHorizontalMargin={cardHorizontalMargin}
            tabBarHeight={rawTabBarHeight}  // ✅ don’t stretch
            barRadius={barRadius}
          />
        ),
        };
      }}
    >
      {[
        { name: "index", title: "Home", icon: icons.home },
        { name: "assessment", title: "Assessment", icon: icons.assessment },
        { name: "settings", title: "Settings", icon: icons.settings },
        { name: "about", title: "About", icon: icons.about },
      ].map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={tab.icon}
                tabName={tab.name}
                scale={scale}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};


// ---------------- TABLET NAVBAR ----------------
const TabletTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const tabs = [
    { name: "index", title: t("nav.home"), icon: icons.home },
    { name: "assessment", title: t("nav.assessment"), icon: icons.assessment },
    { name: "settings", title: t("nav.settings"), icon: icons.settings },
    { name: "about", title: t("nav.about"), icon: icons.about },
  ] as const;

  // ✅ strict mapping to prevent TS errors
  const tabRoutes = {
    index: "/(tabs)" as const,
    assessment: "/(tabs)/assessment" as const,
    settings: "/(tabs)/settings" as const,
    about: "/(tabs)/about" as const,
  };

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar */}
      {isSidebarOpen && (
        <View className="w-48 bg-[#E6A817] py-10">
          {/* App title */}
          <Text className="text-2xl font-extrabold text-white text-center mb-10">
            ORIENT 2
          </Text>

          {tabs.map((tab) => {
            const isActive =
              (tab.name === "index" && pathname === "/(tabs)") ||
              pathname === tabRoutes[tab.name];

            return (
              <Pressable
                key={tab.name}
                className={`flex-row items-center w-full px-4 py-3 my-2 rounded-xl ${
                  isActive ? "bg-black/20" : "bg-transparent"
                }`}
                onPress={() => {
                  router.replace(tabRoutes[tab.name]);
                  setIsSidebarOpen(false);
                }}
              >
                <Image
                  source={tab.icon}
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: isActive ? "#fff" : "#333",
                  }}
                  resizeMode="contain"
                />
                <Text
                  className="ml-3 font-semibold text-base"
                  style={{ color: isActive ? "#fff" : "#333" }}
                >
                  {tab.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Main content */}
      <View className="flex-1 bg-white">
        {/* Top bar with hamburger */}
        <View className="h-14 bg-[#E6A817] flex-row items-center px-4">
          <Pressable onPress={() => setIsSidebarOpen((prev) => !prev)}>
            <Text className="text-xl font-bold text-white">☰</Text>
          </Pressable>
          <Text className="ml-4 text-lg font-semibold text-white">
            {tabs.find((t) =>
              pathname === "/(tabs)"
                ? t.name === "index"
                : pathname === tabRoutes[t.name]
            )?.title || "ORIENT 2"}
          </Text>
        </View>

        {/* Hidden bottom nav */}
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          {tabs.map((tab) => (
            <Tabs.Screen key={tab.name} name={tab.name} />
          ))}
        </Tabs>
      </View>
    </View>
  );
};

// ---------------- LAYOUT SWITCH ----------------
export default function Layout() {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 500;

  return (
    <View className="flex-1 bg-white">
      {isWideScreen ? <TabletTabs /> : <MobileTabs />}
    </View>
  );
}
