// app/KapampanganLanguage/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // or true if you want a custom header
                animation: 'fade', // optional: smoother transition
            }}
        />
    );
}
