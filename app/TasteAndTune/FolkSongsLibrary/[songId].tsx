// PlayerScreen.tsx
import { songs } from '@/data/songs';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronUp,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const scale = SCREEN_WIDTH / 390;
const normalize = (size: number, min = 10, max = 42) =>
  Math.min(Math.max(size * scale, min), max);

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function PlayerScreen() {
  const { songId, showLyrics: showLyricsParam } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const song = songs.find((s) => s.id === songId);
  const currentIndex = songs.findIndex((s) => s.id === songId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(showLyricsParam === 'true');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const soundRef = useRef<Audio.Sound | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowLyrics(showLyricsParam === 'true');
  }, [showLyricsParam]);

  useEffect(() => {
    if (!song) return;

    let isCancelled = false;

    const loadAndPlay = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(song.file, {}, updateStatus);
        soundRef.current = sound;

        if (!isCancelled) {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } catch (error) {
        console.warn('Error loading/playing audio:', error);
      }
    };

    loadAndPlay();

    return () => {
      isCancelled = true;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId]);

  const updateStatus = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 1);

      if (status.didJustFinish && !status.isLooping) {
        const nextIndex = (currentIndex + 1) % songs.length;
        goToSong(nextIndex, 'next');
      }
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if ('isPlaying' in status && status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else if ('isPlaying' in status) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const seek = async (value: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value);
  };

  const goToSong = (index: number, direction: 'next' | 'prev') => {
    if (index >= 0 && index < songs.length) {
      const toValue = direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH;
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        translateX.setValue(-toValue);
        router.replace({
          pathname: "/TasteAndTune/FolkSongsLibrary/[songId]" as const,
          params: { 
            songId: songs[index].id,
            showLyrics: showLyrics ? 'true' : 'false' 
          },
        });
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  if (!song)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-yellow-50">
        <Text className="text-gray-500">Song not found.</Text>
      </SafeAreaView>
    );

  const renderControls = (size = normalize(30), playSize = normalize(32)) => (
    <View className="flex-row items-center justify-center mt-2">
      <View style={{ marginHorizontal: 12 }}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={() => goToSong(currentIndex - 1, 'prev')}>
            <SkipBack size={size} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: size, height: size }} />
        )}
      </View>

      <TouchableOpacity onPress={togglePlayPause} style={{ marginHorizontal: 12 }}>
        {isPlaying ? (
          <Pause size={playSize} />
        ) : (
          <Play size={playSize} />
        )}
      </TouchableOpacity>

      <View style={{ marginHorizontal: 12 }}>
        {currentIndex < songs.length - 1 ? (
          <TouchableOpacity onPress={() => goToSong(currentIndex + 1, 'next')}>
            <SkipForward size={size} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: size, height: size }} />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 p-safe" style={{ backgroundColor: '#FDF7E3' }}>
      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
        {showLyrics ? (
          <View className="flex-1" style={{ backgroundColor: '#FDF7E3' }}>
            {/* Header for Lyrics */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-[#FDF7E3]">
              <TouchableOpacity onPress={() => setShowLyrics(false)} style={{ padding: 8 }}>
                <ChevronLeft size={normalize(24)} color="#000" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: isTablet ? normalize(28) : normalize(20),
                  fontWeight: '700',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                {song?.title || 'Loading...'}
              </Text>
              <View style={{ width: normalize(24) }} />
            </View>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: isTablet ? 64 : 24,
                paddingTop: isTablet ? 40 : 20,
                paddingBottom: 180,
              }}
            >
              <Text style={styles.lyricsText}>
                {song?.lyrics || 'Loading lyrics...'}
              </Text>
            </ScrollView>

            {/* Player bar fixed at bottom */}
            <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white shadow-lg">
              <View className="flex-row items-center mb-2 space-x-4">
                <Image
                  source={song.cover}
                  style={{
                    width: isTablet ? normalize(72) : normalize(42),
                    height: isTablet ? normalize(72) : normalize(42),
                    borderRadius: 8,
                  }}
                />
                <View>
                  <Text style={{ fontSize: normalize(16), fontWeight: '600', color: '#374151' }}>
                    {song.title}
                  </Text>
                  <Text style={{ fontSize: normalize(14), color: '#6b7280' }}>{song.artist}</Text>
                </View>
              </View>
              <Slider
                style={{ width: '100%', height: normalize(28) }}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={seek}
                minimumTrackTintColor="#FACC15"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#FACC15"
              />
              <View className="flex-row justify-between mb-3">
                <Text style={{ fontSize: normalize(12), color: '#6b7280' }}>{formatTime(position)}</Text>
                <Text style={{ fontSize: normalize(12), color: '#6b7280' }}>{formatTime(duration)}</Text>
              </View>
              {renderControls()}
            </View>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: isTablet ? 80 : 40,
              alignItems: 'center',
              paddingHorizontal: isTablet ? 40 : 16,
            }}
          >
            {/* Header with Back + Now Playing */}
            <View className="w-full flex-row items-center justify-between px-4 py-3">
              <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                <ChevronLeft size={normalize(24)} color="#000" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: isTablet ? normalize(26) : normalize(18),
                  fontWeight: '700',
                  color: '#000',
                }}
              >
                {t('player.nowPlaying')}
              </Text>
              <View style={{ width: normalize(24) }} />
            </View>

            <Image
              source={song.cover}
              style={{
                width: isTablet ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9,
                height: isTablet ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />

            <View className="items-center mt-8 px-4">
              <Text
                style={{
                  fontSize: isTablet ? normalize(34) : normalize(24),
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {song.title}
              </Text>
              <Text
                style={{
                  fontSize: isTablet ? normalize(20) : normalize(14),
                  color: '#6b7280',
                  marginTop: 6,
                }}
              >
                {song.artist}
              </Text>
            </View>

            <View style={{ width: isTablet ? '60%' : '80%', marginTop: isTablet ? 40 : 24 }}>
              <Slider
                style={{ height: normalize(28) }}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={seek}
                minimumTrackTintColor="#FACC15"
                maximumTrackTintColor="#505050ff"
                thumbTintColor="#FACC15"
              />
              <View className="flex-row justify-between">
                <Text style={{ fontSize: normalize(12), color: '#6b7280' }}>{formatTime(position)}</Text>
                <Text style={{ fontSize: normalize(12), color: '#6b7280' }}>{formatTime(duration)}</Text>
              </View>
            </View>

            <View style={{ marginTop: isTablet ? 70 : 40 }}>{renderControls()}</View>

            <TouchableOpacity
              onPress={() => setShowLyrics(true)}
              style={{ marginTop: isTablet ? 70 : 40, flexDirection: 'row', alignItems: 'center' }}
            >
              <ChevronUp size={normalize(20)} />
              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: '600',
                  fontSize: normalize(16),
                  color: '#000',
                }}
              >
                {t('player.lyrics')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lyricsText: {
    fontSize: isTablet ? normalize(26) : normalize(20),
    fontFamily: 'Segoe UI',
    color: '#374151',
    textAlign: 'center',
    lineHeight: isTablet ? normalize(40) : normalize(30),
  },
});