import { audioMap } from "@/assets/vocabularyAudio/audioMap";
import CustomHeader from "@/components/CustomHeader";
import SearchBar from "@/components/SearchBar";
import vocabList from "@/data/vocab/vocabList.json";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

interface VocabularyItem {
  word: string;
  kulitan: string;
  english: string;
  filipino: string;
  audio: string;
  sentence?: string;
  sentenceFilipino?: string;
  sentenceEnglish?: string;
}

const typedVocabList: VocabularyItem[] = vocabList as VocabularyItem[];
const BATCH_SIZE = 10; // Number of items to load at once

// Precompute scaled values
const useScaledValues = (isTablet: boolean, scale: number) => {
  return useMemo(() => ({
    introFont: Math.round((isTablet ? 12 : 10) * scale),
    introLineHeight: Math.round((isTablet ? 20 : 18) * scale),
    wordFont: Math.round((isTablet ? 24 : 20) * scale),
    listKulitanFont: Math.round((isTablet ? 30 : 28) * scale),
    audioIcon: Math.max(20, (isTablet ? 28 : 22) * scale),
    scrollBtn: Math.max(24, (isTablet ? 30 : 22) * scale),
    cardWordFont: Math.round((isTablet ? 20 : 40) * scale),
    cardKulitanFont: Math.round((isTablet ? 22 : 52) * scale),
    cardInfoFont: Math.round((isTablet ? 12 : 16) * scale),
    exampleWordFont: Math.round((isTablet ? 20 : 24) * scale),
    exampleTextFont: Math.round((isTablet ? 10 : 14) * scale),
  }), [isTablet, scale]);
};

