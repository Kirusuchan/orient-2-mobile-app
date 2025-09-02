// components/SearchBar.tsx
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  value: string; // Add value prop
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { shortEdge, isTablet } = useResponsive();
  const { t } = useTranslation();

  // ✅ responsive values
  const fontSize = isTablet ? 20 : shortEdge * 0.04;
  const paddingVertical = isTablet ? 12 : shortEdge * 0.025;
  const paddingHorizontal = isTablet ? 20 : shortEdge * 0.04;

  return (
    <View
      className="px-4 pt-6 pb-2"
      style={{
        backgroundColor: "#FDF7E3", // ✅ matches your screen background
      }}
    >
      <TextInput
        value={value} // Add value prop
        placeholder={t("common.search")} 
        onChangeText={onChange}
        placeholderTextColor="#888"
        style={{
          backgroundColor: "white",
          borderRadius: 9999, // full rounded
          fontSize,
          paddingVertical,
          paddingHorizontal,
          color: "#374151", // text-gray-700
          // ✅ shadow styles
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3, 
        }}
      />
    </View>
  );
}