import CustomHeader from '@/components/CustomHeader';
import { songs } from '@/data/songs';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ✅ Responsive scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 390;
const normalize = (size: number, min = 10, max = 42) =>
  Math.min(Math.max(size * scale, min), max);

// ✅ Max width for larger screens
const isLargeScreen = SCREEN_WIDTH > 768;
const CONTENT_WIDTH = isLargeScreen ? 700 : '100%';

export default function FolkSongsLibrary() {
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      {/* Header with Back Button */}
      <CustomHeader
        title={t("folkSongsLibrary.title")}
        fontSize={normalize(28)}
        showBackButton
        backButtonColor="#ffffffff"
        onBackPress={() => router.back()}
      />

      {/* Fixed Search Section */}
      <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
        {/* Description */}
        <View className="px-5 pt-4 pb-4 mb-3 bg-white rounded-xl">
          <Text
            style={{
              fontSize: normalize(12),
              lineHeight: normalize(16),
              textAlign: 'center',
              color: '#374151',
            }}
          >
            {t("folkSongsLibrary.description")}
          </Text>
        </View>

        {/* Search bar */}
        <View className="px-5 pb-3">
          <TextInput
            placeholder={t("folkSongsLibrary.searchPlaceholder")}
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 999,
              paddingVertical: normalize(8),
              paddingHorizontal: normalize(14),
              backgroundColor: 'white',
              fontSize: normalize(14),
            }}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      {/* Scrollable Song List */}
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <View style={{ width: CONTENT_WIDTH }}>
          <View className="px-5 pb-10">
            {filtered.length === 0 ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  marginTop: 16,
                  fontSize: normalize(14),
                }}
              >
                {t("folkSongsLibrary.noSongs")}
              </Text>
            ) : (
              filtered.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push({
                      pathname: '/TasteAndTune/FolkSongsLibrary/[songId]',
                      params: { songId: item.id, showLyrics: 'false' },
                    })
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: normalize(6),
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: normalize(40),
                        height: normalize(40),
                        borderRadius: 999,
                        backgroundColor: '#e5e7eb',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: normalize(14),
                      }}
                    >
                      <Play size={normalize(18)} color="#4B5563" />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: normalize(16),
                          color: '#111827',
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: normalize(13),
                          color: '#6b7280',
                        }}
                      >
                        {item.artist}
                      </Text>
                    </View>
                  </View>

                  {item.duration && (
                    <Text
                      style={{
                        fontSize: normalize(13),
                        color: '#374151',
                      }}
                    >
                      {item.duration}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
