// app/KapampanganLanguage/grammarM/Pronouns.tsx
import CustomHeader from "@/components/CustomHeader";
import ResponsiveText from "@/components/ResponsiveText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";


const Pronouns = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768; // breakpoint for responsive layout
   const { t } = useTranslation();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ✅ Cases Data (single-column layout instead of table)
  const pronounCases = [
    {
      title: "Independent (Absolute)",
      subtitle: "Malayang gamit",
      data: {
        "1st Singular": "yaku, i aku, aku",
        "2nd Singular": "ika",
        "3rd Singular": "iya, ya",
        "1st Dual": "ikata",
        "1st Plural Inclusive": "ikatamu, itamu",
        "1st Plural Exclusive": "ikami, ike",
        "2nd Plural": "ikayu, iko",
        "3rd Plural": "ila",
      },
    },
    {
      title: "Enclitic",
      subtitle: "Pantulong na anyo",
      data: {
        "1st Singular": "ku",
        "2nd Singular": "ka",
        "3rd Singular": "ya",
        "1st Dual": "kata, ta",
        "1st Plural Inclusive": "katamu, tamu",
        "1st Plural Exclusive": "kami, ke",
        "2nd Plural": "kayu, ko",
        "3rd Plural": "la",
      },
    },
    {
      title: "Ergative (Agent)",
      subtitle: "Tagaganap",
      data: {
        "1st Singular": "ku",
        "2nd Singular": "mu",
        "3rd Singular": "na",
        "1st Dual": "ta",
        "1st Plural Inclusive": "tamu, ta",
        "1st Plural Exclusive": "mi",
        "2nd Plural": "yu",
        "3rd Plural": "da, ra",
      },
    },
    {
      title: "Oblique (Object)",
      subtitle: "Layon",
      data: {
        "1st Singular": "kanaku, kaku",
        "2nd Singular": "keka",
        "3rd Singular": "keya, kaya",
        "1st Dual": "kekata",
        "1st Plural Inclusive": "kekatamu, kekata",
        "1st Plural Exclusive": "kekami, keke",
        "2nd Plural": "kekayu, keko",
        "3rd Plural": "karela",
      },
    },
  ];

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      <CustomHeader
        title={t('grammar.pronouns.title')} 
        fontSize={isTablet ? 50 : 30}
        showBackButton
        onBackPress={() => router.back()}
        backButtonColor="#fff"
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          setShowScrollTop(yOffset > 200);
        }}
        scrollEventThrottle={16}
      >
        {/* Intro */}
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
            Kapampángan pronouns
          </ResponsiveText>{" "}
          are used to replace nouns and indicate the person, number, and case in
          a sentence.
          {"\n"}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            Sa Filipino: Ginagamit ang mga panghalip Kapampángan upang palitan
            ang mga pangngalan at ipakita ang tao, bilang, at kaso sa
            pangungusap.
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
          Kapampángan pronouns show three-way case distinction:{" "}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            absolute (independent), ergative (agent), and oblique (object)
          </ResponsiveText>
          . There are also dual forms and inclusive/exclusive plurals.
          {"\n"}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            Ipinapakita ng mga panghalip Kapampángan ang tatlong uri ng kaso:
            absolute (independent), ergative (agent), at oblique (object).
            Mayroon ding dual forms at inclusive/exclusive plurals.
          </ResponsiveText>
        </ResponsiveText>

        {/* ✅ Pronoun Cases - Vertical Layout */}
        {pronounCases.map((caseItem, index) => (
          <View
            key={index}
            className="bg-[#fff8e1] rounded-xl p-4 mb-6 shadow"
          >
            <ResponsiveText
              baseSize={14}
              style={{
                fontWeight: "bold",
                marginBottom: 8,
                color: "#92400e",
              }}
            >
              {caseItem.title}
              {"\n"}
              <ResponsiveText
                baseSize={14}
                style={{ fontWeight: "normal", fontStyle: "italic" }}
              >
                {caseItem.subtitle}
              </ResponsiveText>
            </ResponsiveText>

            {Object.entries(caseItem.data).map(([person, form], i) => (
              <ResponsiveText
                key={i}
                baseSize={14}
                style={{ marginBottom: 2 }}
              >
                •{" "}
                <ResponsiveText baseSize={14} style={{ fontWeight: "bold" }}>
                  {person}
                </ResponsiveText>
                : {form}
              </ResponsiveText>
            ))}
          </View>
        ))}

        {/* Key Features */}
        <View className="mb-6">
          <ResponsiveText
            baseSize={14}
            style={{ fontWeight: "bold", marginBottom: 4, color: "#92400e" }}
          >
            Key Features of Kapampángan Pronouns
            {"\n"}
            <ResponsiveText
              baseSize={14}
              style={{ fontWeight: "normal", fontStyle: "italic" }}
            >
              Pangunahing Katangian ng mga Panghalip Kapampángan
            </ResponsiveText>
          </ResponsiveText>

          <ResponsiveText baseSize={14} style={{ marginBottom: 2 }}>
            • Three-way Case Distinction: Absolute (independent/nominative),
            Ergative (agent/subject), Oblique (object)
            {"\n"}
            <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
              • Tatlong uri ng Kaso: Absolute (independent/nominative), Ergative
              (agent/subject), Oblique (object)
            </ResponsiveText>
          </ResponsiveText>
          <ResponsiveText baseSize={14} style={{ marginBottom: 2 }}>
            • Number and Clusivity: Dual form (ikata) for speaker + one listener,
            Inclusive (ikatamu) vs. Exclusive (ikami) distinction in plural
            {"\n"}
            <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
              • Bilang at Clusivity: Dual form (ikata) para sa speaker +
              listener, Inclusive (ikatamu) vs Exclusive (ikami)
            </ResponsiveText>
          </ResponsiveText>
          <ResponsiveText baseSize={14} style={{ marginBottom: 2 }}>
            • Special Forms with{" "}
            <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
              ati
            </ResponsiveText>{" "}
            (there is) and{" "}
            <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
              ala
            </ResponsiveText>{" "}
            (there isn’t)
            {"\n"}
            <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
              • Mga Espesyal na Porma: ati (mayroon) at ala (wala)
            </ResponsiveText>
          </ResponsiveText>
        </View>

        {/* Basic Sentences */}
        <View className="mb-6">
          <ResponsiveText
            baseSize={14}
            style={{ fontWeight: "bold", marginBottom: 4, color: "#92400e" }}
          >
            Basic Sentence Structures
            {"\n"}
            <ResponsiveText
              baseSize={14}
              style={{ fontWeight: "normal", fontStyle: "italic" }}
            >
              Mga Pangunahing Estruktura ng Pangungusap
            </ResponsiveText>
          </ResponsiveText>

          {[
            ["Sinulat ku", "I wrote", "Isinulat ko"],
            ["Silatanan na ku", "He/she wrote me", "Sinulat niya ako"],
            ["Dintang ya", "He/she arrived", "Dumating siya"],
            ["Mamasa la", "They are reading", "Nagbabasa sila"],
          ].map((item, index) => (
            <ResponsiveText key={index} baseSize={14} style={{ marginBottom: 2 }}>
              •{" "}
              <ResponsiveText baseSize={14} style={{ fontWeight: "bold" }}>
                {item[0]}
              </ResponsiveText>{" "}
              – {item[1]}
              {"\n"}
              <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
                – {item[2]}
              </ResponsiveText>
            </ResponsiveText>
          ))}
        </View>
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

export default Pronouns;
