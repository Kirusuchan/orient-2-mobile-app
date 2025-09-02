import { dishes } from '@/data/dishes';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DishViewer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const scale = width / 390;
  const isTablet = width >= 768;

  // track content height for tablets
  const [contentHeight, setContentHeight] = useState(0);

  const COLLAPSED = SCREEN_HEIGHT - 50;
  const getExpandedHeight = () =>
    isTablet
      ? Math.min(contentHeight + 160, SCREEN_HEIGHT * 0.9) // tablet: fit content, max 90%
      : SCREEN_HEIGHT * 0.5; // mobile: fixed half

  const sheetY = useRef(new Animated.Value(COLLAPSED)).current;
  const dishIndex = dishes.findIndex((d) => d.id === id);
  const [currentIndex, setCurrentIndex] = useState(dishIndex >= 0 ? dishIndex : 0);
  const dish = dishes[currentIndex];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
      onPanResponderMove: (_, gesture) => {
        const newY = Math.max(getExpandedHeight(), Math.min(COLLAPSED + gesture.dy, COLLAPSED));
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_, gesture) => {
        const shouldExpand = gesture.dy < -50 || gesture.vy < -0.5;
        const shouldCollapse = gesture.dy > 50 || gesture.vy > 0.5;
        let toValue = (sheetY as any)._value;

        if (shouldExpand) toValue = getExpandedHeight();
        else if (shouldCollapse) toValue = COLLAPSED;

        Animated.spring(sheetY, {
          toValue,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  if (!dish) {
    return <Text style={{ textAlign: 'center', marginTop: 80 }}>Dish not found</Text>;
  }

  const toggleDescription = () => {
    Animated.spring(sheetY, {
      toValue:
        (sheetY as any)._value === COLLAPSED ? getExpandedHeight() : COLLAPSED,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }} pointerEvents="box-none">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/');
        }}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 20,
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: 10 * scale,
          borderRadius: 50,
        }}
        // Removed pointerEvents="auto" from here
      >
        <FontAwesome name="arrow-left" size={22 * scale} color="white" />
      </TouchableOpacity>

      {/* Swipeable Images */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
        contentOffset={{ x: SCREEN_WIDTH * currentIndex, y: 0 }}
      >
        {dishes.map((item) => (
          <Image
            key={item.id}
            source={item.image}
            resizeMode="cover"
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          />
        ))}
      </ScrollView>

      {/* Draggable Panel */}
      <Animated.View
        style={[
          styles.sheet,
          {
            top: sheetY,
            width: SCREEN_WIDTH * 0.92,
            left: SCREEN_WIDTH * 0.04,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Yellow Label */}
        <TouchableOpacity
          style={[styles.descriptionLabel, { paddingHorizontal: 20 * scale }]}
          onPress={toggleDescription}
        >
          <Text style={[styles.descriptionLabelText, { fontSize: 18 * scale }]}>
            {t('dish.descriptionButton')}
          </Text>
        </TouchableOpacity>

        {/* Scroll Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 50 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, h) => {
            if (h > contentHeight) setContentHeight(h);
          }}
        >
          <Text style={[styles.name, { fontSize: 34 * scale }]}>
            {dish.name.toUpperCase()}
          </Text>
          <Text style={[styles.kulitan, { fontSize: 28 * scale }]}>{dish.kulitan}</Text>
          <Text
            style={[styles.description, { fontSize: 18 * scale, lineHeight: 24 * scale }]}
          >
            {t(`dishes.${dish.id}.description`)}
          </Text>
          <Text style={[styles.source, { fontSize: 12 * scale }]}>
            {`Image Source: ${dish.source}`}
          </Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  descriptionLabel: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    backgroundColor: '#facc15',
    paddingVertical: 6,
    borderRadius: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 5,
  },
  descriptionLabelText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'SegoeUI',
  },
  name: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'SegoeUI',
  },
  kulitan: {
    textAlign: 'center',
    fontFamily: 'Kulitan',
    marginBottom: 14,
  },
  description: {
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'SegoeUI',
  },
  source: {
    color: '#777',
    marginTop: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});