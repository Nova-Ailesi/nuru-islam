import { PrayerKey, PrayerTimesData } from '../types';
import { audioService } from './audioService';
import { CityLocation } from './prayerTimeCalculator';

export interface NotificationHistoryItem {
  id: string;
  prayerKey: PrayerKey;
  prayerName: string;
  prayerTime: string;
  type: 'advance' | 'exact' | 'test';
  title: string;
  body: string;
  timestamp: number;
  formattedTime: string;
}

export type PrayerSoundMode = 'adhan' | 'chime' | 'vibrate' | 'silent';

export interface PrayerCustomSetting {
  enabled: boolean;
  advanceMinutes: number;
  soundMode: PrayerSoundMode;
  abdestReminder: boolean;
}

export interface SpecialRemindersConfig {
  cumaReminder: boolean;
  teheccudReminder: boolean;
  teheccudMinutesBeforeImsak: number;
  duhaReminder: boolean;
  kazaReminder: boolean;
  kazaReminderTime: string;
}

export interface PrayerNotificationConfig {
  enabled: boolean;
  advanceMinutes: number; // e.g. 5, 10, 15, 20, 30, 45, 60
  notifyOnExactTime: boolean; // Ezan vakti girdiğinde de bildir
  soundEnabled: boolean; // Ezan / manevi zil sesi
  vibrationEnabled: boolean; // Titreşim
  prayers: Record<PrayerKey, boolean>;
  customPrayerSettings: Record<PrayerKey, PrayerCustomSetting>;
  specialReminders: SpecialRemindersConfig;
  history: NotificationHistoryItem[];
}

export interface NextScheduledAlert {
  prayerKey: PrayerKey;
  prayerName: string;
  prayerTime: string;
  type: 'advance' | 'exact';
  scheduledTimeStr: string;
  minutesUntilAlert: number;
  description: string;
}

export const PRAYER_DISPLAY_NAMES: Record<PrayerKey, string> = {
  imsak: 'İmsak / Sabah',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı'
};

export const ADVANCE_MINUTE_PRESETS = [5, 10, 15, 20, 30, 45, 60];

const STORAGE_KEY = 'nur_islam_notification_config_v2';
const FIRED_STORAGE_KEY = 'nur_islam_fired_alerts_today';

export const DEFAULT_CUSTOM_PRAYER_SETTINGS: Record<PrayerKey, PrayerCustomSetting> = {
  imsak: { enabled: true, advanceMinutes: 30, soundMode: 'adhan', abdestReminder: true },
  gunes: { enabled: false, advanceMinutes: 15, soundMode: 'chime', abdestReminder: false },
  ogle: { enabled: true, advanceMinutes: 15, soundMode: 'adhan', abdestReminder: true },
  ikindi: { enabled: true, advanceMinutes: 15, soundMode: 'adhan', abdestReminder: true },
  aksam: { enabled: true, advanceMinutes: 15, soundMode: 'adhan', abdestReminder: true },
  yatsi: { enabled: true, advanceMinutes: 15, soundMode: 'adhan', abdestReminder: true }
};

export const DEFAULT_SPECIAL_REMINDERS: SpecialRemindersConfig = {
  cumaReminder: true,
  teheccudReminder: false,
  teheccudMinutesBeforeImsak: 45,
  duhaReminder: true,
  kazaReminder: true,
  kazaReminderTime: '21:30'
};

const DEFAULT_CONFIG: PrayerNotificationConfig = {
  enabled: false,
  advanceMinutes: 15,
  notifyOnExactTime: true,
  soundEnabled: true,
  vibrationEnabled: true,
  prayers: {
    imsak: true,
    gunes: false,
    ogle: true,
    ikindi: true,
    aksam: true,
    yatsi: true
  },
  customPrayerSettings: DEFAULT_CUSTOM_PRAYER_SETTINGS,
  specialReminders: DEFAULT_SPECIAL_REMINDERS,
  history: []
};

