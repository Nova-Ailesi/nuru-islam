import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Sparkles,
  Volume2,
  Bell,
  BellOff,
  ChevronRight,
  Info,
  Flame,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  AlertTriangle,
  RotateCcw,
  Layers,
  Disc3,
  CheckCircle2,
  Share2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrayerTimesData, PrayerKey, Language } from '../types';
import { audioService } from '../services/audioService';

interface NextPrayerCountdownWidgetProps {
  data: PrayerTimesData;
  cityName: string;
  onStartPrayer: (prayerKey: PrayerKey) => void;
  onOpenNotifications?: () => void;
  isNotificationActive?: boolean;
  onOpenQibla?: () => void;
  lang?: Language;
}

// Convert "HH:MM" to seconds from midnight
const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 3600 + (m || 0) * 60;
};

// Format seconds into double digits
const padZero = (n: number): string => n.toString().padStart(2, '0');

// Hadiths and virtues for each prayer
const PRAYER_VIRTUES: Record<PrayerKey, { title: string; hadith: string; source: string; tips: string }> = {
  imsak: {
    title: 'Sabah Namazının Fazileti',
    hadith: 'Sabah namazının iki rekât sünneti, dünyadan ve dünyadaki her şeyden daha hayırlıdır.',
    source: 'Müslim, Müsâfirîn, 96',
    tips: 'Seher vaktinde yapılan tövbe ve istiğfar duaları kabul kapılarını açar.'
  },
  gunes: {
    title: 'Güneş Doğumu ve İşrak Vakti',
    hadith: 'Sabah namazından sonra güneş bir mızrak boyu yükselene kadar zikirle meşgul olup iki rekât kılan tam bir hac ve umre sevabı alır.',
    source: 'Tirmizî, Cum’a, 59',
    tips: 'Güneş doğarken (kerâhet vakti) namaz kılınmaz; 45 dk sonra İşrak namazı kılınabilir.'
  },
  ogle: {
    title: 'Öğle Namazının Fazileti',
    hadith: 'Öğle vakti, gök kapılarının açıldığı ve ilâhî rahmetin indiği mübarek bir andır.',
    source: 'Tirmizî, Salât, 342',
    tips: 'Günün koşuşturmasında kalbe huzur ve rızka bereket bahşeden bir duraktır.'
  },
  ikindi: {
    title: 'İkindi (Salât-ı Vüstâ) Fazileti',
    hadith: 'İkindi namazını kılan kimse için melekler şahitlik eder ve cennetle müjdelenir.',
    source: 'Buhârî, Mevâkît, 16',
    tips: 'Kur’an-ı Kerim’de "Orta namaza dikkat edin" buyrularak hususen vurgulanmıştır.'
  },
  aksam: {
    title: 'Akşam Namazının Fazileti',
    hadith: 'Ümmetim, akşam namazını yıldızlar belirip karışmadan önce kıldıkları müddetçe hayır üzeredir.',
    source: 'Ebû Dâvûd, Salât, 6',
    tips: 'Akşam vakti girdikten sonra kılınan 2 ila 6 rekâtlık Evvâbîn namazı büyük sevaptır.'
  },
  yatsi: {
    title: 'Yatsı ve Vitir Fazileti',
    hadith: 'Yatsı namazını cemaatle kılan kimse, gecenin yarısını ibadetle geçirmiş gibi sevap kazanır.',
    source: 'Müslim, Mesâcid, 260',
    tips: 'Günün son farzıdır. Ardından kılınacak Vitir namazı vacip bir nur hazinesidir.'
  }
};

const PRAYER_NAMES: Record<PrayerKey, string> = {
  imsak: 'İmsak (Sabah)',
  gunes: 'Güneş Doğuşu',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam (İftar)',
  yatsi: 'Yatsı'
};

const PRAYER_ICONS: Record<PrayerKey, React.ComponentType<{ className?: string }>> = {
  imsak: Moon,
  gunes: Sunrise,
  ogle: Sun,
  ikindi: Sun,
  aksam: Sunset,
  yatsi: Moon
};