// Create a memoized carousel item component to prevent unnecessary re-renders
const CarouselItem = React.memo(function CarouselItem({
  item,
  index,
  isTablet,
  width,
  scaledValues,
  isAudioReady,
  currentlyPlaying,
  playAudio,
  toggleExample,
  showExampleIndex,
  scale,
  animatedHeight
}: {
  item: VocabularyItem;
  index: number;
  isTablet: boolean;
  width: number;
  scaledValues: any;
  isAudioReady: boolean;
  currentlyPlaying: string | null;
  playAudio: (fileName: string) => void;
  toggleExample: (index: number) => void;
  showExampleIndex: number | null;
  scale: number;
  animatedHeight: Animated.Value;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: isTablet ? 10 : 20,
      }}
    >
      {/* Word Card */}
      <View
        style={{
          backgroundColor: "#E6A817",
          borderRadius: 20,
          padding: isTablet ? 20 : 16,
          width: isTablet ? width * 0.6 : width * 0.85,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
          alignItems: "center",
        }}
      >
        <Text
          className="text-white font-bold"
          style={{ fontSize: scaledValues.cardWordFont, fontFamily: "Segoe UI" }}
        >
          {item.word}
        </Text>
        <Text
          className="text-white mt-2"
          style={{
            fontSize: scaledValues.cardKulitanFont,
            fontFamily: "Kulitan",
          }}
        >
          {item.kulitan}
        </Text>
        <Text
          className="text-white mt-2"
          style={{ fontSize: scaledValues.cardInfoFont, fontFamily: "Segoe UI" }}
        >
          English: {item.english}
        </Text>
        <Text
          className="text-white"
          style={{ fontSize: scaledValues.cardInfoFont, fontFamily: "Segoe UI" }}
        >
          Filipino: {item.filipino}
        </Text>

        {/* Audio */}
        <TouchableOpacity
          onPress={() => playAudio(item.audio)}
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          disabled={!isAudioReady || currentlyPlaying === item.audio}
        >
          <FontAwesome
            name="volume-up"
            size={scaledValues.audioIcon + (isTablet ? 4 : 2)}
            color={currentlyPlaying === item.audio ? "#CCCCCC" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Chevron Button */}
      <TouchableOpacity
        onPress={() => toggleExample(index)}
        style={{
          backgroundColor: "#FFFFFF",
          padding: 8,
          borderRadius: 12,
          marginTop: -16,
          zIndex: 2,
          elevation: 5,
        }}
      >
        <FontAwesome
          name={showExampleIndex === index ? "chevron-up" : "chevron-down"}
          size={16 * scale}
          color="#E6A817"
        />
      </TouchableOpacity>

      {/* Example Box */}
      <Animated.View
        style={{
        height: animatedHeight,
        maxHeight: isTablet ? 200 * scale : 140 * scale, 
        overflow: "hidden",
        marginTop: 10,
        width: isTablet ? width * 0.5 : width * 0.75,
        backgroundColor:
          showExampleIndex === index ? "#E6A817" : "transparent",
        borderRadius: 16,
        paddingHorizontal: 12,
        justifyContent: "center",
        paddingVertical: 8,
        alignSelf: "center",
        }}
      >
        {item.sentence && (
          <>
            <Text
              className="text-white font-bold text-center"
              style={{
                fontSize: scaledValues.exampleWordFont,
                fontFamily: "Segoe UI",
              }}
            >
              {item.word.toUpperCase()}
            </Text>
            <Text
              className="text-white text-center mt-1"
              style={{
                fontSize: scaledValues.exampleTextFont,
                fontFamily: "Segoe UI",
              }}
            >
              {item.sentence}
            </Text>
            {item.sentenceFilipino && (
              <Text
                className="text-white mt-1 text-center italic"
                style={{
                  fontSize: scaledValues.exampleTextFont,
                  fontFamily: "Segoe UI",
                }}
              >
                Filipino: {item.sentenceFilipino}
              </Text>
            )}
            {item.sentenceEnglish && (
              <Text
                className="text-white text-center italic"
                style={{
                  fontSize: scaledValues.exampleTextFont,
                  fontFamily: "Segoe UI",
                }}
              >
                English: {item.sentenceEnglish}
              </Text>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
});

export default function VocabScreen() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const shortEdge = Math.min(width, height);
  const scale = shortEdge / 375;
  const scaledValues = useScaledValues(isTablet, scale);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExampleIndex, setShowExampleIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [resetSearch, setResetSearch] = useState(false);
  const [loadedItemsCount, setLoadedItemsCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const listRef = useRef<FlatList<VocabularyItem>>(null);
  const carouselRef = useRef<React.ComponentRef<typeof Carousel>>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const animatedHeights = useRef<Animated.Value[]>([]);

  // Initialize animated heights only once
  if (animatedHeights.current.length === 0) {
    animatedHeights.current = typedVocabList.map(() => new Animated.Value(0));
  }

  const filteredData = useMemo(() => {
    if (resetSearch) {
      setSearchTerm("");
      setResetSearch(false);
      return typedVocabList;
    }
    
    const term = searchTerm.toLowerCase();
    return typedVocabList.filter(
      (item) =>
        item.word.toLowerCase().includes(term) ||
        item.english.toLowerCase().includes(term) ||
        item.filipino.toLowerCase().includes(term)
    );
  }, [searchTerm, resetSearch]);

  // Get the batch of items to display
  const displayedData = useMemo(() => {
    return filteredData.slice(0, loadedItemsCount);
  }, [filteredData, loadedItemsCount]);

  // Reset loaded items count when search changes
  useEffect(() => {
    setLoadedItemsCount(BATCH_SIZE);
  }, [searchTerm]);

  const toggleExample = useCallback((index: number) => {
    const isOpen = showExampleIndex === index;
    setShowExampleIndex(isOpen ? null : index);

    Animated.timing(animatedHeights.current[index], {
      toValue: isOpen ? 0 : (isTablet ? 160 : 140) * scale, 
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [showExampleIndex, isTablet, scale]);

  const closeExample = useCallback(() => {
    if (showExampleIndex !== null) {
      setShowExampleIndex(null);
      Animated.timing(animatedHeights.current[showExampleIndex], {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [showExampleIndex]);

  // Back handler
  useEffect(() => {
    const backAction = () => {
      if (selectedIndex !== null) {
        setSelectedIndex(null);
        setResetSearch(true);
        return true;
      }
      return false;
    };
    
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [selectedIndex]);

  // Configure audio
  useEffect(() => {
    let isMounted = true;
    
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        
        if (isMounted) {
          setIsAudioReady(true);
        }
      } catch (error) {
        console.error("Error configuring audio", error);
      }
    };
    
    configureAudio();
    
    return () => {
      isMounted = false;
      // Clean up sound object
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playAudio = useCallback(async (fileName: string) => {
    if (!audioMap[fileName]) {
      console.error(`Audio file ${fileName} not found in audioMap`);
      return;
    }
    
    try {
      // Stop currently playing audio if it exists
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
        } catch (error) {
          console.log("Sound was not playing");
        }
        try {
          await soundRef.current.unloadAsync();
        } catch (error) {
          console.log("Sound was not loaded");
        }
        soundRef.current = null;
      }

      setCurrentlyPlaying(fileName);
      
      // Load and play the new sound
      const { sound } = await Audio.Sound.createAsync(
        audioMap[fileName],
        { shouldPlay: true }
      );
      
      soundRef.current = sound;
      
      // Set up callback for when playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setCurrentlyPlaying(null);
        }
      });
      
    } catch (error) {
      console.error("Error playing audio", error);
      setCurrentlyPlaying(null);
    }
  }, []);

  // Load more items when reaching the end of the list
  const loadMoreItems = useCallback(() => {
    if (isLoadingMore || loadedItemsCount >= filteredData.length) return;
    
    setIsLoadingMore(true);
    
    // Simulate a small delay for loading (you can remove this in production)
    setTimeout(() => {
      setLoadedItemsCount(prevCount => {
        const newCount = Math.min(prevCount + BATCH_SIZE, filteredData.length);
        return newCount;
      });
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, loadedItemsCount, filteredData.length]);

  const renderListItem = useCallback(({ item, index }: { item: VocabularyItem; index: number }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#E6A817",
        flex: isTablet ? 0.48 : 1,
      }}
      className="p-3 mb-3 rounded-2xl flex-row justify-between items-center shadow-md shadow-black/20"
      onPress={() => setSelectedIndex(index)}
      activeOpacity={0.85}
    >
      <View className="flex-1">
        <Text
          className="text-white font-bold"
          style={{ fontSize: scaledValues.wordFont, fontFamily: "Segoe UI" }}
        >
          {item.word}
        </Text>
        <Text
          className="text-white mt-1"
          style={{
            fontSize: scaledValues.listKulitanFont,
            fontFamily: "Kulitan",
          }}
        >
          {item.kulitan}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => playAudio(item.audio)}
        className="ml-3 p-1.5"
        activeOpacity={0.7}
        disabled={!isAudioReady || currentlyPlaying === item.audio}
      >
        <FontAwesome 
          name="volume-up" 
          size={scaledValues.audioIcon} 
          color={currentlyPlaying === item.audio ? "#CCCCCC" : "#FFFFFF"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [isTablet, scaledValues, isAudioReady, currentlyPlaying, playAudio]);

  const renderCarouselItem = useCallback(({ item, index }: { item: VocabularyItem; index: number }) => (
    <CarouselItem
      item={item}
      index={index}
      isTablet={isTablet}
      width={width}
      scaledValues={scaledValues}
      isAudioReady={isAudioReady}
      currentlyPlaying={currentlyPlaying}
      playAudio={playAudio}
      toggleExample={toggleExample}
      showExampleIndex={showExampleIndex}
      scale={scale}
      animatedHeight={animatedHeights.current[index]}
    />
  ), [isTablet, width, scaledValues, isAudioReady, currentlyPlaying, playAudio, toggleExample, showExampleIndex, scale]);

  const introText = useMemo(() => (
    <View
      style={{
        backgroundColor: "white",
        paddingVertical: isTablet ? 8 : 6,
        paddingHorizontal: isTablet ? 16 : 8,
      }}
    >
      <Text
        className="text-center text-gray-700"
        style={{
          fontSize: scaledValues.introFont,
          lineHeight: scaledValues.introLineHeight,
          fontFamily: "Segoe UI",
        }}
      >
        {t("vocab.intro")}
      </Text>
    </View>
  ), [isTablet, scaledValues, t]);

  // Footer component with loading indicator
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#E6A817" />
      </View>
    );
  }, [isLoadingMore]);

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      <CustomHeader
        title={t("vocab.header")}
        fontSize={isTablet ? 50 : 30}
        showBackButton
        backButtonColor="#ffffffff"
        onBackPress={() => {
          if (selectedIndex !== null) {
            setSelectedIndex(null);
            setResetSearch(true);
          } else {
            router.back();
          }
        }}
      />

      {/* List View */}
      {selectedIndex === null && (
        <>
          {introText}
          <View style={{ marginVertical: 8, paddingHorizontal: 16 }}>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </View>

          <FlatList
            ref={listRef}
            data={displayedData}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 60,
            }}
            numColumns={isTablet ? 2 : 1}
            columnWrapperStyle={
              isTablet ? { justifyContent: "space-between" } : undefined
            }
            removeClippedSubviews
            initialNumToRender={BATCH_SIZE}
            maxToRenderPerBatch={BATCH_SIZE}
            windowSize={5}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              setShowScrollTop(offsetY > 200);
            }}
            scrollEventThrottle={32}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <Text
                className="text-center text-gray-600 mt-10"
                style={{ fontSize: 16 * scale, fontFamily: "Segoe UI" }}
              >
                {t("vocab.noResults")}
              </Text>
            }
            ListFooterComponent={renderFooter}
            renderItem={renderListItem}
          />

          {/* Floating Scroll-to-Top Button */}
          {showScrollTop && (
            <TouchableOpacity
              onPress={() =>
                listRef.current?.scrollToOffset({ offset: 0, animated: true })
              }
              style={{
                position: "absolute",
                bottom: 30,
                right: 20,
                backgroundColor: "#E6A817",
                padding: isTablet ? 16 : 12,
                borderRadius: 30,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 5,
              }}
            >
              <FontAwesome name="chevron-up" size={scaledValues.scrollBtn} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Full View Carousel */}
      {selectedIndex !== null && (
        <View className="flex-1 bg-[#FDF7E3]">
          {introText}
          <Carousel
            ref={carouselRef}
            width={width}
            height={isTablet ? height * 0.6 : height * 0.65}
            style={{ alignSelf: "center" }}
            scrollAnimationDuration={500}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.92,
              parallaxScrollingOffset: 0,
            }}
            onSnapToItem={(index) => {
              closeExample();
              setSelectedIndex(index);
            }}
            defaultIndex={selectedIndex}
            data={filteredData}
            renderItem={renderCarouselItem}
            windowSize={3}
          />

          {/* Counter */}
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              marginBottom: 4,
              fontSize: 16,
              fontWeight: "600",
              color: "#333",
            }}
          >
            {selectedIndex + 1} / {filteredData.length}
          </Text>

          {/* Progress Bar + Prev/Next Buttons */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
              paddingHorizontal: 20,
              marginBottom: 8,
            }}
          >
            {/* Prev */}
            <TouchableOpacity
              onPress={() => {
                if (selectedIndex > 0) {
                  const newIndex = selectedIndex - 1;
                  closeExample();
                  setSelectedIndex(newIndex);
                  carouselRef.current?.scrollTo({
                    index: newIndex,
                    animated: true,
                  });
                }
              }}
              style={{ padding: 8 }}
            >
              <FontAwesome name="chevron-left" size={24} color="#E6A817" />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View
              style={{
                flex: 1,
                height: 6,
                backgroundColor: "#ddd",
                borderRadius: 3,
                marginHorizontal: 10,
              }}
            >
              <View
                style={{
                  width: `${((selectedIndex + 1) / filteredData.length) * 100}%`,
                  height: 6,
                  backgroundColor: "#E6A817",
                  borderRadius: 3,
                }}
              />
            </View>

            {/* Next */}
            <TouchableOpacity
              onPress={() => {
                if (selectedIndex < filteredData.length - 1) {
                  const newIndex = selectedIndex + 1;
                  closeExample();
                  setSelectedIndex(newIndex);
                  carouselRef.current?.scrollTo({
                    index: newIndex,
                    animated: true,
                  });
                }
              }}
              style={{ padding: 8 }}
            >
              <FontAwesome name="chevron-right" size={24} color="#E6A817" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}