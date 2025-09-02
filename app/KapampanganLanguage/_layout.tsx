// app/KapampanganLanguage/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack  screenOptions={{
            headerShown: true, // or true if you want a custom header
            animation: 'fade', // optional: smoother transition
        }}>
            <Stack.Screen
                name="alphabetsM"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="vocabM"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="grammarM"
                options={{ headerShown: false }}
            />
        </Stack>



    );
}
