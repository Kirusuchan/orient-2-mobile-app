import { questionMap } from '@/utils/questionMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  Animated,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type ReviewAnswer = {
  question: string;
  selected: string;
  correct: string;
};

const ANIMATION_DURATION = 250;
const QUESTION_LIMIT = 15;

export default function Multiple() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { width, height } = useWindowDimensions();
  const { t, i18n } = useTranslation();

  // ✅ detect tablet
  const isTablet = width >= 768;
  // ✅ scaling
  const scale = isTablet ? width / 900 : width / 375;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const isHandlingNext = useRef(false);
  const isQuizActive = useRef(true);

  // ✅ Load questions according to current language
  useEffect(() => {
    const load = async () => {
      const key = topic?.toLowerCase() as keyof typeof questionMap;
      if (key && questionMap[key]) {
        try {
          const lang = i18n.language as "en" | "tl";
          const data = await questionMap[key][lang]();
          const fullShuffled = [...data.default].sort(() => Math.random() - 0.5);
          const selectedQuestions = fullShuffled.slice(
            0,
            Math.min(QUESTION_LIMIT, fullShuffled.length)
          );
          setQuestions(selectedQuestions);
          await AsyncStorage.removeItem(`reviewAnswers_${topic}_multiple`);
        } catch (err) {
          console.error("Error loading assessment:", err);
        }
      }
    };
    load();
  }, [topic, i18n.language]);

  useEffect(() => {
    // Set exam in progress flag when starting
    if (started && !examCompleted) {
      AsyncStorage.setItem('exam_in_progress', 'multiple');
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

  // Disable hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (started && isQuizActive.current && !examCompleted) {
        setShowExitModal(true);
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [started, examCompleted]);

  useEffect(() => {
    if (!started || !questions.length || !isQuizActive.current || examCompleted) return;
    resetTimer();
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, started, examCompleted]);

  const resetTimer = () => {
    stopTimer();
    setTimer(30);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopTimer();
          setSelected(null);
          setTimeout(() => {
            if (started && isQuizActive.current && !examCompleted) handleNext();
          }, 100);
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


  const handleAnswer = (option: string) => {
    if (!isQuizActive.current || examCompleted) return;
    setSelected(option);
  };

  const handleNext = () => {
    if (isHandlingNext.current || !questions.length || !isQuizActive.current || examCompleted) return;
    isHandlingNext.current = true;

    const currentQuestion = questions[index];
    const userAnswer = selected ?? 'No Answer';
    const isCorrect = userAnswer === currentQuestion.answer;

    Animated.timing(animatedTranslateX, {
      toValue: -1000,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      processNext(currentQuestion, userAnswer, isCorrect);
    });
  };

  const processNext = async (
    question: Question,
    userAnswer: string,
    isCorrect: boolean
  ) => {
    stopTimer();
    if (!isQuizActive.current || examCompleted) return;

    const reviewKey = `reviewAnswers_${topic}_multiple`;
    const reviewEntry: ReviewAnswer = {
      question: question.question,
      selected: userAnswer,
      correct: question.answer,
    };

    try {
      const prev = await AsyncStorage.getItem(reviewKey);
      const parsed: ReviewAnswer[] = prev ? JSON.parse(prev) : [];
      await AsyncStorage.setItem(
        reviewKey,
        JSON.stringify([...parsed, reviewEntry])
      );
    } catch (e) {
      console.error('Error saving review answer', e);
    }

    const nextIndex = index + 1;

    const updatedScore = isCorrect ? score + 1 : score;
    setScore(updatedScore);

    if (nextIndex < questions.length) {
      animatedTranslateX.setValue(1000);
      setIndex(nextIndex);
      setSelected(null);

      Animated.timing(animatedTranslateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        isHandlingNext.current = false;
      });
    } else {
      if (!isQuizActive.current || examCompleted) return;

      const finalScore = updatedScore;
      const passed = finalScore / questions.length >= 0.75;

      try {
        // ✅ Save score and total for Assessment.tsx
        await AsyncStorage.setItem(`score_${topic}`, finalScore.toString());
        await AsyncStorage.setItem(`total_${topic}`, questions.length.toString());

        // Clear the exam in progress flag immediately
        await AsyncStorage.removeItem('exam_in_progress');
        
        // Mark exam as completed
        setExamCompleted(true);

        // optional: separate passed flag
        if (passed) {
          await AsyncStorage.setItem(`assessment_${topic}_passed`, 'true');
        }
      } catch (e) {
        console.error('Error saving final score', e);
      }

      router.push({
        pathname: '/Assessment/result',
        params: {
          topic,
          score: finalScore.toString(),
          total: questions.length.toString(),
          type: 'multiple',
        },
      });
    }
  };


  if (!questions.length && !showInstructionsModal) {
    return <Text style={{ padding: 20 * scale }}>Loading...</Text>;
  }

  const q = questions[index];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdf7e3' }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 12 * scale,
          justifyContent: 'flex-start',
        }}
      >
        {/* Progress bar & timer */}
        <View
          style={{
            marginBottom: 8 * scale,
            width: '100%',
            paddingHorizontal: 16 * scale,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <View
              style={{
                flex: 1,
                height: 12 * scale,
                backgroundColor: '#fde68a',
                borderRadius: 50,
                overflow: 'hidden',
                marginHorizontal: 20 * scale,
              }}
            >
              <View
                style={{
                  height: '100%',
                  backgroundColor: '#facc15',
                  width: `${((index + 1) / questions.length) * 100}%`,
                }}
              />
            </View>
          </View>
          {!showInstructionsModal && (
            <Text
              style={{
                fontSize: Math.round(12 * scale),
                color: '#dc2626',
                fontWeight: '600',
                marginTop: 6 * scale,
              }}
            >
              {t("time_left", { seconds: timer })}
            </Text>
          )}
        </View>

        {/* Instructions Modal */}
        <Modal visible={showInstructionsModal} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: '#FDF7E3',
                padding: 20 * scale,
                borderRadius: 15,
                width: '100%',
                maxWidth: 400,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: Math.round(18 * scale),
                  fontWeight: 'bold',
                  marginBottom: 10 * scale,
                }}
              >
                {t("instructions_title")}
              </Text>
              <Text
                style={{
                  fontSize: Math.round(14 * scale),
                  textAlign: 'center',
                  marginBottom: 20 * scale,
                }}
              >
               {t("instructions_text")}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowInstructionsModal(false);
                  setStarted(true);
                }}
                style={{
                  backgroundColor: '#E6A817',
                  paddingVertical: 12 * scale,
                  paddingHorizontal: 40 * scale,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: Math.round(16 * scale),
                  }}
                >
                 {t("start_button")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Exit Confirmation Modal - Only show if exam is not completed */}
        {!examCompleted && (
          <Modal visible={showExitModal} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: '#FDF7E3',
                  padding: 20 * scale,
                  borderRadius: 15,
                  width: '100%',
                  maxWidth: 400,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: Math.round(18 * scale),
                    fontWeight: 'bold',
                    marginBottom: 10 * scale,
                  }}
                >
                  {t("exit_title")}
                </Text>
                <Text
                  style={{
                    fontSize: Math.round(14 * scale),
                    textAlign: 'center',
                    marginBottom: 20 * scale,
                  }}
                >
                  {t("exit_text")}
                </Text>

                <TouchableOpacity
                  onPress={() => setShowExitModal(false)}
                  style={{
                    backgroundColor: '#E6A817',
                    paddingVertical: 8 * scale,
                    paddingHorizontal: 20 * scale,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{ color: 'white', fontSize: Math.round(14 * scale) }}
                  >
                   {t("exit_ok")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Question & Answers */}
        {started && isQuizActive.current && q && !examCompleted && (
          <>
            <Text
              style={{
                fontSize: Math.round(13 * scale),
                color: '#374151',
                textAlign: 'center',
                marginBottom: 12 * scale,
              }}
            >
               {t("question_tip")}
            </Text>

            <Animated.View
              style={{
                transform: [{ translateX: animatedTranslateX }],
                backgroundColor: '#eca71e',
                borderRadius: 24 * scale,
                width: isTablet ? width * 0.6 : 320 * scale,
                height: isTablet ? height * 0.25 : 320 * scale,
                marginBottom: 24 * scale,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16 * scale,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: Math.round(isTablet ? 20 * scale : 16 * scale),
                }}
              >
                {q.question}
              </Text>
            </Animated.View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 12 * scale,
                marginBottom: 24 * scale,
                marginTop: 24 * scale,
                width: isTablet ? width * 0.8 : '100%',
              }}
            >
              {q.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(opt)}
                  style={{
                    width: isTablet ? '40%' : '45%',
                    paddingVertical: 14 * scale,
                    borderRadius: 12 * scale,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      selected === opt ? '#16a34a' : '#eca71e',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                      fontSize: Math.round(14 * scale),
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selected && (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  width: isTablet ? width * 0.5 : '90%',
                  backgroundColor: '#eca71e',
                  paddingVertical: 16 * scale,
                  marginTop: 20 * scale,
                  borderRadius: 12 * scale,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: Math.round(15 * scale),
                  }}
                >
                {t("next_button")}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}