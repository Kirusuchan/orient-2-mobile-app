import ResponsiveText from '@/components/ResponsiveText';
import { useResponsive } from '@/hooks/useResponsive';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, TouchableOpacity, View } from 'react-native';

export default function Result() {
  const params = useLocalSearchParams();

  // Save params into state immediately (so they persist across remounts)
  const [score] = useState(() =>
    params.score !== undefined ? Number(params.score) : undefined
  );
  const [total] = useState(() =>
    params.total !== undefined ? Number(params.total) : undefined
  );
  const [topic] = useState(() =>
    params.topic !== undefined ? String(params.topic) : undefined
  );
  const [type] = useState(() =>
    params.type !== undefined ? String(params.type) : 'multiple'
  );

  const { t } = useTranslation();

  const passed =
    score !== undefined && total !== undefined ? score / total >= 0.75 : false;

  const { shortEdge } = useResponsive();
  const spacing = shortEdge / 100;
  const circleSize = spacing * 20;
  const buttonHeight = spacing * 12;
  const buttonWidth = shortEdge * 0.85;

  // Disable hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  // Redirect away if params are missing
  useEffect(() => {
    if (score === undefined || total === undefined || topic === undefined) {
      router.replace('/assessment');
    }
  }, [score, total, topic]);

  // Review answers – use replace to terminate Result screen
  const handleReview = () => {
    if (!topic) return;
    router.replace({
      pathname: '/Assessment/review/[topic]',
      params: {
        topic,
        score: score?.toString(),
        total: total?.toString(),
        type,
      },
    });
  };

  // If invalid params, render nothing while redirecting
  if (score === undefined || total === undefined || topic === undefined) {
    return null;
  }

  // Calculate stars earned (0-3)
  const starsEarned = Math.round((score / total) * 3);

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View
        className="flex-1 bg-[#FFF6E5] justify-center items-center"
        style={{ paddingHorizontal: spacing * 6 }}
      >
        {/* Heading */}
        <ResponsiveText
          baseSize={22}
          style={{ fontWeight: '700', marginBottom: spacing * 6 }}
        >
          {passed
            ? t('assessmentR.result.niceWork')
            : t('assessmentR.result.tryAgain')}
        </ResponsiveText>

        {/* Checkmark Circle */}
        <View
          style={{
            backgroundColor: '#E6A817',
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing * 6,
          }}
        >
          <ResponsiveText
            baseSize={34}
            style={{ color: 'white', fontWeight: '700' }}
          >
            ✓
          </ResponsiveText>
        </View>

        {/* Stars */}
        <View style={{ flexDirection: 'row', marginBottom: spacing * 4 }}>
          {[1, 2, 3].map((i) => (
            <ResponsiveText
              key={i}
              baseSize={22}
              style={{
                marginHorizontal: spacing,
                color: i <= starsEarned ? '#E6A817' : '#D1D5DB',
              }}
            >
              ★
            </ResponsiveText>
          ))}
        </View>

        {/* Points earned */}
        <ResponsiveText
          baseSize={16}
          style={{ color: '#4B5563', marginBottom: spacing * 10 }}
        >
          {t('assessmentR.result.youEarned', { score })}
        </ResponsiveText>

        {/* Continue Button – terminate Result screen */}
        <TouchableOpacity
          style={{
            backgroundColor: '#E6A817',
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: spacing * 3,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing * 4,
          }}
          onPress={() => router.replace('/assessment')}
        >
          <ResponsiveText
            baseSize={18}
            style={{
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {t('assessmentR.result.continue')}
          </ResponsiveText>
        </TouchableOpacity>

        {/* Review Button – terminate Result screen */}
        <TouchableOpacity
          style={{
            backgroundColor: '#E6A817',
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: spacing * 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleReview}
        >
          <ResponsiveText
            baseSize={18}
            style={{
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {t('assessmentR.result.reviewAnswers')}
          </ResponsiveText>
        </TouchableOpacity>
      </View>
    </>
  );
}
