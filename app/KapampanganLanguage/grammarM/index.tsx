// app/KapampanganLanguage/grammarM/index.tsx
import CustomHeader from '@/components/CustomHeader';
import LanguageCard from '@/components/LanguageCard';
import { images } from '@/constants/images';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, View } from 'react-native';

// ✅ Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
let scale = SCREEN_WIDTH / 390; // iPhone 12 base width

// Tablet adjustments
if (SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024) {
  scale = SCREEN_WIDTH / 500;
} else if (SCREEN_WIDTH >= 1024) {
  scale = SCREEN_WIDTH / 650;
}

const normalize = (size: number, min = 12, max = 56) =>
  Math.min(Math.max(size * scale, min), max);

const grammarKeys = [
  "predicates",
  "verbConjugation",
  "nounsIntoVerbs",
  "adjectivesIntoVerbs",
  "pronouns",
  "demonstrativePronouns",
];

// ✅ Explicit route mapping
const grammarRoutes: Record<string, Href> = {
  predicates: "/KapampanganLanguage/grammarM/Predicates",
  verbConjugation: "/KapampanganLanguage/grammarM/VerbConjugation",
  nounsIntoVerbs: "/KapampanganLanguage/grammarM/NounsIntoVerbs",
  adjectivesIntoVerbs: "/KapampanganLanguage/grammarM/AdjectivesIntoVerbs",
  pronouns: "/KapampanganLanguage/grammarM/Pronouns",
  demonstrativePronouns:
    "/KapampanganLanguage/grammarM/DemonstrativePronouns",
};

const Index = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1" style={{ backgroundColor: "#FDF7E3" }}>
      <CustomHeader
        title={t("grammar.header")}
        fontSize={normalize(32)}
        showBackButton
        backButtonColor="#ffffffff"
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: normalize(18),
          paddingHorizontal: normalize(14),
          paddingBottom: normalize(60),
        }}
      >
        {grammarKeys.map((key, index) => (
          <View
            key={index}
            style={{
              width: "100%",
              marginBottom: normalize(14),
            }}
          >
            <LanguageCard
              title={t(`grammar.${key}.title`)}
              image={images.languagecardlogo}
              description={t(`grammar.${key}.description`)}
              onPress={() => router.push(grammarRoutes[key])}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Index;
