import CustomHeader from '@/components/CustomHeader';
import ResponsiveText from '@/components/ResponsiveText';
import { deities as enDeities } from '@/data/deities';
import { deities as tlDeities } from '@/data/deities.tl';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export default function IndigenousReligion() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // "en" or "tl"
  const listRef = useRef<FlatList>(null);
  const [selected, setSelected] = useState<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { width } = useWindowDimensions();
  const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;
  const cardSize = (width - 16 * (numColumns + 1)) / numColumns;
  const cardHeight = width > 600 ? cardSize * 1.5 : cardSize * 1.1;

  const [fontsLoaded] = useFonts({
    'Segoe-UI': require('@/assets/fonts/Segoe UI.ttf'),
    Kulitan: require('@/assets/fonts/KulitanHandwriting.otf'),
  });

  if (!fontsLoaded) return null;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // ✅ choose data based on current language
  const data = currentLang === 'tl' ? tlDeities : enDeities;

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <CustomHeader
        title={t('indigenousReligion.title')}
        fontSize={width > 600 ? 32 : 25}
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      {/* Intro Box */}
      <View style={{ backgroundColor: 'white', marginHorizontal: -width * 0.04 }}>
        <ResponsiveText
          baseSize={12}
          style={{
            textAlign: 'center',
            lineHeight: width > 600 ? 22 : 18,
            color: '#374151',
            paddingVertical: width > 600 ? 12 : 8,
            paddingHorizontal: 12,
            fontFamily: 'Segoe-UI',
            fontSize: width > 600 ? 16 : 12,
          }}
        >
          {t('indigenousReligion.experience')}
        </ResponsiveText>
      </View>

      {/* Main Scrollable List */}
      <FlatList
        ref={listRef}
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: width * 0.03, paddingBottom: 30 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <ResponsiveText
              baseSize={width > 600 ? 28 : 22}
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                fontFamily: 'Segoe-UI',
                color: '#92400e',
                textAlign: 'center',
              }}
            >
              {t('indigenousReligion.introTitle')}
            </ResponsiveText>
            <ResponsiveText
              baseSize={width > 600 ? 18 : 14}
              style={{
                marginBottom: 30,
                lineHeight: width > 600 ? 26 : 22,
                textAlign: 'justify',
                fontFamily: 'Segoe-UI',
                color: '#374151',
              }}
            >
              {t('indigenousReligion.introText')}
            </ResponsiveText>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: width * 0.02,
              marginHorizontal: 6,
              width: cardSize,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 5,
              elevation: 3,
              borderWidth: 1,
              borderColor: '#FCD34D',
            }}
          >
            <Image
              source={item.image}
              style={{ width: '100%', height: cardHeight, borderRadius: 16 }}
              resizeMode="cover"
            />
            <ResponsiveText
              baseSize={width > 600 ? 18 : 14}
              style={{
                marginTop: 8,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1f2937',
                fontFamily: 'Segoe-UI',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </ResponsiveText>
            <ResponsiveText
              baseSize={width > 600 ? 16 : 14}
              style={{
                marginTop: 2,
                textAlign: 'center',
                fontFamily: 'Kulitan',
                color: '#92400e',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </ResponsiveText>
          </TouchableOpacity>
        )}
      />

      {/* Scroll-to-top button */}
      {showBackToTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 20,
            backgroundColor: '#E6A817',
            padding: width * 0.035,
            borderRadius: 50,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="chevron-up" size={Math.round(width * 0.06)} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: width > 600 ? width * 0.15 : width * 0.05,
              borderRadius: 20,
              padding: width * 0.04,
              maxHeight: '80%',
            }}
          >
            <Image
              source={selected?.image}
              style={{
                width: '100%',
                height: width > 600 ? width * 0.5 : width * 0.6,
                borderRadius: 16,
                marginBottom: 12,
              }}
              resizeMode="contain"
            />
            <ResponsiveText
              baseSize={width > 600 ? 24 : 20}
              style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontFamily: 'Segoe-UI',
                color: '#1f2937',
                textAlign: 'center',
              }}
            >
              {selected?.title}
            </ResponsiveText>
            <ResponsiveText
              baseSize={width > 600 ? 20 : 18}
              style={{
                marginBottom: 8,
                textAlign: 'center',
                fontFamily: 'Kulitan',
                color: '#92400e',
              }}
            >
              {selected?.title}
            </ResponsiveText>
            <ResponsiveText
              baseSize={width > 600 ? 16 : 14}
              style={{
                lineHeight: width > 600 ? 26 : 22,
                color: '#374151',
                fontFamily: 'Segoe-UI',
                textAlign: 'justify',
              }}
            >
              {selected?.description}
            </ResponsiveText>
            <Pressable
              onPress={() => setSelected(null)}
              style={{
                marginTop: 20,
                backgroundColor: '#FCD34D',
                padding: width * 0.035,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <ResponsiveText
                baseSize={width > 600 ? 16 : 14}
                style={{ fontWeight: 'bold', color: '#78350f' }}
              >
                {t('indigenousReligion.close')}
              </ResponsiveText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
