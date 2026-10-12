/**
 * Prayer Session Service
 * Synchronizes real-time prayer progress (current rakat, section, recitation stage, posture)
 * between the Main Dashboard (Namaz İlerleme Widget) and Namaz Rehberi (Interactive Guide).
 */

import { ALL_NAMAZ_TYPES } from '../data/namazGuide';
import { NamazStep, PrayerKey } from '../types';

export interface ActivePrayerSession {
  prayerId: string; // e.g. 'sabah', 'ogle', 'ikindi', 'aksam', 'yatsi', 'cuma', 'vitir'
  prayerName: string; // e.g. "Öğle Namazı"
  category: 'vakit' | 'ozel' | 'nafile';
  timeSlotKey?: string;
  sectionIndex: number;
  sectionTitle: string;
  totalSections: number;
  currentRakat: number;
  totalRakats: number;
  stepIndex: number;
  totalStepsInSection: number;
  totalStepsInPrayer: number;
  currentStepOverallNumber: number;
  progressPercent: number;
  posture: 'kiyam' | 'ruku' | 'kavme' | 'secde' | 'celse' | 'kade' | 'selam_sag' | 'selam_sol';
  stepTitle: string;
  recitationStage: string; // e.g. "Fâtiha ve Zammı Sûre" or "Rükû Tesbihâtı"
  arabicSnippet?: string;
  isVoiceFollowActive: boolean;
  isVoiceFollowPaused: boolean;
  isMosqueAmbianceActive: boolean; // Mosque acoustic dome reverb
  isCompleted: boolean;
  lastUpdatedAt: number;
}

const STORAGE_KEY = 'nuru_active_prayer_session';

