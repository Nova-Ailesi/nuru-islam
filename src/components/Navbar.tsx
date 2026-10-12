import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Moon,
  Sun,
  Globe,
  Compass,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  LocateFixed,
  Loader2,
  MoreVertical,
  X,
  Bell,
  BellRing,
  ShieldCheck
} from 'lucide-react';
import { CityLocation } from '../services/prayerTimeCalculator';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { audioService } from '../services/audioService';
import { prayerNotificationService } from '../services/prayerNotificationService';

interface NavbarProps {
  currentCity: CityLocation;
  onSelectCity?: (city: CityLocation) => void;
  onUseGps: () => void;
  isLocatingGps?: boolean;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenQibla: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  onOpenCityModal: () => void;
  onGoHome?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onUseGps,
  isLocatingGps = false,
  lang,
  onSelectLang,
  isDark,
  onToggleTheme,
  onOpenQibla,
  isAudioMuted,
  onToggleMute,
  onOpenCityModal,
  onGoHome,
  onOpenNotifications
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isNotificationActive, setIsNotificationActive] = useState<boolean>(() =>
    prayerNotificationService.getConfig().enabled
  );

  useEffect(() => {
    const unsub = prayerNotificationService.subscribe((cfg) => {
      setIsNotificationActive(cfg.enabled);
    });
    return unsub;
  }, []);

  const t = TRANSLATIONS[lang];

  const handleMuteToggle = () => {
    const nextState = !isAudioMuted;
    audioService.setMuted(nextState);
    if (!nextState) {
      audioService.playTasbihClick();
    }
    onToggleMute();
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 pt-safe transition-colors shadow-2xs">
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 h-14 flex items-center justify-between gap-1.5 min-w-0">
          {/* Logo & Brand (Clickable to return Home) */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group select-none min-w-0 shrink"
            title="Anasayfa (Vakitler)"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 11.23 21.91 10.48 21.75 9.77C20.67 11.71 18.59 13 16.2 13C12.33 13 9.2 9.87 9.2 6C9.2 4.41 9.73 2.94 10.63 1.76C11.08 1.84 11.53 1.95 12 2Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-black tracking-tight text-stone-900 dark:text-white leading-none truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t.appName}
              </h1>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold tracking-wide mt-0.5 truncate">
                {currentCity.name}
              </p>
            </div>
          </div>

          {/* Action Toolbar (Strictly contained, no horizontal scroll) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* City & District Pill Button */}
            <button
              onClick={onOpenCityModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-all cursor-pointer"
              title="Şehir & İlçe Seç"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="max-w-[65px] sm:max-w-[100px] truncate text-[11px] sm:text-xs">
                {currentCity.name}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
            </button>

            {/* GPS Quick Finder */}
            <button
              onClick={onUseGps}
              disabled={isLocatingGps}
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                isLocatingGps
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  : 'text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="GPS ile Konumumu Bul"
            >
              {isLocatingGps ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              ) : (
                <LocateFixed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Notification Service Bell Button */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className={`relative p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer ${
                  isNotificationActive
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Namaz Vakti Bildirim Ayarları"
                aria-label="Namaz Bildirimleri"
              >
                {isNotificationActive ? (
                  <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {isNotificationActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
            )}

            {/* Desktop Only Buttons: Compass, Sound, Language */}
            <div className="hidden sm:flex items-center gap-1">
              {/* Compass */}
              <button
                onClick={onOpenQibla}
                className="p-2 text-stone-600 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                title={t.tabs.qibla}
              >
                <Compass className="w-4 h-4" />
              </button>

              {/* Audio Mute */}
              <button
                onClick={handleMuteToggle}
                className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                title={isAudioMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              >
                {isAudioMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>

              {/* Desktop Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="Dil Seçimi"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] uppercase font-bold text-stone-700 dark:text-stone-300">
                    {lang}
                  </span>
                </button>

                {isLangMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 py-1.5 z-50 text-xs animate-in fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {languages.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            onSelectLang(item.code);
                            setIsLangMenuOpen(false);
                            audioService.playTasbihClick();
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer ${
                            lang === item.code
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-stone-700 dark:text-stone-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{item.flag}</span>
                            <span>{item.label}</span>
                          </span>
                          {lang === item.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dark / Light Toggle (Always available) */}
            <button
              type="button"
              onClick={() => {
                onToggleTheme();
                audioService.playTasbihClick();
              }}
              className="p-1.5 sm:p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title={isDark ? t.settings.light : t.settings.dark}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Mobile "More" Menu Trigger (3-dots) for Sound, Qibla & Language */}
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen((prev) => !prev);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  isMobileMenuOpen
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 scale-105'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                aria-label="Diğer Ayarlar"
                title="Daha Fazla Ayar"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <MoreVertical className="w-4 h-4" />
                )}
              </button>

              {/* Mobile Quick Dropdown */}
              {isMobileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header title inside menu */}
                    <div className="flex items-center justify-between px-2.5 py-1 pb-1.5 border-b border-stone-100 dark:border-stone-800 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                      <span>Hızlı Ayarlar</span>
                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Audio Mute in Mobile Menu */}
                    <button
                      type="button"
                      onClick={() => {
                        handleMuteToggle();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {isAudioMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-500" />
                        )}
                        <span className="font-medium">Ses Efektleri</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAudioMuted
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}
                      >
                        {isAudioMuted ? 'Kapalı' : 'Açık'}
                      </span>
                    </button>

                    {/* Notification Settings in Mobile Menu */}
                    {onOpenNotifications && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenNotifications();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-medium">Namaz Bildirim Servisi</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isNotificationActive
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                          }`}
                        >
                          {isNotificationActive ? 'Aktif' : 'Kapalı'}
                        </span>
                      </button>
                    )}

                    {/* Qibla Compass in Mobile Menu */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenQibla();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">{t.tabs.qibla}</span>
                    </button>

                    {/* City Change Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenCityModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span className="font-medium">Şehir & İlçe</span>
                      </span>
                      <span className="text-[10px] text-stone-400 truncate max-w-[80px]">
                        {currentCity.name}
                      </span>
                    </button>

                    {/* Google Play Store Privacy Policy Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrivacyModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium text-xs">Gizlilik Politikası</span>
                    </button>

                    {/* Language Section */}
                    <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Dil Seçimi
                    </div>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      {languages.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            onSelectLang(item.code);
                            setIsMobileMenuOpen(false);
                            audioService.playTasbihClick();
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer text-xs ${
                            lang === item.code
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                              : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{item.flag}</span>
                            <span>{item.label}</span>
                          </span>
                          {lang === item.code && (
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Google Play Store Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
};
