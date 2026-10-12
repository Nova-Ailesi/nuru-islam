import React, { useState, useEffect } from 'react';
import {
  Compass,
  RotateCcw,
  History,
  BookOpen,
  Droplets,
  ScrollText,
  Calendar,
  HeartHandshake,
  ShieldQuestion,
  HelpCircle,
  Sliders,
  Check,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  ArrowUpRight,
  Bell
} from 'lucide-react';
import { MainTabType } from './BottomNav';
import { audioService } from '../services/audioService';

export interface QuickMenuItem {
  id: string;
  tabKey: MainTabType;
  title: string;
  subtitle: string;
  iconName: string;
  bgGradient: string;
  iconColor: string;
  borderHover: string;
  badge?: string;
  defaultVisible: boolean;
}

export const ALL_QUICK_MENU_ITEMS: QuickMenuItem[] = [
  {
    id: 'namazReminder',
    tabKey: 'namazReminder',
    title: 'Namaz Hatırlatıcı',
    subtitle: 'Özel Vakit Alarmı',
    iconName: 'Bell',
    bgGradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    defaultVisible: true
  },
  {
    id: 'qibla',
    tabKey: 'qibla',
    title: 'Kıble Pusulası',
    subtitle: 'Kâbe İstikameti',
    iconName: 'Compass',
    bgGradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
    defaultVisible: true
  },
  {
    id: 'zikir',
    tabKey: 'zikir',
    title: 'Zikirmatik',
    subtitle: 'Akıllı Tesbihat',
    iconName: 'RotateCcw',
    bgGradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    defaultVisible: true
  },
  {
    id: 'kaza',
    tabKey: 'kaza',
    title: 'Kaza Takibi',
    subtitle: 'Namaz & Oruç',
    iconName: 'History',
    bgGradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderHover: 'hover:border-rose-400 dark:hover:border-rose-600',
    defaultVisible: true
  },
  {
    id: 'namazGuide',
    tabKey: 'namazGuide',
    title: 'Namaz Rehberi',
    subtitle: 'Sesli Takip & Görsel',
    iconName: 'BookOpen',
    bgGradient: 'from-teal-500/15 via-teal-500/5 to-transparent',
    iconColor: 'text-teal-600 dark:text-teal-400',
    borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
    defaultVisible: true
  },
  {
    id: 'abdest',
    tabKey: 'abdest',
    title: 'Abdest Rehberi',
    subtitle: 'Adım Adım & Dualar',
    iconName: 'Droplets',
    bgGradient: 'from-sky-500/15 via-sky-500/5 to-transparent',
    iconColor: 'text-sky-600 dark:text-sky-400',
    borderHover: 'hover:border-sky-400 dark:hover:border-sky-600',
    defaultVisible: true
  },
  {
    id: 'kuranDua',
    tabKey: 'kuranDua',
    title: 'Sesli Sure & Dua',
    subtitle: 'Uzman Hafız Tilaveti',
    iconName: 'ScrollText',
    bgGradient: 'from-indigo-500/15 via-indigo-500/5 to-transparent',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
    defaultVisible: true
  },
  {
    id: 'hatim',
    tabKey: 'hatim',
    title: 'Hatm-i Şerif',
    subtitle: '30 Cüz İlerleme & Takip',
    iconName: 'BookOpen',
    bgGradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-600',
    defaultVisible: true
  },
  {
    id: 'diniGunler',
    tabKey: 'diniGunler',
    title: 'Dini Günler',
    subtitle: 'Kandiller & Takvim',
    iconName: 'Calendar',
    bgGradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
    iconColor: 'text-violet-600 dark:text-violet-400',
    borderHover: 'hover:border-violet-400 dark:hover:border-violet-600',
    defaultVisible: false
  },
  {
    id: 'myDuas',
    tabKey: 'myDuas',
    title: 'Dua Kartları & Defter',
    subtitle: 'Hat Sanatı & Paylaşım',
    iconName: 'HeartHandshake',
    bgGradient: 'from-amber-500/15 via-rose-500/5 to-transparent',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-400 dark:hover:border-amber-600',
    badge: 'Kart Yap',
    defaultVisible: true
  },
  {
    id: 'diyanet',
    tabKey: 'diyanet',
    title: 'Diyanet Rehberi',
    subtitle: 'Resmi Portallar & Alo 190',
    iconName: 'ShieldQuestion',
    bgGradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderHover: 'hover:border-blue-400 dark:hover:border-blue-600',
    defaultVisible: false
  },
  {
    id: 'soruCevap',
    tabKey: 'soruCevap',
    title: 'Soru & Cevap',
    subtitle: 'Diyanet Fetvaları',
    iconName: 'HelpCircle',
    bgGradient: 'from-teal-500/15 via-teal-500/5 to-transparent',
    iconColor: 'text-teal-600 dark:text-teal-400',
    borderHover: 'hover:border-teal-400 dark:hover:border-teal-600',
    badge: 'Fetva',
    defaultVisible: true
  }
];

const STORAGE_KEY = 'nur_quick_access_menu_config_v1';

interface QuickAccessGridMenuProps {
  onNavigateTab: (tab: MainTabType) => void;
  qiblaAngle?: number;
  totalDhikrCount?: number;
  completedKazalar?: number;
}

