import CustomHeader from '@/components/CustomHeader';
import ResponsiveText from '@/components/ResponsiveText';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Add this import
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const teamMembers = [
  { name: 'Cristian C. Cunanan', role: 'Lead Programmer', fb: 'https://www.facebook.com/Kirusuchan30/.', image: require('@/assets/images/cristian.jpg') },
  { name: 'Joshua Gabatin', role: 'Co-Programmer', fb: 'https://www.facebook.com/gri.eve.10', image: require('@/assets/images/joshua.png') },
  { name: 'John Bryan T. Palabay', role: 'Project Manager', fb: 'https://www.facebook.com/bryan.palabay.10', image: require('@/assets/images/bryan.jpg') },
  { name: 'Aimer Nichole S. Pante', role: 'Member', fb: 'https://www.facebook.com/aimerpanget', image: require('@/assets/images/aimer.jpg') },
  { name: 'Kaycelle Cunanan', role: 'Member', fb: 'https://www.facebook.com/kaycelle.cunanan', image: require('@/assets/images/kaycelle.jpg') },
  { name: 'Glaycel VIllamor', role: 'Member', fb: 'https://www.facebook.com/glace.villamor', image: require('@/assets/images/glaycel.jpg') },
  { name: 'Nathalie Guevarra', role: 'Member', fb: 'https://www.facebook.com/nath.valid', image: require('@/assets/images/nathalie.jpg') },
];

