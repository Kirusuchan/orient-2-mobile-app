import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import './globals.css';
import { initI18n } from "@/i18n/i18n"; // <-- your new init function

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Kulitan: require('@/assets/fonts/KulitanHandwriting.otf'),
        SegoeUI: require('@/assets/fonts/Segoe UI.ttf'),
        SegoeUIBlack: require('@/assets/fonts/segoe-ui-black.ttf'),
        SegoeUIBold: require('@/assets/fonts/Segoe UI Bold.ttf'),
    });

    useEffect(() => {
        (async () => {
            if (fontsLoaded) {
                await initI18n(); // <-- initialize translations
                setAppReady(true);
                SplashScreen.hideAsync();
            }
        })();
    }, [fontsLoaded]);

    if (!appReady) return null;

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="CulturalInsights" options={{ headerShown: false }} />
            <Stack.Screen name="TasteAndTune" options={{ headerShown: false }} />
            <Stack.Screen name="KapampanganLanguage" options={{ headerShown: false }} />
            <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="Assessment" options={{ headerShown: false }} />
        </Stack>
    );
}
