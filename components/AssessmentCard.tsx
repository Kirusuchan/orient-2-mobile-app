import { images } from '@/constants/images';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

type AssessmentCardProps = {
  title: string;
  onPress?: () => void;
  status?: 'Passed' | 'Locked' | 'Unlocked';
  buttonText?: string;
};

export default function AssessmentCard({
  title,
  onPress,
  status,
  buttonText,
}: AssessmentCardProps) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const isLocked = status === 'Locked';
  const isTablet = width >= 768;

  // ✅ Responsive sizing
  const cardHeight = isTablet ? 280 : width < 380 ? 220 : 250;
  const headerHeight = cardHeight * 0.55;
  const buttonWidth = isTablet ? 180 : width < 400 ? 120 : 150;
  const buttonFont = isTablet ? 20 : width < 400 ? 20 : 22;
  const titleFont = isTablet ? 26 : width < 400 ? 28 : 32;

  // ✅ Translate status
  const statusText = status
    ? status === 'Passed'
      ? t('assessment.passed')
      : status === 'Locked'
      ? t('assessment.locked')
      : t('assessment.unlocked')
    : undefined;

  return (
    <View
      className="bg-white rounded-2xl shadow-md overflow-hidden mt-6 mx-5"
      style={{ height: cardHeight }}
    >
      {/* Yellow Header Section */}
      <View className="bg-yellow-500 relative" style={{ height: headerHeight }}>
        <Image
          source={images.homecardlogo}
          resizeMode="contain"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 10,
            left: 0,
            width: '180%',
            height: '140%',
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              fontSize: titleFont,
              fontFamily: 'SegoeUIBlack',
              color: 'white',
              textAlign: 'center',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {title}
          </Text>
        </View>

        {statusText && (
          <View className="absolute top-2 right-3 bg-[#FDF7E3] px-3 py-1 rounded-full shadow">
            <Text
              className={`text-xs font-bold ${
                status === 'Passed'
                  ? 'text-green-600'
                  : status === 'Locked'
                  ? 'text-gray-500'
                  : 'text-blue-600'
              }`}
            >
              {statusText}
            </Text>
          </View>
        )}
      </View>

      {/* White Bottom Section */}
      <View
        className="bg-white"
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          disabled={isLocked}
          className={`py-3 rounded-full ${isLocked ? 'bg-gray-300' : 'bg-yellow-500'}`}
          style={{ width: buttonWidth }}
          onPress={onPress}
        >
          <Text
            style={{
              color: 'white',
              fontSize: buttonFont,
              fontWeight: '600',
              fontFamily: 'SegoeUIBlack',
              textAlign: 'center',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {isLocked ? t('assessment.locked') : buttonText || t('assessment.buttonStart')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
