// screens/PredicatesScreen.tsx
import CustomHeader from '@/components/CustomHeader';
import FlipCard from '@/components/FlipCard';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, View } from 'react-native';

// ✅ Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 390; // base iPhone 12
const normalize = (size: number, min = 12, max = 48) =>
  Math.min(Math.max(size * scale, min), max);

export default function Predicates() {
   const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    SegoeUI: require('@/assets/fonts/Segoe UI.ttf'),
    KulitanFont: require('@/assets/fonts/KulitanHandwriting.otf'),
  });
  

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#FDF7E3' }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF7E3' }}>
      <CustomHeader
        title={t('predicates.title')}
        fontSize={normalize(30)} 
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: normalize(15),
          paddingHorizontal: normalize(10),
          paddingBottom: normalize(100),
        }}
      >
        <FlipCard
          title={t('predicates.cards.nominal')}
          kapampangan="Méstra ya i Bayang."
          kulitan="Mestra ya i Bayang."
          english="Bayang is a teacher."
          filipino="Si Bayang ay guro."
          breakdown="Méstra (teacher) | ya (is) | i Bayang (Bayang)"
        />

        <FlipCard
         title={t('predicates.cards.adjective')} 
          kapampangan="Matsura la ren."
          kulitan="Matsura la ren."
          english="Those are ugly."
          filipino="Pangit ang mga iyon."
          breakdown="Matsura (ugly) | la (are) | ren (those)"
        />

        <FlipCard
          title={t('predicates.cards.verbal')} 
          kapampangan="Mámangan ku."
          kulitan="Mamangan ku."
          english="I am eating."
          filipino="Kumakain ako."
          breakdown="Mámangan (eating) | ku (I)"
        />
      </ScrollView>
    </View>
  );
}
