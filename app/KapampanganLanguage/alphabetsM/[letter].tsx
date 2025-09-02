import CustomHeader from '@/components/CustomHeader';
import kulitanLetters from '@/data/kulitan/kulitanLetters.json';
import * as d3 from 'd3-shape';
import * as Font from 'expo-font';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  Animated,
  GestureResponderEvent,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import Svg, { Circle, Path as SvgPath, Text as SvgText } from 'react-native-svg';

const DEFAULT_SLIDER_LENGTH_RATIO = 1;
const EPSILON = 2; // px along path
const MEASURED_MIN = 0.5; // minimum path length considered "measured"

function applyTransforms(
  strokes: (number[][] | undefined | null)[],
  globalOffset: [number, number] = [0, 0],
  offsets: [number, number][] = [],
  scales: number[] = []
): number[][][] {
  return strokes
    .map((stroke, idx) => {
      if (!stroke || stroke.length === 0) return null;
      const [dx, dy] = offsets[idx] || [0, 0];
      const scale = scales[idx] ?? 1;
      const centerX = stroke.reduce((sum, [x]) => sum + x, 0) / stroke.length;
      const centerY = stroke.reduce((sum, [, y]) => sum + y, 0) / stroke.length;
      return stroke.map(([x, y]) => [
        (x - centerX) * scale + centerX + dx + globalOffset[0],
        (y - centerY) * scale + centerY + dy + globalOffset[1],
      ]);
    })
    .filter(Boolean) as number[][][];
}

