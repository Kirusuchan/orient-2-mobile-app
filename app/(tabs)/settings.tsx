import CustomHeader from '@/components/CustomHeader';
import i18n, { loadLanguage, saveLanguage } from '@/i18n/i18n';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    BackHandler,
    Dimensions,
    Modal,
    Platform,
    TouchableOpacity,
    View,
} from 'react-native';
import ResponsiveText from "../../components/ResponsiveText";

export default function Settings() {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'tl'>('en');
    const [pendingLanguage, setPendingLanguage] = useState<'en' | 'tl' | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const { width, height } = Dimensions.get('window');
    const isTablet = width >= 768; // simple check for tablet

    const cardWidth = width * 0.8;
    const cardHeight = isTablet ? height * 0.25 : height * 0.3;

    const [fontsLoaded] = useFonts({
        Kulitan: require('@/assets/fonts/KulitanHandwriting.otf'),
        SegoeUI: require('@/assets/fonts/Segoe UI.ttf'),
    });

    // Handle back button press on Android only when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                const backAction = () => {
                    setShowExitModal(true);
                    return true;
                };

                const backHandler = BackHandler.addEventListener(
                    "hardwareBackPress",
                    backAction
                );

                return () => {
                    backHandler.remove();
                    setShowExitModal(false); // Hide modal when screen loses focus
                };
            }
        }, [])
    );

    // Handle exit confirmation
    const handleExit = () => {
        BackHandler.exitApp();
    };

    useEffect(() => {
        (async () => {
            const lang = await loadLanguage();
            setSelectedLanguage(lang as 'en' | 'tl');
            i18n.changeLanguage(lang);
        })();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    const confirmSwitch = (value: 'en' | 'tl') => {
        if (value === selectedLanguage) {
            setShowErrorModal(true);
            return;
        }
        setPendingLanguage(value);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (pendingLanguage) {
            setSelectedLanguage(pendingLanguage);
            await i18n.changeLanguage(pendingLanguage);
            await saveLanguage(pendingLanguage);
        }
        setShowModal(false);
        setPendingLanguage(null);
    };

    const LanguageCard = ({
        label,
        value,
        kulitanText,
    }: {
        label: string;
        value: 'en' | 'tl';
        kulitanText: string;
    }) => {
        const isSelected = selectedLanguage === value;
        const scaleAnim = new Animated.Value(isSelected ? 1.05 : 1);

        Animated.spring(scaleAnim, {
            toValue: isSelected ? 1.05 : 1,
            useNativeDriver: true,
        }).start();

        return (
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    width: cardWidth,
                    height: cardHeight,
                }}
            >
                <TouchableOpacity
                    onPress={() => confirmSwitch(value)}
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        borderRadius: isTablet ? 28 : 20,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 6,
                        elevation: 6,
                        overflow: 'hidden',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: isSelected ? '#E6A817' : '#BFBFBF',
                            paddingHorizontal: isTablet ? 32 : 20,
                            paddingVertical: isTablet ? 18 : 10,
                        }}
                    >
                        <ResponsiveText
                            baseSize={isTablet ? 28 : 22}
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'SegoeUI',
                                textAlign: 'center',
                                letterSpacing: 0.5,
                            }}
                        >
                            {label}
                        </ResponsiveText>

                        <ResponsiveText
                            baseSize={isTablet ? 58 : 46}
                            style={{
                                color: 'white',
                                marginTop: 12,
                                fontFamily: 'Kulitan',
                            }}
                        >
                            {kulitanText}
                        </ResponsiveText>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FDF7E3' }}>
            <Stack.Screen options={{ 
                headerShown: false,
                gestureEnabled: false 
            }} />

            <CustomHeader title={t("settings.titleText")} />

            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingVertical: isTablet ? 40 : 20,
                }}
            >
                <LanguageCard
                    label={t('settings.switchToEnglish')}
                    value="en"
                    kulitanText="ingles"
                />

                <View style={{ marginBottom: isTablet ? 80 : 60 }}>
                    <LanguageCard
                        label={t('settings.switchToFilipino')}
                        value="tl"
                        kulitanText="filipino"
                    />
                </View>
            </View>

            {/* Confirmation Modal */}
            <Modal transparent visible={showModal} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#FDF7E3',
                            padding: isTablet ? 30 : 20,
                            borderRadius: 15,
                            width: isTablet ? '70%' : '80%',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 6,
                        }}
                    >
                        <ResponsiveText
                            baseSize={isTablet ? 22 : 18}
                            style={{
                                fontFamily: 'SegoeUI',
                                fontWeight: 'bold',
                                marginBottom: 10,
                                color: '#333',
                                textAlign: 'center',
                            }}
                        >
                            {t('settings.confirmTitle')}
                        </ResponsiveText>

                        <ResponsiveText
                            baseSize={isTablet ? 20 : 16}
                            style={{
                                fontFamily: 'SegoeUI',
                                textAlign: 'center',
                                marginBottom: 20,
                                color: '#444',
                            }}
                        >
                            {t('settings.confirmMessage', {
                                lang: pendingLanguage === 'en' ? 'English' : 'Filipino',
                            })}
                        </ResponsiveText>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                style={{
                                    backgroundColor: '#BFBFBF',
                                    paddingVertical: isTablet ? 12 : 10,
                                    paddingHorizontal: isTablet ? 28 : 24,
                                    borderRadius: 50,
                                }}
                            >
                                <ResponsiveText
                                    baseSize={isTablet ? 16 : 14}
                                    style={{
                                        color: 'white',
                                        fontFamily: 'SegoeUI',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('settings.cancel')}
                                </ResponsiveText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirm}
                                style={{
                                    backgroundColor: '#E6A817',
                                    paddingVertical: isTablet ? 12 : 10,
                                    paddingHorizontal: isTablet ? 28 : 24,
                                    borderRadius: 50,
                                }}
                            >
                                <ResponsiveText
                                    baseSize={isTablet ? 16 : 14}
                                    style={{
                                        color: 'white',
                                        fontFamily: 'SegoeUI',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t('settings.yes')}
                                </ResponsiveText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Error Modal */}
            <Modal transparent visible={showErrorModal} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#FDF7E3',
                            padding: isTablet ? 28 : 20,
                            borderRadius: 15,
                            width: isTablet ? '65%' : '75%',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 6,
                        }}
                    >
                        <ResponsiveText
                            baseSize={isTablet ? 20 : 18}
                            style={{
                                fontFamily: 'SegoeUI',
                                fontWeight: 'bold',
                                marginBottom: 10,
                                color: '#D8000C',
                                textAlign: 'center',
                            }}
                        >
                         {t('settings.errorTitle', { defaultValue: 'Language Already Selected' })}
                        </ResponsiveText>

                        <ResponsiveText
                            baseSize={isTablet ? 18 : 16}
                            style={{
                                fontFamily: 'SegoeUI',
                                textAlign: 'center',
                                marginBottom: 20,
                                color: '#444',
                            }}
                        >
                            {t('settings.errorMessage', { defaultValue: 'You are already using this language.' })}
                        </ResponsiveText>

                        <TouchableOpacity
                            onPress={() => setShowErrorModal(false)}
                            style={{
                                backgroundColor: '#E6A817',
                                paddingVertical: isTablet ? 12 : 10,
                                paddingHorizontal: isTablet ? 28 : 24,
                                borderRadius: 50,
                            }}
                        >
                            <ResponsiveText
                                baseSize={isTablet ? 16 : 14}
                                style={{
                                    color: 'white',
                                    fontFamily: 'SegoeUI',
                                    fontWeight: 'bold',
                                }}
                            >
                                OK
                            </ResponsiveText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Exit Confirmation Modal */}
            <Modal transparent visible={showExitModal} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#FDF7E3",
                            padding: isTablet ? 30 : 20,
                            borderRadius: 15,
                            width: isTablet ? "70%" : "80%",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            elevation: 6,
                        }}
                    >
                        <ResponsiveText
                            baseSize={isTablet ? 22 : 18}
                            style={{
                                fontFamily: "SegoeUI",
                                fontWeight: "bold",
                                marginBottom: 10,
                                color: "#333",
                                textAlign: "center",
                            }}
                        >
                            {t("home.exitTitle")}
                        </ResponsiveText>

                        <ResponsiveText
                            baseSize={isTablet ? 20 : 16}
                            style={{
                                fontFamily: "SegoeUI",
                                textAlign: "center",
                                marginBottom: 20,
                                color: "#444",
                            }}
                        >
                            {t("home.exitMessage")}
                        </ResponsiveText>

                        <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
                            <TouchableOpacity
                                onPress={() => setShowExitModal(false)}
                                style={{
                                    backgroundColor: "#BFBFBF",
                                    paddingVertical: isTablet ? 12 : 10,
                                    paddingHorizontal: isTablet ? 28 : 24,
                                    borderRadius: 50,
                                }}
                            >
                                <ResponsiveText
                                    baseSize={isTablet ? 16 : 14}
                                    style={{
                                        color: "white",
                                        fontFamily: "SegoeUI",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {t("home.cancel")}
                                </ResponsiveText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleExit}
                                style={{
                                    backgroundColor: "#E6A817",
                                    paddingVertical: isTablet ? 12 : 10,
                                    paddingHorizontal: isTablet ? 28 : 24,
                                    borderRadius: 50,
                                }}
                            >
                                <ResponsiveText
                                    baseSize={isTablet ? 16 : 14}
                                    style={{
                                        color: "white",
                                        fontFamily: "SegoeUI",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {t("home.exit")}
                                </ResponsiveText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}