import React, { useEffect, useState, useRef } from 'react';
import {
  BellRing,
  X,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
  Droplet,
  Compass,
  CheckCircle2,
  Moon,
  Clock
} from 'lucide-react';
import {
  NotificationHistoryItem,
  prayerNotificationService,
  PRAYER_DISPLAY_NAMES
} from '../services/prayerNotificationService';
import { PrayerKey, PrayerTimesData } from '../types';
import { audioService } from '../services/audioService';

interface InAppNotificationToastProps {
  prayerTimesData?: PrayerTimesData | null;
  onOpenPrayerGuide: (prayerKey: PrayerKey) => void;
  onOpenAbdestGuide: () => void;
  onOpenQibla?: () => void;
}

export const InAppNotificationToast: React.FC<InAppNotificationToastProps> = ({
  prayerTimesData,
  onOpenPrayerGuide,
  onOpenAbdestGuide,
  onOpenQibla
}) => {
  const [currentAlert, setCurrentAlert] = useState<NotificationHistoryItem | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(100);
  const autoDismissTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // 1. Subscribe to service-level dispatched notifications
  useEffect(() => {
    const unsubscribe = prayerNotificationService.subscribeInAppAlert((item) => {
      setCurrentAlert(item);
      if (!soundMuted) {
        audioService.playAdhanChime();
      }
    });
    return unsubscribe;
  }, [soundMuted]);

  // 2. Real-time in-app clock watcher (checks every 20 seconds for exact prayer arrival)
  useEffect(() => {
    if (!prayerTimesData || !prayerTimesData.times) return;

    const checkCurrentPrayerTimes = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMins = currentHours * 60 + currentMinutes;
      const todayStr = now.toISOString().split('T')[0];

      const keys: PrayerKey[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

      for (const key of keys) {
        const timeStr = prayerTimesData.times[key];
        if (!timeStr) continue;

        const [h, m] = timeStr.split(':').map(Number);
        const prayerMins = h * 60 + m;

        // If current minute matches prayer time exactly (or within 2 minutes of start)
        const diff = currentTotalMins - prayerMins;
        if (diff >= 0 && diff <= 2) {
          const firedKey = `inapp_banner_fired_${todayStr}_${key}`;
          const alreadyFired = sessionStorage.getItem(firedKey);

          if (!alreadyFired) {
            sessionStorage.setItem(firedKey, 'true');
            const prayerName = PRAYER_DISPLAY_NAMES[key] || key;

            const newAlert: NotificationHistoryItem = {
              id: `inapp_${Date.now()}`,
              prayerKey: key,
              prayerName,
              prayerTime: timeStr,
              type: 'exact',
              title: `${prayerName} Vakti Girdi (${timeStr})`,
              body: `Haydin namaza, haydin kurtuluşa! ${prayerName} namazını huzurla eda etmek için Namaz Rehberi'ni başlatabilirsiniz.`,
              timestamp: Date.now(),
              formattedTime: `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
            };

            setCurrentAlert(newAlert);
            if (!soundMuted) {
              audioService.playAdhanChime();
            }
            break;
          }
        }
      }
    };

    // Run initial check and set interval
    checkCurrentPrayerTimes();
    const interval = window.setInterval(checkCurrentPrayerTimes, 20000);
    return () => window.clearInterval(interval);
  }, [prayerTimesData, soundMuted]);

  // 3. Auto-dismiss timer with smooth countdown bar (18 seconds)
  useEffect(() => {
    if (!currentAlert) {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const DURATION_MS = 18000;
    const INTERVAL_MS = 100;
    const startTime = Date.now();
    setProgressPercent(100);

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgressPercent(remaining);
      if (remaining <= 0) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, INTERVAL_MS);

    autoDismissTimerRef.current = window.setTimeout(() => {
      setCurrentAlert(null);
    }, DURATION_MS);

    return () => {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentAlert]);

  if (!currentAlert) return null;

  const isExactTime = currentAlert.type === 'exact';

  return (
    <aside
      aria-label="Namaz Vakti Bildirimi"
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg animate-in slide-in-from-top-6 duration-300 drop-shadow-2xl"
    >
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950/95 text-white border-2 border-emerald-500/80 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-950/60 ring-1 ring-amber-400/30 space-y-3.5 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Decorative Background Crescent Glow */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Moon className="w-28 h-28 text-emerald-400" />
        </div>

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Glowing Adhan Icon */}
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 flex items-center justify-center shrink-0 shadow-inner shadow-emerald-500/30 animate-pulse">
              <BellRing className="w-5 h-5 text-emerald-300 animate-bounce" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-stone-950 uppercase tracking-wider shadow-xs">
                  {isExactTime ? 'Vakit Girdi' : currentAlert.type === 'test' ? 'Test Bildirimi' : 'Vakit Yaklaştı'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentAlert.prayerTime}</span>
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white mt-0.5 truncate tracking-tight">
                {currentAlert.title}
              </h3>
            </div>
          </div>

          {/* Action buttons on top-right: Sound toggle & Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title={soundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setCurrentAlert(null)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message body text */}
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed relative z-10 pl-0.5 font-medium">
          {currentAlert.body}
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-emerald-900/60 relative z-10">
          {currentAlert.prayerKey && currentAlert.prayerKey !== 'gunes' ? (
            <button
              onClick={() => {
                onOpenPrayerGuide(currentAlert.prayerKey);
                setCurrentAlert(null);
              }}
              className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/50 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Namaz Kılma Rehberi'ni Başlat</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenPrayerGuide('ogle');
                setCurrentAlert(null);
              }}
              className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/50 transition-all"
            >
              <span>Namaz Kılma Rehberi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              onOpenAbdestGuide();
              setCurrentAlert(null);
            }}
            className="py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            title="Abdest Alma Rehberi"
          >
            <Droplet className="w-4 h-4 text-sky-400" />
            <span>Abdest Al</span>
          </button>

          {onOpenQibla && (
            <button
              onClick={() => {
                onOpenQibla();
                setCurrentAlert(null);
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer transition-colors shrink-0 hidden sm:flex items-center justify-center"
              title="Kıble Pusulası"
            >
              <Compass className="w-4 h-4 text-amber-300" />
            </button>
          )}
        </div>

        {/* Auto-dismiss subtle progress line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
