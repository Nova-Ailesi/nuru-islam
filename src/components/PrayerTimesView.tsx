import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Compass,
  Volume2,
  Share2,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  AlertTriangle,
  Clock,
  Calendar,
  Sliders,
  Music,
  HelpCircle,
  MapPin,
  Flame,
  Utensils,
  BellRing
} from 'lucide-react';
import { PrayerTimesData, Language, PrayerKey } from '../types';
import {
  CityLocation,
  calculateQiblaAngle,
  calculateDistanceToKaaba,
  calculateKerahetTimes,
  calculateSpecialTimes,
  generateImsakiyeSchedule,
  ADHAN_MAKAMS,
  POPULAR_CITIES,
  ImsakiyeDay
} from '../services/prayerTimeCalculator';
import { TRANSLATIONS } from '../data/translations';
import { audioService } from '../services/audioService';
import {
  prayerNotificationService,
  PrayerNotificationConfig
} from '../services/prayerNotificationService';
import { AdBannerSlot } from './AdBannerSlot';
import { DAILY_WISDOM_LIST } from '../data/quotesAndHadiths';
import { NextPrayerCountdownWidget } from './NextPrayerCountdownWidget';
import { DailyDuaCard } from './DailyDuaCard';
import { PrayerProgressWidget } from './PrayerProgressWidget';
import { PrayerNotificationModal } from './PrayerNotificationModal';
import { QuickAccessGridMenu } from './QuickAccessGridMenu';
import { IslamicCalendarWidget } from './IslamicCalendarWidget';
import { MainTabType } from './BottomNav';

