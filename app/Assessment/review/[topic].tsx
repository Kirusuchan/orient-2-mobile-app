import ResponsiveText from '@/components/ResponsiveText';
import { useResponsive } from '@/hooks/useResponsive';
import { questionMap } from '@/utils/questionMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BackHandler,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type ReviewAnswer = {
    question: string;
    selected: string;
};

type MultipleQuestion = {
    question: string;
    answer: string;
};

type MatchingQuestion = {
    term: string;
    definition: string;
};

export default function ReviewTopicScreen() {
    const { topic, type } = useLocalSearchParams<{ topic?: string; type?: string }>();
    const { t, i18n } = useTranslation();
    const [questions, setQuestions] = useState<(MultipleQuestion | MatchingQuestion)[]>([]);
    const [answers, setAnswers] = useState<ReviewAnswer[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const backHandlerRef = useRef<any>(null);

    const { shortEdge } = useResponsive();
    const spacing = shortEdge / 100;

    // Handle back button press
    useEffect(() => {
        const backAction = () => {
            return true; // Prevent default back behavior
        };

        // Store the subscription reference
        backHandlerRef.current = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // Clean up the event listener when the component unmounts
        return () => {
            if (backHandlerRef.current) {
                backHandlerRef.current.remove();
            }
        };
    }, []);

    useEffect(() => {
        const load = async () => {
            const topicStr = topic ?? '';
            const typeStr = type ?? 'multiple';

            try {
                if (questionMap[topicStr]) {
                    const lang = i18n.language.startsWith("tl") ? "tl" : "en";
                    const data = await questionMap[topicStr][lang]();
                    setQuestions(data.default || []);

                    const stored = await AsyncStorage.getItem(`reviewAnswers_${topicStr}_${typeStr}`);
                    if (stored) {
                        try {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed)) {
                                setAnswers(parsed);
                            }
                        } catch (e) {
                            console.warn('Failed to parse stored review answers:', e);
                        }
                    }
                }
            } catch (e) {
                console.error('Error loading review data:', e);
            }

            setIsLoaded(true);
        };

        load();
    }, [topic, type, i18n.language]);

    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();

    const answerMap = answers.reduce((map, a) => {
        map[normalize(a.question)] = a.selected;
        return map;
    }, {} as Record<string, string>);

    const getScore = () => {
        return questions.reduce((acc, q) => {
            const key = normalize(
                type === 'multiple' ? (q as MultipleQuestion).question : (q as MatchingQuestion).term
            );
            const selected = answerMap[key];
            const correct = type === 'multiple'
                ? (q as MultipleQuestion).answer
                : (q as MatchingQuestion).definition;
            return selected === correct ? acc + 1 : acc;
        }, 0);
    };

    const handleExit = () => {
        // Remove the back handler before navigating away
        if (backHandlerRef.current) {
            backHandlerRef.current.remove();
        }
        router.push('/assessment');
    };

    if (!isLoaded) {
        return (
            <SafeAreaView className="flex-1 bg-[#FFF6E5] justify-center items-center">
                <ResponsiveText baseSize={16} style={{ color: '#374151' }}>
                    {t("review.loading")}
                </ResponsiveText>
            </SafeAreaView>
        );
    }

    if (!answers.length) {
        return (
            <SafeAreaView className="flex-1 bg-[#FFF6E5] justify-center items-center">
                <ResponsiveText baseSize={16} style={{ color: '#374151' }}>
                    {t("review.noAnswers")}
                </ResponsiveText>
            </SafeAreaView>
        );
    }

    const score = getScore();
    const isAlphabetMatching = topic === "alphabets" && type === "matching";

    return (
        <SafeAreaView className="flex-1 bg-[#FFF6E5]">
            <ScrollView contentContainerStyle={{ paddingBottom: spacing * 6 }}>
                
                {/* Score Display */}
                <View
                    style={{
                        marginTop: spacing * 10,
                        marginHorizontal: spacing * 6,
                        padding: spacing * 6,
                        borderRadius: 16,
                    }}
                    className="bg-white shadow-lg items-center border border-yellow-300"
                >
                    <ResponsiveText baseSize={28} style={{ fontWeight: '800', color: '#E6A817', marginBottom: spacing * 2 }}>
                         {t("review.scoreTitle")}
                    </ResponsiveText>
                    <ResponsiveText baseSize={18} style={{ fontWeight: '600', color: '#374151' }}>
                        {t("review.scoreMessage", { score, total: questions.length })}
                    </ResponsiveText>
                </View>

                {/* Questions and Answers */}
                <View style={{ marginTop: spacing * 6, paddingHorizontal: spacing * 5 }}>
                    {questions.map((q, index) => {
                        const questionText =
                            type === 'multiple'
                                ? (q as MultipleQuestion).question
                                : (q as MatchingQuestion).term;

                        const correctAnswer =
                            type === 'multiple'
                                ? (q as MultipleQuestion).answer
                                : (q as MatchingQuestion).definition;

                        const key = normalize(questionText);
                        const selectedAnswer = answerMap[key];
                        const isCorrect = selectedAnswer === correctAnswer;

                        return (
                            <View
                                key={index}
                                style={{ paddingVertical: spacing * 4 }}
                                className="flex-col border-b border-gray-300"
                            >
                                {/* Question */}
                                {isAlphabetMatching ? (
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            fontWeight: '600',
                                            color: '#1F2937',
                                            marginBottom: spacing * 2,
                                            fontFamily: 'KulitanHandwriting',
                                        }}
                                    >
                                        {index + 1}. {questionText}
                                    </Text>
                                ) : (
                                    <ResponsiveText baseSize={16} style={{ fontWeight: '600', color: '#1F2937', marginBottom: spacing * 2 }}>
                                        {index + 1}. {questionText}
                                    </ResponsiveText>
                                )}

                                {/* User Answer */}
                                <ResponsiveText
                                    baseSize={20}
                                    style={{
                                        fontWeight: '700',
                                        color: isCorrect ? '#16A34A' : '#EF4444',
                                    }}
                                >
                                    {t("review.yourAnswer")}: {selectedAnswer?.trim() || t("review.noAnswer")}
                                </ResponsiveText>
                            </View>
                        );
                    })}
                </View>

                {/* Exit Button */}
                <View style={{ marginTop: spacing * 6, marginBottom: spacing * 10, paddingHorizontal: spacing * 6 }}>
                    <TouchableOpacity
                        className="bg-[#E6A817] py-4 rounded-xl"
                        onPress={handleExit}
                    >
                        <ResponsiveText baseSize={18} style={{ color: 'white', textAlign: 'center', fontWeight: '700' }}>
                            {t("review.exit")}
                        </ResponsiveText>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}