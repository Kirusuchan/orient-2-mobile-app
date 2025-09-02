import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const shortEdge = Math.min(width, height);

  return useMemo(() => ({
    width,
    height,
    shortEdge,
    isPortrait: height >= width,
    isTablet: shortEdge >= 768,   // tablet breakpoint
    isDesktop: shortEdge >= 1024, // larger screens
    scale,
    fontScale,
    platform: Platform.OS as "ios" | "android" | "web",
  }), [width, height, shortEdge, scale, fontScale]);
}