export default function LetterTracingScreen() {
  const { width, height } = useWindowDimensions();
  const shortEdge = Math.min(width, height);
  const isTabletDevice = shortEdge >= 600;
  
  // Responsive scaling for different device sizes
  const scale = isTabletDevice 
    ? shortEdge / 900  // Larger base for tablets
    : shortEdge / 375; // Original base for mobile

  // Sizes with tablet optimization
  const SIZE = isTabletDevice ? shortEdge * 0.5 : shortEdge * 0.85;
  const bigLetterFont = Math.round(isTabletDevice ? 140 * scale : 120 * scale);
  const labelFont = Math.max(14, Math.round(isTabletDevice ? 22 * scale : 18 * scale));
  const progressTextFont = Math.round(isTabletDevice ? 18 * scale : 14 * scale);
  const introFont = Math.round(isTabletDevice ? 14 * scale : 10 * scale);
  const introLine = Math.round(isTabletDevice ? 24 * scale : 20 * scale);
  const headerFont = Math.round(isTabletDevice ? 50 * scale : 30 * scale);
  const strokeW = Math.max(10, isTabletDevice ? 24 * scale : 20 * scale);
  const thumbR = Math.max(8, isTabletDevice ? 14 * scale : 12 * scale);
  const TOUCH_RADIUS = Math.max(12, isTabletDevice ? 24 * scale : 20 * scale);
  const BACKTRACK_TOLERANCE = 6; // allow small backwards drag in px along path

  const { t } = useTranslation();
  const { letter } = useLocalSearchParams<{ letter: string }>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const letters = (kulitanLetters as unknown as KulitanLetter[]) || [];

  const rawParam = String(letter ?? '');
  const decodedParam = decodeURIComponent(rawParam);

  const initialIndexFromParam = (() => {
    if (!letters.length) return 0;
    const bySymbol = letters.findIndex(
      (l) => (l.symbol ?? '').toLowerCase() === decodedParam.toLowerCase()
    );
    if (bySymbol !== -1) return bySymbol;
    const byName = letters.findIndex(
      (l) => (l.name ?? '').toLowerCase() === decodedParam.toLowerCase()
    );
    return byName !== -1 ? byName : 0;
  })();

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndexFromParam);
  const [fadeAnim] = useState(new Animated.Value(1));
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedStrokes = useRef<Set<number>>(new Set());
  const previousProgressesRef = useRef<number[]>([]);
  const unmountingRef = useRef(false);

  const selected = letters[currentIndex] ?? letters[0];

  const pathsRef = useRef<(any | null)[]>([]);
  const lengthsRef = useRef<number[]>([]);
  const [progresses, setProgresses] = useState<number[]>([]);
  const [activePathIdx, setActivePathIdx] = useState<number | null>(null);
  const [enabledIdx, setEnabledIdx] = useState<number>(0);
  const [pathsReady, setPathsReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const strokeScales = selected?.paths?.map((p) => p.strokeScale ?? 1) || [];

  const normalizedPaths = selected
    ? applyTransforms(
        (selected.paths || []).map((p) => p.points),
        selected.offset || [0, 0],
        selected.offsets || [],
        strokeScales
      )
    : [];

  // Load fonts (non-blocking render, we fall back to default if not yet loaded)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Font.loadAsync({
          'Segoe UI': require('@/assets/fonts/Segoe UI.ttf'),
          Kulitan: require('@/assets/fonts/KulitanHandwriting.otf'),
        });
        if (!cancelled) setFontsLoaded(true);
      } catch {
        // Fallback to system fonts if loading fails
        if (!cancelled) setFontsLoaded(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync route param to currentIndex
  useEffect(() => {
    if (!letters.length) return;
    const raw = String(letter ?? '');
    const decoded = decodeURIComponent(raw);
    const bySymbol = letters.findIndex(
      (l) => (l.symbol ?? '').toLowerCase() === decoded.toLowerCase()
    );
    if (bySymbol !== -1) {
      setCurrentIndex(bySymbol);
      return;
    }
    const byName = letters.findIndex(
      (l) => (l.name ?? '').toLowerCase() === decoded.toLowerCase()
    );
    if (byName !== -1) setCurrentIndex(byName);
  }, [letter, letters]);

  // Reset state when selected letter changes
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    completedStrokes.current.clear();
    previousProgressesRef.current = [];
    setActivePathIdx(null);
    if (normalizedPaths?.length) {
      pathsRef.current = Array(normalizedPaths.length).fill(null);
      lengthsRef.current = Array(normalizedPaths.length).fill(0);
      setEnabledIdx(0);
      setPathsReady(false);
      setProgresses(Array(normalizedPaths.length).fill(0));
    } else {
      pathsRef.current = [];
      lengthsRef.current = [];
      setEnabledIdx(0);
      setPathsReady(false);
      setProgresses([]);
    }
  }, [selected, normalizedPaths?.length]);

  // Prepare current stroke after measurements are ready
  useEffect(() => {
    if (!selected || !pathsReady) return;
    setProgresses((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        if (i > enabledIdx) updated[i] = 0;
      }
      if (updated[enabledIdx] < 0.01) updated[enabledIdx] = 0.01;
      return updated;
    });
    completedStrokes.current = new Set(
      [...completedStrokes.current].filter((i) => i < enabledIdx)
    );
  }, [enabledIdx, selected, pathsReady]);

  // Advance stroke/letter when progress completes
  useEffect(() => {
    if (!selected?.paths?.length) return;
    if (enabledIdx >= selected.paths.length) return;

    const ratio =
      selected.paths[enabledIdx].lengthRatio ?? DEFAULT_SLIDER_LENGTH_RATIO;
    const maxLength = (lengthsRef.current[enabledIdx] || 0) * ratio;
    const currentProgress = progresses[enabledIdx] ?? 0;
    const previousProgress = previousProgressesRef.current[enabledIdx] ?? 0;

    if (
      maxLength > 0 &&
      currentProgress >= maxLength - EPSILON &&
      previousProgress < maxLength - EPSILON &&
      !completedStrokes.current.has(enabledIdx)
    ) {
      completedStrokes.current.add(enabledIdx);
      if (enabledIdx < selected.paths.length - 1) {
        setEnabledIdx((prev) => prev + 1);
      } else if (!transitionTimeoutRef.current) {
        transitionTimeoutRef.current = setTimeout(() => {
          if (unmountingRef.current) return;
          transitionTimeoutRef.current = null;
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            if (unmountingRef.current) return;
            if (currentIndex < letters.length - 1) {
              completedStrokes.current.clear();
              previousProgressesRef.current = [];
              setCurrentIndex((idx) => idx + 1);
              setTimeout(() => {
                if (unmountingRef.current) return;
                fadeAnim.setValue(0);
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 250,
                  useNativeDriver: true,
                }).start();
              }, 60);
            } else {
              router.replace('/KapampanganLanguage/alphabetsM');
            }
          });
        }, 500);
      }
    }
    previousProgressesRef.current = [...progresses];
  }, [progresses, enabledIdx, selected, fadeAnim, currentIndex, letters.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unmountingRef.current = true;
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, []);

  const findClosestPointProgress = (
    pathRef: any,
    x: number,
    y: number,
    ratio: number
  ): number => {
    if (!pathRef) return 0;
    const totalLength = pathRef.getTotalLength?.() ?? 0;
    const maxLength = totalLength * ratio;
    if (totalLength <= 0) return 0;

    // Adaptive step for speed/accuracy balance
    const step = Math.max(2, Math.round(totalLength / 400));
    let closestDist = Infinity;
    let closestProgress = 0;

    for (let i = 0; i <= maxLength; i += step) {
      const pt = pathRef.getPointAtLength(i);
      const dx = pt.x - x;
      const dy = pt.y - y;
      const dist = dx * dx + dy * dy;
      if (dist < closestDist) {
        closestDist = dist;
        closestProgress = i;
      }
    }
    return closestProgress;
  };

  const handleTouch = (evt: GestureResponderEvent) => {
    if (!selected?.paths?.length) return;
    if (enabledIdx < 0 || enabledIdx >= selected.paths.length) return;

    const { locationX: x, locationY: y } = evt.nativeEvent;
    const pathRef = pathsRef.current[enabledIdx];
    if (!pathRef) return;

    const ratio =
      selected.paths[enabledIdx].lengthRatio ?? DEFAULT_SLIDER_LENGTH_RATIO;
    const maxLength = (lengthsRef.current[enabledIdx] || 0) * ratio;
    const currentProgress = progresses[enabledIdx] || 0;
    if (currentProgress >= maxLength - EPSILON) return;

    const progress = findClosestPointProgress(pathRef, x, y, ratio);
    const pt = pathRef.getPointAtLength(progress);
    const dist = Math.hypot(pt.x - x, pt.y - y);

    if (dist < TOUCH_RADIUS && Math.abs(progress - currentProgress) < TOUCH_RADIUS) {
      setActivePathIdx(enabledIdx);
    }
  };

  const handleMove = (evt: GestureResponderEvent) => {
    if (activePathIdx === null || !selected?.paths?.length) return;
    const x = evt.nativeEvent.locationX;
    const y = evt.nativeEvent.locationY;

    const ratio =
      selected.paths[activePathIdx].lengthRatio ?? DEFAULT_SLIDER_LENGTH_RATIO;
    const total = lengthsRef.current[activePathIdx] || 0;
    if (total <= 0) return;

    const maxLength = total * ratio;
    const currentProgress = progresses[activePathIdx] || 0;
    if (currentProgress >= maxLength - EPSILON) return;

    const ref = pathsRef.current[activePathIdx];
    if (!ref) return;

    let newProgress = findClosestPointProgress(ref, x, y, ratio);
    newProgress = Math.min(newProgress, maxLength);

    const pt = ref.getPointAtLength?.(newProgress);
    const dist = pt ? Math.hypot(pt.x - x, pt.y - y) : Infinity;

    // Only allow forward motion with small backtrack tolerance, and within touch radius
    if (
      dist < TOUCH_RADIUS &&
      newProgress >= currentProgress - BACKTRACK_TOLERANCE
    ) {
      setProgresses((prev) => {
        const updated = [...prev];
        updated[activePathIdx] = Math.max(updated[activePathIdx], newProgress);
        return updated;
      });
    }
  };

  const handleRelease = () => setActivePathIdx(null);

  const totalLetters = letters.length || 1;
  const letterPercent = (currentIndex + 1) / totalLetters;

