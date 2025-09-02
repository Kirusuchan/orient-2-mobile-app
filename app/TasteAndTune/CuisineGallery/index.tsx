import CustomHeader from '@/components/CustomHeader';
import { dishes } from '@/data/dishes';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function CuisineGallery() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  // ✅ base scaling (iPhone 12 width = 390)
  const scale = width / 390;
  const isTablet = width >= 768; // ✅ treat >= 768px as tablet

  const getHeight = (size = 'normal') => {
    const base = isTablet ? 140 * scale : 100 * scale; // ✅ taller on tablets
    switch (size) {
      case 'tall':
        return base * (isTablet ? 2.2 : 2);
      case 'triple':
        return base * (isTablet ? 3.4 : 3.15);
      case 'full':
        return base * (isTablet ? 2.3 : 2);
      case 'wide':
        return base * (isTablet ? 1.5 : 1.2);
      default:
        return base * 1;
    }
  };

  const normalDishes: typeof dishes = [];
  const fullDishes: typeof dishes = [];

  for (const dish of dishes) {
    if (dish.size === 'full') {
      fullDishes.push(dish);
    } else {
      normalDishes.push(dish);
    }
  }

  // ✅ distribute evenly into two columns
  const leftColumn: typeof dishes = [];
  const rightColumn: typeof dishes = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const dish of normalDishes) {
    const height = getHeight(dish.size);
    if (leftHeight <= rightHeight) {
      leftColumn.push(dish);
      leftHeight += height;
    } else {
      rightColumn.push(dish);
      rightHeight += height;
    }
  }

  return (
    <View className="flex-1 bg-[#fefae0]">
      <CustomHeader
        title={t("cuisineGallery.title")}
        fontSize={isTablet ? 34 : 28 * scale} // ✅ bigger on tablets
        showBackButton
        backButtonColor="#ffffffff"
        onBackPress={() => router.back()}
      />

      {/* Intro text */}
      <View
        className="px-4 py-3 bg-white"
        style={{ marginHorizontal: isTablet ? 24 : 0 }}
      >
        <Text
          style={{
            fontSize: isTablet ? 16 : 10 * scale,
            lineHeight: isTablet ? 22 : 14 * scale,
            fontFamily: 'Segoe UI',
            textAlign: 'center',
            color: '#374151',
            paddingHorizontal: isTablet ? 20 : 0,
          }}
        >
          {t("cuisineGallery.intro")}
        </Text>
      </View>

      <ScrollView className="flex-1 bg-[#fefae0]">
        <View
          className="pb-10 mt-4"
          style={{
            paddingHorizontal: isTablet ? 24 : 12, // ✅ wider padding on tablet
          }}
        >
          {/* Full-width dishes */}
          {fullDishes.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              onPress={() =>
                router.push(`/TasteAndTune/CuisineGallery/${dish.id}`)
              }
              className="rounded-2xl overflow-hidden shadow-md bg-white mb-2"
              style={{
                height: getHeight(dish.size),
                width: '100%',
              }}
            >
              <Image
                source={dish.image}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}

          {/* Two-column layout */}
          <View className="flex-row gap-x-2">
            <View className="flex-1 gap-y-2">
              {leftColumn.map((dish) => (
                <TouchableOpacity
                  key={dish.id}
                  onPress={() =>
                    router.push(`/TasteAndTune/CuisineGallery/${dish.id}`)
                  }
                  className="rounded-2xl overflow-hidden shadow-md bg-white"
                  style={{ height: getHeight(dish.size) }}
                >
                  <Image
                    source={dish.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-1 gap-y-2">
              {rightColumn.map((dish) => (
                <TouchableOpacity
                  key={dish.id}
                  onPress={() =>
                    router.push(`/TasteAndTune/CuisineGallery/${dish.id}`)
                  }
                  className="rounded-2xl overflow-hidden shadow-md bg-white"
                  style={{ height: getHeight(dish.size) }}
                >
                  <Image
                    source={dish.image}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
