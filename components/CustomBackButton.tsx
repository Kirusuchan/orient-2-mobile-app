// components/CustomBackButton.tsx
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type Props = {
    label?: string;
    color?: string;
};

export default function CustomBackButton({ label = 'Back', color = '#000' }: Props) {
    return (
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <Ionicons name="chevron-back" size={24} color={color} />
            <Text style={{ color, fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    );
}