return (
  <View className="flex-1 bg-[#FFF9E8]">
    <CustomHeader
      title={t("alphabet.title")}
      fontSize={headerFont}
      showBackButton={true}
      backButtonColor="white"
    />

    {/* Intro */}
    <View style={{ backgroundColor: "white" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: introFont,
          lineHeight: introLine,
          color: "#374151",
          paddingVertical: isTabletDevice ? 10 : 5,
          paddingHorizontal: isTabletDevice ? 20 : 7,
          fontFamily: fontsLoaded ? "Segoe UI" : undefined,
        }}
      >
        {t("alphabet.intro")}
      </Text>
    </View>

      {/* Big syllable */}
      <Text
        style={{
          fontFamily: fontsLoaded ? 'Segoe UI' : undefined,
          fontSize: bigLetterFont,
          fontWeight: 'bold',
          color: '#E6A817',
          marginTop: isTabletDevice ? 15 : 5,
          marginBottom: 0,
          textAlign: 'center',
        }}
      >
        {(selected?.name ?? '').toUpperCase()}
      </Text>

      {/* Tracing box */}
      <View
        className="flex-1 items-center"
        style={{ 
          justifyContent: 'center',
          paddingTop: isTabletDevice ? 10 : 0,
          paddingBottom: isTabletDevice ? 20 : 0
        }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
      >
        <Animated.View
          className="relative items-center justify-center rounded-2xl overflow-hidden bg-[#E9A924]"
          style={{
            width: SIZE,
            height: SIZE,
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          }}
        >
          <Svg width={SIZE} height={SIZE} className="absolute top-0 left-0">
            {/* Stroke labels */}
            {normalizedPaths.map((points, idx) => {
              if (!points?.length) return null;
              const startPoint = points[0];
              const labelOffset = selected?.paths?.[idx]?.labelOffset ?? [0, -12];
              const labelX = startPoint[0] + labelOffset[0];
              const labelY = startPoint[1] + labelOffset[1];
              return (
                <SvgText
                  key={`label-${idx}`}
                  x={labelX}
                  y={labelY}
                  fontSize={labelFont}
                  fill="#000"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily={fontsLoaded ? 'Segoe UI' : undefined}
                >
                  {idx + 1}
                </SvgText>
              );
            })}

            {/* Strokes */}
            {normalizedPaths.map((points, idx) => {
              if (!points || points.length < 2) return null;

              const pathD = d3.line().curve(d3.curveBasis)(
                points as [number, number][]
              );

              if (!pathD) return null;

              const totalLength = lengthsRef.current[idx] || 1;
              const ratio =
                selected?.paths?.[idx]?.lengthRatio ?? DEFAULT_SLIDER_LENGTH_RATIO;
              const overshoot = 2;
              const maxVisible = totalLength * ratio;
              const rawProgress = progresses[idx] || 0;
              const strokeProgress = Math.min(rawProgress + overshoot, maxVisible);
              const isActive = idx === enabledIdx;
              const pathNode = pathsRef.current[idx];

              let thumbPoint: { x: number; y: number } | null = null;
              if (rawProgress > 0 && totalLength > 1 && pathNode?.getPointAtLength) {
                try {
                  thumbPoint = pathNode.getPointAtLength(rawProgress);
                } catch {
                  thumbPoint = null;
                }
              }

              const thumbOpacity =
                rawProgress >= maxVisible - 8
                  ? Math.max(0, (maxVisible - rawProgress) / 8)
                  : 1;

              return (
                <React.Fragment key={`stroke-${idx}`}>
                  {/* Guide path */}
                  <SvgPath
                    d={pathD}
                    stroke="#ddd"
                    strokeWidth={strokeW}
                    fill="none"
                    strokeDasharray={totalLength}
                    strokeDashoffset={Math.max(0, totalLength - maxVisible)}
                    ref={(ref: any) => {
                      pathsRef.current[idx] = ref;
                      if (ref && ref.getTotalLength) {
                        try {
                          const len = ref.getTotalLength();
                          lengthsRef.current[idx] = len;

                          // When every measured length is above threshold, mark ready
                          const allMeasured =
                            lengthsRef.current.length === normalizedPaths.length &&
                            lengthsRef.current.every((l) => l >= MEASURED_MIN);

                          if (allMeasured && !pathsReady) {
                            // delay one frame to ensure refs are ready
                            requestAnimationFrame(() => setPathsReady(true));
                          }
                        } catch {
                          // keep default length 0; will prevent ready state
                          lengthsRef.current[idx] = 0;
                        }
                      }
                    }}
                  />

                  {/* Dotted hint for active stroke at the beginning */}
                  {isActive && rawProgress < 5 && (
                    <SvgPath
                      d={pathD}
                      stroke="#E53935"
                      strokeWidth={5}
                      fill="none"
                      strokeDasharray="8,8"
                      opacity={0.5}
                    />
                  )}

                  {/* Drawn progress */}
                  {pathsReady && (isActive || rawProgress > 0.01) && (
                    <>
                      <SvgPath
                        d={pathD}
                        stroke="#E53935"
                        strokeWidth={strokeW}
                        fill="none"
                        strokeDasharray={Math.max(1, totalLength * ratio)}
                        strokeDashoffset={Math.max(
                          0,
                          totalLength * ratio - strokeProgress
                        )}
                      />
                      {isActive && rawProgress < maxVisible && thumbPoint && (
                        <Circle
                          cx={thumbPoint.x}
                          cy={thumbPoint.y}
                          r={thumbR}
                          fill="#ffffff"
                          opacity={thumbOpacity}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </Animated.View>

        {/* progress text */}
        <Text
          style={{
            marginTop: isTabletDevice ? 20 : 16,
            fontSize: progressTextFont,
            fontWeight: 'bold',
            color: 'rgba(0,0,0,0.7)',
            fontFamily: fontsLoaded ? 'Segoe UI' : undefined,
          }}
        >
          {Math.min(currentIndex + 1, totalLetters)} / {totalLetters}
        </Text>

        {/* progress bar */}
        <View className="mt-2 w-[90%] h-[8px] bg-black/20 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-[#E9A924] rounded-full"
            style={{ width: `${Math.max(0, Math.min(1, letterPercent)) * 100}%` }}
          />
        </View>
      </View>
    </View>
  );
}

type KulitanPath = {
  points: [number, number][];
  lengthRatio?: number; // 0..1 of the path length you want to require
  strokeScale?: number;
  labelOffset?: [number, number];
};

type KulitanLetter = {
  name: string;
  symbol: string;
  paths: KulitanPath[];
  offset?: [number, number];
  offsets?: [number, number][];
};