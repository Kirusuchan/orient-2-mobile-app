// app/KapampanganLanguage/grammarM/VerbConjugation.tsx
import CustomHeader from '@/components/CustomHeader';
import GrammarCard from '@/components/GrammarCard';
import ResponsiveText from '@/components/ResponsiveText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const VerbConjugation = () => {
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const isTablet = width >= 768;

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setShowScrollTop(yOffset > 150);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF7E3' }}>
      <CustomHeader
        title={t('verbConjugation.headerTitle')} 
        fontSize={isTablet ? 50 : 30}
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 40 : 16,
          paddingVertical: isTablet ? 32 : 16,
          paddingBottom: 50,
        }}
      >
        <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ marginBottom: isTablet ? 28 : 16 }}>
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: 'bold' }}>
            Kapampángan verbs
          </ResponsiveText>{' '}
          ay may dalawang anyo ayon kay Kitano (2008): agent focus at patient focus.
          {'\n'}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: 'italic' }}>
            Sa Filipino: Ang mga pandiwa sa Kapampangan ay may dalawang anyo: pokus ng gumagawa (agent focus) at pokus ng bagay (patient focus).
          </ResponsiveText>
          {'\n'}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: 'italic' }}>
            In English: Kapampangan verbs have two forms according to Kitano (2008): agent focus and patient focus.
          </ResponsiveText>
        </ResponsiveText>

        {/* Grammar Cards - always one column */}
        <View style={{ flexDirection: 'column', gap: isTablet ? 24 : 16 }}>
          <GrammarCard
            verb="kan"
            meaning="to eat"
            symbol="kan"
            agentFocus={['mangan', 'mámangan', 'méngan']}
            patientFocus={['kakan', 'kakanan', 'péngan']}
            translations={{ filipino: 'kumain', english: 'to eat' }}
          />

          <GrammarCard
            verb="bása"
            meaning="to read"
            symbol="basa"
            agentFocus={['mamásâ', 'mámásâ', 'mémásâ']}
            patientFocus={['básan', 'bábbásan', 'binásâ']}
            translations={{ filipino: 'magbasa', english: 'to read' }}
          />

          <GrammarCard
            verb="dilû"
            meaning="dilu"
            symbol="⼅⼁"
            agentFocus={['mandilû', 'mándilû', 'méndilû']}
            patientFocus={['diluan', 'didiluan', 'dinilû']}
            translations={{ filipino: 'hindi uminom', english: 'not drinking' }}
          />

          <GrammarCard
            verb="inum"
            meaning="to drink"
            symbol="inum"
            agentFocus={['minum', 'miminum', 'mínum']}
            patientFocus={['inuman', 'inuman', 'inúm']}
            translations={{ filipino: 'uminom', english: 'to drink' }}
          />

          <GrammarCard
            verb="pulayî"
            meaning="to run"
            symbol="pulayi"
            agentFocus={['mamulayî', 'mámulayî', 'mémulayî']}
            patientFocus={['pulayan', 'pupulayan', 'pilayən']}
            translations={{ filipino: 'tumakbo', english: 'to run' }}
          />
        </View>
      </ScrollView>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: 'absolute',
            bottom: isTablet ? 60 : 30,
            right: isTablet ? 50 : 20,
            backgroundColor: '#E6A817',
            padding: isTablet ? 18 : 12,
            borderRadius: 50,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="chevron-up" size={isTablet ? 34 : 24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerbConjugation;
