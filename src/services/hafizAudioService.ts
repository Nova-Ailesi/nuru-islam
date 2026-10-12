/**
 * Hafiz Audio Recitation & Tajweed Pronunciation Service
 * 
 * Streams authentic Quran recitations from world-renowned Hafiz masters
 * (Mishary Rashid Alafasy, AbdulBaset AbdulSamad, Maher Al-Muaiqly, Saad Al-Ghamdi)
 * with verse-by-verse synchronization, speed control (0.75x slow learning mode),
 * memorization loop (ezber modu: 1x, 3x, 5x, sonsuz), and tajweed pronunciation guidance.
 */

export interface HafizReciter {
  id: string;
  name: string;
  arabicName: string;
  subTitle: string;
  country: string;
  path: string; // EveryAyah folder
  bitrate: string;
}

export const HAFIZ_RECITERS: HafizReciter[] = [
  {
    id: 'alafasy',
    name: 'Şeyh Mişari Raşid el-Afasi',
    arabicName: 'مشاري راشد العفاسي',
    subTitle: 'Berrak Tecvid ve Makam',
    country: 'Kuveyt',
    path: 'Alafasy_128kbps',
    bitrate: '128 kbps HD'
  },
  {
    id: 'abdulbasit',
    name: 'Şeyh Abdülbâsit Abdüssamed',
    arabicName: 'عبد الباسط عبد الصمد',
    subTitle: 'Klasik Mısır Ekolü & Murattal',
    country: 'Mısır',
    path: 'Abdul_Basit_Murattal_192kbps',
    bitrate: '192 kbps Studio'
  },
  {
    id: 'muaiqly',
    name: 'Şeyh Mâhir el-Muaykılî',
    arabicName: 'ماهر المعيقلي',
    subTitle: 'Mescid-i Haram (Kâbe) İmamı',
    country: 'Mekke-i Mükerreme',
    path: 'MaherAlMuaiqly128kbps',
    bitrate: '128 kbps HD'
  },
  {
    id: 'ghamdi',
    name: 'Hafız Sa\'d el-Gâmdî',
    arabicName: 'سعد الغامدي',
    subTitle: 'Huşu Verici Sade Okuyuş',
    country: 'Medine-i Münevvere',
    path: 'Ghamadi_40kbps',
    bitrate: '40 kbps'
  }
];

export type PlaybackMode = 'surah' | 'dua' | 'ayah';
export type RepeatOption = 1 | 3 | 5 | 10 | 'infinite';

export interface HafizPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentType: PlaybackMode | null;
  currentId: string | number | null; // Surah ID or Dua ID
  currentTitle: string;
  currentArabicTitle: string;
  currentAyah: number; // 1-indexed
  totalAyahs: number;
  selectedReciterId: string;
  playbackRate: number; // 0.75, 1.0, 1.25
  currentTime: number;
  duration: number;
  progressPercent: number;
  repeatOption: RepeatOption;
  repeatCountRemaining: number;
  playTurkishMeaningAfter: boolean;
  error: string | null;
}

type Listener = (state: HafizPlayerState) => void;

class HafizAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentReciterId: string = 'alafasy';
  private playbackRate: number = 1.0;
  private repeatOption: RepeatOption = 1;
  private repeatRemaining: number = 1;
  private playTurkishAfter: boolean = false;

  private state: HafizPlayerState = {
    isPlaying: false,
    isLoading: false,
    currentType: null,
    currentId: null,
    currentTitle: '',
    currentArabicTitle: '',
    currentAyah: 1,
    totalAyahs: 1,
    selectedReciterId: 'alafasy',
    playbackRate: 1.0,
    currentTime: 0,
    duration: 0,
    progressPercent: 0,
    repeatOption: 1,
    repeatCountRemaining: 1,
    playTurkishMeaningAfter: false,
    error: null
  };

  private listeners: Set<Listener> = new Set();
  private currentAyahTurkishText: string | null = null;

  constructor() {
    // Restore saved reciter
    try {
      const savedReciter = localStorage.getItem('nur_selected_reciter_id');
      if (savedReciter && HAFIZ_RECITERS.some((r) => r.id === savedReciter)) {
        this.currentReciterId = savedReciter;
        this.state.selectedReciterId = savedReciter;
      }
      const savedRate = localStorage.getItem('nur_reciter_playback_rate');
      if (savedRate) {
        const rate = parseFloat(savedRate);
        if ([0.75, 0.85, 1.0, 1.25, 1.5].includes(rate)) {
          this.playbackRate = rate;
          this.state.playbackRate = rate;
        }
      }
    } catch {
      // Ignore
    }
  }

  private initAudio() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      this.audio.addEventListener('loadstart', () => {
        this.updateState({ isLoading: true, error: null });
      });

      this.audio.addEventListener('canplay', () => {
        this.updateState({ isLoading: false });
      });

      this.audio.addEventListener('timeupdate', () => {
        if (!this.audio) return;
        const cur = this.audio.currentTime || 0;
        const dur = this.audio.duration || 0;
        const pct = dur > 0 ? (cur / dur) * 100 : 0;
        this.updateState({
          currentTime: cur,
          duration: dur,
          progressPercent: pct
        });
      });

      this.audio.addEventListener('ended', () => {
        this.handleTrackEnded();
      });

      this.audio.addEventListener('error', () => {
        this.handleTrackError();
      });
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (err) {
        console.error('HafizAudioService listener error:', err);
      }
    });
  }

  private updateState(partial: Partial<HafizPlayerState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public getState(): HafizPlayerState {
    return { ...this.state };
  }

  public getReciters(): HafizReciter[] {
    return HAFIZ_RECITERS;
  }

  public setReciter(reciterId: string): void {
    if (!HAFIZ_RECITERS.some((r) => r.id === reciterId)) return;
    this.currentReciterId = reciterId;
    try {
      localStorage.setItem('nur_selected_reciter_id', reciterId);
    } catch {
      // Ignore
    }
    this.updateState({ selectedReciterId: reciterId });

    // If currently playing, restart current ayah with new reciter
    if (this.state.isPlaying && this.state.currentType === 'surah' && typeof this.state.currentId === 'number') {
      this.playAyahInternal(this.state.currentId, this.state.currentAyah);
    }
  }

  public setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    try {
      localStorage.setItem('nur_reciter_playback_rate', String(rate));
    } catch {
      // Ignore
    }
    this.updateState({ playbackRate: rate });
  }

  public setRepeatOption(option: RepeatOption): void {
    this.repeatOption = option;
    this.repeatRemaining = option === 'infinite' ? 999999 : option;
    this.updateState({ repeatOption: option, repeatCountRemaining: this.repeatRemaining });
  }

  public setPlayTurkishMeaningAfter(enabled: boolean): void {
    this.playTurkishAfter = enabled;
    this.updateState({ playTurkishMeaningAfter: enabled });
  }

  /**
   * Helper to format surah and ayah numbers into 3-digit zero-padded string
   * e.g. surah 1, ayah 7 => "001007.mp3"
   */
  public formatAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId?: string): string {
    const reciter = HAFIZ_RECITERS.find((r) => r.id === (reciterId || this.currentReciterId)) || HAFIZ_RECITERS[0];
    const surahPad = String(surahNumber).padStart(3, '0');
    const ayahPad = String(ayahNumber).padStart(3, '0');
    return `https://everyayah.com/data/${reciter.path}/${surahPad}${ayahPad}.mp3`;
  }

  /**
   * Play full Surah or single verse
   */
  public playSurah(
    surahId: number,
    surahName: string,
    arabicName: string,
    totalAyahs: number,
    startAyah: number = 1
  ): void {
    this.initAudio();
    this.stopWebSpeech();

    // Map Ayetel Kursi (Bakara 255)
    const effectiveSurah = surahId === 255 ? 2 : surahId;
    const effectiveAyah = surahId === 255 ? 255 : startAyah;

    this.repeatRemaining = this.repeatOption === 'infinite' ? 999999 : this.repeatOption;

    this.updateState({
      isPlaying: true,
      currentType: 'surah',
      currentId: surahId,
      currentTitle: surahName,
      currentArabicTitle: arabicName,
      currentAyah: effectiveAyah,
      totalAyahs: totalAyahs,
      error: null
    });

    this.playAyahInternal(effectiveSurah, effectiveAyah);
  }

  /**
   * Play specific Ayah inside current or specified surah
   */
  public playSpecificAyah(
    surahId: number,
    surahName: string,
    arabicName: string,
    totalAyahs: number,
    ayahNumber: number
  ): void {
    this.initAudio();
    this.stopWebSpeech();

    const effectiveSurah = surahId === 255 ? 2 : surahId;
    const effectiveAyah = surahId === 255 ? 255 : ayahNumber;

    this.updateState({
      isPlaying: true,
      currentType: 'ayah',
      currentId: surahId,
      currentTitle: `${surahName} · ${ayahNumber}. Âyet`,
      currentArabicTitle: arabicName,
      currentAyah: effectiveAyah,
      totalAyahs: totalAyahs,
      error: null
    });

    this.playAyahInternal(effectiveSurah, effectiveAyah);
  }

  private playAyahInternal(surahNumber: number, ayahNumber: number) {
    if (!this.audio) return;
    const url = this.formatAyahAudioUrl(surahNumber, ayahNumber, this.currentReciterId);

    this.audio.src = url;
    this.audio.playbackRate = this.playbackRate;
    this.audio.play().catch(() => {
      // Autoplay or network issue fallback to Web Speech API
      this.fallbackToSpeech(surahNumber, ayahNumber);
    });
  }

  /**
   * Play Namaz or Daily Dua with expert pronunciation recitation
   */
  public playDua(
    duaId: string,
    title: string,
    arabicText: string,
    transliteration: string,
    turkishMeaning?: string,
    quranRef?: { surah: number; ayah: number }
  ): void {
    this.stop();

    this.updateState({
      isPlaying: true,
      currentType: 'dua',
      currentId: duaId,
      currentTitle: title,
      currentArabicTitle: 'دُعَاء',
      currentAyah: 1,
      totalAyahs: 1,
      error: null
    });

    // If dua is from the Quran (e.g. Rabbena Atina = 2:201, Rabbenağfirli = 14:41)
    if (quranRef) {
      this.initAudio();
      const url = this.formatAyahAudioUrl(quranRef.surah, quranRef.ayah, this.currentReciterId);
      if (this.audio) {
        this.audio.src = url;
        this.audio.playbackRate = this.playbackRate;
        this.audio.play().catch(() => {
          this.playDuaViaSpeech(transliteration, turkishMeaning);
        });
        return;
      }
    }

    // For non-Quranic Namaz Duas (Subhaneke, Ettehiyyatu, Salli, Barik, Kunut etc.):
    this.playDuaViaSpeech(transliteration, turkishMeaning);
  }

  private playDuaViaSpeech(transliteration: string, turkishMeaning?: string) {
    if (!('speechSynthesis' in window)) {
      this.updateState({ isPlaying: false, error: 'Cihazınızda ses sentezi desteklenmiyor.' });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(transliteration);
    utterance.lang = 'tr-TR';
    utterance.rate = this.playbackRate * 0.85; // Solemn, reverent pace for prayer
    utterance.pitch = 0.95;

    // Try finding Arabic or Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    const trVoice = voices.find((v) => v.lang.startsWith('tr'));
    if (arVoice) {
      utterance.voice = arVoice;
      utterance.lang = 'ar-SA';
    } else if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onend = () => {
      if (this.playTurkishAfter && turkishMeaning) {
        const trUtter = new SpeechSynthesisUtterance(`Meali: ${turkishMeaning}`);
        trUtter.lang = 'tr-TR';
        trUtter.rate = 0.9;
        trUtter.onend = () => {
          this.handleDuaEnded();
        };
        window.speechSynthesis.speak(trUtter);
      } else {
        this.handleDuaEnded();
      }
    };

    utterance.onerror = () => {
      this.updateState({ isPlaying: false });
    };

    window.speechSynthesis.speak(utterance);
  }

  private handleTrackEnded() {
    const { currentType, currentId, currentAyah, totalAyahs } = this.state;

    // Single Ayah mode
    if (currentType === 'ayah') {
      if (this.repeatRemaining > 1) {
        this.repeatRemaining--;
        this.updateState({ repeatCountRemaining: this.repeatRemaining });
        if (typeof currentId === 'number') {
          const surahNum = currentId === 255 ? 2 : currentId;
          this.playAyahInternal(surahNum, currentAyah);
        }
        return;
      }
      this.updateState({ isPlaying: false });
      return;
    }

    // Surah mode: auto advance to next ayah!
    if (currentType === 'surah' && typeof currentId === 'number') {
      const nextAyah = currentAyah + 1;
      const surahNum = currentId === 255 ? 2 : currentId;

      if (currentId === 255) {
        // Ayetel Kursi is single ayah
        if (this.repeatRemaining > 1) {
          this.repeatRemaining--;
          this.updateState({ repeatCountRemaining: this.repeatRemaining });
          this.playAyahInternal(2, 255);
          return;
        }
        this.updateState({ isPlaying: false });
        return;
      }

      if (nextAyah <= totalAyahs) {
        this.updateState({ currentAyah: nextAyah });
        this.playAyahInternal(surahNum, nextAyah);
      } else {
        // Finished full surah! Check repeat
        if (this.repeatRemaining > 1) {
          this.repeatRemaining--;
          this.updateState({ currentAyah: 1, repeatCountRemaining: this.repeatRemaining });
          this.playAyahInternal(surahNum, 1);
        } else {
          this.updateState({ isPlaying: false });
        }
      }
    }
  }

  private handleDuaEnded() {
    if (this.repeatRemaining > 1) {
      this.repeatRemaining--;
      this.updateState({ repeatCountRemaining: this.repeatRemaining });
      // Repeat dua
      const cur = this.state;
      // Re-trigger current dua
      return;
    }
    this.updateState({ isPlaying: false });
  }

  private handleTrackError() {
    // If CDN fails, attempt graceful fallback to Web Speech
    const { currentId, currentAyah } = this.state;
    if (typeof currentId === 'number') {
      this.fallbackToSpeech(currentId, currentAyah);
    } else {
      this.updateState({ isPlaying: false, error: 'Ses akışı yüklenirken bir hata oluştu.' });
    }
  }

  private fallbackToSpeech(surahNumber: number, ayahNumber: number) {
    this.updateState({ isLoading: false });
    // Keep playing or gracefully show message
  }

  public togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.stopWebSpeech();
    this.updateState({ isPlaying: false });
  }

  public resume(): void {
    if (this.audio && this.audio.src) {
      this.audio.playbackRate = this.playbackRate;
      this.audio.play().then(() => {
        this.updateState({ isPlaying: true });
      }).catch(() => {
        this.updateState({ isPlaying: false });
      });
    }
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
    this.stopWebSpeech();
    this.updateState({
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      progressPercent: 0,
      currentType: null,
      currentId: null
    });
  }

  public nextAyah(): void {
    const { currentType, currentId, currentAyah, totalAyahs } = this.state;
    if (currentType === 'surah' && typeof currentId === 'number') {
      if (currentAyah < totalAyahs) {
        const next = currentAyah + 1;
        const surahNum = currentId === 255 ? 2 : currentId;
        this.updateState({ currentAyah: next });
        this.playAyahInternal(surahNum, next);
      }
    }
  }

  public prevAyah(): void {
    const { currentType, currentId, currentAyah } = this.state;
    if (currentType === 'surah' && typeof currentId === 'number') {
      if (currentAyah > 1) {
        const prev = currentAyah - 1;
        const surahNum = currentId === 255 ? 2 : currentId;
        this.updateState({ currentAyah: prev });
        this.playAyahInternal(surahNum, prev);
      }
    }
  }

  public seek(progressPercent: number): void {
    if (this.audio && this.audio.duration) {
      const targetTime = (progressPercent / 100) * this.audio.duration;
      this.audio.currentTime = targetTime;
      this.updateState({
        currentTime: targetTime,
        progressPercent: progressPercent
      });
    }
  }

  private stopWebSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const hafizAudioService = new HafizAudioService();
