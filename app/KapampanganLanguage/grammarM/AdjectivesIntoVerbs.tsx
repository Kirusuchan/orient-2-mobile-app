// app/KapampanganLanguage/grammarM/AdjectivesIntoVerbs.tsx
import CustomHeader from "@/components/CustomHeader";
import GrammarCard from "@/components/GrammarCard";
import ResponsiveText from "@/components/ResponsiveText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const AdjectivesIntoVerbs = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768; // breakpoint for responsive layout
  const { t } = useTranslation();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      <CustomHeader
        title={t('grammar.adjectivesIntoVerbs.title')} 
        fontSize={isTablet ? 50 : 30}
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          setShowScrollTop(yOffset > 200);
        }}
        scrollEventThrottle={16}
      >
        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginBottom: 16,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          <ResponsiveText baseSize={14} style={{ fontWeight: "bold" }}>
            Kapampángan verbs
          </ResponsiveText>{" "}
          can also be formed from adjectives. Native speakers often convert
          adjectives into verbs naturally.
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic" }}
          >
            Sa Filipino: Ang mga pandiwang Kapampangan ay maaari ring mabuo mula
            sa mga pang-uri. Karaniwang natural na ginagawa ito ng mga katutubong
            nagsasalita.
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginBottom: 16,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          Example of converting{" "}
          <ResponsiveText baseSize={14} style={{ fontWeight: "600" }}>
            &quot;ugly&quot;
          </ResponsiveText>{" "}
          into a verb:
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic" }}
          >
            Halimbawa ng pag-convert ng &quot;pangit&quot; sa isang pandiwa:
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginBottom: 24,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          • Matsûra, Tôira, Sûra{"\n"}
          • Sindra ne îng gagàwan ku. – He ruined my work.
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic" }}
          >
            – Ginawa niyang pangit ang aking trabaho.
          </ResponsiveText>
          {"\n"}• Note: In Tagalog this would be{" "}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            Pinangitan niya ang ginagawa ko
          </ResponsiveText>
          , which is not a native Tagalog formation.
        </ResponsiveText>

        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginBottom: 16,
            marginHorizontal: 4,
            textAlign: "justify",
            fontWeight: "bold",
          }}
        >
          Kapampángan Adjective-to-Verb Conjugation
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic", fontWeight: "normal" }}
          >
            Pagbubuo ng Kapampángan na Pandiyang mula sa Pang-uri sa Filipino
          </ResponsiveText>
        </ResponsiveText>

        {/* Responsive Grammar Cards */}
        <View
          style={{
            flexDirection: isTablet ? "row" : "column",
            flexWrap: isTablet ? "wrap" : "nowrap",
            justifyContent: isTablet ? "space-between" : "flex-start",
            gap: isTablet ? 12 : 0,
          }}
        >
          <View style={{ width: isTablet ? "48%" : "100%" }}>
            <GrammarCard
              verb="santing"
              meaning="handsome"
              symbol="santing"
              agentFocus={["sumanting", "sasanting", "mesanting"]}
              patientFocus={["santingan", "sasantingan", "sintingan"]}
            />
          </View>

          <View style={{ width: isTablet ? "48%" : "100%" }}>
            <GrammarCard
              verb="laga"
              meaning="beautiful"
              symbol="laga"
              agentFocus={["lagu", "lalagu", "melagu"]}
              patientFocus={["ilagu", "lalagu", "legu"]}
            />
          </View>

          <View style={{ width: isTablet ? "48%" : "100%" }}>
            <GrammarCard
              verb="sûra"
              meaning="ugly"
              symbol="sura"
              agentFocus={["sumura", "susura", "mesura"]}
              patientFocus={["suran", "susuran", "sinura"]}
            />
          </View>

          <View style={{ width: isTablet ? "48%" : "100%" }}>
            <GrammarCard
              verb="dagul"
              meaning="big"
              symbol="dagul"
              agentFocus={["dagul", "daragul", "meragul"]}
              patientFocus={["dagul", "daragul", "degul"]}
            />
          </View>

          <View style={{ width: isTablet ? "48%" : "100%" }}>
            <GrammarCard
              verb="lati"
              meaning="small"
              symbol="lati"
              agentFocus={["lati", "lalati", "melati"]}
              patientFocus={["ilati", "lalati", "leti"]}
            />
          </View>
        </View>

        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginTop: 24,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          Example Sentences:
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic" }}
          >
            Mga Halimbawa ng Pangungusap sa Filipino:
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={14}
          style={{
            color: "#1f2937",
            marginBottom: 8,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          •{" "}
          <ResponsiveText baseSize={14} style={{ fontWeight: "bold" }}>
            Sindra ne îng gagàwan ku.
          </ResponsiveText>{" "}
          – He made my work ugly.
          {"\n"}
          <ResponsiveText
            baseSize={14}
            style={{ fontStyle: "italic" }}
          >
            – Ginawa niyang pangit ang aking trabaho.
          </ResponsiveText>
        </ResponsiveText>
      </ScrollView>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: "#E6A817",
            padding: 12,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="chevron-up" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AdjectivesIntoVerbs;
