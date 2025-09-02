import ResponsiveText from '@/components/ResponsiveText'; // <-- your responsive text
import { useResponsive } from '@/hooks/useResponsive'; // <-- your responsive hook
import { useState } from 'react';
import { Animated, PanResponder, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DetailCard({
  item,
  index,
  total,
  onClose,
  onSwipeLeft,
  onSwipeRight,
}: {
  item: any;
  index: number;
  total: number;
  onClose: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const [showDefinition, setShowDefinition] = useState(false);
  const insets = useSafeAreaInsets();
  const { width, height, shortEdge, isTablet } = useResponsive();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50) {
        onSwipeRight();
      } else if (gestureState.dx > 50) {
        onSwipeLeft();
      }
    },
  });

  const progressPercent = (index / total) * 100;

  return (
    <Animated.View
      style={{
        width,
        height,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      className="bg-amber-100 items-center justify-center relative px-4"
      {...panResponder.panHandlers}
    >
      {/* Card Container */}
      <View className="w-full items-center">
        <View
          className="bg-yellow-400 rounded-[36px] items-center relative shadow-md"
          style={{
            paddingHorizontal: shortEdge * 0.06, // scales with screen
            paddingVertical: shortEdge * 0.08,
            width: '100%',
          }}
        >
          <ResponsiveText baseSize={isTablet ? 28 : 24} className="font-bold text-center text-white tracking-wide">
            {item.word}
          </ResponsiveText>

          <ResponsiveText
            baseSize={isTablet ? 60 : 48}
            className="text-white text-center my-4 tracking-widest"
            style={{ fontFamily: 'Kulitan' }}
          >
            {item.kulitan}
          </ResponsiveText>

          <ResponsiveText baseSize={18} className="text-white text-center">
            English: {item.english}
          </ResponsiveText>
          <ResponsiveText baseSize={18} className="text-white text-center">
            Filipino: {item.filipino}
          </ResponsiveText>

          <TouchableOpacity className="mt-6 items-center">
            <ResponsiveText baseSize={28} className="text-white">
              🔊
            </ResponsiveText>
          </TouchableOpacity>
        </View>

        {/* Toggle Definition */}
        <TouchableOpacity
          onPress={() => setShowDefinition(!showDefinition)}
          className="-mt-5 bg-white rounded-full shadow border"
          style={{
            paddingHorizontal: shortEdge * 0.04,
            paddingVertical: shortEdge * 0.015,
          }}
        >
          <ResponsiveText baseSize={16}>{showDefinition ? '˅' : '^'}</ResponsiveText>
        </TouchableOpacity>
      </View>

      {/* Floating Definition */}
      {showDefinition && (
        <View
          className="absolute bg-yellow-300 rounded-[24px] shadow"
          style={{
            bottom: shortEdge * 0.15,
            width: '90%',
            padding: shortEdge * 0.05,
          }}
        >
          <ResponsiveText baseSize={20} className="font-bold uppercase text-center">
            {item.word}
          </ResponsiveText>
          <ResponsiveText baseSize={16} className="mt-2 text-center leading-6">
            {item.sentence}
          </ResponsiveText>
        </View>
      )}

      {/* Progress Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-3 bg-gray-300">
        <View
          className="h-full bg-yellow-500"
          style={{ width: `${progressPercent}%` }}
        />
      </View>

      {/* Progress Text */}
      <ResponsiveText baseSize={12} className="absolute bottom-6 text-gray-500">
        {index} / {total}
      </ResponsiveText>
    </Animated.View>
  );
}
