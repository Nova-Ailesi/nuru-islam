import React from 'react';
import {
  Clock,
  BookOpen,
  Compass,
  Sparkles,
  Menu,
  CheckCircle2,
  Droplet,
  History,
  Users,
  Calendar,
  BookmarkCheck,
  ShieldCheck,
  HelpCircle,
  Bell
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

export type MainTabType =
  | 'prayerTimes'
  | 'namazGuide'
  | 'kuranDua'
  | 'zikir'
  | 'hatim'
  | 'abdest'
  | 'qibla'
  | 'kaza'
  | 'stats'
  | 'prophets'
  | 'diniGunler'
  | 'myDuas'
  | 'soruCevap'
  | 'diyanet'
  | 'namazReminder';

interface BottomNavProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [isMoreSheetOpen, setIsMoreSheetOpen] = React.useState(false);

  const primaryTabs: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'prayerTimes',
      label: t.tabs.prayerTimes,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'namazGuide',
      label: t.tabs.namazGuide,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="5" r="2.5" />
          <path d="M12 7.5V14M9 10L12 11L15 10M9 20L12 14L15 20" />
        </svg>
      )
    },
    {
      id: 'kuranDua',
      label: t.tabs.kuranDua,
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'zikir',
      label: t.tabs.zikir,
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const moreMenuItems: { id: MainTabType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'namazReminder',
      label: 'Namaz Hatırlatıcı',
      icon: <Bell className="w-5 h-5 text-emerald-500" />,
      desc: "Özel vakit bildirimleri & namaz rehberi"
    },
    {
      id: 'hatim',
      label: t.tabs.hatim,
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      desc: "30 Cüz Kur'an hatmi ve ilerleme takibi"
    },
    {
      id: 'qibla',
      label: t.tabs.qibla,
      icon: <Compass className="w-5 h-5 text-amber-500" />,
      desc: "Hassas Kâbe pusulası ve mesafe"
    },
    {
      id: 'abdest',
      label: t.tabs.abdest,
      icon: <Droplet className="w-5 h-5 text-sky-500" />,
      desc: "Namaz abdesti, gusül ve teyemmüm"
    },
    {
      id: 'kaza',
      label: t.tabs.kaza,
      icon: <History className="w-5 h-5 text-indigo-500" />,
      desc: "Kaza namazları ve oruç takip paneli"
    },
    {
      id: 'stats',
      label: t.tabs.stats,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      desc: "5 vakit kontrolü ve ibadet serisi"
    },
    {
      id: 'prophets',
      label: t.tabs.prophets,
      icon: <Users className="w-5 h-5 text-teal-500" />,
      desc: "Peygamberler ve sahabe hayatları"
    },
    {
      id: 'diniGunler',
      label: t.tabs.diniGunler,
      icon: <Calendar className="w-5 h-5 text-purple-500" />,
      desc: "Kadir gecesi ve kandil tarihleri"
    },
    {
      id: 'myDuas',
      label: t.tabs.myDuas,
      icon: <BookmarkCheck className="w-5 h-5 text-rose-500" />,
      desc: "Kişisel dua defterim ve amin listem"
    },
    {
      id: 'soruCevap',
      label: t.tabs.soruCevap,
      icon: <HelpCircle className="w-5 h-5 text-teal-600" />,
      desc: "Diyanet Din İşleri Yüksek Kurulu fetvaları ve arama"
    },
    {
      id: 'diyanet',
      label: t.tabs.diyanet,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      desc: "Diyanet İşleri resmi fetva ve portalları"
    }
  ];

  const isMoreActive = moreMenuItems.some((m) => m.id === activeTab);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 pb-safe transition-colors">
        <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  onSelectTab(tab.id);
                }}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </div>
                <span className="text-[11px] mt-1 leading-tight tracking-tight truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Menu Trigger */}
          <button
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer relative ${
              isMoreActive || isMoreSheetOpen
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {isMoreActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </div>
            <span className="text-[11px] mt-1 leading-tight tracking-tight">
              {t.tabs.more}
            </span>
          </button>
        </div>
      </nav>

      {/* More Options Drawer Sheet */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="flex-1"
            onClick={() => setIsMoreSheetOpen(false)}
          />
          <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 rounded-t-3xl max-w-lg mx-auto w-full p-5 shadow-2xl pb-safe animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Tüm İbadet ve Rehber Bölümleri
              </h3>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-semibold p-1 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {moreMenuItems.map((item) => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMoreSheetOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500/60 shadow-sm'
                        : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-xs border border-stone-100 dark:border-stone-700/60 shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
