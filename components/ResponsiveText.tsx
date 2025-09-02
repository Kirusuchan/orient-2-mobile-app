import React from "react";
import { Text, TextProps, useWindowDimensions } from "react-native";

interface ResponsiveTextProps extends TextProps {
  children: React.ReactNode;
  baseSize: number; // the "design size" (like 16, 18, 22, etc.)
}

export default function ResponsiveText({ children, baseSize, style, ...props }: ResponsiveTextProps) {
  const { width } = useWindowDimensions();

  // scale relative to a 375px base width (iPhone X-ish)
  const scale = width / 375;
  const fontSize = Math.round(baseSize * scale);

  return (
    <Text
      {...props}
      style={[{ fontSize }, style]}
    >
      {children}
    </Text>
  );
}