class PrayerNotificationService {
  private config: PrayerNotificationConfig;
  private listeners: Set<(config: PrayerNotificationConfig) => void> = new Set();
  private inAppAlertListeners: Set<(item: NotificationHistoryItem) => void> = new Set();
  private intervalId: number | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private getTimesCallback: (() => PrayerTimesData | null) | null = null;
  private getCityCallback: (() => CityLocation) | null = null;

  constructor() {
    this.config = this.loadConfig();
    this.initServiceWorker();
  }

  private loadConfig(): PrayerNotificationConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          prayers: { ...DEFAULT_CONFIG.prayers, ...(parsed.prayers || {}) },
          customPrayerSettings: {
            ...DEFAULT_CONFIG.customPrayerSettings,
            ...(parsed.customPrayerSettings || {})
          },
          specialReminders: {
            ...DEFAULT_CONFIG.specialReminders,
            ...(parsed.specialReminders || {})
          }
        };
      }
    } catch {
      // ignore
    }
    return { ...DEFAULT_CONFIG };
  }

  public getConfig(): PrayerNotificationConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<PrayerNotificationConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      prayers: {
        ...this.config.prayers,
        ...(partial.prayers || {})
      },
      customPrayerSettings: {
        ...this.config.customPrayerSettings,
        ...(partial.customPrayerSettings || {})
      },
      specialReminders: {
        ...this.config.specialReminders,
        ...(partial.specialReminders || {})
      }
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // ignore
    }
    this.notifyListeners();
  }

  public updatePrayerSetting(key: PrayerKey, partial: Partial<PrayerCustomSetting>): void {
    const current = this.config.customPrayerSettings[key] || DEFAULT_CUSTOM_PRAYER_SETTINGS[key];
    const updated = { ...current, ...partial };
    this.updateConfig({
      prayers: {
        ...this.config.prayers,
        [key]: updated.enabled
      },
      customPrayerSettings: {
        ...this.config.customPrayerSettings,
        [key]: updated
      }
    });
  }

  public updateSpecialReminders(partial: Partial<SpecialRemindersConfig>): void {
    this.updateConfig({
      specialReminders: {
        ...this.config.specialReminders,
        ...partial
      }
    });
  }

  public subscribe(listener: (config: PrayerNotificationConfig) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeInAppAlert(listener: (item: NotificationHistoryItem) => void): () => void {
    this.inAppAlertListeners.add(listener);
    return () => this.inAppAlertListeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l(this.config));
  }

  /**
   * Register background Service Worker for handling push & notification events
   */
  private async initServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        this.swRegistration = reg;
        console.log('[NotificationService] Service Worker registered with scope:', reg.scope);
      } catch (err) {
        console.warn('[NotificationService] Service Worker registration failed (normal in restricted preview):', err);
      }
    }
  }

  /**
   * Check browser permission status
   */
  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        this.updateConfig({ enabled: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Start background checking loop
   */
  public startService(
    getTimes: () => PrayerTimesData | null,
    getCity: () => CityLocation
  ): void {
    this.getTimesCallback = getTimes;
    this.getCityCallback = getCity;

    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    // Run immediately
    this.runCheckCycle();

    // Run every 10 seconds for precise time matching
    this.intervalId = window.setInterval(() => {
      this.runCheckCycle();
    }, 10000);

    // Also run on visibility change (user comes back to tab)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.runCheckCycle();
    }
  };

  public stopService(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * Convert 'HH:mm' to minutes from 00:00
   */
  private timeStringToMinutes(tStr: string): number {
    const [h, m] = tStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  /**
   * Get today's fired alert keys from sessionStorage to avoid duplicate firing
   */
  private getFiredAlertsToday(): Set<string> {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const raw = sessionStorage.getItem(FIRED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === todayStr && Array.isArray(parsed.keys)) {
          return new Set(parsed.keys);
        }
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  }

  private markAlertFired(alertKey: string): void {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const fired = this.getFiredAlertsToday();
      fired.add(alertKey);
      sessionStorage.setItem(
        FIRED_STORAGE_KEY,
        JSON.stringify({ date: todayStr, keys: Array.from(fired) })
      );
    } catch {
      // ignore
    }
  }

  /**
   * Main check cycle comparing current time with prayer times
   */
  public runCheckCycle(): void {
    if (!this.config.enabled) return;
    if (!this.getTimesCallback) return;

    const data = this.getTimesCallback();
    if (!data || !data.times) return;

    const city = this.getCityCallback ? this.getCityCallback() : { name: 'Konumunuz' };
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const todayStr = now.toISOString().split('T')[0];
    const firedSet = this.getFiredAlertsToday();

    const prayerKeys: PrayerKey[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

    for (const key of prayerKeys) {
      if (!this.config.prayers[key]) continue;

      const timeStr = data.times[key];
      if (!timeStr) continue;

      const prayerMins = this.timeStringToMinutes(timeStr);
      let diff = prayerMins - currentMinutes;

      // Handle midnight wrap-around (e.g. comparing 23:50 with 05:20 imsak)
      if (diff < -720) {
        diff += 1440;
      }

      const pName = PRAYER_DISPLAY_NAMES[key];

      // 1. Advance Notification (Önceden Uyarı: e.g. 15 dk kala)
      const advanceKey = `${todayStr}-${key}-advance-${this.config.advanceMinutes}`;
      if (diff === this.config.advanceMinutes && !firedSet.has(advanceKey)) {
        this.markAlertFired(advanceKey);
        this.dispatchAlert({
          prayerKey: key,
          prayerName: pName,
          prayerTime: timeStr,
          type: 'advance',
          title: `🔔 ${pName} Vaktine ${this.config.advanceMinutes} Dakika Kaldı!`,
          body: `${city.name} için ${pName} vakti (${timeStr}) yaklaşıyor. Abdest tazeleyebilir veya hazırlık yapabilirsiniz.`
        });
      }

      // 2. Exact Prayer Entry Notification (Ezan / Vakit Girişi)
      if (this.config.notifyOnExactTime) {
        const exactKey = `${todayStr}-${key}-exact`;
        if (diff === 0 && !firedSet.has(exactKey)) {
          this.markAlertFired(exactKey);
          this.dispatchAlert({
            prayerKey: key,
            prayerName: pName,
            prayerTime: timeStr,
            type: 'exact',
            title: `🕌 Ezan Vakti: ${pName} Namazı Vakti Girdi!`,
            body: `Haydin namaza, haydin kurtuluşa! ${city.name} için ${pName} namazı vakti (${timeStr}) girmiştir.`
          });
        }
      }
    }
  }

  /**
   * Dispatch notification via Audio, Vibration, Browser Web Notification, and In-App Toast
   */
  private async dispatchAlert(params: {
    prayerKey: PrayerKey;
    prayerName: string;
    prayerTime: string;
    type: 'advance' | 'exact' | 'test';
    title: string;
    body: string;
  }): Promise<void> {
    const { prayerKey, prayerName, prayerTime, type, title, body } = params;

    // 1. Play Sound
    if (this.config.soundEnabled) {
      audioService.playAdhanChime();
    }

    // 2. Trigger Device Vibration
    if (this.config.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'exact') {
          navigator.vibrate([300, 150, 300, 150, 400]);
        } else {
          navigator.vibrate([200, 100, 200, 100, 300]);
        }
      } catch {
        // ignore
      }
    }

    // 3. System Notification (Service Worker or Notification API)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if (this.swRegistration && 'showNotification' in this.swRegistration) {
          await (this.swRegistration as any).showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `namaz-${prayerKey}-${type}-${Date.now()}`,
            vibrate: [200, 100, 200],
            data: { prayerKey, type, prayerTime },
            actions: [
              { action: 'open_guide', title: 'Namaz Rehberi' },
              { action: 'dismiss', title: 'Tamam' }
            ]
          } as any);
        } else {
          new Notification(title, {
            body,
            icon: '/icon-192.png'
          });
        }
      } catch (err) {
        console.warn('[NotificationService] System notification dispatch note:', err);
      }
    }

    // 4. Record to History
    const now = new Date();
    const historyItem: NotificationHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      prayerKey,
      prayerName,
      prayerTime,
      type,
      title,
      body,
      timestamp: Date.now(),
      formattedTime: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [historyItem, ...this.config.history.slice(0, 19)];
    this.updateConfig({ history: updatedHistory });

    // 5. Trigger in-app alert banner
    this.inAppAlertListeners.forEach((listener) => {
      try {
        listener(historyItem);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Calculate next alert that will fire (e.g. "İkindiye 15 dk kala - 15:28")
   */
  public getNextScheduledAlert(data: PrayerTimesData | null): NextScheduledAlert | null {
    if (!this.config.enabled || !data || !data.times) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerKeys: PrayerKey[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

    interface Candidate {
      prayerKey: PrayerKey;
      prayerName: string;
      prayerTime: string;
      type: 'advance' | 'exact';
      alertMinuteOfDay: number;
      scheduledTimeStr: string;
      minutesUntilAlert: number;
      description: string;
    }

    const candidates: Candidate[] = [];

    for (const key of prayerKeys) {
      if (!this.config.prayers[key]) continue;
      const pTimeStr = data.times[key];
      if (!pTimeStr) continue;

      const pMins = this.timeStringToMinutes(pTimeStr);
      const pName = PRAYER_DISPLAY_NAMES[key];

      // Advance alert candidate
      const advMin = pMins - this.config.advanceMinutes;
      const advNormalized = (advMin + 1440) % 1440;
      let diffAdv = advNormalized - currentMinutes;
      if (diffAdv < 0) diffAdv += 1440;

      const advH = Math.floor(advNormalized / 60);
      const advM = advNormalized % 60;
      const advTimeStr = `${advH.toString().padStart(2, '0')}:${advM.toString().padStart(2, '0')}`;

      candidates.push({
        prayerKey: key,
        prayerName: pName,
        prayerTime: pTimeStr,
        type: 'advance',
        alertMinuteOfDay: advNormalized,
        scheduledTimeStr: advTimeStr,
        minutesUntilAlert: diffAdv,
        description: `${pName} namazına ${this.config.advanceMinutes} dk kala (${advTimeStr})`
      });

      // Exact alert candidate
      if (this.config.notifyOnExactTime) {
        let diffExact = pMins - currentMinutes;
        if (diffExact <= 0) diffExact += 1440;

        candidates.push({
          prayerKey: key,
          prayerName: pName,
          prayerTime: pTimeStr,
          type: 'exact',
          alertMinuteOfDay: pMins,
          scheduledTimeStr: pTimeStr,
          minutesUntilAlert: diffExact,
          description: `${pName} ezan vakti girdiğinde (${pTimeStr})`
        });
      }
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.minutesUntilAlert - b.minutesUntilAlert);
    const closest = candidates[0];

    return {
      prayerKey: closest.prayerKey,
      prayerName: closest.prayerName,
      prayerTime: closest.prayerTime,
      type: closest.type,
      scheduledTimeStr: closest.scheduledTimeStr,
      minutesUntilAlert: closest.minutesUntilAlert,
      description: closest.description
    };
  }

  /**
   * Test notification trigger for instant user verification
   */
  public async triggerTestNotification(): Promise<void> {
    const isPermissionGranted = this.getPermissionStatus() === 'granted';

    await this.dispatchAlert({
      prayerKey: 'ogle',
      prayerName: 'Öğle',
      prayerTime: '12:55',
      type: 'test',
      title: 'Öğle Namazı Vakti Girdi (12:55)',
      body: 'Haydin namaza, haydin kurtuluşa! Öğle namazını huşu ile eda etmek için Namaz Rehberi\'ni başlatabilirsiniz.'
    });

    if (!isPermissionGranted && 'Notification' in window) {
      await this.requestPermission();
    }
  }

  public async fireTestAlert(): Promise<void> {
    return this.triggerTestNotification();
  }

  /**
   * Clear notification history
   */
  public clearHistory(): void {
    this.updateConfig({ history: [] });
  }
}

export const prayerNotificationService = new PrayerNotificationService();
