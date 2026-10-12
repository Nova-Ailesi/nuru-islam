import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import {
  prayerSessionService,
  ActivePrayerSession
} from '../services/prayerSessionService';
import { audioService } from '../services/audioService';
import { PrayerTimesData, PrayerKey } from '../types';
import { NamazPostureIllustration } from './NamazPostureIllustration';

interface PrayerProgressWidgetProps {
  data: PrayerTimesData;
  onOpenNamazGuide: (prayerKey: PrayerKey) => void;
}

export const PrayerProgressWidget: React.FC<PrayerProgressWidgetProps> = ({
  data,
  onOpenNamazGuide
}) => {
  const [session, setSession] = useState<ActivePrayerSession | null>(
    prayerSessionService.getSession()
  );
  const [isMosqueAmbiance, setIsMosqueAmbiance] = useState<boolean>(
    prayerSessionService.getMosqueAmbiance()
  );

  useEffect(() => {
    const unsubscribe = prayerSessionService.subscribe((updated) => {
      setSession(updated ? { ...updated } : null);
      if (updated) {
        setIsMosqueAmbiance(updated.isMosqueAmbianceActive);
      }
    });
    return unsubscribe;
  }, []);

  const currentPrayerKey = data.currentPrayer.key;
  const currentPrayerNamaz = prayerSessionService.getPrayerBySlot(currentPrayerKey);

  const handleToggleMosqueAmbiance = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !isMosqueAmbiance;
    setIsMosqueAmbiance(nextVal);
    prayerSessionService.setMosqueAmbiance(nextVal);
    audioService.setMosqueAcoustic(nextVal);
    if (nextVal) {
      audioService.playMosqueTakbir('allahu_ekber');
    } else {
      audioService.playTasbihClick();
    }
  };

  const handleStartActivePrayer = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    prayerSessionService.startSession(currentPrayerNamaz.id, 0, 0, true);
    onOpenNamazGuide(currentPrayerKey);
  };

  const handlePauseResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return;
    if (session.isVoiceFollowPaused) {
      prayerSessionService.resumeSession();
    } else {
      prayerSessionService.pauseSession();
      audioService.stopSpeaking();
    }
  };

  const handleEndSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    prayerSessionService.clearSession();
    audioService.stopSpeaking();
  };

  const isCurrentActive =
    session && !session.isCompleted && session.isVoiceFollowActive;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white p-5 border border-emerald-500/40 shadow-xl transition-all duration-300">
      {/* Decorative Mosque Dome Arch Silhouette Background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 120" className="w-44 h-28 text-emerald-300 fill-current">
          <path d="M100 10C80 40 40 45 30 75C20 105 20 120 20 120H180C180 120 180 105 170 75C160 45 120 40 100 10Z" />
        </svg>
      </div>

      {/* ACTIVE REAL-TIME PRAYER PROGRESS IN PROGRESS */}
      {isCurrentActive ? (
        <div className="relative z-10 space-y-4">
          {/* Header Row: Live Pulse & Synced Namaz Name */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                    {session.prayerName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                    {session.sectionTitle}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/90 font-medium">
                  Canlı Takip · {session.currentRakat}. Rekât
                </p>
              </div>
            </div>

            {/* Cami Modu Toggle Pill */}
            <button
              onClick={handleToggleMosqueAmbiance}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                isMosqueAmbiance
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:text-white'
              }`}
              title="Cami Akustiği (Kubbe Yankısı & Cemaat Ambiyansı)"
            >
              <span className="text-xs">🕌</span>
              <span className="text-[11px] hidden sm:inline">Cami Modu</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isMosqueAmbiance ? 'bg-emerald-400 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isMosqueAmbiance ? 'Açık' : 'Kapalı'}
              </span>
            </button>
          </div>

          {/* Core Recitation Stage & Movement Stage */}
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="relative shrink-0">
              <NamazPostureIllustration
                posture={session.posture}
                gender="erkek"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
              <span className="absolute -bottom-1 -right-1 text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider">
                {session.posture}
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Mevcut Kıraat & Duruş
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                {session.stepTitle}
              </h4>
              <p className="text-[11px] text-stone-300 line-clamp-1 italic">
                "{session.recitationStage}"
              </p>
              {session.arabicSnippet && (
                <p className="font-arabic text-sm text-emerald-200 text-right line-clamp-1 leading-normal">
                  {session.arabicSnippet}
                </p>
              )}
            </div>
          </div>

          {/* Live Progress Bar with % and overall step counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">
                Namaz İlerlemesi ({session.currentStepOverallNumber} / {session.totalStepsInPrayer} Adım)
              </span>
              <span className="font-mono font-bold text-emerald-300">
                %{session.progressPercent}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-2 rounded-full transition-all duration-300"
                style={{ width: `${session.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Action Controls in Mini Widget */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePauseResume}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/10"
              >
                {session.isVoiceFollowPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                    <span>Devam Et</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>Duraklat</span>
                  </>
                )}
              </button>

              <button
                onClick={handleEndSession}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Kılınışı İptal Et"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onOpenNamazGuide(currentPrayerKey)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
            >
              <span>Namaz Rehberini Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* IDLE / VAKTİN NAMAZINA DAVET MODU */
        <div className="relative z-10 space-y-3.5">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Vaktin Namazı & Canlı Takip
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {currentPrayerNamaz.name}
                </h3>
              </div>
            </div>

            {/* Cami Modu Acoustic Badge */}
            <button
              onClick={handleToggleMosqueAmbiance}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isMosqueAmbiance
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:text-white'
              }`}
              title="Cami Akustiği (Kubbe Yankısı & İmam Modu)"
            >
              <span className="text-xs">🕌</span>
              <span className="text-[11px]">Cami Akustiği</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isMosqueAmbiance ? 'bg-emerald-400 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isMosqueAmbiance ? 'Açık' : 'Kapalı'}
              </span>
            </button>
          </div>

          {/* Breakdown Pills: Rekât details & estimated time */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-white/5 text-stone-200 border border-white/10 font-medium">
              {currentPrayerNamaz.rakatBreakdown}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>~8-12 dakika</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/5 text-stone-300 border border-white/10 font-medium">
              Sesli Adım Adım Rehber
            </span>
          </div>

          {/* Spiritual Quote & Mosque Invitation */}
          <p className="text-xs text-stone-300/90 leading-relaxed">
            {isMosqueAmbiance
              ? 'Kubbe akustiği ve imam eşliği devrede. Telefonunuzu seccade önüne koyarak camide cemaatle saf tutmuş gibi namazınızı eda edebilirsiniz.'
              : 'Sesli takip ve otomatik ekran ortalama ile namazınızı huşu içinde adım adım kılabilirsiniz.'}
          </p>

          {/* Launch Action */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => onOpenNamazGuide(currentPrayerKey)}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Namaz Bilgilerini İncele</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStartActivePrayer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 active:scale-95 transition-all cursor-pointer"
            >
              <span>Vaktin Namazını Kıl</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
