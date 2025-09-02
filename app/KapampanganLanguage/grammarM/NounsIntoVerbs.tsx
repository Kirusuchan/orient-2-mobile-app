// app/KapampanganLanguage/grammarM/NounsIntoVerbs.tsx
import CustomHeader from "@/components/CustomHeader";
import GrammarCard from "@/components/GrammarCard";
import ResponsiveText from "@/components/ResponsiveText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View, useWindowDimensions } from "react-native";

const NounsIntoVerbs = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { width } = useWindowDimensions();
    const { t } = useTranslation();

  const isTablet = width >= 768; // ✅ tablet breakpoint

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FDF7E3" }}>
      <CustomHeader
        title={t('grammar.nounsIntoVerbs.title')} 
        fontSize={isTablet ? 50 : 30} // ✅ larger for tablets
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 40 : 16, // ✅ wider side padding
          paddingVertical: isTablet ? 32 : 16,
          paddingBottom: 50,
        }}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          setShowScrollTop(yOffset > 200);
        }}
        scrollEventThrottle={16}
      >
        {/* Intro */}
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 24 : 16,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "bold" }}>
            Kapampángan verbs
          </ResponsiveText>{" "}
          have two forms according to Kitano (2008):{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
            Agent Focus
          </ResponsiveText>{" "}
          (the doer is emphasized) and{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
            Patient Focus
          </ResponsiveText>{" "}
          (the object is emphasized).
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            Sa Filipino: May dalawang anyo ang mga pandiwa sa Kapampangan ayon kay Kitano (2008):{" "}
            <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
              Agent Focus
            </ResponsiveText>{" "}
            (binibigyang-diin ang gumagawa) at{" "}
            <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
              Patient Focus
            </ResponsiveText>{" "}
            (binibigyang-diin ang bagay).
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 24 : 16,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          Example:{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
            Agent Focus
          </ResponsiveText>{" "}
          – Mangan (to eat) → Mámangan (will eat){"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
            Patient Focus
          </ResponsiveText>{" "}
          – Mangan → Kakanan (will be eaten)
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            Halimbawa sa Filipino:{" "}
            <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
              Agent Focus
            </ResponsiveText>{" "}
            – Kumain → Kakain,{" "}
            <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "600" }}>
              Patient Focus
            </ResponsiveText>{" "}
            – Kakainin.
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 28 : 24,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          Kapampángan can transform nouns into verbs more freely than Tagalog or Cebuano. Here are examples:
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            Sa Filipino: Mas malaya ang Kapampangan sa pag-convert ng pangngalan sa pandiwa kumpara sa Tagalog o Cebuano. Narito ang mga halimbawa:
          </ResponsiveText>
        </ResponsiveText>

        {/* Grammar Cards - one column with spacing */}
        <View style={{ flexDirection: "column", gap: isTablet ? 24 : 16 }}>
          <GrammarCard
            verb="telephone"
            meaning="to call/text"
            symbol="talepanu"
            agentFocus={["talepanu", "tatalepanu", "menalepanu"]}
            patientFocus={["talepanuan", "tatalepanuan", "telepanuan"]}
          />

          <GrammarCard
            verb="fur/feather"
            meaning="to pluck"
            symbol="bulbul"
            agentFocus={["mamulbul", "mamulbul", "memulbul"]}
            patientFocus={["bulbulan", "bubulbulan", "bilbulan"]}
          />

          <GrammarCard
            verb="small bridge"
            meaning="to cross"
            symbol="talete"
            agentFocus={["manalete", "manalete", "menalete"]}
            patientFocus={["taleten", "tataleten", "teleten"]}
          />

          <GrammarCard
            verb="head"
            meaning="to hit"
            symbol="buntuk"
            agentFocus={["mamuntuk", "mamuntok", "memuntuk"]}
            patientFocus={["buntukan", "bubuntukan", "bintukan"]}
          />

          <GrammarCard
            verb="text (SMS)"
            meaning="to send a text"
            symbol=""
            agentFocus={["mag-text", "mag-text", "mag-text"]}
            patientFocus={["text", "textext", "tinext"]}
          />
        </View>

        {/* Example Sentences */}
        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginTop: isTablet ? 28 : 24,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          Example Sentences:
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            Mga Halimbawa ng Pangungusap sa Filipino:
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 16 : 8,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          •{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "bold" }}>
            Tetext nákupu Robert.
          </ResponsiveText>{" "}
          – Robert is texting me.
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            – Nagte-text sa akin si Robert.
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 16 : 8,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          •{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "bold" }}>
            Berilan neng Gavrilo i Franz.
          </ResponsiveText>{" "}
          – Gavrilo shot Franz.
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            – Binaril ni Gavrilo si Franz.
          </ResponsiveText>
        </ResponsiveText>

        <ResponsiveText
          baseSize={isTablet ? 18 : 14}
          style={{
            color: "#1f2937",
            marginBottom: isTablet ? 16 : 8,
            marginHorizontal: 4,
            textAlign: "justify",
          }}
        >
          •{" "}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontWeight: "bold" }}>
            Mémaril ya i Gavrilo.
          </ResponsiveText>{" "}
          – Gavrilo fired his gun.
          {"\n"}
          <ResponsiveText baseSize={isTablet ? 18 : 14} style={{ fontStyle: "italic" }}>
            – Pinutok ni Gavrilo ang kanyang baril.
          </ResponsiveText>
        </ResponsiveText>
      </ScrollView>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <TouchableOpacity
          onPress={scrollToTop}
          style={{
            position: "absolute",
            bottom: isTablet ? 60 : 30,
            right: isTablet ? 50 : 20,
            backgroundColor: "#E6A817",
            padding: isTablet ? 18 : 12,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="chevron-up" size={isTablet ? 34 : 24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NounsIntoVerbs;
