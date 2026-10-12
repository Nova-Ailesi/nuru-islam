import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  CityLocation,
  POPULAR_CITIES,
  getPrayerTimesForLocation
} from './services/prayerTimeCalculator';
import { PrayerTimesData, Language, UserStats, PrayerKey } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav, MainTabType } from './components/BottomNav';
import { PrayerTimesView } from './components/PrayerTimesView';
import { AbdestGuideView } from './components/AbdestGuideView';
import { QiblaCompassView } from './components/QiblaCompassView';
import { ZikirmatikView } from './components/ZikirmatikView';
import { KazaTrackerView } from './components/KazaTrackerView';
import { PersonalDuaBookView } from './components/PersonalDuaBookView';
import { DiniGunlerView } from './components/DiniGunlerView';
import { StatsView } from './components/StatsView';
import { DiyanetGuideView } from './components/DiyanetGuideView';
// Ağır view'lar lazy-load (ilk açılış paketini küçültür)
const NamazGuideView = lazy(() => import('./components/NamazGuideView').then(m => ({ default: m.NamazGuideView })));
const SurahsAndDuasView = lazy(() => import('./components/SurahsAndDuasView').then(m => ({ default: m.SurahsAndDuasView })));
const ProphetsAndSahabaView = lazy(() => import('./components/ProphetsAndSahabaView').then(m => ({ default: m.ProphetsAndSahabaView })));
const IslamicQAView = lazy(() => import('./components/IslamicQAView').then(m => ({ default: m.IslamicQAView })));
const HatimTrackerView = lazy(() => import('./components/HatimTrackerView').then(m => ({ default: m.HatimTrackerView })));
import { CityDistrictModal } from './components/CityDistrictModal';
import { PrayerNotificationModal } from './components/PrayerNotificationModal';
import { PrayerReminderView } from './components/PrayerReminderView';
import { InAppNotificationToast } from './components/InAppNotificationToast';
import { HafizAudioPlayerBar } from './components/HafizAudioPlayerBar';
import { audioService } from './services/audioService';
import { prayerNotificationService } from './services/prayerNotificationService';
import { TURKISH_PROVINCES } from './data/turkishProvincesAndDistricts';

