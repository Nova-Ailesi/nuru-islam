import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Flame,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Trophy
} from 'lucide-react';
import { UserStats, PrayerKey } from '../types';
import { audioService } from '../services/audioService';

interface StatsViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, onUpdateStats }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = stats.dailyCheckIn[todayStr] || {
    sabah: false,
    ogle: false,
    ikindi: false,
    aksam: false,
    yatsi: false
  };

  const handleTogglePrayerCheck = (key: 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi') => {
    audioService.playTasbihClick();
    const updatedToday = {
      ...todayCheckIn,
      [key]: !todayCheckIn[key]
    };

    const newDailyCheckIn = {
      ...stats.dailyCheckIn,
      [todayStr]: updatedToday
    };

    // Check if all 5 completed
    const allDone = Object.values(updatedToday).every(Boolean);
    if (allDone && !Object.values(todayCheckIn).every(Boolean)) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      audioService.playAdhanChime();
    }

    onUpdateStats({
      ...stats,
      dailyCheckIn: newDailyCheckIn
    });
  };

  const completedTodayCount = Object.values(todayCheckIn).filter(Boolean).length;
  const todayPercent = Math.round((completedTodayCount / 5) * 100);

  const prayerItems: { key: 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi'; label: string; icon: React.ReactNode }[] = [
    { key: 'sabah', label: "Sabah Namazı", icon: <Sunrise className="w-4 h-4 text-indigo-400" /> },
    { key: 'ogle', label: "Öğle Namazı", icon: <Sun className="w-4 h-4 text-amber-400" /> },
    { key: 'ikindi', label: "İkindi Namazı", icon: <Sun className="w-4 h-4 text-orange-400" /> },
    { key: 'aksam', label: "Akşam Namazı", icon: <Sunset className="w-4 h-4 text-rose-400" /> },
    { key: 'yatsi', label: "Yatsı Namazı", icon: <Moon className="w-4 h-4 text-indigo-500" /> }
  ];

  const badges = [
    {
      id: "streak_3",
      title: "3 Günlük Sebat",
      desc: "3 gün üst üste uygulamada ibadet kaydı",
      achieved: stats.streakDays >= 3,
      icon: <Flame className="w-5 h-5 text-orange-500" />
    },
    {
      id: "five_five",
      title: "5 Vakit Tamam",
      desc: "Günün 5 vakit namazını eda etme",
      achieved: completedTodayCount === 5,
      icon: <Trophy className="w-5 h-5 text-amber-500" />
    },
    {
      id: "dhikr_100",
      title: "Zikir Ehli",
      desc: "Toplam 100 ve üzeri zikir çekildi",
      achieved: stats.totalDhikrCount >= 100,
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />
    },
    {
      id: "surah_reader",
      title: "Kur'an Dostu",
      desc: "En az 3 farklı sureyi tilavet etme",
      achieved: stats.readSurahsCount >= 3,
      icon: <Award className="w-5 h-5 text-sky-500" />
    }
  ];

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-md flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-100 uppercase tracking-wider">
              İbadet Serisi
            </p>
            <p className="text-2xl font-black font-mono">
              {stats.streakDays} Gün
            </p>
          </div>
        </div>

        {/* Total Dhikr card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-md flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Çekilen Zikir
            </p>
            <p className="text-2xl font-black font-mono">
              {stats.totalDhikrCount}
            </p>
          </div>
        </div>
      </div>

      {/* Today's 5 Daily Prayers Check-in */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bugünkü 5 Vakit Namaz Takibi</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kıldığınız vakitleri işaretleyerek serinizi koruyun
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {completedTodayCount} / 5 (%{todayPercent})
          </span>
        </div>

        <div className="space-y-2">
          {prayerItems.map((item) => {
            const isDone = todayCheckIn[item.key];
            return (
              <button
                key={item.key}
                onClick={() => handleTogglePrayerCheck(item.key)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600/60 text-emerald-950 dark:text-emerald-100'
                    : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-xs border border-stone-100 dark:border-stone-700">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold">{item.label}</span>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-stone-300 dark:border-stone-600'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lifetime Cumulative Stats */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Toplam İbadet İstatistikleri
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <p className="text-[10px] text-stone-500 uppercase">Kılınan Kaza</p>
            <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-1">
              {stats.completedKazalar}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <p className="text-[10px] text-stone-500 uppercase">Toplam Zikir</p>
            <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-1">
              {stats.totalDhikrCount}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <p className="text-[10px] text-stone-500 uppercase">Okunan Sure</p>
            <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-1">
              {stats.readSurahsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Manevi Başarı Rozetleri
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 transition-all ${
                b.achieved
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 shadow-xs'
                  : 'bg-stone-50/50 dark:bg-stone-800/20 border-stone-200/50 dark:border-stone-800 opacity-60'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-xs shrink-0">
                {b.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-white">
                  {b.title}
                </p>
                <p className="text-[10px] text-stone-500 leading-snug mt-0.5">
                  {b.desc}
                </p>
                {b.achieved ? (
                  <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-1 inline-block">
                    ✓ Kazanıldı
                  </span>
                ) : (
                  <span className="text-[9px] text-stone-400 mt-1 inline-block">
                    Devam ediyor
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
