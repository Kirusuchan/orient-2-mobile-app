// app/CulturalInsights/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack  screenOptions={{
            headerShown: true, // or true if you want a custom header
            animation: 'fade', // optional: smoother transition
        }}>
            <Stack.Screen
                name="BeliefsAndPractices"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FestivalAndTradition"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="IndegenousReligion"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
