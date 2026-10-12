import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  Clock,
  Sparkles,
  Sliders,
  Check,
  ChevronRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Droplet,
  Play,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import {
  prayerNotificationService,
  PrayerNotificationConfig,
  PrayerCustomSetting,
  PrayerSoundMode,
  PRAYER_DISPLAY_NAMES,
  ADVANCE_MINUTE_PRESETS,
  NextScheduledAlert
} from '../services/prayerNotificationService';
import { PrayerTimesData, PrayerKey, Language } from '../types';
import { audioService } from '../services/audioService';
import { ADHAN_MAKAMS } from '../services/prayerTimeCalculator';

interface PrayerReminderViewProps {
  prayerTimesData: PrayerTimesData | null;
  onOpenPrayerGuide: (prayerKey: PrayerKey) => void;
  onOpenAbdestGuide: () => void;
  onOpenQibla?: () => void;
  lang?: Language;
}

export const PrayerReminderView: React.FC<PrayerReminderViewProps> = ({
  prayerTimesData,
  onOpenPrayerGuide,
  onOpenAbdestGuide,
  onOpenQibla,
  lang = 'tr'
}) => {
  const [config, setConfig] = useState<PrayerNotificationConfig>(() =>
    prayerNotificationService.getConfig()
  );
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null);
  const [playingPreviewKey, setPlayingPreviewKey] = useState<string | null>(null);

  useEffect(() => {
    setPermissionStatus(prayerNotificationService.getPermissionStatus());
    const unsubscribe = prayerNotificationService.subscribe((newConfig) => {
      setConfig(newConfig);
    });
    return unsubscribe;
  }, []);

  const nextAlert: NextScheduledAlert | null = prayerNotificationService.getNextScheduledAlert(prayerTimesData);

  const handleToggleGlobal = async () => {
    const nextState = !config.enabled;
    if (nextState) {
      const granted = await prayerNotificationService.requestPermission();
      setPermissionStatus(prayerNotificationService.getPermissionStatus());
      prayerNotificationService.updateConfig({ enabled: true });
    } else {
      prayerNotificationService.updateConfig({ enabled: false });
    }
  };

  const handleRequestPermission = async () => {
    await prayerNotificationService.requestPermission();
    setPermissionStatus(prayerNotificationService.getPermissionStatus());
  };

  const handleTogglePrayer = (key: PrayerKey) => {
    const current = config.customPrayerSettings[key] || {
      enabled: config.prayers[key],
      advanceMinutes: config.advanceMinutes,
      soundMode: 'adhan',
      abdestReminder: true
    };
    prayerNotificationService.updatePrayerSetting(key, { enabled: !current.enabled });
  };

  const handleSetPrayerAdvanceMinutes = (key: PrayerKey, minutes: number) => {
    prayerNotificationService.updatePrayerSetting(key, { advanceMinutes: minutes });
  };

  const handleSetPrayerSoundMode = (key: PrayerKey, mode: PrayerSoundMode) => {
    prayerNotificationService.updatePrayerSetting(key, { soundMode: mode });
  };

  const handleToggleAbdestReminder = (key: PrayerKey) => {
    const current = config.customPrayerSettings[key]?.abdestReminder ?? true;
    prayerNotificationService.updatePrayerSetting(key, { abdestReminder: !current });
  };

  const handleTestNotification = async () => {
    setTestSuccessMessage('Test bildirimi ekranın üst kısmında gösterildi!');
    await prayerNotificationService.triggerTestNotification();
    setTimeout(() => {
      setTestSuccessMessage(null);
    }, 4000);
  };

  const handlePlayPreviewTone = (key: PrayerKey, mode: PrayerSoundMode) => {
    setPlayingPreviewKey(key);
    if (mode === 'adhan') {
      const makamInfo = ADHAN_MAKAMS.find((m) => m.prayerKey === key);
      if (makamInfo) {
        audioService.playMakamMelody(makamInfo.audioFrequencyBase);
      } else {
        audioService.playAdhanChime();
      }
    } else if (mode === 'chime') {
      audioService.playAdhanChime();
    }
    setTimeout(() => {
      setPlayingPreviewKey(null);
    }, 2000);
  };

  const prayerIcons: Record<PrayerKey, React.ReactNode> = {
    imsak: <Moon className="w-5 h-5 text-indigo-500" />,
    gunes: <Sunrise className="w-5 h-5 text-amber-500" />,
    ogle: <Sun className="w-5 h-5 text-amber-500" />,
    ikindi: <Sun className="w-5 h-5 text-orange-500" />,
    aksam: <Sunset className="w-5 h-5 text-rose-500" />,
    yatsi: <Moon className="w-5 h-5 text-indigo-600" />
  };

  const prayerKeys: PrayerKey[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

  return (
    <div className="space-y-4 pb-24 max-w-xl mx-auto">
      {/* 1. Header Banner with Master Switch */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border border-emerald-800/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <BellRing className="w-5 h-5 animate-bounce" />
              </span>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                  Kişisel Vakit Asistanı
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  Namaz Hatırlatıcı
                </h2>
              </div>
            </div>

            {/* Master Switch Button */}
            <button
              onClick={handleToggleGlobal}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                config.enabled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 ring-2 ring-emerald-400/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              {config.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span>{config.enabled ? 'Hatırlatıcı Açık' : 'Hatırlatıcı Kapalı'}</span>
            </button>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Her namaz vakti için istediğiniz hatırlatma dakikasını ve ses türünü belirleyin. Vakit girdiğinde ekranın üstünde beliren şık bildirim çubuğu ile tek tıkla doğrudan <strong>Namaz Rehberi</strong>'ne geçin.
          </p>

          {/* Permission Status & Test Trigger */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              {permissionStatus === 'granted' ? (
                <span className="flex items-center gap-1 text-emerald-300 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cihaz Bildirim İzni Aktif
                </span>
              ) : (
                <button
                  onClick={handleRequestPermission}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold text-[11px] hover:bg-amber-400 cursor-pointer transition-colors"
                >
                  Bildirim İznini Aç
                </button>
              )}
            </div>

            <button
              onClick={handleTestNotification}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bildirimi Test Et</span>
            </button>
          </div>

          {testSuccessMessage && (
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs text-center animate-in fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{testSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Upcoming Alert Spotlight Card with Direct Namaz Guide CTA */}
      {nextAlert && prayerTimesData && (
        <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500/80 rounded-3xl p-5 shadow-lg shadow-emerald-900/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Sıradaki Hatırlatma
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              {nextAlert.scheduledTimeStr}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                {nextAlert.prayerName} Namazı Vakti
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {nextAlert.description} • <strong>{nextAlert.minutesUntilAlert} dakika sonra</strong>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {nextAlert.prayerTime}
              </span>
            </div>
          </div>

          {/* DIRECT ACTION: Start Namaz Guide */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
            <button
              onClick={() => onOpenPrayerGuide(nextAlert.prayerKey)}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{nextAlert.prayerName} Namazı Rehberi'ni Başlat</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAbdestGuide}
              className="py-2.5 px-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Abdest Alma Rehberi"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              <span>Abdest</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Section Title */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Vakitlere Özel Bildirim & Hatırlatma Ayarları</span>
        </h3>
        <span className="text-xs text-stone-500">
          {cityDistrictName(prayerTimesData?.city)}
        </span>
      </div>

      {/* 4. Individual Prayer Settings Cards */}
      <div className="space-y-3">
        {prayerKeys.map((key) => {
          const prayerName = PRAYER_DISPLAY_NAMES[key];
          const timeStr = prayerTimesData?.times[key] || '--:--';
          const pSetting: PrayerCustomSetting = config.customPrayerSettings[key] || {
            enabled: config.prayers[key],
            advanceMinutes: config.advanceMinutes,
            soundMode: 'adhan',
            abdestReminder: true
          };

          const isCurrentPrayer = prayerTimesData?.currentPrayer.key === key;
          const isNextPrayer = prayerTimesData?.nextPrayer.key === key;
          const makamInfo = ADHAN_MAKAMS.find((m) => m.prayerKey === key);

          return (
            <div
              key={key}
              className={`bg-white dark:bg-stone-900 border rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 transition-all ${
                isNextPrayer
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : isCurrentPrayer
                  ? 'border-amber-400 dark:border-amber-600/60'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Header Row: Icon, Name, Time, and Active Toggle */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800">
                    {prayerIcons[key]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                        {prayerName}
                      </h4>
                      {isNextPrayer && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Sıradaki Vakit
                        </span>
                      )}
                      {isCurrentPrayer && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Giren Vakit
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                      Vakit Saati: {timeStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pSetting.enabled}
                      onChange={() => handleTogglePrayer(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>

              {/* Sub-settings if enabled */}
              {pSetting.enabled && (
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-3 animate-in fade-in">
                  {/* 1. Advance Minutes Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        Hatırlatma Zamanı:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {pSetting.advanceMinutes === 0
                          ? 'Tam Vaktinde (Ezan Anı)'
                          : `${pSetting.advanceMinutes} dakika önce`}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[0, 10, 15, 30, 45].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => handleSetPrayerAdvanceMinutes(key, mins)}
                          className={`py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            pSetting.advanceMinutes === mins
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {mins === 0 ? '0 dk' : `${mins} dk`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Sound Mode Selector & Audio Tone Preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        Bildirim Tınısı & Sesi:
                      </span>
                      {makamInfo && pSetting.soundMode === 'adhan' && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                          {makamInfo.makam}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {[
                        { id: 'adhan' as PrayerSoundMode, label: 'Ezan Sesi' },
                        { id: 'chime' as PrayerSoundMode, label: 'Zil Çanı' },
                        { id: 'vibrate' as PrayerSoundMode, label: 'Titreşim' },
                        { id: 'silent' as PrayerSoundMode, label: 'Sessiz' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSetPrayerSoundMode(key, item.id)}
                          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            pSetting.soundMode === item.id
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Preview Tone Player */}
                    {pSetting.soundMode !== 'silent' && pSetting.soundMode !== 'vibrate' && (
                      <button
                        onClick={() => handlePlayPreviewTone(key, pSetting.soundMode)}
                        className="w-full mt-1 py-1.5 px-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/70 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className={`w-3.5 h-3.5 ${playingPreviewKey === key ? 'text-emerald-500 animate-spin' : 'text-emerald-600'}`} />
                        <span>{playingPreviewKey === key ? 'Sesi Çalıyor...' : 'Bu Vaktin Ezan Tınısını Dinle'}</span>
                      </button>
                    )}
                  </div>

                  {/* 3. Abdest Reminder Checkbox */}
                  {key !== 'gunes' && (
                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-stone-600 dark:text-stone-400">
                      <input
                        type="checkbox"
                        checked={pSetting.abdestReminder}
                        onChange={() => handleToggleAbdestReminder(key)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                      />
                      <span>Namaz öncesi abdest hazırlığı uyarısı gönder</span>
                    </label>
                  )}
                </div>
              )}

              {/* DIRECT ACTION: Start Namaz Guide for this Prayer */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-400">
                  Kılınış ve duaları adım adım takip edin
                </span>

                <button
                  onClick={() => onOpenPrayerGuide(key)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300/40 cursor-pointer transition-colors shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Namaz Rehberini Başlat</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Special Worship & Spiritual Alarms Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Özel İbadet & Manevi Alarmlar
            </h3>
            <p className="text-xs text-stone-500">
              Sünnet ve nafile ibadetler için kişiselleştirilmiş hatırlatıcılar
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Cuma Reminder */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900 dark:text-white block">
                Cuma Namazı Hazırlık Bildirimi
              </span>
              <p className="text-[11px] text-stone-500">
                Cuma sabahı Kehf Sûresi tilaveti, gusül ve camiye erken gitme uyarısı
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.specialReminders?.cumaReminder ?? true}
                onChange={(e) =>
                  prayerNotificationService.updateSpecialReminders({ cumaReminder: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Teheccud & Sahur Alarm */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900 dark:text-white block">
                Teheccüd & Sahur Uyanma Alarmı
              </span>
              <p className="text-[11px] text-stone-500">
                İmsak vaktinden 45 dakika önce seher vakti istiğfarı için uyarır
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.specialReminders?.teheccudReminder ?? false}
                onChange={(e) =>
                  prayerNotificationService.updateSpecialReminders({ teheccudReminder: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Duha / Kusluk Reminder */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900 dark:text-white block">
                Kuşluk (Duhâ) Namazı Bildirimi
              </span>
              <p className="text-[11px] text-stone-500">
                Güneş doğuşundan 45 dakika sonra kerahat vakti çıkınca nafile namaz uyarısı
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.specialReminders?.duhaReminder ?? true}
                onChange={(e) =>
                  prayerNotificationService.updateSpecialReminders({ duhaReminder: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Daily Kaza Reminder */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900 dark:text-white block">
                Günlük Kaza Namazı Hatırlatması
              </span>
              <p className="text-[11px] text-stone-500">
                Her akşam saat 21:30'da kaza namazı borçlarını ödemek için nazik uyarı
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.specialReminders?.kazaReminder ?? true}
                onChange={(e) =>
                  prayerNotificationService.updateSpecialReminders({ kazaReminder: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

function cityDistrictName(city?: string): string {
  if (!city) return 'Konumunuz';
  return city;
}
