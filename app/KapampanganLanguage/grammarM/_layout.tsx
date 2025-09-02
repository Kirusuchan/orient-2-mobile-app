import { Stack } from 'expo-router';

export default function VocabMLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
        />
    );
}
