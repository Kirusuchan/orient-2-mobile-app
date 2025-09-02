// app/KapampanganLanguage/grammarM/DemonstrativePronouns.tsx
import CustomHeader from "@/components/CustomHeader";
import ResponsiveText from "@/components/ResponsiveText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";

const DemonstrativePronouns = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768; // breakpoint for responsive layout
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ✅ Data for pronouns (Near Speaker / Listener)
  const pronounGroups = [
    {
      title: "Near Speaker (This/These)",
      subtitle: "Malapit sa Nagsasalita (Ito/Ito Mga)",
      data: [
        { Case: "Absolutive", Singular: "ini, iti", Plural: "deni, reti" },
        { Case: "Ergative", Singular: "nini, niti", Plural: "dareni" },
        { Case: "Oblique", Singular: "kanini, kaniti", Plural: "kareni, kareti" },
        { Case: "Locative", Singular: "oyni, oyri", Plural: "areni, areti" },
        { Case: "Existential", Singular: "keni, keti", Plural: "-" },
      ],
    },
    {
      title: "Near Listener (That/Those)",
      subtitle: "Malapit sa Nakikinig (Iyon/Iyon Mga)",
      data: [
        { Case: "Absolutive", Singular: "iyan, ita", Plural: "den, ren" },
        { Case: "Ergative", Singular: "niyan, nita", Plural: "daren" },
        { Case: "Oblique", Singular: "kanyan, kanta", Plural: "karen" },
        { Case: "Locative", Singular: "oyan, oyta", Plural: "aren" },
        { Case: "Existential", Singular: "kan, kata", Plural: "-" },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-[#FDF7E3]">
      <CustomHeader
        title={t('grammar.demonstrativePronouns.title')} 
        fontSize={isTablet ? 50 : 30}
        showBackButton
        backButtonColor="#fff"
        onBackPress={() => router.back()}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
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
            Demonstrative pronouns
          </ResponsiveText>{" "}
          in Kapampangan are used to point to specific people, objects, or locations.
          {"\n"}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            Sa Filipino: Ginagamit ang mga panghalip na demonstrative sa Kapampangan upang ituro ang tiyak na tao, bagay, o lokasyon.
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
          They indicate whether something is near the speaker, near the listener, or far from both.
          {"\n"}
          <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
            Ipinapakita nito kung ang isang bagay ay malapit sa nagsasalita, malapit sa nakikinig, o malayo sa pareho.
          </ResponsiveText>
        </ResponsiveText>

        {/* Pronoun Groups */}
        {pronounGroups.map((group, idx) => (
          <View key={idx} className="bg-[#fff8e1] rounded-xl p-4 mb-6 shadow">
            <ResponsiveText
              baseSize={14}
              style={{ fontWeight: "bold", marginBottom: 4, color: "#92400e" }}
            >
              {group.title}
              {"\n"}
              <ResponsiveText
                baseSize={14}
                style={{ fontWeight: "normal", fontStyle: "italic" }}
              >
                {group.subtitle}
              </ResponsiveText>
            </ResponsiveText>

            {group.data.map((row, i) => (
              <ResponsiveText key={i} baseSize={14} style={{ marginBottom: 2 }}>
                • <ResponsiveText baseSize={14} style={{ fontWeight: "bold" }}>
                  {row.Case}
                </ResponsiveText>{" "}
                – Singular: {row.Singular}, Plural: {row.Plural}
              </ResponsiveText>
            ))}
          </View>
        ))}

        {/* Usage Notes Sections */}
        {[
          {
            title: "Iti vs. Ini",
            subtitle: "Iti vs. Ini",
            items: [
              ["Iti → Abstract & concrete (e.g., iting musika = this music)", "• Iti → Abstract at konkretong bagay (hal., iting musika = ang musika na ito)"],
              ["Ini → Always concrete (e.g., ining libru = this book)", "• Ini → Laging konkretong bagay (hal., ining libru = ang aklat na ito)"],
            ],
          },
          {
            title: "Keni vs. Keti",
            subtitle: "Keni vs. Keti",
            items: [
              ["Keni → When the listener is far from the subject", "• Keni → Kapag ang nakikinig ay malayo sa paksa"],
              ["Keti → When the listener is near the subject", "• Keti → Kapag ang nakikinig ay malapit sa paksa"],
              ["Example", "• Halimbawa: Dalawang tao sa parehong bansa ay gumagamit ng keti para sa kanilang bansa, ngunit keni para sa kanilang sariling bayan."],
            ],
          },
          {
            title: "Asking & Identifying",
            subtitle: "Pagtatanong at Pagkilala",
            items: [
              ["Nanu ini? → What's this?", "• Nanu ini? → Ano ito?"],
              ["Ninu ing lalaking ita? → Who is that man?", "• Ninu ing lalaking ita? → Sino ang lalaking iyon?"],
              ["Ninu ing anak a yan? → Who is that child?", "• Ninu ing anak a yan? → Sino ang batang iyon?"],
            ],
          },
          {
            title: "Location & Direction",
            subtitle: "Lokasyon at Direksyon",
            items: [
              ["Me keni, munta ka keni! → Come here!", "• Me keni, munta ka keni! → Halika rito!"],
              ["Ati ku keti / Atsu ku keni / Atyu ku keni! → I am here!", "• Ati ku keti / Atsu ku keni / Atyu ku keni! → Nandito ako!"],
              ["Mangan la keta. → They will eat there.", "• Mangan la keta. → Kakain sila doon."],
            ],
          },
          {
            title: "Expressions & Reactions",
            subtitle: "Mga Ekspresyon at Reaksyon",
            items: [
              ["Uyta/Oyta ya pala ing salamin mu! → So that's where your glasses are!", "• Uyta/Oyta ya pala ing salamin mu! → Ayan pala ang iyong salamin!"],
              ["E ku pa menakit makanyan/makanini. → I haven't seen one of these before.", "• E ku pa menakit makanyan/makanini. → Hindi ko pa ito nakita dati."],
            ],
          },
          {
            title: "Describing & Tastes",
            subtitle: "Paglalarawan at Lasa",
            items: [
              ["Mangabanglu la rening sampaga! → These flowers smell nice!", "• Mangabanglu la rening sampaga! → Mabango ang mga bulaklak na ito!"],
              ["Manyaman la ren/Manyaman la den! → Those are delicious!", "• Manyaman la ren/Manyaman la den! → Masarap ang mga iyon!"],
              ["Ayni/Areni/Oreni la reng adwang regalo para keka! → Here are two gifts for you!", "• Ayni/Areni/Oreni la reng adwang regalo para keka! → Heto ang dalawang regalo para sa iyo!"],
            ],
          },
          {
            title: "Affection & Love",
            subtitle: "Pagmamahal at Pag-ibig",
            items: [
              ["Buri daka! → I like you!", "• Buri daka! → Gusto kita!"],
              ["Kaluguran daka! → I love you!", "• Kaluguran daka! → Mahal kita!"],
              ["Mangan tana! → Let's eat!", "• Mangan tana! → Kain tayo!"],
              ["Edaka buring mawala! → I don’t want to lose you!", "• Edaka buring mawala! → Ayokong mawala ka!"],
            ],
          },
        ].map((section, i) => (
          <View key={i} className="mb-6">
            <ResponsiveText
              baseSize={14}
              style={{ fontWeight: "bold", marginBottom: 2, color: "#92400e" }}
            >
              {section.title}
              {"\n"}
              <ResponsiveText baseSize={14} style={{ fontWeight: "normal", fontStyle: "italic" }}>
                {section.subtitle}
              </ResponsiveText>
            </ResponsiveText>

            {section.items.map((item, j) => (
              <ResponsiveText key={j} baseSize={14} style={{ marginBottom: 2 }}>
                {item[0]}
                {"\n"}
                <ResponsiveText baseSize={14} style={{ fontStyle: "italic" }}>
                  {item[1]}
                </ResponsiveText>
              </ResponsiveText>
            ))}
          </View>
        ))}
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

export default DemonstrativePronouns;