const DEFAULT_STATS: UserStats = {
  dailyCheckIn: {},
  totalDhikrCount: 132,
  completedKazalar: 14,
  readSurahsCount: 7,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('prayerTimes');
  const [currentCity, setCurrentCity] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('user_city_location');
    return saved ? JSON.parse(saved) : POPULAR_CITIES[0]; // Istanbul default
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('user_app_lang');
    return (saved as Language) || 'tr';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('user_theme_mode');
    if (saved) return saved === 'dark';
    return true; // Default dark for eye comfort and Islamic emerald aesthetic
  });

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [selectedPrayerToGuide, setSelectedPrayerToGuide] = useState<PrayerKey>('imsak');

  const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsToast, setGpsToast] = useState<string | null>(null);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('user_ibadet_stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  // Background prayer time notification service lifecycle
  useEffect(() => {
    prayerNotificationService.startService(
      () => prayerTimesData,
      () => currentCity
    );
    return () => {
      prayerNotificationService.stopService();
    };
  }, [prayerTimesData, currentCity]);

  // Handle background notification clicks from Service Worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICKED' && event.data.prayerKey) {
        handleStartPrayer(event.data.prayerKey);
      }
    };
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, []);

  // Theme effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('user_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('user_theme_mode', 'light');
    }
  }, [isDark]);

  // Language save
  useEffect(() => {
    localStorage.setItem('user_app_lang', lang);
  }, [lang]);

  // City save
  useEffect(() => {
    localStorage.setItem('user_city_location', JSON.stringify(currentCity));
  }, [currentCity]);

  // User Stats save
  useEffect(() => {
    localStorage.setItem('user_ibadet_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Fetch / Calculate Prayer Times for location
  useEffect(() => {
    let isMounted = true;
    getPrayerTimesForLocation(currentCity).then((data) => {
      if (isMounted) {
        setPrayerTimesData(data);
        setSelectedPrayerToGuide(data.currentPrayer.key);
      }
    });

    // Refresh every minute
    const interval = setInterval(() => {
      getPrayerTimesForLocation(currentCity).then((data) => {
        if (isMounted) setPrayerTimesData(data);
      });
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentCity]);

  // GPS Location handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsToast("Cihazınız konum servisini desteklemiyor.");
      setTimeout(() => setGpsToast(null), 3000);
      return;
    }

    setIsLocatingGps(true);
    setGpsToast("GPS konumu alınıyor...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGps(false);
        const { latitude, longitude } = pos.coords;

        // Find closest Turkish province
        let closest = TURKISH_PROVINCES[0];
        let minDist = Infinity;
        for (const p of TURKISH_PROVINCES) {
          const d = Math.hypot(p.latitude - latitude, p.longitude - longitude);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        }

        let locName = "Mevcut Konum";
        let countryName = "GPS";
        if (minDist < 1.3) {
          locName = `${closest.name} (GPS)`;
          countryName = "Türkiye";
        }

        const customLoc: CityLocation = {
          name: locName,
          country: countryName,
          latitude,
          longitude,
          timezone: 3
        };

        setCurrentCity(customLoc);
        audioService.playAdhanChime();
        setGpsToast(`Konum güncellendi: ${locName}`);
        setTimeout(() => setGpsToast(null), 3500);
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsToast("Konum izni alınamadı. Lütfen listeden şehir seçiniz.");
        setTimeout(() => setGpsToast(null), 3500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Launch Prayer Guide for a specific prayer
  const handleStartPrayer = (prayerKey: PrayerKey) => {
    setSelectedPrayerToGuide(prayerKey);
    setActiveTab('namazGuide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Increment dhikr in stats
  const handleDhikrCountUpdated = (delta: number) => {
    setUserStats((prev) => ({
      ...prev,
      totalDhikrCount: prev.totalDhikrCount + delta
    }));
  };

  // Increment completed kaza in stats
  const handleKazaCompleted = (amount: number) => {
    setUserStats((prev) => ({
      ...prev,
      completedKazalar: prev.completedKazalar + amount
    }));
  };

  // Increment surah read in stats
  const handleSurahRead = () => {
    setUserStats((prev) => ({
      ...prev,
      readSurahsCount: prev.readSurahsCount + 1
    }));
  };

  // Mark prayer completed in stats
  const handlePrayerCompleted = (prayerId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const todayCheck = userStats.dailyCheckIn[today] || {
      sabah: false,
      ogle: false,
      ikindi: false,
      aksam: false,
      yatsi: false
    };

    if (prayerId in todayCheck) {
      const key = prayerId as keyof typeof todayCheck;
      setUserStats((prev) => ({
        ...prev,
        dailyCheckIn: {
          ...prev.dailyCheckIn,
          [today]: {
            ...todayCheck,
            [key]: true
          }
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-emerald-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Mobile Navbar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        onUseGps={handleUseGps}
        isLocatingGps={isLocatingGps}
        lang={lang}
        onSelectLang={(l) => setLang(l)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenQibla={() => setActiveTab('qibla')}
        isAudioMuted={isAudioMuted}
        onToggleMute={() => setIsAudioMuted(!isAudioMuted)}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onGoHome={() => {
          setActiveTab('prayerTimes');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating GPS / Status Toast */}
      {gpsToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-stone-900/95 text-white dark:bg-white dark:text-stone-900 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-emerald-500/50 animate-in fade-in slide-in-from-top-2 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{gpsToast}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-24 min-w-0 overflow-x-hidden">
      <Suspense fallback={<div className="py-16 text-center text-xs text-stone-500">Yükleniyor…</div>}>
        {/* 1. Prayer Times View */}
        {activeTab === 'prayerTimes' && prayerTimesData && (
          <PrayerTimesView
            data={prayerTimesData}
            city={currentCity}
            lang={lang}
            onStartPrayer={handleStartPrayer}
            onOpenQibla={() => {
              setActiveTab('qibla');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCity={(city) => setCurrentCity(city)}
            onOpenCityModal={() => setIsCityModalOpen(true)}
            onOpenDuaBook={() => {
              setActiveTab('myDuas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNotifications={() => setIsNotificationModalOpen(true)}
            totalDhikrCount={userStats.totalDhikrCount}
            completedKazalar={userStats.completedKazalar}
          />
        )}

        {/* 2. Namaz Guide View */}
        {activeTab === 'namazGuide' && (
          <NamazGuideView
            initialPrayerKey={selectedPrayerToGuide}
            onRecordPrayerCompleted={handlePrayerCompleted}
          />
        )}

        {/* 3. Abdest Guide View */}
        {activeTab === 'abdest' && <AbdestGuideView />}

        {/* 4. Qibla Compass View */}
        {activeTab === 'qibla' && <QiblaCompassView city={currentCity} />}

        {/* 5. Zikirmatik View */}
        {activeTab === 'zikir' && (
          <ZikirmatikView onDhikrCountUpdated={handleDhikrCountUpdated} />
        )}

        {/* 6. Kaza Tracker View */}
        {activeTab === 'kaza' && (
          <KazaTrackerView onKazaCompleted={handleKazaCompleted} />
        )}

        {/* 7. Surahs and Duas View */}
        {activeTab === 'kuranDua' && (
          <SurahsAndDuasView onSurahRead={handleSurahRead} />
        )}

        {/* 8. Prophets and Sahaba View */}
        {activeTab === 'prophets' && <ProphetsAndSahabaView />}

        {/* 9. Personal Dua Book View */}
        {activeTab === 'myDuas' && <PersonalDuaBookView />}

        {/* 10. Dini Günler & Kandil Takvimi View */}
        {activeTab === 'diniGunler' && <DiniGunlerView />}

        {/* 11. Stats View */}
        {activeTab === 'stats' && (
          <StatsView stats={userStats} onUpdateStats={(s) => setUserStats(s)} />
        )}

        {/* 12. Diyanet Guide View */}
        {activeTab === 'diyanet' && <DiyanetGuideView />}

        {/* 13. İslami Soru-Cevap & Diyanet Fetvaları View */}
        {activeTab === 'soruCevap' && <IslamicQAView />}

        {/* 14. Hatm-i Şerif Tracker View */}
        {activeTab === 'hatim' && <HatimTrackerView />}

        {/* 15. Namaz Hatırlatıcı & Akıllı Vakit Alarmları View */}
        {activeTab === 'namazReminder' && (
          <PrayerReminderView
            prayerTimesData={prayerTimesData}
            onOpenPrayerGuide={handleStartPrayer}
            onOpenAbdestGuide={() => {
              setActiveTab('abdest');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQibla={() => {
              setActiveTab('qibla');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
          />
        )}
      </Suspense>
      </main>

      {/* Mobile Ergonomic Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
      />

      {/* 81 Provinces & Districts Selection Modal */}
      <CityDistrictModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={currentCity}
        onSelectLocation={(loc) => setCurrentCity(loc)}
        onUseGps={handleUseGps}
      />

      {/* Real-time In-App Notification Toast Banner */}
      <InAppNotificationToast
        prayerTimesData={prayerTimesData}
        onOpenPrayerGuide={handleStartPrayer}
        onOpenAbdestGuide={() => {
          setActiveTab('abdest');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQibla={() => {
          setActiveTab('qibla');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Prayer Notification Service Modal */}
      <PrayerNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        prayerTimesData={prayerTimesData}
        onOpenPrayerGuide={handleStartPrayer}
        onOpenDetailedReminders={() => {
          setIsNotificationModalOpen(false);
          setActiveTab('namazReminder');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Hafiz Audio & Tajweed Recitation Player */}
      <HafizAudioPlayerBar
        onOpenSurahView={() => {
          setActiveTab('kuranDua');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
