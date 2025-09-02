import CustomHeader from '@/components/CustomHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

// Direct imports from assets folder
import baptism from '@/assets/images/baptism.png';
import birth from '@/assets/images/birth.png';
import burial from '@/assets/images/burial.png';
import courtship from '@/assets/images/courtship.png';

// Supernatural
import dwende from '@/assets/images/dwende.png';
import kapre from '@/assets/images/kapre.png';
import mangkukulam from '@/assets/images/mangkukulam.png';
import magkukutud from '@/assets/images/mangkukutud.png';
import nunu from '@/assets/images/nunu.png';
import tianak from '@/assets/images/tianak.png';

// Fonts + hooks
import ResponsiveText from '@/components/ResponsiveText';
import { useResponsive } from '@/hooks/useResponsive';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';

const BeliefsAndPractices = () => {
  const [fontsLoaded] = useFonts({
    'Segoe-UI': require('@/assets/fonts/Segoe UI.ttf'),
  });

  const { width, isTablet } = useResponsive();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { t } = useTranslation();

  if (!fontsLoaded) return null;

  // Image sizing: scale relative to width
  const imgWidth = isTablet ? width * 0.45 : width * 0.55;
  const imgHeight = imgWidth * (isTablet ? 0.9 : 0.8);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowScrollTop(y > 200); // show button after 200px scroll
  };

  return (
    <View className="flex-1 bg-amber-100">
      {/* Custom header with back button */}
      <CustomHeader
        title={t('beliefs.title')}
        fontSize={isTablet ? 34 : 25}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 32 : 16,
          paddingBottom: 40,
        }}
        className="bg-amber-50"
      >
        {/* Intro Box */}
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: isTablet ? -32 : -16,
            paddingHorizontal: isTablet ? 24 : 12,
            paddingVertical: isTablet ? 16 : 8,
          }}
        >
          <ResponsiveText
            baseSize={isTablet ? 16 : 12}
            style={{
              textAlign: 'center',
              lineHeight: isTablet ? 24 : 18,
              color: '#374151',
              fontFamily: 'Segoe-UI',
            }}
          >
            {t('beliefs.intro')}
          </ResponsiveText>
        </View>

        {/* Section: Beliefs and Practices */}
        <ResponsiveText
          baseSize={isTablet ? 22 : 18}
          style={{
            fontWeight: 'bold',
            marginTop: isTablet ? 24 : 16,
            marginBottom: 8,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.sectionTitle')}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 16 : 14}
          style={{
            color: '#1f2937',
            marginBottom: isTablet ? 20 : 16,
            lineHeight: isTablet ? 24 : 20,
            fontFamily: 'Segoe-UI',
            textAlign: 'justify',
          }}
        >
          {t('beliefs.sectionDesc')}
        </ResponsiveText>

        {/* Birth & Baptism side-by-side */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: isTablet ? 20 : 12,
          }}
        >
          <Image
            source={birth}
            style={{
              width: '48%',
              height: imgHeight * 0.7,
              borderRadius: 12,
            }}
            resizeMode="contain"
          />
          <Image
            source={baptism}
            style={{
              width: '48%',
              height: imgHeight * 0.7,
              borderRadius: 12,
            }}
            resizeMode="contain"
          />
        </View>
        <ResponsiveText
          baseSize={isTablet ? 18 : 16}
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 6,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.birthTitle')}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 16 : 14}
          style={{
            color: '#111827',
            lineHeight: isTablet ? 24 : 20,
            textAlign: 'justify',
            marginBottom: isTablet ? 28 : 20,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.birthDesc')}
        </ResponsiveText>

        {/* Courtship and Marriage */}
        <View className="items-center mb-2">
          <Image
            source={courtship}
            style={{
              width: imgWidth,
              height: imgHeight,
              borderRadius: 16,
            }}
            resizeMode="contain"
          />
        </View>
        <ResponsiveText
          baseSize={isTablet ? 18 : 16}
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 6,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.courtshipTitle')}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 16 : 14}
          style={{
            color: '#111827',
            lineHeight: isTablet ? 24 : 20,
            textAlign: 'justify',
            marginBottom: isTablet ? 28 : 20,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.courtshipDesc')}
        </ResponsiveText>

        {/* Death and Burial */}
        <View className="items-center mb-2">
          <Image
            source={burial}
            style={{
              width: imgWidth,
              height: imgHeight,
              borderRadius: 16,
            }}
            resizeMode="contain"
          />
        </View>

        <ResponsiveText
          baseSize={isTablet ? 18 : 16}
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 6,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.deathTitle')}
        </ResponsiveText>
        <ResponsiveText
          baseSize={isTablet ? 16 : 14}
          style={{
            color: '#111827',
            lineHeight: isTablet ? 24 : 20,
            textAlign: 'justify',
            marginBottom: isTablet ? 28 : 20,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.deathDesc')}
        </ResponsiveText>

        {/* Section: Supernatural Beliefs */}
        <ResponsiveText
          baseSize={isTablet ? 20 : 16}
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginTop: isTablet ? 24 : 16,
            marginBottom: isTablet ? 16 : 12,
            fontFamily: 'Segoe-UI',
          }}
        >
          {t('beliefs.supernaturalTitle')}
        </ResponsiveText>

        {[
          { title: 'Nunu', key: 'nunu', img: nunu },
          { title: 'Mangkukulam', key: 'mangkukulam', img: mangkukulam },
          { title: 'Tianak / Pantyanak', key: 'tianak', img: tianak },
          { title: 'Dwende', key: 'dwende', img: dwende },
          { title: 'Kapre', key: 'kapre', img: kapre },
          { title: 'Magkukutud', key: 'magkukutud', img: magkukutud },
        ].map((item, index) => (
          <View key={index} style={{ marginBottom: isTablet ? 32 : 24 }}>
            <View className="items-center mb-2">
              <Image
                source={item.img}
                style={{
                  width: imgWidth,
                  height: imgHeight,
                  borderRadius: 16,
                }}
                resizeMode="contain"
              />
            </View>
            <ResponsiveText
              baseSize={isTablet ? 18 : 16}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 6,
                fontFamily: 'Segoe-UI',
              }}
            >
              {item.title}
            </ResponsiveText>
            <ResponsiveText
              baseSize={isTablet ? 16 : 14}
              style={{
                color: '#111827',
                lineHeight: isTablet ? 24 : 20,
                textAlign: 'center',
                fontFamily: 'Segoe-UI',
              }}
            >
              {t(`beliefs.supernatural.${item.key}`)}
            </ResponsiveText>
          </View>
        ))}
      </ScrollView>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            backgroundColor: '#E6A817',
            padding: 12,
            borderRadius: 30,
            elevation: 5,
          }}
        >
          <Ionicons name="chevron-up" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BeliefsAndPractices;
