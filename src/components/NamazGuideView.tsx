import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Play,
  Pause,
  Sparkles,
  Info,
  Headphones,
  Square,
  FastForward,
  SkipForward,
  SkipBack,
  Settings2,
  ArrowDown,
  Layers,
  Smartphone,
  Check,
  X,
  Target
} from 'lucide-react';
import { NamazTypeInfo, GenderType, PrayerKey } from '../types';
import { ALL_NAMAZ_TYPES } from '../data/namazGuide';
import { NamazPostureIllustration } from './NamazPostureIllustration';
import { LiveImamPrayerConductor } from './LiveImamPrayerConductor';
import { audioService } from '../services/audioService';
import { prayerSessionService } from '../services/prayerSessionService';

interface NamazGuideViewProps {
  initialPrayerKey?: PrayerKey;
  onRecordPrayerCompleted?: (prayerId: string) => void;
}

type RecitationSpeed = 'slow' | 'normal' | 'fast';
type VoiceDetailMode = 'full' | 'duaOnly';
type ViewLayoutMode = 'focus' | 'timeline';

export const NamazGuideView: React.FC<NamazGuideViewProps> = ({
  initialPrayerKey,
  onRecordPrayerCompleted
}) => {
  // Find default namaz from initialPrayerKey or default to sabah
  const defaultNamaz =
    ALL_NAMAZ_TYPES.find((n) => n.timeSlotKey === initialPrayerKey) || ALL_NAMAZ_TYPES[0];

  const [selectedNamaz, setSelectedNamaz] = useState<NamazTypeInfo>(defaultNamaz);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [gender, setGender] = useState<GenderType>('erkek');
  const [viewMode, setViewMode] = useState<'conductor' | 'manual'>('conductor');
  const [showDuaTexts, setShowDuaTexts] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // --- "Sesli Takip" (Voice Follow & Auto-Scroll) States ---
  const [isVoiceFollowActive, setIsVoiceFollowActive] = useState<boolean>(false);
  const [isVoiceFollowPaused, setIsVoiceFollowPaused] = useState<boolean>(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [isMosqueAmbiance, setIsMosqueAmbiance] = useState<boolean>(
    prayerSessionService.getMosqueAmbiance()
  );
  const [recitationSpeed, setRecitationSpeed] = useState<RecitationSpeed>('normal');
  const [voiceDetailMode, setVoiceDetailMode] = useState<VoiceDetailMode>('full');
  const [transitionDelaySeconds, setTransitionDelaySeconds] = useState<number>(2.5);
  const [viewLayout, setViewLayout] = useState<ViewLayoutMode>('focus');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [transitionCountdown, setTransitionCountdown] = useState<number | null>(null);
  const [centeredFlashStepKey, setCenteredFlashStepKey] = useState<string | null>(null);

  // References for scrolling and timers
  const activeStepCardRef = useRef<HTMLDivElement | null>(null);
  const timelineItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Speed multiplier mapping
  const speedRates: Record<RecitationSpeed, number> = {
    slow: 0.8,
    normal: 0.9,
    fast: 1.05
  };

  // Keep screen awake during "Sesli Takip"
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Wake lock can fail if battery saver is on or not permitted
    }
  };

  const releaseWakeLock = () => {
    try {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {
      // Ignore
    }
  };

  // Restore active prayer session on mount if available
  useEffect(() => {
    const existing = prayerSessionService.getSession();
    if (existing && !existing.isCompleted) {
      const match = ALL_NAMAZ_TYPES.find((n) => n.id === existing.prayerId);
      if (match) {
        setSelectedNamaz(match);
        setSelectedSectionIndex(existing.sectionIndex);
        setCurrentStepIndex(existing.stepIndex);
        setIsVoiceFollowActive(existing.isVoiceFollowActive);
        setIsVoiceFollowPaused(existing.isVoiceFollowPaused);
      }
    }
  }, []);

  // Sync real-time progress with shared prayerSessionService
  useEffect(() => {
    prayerSessionService.updateProgress(
      selectedNamaz.id,
      selectedSectionIndex,
      currentStepIndex,
      isVoiceFollowActive,
      isVoiceFollowPaused
    );
  }, [
    selectedNamaz.id,
    selectedSectionIndex,
    currentStepIndex,
    isVoiceFollowActive,
    isVoiceFollowPaused
  ]);

  // Update selected namaz if initialPrayerKey changes
  useEffect(() => {
    if (initialPrayerKey) {
      const found = ALL_NAMAZ_TYPES.find((n) => n.timeSlotKey === initialPrayerKey);
      if (found) {
        setSelectedNamaz(found);
        setSelectedSectionIndex(0);
        setCurrentStepIndex(0);
        setIsCompleted(false);
        stopVoiceFollow();
      }
    }
  }, [initialPrayerKey]);

  const currentSection =
    selectedNamaz.sections[selectedSectionIndex] || selectedNamaz.sections[0];
  const steps = currentSection.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Total progress calculation
  const totalStepsInPrayer = selectedNamaz.sections.reduce(
    (acc, sec) => acc + sec.steps.length,
    0
  );
  const stepsCompletedSoFar =
    selectedNamaz.sections
      .slice(0, selectedSectionIndex)
      .reduce((acc, sec) => acc + sec.steps.length, 0) +
    currentStepIndex +
    1;
  const progressPercent = Math.round((stepsCompletedSoFar / totalStepsInPrayer) * 100);

  // --- Smooth Auto-Center on Screen Handler ---
  const scrollToActiveElement = useCallback(
    (customKey?: string, force: boolean = false) => {
      if (!autoScrollEnabled && !force) return;

      setTimeout(() => {
        let targetElement: HTMLElement | null = null;
        const activeKey = customKey || `${selectedSectionIndex}-${currentStepIndex}`;

        if (viewLayout === 'timeline') {
          targetElement = timelineItemRefs.current[activeKey] || activeStepCardRef.current;
        } else {
          targetElement = activeStepCardRef.current;
        }

        if (!targetElement) return;

        // Custom window scroll calculation to place the active step in the exact vertical center
        // between the sticky header (~60px) and bottom navigation bar (~70px)
        const headerOffset = 64;
        const bottomNavOffset = 72;
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - headerOffset - bottomNavOffset;

        const rect = targetElement.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const elementCenterY = currentScrollY + rect.top + rect.height / 2;
        const targetScrollY = elementCenterY - headerOffset - availableHeight / 2;

        try {
          window.scrollTo({
            top: Math.max(0, Math.round(targetScrollY)),
            behavior: 'smooth'
          });
        } catch {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Visual flash ring for auto-centered feedback
        setCenteredFlashStepKey(activeKey);
        setTimeout(() => {
          setCenteredFlashStepKey(null);
        }, 1800);
      }, 60);
    },
    [autoScrollEnabled, viewLayout, selectedSectionIndex, currentStepIndex]
  );

  // Clean timers
  const clearAllTimers = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setTransitionCountdown(null);
  };

  // Stop everything
  const stopVoiceFollow = () => {
    setIsVoiceFollowActive(false);
    setIsVoiceFollowPaused(false);
    clearAllTimers();
    audioService.stopSpeaking();
    setIsAudioPlaying(false);
    releaseWakeLock();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioService.stopSpeaking();
      clearAllTimers();
      releaseWakeLock();
    };
  }, []);

  // --- Next & Previous Step Handlers ---
  const handleNextStep = useCallback(() => {
    clearAllTimers();
    audioService.stopSpeaking();
    setIsAudioPlaying(false);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (selectedSectionIndex < selectedNamaz.sections.length - 1) {
      // Move to next section (e.g. Farz after Sunnet)
      setSelectedSectionIndex((prev) => prev + 1);
      setCurrentStepIndex(0);
    } else {
      // Prayer finished!
      stopVoiceFollow();
      prayerSessionService.completeSession();
      setIsCompleted(true);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
      audioService.playAdhanChime();
      if (onRecordPrayerCompleted) {
        onRecordPrayerCompleted(selectedNamaz.id);
      }
    }
  }, [
    currentStepIndex,
    steps.length,
    selectedSectionIndex,
    selectedNamaz.sections.length,
    selectedNamaz.id,
    onRecordPrayerCompleted
  ]);

  const handlePrevStep = useCallback(() => {
    clearAllTimers();
    audioService.stopSpeaking();
    setIsAudioPlaying(false);

    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (selectedSectionIndex > 0) {
      const prevSection = selectedNamaz.sections[selectedSectionIndex - 1];
      setSelectedSectionIndex((prev) => prev - 1);
      setCurrentStepIndex(prevSection.steps.length - 1);
    }
  }, [currentStepIndex, selectedSectionIndex, selectedNamaz.sections]);

  // --- "Sesli Takip" Step Execution Engine ---
  const speakCurrentStepInFollowMode = useCallback(() => {
    if (!isVoiceFollowActive || isVoiceFollowPaused || isCompleted) return;

    clearAllTimers();
    // Sesli yönlendirme başladığında adımı ekranda derhal ortala
    scrollToActiveElement(undefined, true);

    // Camide Cemaat Modu Akustiği: İmam Tekbirleri ve Kubbe Yankısı
    if (isMosqueAmbiance) {
      const titleLower = currentStep.title.toLowerCase();
      if (
        titleLower.includes('rükû') ||
        titleLower.includes('secde') ||
        titleLower.includes('tekbir') ||
        titleLower.includes('niyet')
      ) {
        audioService.playMosqueTakbir('allahu_ekber');
      } else if (titleLower.includes('kavme') || titleLower.includes('doğrulma')) {
        audioService.playMosqueTakbir('semiallahu');
        setTimeout(() => audioService.playMosqueTakbir('rabbenal_hamd'), 900);
      } else if (titleLower.includes('selâm') || titleLower.includes('selam')) {
        audioService.playMosqueTakbir('selam');
      }
    }

    // Formulate recitation text
    let textToSpeak = '';
    const prayerDuaText =
      currentStep.audioPrompt || currentStep.transliteration || currentStep.title;

    if (voiceDetailMode === 'full') {
      // Announce posture & rakat, then recite
      const postureLabel = `${currentStep.rakat}. Rekât, ${currentStep.title}.`;
      textToSpeak = `${postureLabel} ${prayerDuaText}`;
    } else {
      // Only recite the prayer and takbirs
      textToSpeak = prayerDuaText;
    }

    setIsAudioPlaying(true);
    const rate = speedRates[recitationSpeed];

    audioService.speak(
      textToSpeak,
      'tr-TR',
      // onEnd: Step recitation finished -> Start transition delay countdown
      () => {
        setIsAudioPlaying(false);

        // If at the very last step, advance directly to completion
        const isLastSection = selectedSectionIndex === selectedNamaz.sections.length - 1;
        const isLastStep = currentStepIndex === steps.length - 1;

        if (isLastSection && isLastStep) {
          handleNextStep();
          return;
        }

        // Start movement pause countdown (e.g. 2.5s for worshipper to execute the posture)
        let remainingSeconds = Math.round(transitionDelaySeconds);
        setTransitionCountdown(remainingSeconds);

        countdownIntervalRef.current = setInterval(() => {
          remainingSeconds -= 1;
          if (remainingSeconds > 0) {
            setTransitionCountdown(remainingSeconds);
          } else {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setTransitionCountdown(null);
          }
        }, 1000);

        transitionTimerRef.current = setTimeout(() => {
          audioService.playStepTransitionSound();
          handleNextStep();
        }, transitionDelaySeconds * 1000);
      },
      // onError
      () => {
        setIsAudioPlaying(false);
      },
      rate
    );
  }, [
    isVoiceFollowActive,
    isVoiceFollowPaused,
    isCompleted,
    scrollToActiveElement,
    currentStep,
    voiceDetailMode,
    recitationSpeed,
    speedRates,
    selectedSectionIndex,
    selectedNamaz.sections.length,
    currentStepIndex,
    steps.length,
    transitionDelaySeconds,
    handleNextStep
  ]);

  // Trigger speech when active step changes during "Sesli Takip"
  useEffect(() => {
    if (isVoiceFollowActive && !isVoiceFollowPaused && !isCompleted) {
      speakCurrentStepInFollowMode();
    } else {
      // Auto-scroll even when navigating manually if enabled
      scrollToActiveElement();
    }
  }, [
    currentStepIndex,
    selectedSectionIndex,
    isVoiceFollowActive,
    isVoiceFollowPaused,
    isCompleted
  ]);

  // Toggle Sesli Takip (Start / Stop)
  const handleToggleVoiceFollow = () => {
    if (isVoiceFollowActive) {
      stopVoiceFollow();
    } else {
      setIsCompleted(false);
      setIsVoiceFollowActive(true);
      setIsVoiceFollowPaused(false);
      requestWakeLock();
    }
  };

  // Pause / Resume Voice Follow
  const handlePauseResumeVoiceFollow = () => {
    if (isVoiceFollowPaused) {
      setIsVoiceFollowPaused(false);
      requestWakeLock();
    } else {
      setIsVoiceFollowPaused(true);
      clearAllTimers();
      audioService.stopSpeaking();
      setIsAudioPlaying(false);
      releaseWakeLock();
    }
  };

  // Single step manual audio play (when voice follow is off)
  const handleToggleSingleAudio = (stepIdx?: number) => {
    const targetIdx = typeof stepIdx === 'number' ? stepIdx : currentStepIndex;
    if (typeof stepIdx === 'number' && stepIdx !== currentStepIndex) {
      setCurrentStepIndex(stepIdx);
    }
    const targetStep = steps[targetIdx] || currentStep;

    if (isAudioPlaying) {
      audioService.stopSpeaking();
      setIsAudioPlaying(false);
    } else {
      const textToSpeak =
        targetStep.audioPrompt || targetStep.transliteration || targetStep.title;
      setIsAudioPlaying(true);

      // Otomatik ortalama: Sesli yönlendirme çaldığında adım ekranda anında ortalanır!
      const stepKey = `${selectedSectionIndex}-${targetIdx}`;
      scrollToActiveElement(stepKey, true);

      audioService.speak(
        textToSpeak,
        'tr-TR',
        () => setIsAudioPlaying(false),
        () => setIsAudioPlaying(false),
        speedRates[recitationSpeed]
      );
    }
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setSelectedSectionIndex(0);
    setCurrentStepIndex(0);
    stopVoiceFollow();
  };

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto relative">
      {/* Mode Switcher: Hoca Kıldırsın (Canlı İmam) vs Adım Adım İncele */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1 shadow-xs">
        <button
          onClick={() => {
            setViewMode('conductor');
            stopVoiceFollow();
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'conductor'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Hoca Kıldırsın (Canlı İmam)</span>
        </button>
        <button
          onClick={() => {
            setViewMode('manual');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            viewMode === 'manual'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Adım Adım İncele</span>
        </button>
      </div>

      {viewMode === 'conductor' ? (
        <LiveImamPrayerConductor
          onRecordPrayerCompleted={onRecordPrayerCompleted}
          defaultPrayerId={selectedNamaz.id}
        />
      ) : (
        <>
          {/* Header & Prayer Selection Bar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{selectedNamaz.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                {selectedNamaz.rakatBreakdown}
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
              {selectedNamaz.shortDesc}
            </p>
          </div>

          {/* Gender Selector */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0">
            <button
              onClick={() => setGender('erkek')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                gender === 'erkek'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Erkek
            </button>
            <button
              onClick={() => setGender('kadin')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                gender === 'kadin'
                  ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Kadın
            </button>
          </div>
        </div>

        {/* Scrollable Prayer Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_NAMAZ_TYPES.map((namaz) => {
            const isSel = namaz.id === selectedNamaz.id;
            return (
              <button
                key={namaz.id}
                onClick={() => {
                  setSelectedNamaz(namaz);
                  setSelectedSectionIndex(0);
                  setCurrentStepIndex(0);
                  setIsCompleted(false);
                  stopVoiceFollow();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {namaz.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- HERO "SESLİ TAKİP" & OTOMATİK KAYDIRMA BANNER'I --- */}
      <div
        className={`rounded-3xl p-4 transition-all duration-300 border ${
          isVoiceFollowActive
            ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white border-emerald-500/50 shadow-lg ring-2 ring-emerald-500/30'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-stone-900 dark:text-stone-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                isVoiceFollowActive
                  ? 'bg-emerald-500 text-white shadow-md animate-pulse'
                  : 'bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {isVoiceFollowActive ? (
                <Headphones className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">
                  {isVoiceFollowActive
                    ? isVoiceFollowPaused
                      ? 'Sesli Takip Duraklatıldı'
                      : 'Sesli Takip ve Otomatik Akış Aktif'
                    : 'Sesli Takip ile Namaz Kıl'}
                </h3>
                {isVoiceFollowActive && !isVoiceFollowPaused && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 line-clamp-1 ${
                  isVoiceFollowActive
                    ? 'text-emerald-200'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                {isVoiceFollowActive
                  ? 'Dualar seslendirilir, duruşlar arası ekran otomatik kaydırılır.'
                  : 'Ekranı hareketlere göre otomatik kaydırır, duaları adım adım okur.'}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Auto-Center Toggle & Quick Recenter Button */}
            <button
              onClick={() => {
                if (!autoScrollEnabled) {
                  setAutoScrollEnabled(true);
                }
                scrollToActiveElement(undefined, true);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                autoScrollEnabled
                  ? isVoiceFollowActive
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
              title="Sesli yönlendirmede adımı ekranda ortala (Tıklayarak şimdi ortala)"
            >
              <Target className={`w-3.5 h-3.5 ${autoScrollEnabled ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Otomatik Ortala</span>
            </button>

            {/* Cami Modu Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !isMosqueAmbiance;
                setIsMosqueAmbiance(nextVal);
                prayerSessionService.setMosqueAmbiance(nextVal);
                audioService.setMosqueAcoustic(nextVal);
                if (nextVal) {
                  audioService.playMosqueTakbir('allahu_ekber');
                } else {
                  audioService.playTasbihClick();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isMosqueAmbiance
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 hover:text-white'
              }`}
              title="Cami Akustiği (Süleymaniye Kubbe Yankısı & İmam Eşliği)"
            >
              <span>🕌</span>
              <span className="hidden sm:inline">Cami Modu</span>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isVoiceFollowActive
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title="Sesli Takip ve Hız Ayarları"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* View Mode Toggle: Focus vs Timeline */}
            <button
              onClick={() =>
                setViewLayout((prev) => (prev === 'focus' ? 'timeline' : 'focus'))
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                isVoiceFollowActive
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
              title={viewLayout === 'focus' ? 'Tüm Adımları Gör' : 'Odak Kartı Modu'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{viewLayout === 'focus' ? 'Akış Modu' : 'Odak Modu'}</span>
            </button>

            {/* Start / Stop Voice Follow Button */}
            <button
              onClick={handleToggleVoiceFollow}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                isVoiceFollowActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isVoiceFollowActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Sesli Takibi Başlat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Status / Auto-Scroll Badge */}
        {isVoiceFollowActive && (
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 font-medium text-[11px] border border-emerald-600/40">
                <ArrowDown className="w-3 h-3 text-emerald-300 animate-bounce" />
                <span>Otomatik Kaydırma: {autoScrollEnabled ? 'Aktif' : 'Pasif'}</span>
              </span>

              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 font-medium border border-emerald-600/40">
                Hız: {recitationSpeed === 'slow' ? 'Tâdil-i Erkân (Yavaş)' : recitationSpeed === 'normal' ? 'Normal' : 'Akıcı'}
              </span>
            </div>

            {/* Transition Countdown Badge */}
            {transitionCountdown !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 font-semibold animate-pulse text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Duruşu tamamlayın: {transitionCountdown}s sonraki harekete geçiliyor</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Guide Screen */}
      {!isCompleted ? (
        <div className="space-y-4">
          {/* Section Indicator & Progress */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {currentSection.title} · {currentStep.rakat}. Rekât
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-600 dark:text-stone-300 font-medium">
                  {currentStep.title}
                </span>
              </div>
              <span className="text-stone-500 font-mono text-[11px]">
                Adım {stepsCompletedSoFar} / {totalStepsInPrayer} (%{progressPercent})
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* VIEW MODE 1: FOCUS CARD MODE */}
          {viewLayout === 'focus' ? (
            <div
              ref={activeStepCardRef}
              className={`bg-white dark:bg-stone-900 border rounded-3xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
                centeredFlashStepKey
                  ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20'
                  : isVoiceFollowActive
                  ? 'border-emerald-500/70 dark:border-emerald-600/70 ring-2 ring-emerald-500/20'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Posture Card & Illustration */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2 border-b border-stone-100 dark:border-stone-800/80">
                <div className="relative">
                  <NamazPostureIllustration
                    posture={currentStep.posture}
                    gender={gender}
                    className="w-40 h-40 shrink-0"
                  />
                  {isAudioPlaying && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md animate-pulse">
                      <Volume2 className="w-3 h-3" />
                      <span>Sesli Yönlendirme · Ortalandı</span>
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200/50 dark:border-emerald-900/40">
                      {currentStep.posture.toUpperCase()} DURUŞU
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {currentStep.rakat}. Rekât
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentStep.instruction}
                  </p>

                  {/* Gender specific rule */}
                  {gender === 'kadin' && currentStep.femaleInstruction && (
                    <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-[11px] leading-snug border border-rose-200/50 dark:border-rose-900/40">
                      <span className="font-bold">Kadınlar için duruş: </span>
                      {currentStep.femaleInstruction}
                    </div>
                  )}
                  {gender === 'erkek' && currentStep.maleInstruction && (
                    <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-[11px] leading-snug border border-emerald-200/50 dark:border-emerald-900/40">
                      <span className="font-bold">Erkekler için duruş: </span>
                      {currentStep.maleInstruction}
                    </div>
                  )}
                </div>
              </div>

              {/* Controls: Audio reciter & Show/Hide prayers text */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Single Step Audio Recite Button */}
                <button
                  type="button"
                  onClick={() => handleToggleSingleAudio()}
                  disabled={isVoiceFollowActive}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isAudioPlaying && !isVoiceFollowActive
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isVoiceFollowActive
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                  }`}
                  title={isVoiceFollowActive ? 'Sesli Takip devrede' : 'Bu adımı seslendir'}
                >
                  {isAudioPlaying && !isVoiceFollowActive ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Durdur</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Bu Adımı Sesli Dinle</span>
                    </>
                  )}
                </button>

                {/* Toggle Dua Text */}
                <button
                  onClick={() => setShowDuaTexts(!showDuaTexts)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                  title="Duaları Gizle / Göster"
                >
                  {showDuaTexts ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                      <span>Duaları Gizle</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Duaları Göster</span>
                    </>
                  )}
                </button>
              </div>

              {/* Recitation Content (Arabic, Transliteration, Meaning) */}
              {showDuaTexts ? (
                <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 rounded-2xl p-4 space-y-3">
                  {currentStep.arabicText && (
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block mb-1">
                        Arapça Metin
                      </span>
                      <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-white leading-loose select-text">
                        {currentStep.arabicText}
                      </p>
                    </div>
                  )}

                  {currentStep.transliteration && (
                    <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/50">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wide block mb-0.5">
                        Türkçe Okunuş
                      </span>
                      <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed">
                        {currentStep.transliteration}
                      </p>
                    </div>
                  )}

                  {currentStep.meaning && (
                    <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/50">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wide block mb-0.5">
                        Türkçe Anlamı
                      </span>
                      <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                        "{currentStep.meaning}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/30 border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <p className="text-xs text-stone-500">
                    Yardımcı dua metinleri gizlendi. Ezberden kılarak adımları takip ediyorsunuz.
                  </p>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0 && selectedSectionIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Önceki Adım</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span>
                    {currentStepIndex === steps.length - 1 &&
                    selectedSectionIndex === selectedNamaz.sections.length - 1
                      ? 'Namazı Tamamla'
                      : 'Sonraki Adım'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: TIMELINE FLOW STREAM (All steps with dynamic highlight and auto-scroll) */
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <ArrowDown className="w-4 h-4 text-emerald-600" />
                  <span>Ekran, sesli okunan adıma göre otomatik olarak ortalanır.</span>
                </span>
                <span className="font-bold">{currentSection.title}</span>
              </div>

              {steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                const stepKey = `${selectedSectionIndex}-${idx}`;

                return (
                  <div
                    key={stepKey}
                    ref={(el) => {
                      timelineItemRefs.current[stepKey] = el;
                    }}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      clearAllTimers();
                      audioService.stopSpeaking();
                      setIsAudioPlaying(false);
                      scrollToActiveElement(stepKey, true);
                    }}
                    className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer ${
                      centeredFlashStepKey === stepKey
                        ? 'bg-white dark:bg-stone-900 border-emerald-500 ring-4 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20 -translate-y-1'
                        : isActive
                        ? 'bg-white dark:bg-stone-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30 -translate-y-0.5'
                        : isPassed
                        ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800 opacity-75'
                        : 'bg-white dark:bg-stone-900/80 border-stone-200/80 dark:border-stone-800 opacity-90 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Indicator & Mini Posture */}
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                              : isPassed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                          }`}
                        >
                          {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>

                        <NamazPostureIllustration
                          posture={step.posture}
                          gender={gender}
                          className="w-20 h-20 mt-1"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                            {step.rakat}. Rekât · {step.posture.toUpperCase()}
                          </span>
                          {isActive && (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                              Şu Anki Hareket
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                          {step.instruction}
                        </p>

                        {/* Recitation Highlight if active */}
                        {step.transliteration && (
                          <div className="mt-2 p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                            <span className="text-[10px] text-stone-400 block mb-0.5">
                              Okunacak Dua / Tesbih:
                            </span>
                            <p className="line-clamp-2 leading-relaxed">
                              {step.transliteration}
                            </p>
                          </div>
                        )}

                        {/* Audio recitation button & Centered badge */}
                        <div className="flex items-center justify-between gap-2 pt-2 mt-1 border-t border-stone-100 dark:border-stone-800/60">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSingleAudio(idx);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isActive && isAudioPlaying
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                            }`}
                          >
                            {isActive && isAudioPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Durdur</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Bu Adımı Sesli Dinle</span>
                              </>
                            )}
                          </button>

                          {(isActive && isAudioPlaying) || centeredFlashStepKey === stepKey ? (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                              <Target className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Ekranda Ortalandı</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentStepIndex(idx);
                                scrollToActiveElement(stepKey, true);
                              }}
                              className="text-[11px] text-stone-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                              title="Bu adımı ekranda ortala"
                            >
                              <Target className="w-3 h-3" />
                              <span>Ortala</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Completion Celebration Screen */
        <div className="bg-white dark:bg-stone-900 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-4 shadow-lg animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              Allah Kabul Etsin!
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {selectedNamaz.name} eda edildi. İbadet istatistiklerinize kaydedildi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-semibold">Namaz Sonrası Tesbihatı:</p>
            <p className="text-stone-600 dark:text-stone-400">
              33x Sübhânallâh · 33x Elhamdülillâh · 33x Allâhu Ekber
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Kıl</span>
            </button>
          </div>
        </div>
      )}

      {/* --- STICKY / FLOATING "SESLİ TAKİP" BOTTOM CONTROL DOCK --- */}
      {isVoiceFollowActive && !isCompleted && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg bg-stone-950/95 text-white dark:bg-stone-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between gap-3">
            {/* Movement Title & Animated Equalizer */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-end gap-0.5 h-5 w-4 shrink-0">
                <span
                  className={`w-1 bg-emerald-400 rounded-full transition-all ${
                    isAudioPlaying ? 'h-5 animate-pulse' : 'h-2'
                  }`}
                />
                <span
                  className={`w-1 bg-emerald-400 rounded-full transition-all ${
                    isAudioPlaying ? 'h-3 animate-ping' : 'h-3'
                  }`}
                />
                <span
                  className={`w-1 bg-emerald-400 rounded-full transition-all ${
                    isAudioPlaying ? 'h-4 animate-pulse' : 'h-1.5'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold truncate">
                  {currentStep.title} ({currentStep.rakat}. Rekât)
                </p>
                <p className="text-[10px] text-emerald-400 truncate">
                  {isVoiceFollowPaused
                    ? 'Duraklatıldı'
                    : transitionCountdown !== null
                    ? `Duruşu bitirin (${transitionCountdown}s)...`
                    : isAudioPlaying
                    ? 'Sesli okunuyor...'
                    : 'Devam ediyor'}
                </p>
              </div>
            </div>

            {/* Quick Playback Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scrollToActiveElement(undefined, true)}
                className="p-2 rounded-xl text-emerald-400 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Şu anki adımı ekranda ortala"
              >
                <Target className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0 && selectedSectionIndex === 0}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                title="Önceki Adım"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePauseResumeVoiceFollow}
                className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                title={isVoiceFollowPaused ? 'Devam Et' : 'Duraklat'}
              >
                {isVoiceFollowPaused ? (
                  <Play className="w-5 h-5 fill-current" />
                ) : (
                  <Pause className="w-5 h-5 fill-current" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Sonraki Adım"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={stopVoiceFollow}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/50 cursor-pointer ml-1"
                title="Sesli Takibi Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Re-center Button (Manual Browsing) */}
      {!isVoiceFollowActive && !isCompleted && (
        <button
          type="button"
          onClick={() => scrollToActiveElement(undefined, true)}
          className="fixed right-3 bottom-20 sm:bottom-24 z-30 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 text-stone-800 dark:text-stone-200 border border-emerald-500/40 shadow-xl backdrop-blur-md text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 transition-all cursor-pointer active:scale-95 group"
          title="Mevcut namaz adımını ekranda ortala"
        >
          <Target className="w-4 h-4 text-emerald-600 group-hover:rotate-45 transition-transform" />
          <span className="text-[11px] font-bold">Adımı Ortala</span>
        </button>
      )}

      {/* --- SESLİ TAKİP AYARLARI MODAL / DRAWER --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  Sesli Takip Ayarları
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Otomatik Kaydırma Seçeneği */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Otomatik Ekran Kaydırma</span>
                <input
                  type="checkbox"
                  checked={autoScrollEnabled}
                  onChange={(e) => setAutoScrollEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
              <p className="text-[11px] text-stone-500">
                Namaz hareketleri değiştikçe ekranı otomatik olarak sıradaki duruşa kaydırır.
              </p>
            </div>

            {/* Okuma Hızı (Kadans) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Okuma Hızı & Kadans
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'slow', label: 'Tâdil-i Erkân (0.8x)' },
                    { id: 'normal', label: 'Normal (0.9x)' },
                    { id: 'fast', label: 'Akıcı (1.05x)' }
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRecitationSpeed(opt.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      recitationSpeed === opt.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ses Rehberi Detayı */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Sesli Yönlendirme Şekli
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVoiceDetailMode('full')}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    voiceDetailMode === 'full'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="block font-semibold">Duruş + Dualar</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    "Rükû: Allahu Ekber..."
                  </span>
                </button>

                <button
                  onClick={() => setVoiceDetailMode('duaOnly')}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    voiceDetailMode === 'duaOnly'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="block font-semibold">Sadece Dualar</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    "Allahu Ekber..."
                  </span>
                </button>
              </div>
            </div>

            {/* Duruşlar Arası Bekleme Payı */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Duruşlar Arası Geçiş Payı</span>
                <span className="text-emerald-600 font-bold">{transitionDelaySeconds} sn</span>
              </label>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.5"
                value={transitionDelaySeconds}
                onChange={(e) => setTransitionDelaySeconds(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>1.5s (Hızlı)</span>
                <span>3.0s (Orta)</span>
                <span>5.0s (Geniş)</span>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Ayarları Kaydet ve Kapat
            </button>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Namaz, dinin direğidir. Hadis-i Şerif: "Kıyamet gününde kulun ilk hesaba çekileceği ameli namazdır. Eğer o düzgün olursa kurtuluşa erer."
        </p>
      </div>
        </>
      )}
    </div>
  );
};
