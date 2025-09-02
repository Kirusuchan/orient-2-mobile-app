
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // or true if you want a custom header

            }}
        />
    );
}