export const NextPrayerCountdownWidget: React.FC<NextPrayerCountdownWidgetProps> = ({
  data,
  cityName,
  onStartPrayer,
  onOpenNotifications,
  isNotificationActive = false
}) => {
  // Mode: 'cards' | 'dial' | 'compact'
  const [displayMode, setDisplayMode] = useState<'cards' | 'dial' | 'compact'>('cards');
  const [showVirtueModal, setShowVirtueModal] = useState(false);
  const [isPlayingChime, setIsPlayingChime] = useState(false);
  const [hasCelebratedTransition, setHasCelebratedTransition] = useState<string | null>(null);

  // Current system seconds from midnight
  const [nowSec, setNowSec] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  });

  // Tick every second for 1-second accuracy
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setNowSec(d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ordered prayer schedule
  const schedule = useMemo(() => {
    return [
      { key: 'imsak' as PrayerKey, time: data.times.imsak, sec: timeToSeconds(data.times.imsak) },
      { key: 'gunes' as PrayerKey, time: data.times.gunes, sec: timeToSeconds(data.times.gunes) },
      { key: 'ogle' as PrayerKey, time: data.times.ogle, sec: timeToSeconds(data.times.ogle) },
      { key: 'ikindi' as PrayerKey, time: data.times.ikindi, sec: timeToSeconds(data.times.ikindi) },
      { key: 'aksam' as PrayerKey, time: data.times.aksam, sec: timeToSeconds(data.times.aksam) },
      { key: 'yatsi' as PrayerKey, time: data.times.yatsi, sec: timeToSeconds(data.times.yatsi) }
    ];
  }, [data.times]);

  // Compute active interval and remaining countdown
  const countdownState = useMemo(() => {
    const nextIdx = schedule.findIndex((p) => p.sec > nowSec);

    let nextPrayerItem;
    let prevPrayerItem;
    let remainingSeconds = 0;
    let totalDuration = 0;

    if (nextIdx === -1) {
      // Past Yatsı tonight, next prayer is tomorrow's İmsak
      nextPrayerItem = schedule[0]; // imsak
      prevPrayerItem = schedule[schedule.length - 1]; // yatsi
      remainingSeconds = 86400 - nowSec + nextPrayerItem.sec;
      totalDuration = 86400 - prevPrayerItem.sec + nextPrayerItem.sec;
    } else {
      nextPrayerItem = schedule[nextIdx];
      prevPrayerItem = nextIdx === 0 ? schedule[schedule.length - 1] : schedule[nextIdx - 1];

      remainingSeconds = nextPrayerItem.sec - nowSec;
      if (nextIdx === 0) {
        totalDuration = 86400 - prevPrayerItem.sec + nextPrayerItem.sec;
      } else {
        totalDuration = nextPrayerItem.sec - prevPrayerItem.sec;
      }
    }

    if (totalDuration <= 0) totalDuration = 1;
    const elapsedSeconds = Math.max(0, totalDuration - remainingSeconds);
    const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalDuration) * 100));

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    const isUrgent = remainingSeconds <= 900; // less than 15 mins
    const isVeryClose = remainingSeconds <= 300; // less than 5 mins

    return {
      nextPrayer: nextPrayerItem,
      currentPrayer: prevPrayerItem,
      remainingSeconds,
      hours,
      minutes,
      seconds,
      progressPercent,
      isUrgent,
      isVeryClose
    };
  }, [nowSec, schedule]);

  // Celebrate prayer time entry
  useEffect(() => {
    if (countdownState.remainingSeconds === 0 && hasCelebratedTransition !== countdownState.nextPrayer.key) {
      setHasCelebratedTransition(countdownState.nextPrayer.key);
      audioService.playAdhanChime();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [countdownState.remainingSeconds, countdownState.nextPrayer.key, hasCelebratedTransition]);

  const NextIcon = PRAYER_ICONS[countdownState.nextPrayer.key] || Clock;
  const CurrentIcon = PRAYER_ICONS[countdownState.currentPrayer.key] || Clock;
  const virtueInfo = PRAYER_VIRTUES[countdownState.nextPrayer.key];

  const handlePlayAdhanPreview = () => {
    setIsPlayingChime(true);
    audioService.playAdhanChime();
    setTimeout(() => setIsPlayingChime(false), 2500);
  };

  // SVG Dial parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdownState.progressPercent / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white shadow-2xl border border-emerald-500/30 transition-all w-full max-w-full">
      {/* Subtle Islamic Arabesque Geometric Background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.25) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative Golden Ambient Glows strictly contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Header bar: City, Hijri Date, Live Time, View Mode Selector */}
      <div className="relative z-10 px-3.5 sm:px-5 pt-4 pb-2 border-b border-emerald-800/40 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate max-w-[120px] sm:max-w-none">{cityName}</span>
          </div>
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">·</span>
          <span className="text-xs text-amber-300/90 font-medium hidden sm:inline">
            {data.hijriDate}
          </span>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setDisplayMode('cards')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === 'cards'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Kart Görünümü"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden xs:inline">Sayaç</span>
          </button>
          <button
            onClick={() => setDisplayMode('dial')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === 'dial'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Kadran Görünümü"
          >
            <Disc3 className="w-3 h-3" />
            <span className="hidden xs:inline">Kadran</span>
          </button>
          <button
            onClick={() => setDisplayMode('compact')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              displayMode === 'compact'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Kompakt Görünüm"
          >
            <Clock className="w-3 h-3" />
            <span className="hidden xs:inline">Kompakt</span>
          </button>
        </div>
      </div>

      {/* Main Countdown Display Area */}
      <div className="relative z-10 px-5 py-4">
        {/* Urgent Notification Banner if prayer is within 15 minutes */}
        {countdownState.isUrgent && (
          <div className="mb-3.5 px-3 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between gap-2 animate-pulse">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">
                {countdownState.isVeryClose
                  ? `Ezan okunmak üzere (${countdownState.nextPrayer.time})! Hazırlanın.`
                  : `${PRAYER_NAMES[countdownState.nextPrayer.key]} vaktine 15 dakikadan az kaldı! Abdestinizi tazeleyebilirsiniz.`}
              </span>
            </div>
            <button
              onClick={() => onStartPrayer(countdownState.nextPrayer.key)}
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-[10px] shrink-0 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Abdest/Namaz
            </button>
          </div>
        )}

        {/* Next Prayer Badge & Current Context */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <NextIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1">
                <span>Sıradaki Vakit:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {countdownState.nextPrayer.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>{PRAYER_NAMES[countdownState.nextPrayer.key]}</span>
                <button
                  onClick={() => setShowVirtueModal(true)}
                  className="p-1 rounded-full text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
                  title="Vaktin Fazileti ve Hadisi"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </h3>
            </div>
          </div>

          {/* Current Active Prayer Capsule */}
          <div className="text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
              Şu Anki Vakit
            </span>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-stone-200">
              <CurrentIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{PRAYER_NAMES[countdownState.currentPrayer.key]}</span>
            </div>
          </div>
        </div>

        {/* View 1: Digital Flip Cards (Default) */}
        {displayMode === 'cards' && (
          <div className="space-y-3">
            {/* The 3 Glowing Time Cards: Hours, Minutes, Seconds */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md mx-auto my-2">
              {/* Hours Card */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-lg backdrop-blur-md">
                <span className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight drop-shadow-sm">
                  {padZero(countdownState.hours)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/90 mt-1">
                  SAAT
                </span>
              </div>

              {/* Minutes Card */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-lg backdrop-blur-md relative">
                <span className="text-3xl sm:text-5xl font-black font-mono text-amber-300 tracking-tight drop-shadow-sm">
                  {padZero(countdownState.minutes)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300/90 mt-1">
                  DAKİKA
                </span>
              </div>

              {/* Seconds Card */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 shadow-lg backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-3xl sm:text-5xl font-black font-mono text-emerald-300 tracking-tight drop-shadow-sm">
                  {padZero(countdownState.seconds)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/90 mt-1">
                  SANİYE
                </span>
              </div>
            </div>

            {/* Interval Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-stone-300">
                <span className="flex items-center gap-1 text-stone-400">
                  <span>{countdownState.currentPrayer.time}</span>
                  <span className="text-stone-500">→</span>
                  <span className="text-emerald-300 font-semibold">{countdownState.nextPrayer.time}</span>
                </span>
                <span className="font-mono text-xs text-amber-300 font-semibold">
                  %{Math.round(countdownState.progressPercent)} Tamamlandı
                </span>
              </div>
              <div className="h-2 w-full bg-stone-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-1000 ease-linear shadow-xs"
                  style={{ width: `${countdownState.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* View 2: Radial Dial (Kadran) */}
        {displayMode === 'dial' && (
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="text-stone-800/80"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Animated Gradient Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#countdownGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Center: Countdown Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                  KALAN SÜRE
                </span>
                <span className="text-3xl font-black font-mono text-white tracking-tight my-0.5">
                  {padZero(countdownState.hours)}:{padZero(countdownState.minutes)}:{padZero(countdownState.seconds)}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold font-mono">
                  %{Math.round(countdownState.progressPercent)} Vakit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Compact Minimal */}
        {displayMode === 'compact' && (
          <div className="py-2 flex items-center justify-between bg-black/30 px-4 py-3 rounded-2xl border border-white/10">
            <div>
              <span className="text-[11px] text-stone-400 block">Vaktin girmesine:</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wider">
                {padZero(countdownState.hours)}h {padZero(countdownState.minutes)}m {padZero(countdownState.seconds)}s
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-amber-300 font-bold block">
                %{Math.round(countdownState.progressPercent)}
              </span>
              <span className="text-[10px] text-stone-400">İlerleme</span>
            </div>
          </div>
        )}

        {/* Prayer Stepper Flow: İmsak -> Güneş -> Öğle -> İkindi -> Akşam -> Yatsı */}
        <div className="mt-4 pt-3 border-t border-emerald-800/40">
          <div className="flex items-center justify-between text-center relative">
            {schedule.map((item) => {
              const isCurrent = countdownState.currentPrayer.key === item.key;
              const isNext = countdownState.nextPrayer.key === item.key;
              const StepIcon = PRAYER_ICONS[item.key];

              return (
                <div
                  key={item.key}
                  onClick={() => {
                    if (item.key !== 'gunes') onStartPrayer(item.key);
                  }}
                  className={`flex flex-col items-center relative z-10 transition-all cursor-pointer group ${
                    isNext ? 'scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isNext
                        ? 'bg-amber-400 text-stone-950 font-bold ring-4 ring-amber-400/30 shadow-lg'
                        : isCurrent
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                        : 'bg-white/10 text-stone-300 group-hover:bg-white/20'
                    }`}
                  >
                    <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] mt-1 font-semibold ${
                      isNext
                        ? 'text-amber-300 font-bold'
                        : isCurrent
                        ? 'text-emerald-300'
                        : 'text-stone-400'
                    }`}
                  >
                    {item.key.slice(0, 1).toUpperCase() + item.key.slice(1, 3)}
                  </span>
                  <span className="text-[9px] font-mono text-stone-300">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-4 pt-3 border-t border-emerald-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full">
          {/* Quick Pray Button */}
          <button
            onClick={() => onStartPrayer(countdownState.currentPrayer.key)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95 w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 text-stone-950 shrink-0" />
            <span className="truncate">{PRAYER_NAMES[countdownState.currentPrayer.key]} Namazını Kıl</span>
          </button>

          {/* Adhan Chime & Notification controls */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto">
            <button
              onClick={handlePlayAdhanPreview}
              className="flex items-center gap-1 px-3 py-2 bg-white/15 hover:bg-white/25 text-white font-medium rounded-xl text-xs backdrop-blur-xs transition-colors cursor-pointer"
              title="Ezan Sesi Dinle"
            >
              {isPlayingChime ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="text-amber-200">Çalıyor...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                  <span>Ezan Sesi</span>
                </>
              )}
            </button>

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isNotificationActive
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title="Bildirim Ayarları"
              >
                {isNotificationActive ? (
                  <Bell className="w-4 h-4 text-emerald-300" />
                ) : (
                  <BellOff className="w-4 h-4 text-stone-300" />
                )}
              </button>
            )}

            <button
              onClick={() => setShowVirtueModal(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
              title="Vakit Faziletleri"
            >
              <Info className="w-4 h-4 text-stone-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Prayer Virtue & Hadith Information */}
      {showVirtueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <NextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {virtueInfo.title}
                  </h4>
                  <span className="text-xs text-amber-300 font-mono">
                    Giriş: {countdownState.nextPrayer.time}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVirtueModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Hadith Quote */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 space-y-2">
              <p className="text-sm italic text-emerald-100 font-serif leading-relaxed">
                "{virtueInfo.hadith}"
              </p>
              <p className="text-xs text-amber-400 font-medium text-right">
                — {virtueInfo.source}
              </p>
            </div>

            {/* Worship Tip */}
            <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50 space-y-1">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                İbadet Tavsiyesi:
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {virtueInfo.tips}
              </p>
            </div>

            <button
              onClick={() => {
                setShowVirtueModal(false);
                onStartPrayer(countdownState.nextPrayer.key);
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{PRAYER_NAMES[countdownState.nextPrayer.key]} Rehberini Aç</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
