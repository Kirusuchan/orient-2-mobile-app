// components/GrammarCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

type Props = {
  verb: string;
  meaning: string;
  symbol?: string;
  agentFocus: string[];
  patientFocus: string[];
  translations?: {
    filipino: string;
    english: string;
  };
};

const GrammarCard = ({ verb, meaning, symbol, agentFocus, patientFocus, translations }: Props) => {
  const { t } = useTranslation();

  return (
    <View className="bg-[#E6A817] rounded-3xl px-6 py-5 mb-6 mx-4 items-center">
      {/* Title */}
      <Text className="text-white text-center font-bold text-xl mb-1">
        {verb}{' '}
        <Text className="italic font-normal text-base">(&apos;{meaning}&apos;)</Text>
      </Text>

      {/* Translations */}
      {translations && (
        <View className="mb-3">
          <Text className="text-white text-sm text-center">{t('filipino')}: {translations.filipino}</Text>
          <Text className="text-white text-sm text-center">{t('english')}: {translations.english}</Text>
        </View>
      )}

      {/* Kulitan symbol */}
      {symbol && (
        <Text
          className="text-white text-3xl mb-4"
          style={{ fontFamily: 'Kulitan' }}
        >
          {symbol}
        </Text>
      )}

    {/* Agent Focus */}
    <View className="bg-white rounded-full px-4 py-2 flex-row items-center flex-wrap justify-center mb-2">
      <View className="px-2 py-1 mr-4">
        <Text className="text-black text-xs font-semibold">
          {t('verbConjugation.predicates.cards.agentFocus')}
        </Text>
      </View>
      {agentFocus.map((form, index) => (
        <View
          key={index}
          className="bg-white px-2 py-1 rounded-full mr-4 min-w-[80px] items-center"
        >
          <Text className="text-black text-xs text-center">{form}</Text>
        </View>
      ))}
    </View>

    {/* Patient Focus */}
    <View className="bg-white rounded-full px-4 py-2 flex-row items-center flex-wrap justify-center">
      <View className="px-2 py-1 mr-4">
        <Text className="text-black text-xs font-semibold">
          {t('verbConjugation.predicates.cards.patientFocus')}
        </Text>
      </View>
      {patientFocus.map((form, index) => (
        <View
          key={index}
          className="bg-white px-2 py-1 rounded-full mr-4 min-w-[80px] items-center"
        >
          <Text className="text-black text-xs text-center">{form}</Text>
        </View>
      ))}
    </View>

    </View>
  );
};

export default GrammarCard;
