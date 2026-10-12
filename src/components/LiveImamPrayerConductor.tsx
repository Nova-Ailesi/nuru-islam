import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  Square,
  FastForward,
  Headphones,
  Check,
  X,
  Compass,
  Heart,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NamazTypeInfo, GenderType, NamazStep } from '../types';
import { ALL_NAMAZ_TYPES } from '../data/namazGuide';
import { NamazPostureIllustration } from './NamazPostureIllustration';
import { audioService } from '../services/audioService';

interface LiveImamPrayerConductorProps {
  onRecordPrayerCompleted?: (prayerId: string) => void;
  defaultPrayerId?: string;
}

type PrayerSpeed = 'slow' | 'normal' | 'fast';
type ImamRecitationStyle = 'camii_hocasi' | 'kendi_kilan';

export const LiveImamPrayerConductor: React.FC<LiveImamPrayerConductorProps> = ({
  onRecordPrayerCompleted,
  defaultPrayerId = 'sabah'
}) => {
  // 1. Setup & Configuration States
  const [selectedNamaz, setSelectedNamaz] = useState<NamazTypeInfo>(() => {
    return ALL_NAMAZ_TYPES.find((n) => n.id === defaultPrayerId) || ALL_NAMAZ_TYPES[0];
  });
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [gender, setGender] = useState<GenderType>('erkek');
  const [prayerSpeed, setPrayerSpeed] = useState<PrayerSpeed>('slow'); // 'slow' is recommended for huşu
  const [imamStyle, setImamStyle] = useState<ImamRecitationStyle>('camii_hocasi');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // 2. Active Live Conductor States
  const [isConducting, setIsConducting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prepCountdown, setPrepCountdown] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [tasbihCounter, setTasbihCounter] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // References
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  const currentSection = selectedNamaz.sections[selectedSectionIndex] || selectedNamaz.sections[0];
  const steps = currentSection.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Total steps in the whole prayer (all sections)
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

  // Speed multiplier & pause durations
  const speedConfigs: Record<PrayerSpeed, { speechRate: number; pauseSec: number; label: string }> = {
    slow: { speechRate: 0.82, pauseSec: 2.8, label: 'Sakin & Huşulu (Önerilen)' },
    normal: { speechRate: 0.92, pauseSec: 1.8, label: 'Normal Cami Ritmi' },
    fast: { speechRate: 1.05, pauseSec: 1.0, label: 'Seri Tempolu' }
  };

  // Screen WakeLock to keep screen on throughout prayer
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {
      // Ignore
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

  const clearTimers = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    if (prepIntervalRef.current) {
      clearInterval(prepIntervalRef.current);
      prepIntervalRef.current = null;
    }
    setPrepCountdown(null);
  };

  const stopConductor = () => {
    clearTimers();
    audioService.stopSpeaking();
    setIsConducting(false);
    setIsPaused(false);
    releaseWakeLock();
  };

  useEffect(() => {
    return () => {
      stopConductor();
    };
  }, []);

  // Format the spoken text for the Imam based on mode
  const getSpokenTextForStep = (step: NamazStep): string => {
    // If in mosque imam mode:
    // Imam recites aloud: Takbirs, Fâtiha, Zamm-ı Sure, Sami'allahu limen hamideh, Selam.
    // And in ruku/secde, recites the 3x tasbih with the congregation.
    return step.audioPrompt || step.transliteration || step.title;
  };

  // Execute recitation of current step & schedule auto-advance
  const reciteAndScheduleNext = useCallback(
    (step: NamazStep, stepIdx: number, sectionIdx: number) => {
      clearTimers();
      audioService.stopSpeaking();

      if (isAudioMuted) {
        // If muted, wait natural duration then advance
        const waitTime = (speedConfigs[prayerSpeed].pauseSec + 4) * 1000;
        autoNextTimeoutRef.current = setTimeout(() => {
          advanceToNextStep(stepIdx, sectionIdx);
        }, waitTime);
        return;
      }

      // Play soft transition chime when moving to a new posture
      audioService.playStepTransitionSound();

      const textToSpeak = getSpokenTextForStep(step);
      const config = speedConfigs[prayerSpeed];

      // Handle Tasbih counter animation for Ruku / Secde
      const titleLower = step.title.toLowerCase();
      const isTasbihStep = titleLower.includes('rükû') || titleLower.includes('secde');
      if (isTasbihStep) {
        setTasbihCounter(1);
        setTimeout(() => setTasbihCounter(2), 2200);
        setTimeout(() => setTasbihCounter(3), 4400);
      } else {
        setTasbihCounter(0);
      }

      audioService.speak(
        textToSpeak,
        'tr-TR',
        () => {
          // Recitation finished! Give natural solemn pause before next movement
          const pauseMs = config.pauseSec * 1000;
          autoNextTimeoutRef.current = setTimeout(() => {
            advanceToNextStep(stepIdx, sectionIdx);
          }, pauseMs);
        },
        () => {
          // On speech error fallback
          autoNextTimeoutRef.current = setTimeout(() => {
            advanceToNextStep(stepIdx, sectionIdx);
          }, 3000);
        },
        config.speechRate
      );
    },
    [isAudioMuted, prayerSpeed, speedConfigs]
  );

  // Advance to next step or next section or complete prayer
  const advanceToNextStep = useCallback(
    (currentIdx: number, currentSecIdx: number) => {
      clearTimers();
      const activeSec = selectedNamaz.sections[currentSecIdx];
      if (!activeSec) return;

      if (currentIdx < activeSec.steps.length - 1) {
        // Next movement in current section
        const nextIdx = currentIdx + 1;
        setCurrentStepIndex(nextIdx);
        const nextStep = activeSec.steps[nextIdx];
        reciteAndScheduleNext(nextStep, nextIdx, currentSecIdx);
      } else if (currentSecIdx < selectedNamaz.sections.length - 1) {
        // Move to next section (e.g., Sünnet finished -> moving to Farz)
        const nextSecIdx = currentSecIdx + 1;
        setSelectedSectionIndex(nextSecIdx);
        setCurrentStepIndex(0);
        const nextStep = selectedNamaz.sections[nextSecIdx].steps[0];
        reciteAndScheduleNext(nextStep, 0, nextSecIdx);
      } else {
        // Prayer Completed!
        stopConductor();
        setIsFinished(true);
        audioService.playAdhanChime();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // Confetti fallback
        }
        if (onRecordPrayerCompleted) {
          onRecordPrayerCompleted(selectedNamaz.id);
        }
      }
    },
    [selectedNamaz.sections, selectedNamaz.id, onRecordPrayerCompleted, reciteAndScheduleNext]
  );

  // Start Prayer with 3-second preparation countdown
  const handleStartPrayer = () => {
    clearTimers();
    setIsFinished(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setPrepCountdown(3);
    requestWakeLock();

    // 3.. 2.. 1..
    let count = 3;
    prepIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setPrepCountdown(count);
        audioService.playTasbihClick();
      } else {
        if (prepIntervalRef.current) {
          clearInterval(prepIntervalRef.current);
          prepIntervalRef.current = null;
        }
        setPrepCountdown(null);
        setIsConducting(true);

        // Start step 0
        const firstStep = selectedNamaz.sections[selectedSectionIndex].steps[0];
        reciteAndScheduleNext(firstStep, 0, selectedSectionIndex);
      }
    }, 1000);
  };

  // Pause / Resume
  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      // Resume current step
      reciteAndScheduleNext(currentStep, currentStepIndex, selectedSectionIndex);
    } else {
      setIsPaused(true);
      clearTimers();
      audioService.stopSpeaking();
    }
  };

  // Manual Step Navigation
  const handleManualNext = () => {
    clearTimers();
    audioService.stopSpeaking();
    advanceToNextStep(currentStepIndex, selectedSectionIndex);
  };

  const handleManualPrev = () => {
    clearTimers();
    audioService.stopSpeaking();
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStep = currentSection.steps[prevIdx];
      reciteAndScheduleNext(prevStep, prevIdx, selectedSectionIndex);
    } else if (selectedSectionIndex > 0) {
      const prevSecIdx = selectedSectionIndex - 1;
      const prevSec = selectedNamaz.sections[prevSecIdx];
      const lastStepIdx = prevSec.steps.length - 1;
      setSelectedSectionIndex(prevSecIdx);
      setCurrentStepIndex(lastStepIdx);
      const prevStep = prevSec.steps[lastStepIdx];
      reciteAndScheduleNext(prevStep, lastStepIdx, prevSecIdx);
    }
  };

  // Posture label mapping in Turkish
  const postureLabels: Record<string, string> = {
    kiyam: 'Kıyam (Ayakta Durma & Kıraat)',
    ruku: 'Rükû (Eğilme & Tesbih)',
    kavme: 'Kavme (Rükûdan Doğrulma)',
    secde: 'Secde (Yere Kapanma)',
    celse: 'Celse (İki Secde Arası Oturuş)',
    kade: 'Ka\'de (Oturuş & Tahiyyat)',
    selam_sag: 'Sağa Selâm',
    selam_sol: 'Sola Selâm'
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-24 text-left">
      {/* 1. SELECTION & CONFIGURATION VIEW (When not in active prayer) */}
      {!isConducting && !prepCountdown && !isFinished && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Hero Conductor Banner */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Sanal Cami İmamı · Canlı Kıldırma Modu</span>
                </div>

                {/* Gender Toggle */}
                <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
                  <button
                    onClick={() => setGender('erkek')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'erkek'
                        ? 'bg-emerald-500 text-stone-950 shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Erkek
                  </button>
                  <button
                    onClick={() => setGender('kadin')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'kadin'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Kadın
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
                  Hoca Eşliğinde Canlı Namaz Kıl
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                  Camide hoca nasıl namaz kıldırıyorsa, telefonunuzu seccadenizin önüne koyun; tekbirleri, Fâtiha ve sûreleri, rükû ve secde tesbihlerini imam seslendirsin, siz de huşuyla kılın.
                </p>
              </div>

              {/* Start Big Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartPrayer}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all active:scale-98 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Namazı Başlat (Hoca Kıldırsın)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Prayer Type Selector Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Kılınacak Namazı Seçin:
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedNamaz.rakatBreakdown}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {ALL_NAMAZ_TYPES.map((namaz) => {
                const isSelected = namaz.id === selectedNamaz.id;
                return (
                  <button
                    key={namaz.id}
                    onClick={() => {
                      setSelectedNamaz(namaz);
                      setSelectedSectionIndex(0);
                      setCurrentStepIndex(0);
                    }}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 scale-102'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:border-emerald-400'
                    }`}
                  >
                    {namaz.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Selection (e.g. Sünnet vs Farz) */}
          <div className="p-3 bg-stone-100/80 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Bölüm Seçimi:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedNamaz.sections.map((sec, idx) => {
                const isSecActive = idx === selectedSectionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedSectionIndex(idx);
                      setCurrentStepIndex(0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSecActive
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conductor Settings: Pace & Style */}
          <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Namaz Kıldırma Ayarları</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Pace Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500">
                  Kıraat Hızı & Huşu Derecesi:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['slow', 'normal', 'fast'] as PrayerSpeed[]).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPrayerSpeed(spd)}
                      className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        prayerSpeed === spd
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {spd === 'slow' ? 'Sakin' : spd === 'normal' ? 'Normal' : 'Seri'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500">
                  Kıraat Kapsamı:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setImamStyle('camii_hocasi')}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      imamStyle === 'camii_hocasi'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Cami İmamı
                  </button>
                  <button
                    onClick={() => setImamStyle('kendi_kilan')}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      imamStyle === 'kendi_kilan'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Birlikte Kıl (Tamamı)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PREPARATION COUNTDOWN SCREEN (3.. 2.. 1..) */}
      {prepCountdown !== null && (
        <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-28 h-28 rounded-full bg-emerald-500/15 border-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-5xl font-black font-mono shadow-2xl animate-pulse">
            {prepCountdown}
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              Niyetinizi Edin ve Seccadeye Geçin
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Telefonunuzu seccadenizin önüne koyun. İmam tekbir getirerek namazı başlatacaktır.
            </p>
          </div>
        </div>
      )}

      {/* 3. ACTIVE LIVE PRAYER CONDUCTOR SCREEN (Hoca Kıldırıyor) */}
      {isConducting && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Floating Conductor Bar */}
          <div className="bg-stone-900/90 dark:bg-stone-900 text-white rounded-3xl p-4 border border-stone-700/80 shadow-xl flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-300">
                  {selectedNamaz.name} · {currentSection.title}
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5">
                {currentStep.rakat}. Rekât · {postureLabels[currentStep.posture] || currentStep.title}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isAudioMuted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-white/10 text-white border-white/15'
                }`}
                title={isAudioMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleTogglePause}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs cursor-pointer"
                title={isPaused ? 'Devam Et' : 'Duraklat'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={stopConductor}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs cursor-pointer"
                title="Namazdan Çık"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Visual Prayer Stage */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xl space-y-4 relative overflow-hidden">
            {/* Step & Rekat Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>
                  Hareket: {currentStepIndex + 1} / {steps.length}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Toplam İlerleme: %{progressPercent}
                </span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Posture Illustration */}
            <div className="flex flex-col items-center justify-center py-2">
              <NamazPostureIllustration
                posture={currentStep.posture}
                gender={gender}
                className="w-48 h-48 sm:w-56 sm:h-56"
              />

              {/* Tasbih counter badge if in ruku/secde */}
              {tasbihCounter > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30 animate-bounce">
                  <span>Tesbih Sayısı:</span>
                  <span className="text-sm font-black">{tasbihCounter} / 3</span>
                </div>
              )}
            </div>

            {/* Recitation Box (What the Imam & You Read Aloud) */}
            <div className="p-4 bg-gradient-to-br from-emerald-50/50 via-stone-50 to-teal-50/30 dark:from-emerald-950/20 dark:via-stone-800/40 dark:to-teal-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/50 space-y-3 text-center">
              {/* Arabic Calligraphy */}
              {currentStep.arabicText && (
                <div>
                  <p className="font-arabic text-2xl sm:text-3xl text-stone-900 dark:text-white leading-loose">
                    {currentStep.arabicText}
                  </p>
                </div>
              )}

              {/* Transliteration */}
              {currentStep.transliteration && (
                <div className="pt-1 border-t border-emerald-200/40 dark:border-emerald-900/40">
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {currentStep.transliteration}
                  </p>
                </div>
              )}

              {/* Specific Posture Instruction for Gender */}
              <div className="pt-1 text-[11px] text-stone-600 dark:text-stone-300 italic">
                {gender === 'erkek'
                  ? currentStep.maleInstruction || currentStep.instruction
                  : currentStep.femaleInstruction || currentStep.instruction}
              </div>
            </div>

            {/* Manual Controls Bottom Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleManualPrev}
                disabled={currentStepIndex === 0 && selectedSectionIndex === 0}
                className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Önceki Hareket</span>
              </button>

              <button
                onClick={handleTogglePause}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPaused ? 'Devam Et' : 'Duraklat'}</span>
              </button>

              <button
                onClick={handleManualNext}
                className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Sonraki Hareket</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRAYER COMPLETED CELEBRATION CARD */}
      {isFinished && (
        <div className="p-6 bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white rounded-3xl border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black font-serif text-white">
              Allah Kabul Eylesin!
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              {selectedNamaz.name} ({currentSection.title}) eda edildi.
            </p>
          </div>

          {/* After prayer standard dhikr */}
          <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-center space-y-1 max-w-md mx-auto">
            <p className="font-arabic text-lg text-emerald-300">
              أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ
            </p>
            <p className="text-xs text-stone-300 italic pt-1">
              "Estağfirullâh. Allâhümme ente's-selâmü ve minke's-selâm, tebârakte yâ ze'l-celâli ve'l-ikrâm."
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            {selectedSectionIndex < selectedNamaz.sections.length - 1 && (
              <button
                onClick={() => {
                  setSelectedSectionIndex((prev) => prev + 1);
                  setIsFinished(false);
                  handleStartPrayer();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Sonraki Bölüme Geç ({selectedNamaz.sections[selectedSectionIndex + 1]?.title})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setIsFinished(false);
                setIsConducting(false);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Namazı Bitir & Ana Ekrana Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