export default function About() {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    'SegoeUI': require('@/assets/fonts/Segoe UI.ttf'),
  });
  const [showExitModal, setShowExitModal] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const teamImageSize = isTablet ? width * 0.15 : width * 0.22;
  const partnerLogoSize = isTablet ? width * 0.22 : width * 0.3;
  const bigLogoSize = isTablet ? width * 0.3 : width * 0.4;
  const containerWidth = isTablet ? '80%' : '100%';

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF7E3' }}>
      <Stack.Screen options={{ 
        headerShown: false,
        gestureEnabled: false 
      }} />
      <CustomHeader title={t("about.title")} />

      <ScrollView contentContainerStyle={{ paddingVertical: 25, alignItems: 'center', paddingBottom: 100 }}>
        <View style={{ width: containerWidth, paddingHorizontal: 20 }}>
          {/* Intro */}
          <ResponsiveText
            baseSize={isTablet ? 20 : 16}
            style={{
              fontFamily: 'SegoeUI',
              color: '#444',
              textAlign: 'justify',
              lineHeight: isTablet ? 28 : 22,
              marginBottom: 24,
            }}
          >
            {t("about.description")}
          </ResponsiveText>

          {/* Developers Section */}
          <ResponsiveText
            baseSize={isTablet ? 26 : 22}
            style={{
              fontFamily: 'SegoeUI',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#333',
              marginBottom: 16,
            }}
          >
            {t("about.team")}
          </ResponsiveText>

          <View className="flex-wrap flex-row justify-center gap-y-8">
            {teamMembers.map((member, index) => (
              <View key={index} className="items-center mx-3 relative" style={{ width: teamImageSize + 50 }}>
                <View
                  style={{
                    position: 'relative',
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 5,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={member.image}
                    style={{
                      width: teamImageSize,
                      height: teamImageSize,
                      borderRadius: teamImageSize / 2,
                      borderWidth: 2,
                      borderColor: '#FACC15',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => Linking.openURL(member.fb)}
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                    }}
                  >
                    <FontAwesome name="facebook-official" size={isTablet ? 26 : 20} color="#1877F2" />
                  </TouchableOpacity>
                </View>

                <ResponsiveText
                  baseSize={isTablet ? 16 : 14}
                  style={{
                    fontFamily: 'SegoeUI',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 6,
                  }}
                >
                  {member.name}
                </ResponsiveText>
                <ResponsiveText
                  baseSize={isTablet ? 14 : 12}
                  style={{
                    fontFamily: 'SegoeUI',
                    color: '#666',
                    textAlign: 'center',
                  }}
                >
                  {member.role}
                </ResponsiveText>
              </View>
            ))}
          </View>

          {/* Acknowledgement */}
          <View className="mt-16 items-center px-4">
            <ResponsiveText
              baseSize={isTablet ? 24 : 20}
              style={{
                fontFamily: 'SegoeUI',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#333',
              }}
            >
              {t("about.acknowledgementTitle")}
            </ResponsiveText>
            <ResponsiveText
              baseSize={isTablet ? 18 : 16}
              style={{
                fontFamily: 'SegoeUI',
                color: '#444',
                textAlign: 'justify',
                marginTop: 12,
                lineHeight: isTablet ? 28 : 22,
              }}
            >
              {t("about.acknowledgementText")}
            </ResponsiveText>

            {/* Special thanks for Kapampangan deities */}
            <ResponsiveText
              baseSize={isTablet ? 18 : 16}
              style={{
                fontFamily: 'SegoeUI',
                color: '#444',
                textAlign: 'justify',
                marginTop: 16,
                lineHeight: isTablet ? 28 : 22,
              }}
            >
              {t("about.acknowledgementSpecialThanks", {
                name: "Gener A. Pedriña"
              })}
            </ResponsiveText>

            {/* ✅ Sanduguan Image */}
            <Image
              source={require('@/assets/images/sanduguan.png')}
              style={{
                width: isTablet ? width * 0.5 : width * 0.8,
                height: isTablet ? width * 0.35 : width * 0.5,
                resizeMode: 'contain',
                marginTop: 20,
                borderRadius: 12,
              }}
            />

            {/* Cultural Partners Logos */}
            <View className="flex-row justify-center gap-x-8 mt-6">
              {/* Arti Sta. Rita */}
              <View style={{ position: 'relative', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, elevation: 3 }}>
                <Image
                  source={require('@/assets/images/artistarita.jpg')}
                  style={{
                    width: partnerLogoSize,
                    height: partnerLogoSize,
                    borderRadius: partnerLogoSize / 2,
                    borderWidth: 2,
                    borderColor: '#FACC15',
                  }}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.facebook.com/artistarita.ph')}
                  style={{ position: 'absolute', bottom: -2, right: -2 }}
                >
                  <FontAwesome name="facebook-official" size={isTablet ? 30 : 24} color="#1877F2" />
                </TouchableOpacity>
              </View>

              {/* Kapampangan Studies */}
              <View style={{ position: 'relative', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5, elevation: 3 }}>
                <Image
                  source={require('@/assets/images/KS.jpg')}
                  style={{
                    width: partnerLogoSize,
                    height: partnerLogoSize,
                    borderRadius: partnerLogoSize / 2,
                    borderWidth: 2,
                    borderColor: '#FACC15',
                  }}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.facebook.com/haucks')}
                  style={{ position: 'absolute', bottom: -2, right: -2 }}
                >
                  <FontAwesome name="facebook-official" size={isTablet ? 30 : 24} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Institutional Partners */}
          <View className="mt-16">
            <ResponsiveText
              baseSize={isTablet ? 24 : 20}
              style={{
                fontFamily: 'SegoeUI',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#333',
              }}
            >
              {t("about.partners")}
            </ResponsiveText>

            {/* Logos */}
            <View className="flex-row justify-center gap-x-12 mt-6">
              {/* DCT */}
              <View
                style={{
                  position: 'relative',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 5,
                  elevation: 3,
                }}
              >
                <Image
                  source={require('@/assets/images/DCT.png')}
                  style={{
                    width: bigLogoSize,
                    height: bigLogoSize,
                    borderRadius: bigLogoSize / 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.facebook.com/dctcollegedepartment')}
                  style={{ position: 'absolute', bottom: -4, right: -4 }}
                >
                  <FontAwesome name="facebook-official" size={isTablet ? 36 : 28} color="#1877F2" />
                </TouchableOpacity>
              </View>

              {/* CCS */}
              <View
                style={{
                  position: 'relative',
                  shadowColor: '#000',
                  shadowOpacity: 0.15,
                  shadowRadius: 5,
                  elevation: 3,
                }}
              >
                <Image
                  source={require('@/assets/images/CCS.png')}
                  style={{
                    width: bigLogoSize,
                    height: bigLogoSize,
                    borderRadius: bigLogoSize / 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.facebook.com/dctccsofficial')}
                  style={{ position: 'absolute', bottom: -4, right: -4 }}
                >
                  <FontAwesome name="facebook-official" size={isTablet ? 36 : 28} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* References */}
          <ResponsiveText
            baseSize={isTablet ? 24 : 20}
            style={{
              fontFamily: 'SegoeUI',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            {t("about.references")}
          </ResponsiveText>
          {[
            'ref1',
            'ref2',
            'ref3',
            'ref4',
            'ref5',
            'ref6',
            'ref7',
            'ref8',
            'ref9',
          ].map((ref, idx) => (
            <ResponsiveText
              key={idx}
              baseSize={isTablet ? 16 : 14}
              style={{
                fontFamily: 'SegoeUI',
                color: '#444',
                marginBottom: 6,
                textAlign: 'justify',
                lineHeight: isTablet ? 24 : 20,
              }}
            >
              {t(`about.${ref}`)}
            </ResponsiveText>
          ))}
        </View>
      </ScrollView>

      {/* Exit Confirmation Modal */}
      <Modal transparent visible={showExitModal} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgada(0,0,0,0.4)",
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