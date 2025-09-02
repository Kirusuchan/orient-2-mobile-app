// components/CustomHeader.tsx
import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    ImageBackground,
    Pressable,
    Text,
    useWindowDimensions,
    ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomHeaderProps = {
    title: string;
    fontSize?: number;
    showBackButton?: boolean;
    onBackPress?: () => void;
    backButtonColor?: string;
    paddingBottom?: number;
    style?: ViewStyle; // Added style prop
};

export default function CustomHeader({
    title,
    fontSize = 40,
    showBackButton = false,
    onBackPress,
    backButtonColor = '#fff',
    paddingBottom,
    style, // Destructure style prop
}: CustomHeaderProps) {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const scale = width / 375;
    const isTablet = width >= 768;

    const responsiveFontSize = isTablet
        ? fontSize + 6
        : Math.round(fontSize * scale);

    const headerHeight = isTablet ? 140 : 160 * scale;

    return (
        <ImageBackground
            source={images.header}
            resizeMode="cover"
            style={[
                {
                    width: '100%',
                    height: headerHeight,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: paddingBottom ?? (isTablet ? 16 : 20 * scale),
                },
                style, // Apply the passed style
            ]}
        >
            {showBackButton && (
                <Pressable
                    onPress={onBackPress ? onBackPress : () => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.push("/");
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: insets.top + 8,
                        left: 12,
                        padding: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        zIndex: 10,
                    }}
                    hitSlop={10}
                >
                    <Ionicons
                        name="chevron-back"
                        size={isTablet ? 32 : 28 * scale}
                        color={backButtonColor}
                    />
                </Pressable>
            )}

            <Text
                style={{
                    color: 'white',
                    fontSize: responsiveFontSize,
                    fontWeight: '600',
                    fontFamily: 'SegoeUIBlack',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
            >
                {title}
            </Text>
        </ImageBackground>
    );
}