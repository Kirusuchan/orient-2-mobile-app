import { questionMap } from '@/utils/questionMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Pair = { term: string; definition: string };
type AnswerOption = { id: string; value: string };

const styles = StyleSheet.create({
  kulitanFont: {
    fontFamily: 'KulitanHandwriting',
  },
});

export default function Matching() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const scale = isTablet ? 1.2 : width / 375;

  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const normalizedTopic = topic?.toLowerCase() ?? '';
  const isKulitanTopic = normalizedTopic === 'alphabets';

  const { t, i18n } = useTranslation();

  const [fontsLoaded] = useFonts({
    KulitanHandwriting: require('@/assets/fonts/KulitanHandwriting.otf'),
  });

  const [allQuestions, setAllQuestions] = useState<Pair[]>([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [questions, setQuestions] = useState<Pair[]>([]);
  const [availableDefs, setAvailableDefs] = useState<AnswerOption[]>([]);
  const [matches, setMatches] = useState<{ [term: string]: AnswerOption | null }>({});
  const [selectedDef, setSelectedDef] = useState<AnswerOption | null>(null);
  const [reviewAnswers, setReviewAnswers] = useState<{ question: string; selected: string }[]>([]);
  const [started, setStarted] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [timer, setTimer] = useState(150);
  const [examCompleted, setExamCompleted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const defsScrollRef = useRef<ScrollView>(null);
  const quesScrollRef = useRef<ScrollView>(null);

  const shuffle = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

  // Load questions depending on language
  useEffect(() => {
    const key = normalizedTopic as keyof typeof questionMap;
    const importer = questionMap[key]?.[i18n.language as 'en' | 'tl'];

    if (importer) {
      importer()
        .then((mod) => {
          const data = shuffle(mod.default as Pair[]).slice(0, 15);
          setAllQuestions(data);
          loadSet(data, 0);
        })
        .catch((err) => console.error('Failed to load matching data:', err));
    }
  }, [topic, i18n.language]);

  useEffect(() => {
    // Set exam in progress flag when starting
    if (started && !examCompleted) {
      AsyncStorage.setItem('exam_in_progress', 'matching');
    }
  }, [started, examCompleted]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (examCompleted) {
        AsyncStorage.removeItem('exam_in_progress');
      }
    };
  }, [examCompleted]);

  const loadSet = (data: Pair[], setIndex: number) => {
    const slice = data.slice(setIndex * 5, setIndex * 5 + 5);
    setQuestions(slice);

    const defsWithIds: AnswerOption[] = slice.map((q, i) => ({
      id: `${setIndex}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      value: q.definition,
    }));

    const remaining = data.filter((q) => !slice.includes(q));
    const distractors = shuffle(remaining).slice(0, 2).map((q, i) => ({
      id: `${setIndex}-d${i}-${Math.random().toString(36).substring(2, 7)}`,
      value: q.definition,
    }));

    setAvailableDefs(shuffle([...defsWithIds, ...distractors]));

    const initialMatches: { [term: string]: AnswerOption | null } = {};
    slice.forEach((q) => (initialMatches[q.term] = null));
    setMatches(initialMatches);
    setTimer(150);

    defsScrollRef.current?.scrollTo({ y: 0, animated: false });
    quesScrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  useEffect(() => {
    if (!started || !questions.length || examCompleted) return;
    startTimer();
    return () => stopTimer();
  }, [started, questions, examCompleted]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!examCompleted) {
        setShowExitModal(true);
        return true;
      }
      return false; // Allow back navigation if exam is completed
    });
    return () => sub.remove();
  }, [examCompleted]);

  const startTimer = () => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSelectSlot = (term: string) => {
    if (examCompleted) return; // Prevent interaction if exam is completed
    
    const currentAnswer = matches[term];
    if (currentAnswer) {
      setAvailableDefs((prev) => [...prev, currentAnswer]);
      setMatches((prev) => ({ ...prev, [term]: null }));
      return;
    }
    if (selectedDef) {
      setMatches((prev) => ({ ...prev, [term]: selectedDef }));
      setAvailableDefs((prev) => prev.filter((d) => d.id !== selectedDef.id));
      setSelectedDef(null);
    }
  };

  const saveAnswersAndProceed = async () => {
    const currentReviewData = questions.map((q) => ({
      question: q.term,
      selected: matches[q.term]?.value || 'No answer',
    }));

    const updated = [...reviewAnswers, ...currentReviewData];
    setReviewAnswers(updated);

    if (currentSet < 2) {
      const nextSet = currentSet + 1;
      setCurrentSet(nextSet);
      loadSet(allQuestions, nextSet);
    } else {
      const totalCorrect = allQuestions.filter((q) => {
        const answer = updated.find((d) => d.question === q.term);
        return answer?.selected === q.definition;
      }).length;

      const passed = totalCorrect / allQuestions.length >= 0.75;

      try {
        // Save results
        await AsyncStorage.setItem(`score_${topic}`, totalCorrect.toString());
        await AsyncStorage.setItem(`total_${topic}`, allQuestions.length.toString());
        if (passed) {
          await AsyncStorage.setItem(`assessment_${topic}_passed`, 'true');
        }

        // Clear the exam in progress flag immediately
        await AsyncStorage.removeItem('exam_in_progress');
        
        // Mark exam as completed
        setExamCompleted(true);

        // Save review answers
        await AsyncStorage.setItem(`reviewAnswers_${topic}_matching`, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving matching results', e);
      }

      stopTimer();

      router.replace({
        pathname: '/Assessment/result',
        params: {
          topic: topic ?? '',
          score: totalCorrect.toString(),
          total: allQuestions.length.toString(),
          type: 'matching',
        },
      });
    }
  };

  const handleNextSet = async () => {
    if (examCompleted) return; // Prevent action if exam is completed
    stopTimer();
    await saveAnswersAndProceed();
  };

  const handleTimeout = async () => {
    if (examCompleted) return; // Prevent action if exam is completed
    stopTimer();
    await saveAnswersAndProceed();
  };

  const allAnswered = Object.values(matches).every((val) => val !== null);

  if (!fontsLoaded) return <Text style={{ padding: 16 * scale }}>Loading fonts...</Text>;
  if (!questions.length) return <Text style={{ padding: 16 * scale }}>Loading questions...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf7e3' }} edges={['top']}>
      <Stack.Screen options={{ headerLeft: () => null, gestureEnabled: false }} />

      {/* Instructions Modal */}
      <Modal visible={showInstructionsModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 * scale }}>
          <View style={{ backgroundColor: '#FDF7E3', padding: 20 * scale, borderRadius: 16, width: '100%', maxWidth: 400, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>{t('matching_instructions_title')}</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>{t('matching_instructions_text')} ({'7 options per set'})</Text>
            <TouchableOpacity onPress={() => { setShowInstructionsModal(false); setStarted(true); }} style={{ backgroundColor: '#facc15', padding: 10, borderRadius: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('matching_start')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exit Modal - Only show if exam is not completed */}
      {!examCompleted && (
        <Modal visible={showExitModal} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 * scale }}>
            <View style={{ backgroundColor: '#FDF7E3', padding: 20 * scale, borderRadius: 16, width: '100%', maxWidth: 400, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>{t('matching_exit_title')}</Text>
              <Text style={{ textAlign: 'center', marginBottom: 20 }}>{t('matching_exit_text')}</Text>
              <TouchableOpacity onPress={() => setShowExitModal(false)} style={{ backgroundColor: '#facc15', padding: 10, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('matching_ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Game UI */}
      {started && (
        <View style={{ flex: 1, padding: 20 }}>
          {/* Timer / Progress bar */}
          <View style={{ marginBottom: 8 * scale, width: '100%', paddingHorizontal: 16 * scale, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <View style={{ flex: 1, height: 12 * scale, backgroundColor: '#fde68a', borderRadius: 50, overflow: 'hidden', marginHorizontal: 20 * scale }}>
                <View style={{ height: '100%', backgroundColor: '#facc15', width: `${((currentSet + 1) / 3) * 100}%` }} />
              </View>
            </View>
            <Text style={{ fontSize: Math.round(12 * scale), color: '#dc2626', fontWeight: '600', marginTop: 6 * scale }}>
              {t('matching_time_left', { seconds: timer })}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flex: 1 }}>
            {/* Definitions */}
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={{ textAlign: 'center', marginBottom: 8 }}>{t('matching_definitions')} (7)</Text>
              <ScrollView ref={defsScrollRef}>
                {availableDefs.map((def) => (
                  <TouchableOpacity 
                    key={def.id} 
                    onPress={() => !examCompleted && setSelectedDef(def)} 
                    style={{ 
                      padding: 16, 
                      minHeight: 60, 
                      borderRadius: 12, 
                      backgroundColor: selectedDef?.id === def.id ? '#16a34a' : '#eca71e', 
                      marginBottom: 12, 
                      justifyContent: 'center', 
                      shadowColor: '#000', 
                      shadowOpacity: 0.1, 
                      shadowRadius: 4, 
                      shadowOffset: { width: 0, height: 2 }, 
                      elevation: 3,
                      opacity: examCompleted ? 0.7 : 1
                    }}
                  >
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{def.value}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Questions */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', marginBottom: 8 }}>{t('matching_questions')} (5)</Text>
              <ScrollView ref={quesScrollRef}>
                {questions.map((q, idx) => (
                  <View key={idx} style={{ marginBottom: 15 }}>
                    <View style={{ backgroundColor: '#eca71e', padding: 12, borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
                      <Text style={[{ textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#374151' }, isKulitanTopic ? styles.kulitanFont : {}]}>{q.term}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => !examCompleted && handleSelectSlot(q.term)} 
                      style={{ 
                        minHeight: 60, 
                        padding: 16, 
                        borderRadius: 12, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: matches[q.term] ? '#16a34a' : '#f3f4f6', 
                        borderWidth: 1, 
                        borderColor: matches[q.term] ? '#16a34a' : '#e5e7eb', 
                        shadowColor: '#000', 
                        shadowOpacity: 0.1, 
                        shadowRadius: 4, 
                        shadowOffset: { width: 0, height: 2 }, 
                        elevation: 3,
                        opacity: examCompleted ? 0.7 : 1
                      }}
                    >
                      <Text style={{ color: matches[q.term] ? 'white' : '#6b7280', fontWeight: matches[q.term] ? 'bold' : 'normal' }}>{matches[q.term]?.value || t('matching_placeholder')}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {!examCompleted && (
            <TouchableOpacity 
              onPress={handleNextSet} 
              disabled={!allAnswered} 
              style={{ 
                marginTop: 20, 
                padding: 12, 
                borderRadius: 10, 
                backgroundColor: allAnswered ? '#facc15' : '#d1d5db' 
              }}
            >
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: allAnswered ? 'white' : '#6b7280' }}>
                {currentSet < 2 ? t('matching_next') : t('matching_finish')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}