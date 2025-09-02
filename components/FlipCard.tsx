// components/FlipCard.tsx
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/solid';

type FlipCardProps = {
  title: string;
  kapampangan: string;
  kulitan: string;
  english: string;
  filipino: string;
  breakdown: string;
};

// ✅ Responsive scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 390; // base iPhone 12 width
const normalize = (size: number, min = 10, max = 42) =>
  Math.min(Math.max(size * scale, min), max);

const shortEdge = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const isTablet = shortEdge >= 768;

export default function FlipCard({
  title,
  kapampangan,
  kulitan,
  english,
  filipino,
  breakdown,
}: FlipCardProps) {
  const animation = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const flipCard = () => {
    Animated.timing(animation, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      useNativeDriver: true, 
    }).start(() => setFlipped(!flipped));
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: animation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: animation.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  // ✅ fixed dimensions so card won't "jump"
  const CARD_HEIGHT = normalize(220, 200, 280);
  const CARD_RADIUS = isTablet ? 30 : 16;

  return (
    <View className="w-full items-center mb-6">
      <View style={{ width: '85%', height: CARD_HEIGHT }}>
        
        {/* FRONT */}
        <Animated.View
          style={[
            styles.card,
            frontAnimatedStyle,
            {
              backgroundColor: '#E6A817',
              borderRadius: CARD_RADIUS,
            },
          ]}
          className="absolute w-full h-full justify-between p-6 shadow-md"
        >
          <View className="flex-1 justify-center items-center">
            <Text
              style={{
                fontFamily: 'SegoeUIBlack',
                fontSize: normalize(40),
              }}
              className="text-white uppercase text-center"
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {title}
            </Text>
          </View>
          <Pressable
            onPress={flipCard}
            className="self-center bg-white p-3 rounded-full shadow"
          >
            <ChevronDownIcon size={normalize(28)} color="#AB9F00" />
          </Pressable>
        </Animated.View>

        {/* BACK */}
        <Animated.View
          style={[
            styles.card,
            backAnimatedStyle,
            {
              backgroundColor: '#E6A817',
              borderRadius: CARD_RADIUS,
            },
          ]}
          className="absolute w-full h-full justify-between p-6 shadow-md"
        >
          <View className="flex-1 justify-center">
            <Text
              style={{ fontFamily: 'SegoeUIBlack', fontSize: normalize(20) }}
              className="text-white text-center mb-2"
            >
              {kapampangan}
            </Text>
            <Text
              style={{ fontFamily: 'KulitanFont', fontSize: normalize(24) }}
              className="text-white text-center mb-1"
            >
              {kulitan}
            </Text>
            <Text
              style={{ fontFamily: 'SegoeUI', fontSize: normalize(14) }}
              className="text-white text-center mb-1"
            >
              English: {english}
            </Text>
            <Text
              style={{ fontFamily: 'SegoeUI', fontSize: normalize(13) }}
              className="text-white text-center mb-1"
            >
              Filipino: {filipino}
            </Text>
            <Text
              style={{ fontFamily: 'SegoeUI', fontSize: normalize(12) }}
              className="text-white text-center"
            >
              {breakdown}
            </Text>
          </View>
          <Pressable
            onPress={flipCard}
            className="self-center bg-white p-3 rounded-full shadow"
          >
            <ChevronUpIcon size={normalize(28)} color="#AB9F00" />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});