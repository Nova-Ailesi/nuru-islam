import React, { useState, useEffect } from 'react';
import {
  History,
  Plus,
  Minus,
  Check,
  Calendar,
  Sparkles,
  TrendingDown,
  Info
} from 'lucide-react';
import { KazaPrayerState } from '../types';
import { audioService } from '../services/audioService';
import { AdBannerSlot } from './AdBannerSlot';

interface KazaTrackerProps {
  onKazaCompleted?: (amount: number) => void;
}

const DEFAULT_KAZA: KazaPrayerState = {
  sabah: 0,
  ogle: 0,
  ikindi: 0,
  aksam: 0,
  yatsi: 0,
  vitir: 0,
  oruc: 0
};

export const KazaTrackerView: React.FC<KazaTrackerProps> = ({ onKazaCompleted }) => {
  const [kazalar, setKazalar] = useState<KazaPrayerState>(() => {
    const saved = localStorage.getItem('user_kaza_state');
    return saved ? JSON.parse(saved) : DEFAULT_KAZA;
  });

  const [dailyTarget, setDailyTarget] = useState<number>(() => {
    return Number(localStorage.getItem('kaza_daily_target')) || 1;
  });

  useEffect(() => {
    localStorage.setItem('user_kaza_state', JSON.stringify(kazalar));
  }, [kazalar]);

  useEffect(() => {
    localStorage.setItem('kaza_daily_target', dailyTarget.toString());
  }, [dailyTarget]);

  const updateKaza = (key: keyof KazaPrayerState, delta: number) => {
    setKazalar((prev) => {
      const currentVal = prev[key];
      const newVal = Math.max(0, currentVal + delta);
      if (delta < 0 && currentVal > 0) {
        audioService.playTasbihClick();
        if (onKazaCompleted) {
          onKazaCompleted(Math.abs(delta));
        }
      }
      return { ...prev, [key]: newVal };
    });
  };

  const totalPrayers =
    kazalar.sabah + kazalar.ogle + kazalar.ikindi + kazalar.aksam + kazalar.yatsi + kazalar.vitir;

  // 1 full day of prayer = 6 prayers (Sabah, Ogle, Ikindi, Aksam, Yatsi, Vitir)
  const totalDays = Math.ceil(totalPrayers / 6);
  const estimatedDaysToFinish = dailyTarget > 0 ? Math.ceil(totalDays / dailyTarget) : 0;
  const estimatedYears = (estimatedDaysToFinish / 365).toFixed(1);

  const kazaItems: { key: keyof KazaPrayerState; label: string; count: number; color: string }[] = [
    { key: 'sabah', label: "Sabah Namazı", count: kazalar.sabah, color: "text-indigo-600 dark:text-indigo-400" },
    { key: 'ogle', label: "Öğle Namazı", count: kazalar.ogle, color: "text-amber-600 dark:text-amber-400" },
    { key: 'ikindi', label: "İkindi Namazı", count: kazalar.ikindi, color: "text-orange-600 dark:text-orange-400" },
    { key: 'aksam', label: "Akşam Namazı", count: kazalar.aksam, color: "text-rose-600 dark:text-rose-400" },
    { key: 'yatsi', label: "Yatsı Namazı", count: kazalar.yatsi, color: "text-purple-600 dark:text-purple-400" },
    { key: 'vitir', label: "Vitir Vacip", count: kazalar.vitir, color: "text-teal-600 dark:text-teal-400" },
    { key: 'oruc', label: "Kaza Orucu (Gün)", count: kazalar.oruc, color: "text-emerald-600 dark:text-emerald-400" }
  ];

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Overview Metric Banner */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 border border-emerald-900/60 rounded-3xl p-5 shadow-xl text-white space-y-3">
        <div className="flex items-center justify-between text-xs text-emerald-200">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <History className="w-4 h-4 text-emerald-400" />
            Kaza Borcu Özeti
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-700/50">
            {totalDays} Günlük Kaza
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[11px] text-stone-400">Toplam Kalan Kaza Vakti</p>
            <p className="text-3xl font-extrabold font-mono text-amber-400 mt-0.5">
              {totalPrayers}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[11px] text-stone-400">Tahmini Bitiş Süresi</p>
            <p className="text-xl font-extrabold font-mono text-emerald-300 mt-1">
              {estimatedDaysToFinish > 0 ? `${estimatedDaysToFinish} gün (~${estimatedYears} yıl)` : 'Borç Yok'}
            </p>
          </div>
        </div>

        {/* Daily Target Setting */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span className="text-stone-300">Günde Kaç Günlük Kaza Kılınacak?</span>
          <div className="flex items-center gap-2">
            {[1, 2, 5].map((target) => (
              <button
                key={target}
                onClick={() => setDailyTarget(target)}
                className={`px-2.5 py-1 rounded-lg font-bold font-mono text-xs transition-colors cursor-pointer ${
                  dailyTarget === target
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
              >
                {target} Gün
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sponsored Ad Slot (AdMob Banner Placement) */}
      <AdBannerSlot slotLocation="kaza_feed" />

      {/* Kaza Counter Cards */}
      <div className="space-y-2.5">
        {kazaItems.map((item) => (
          <div
            key={item.key}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3"
          >
            <div>
              <h4 className={`text-xs font-bold ${item.color}`}>
                {item.label}
              </h4>
              <p className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-0.5">
                {item.count}
              </p>
            </div>

            {/* Quick Increment / Decrement Action Buttons */}
            <div className="flex items-center gap-1.5">
              {/* -5 */}
              <button
                onClick={() => updateKaza(item.key, -5)}
                disabled={item.count === 0}
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-stone-600 dark:text-stone-300 hover:text-rose-600 font-bold text-xs flex items-center justify-center disabled:opacity-30 cursor-pointer transition-colors"
                title="-5 Kaza Düştüm"
              >
                -5
              </button>
              {/* -1 (Primary Completion Button) */}
              <button
                onClick={() => updateKaza(item.key, -1)}
                disabled={item.count === 0}
                className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-800 dark:text-emerald-300 font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-xs transition-all active:scale-95"
                title="Kıldım (-1)"
              >
                -1
              </button>
              {/* +1 */}
              <button
                onClick={() => updateKaza(item.key, 1)}
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="+1 Ekle"
              >
                +1
              </button>
              {/* +5 */}
              <button
                onClick={() => updateKaza(item.key, 5)}
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer transition-colors"
                title="+5 Ekle"
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guidance Note */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Kaza namazı, vakti içinde kılınamayan namazların sonradan kılınmasıdır. Vitir namazı da Hanefi mezhebine göre vacip olduğundan kazası gereklidir. Her vaktin ardından 1 kaza namazı kılarak düzenli telafi edebilirsiniz.
        </p>
      </div>
    </div>
  );
};
