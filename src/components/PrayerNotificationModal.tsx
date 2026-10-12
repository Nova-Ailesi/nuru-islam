import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  Volume2,
  VolumeX,
  Smartphone,
  Check,
  AlertCircle,
  Sparkles,
  Sliders,
  History,
  Trash2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  prayerNotificationService,
  PrayerNotificationConfig,
  ADVANCE_MINUTE_PRESETS,
  PRAYER_DISPLAY_NAMES,
  NextScheduledAlert
} from '../services/prayerNotificationService';
import { PrayerTimesData, PrayerKey } from '../types';

interface PrayerNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTimesData: PrayerTimesData | null;
  onOpenPrayerGuide?: (key: PrayerKey) => void;
  onOpenDetailedReminders?: () => void;
}

export const PrayerNotificationModal: React.FC<PrayerNotificationModalProps> = ({
  isOpen,
  onClose,
  prayerTimesData,
  onOpenPrayerGuide,
  onOpenDetailedReminders
}) => {
  const [config, setConfig] = useState<PrayerNotificationConfig>(() =>
    prayerNotificationService.getConfig()
  );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');

  // Subscribe to service updates
  useEffect(() => {
    setPermissionStatus(prayerNotificationService.getPermissionStatus());
    const unsubscribe = prayerNotificationService.subscribe((newConfig) => {
      setConfig(newConfig);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const nextAlert: NextScheduledAlert | null = prayerNotificationService.getNextScheduledAlert(prayerTimesData);

  const handleToggleGlobal = async () => {
    const nextState = !config.enabled;
    if (nextState) {
      const granted = await prayerNotificationService.requestPermission();
      setPermissionStatus(prayerNotificationService.getPermissionStatus());
      if (granted) {
        prayerNotificationService.updateConfig({ enabled: true });
      } else {
        // Still enable in-app notifications even if browser denied
        prayerNotificationService.updateConfig({ enabled: true });
      }
    } else {
      prayerNotificationService.updateConfig({ enabled: false });
    }
  };

  const handleRequestPermission = async () => {
    await prayerNotificationService.requestPermission();
    setPermissionStatus(prayerNotificationService.getPermissionStatus());
  };

  const handleSelectPresetMinutes = (mins: number) => {
    prayerNotificationService.updateConfig({ advanceMinutes: mins });
  };

  const handleTogglePrayer = (key: PrayerKey) => {
    prayerNotificationService.updateConfig({
      prayers: {
        ...config.prayers,
        [key]: !config.prayers[key]
      }
    });
  };

  const handleTestNotification = async () => {
    setTestSuccessMessage('Test bildirimi gönderildi! (Ses + Titreşim)');
    await prayerNotificationService.triggerTestNotification();
    setTimeout(() => {
      setTestSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>Namaz Vakti Bildirim Servisi</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Arka planda çalışma & özel dakika ayarları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900 px-4 pt-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'settings'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Bildirim Yapılandırması</span>
            </span>
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Geçmiş & Kayıtlar</span>
            {config.history.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {config.history.length}
              </span>
            )}
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'settings' ? (
            <>
              {/* Permission Banner */}
              {permissionStatus !== 'granted' && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      Tarayıcı & Cihaz Bildirim İzni Gerekli
                    </p>
                    <p className="text-amber-800 dark:text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                      Ekranınız kilitliyken veya başka bir uygulamadayken ezan bildirimlerinin çalması için sistem izni verin.
                    </p>
                    <button
                      onClick={handleRequestPermission}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Bildirim İznini Etkinleştir</span>
                    </button>
                  </div>
                </div>
              )}

              {permissionStatus === 'granted' && (
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-medium">
                    Cihaz bildirim izni onaylı. Servis arka planda aktif çalışıyor.
                  </span>
                </div>
              )}

              {/* Detailed Reminder View Shortcut */}
              {onOpenDetailedReminders && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-stone-900/60 border border-emerald-500/40 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Kapsamlı Namaz Hatırlatıcı & Alarmlar</span>
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      Her vakit için ayrı dakika, ezan makamı ve özel ibadet alarmları
                    </p>
                  </div>
                  <button
                    onClick={onOpenDetailedReminders}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Sayfayı Aç</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Master Service Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 dark:text-white">
                      Arka Plan Bildirim Servisi
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config.enabled
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {config.enabled ? 'AKTİF' : 'DEVRE DIŞI'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Vakit yaklaştığında ve ezan girdiğinde cihazda bildirim tetikler.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleGlobal}
                  className={`w-12 h-6.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    config.enabled ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      config.enabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Next Alert Info Card */}
              {config.enabled && nextAlert && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Sıradaki Bildirim
                      </p>
                      <p className="text-xs font-bold text-stone-900 dark:text-white mt-0.5">
                        {nextAlert.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                    {nextAlert.minutesUntilAlert} dk sonra
                  </span>
                </div>
              )}

              {/* Feature Focus: Kaç Dakika Kala Bildirilsin? (User Customization) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      Kaç Dakika Kala Bildirilsin?
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {config.advanceMinutes} Dakika Kala
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Namaz vaktinin girmesinden önce abdest ve hazırlık için bildirim almak istediğiniz süreyi belirleyin:
                </p>

                {/* Preset Pills */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {ADVANCE_MINUTE_PRESETS.map((mins) => {
                    const isSelected = config.advanceMinutes === mins;
                    return (
                      <button
                        key={mins}
                        onClick={() => handleSelectPresetMinutes(mins)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-400 dark:ring-emerald-600'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                      >
                        {mins} dk
                        {mins === 15 && (
                          <span className="block text-[8px] font-normal opacity-90">Önerilen</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Fine-Tuning Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-stone-400 mb-1 font-mono">
                    <span>1 dk</span>
                    <span>30 dk</span>
                    <span>60 dk</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={config.advanceMinutes}
                    onChange={(e) =>
                      prayerNotificationService.updateConfig({
                        advanceMinutes: Number(e.target.value)
                      })
                    }
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Exact Time Notification Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-900 dark:text-white">
                    Vakit Girdiğinde de Bildir (Ezan Vakti)
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Namaz vakti girdiğinde "Haydin namaza" bildirimi gönderir
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifyOnExactTime}
                  onChange={(e) =>
                    prayerNotificationService.updateConfig({
                      notifyOnExactTime: e.target.checked
                    })
                  }
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Individual Prayer Selection */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Bildirim Alınacak Vakitler
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'] as PrayerKey[]).map(
                    (key) => {
                      const isSelected = config.prayers[key];
                      const timeStr = prayerTimesData?.times[key] || '--:--';
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleTogglePrayer(key)}
                          className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 shadow-xs'
                              : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 text-stone-400 opacity-60'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{PRAYER_DISPLAY_NAMES[key]}</p>
                            <p className="text-[11px] font-mono opacity-80">{timeStr}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'border border-stone-300 dark:border-stone-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Audio & Vibration Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    prayerNotificationService.updateConfig({
                      soundEnabled: !config.soundEnabled
                    })
                  }
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                    config.soundEnabled
                      ? 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white'
                      : 'bg-stone-50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
                  }`}
                >
                  {config.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold">Ezan Sesi / Çan</p>
                    <p className="text-[10px] text-stone-500">
                      {config.soundEnabled ? 'Açık' : 'Kapalı'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    prayerNotificationService.updateConfig({
                      vibrationEnabled: !config.vibrationEnabled
                    })
                  }
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                    config.vibrationEnabled
                      ? 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white'
                      : 'bg-stone-50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
                  }`}
                >
                  <Smartphone
                    className={`w-4 h-4 shrink-0 ${
                      config.vibrationEnabled ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold">Cihaz Titreşimi</p>
                    <p className="text-[10px] text-stone-500">
                      {config.vibrationEnabled ? 'Açık' : 'Kapalı'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Test Notification Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-emerald-500/50 dark:border-emerald-600/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Bildirim Servisini Test Et (Ses + Titreşim + Bildirim)</span>
                </button>

                {testSuccessMessage && (
                  <p className="text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center justify-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{testSuccessMessage}</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Notification History Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-stone-500">
                  Son Tetiklenen Bildirim Kayıtları
                </p>
                {config.history.length > 0 && (
                  <button
                    onClick={() => prayerNotificationService.clearHistory()}
                    className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Geçmişi Temizle</span>
                  </button>
                )}
              </div>

              {config.history.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-stone-500">
                    Henüz tetiklenmiş bir bildirim kaydı yok.
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Namaz vakitleri yaklaştıkça bildirimler burada listelenecektir.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {config.history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <span>{item.title}</span>
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {item.formattedTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                        {item.body}
                      </p>
                      {onOpenPrayerGuide && item.prayerKey && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenPrayerGuide(item.prayerKey);
                          }}
                          className="mt-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Namaz Rehberini Aç</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            Diyanet Takvimi Uyumlu
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            Kaydet ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