interface PrayerTimesViewProps {
  data: PrayerTimesData;
  city: CityLocation;
  lang: Language;
  onStartPrayer: (prayerKey: PrayerKey) => void;
  onOpenQibla: () => void;
  onNavigateTab?: (tab: MainTabType) => void;
  onSelectCity?: (city: CityLocation) => void;
  onOpenCityModal?: () => void;
  onOpenDuaBook?: () => void;
  onOpenNotifications?: () => void;
  totalDhikrCount?: number;
  completedKazalar?: number;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({
  data,
  city,
  lang,
  onStartPrayer,
  onOpenQibla,
  onNavigateTab,
  onSelectCity,
  onOpenCityModal,
  onOpenDuaBook,
  onOpenNotifications,
  totalDhikrCount,
  completedKazalar
}) => {
  const t = TRANSLATIONS[lang];

  // Active sub-tab inside Vakitler
  const [activeSubSection, setActiveSubSection] = useState<'gunluk' | 'imsakiye' | 'kerahet' | 'makamlar' | 'ozel'>('gunluk');
  const [imsakiyeRange, setImsakiyeRange] = useState<7 | 30>(7);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  // Global bildirim modalı App.tsx'te tek kaynaktan açılır; lokal state yalnızca fallback'tir
  const openNotifications = () => {
    if (onOpenNotifications) onOpenNotifications();
    else setShowNotificationModal(true);
  };
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [activeMakamPlaying, setActiveMakamPlaying] = useState<string | null>(null);

  // Time-shift (for viewing yesterday, today, tomorrow)
  const [dateOffset, setDateOffset] = useState<number>(0);

  // Prayer Notification Service configuration
  const [serviceConfig, setServiceConfig] = useState<PrayerNotificationConfig>(() =>
    prayerNotificationService.getConfig()
  );

  useEffect(() => {
    const unsub = prayerNotificationService.subscribe((cfg) => {
      setServiceConfig(cfg);
    });
    return unsub;
  }, []);

  const [currentTimeStr, setCurrentTimeStr] = useState(
    new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [gunesNotice, setGunesNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(
        new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Kerahet Times based on today's solar times
  const kerahetState = calculateKerahetTimes({
    gunes: data.times.gunes,
    ogle: data.times.ogle,
    aksam: data.times.aksam
  });

  // Calculate Special Worship Times (İşrak, Evvâbîn, Teheccüd, Kıble Saati, Sahur/İftar)
  const specialTimes = calculateSpecialTimes({
    imsak: data.times.imsak,
    gunes: data.times.gunes,
    ogle: data.times.ogle,
    aksam: data.times.aksam,
    yatsi: data.times.yatsi
  });

  // Qibla angle calculation for current city
  const qiblaAngle = Math.round(calculateQiblaAngle(city.latitude, city.longitude));
  const kaabaDistance = calculateDistanceToKaaba(city.latitude, city.longitude);

  // Daily wisdom selection based on day of month
  const dayIndex = new Date().getDate() % DAILY_WISDOM_LIST.length;
  const todayWisdom = DAILY_WISDOM_LIST[dayIndex];

  // Generate Imsakiye Table
  const imsakiyeList: ImsakiyeDay[] = generateImsakiyeSchedule(city, new Date(), imsakiyeRange);

  const nextScheduledAlert = prayerNotificationService.getNextScheduledAlert(data);

  const handleToggleGlobalNotification = async () => {
    if (!serviceConfig.enabled) {
      await prayerNotificationService.requestPermission();
      prayerNotificationService.updateConfig({ enabled: true });
    } else {
      prayerNotificationService.updateConfig({ enabled: false });
    }
  };

  const handlePlayMakam = (makamName: string, baseFreq: number) => {
    if (activeMakamPlaying === makamName) {
      setActiveMakamPlaying(null);
    } else {
      setActiveMakamPlaying(makamName);
      audioService.playMakamMelody(baseFreq);
      setTimeout(() => setActiveMakamPlaying(null), 3000);
    }
  };

  const handleCopyWisdom = () => {
    const textToCopy = `Günün Âyeti:\n${todayWisdom.ayah.translation} (${todayWisdom.ayah.source})\n\nGünün Hadisi:\n${todayWisdom.hadith.text} (${todayWisdom.hadith.source})\n\nHikmetli Söz:\n"${todayWisdom.quote.text}" - ${todayWisdom.quote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const prayerIcons: Record<PrayerKey, React.ReactNode> = {
    imsak: <Moon className="w-5 h-5 text-indigo-400" />,
    gunes: <Sunrise className="w-5 h-5 text-amber-500" />,
    ogle: <Sun className="w-5 h-5 text-amber-400" />,
    ikindi: <Sun className="w-5 h-5 text-orange-400" />,
    aksam: <Sunset className="w-5 h-5 text-rose-400" />,
    yatsi: <Moon className="w-5 h-5 text-indigo-500" />
  };

  const prayerItems: { key: PrayerKey; name: string; time: string }[] = [
    { key: 'imsak', name: t.prayerTimes.imsak, time: data.times.imsak },
    { key: 'gunes', name: t.prayerTimes.gunes, time: data.times.gunes },
    { key: 'ogle', name: t.prayerTimes.ogle, time: data.times.ogle },
    { key: 'ikindi', name: t.prayerTimes.ikindi, time: data.times.ikindi },
    { key: 'aksam', name: t.prayerTimes.aksam, time: data.times.aksam },
    { key: 'yatsi', name: t.prayerTimes.yatsi, time: data.times.yatsi }
  ];

  const quickCities = POPULAR_CITIES.slice(0, 6);

  return (
    <div className="space-y-4 pb-20 w-full max-w-full overflow-hidden">
      {/* Quick City Switcher Pills */}
      {onSelectCity && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full max-w-full">
          <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Hızlı Şehir:
          </span>
          {quickCities.map((c) => {
            const isSel = c.name === city.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelectCity(c)}
                className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
                  isSel
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {c.name}
              </button>
            );
          })}
          {onOpenCityModal && (
            <button
              onClick={onOpenCityModal}
              className="px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-100 flex items-center gap-1 shrink-0"
            >
              <span>+ 81 İl & İlçe</span>
            </button>
          )}
        </div>
      )}

      {/* Stylish & Dynamic Next Prayer Countdown Widget */}
      <NextPrayerCountdownWidget
        data={data}
        cityName={city.name}
        onStartPrayer={onStartPrayer}
        onOpenNotifications={openNotifications}
        isNotificationActive={serviceConfig.enabled}
        onOpenQibla={onOpenQibla}
        lang={lang}
      />

      {/* Mini Namaz İlerleme Widget'ı (Vaktin Namazı & Canlı Kıraat/Rekât Senkronizasyonu) */}
      <PrayerProgressWidget
        data={data}
        onOpenNamazGuide={onStartPrayer}
      />

      {/* İslami Hicrî Takvim & Dini Günler Widget'ı */}
      <IslamicCalendarWidget
        lang={lang}
        onOpenDiniGunler={() => {
          if (onNavigateTab) {
            onNavigateTab('diniGunler');
          }
        }}
      />

      {/* AdMob Banner Reklam Alanı (Placeholder) */}
      <AdBannerSlot slotLocation="home_header_admob_banner" />

      {/* Sık Kullanılan Özellikler: Modern ve Özelleştirilebilir Hızlı Erişim Menüsü */}
      <QuickAccessGridMenu
        onNavigateTab={(tab) => {
          if (onNavigateTab) {
            onNavigateTab(tab);
          } else if (tab === 'qibla') {
            onOpenQibla();
          } else if (tab === 'namazGuide') {
            onStartPrayer(data.currentPrayer.key);
          }
        }}
        qiblaAngle={qiblaAngle}
        totalDhikrCount={totalDhikrCount}
        completedKazalar={completedKazalar}
      />

      {/* Namaz Vakti Bildirim Servisi Durum & Hızlı Yapılandırma Banner'ı */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <BellRing className={`w-5 h-5 ${serviceConfig.enabled ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                Namaz Vakti Bildirim Servisi
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  serviceConfig.enabled
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {serviceConfig.enabled ? `${serviceConfig.advanceMinutes} Dk Kala Aktif` : 'Kapalı'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              {nextScheduledAlert
                ? `Sıradaki Uyan: ${nextScheduledAlert.description} (${nextScheduledAlert.minutesUntilAlert} dk kaldı)`
                : `Vakit girmeden ${serviceConfig.advanceMinutes} dakika önce özel hazırlık bildirimi gönderir.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => prayerNotificationService.fireTestAlert()}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-300/40 shadow-2xs transition-colors cursor-pointer"
            title="Namaz vakti bildirim çubuğunu önizleyin"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Önizle</span>
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('namazReminder')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Namaz Hatırlatıcı</span>
            </button>
          )}

          <button
            onClick={openNotifications}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Süreyi Ayarla ({serviceConfig.advanceMinutes} dk)</span>
          </button>

          <button
            onClick={handleToggleGlobalNotification}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer ${
              serviceConfig.enabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            {serviceConfig.enabled ? 'Açık' : 'Bildirimi Aç'}
          </button>
        </div>
      </div>

      {/* 6 Daily Prayer Times Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {prayerItems.map((item) => {
          const isCurrent = data.currentPrayer.key === item.key;
          const isNext = data.nextPrayer.key === item.key;

          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (item.key !== 'gunes') {
                  onStartPrayer(item.key);
                } else {
                  setGunesNotice(
                    "Güneş doğuş anı kerahet vaktidir; bu esnada farz veya nafile namaz kılınmaz. Güneş doğduktan yaklaşık 45 dakika sonra Kuşluk (Duhâ) namazı kılınabilir."
                  );
                  setTimeout(() => setGunesNotice(null), 6000);
                }
              }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                isNext
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : isCurrent
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600/50'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:border-emerald-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 mb-1">
                {prayerIcons[item.key]}
              </div>
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                {item.name}
              </p>
              <p className="text-base font-bold text-stone-900 dark:text-white font-mono mt-0.5">
                {item.time}
              </p>
              {isNext && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  Sıradaki
                </span>
              )}
              {isCurrent && !isNext && (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                  Şu an
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Informative Güneş Kerahet Notice Banner */}
      {gunesNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="leading-snug">{gunesNotice}</p>
          </div>
          <button
            onClick={() => setGunesNotice(null)}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 font-bold text-xs shrink-0 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vakitler Section Navigation Tabs */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubSection('gunluk')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'gunluk'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Günlük Vakitler & Kerahet
        </button>
        <button
          onClick={() => setActiveSubSection('imsakiye')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'imsakiye'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          İmsakiye & Takvim
        </button>
        <button
          onClick={() => setActiveSubSection('ozel')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'ozel'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Nafile & Özel Saatler
        </button>
        <button
          onClick={() => setActiveSubSection('makamlar')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubSection === 'makamlar'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Ezan Makamları
        </button>
      </div>

      {/* 1. GÜNLÜK VAKİTLER & KERAHET VAKTİ RADARI */}
      {activeSubSection === 'gunluk' && (
        <div className="space-y-3.5 animate-in fade-in">
          {/* KERAHET VAKTİ UYARI / BİLGİ KARTI */}
          <div
            className={`p-4 rounded-3xl border transition-all ${
              kerahetState.inKerahet
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/60 ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    kerahetState.inKerahet
                      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {kerahetState.inKerahet ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-900 dark:text-white">
                      {kerahetState.inKerahet ? kerahetState.title : "Kerahet Vakti Durumu: Mübah Vakit"}
                    </h3>
                    {kerahetState.inKerahet && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono">
                        {kerahetState.remainingMinutes} dk kaldı
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {kerahetState.inKerahet ? kerahetState.description : kerahetState.description}
                  </p>
                </div>
              </div>

              {kerahetState.inKerahet && (
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300 shrink-0">
                  {kerahetState.formattedRange}
                </span>
              )}
            </div>

            {/* Fiqh detail of 3 kerahet times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px]">
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/40">
                <p className="font-bold text-stone-700 dark:text-stone-300">1. Sabah Keraheti</p>
                <p className="text-stone-500">{data.times.gunes} - {specialTimes.israk}</p>
                <p className="text-[10px] text-stone-400">Güneş doğuşu + 45 dk</p>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/40">
                <p className="font-bold text-stone-700 dark:text-stone-300">2. Zeval Keraheti</p>
                <p className="text-stone-500">{specialTimes.duhaSonu} - {data.times.ogle}</p>
                <p className="text-[10px] text-stone-400">Öğleden önceki 45 dk</p>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/40">
                <p className="font-bold text-stone-700 dark:text-stone-300">3. Akşam Keraheti</p>
                <p className="text-stone-500">Akşama 45 dk kala</p>
                <p className="text-[10px] text-stone-400">Yalnız o günün ikindi farzı hariç</p>
              </div>
            </div>
          </div>

          {/* Daily Dua & Quran Verse Card with Social Sharing */}
          <DailyDuaCard onOpenDuaBook={onOpenDuaBook} />

          {/* Quick Qibla Banner Card */}
          <div
            onClick={onOpenQibla}
            className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all shadow-xs cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-300/40 dark:border-amber-700/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{t.prayerTimes.qiblaCompass}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                    {qiblaAngle}°
                  </span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Kâbe'ye mesafe: {kaabaDistance.toLocaleString()} km · Pusulayı Aç
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Daily Wisdom (Ayet, Hadis, Dini Söz) */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">
                  {t.prayerTimes.todayWisdom}
                </h3>
              </div>
              <button
                onClick={handleCopyWisdom}
                className="p-1.5 text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Kopyala"
              >
                {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* 1. Daily Ayah */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Günün Âyeti</span>
                <span className="text-stone-500">{todayWisdom.ayah.source}</span>
              </div>
              <p className="font-arabic text-xl text-right text-stone-900 dark:text-stone-100 leading-loose">
                {todayWisdom.ayah.arabic}
              </p>
              <p className="text-xs italic text-stone-600 dark:text-stone-300">
                "{todayWisdom.ayah.translation}"
              </p>
            </div>

            {/* 2. Daily Hadith */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/60 space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span>Günün Hadîs-i Şerîfi</span>
                <span className="text-stone-500">{todayWisdom.hadith.source}</span>
              </div>
              <p className="text-xs text-stone-800 dark:text-stone-200">
                "{todayWisdom.hadith.text}"
              </p>
              <p className="text-[11px] text-stone-500">Râvi: {todayWisdom.hadith.narrator}</p>
            </div>

            {/* 3. Daily Hikmetli Söz */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/60 space-y-1">
              <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold block">
                Günün Hikmetli Sözü
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                "{todayWisdom.quote.text}"
              </p>
              <p className="text-[11px] text-stone-500 text-right">— {todayWisdom.quote.author}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. İMSAKİYE & HAFTALIK / AYLIK VAKİT TABLOSU */}
      {activeSubSection === 'imsakiye' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{city.name} İmsakiye Takvimi</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {imsakiyeRange} Günlük Vakit Tablosu
              </p>
            </div>
            {/* Range Selector */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
              <button
                onClick={() => setImsakiyeRange(7)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  imsakiyeRange === 7
                    ? 'bg-white dark:bg-stone-700 text-emerald-600 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                7 Günlük
              </button>
              <button
                onClick={() => setImsakiyeRange(30)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  imsakiyeRange === 30
                    ? 'bg-white dark:bg-stone-700 text-emerald-600 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                30 Günlük
              </button>
            </div>
          </div>

          {/* Imsakiye Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 dark:bg-stone-800/80 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200/80 dark:border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Gün / Tarih</th>
                  <th className="py-2.5 px-2 text-center">İmsak</th>
                  <th className="py-2.5 px-2 text-center">Güneş</th>
                  <th className="py-2.5 px-2 text-center">Öğle</th>
                  <th className="py-2.5 px-2 text-center">İkindi</th>
                  <th className="py-2.5 px-2 text-center">Akşam (İftar)</th>
                  <th className="py-2.5 px-2 text-center">Yatsı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-mono">
                {imsakiyeList.map((day, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      day.isToday
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-bold text-emerald-900 dark:text-emerald-200'
                        : 'hover:bg-stone-50/50 dark:hover:bg-stone-800/30 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                      <p className="font-semibold text-stone-900 dark:text-white">
                        {day.gregorianDate}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {day.dayName}
                        {day.isToday && <span className="ml-1 text-emerald-600 font-bold">(Bugün)</span>}
                      </p>
                    </td>
                    <td className="py-2.5 px-2 text-center">{day.times.imsak}</td>
                    <td className="py-2.5 px-2 text-center text-stone-400">{day.times.gunes}</td>
                    <td className="py-2.5 px-2 text-center">{day.times.ogle}</td>
                    <td className="py-2.5 px-2 text-center">{day.times.ikindi}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-rose-600 dark:text-rose-400">
                      {day.times.aksam}
                    </td>
                    <td className="py-2.5 px-2 text-center">{day.times.yatsi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. NAFİLE & ÖZEL İBADET SAATLERİ */}
      {activeSubSection === 'ozel' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Nafile İbadetler ve Özel Zaman Dilimleri</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Kuşluk, Evvâbîn, Teheccüd, Kıble Saati ve Oruç Vakitleri
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* İşrak / Kuşluk Vakti */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  İşrâk / Duhâ (Kuşluk) Vakti
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                  {specialTimes.israk} - {specialTimes.duhaSonu}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Güneş doğduktan 45 dakika sonra başlar. Kuşluk namazı vücudun 360 ekleminin sadakası hükmündedir.
              </p>
            </div>

            {/* Evvâbîn Vakti */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Evvâbîn Namazı Vakti
                </span>
                <span className="text-xs font-mono font-bold text-rose-900 dark:text-rose-200">
                  {specialTimes.evvabin}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Akşam namazının ardından kılınan 2 ila 6 rekâtlık nafile namazdır. Tevbeye sığınanların namazıdır.
              </p>
            </div>

            {/* Teheccüd (Gecenin Son Üçte Biri) */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  Teheccüd (Gece İbadeti)
                </span>
                <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200">
                  {specialTimes.teheccudStart} - {specialTimes.sahurBitis}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Gecenin son üçte birinde duaların ve tövbelerin geri çevrilmediği en faziletli teheccüd vaktidir.
              </p>
            </div>

            {/* Kıble Saati */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Güneş Kıble Saati
                </span>
                <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-200">
                  {specialTimes.qiblaHour}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Bu saatte güneşe doğru dönüldüğünde pusulaya ihtiyaç kalmaksızın doğrudan Kâbe yönüne bakılmış olunur.
              </p>
            </div>

            {/* Sahur & İftar */}
            <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 sm:col-span-2 flex items-center justify-around text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 flex items-center justify-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-400" />
                  Sahur Bitişi (İmsak)
                </p>
                <p className="text-xl font-bold font-mono text-stone-900 dark:text-white mt-0.5">
                  {specialTimes.sahurBitis}
                </p>
              </div>
              <div className="w-px h-8 bg-stone-300 dark:bg-stone-700" />
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-400 flex items-center justify-center gap-1">
                  <Utensils className="w-3 h-3 text-rose-500" />
                  İftar Vakti (Akşam)
                </p>
                <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                  {specialTimes.iftar}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EZAN MAKAMLARI & EZAN DUASI REHBERİ */}
      {activeSubSection === 'makamlar' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-600" />
              <span>Geleneksel Türk Ezan Makamları</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Osmanlı'dan günümüze her vakitte ruh halini dengeleyen özel Türk Sanat Musikisi makamları
            </p>
          </div>

          <div className="space-y-2.5">
            {ADHAN_MAKAMS.map((m) => {
              const isPlaying = activeMakamPlaying === m.makam;
              return (
                <div
                  key={m.makam}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        {m.prayerName}:
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {m.makam}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                      {m.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayMakam(m.makam, m.audioFrequencyBase)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isPlaying
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Çalıyor' : 'Makamı Dinle'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Ezan Duası Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
              Ezan Dinledikten Sonra Okunacak Ezan Duası
            </span>
            <p className="font-arabic text-base text-right text-emerald-950 dark:text-emerald-100 leading-loose">
              اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
            </p>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 italic pt-1 border-t border-emerald-200/40">
              "Ey bu eksiksiz davetin ve kılınacak namazın Rabbi olan Allah'ım! Muhammed'e (s.a.v.) vesileyi ve fazileti ver. O'nu vaat ettiğin Makam-ı Mahmud'a ulaştır."
            </p>
          </div>
        </div>
      )}

      {/* Modal: Namaz Vakti Bildirim Servisi Yapılandırma & Geçmiş */}
      <PrayerNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        prayerTimesData={data}
        onOpenPrayerGuide={onStartPrayer}
      />
    </div>
  );
};
