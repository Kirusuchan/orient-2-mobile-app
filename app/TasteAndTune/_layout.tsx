// app/TasteAndTune/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true, // or true if you want a custom header
                animation: 'fade', // optional: smoother transition
            }}
        >
            <Stack.Screen
            name="FolkSongsLibrary"
            options={{ headerShown: false }}
            />

            <Stack.Screen
                name="CuisineGallery"
                options={{ headerShown: false }}
            />


        </Stack>
    );
}