export const QuickAccessGridMenu: React.FC<QuickAccessGridMenuProps> = ({
  onNavigateTab,
  qiblaAngle,
  totalDhikrCount,
  completedKazalar
}) => {
  const [items, setItems] = useState<QuickMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: { id: string; visible: boolean }[] = JSON.parse(saved);
        // Map stored order and visibility to current item definitions
        const result: QuickMenuItem[] = [];
        parsed.forEach((p) => {
          const found = ALL_QUICK_MENU_ITEMS.find((it) => it.id === p.id);
          if (found) {
            result.push({ ...found, defaultVisible: p.visible });
          }
        });
        // Include any new items not in stored config
        ALL_QUICK_MENU_ITEMS.forEach((it) => {
          if (!result.some((r) => r.id === it.id)) {
            result.push(it);
          }
        });
        return result;
      }
    } catch {
      // ignore
    }
    return ALL_QUICK_MENU_ITEMS;
  });

  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Save changes to localStorage
  const saveConfig = (newItems: QuickMenuItem[]) => {
    setItems(newItems);
    try {
      const serialized = newItems.map((it) => ({ id: it.id, visible: it.defaultVisible }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch {
      // ignore
    }
  };

  const handleToggleItem = (id: string) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, defaultVisible: !it.defaultVisible } : it
    );
    saveConfig(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...items];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    saveConfig(copy);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const copy = [...items];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    saveConfig(copy);
  };

  const handleResetDefaults = () => {
    saveConfig(ALL_QUICK_MENU_ITEMS);
  };

  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Bell':
        return <Bell className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'RotateCcw':
        return <RotateCcw className={className} />;
      case 'History':
        return <History className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'ScrollText':
        return <ScrollText className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'ShieldQuestion':
        return <ShieldQuestion className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Determine dynamic badge text
  const getDynamicBadge = (id: string): string | null => {
    if (id === 'qibla' && typeof qiblaAngle === 'number') {
      return `${qiblaAngle}°`;
    }
    if (id === 'zikir' && typeof totalDhikrCount === 'number' && totalDhikrCount > 0) {
      return `${totalDhikrCount}`;
    }
    if (id === 'kaza' && typeof completedKazalar === 'number' && completedKazalar > 0) {
      return `${completedKazalar} kılındı`;
    }
    if (id === 'hatim') {
      try {
        const saved = localStorage.getItem('nur_hatim_tracker_sessions_v1');
        if (saved) {
          const sessions = JSON.parse(saved);
          if (sessions[0]?.completedJuz?.length) {
            return `${sessions[0].completedJuz.length}/30 Cüz`;
          }
        }
      } catch {
        // Ignore
      }
      return '30 Cüz';
    }
    return null;
  };

  const visibleItems = items.filter((it) => it.defaultVisible);

  return (
    <div className="space-y-2.5">
      {/* Header bar: Title + Customize Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 tracking-wide uppercase">
            Hızlı Erişim Menüsü
          </h3>
          <span className="text-[10px] text-stone-400 font-medium">
            ({visibleItems.length} Menü)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomizeModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-850 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 transition-all cursor-pointer shadow-2xs"
          title="Menüyü Özelleştir & Sırala"
        >
          <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Özelleştir</span>
        </button>
      </div>

      {/* Grid: 3 columns on mobile, up to 6 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
        {visibleItems.map((item) => {
          const dynamicBadge = getDynamicBadge(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                audioService.playTasbihClick();
                onNavigateTab(item.tabKey);
              }}
              className={`group relative p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 ${item.borderHover} text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-97 cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xs min-h-[92px]`}
            >
              {/* Subtle Ambient Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              {/* Top Row: Icon Container + Dynamic Badge */}
              <div className="relative z-10 flex items-start justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform shadow-2xs`}
                >
                  {renderIcon(item.iconName, 'w-4.5 h-4.5 stroke-[2.2]')}
                </div>

                {dynamicBadge ? (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60 shadow-2xs">
                    {dynamicBadge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                )}
              </div>

              {/* Bottom: Title & Subtitle */}
              <div className="relative z-10 mt-2">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white leading-tight truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Customization Modal */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Hızlı Erişim Menüsünü Özelleştir
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Öğeleri açıp kapatın veya sırasını değiştirin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item List with checkboxes and reorder arrows */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                    item.defaultVisible
                      ? 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-750'
                      : 'bg-stone-100/50 dark:bg-stone-900/40 border-dashed border-stone-200 dark:border-stone-800 opacity-60'
                  }`}
                >
                  {/* Left: Checkbox + Icon + Title */}
                  <label
                    htmlFor={`toggle-${item.id}`}
                    className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <input
                      id={`toggle-${item.id}`}
                      type="checkbox"
                      checked={item.defaultVisible}
                      onChange={() => handleToggleItem(item.id)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                    />
                    <div
                      className={`w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center ${item.iconColor} shrink-0`}
                    >
                      {renderIcon(item.iconName, 'w-3.5 h-3.5')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </label>

                  {/* Right: Reorder Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 disabled:opacity-20 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 disabled:opacity-20 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Varsayılana Dön</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
              >
                Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
