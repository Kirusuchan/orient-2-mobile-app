import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HomeCardProps = {
  title: string;
  kulitantext: string;
  description: string;
  image: ImageSourcePropType;
  buttonText: string;
  onPress?: () => void;
};

export default function HomeCard({
  title,
  kulitantext,
  description,
  image,
  buttonText,
  onPress,
}: HomeCardProps) {
  return (
    <View className="bg-white rounded-2xl shadow-md overflow-hidden mt-6 mx-5">
      {/* Header Area */}
      <View className="bg-[#E6A817] p-4 relative overflow-hidden">
        <Image
          source={image}
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 120,
            width: "100%",
            height: "200%",
          }}
        />
        <Text
          className="text-white text-3xl text-center -mb-1"
          style={{
            fontFamily: "SegoeUIBlack",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {title}
        </Text>
        <Text
          className="text-white text-3xl text-center -mb-3 pt-3"
          style={{
            fontFamily: "Kulitan",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {kulitantext}
        </Text>
      </View>

      {/* Description and Button */}
      <View
        className="p-5 flex flex-row justify-between items-end"
        style={{ minHeight: 105 }} // keeps section uniform
      >
        {/* Fixed description box */}
        <Text
          className="text-gray-700 text-xs flex-1 mr-9"
          numberOfLines={6}
          ellipsizeMode="tail"
          style={{
            fontFamily: "SegoeUI",
            minHeight: 60, // all descriptions same height
          }}
        >
          {description}
        </Text>

        <TouchableOpacity
          className="px-4 py-2 rounded-full w-32 self-center"
          style={{ backgroundColor: "#E6A817" }}
          onPress={onPress}
        >
          <Text
            className="text-white text-center"
            style={{ fontFamily: "SegoeUIBlack" }}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