class PrayerSessionService {
  private currentSession: ActivePrayerSession | null = null;
  private listeners: Set<(session: ActivePrayerSession | null) => void> = new Set();
  private mosqueAmbianceEnabled: boolean = true;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep if updated within the last 4 hours
        if (Date.now() - parsed.lastUpdatedAt < 4 * 60 * 60 * 1000 && !parsed.isCompleted) {
          this.currentSession = parsed;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Ignore
    }
  }

  private saveToStorage(): void {
    try {
      if (this.currentSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentSession);
      } catch (err) {
        console.error('Error in prayer session listener:', err);
      }
    });
  }

  public subscribe(callback: (session: ActivePrayerSession | null) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentSession);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getSession(): ActivePrayerSession | null {
    return this.currentSession;
  }

  public getMosqueAmbiance(): boolean {
    return this.mosqueAmbianceEnabled;
  }

  public setMosqueAmbiance(enabled: boolean): void {
    this.mosqueAmbianceEnabled = enabled;
    if (this.currentSession) {
      this.currentSession.isMosqueAmbianceActive = enabled;
      this.saveToStorage();
    }
  }

  /**
   * Find matching namaz definition by timeSlotKey or id
   */
  public getPrayerBySlot(timeSlotKey?: PrayerKey | string): (typeof ALL_NAMAZ_TYPES)[0] {
    if (!timeSlotKey) return ALL_NAMAZ_TYPES[0];
    const match = ALL_NAMAZ_TYPES.find(
      (n) => n.timeSlotKey === timeSlotKey || n.id === timeSlotKey
    );
    if (match) return match;

    // Fallbacks
    if (timeSlotKey === 'imsak' || timeSlotKey === 'gunes') {
      return ALL_NAMAZ_TYPES.find((n) => n.id === 'sabah') || ALL_NAMAZ_TYPES[0];
    }
    return ALL_NAMAZ_TYPES[0];
  }

  /**
   * Starts a prayer session from scratch
   */
  public startSession(
    prayerId: string,
    sectionIndex: number = 0,
    stepIndex: number = 0,
    isVoiceFollow: boolean = true
  ): ActivePrayerSession {
    const namaz = ALL_NAMAZ_TYPES.find((n) => n.id === prayerId) || ALL_NAMAZ_TYPES[0];
    const section = namaz.sections[sectionIndex] || namaz.sections[0];
    const step: NamazStep = section.steps[stepIndex] || section.steps[0];

    const totalStepsInPrayer = namaz.sections.reduce((acc, sec) => acc + sec.steps.length, 0);
    const stepsCompleted =
      namaz.sections.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.steps.length, 0) +
      stepIndex +
      1;
    const progressPercent = Math.round((stepsCompleted / totalStepsInPrayer) * 100);

    const session: ActivePrayerSession = {
      prayerId: namaz.id,
      prayerName: namaz.name,
      category: namaz.category as any,
      timeSlotKey: namaz.timeSlotKey,
      sectionIndex,
      sectionTitle: section.title,
      totalSections: namaz.sections.length,
      currentRakat: step.rakat || 1,
      totalRakats: section.rakats || namaz.totalRakats,
      stepIndex,
      totalStepsInSection: section.steps.length,
      totalStepsInPrayer,
      currentStepOverallNumber: stepsCompleted,
      progressPercent,
      posture: step.posture,
      stepTitle: step.title,
      recitationStage: step.transliteration || step.meaning || step.title,
      arabicSnippet: step.arabicText,
      isVoiceFollowActive: isVoiceFollow,
      isVoiceFollowPaused: false,
      isMosqueAmbianceActive: this.mosqueAmbianceEnabled,
      isCompleted: false,
      lastUpdatedAt: Date.now()
    };

    this.currentSession = session;
    this.saveToStorage();
    return session;
  }

  /**
   * Updates state during guide progression
   */
  public updateProgress(
    prayerId: string,
    sectionIndex: number,
    stepIndex: number,
    isVoiceFollowActive: boolean,
    isVoiceFollowPaused: boolean
  ): void {
    const namaz = ALL_NAMAZ_TYPES.find((n) => n.id === prayerId);
    if (!namaz) return;

    const section = namaz.sections[sectionIndex] || namaz.sections[0];
    const step = section.steps[stepIndex] || section.steps[0];

    const totalStepsInPrayer = namaz.sections.reduce((acc, sec) => acc + sec.steps.length, 0);
    const stepsCompleted =
      namaz.sections.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.steps.length, 0) +
      stepIndex +
      1;
    const progressPercent = Math.round((stepsCompleted / totalStepsInPrayer) * 100);

    this.currentSession = {
      prayerId: namaz.id,
      prayerName: namaz.name,
      category: namaz.category as any,
      timeSlotKey: namaz.timeSlotKey,
      sectionIndex,
      sectionTitle: section.title,
      totalSections: namaz.sections.length,
      currentRakat: step.rakat || 1,
      totalRakats: section.rakats || namaz.totalRakats,
      stepIndex,
      totalStepsInSection: section.steps.length,
      totalStepsInPrayer,
      currentStepOverallNumber: stepsCompleted,
      progressPercent,
      posture: step.posture,
      stepTitle: step.title,
      recitationStage: step.transliteration || step.meaning || step.title,
      arabicSnippet: step.arabicText,
      isVoiceFollowActive,
      isVoiceFollowPaused,
      isMosqueAmbianceActive: this.mosqueAmbianceEnabled,
      isCompleted: false,
      lastUpdatedAt: Date.now()
    };

    this.saveToStorage();
  }

  public pauseSession(): void {
    if (this.currentSession) {
      this.currentSession.isVoiceFollowPaused = true;
      this.currentSession.lastUpdatedAt = Date.now();
      this.saveToStorage();
    }
  }

  public resumeSession(): void {
    if (this.currentSession) {
      this.currentSession.isVoiceFollowPaused = false;
      this.currentSession.isVoiceFollowActive = true;
      this.currentSession.lastUpdatedAt = Date.now();
      this.saveToStorage();
    }
  }

  public completeSession(): void {
    if (this.currentSession) {
      this.currentSession.isCompleted = true;
      this.currentSession.isVoiceFollowActive = false;
      this.currentSession.progressPercent = 100;
      this.currentSession.lastUpdatedAt = Date.now();
      this.saveToStorage();
    }
  }

  public clearSession(): void {
    this.currentSession = null;
    this.saveToStorage();
  }
}

export const prayerSessionService = new PrayerSessionService();
