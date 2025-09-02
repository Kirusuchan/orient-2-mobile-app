import CustomHeader from "@/components/CustomHeader";
import SearchBar from "@/components/SearchBar";
import baybayinLetters from '@/data/kulitan/kulitanLetters.json';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';

// ✅ Responsive helpers
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isTablet = SCREEN_WIDTH >= 768;
const scale = SCREEN_WIDTH / 390;
const normalize = (size: number, min = 10, max = 50) =>
  Math.min(Math.max(size * (isTablet ? scale * 0.9 : scale), min), max);

export default function AlphabetGrid() {
    const router = useRouter();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false); 
    const listRef = useRef<FlatList>(null); 

    // ✅ Filter by name only
    const filteredLetters = baybayinLetters.filter(item => {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term);
    });

    return (
        <View style={{ flex: 1, backgroundColor: '#FDF7E3' }}>
            {/* Header */}
            <CustomHeader
                title={t("alphabet.title")}
                fontSize={isTablet ? 50 : 30}
                showBackButton={true}
                backButtonColor="white"
            />

            {/* Intro Text */}
            <View style={{ backgroundColor: 'white' }}>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: normalize(12, 12, 18),
                        lineHeight: normalize(20, 18, 26),
                        color: '#374151',
                        paddingVertical: isTablet ? 12 : 8,
                        paddingHorizontal: isTablet ? 20 : 10,
                        fontFamily: 'SegoeUI',
                    }}
                >
                    {t("alphabet.intro")}
                </Text>
            </View>

            {/* Search Bar */}
            <View style={{ marginBottom: 20, paddingHorizontal: isTablet ? 24 : 0 }}>
                <SearchBar onChange={setSearchTerm} />
            </View>

            {/* Grid */}
            <FlatList
                ref={listRef}
                data={filteredLetters}
                keyExtractor={(item) => item.symbol}
                numColumns={isTablet ? 4 : 3}
                initialNumToRender={12}
                maxToRenderPerBatch={15}
                windowSize={5}
                contentContainerStyle={{ padding: isTablet ? 24 : 16 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                onScroll={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    setShowScrollTop(offsetY > 200);
                }}
                scrollEventThrottle={16}
                ListEmptyComponent={
                    <Text
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                            color: '#E9A924',
                            fontFamily: 'SegoeUI',
                            fontSize: normalize(14, 12, 18),
                        }}
                    >
                        {t("alphabet.noResults")}
                    </Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/KapampanganLanguage/alphabetsM/${item.symbol}`)}
                        style={{
                            backgroundColor: '#E9A924',
                            borderRadius: 24,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: isTablet ? 24 : 16,
                            flex: 1,
                            margin: 6,
                            maxWidth: isTablet ? "22%" : "30%",
                            aspectRatio: 1,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: normalize(36, 28, 52),
                                fontFamily: 'Kulitan',
                                color: 'white',
                            }}
                        >
                            {item.symbol}
                        </Text>
                        <Text
                            style={{
                                marginTop: 8,
                                color: 'white',
                                fontSize: normalize(14, 12, 20),
                                fontWeight: '600',
                                fontFamily: 'SegoeUI',
                            }}
                        >
                            {item.name.toLowerCase()}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* ✅ Floating Scroll-to-Top Button */}
            {showScrollTop && (
                <TouchableOpacity
                    onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
                    style={{
                        position: "absolute",
                        bottom: 30,
                        right: 20,
                        backgroundColor: "white",
                        padding: isTablet ? 16 : 12,
                        borderRadius: 25,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        elevation: 5,
                    }}
                >
                    <FontAwesome name="chevron-up" size={isTablet ? 26 : 20} color="#E6A817" />
                </TouchableOpacity>
            )}
        </View>
    );
}
