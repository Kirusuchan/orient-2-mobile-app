// LanguageCard.tsx
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageSourcePropType,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

type LanguageCardProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  imageOffset?: number;
  subtitle?: string;
  centerHeaderText?: boolean;
  onPress?: () => void;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonText?: string;
  style?: ViewStyle;
};

export default function LanguageCard({
  title,
  description,
  image,
  imageOffset,
  subtitle,
  centerHeaderText,
  onPress,
  titleStyle,
  descriptionStyle,
  buttonText,
  style,
}: LanguageCardProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const scale = width / 390;

  return (
    <View 
      className="bg-white shadow-md overflow-hidden mt-6 mx-8 rounded-tr-2xl rounded-bl-2xl"
      style={[
        { 
          minHeight: isTablet ? 140 : 120 * scale, // Minimum height instead of fixed
        },
        style
      ]}
    >
      {/* Header with image */}
      <View className="bg-yellow-500 p-6 relative overflow-hidden">
        <Image
          source={image}
          className="absolute top-0 right-0 bottom-0"
          style={{ left: imageOffset ?? 192 }}
          resizeMode="cover"
        />

        <Text
          className={`text-white ${centerHeaderText ? "text-center" : "text-left"} -mb-1`}
          style={[
            {
              fontSize: 22,
              fontFamily: "SegoeUIBlack",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            className={`text-white mt-1 ${centerHeaderText ? "text-center" : "text-left"}`}
            style={{
              fontSize: 22,
              fontFamily: "Kulitan",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Description + Button */}
      <View className="p-4 flex-row justify-between items-start">
        <View className="flex-1 mr-4">
          <Text
            className="text-gray-700"
            style={[
              {
                fontSize: 12,
                fontFamily: "SegoeUI",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
                textShadowColor: "#fff",
                lineHeight: 18, // Better line spacing for readability
              },
              descriptionStyle,
            ]}
            numberOfLines={4} // Allow more lines for longer text
          >
            {description}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-yellow-500 px-4 py-2 rounded-full self-center"
          onPress={onPress}
          style={{ minWidth: 100 }} // Ensure button has consistent minimum width
        >
          <Text
            className="text-white text-center"
            style={{
              fontSize: 14,
              fontFamily: "SegoeUIBlack",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
              textShadowColor: "#000",
            }}
          >
            {buttonText || t("common.learnButton", "LEARN")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}