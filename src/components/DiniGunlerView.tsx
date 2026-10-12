import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Bell,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
  Check
} from 'lucide-react';
import { DINI_GUNLER_DATA } from '../data/diniGunler';
import { DiniGunItem } from '../types';
import { audioService } from '../services/audioService';

export const DiniGunlerView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("kadir_gecesi");
  const [remindedList, setRemindedList] = useState<string[]>(() => {
    const saved = localStorage.getItem('dini_gunler_reminders');
    return saved ? JSON.parse(saved) : ["kadir_gecesi", "berat_kandili"];
  });

  const toggleReminder = async (item: DiniGunItem) => {
    const isSet = remindedList.includes(item.id);
    if (!isSet) {
      const granted = await audioService.requestNotificationPermission();
      if (granted) {
        const next = [...remindedList, item.id];
        setRemindedList(next);
        localStorage.setItem('dini_gunler_reminders', JSON.stringify(next));
        audioService.sendNotification(
          `${item.name} Hatırlatıcısı Aktif`,
          `${item.name} gecesi yaklaştığında ve o gün özel ibadet tavsiyeleri ile bildirim alacaksınız.`
        );
      }
    } else {
      const next = remindedList.filter((x) => x !== item.id);
      setRemindedList(next);
      localStorage.setItem('dini_gunler_reminders', JSON.stringify(next));
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-stone-900 border border-purple-800/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-purple-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-400" />
            Hicrî Takvim & Kandil Geceleri
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Mübarek Dini Günler & Kandiller
          </h2>
          <p className="text-xs text-purple-100/90 leading-relaxed max-w-md">
            Kadir Gecesi, Berat, Miraç, Regaip, Mevlid kandilleri ve bayram günleri için özel dualar ve hatırlatıcılar.
          </p>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {DINI_GUNLER_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          const isReminded = remindedList.includes(item.id);
          const isKadir = item.id === 'kadir_gecesi';

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-stone-900 border rounded-3xl overflow-hidden shadow-xs transition-all ${
                isKadir
                  ? 'border-amber-400 dark:border-amber-600/70 ring-1 ring-amber-400/20'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isKadir
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                        {item.name}
                      </h3>
                      {isKadir && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 uppercase tracking-wide">
                          Bin Aydan Hayırlı
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.hijriDate} ({item.gregorianDate})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReminder(item);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isReminded
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-600'
                    }`}
                    title={isReminded ? 'Hatırlatıcı Aktif' : 'Hatırlatıcı Kur'}
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4.5 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-3.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed animate-in fade-in duration-200">
                  <p>{item.description}</p>

                  {/* Recommended Worships */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5">
                    <span className="font-bold text-stone-900 dark:text-white block">
                      Bu Gece Yapılması Tavsiye Edilen İbadetler:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400">
                      {item.recommendedWorships.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Special Dua */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 space-y-1">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                      Özel Kandil Duası:
                    </span>
                    <p className="font-arabic text-base text-right text-emerald-950 dark:text-emerald-100 leading-loose">
                      {item.specialDua.split('\n')[0]}
                    </p>
                    {item.specialDua.split('\n')[1] && (
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 italic pt-1 border-t border-emerald-200/30">
                        {item.specialDua.split('\n')[1]}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
