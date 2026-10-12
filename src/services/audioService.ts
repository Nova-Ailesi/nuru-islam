/**
 * Audio and Speech Synthesis Service
 * Provides realistic prayer recitation, gentle dhikr haptic click, and notification chimes
 */

class AudioService {
  private audioCtx: AudioContext | null = null;
  private isSpeaking: boolean = false;
  private isMuted: boolean = false;
  private reverbNode: ConvolverNode | null = null;
  private isMosqueAcoustic: boolean = true;

  public setMosqueAcoustic(enabled: boolean): void {
    this.isMosqueAcoustic = enabled;
  }

  public getMosqueAcoustic(): boolean {
    return this.isMosqueAcoustic;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeaking();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Recites prayer / surah text using Web Speech API
   */
  public speak(
    text: string,
    lang: string = 'tr-TR',
    onEnd?: () => void,
    onError?: () => void,
    customRate: number = 0.88
  ): void {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    if (!('speechSynthesis' in window)) {
      if (onError) onError();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = customRate; // Customizable solemn prayer cadence
    utterance.pitch = 0.98;

    // Try finding best voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onError) onError();
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Generates a realistic wooden Tasbih bead click sound
   */
  public playTasbihClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Gentle spiritual tone for prayer step / movement transition
   */
  public playStepTransitionSound(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignore
    }
  }

  /**
   * Serene double chime sound for adhan notification / milestone completion
   */
  public playAdhanChime(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Note 1: E4 (329.63Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.3);

      // Note 2: B4 (493.88Hz) slightly delayed
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(493.88, now + 0.3);
      gain2.gain.setValueAtTime(0, now + 0.3);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.3);
      osc2.stop(now + 1.9);
    } catch {
      // Ignore
    }
  }

  /**
   * Plays a modal melodic phrase for Turkish Adhan makams
   */
  public playMakamMelody(baseFreq: number): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // 4-note melodic cadence
      const notes = [
        { freq: baseFreq, start: 0, dur: 0.5 },
        { freq: baseFreq * 1.125, start: 0.45, dur: 0.5 },
        { freq: baseFreq * 1.25, start: 0.9, dur: 0.6 },
        { freq: baseFreq, start: 1.45, dur: 1.2 }
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.25, now + n.start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur + 0.05);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Synthesizes an acoustic Grand Ottoman Dome impulse response (3.2 seconds decay)
   */
  private getDomeReverbNode(ctx: AudioContext): ConvolverNode {
    if (!this.reverbNode) {
      this.reverbNode = ctx.createConvolver();
      const sampleRate = ctx.sampleRate;
      const length = Math.floor(sampleRate * 3.0);
      const impulse = ctx.createBuffer(2, length, sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const decay = Math.exp(-t * 2.2);
        const noiseL = (Math.random() * 2 - 1) * decay;
        const noiseR = (Math.random() * 2 - 1) * decay;
        left[i] = noiseL * (1 - t / 3.0);
        right[i] = noiseR * (1 - t / 3.0);
      }
      this.reverbNode.buffer = impulse;
    }
    return this.reverbNode;
  }

  /**
   * Generates a deep, solemn Imam acoustic vocal resonance + congregation response
   * Simulates the majestic atmosphere of a grand mosque dome (Süleymaniye / Sultanahmet)
   */
  public playMosqueTakbir(type: 'allahu_ekber' | 'semiallahu' | 'rabbenal_hamd' | 'amin' | 'selam'): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const reverb = this.getDomeReverbNode(ctx);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, now);

      masterGain.connect(ctx.destination);
      if (this.isMosqueAcoustic) {
        const reverbGain = ctx.createGain();
        reverbGain.gain.setValueAtTime(0.5, now);
        masterGain.connect(reverb);
        reverb.connect(reverbGain);
        reverbGain.connect(ctx.destination);
      }

      if (type === 'allahu_ekber') {
        // Deep Imam Takbir chord: Root A2 (110Hz) -> E3 (164.8Hz) -> A3 (220Hz)
        const notes = [
          { freq: 110, start: 0, dur: 0.65, endFreq: 115 },
          { freq: 164.8, start: 0.5, dur: 1.15, endFreq: 146.8 },
          { freq: 220, start: 0.52, dur: 1.05, endFreq: 215 }
        ];

        notes.forEach((n) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.freq, now + n.start);
          osc.frequency.exponentialRampToValueAtTime(n.endFreq, now + n.start + n.dur);

          g.gain.setValueAtTime(0, now + n.start);
          g.gain.linearRampToValueAtTime(0.32, now + n.start + 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + n.start);
          osc.stop(now + n.start + n.dur + 0.1);
        });
      } else if (type === 'semiallahu') {
        // "Semiallâhu Limen Hamideh" melodic phrase
        const tones = [
          { freq: 130.8, start: 0, dur: 0.4 },
          { freq: 164.8, start: 0.35, dur: 0.45 },
          { freq: 196.0, start: 0.75, dur: 0.6 },
          { freq: 146.8, start: 1.3, dur: 0.9 }
        ];
        tones.forEach((t) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(t.freq, now + t.start);
          g.gain.setValueAtTime(0, now + t.start);
          g.gain.linearRampToValueAtTime(0.28, now + t.start + 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + t.start);
          osc.stop(now + t.start + t.dur + 0.1);
        });
      } else if (type === 'rabbenal_hamd') {
        // Congregation response "Rabbenâ lekel hamd"
        const tones = [
          { freq: 146.8, start: 0, dur: 0.5 },
          { freq: 164.8, start: 0.45, dur: 0.5 },
          { freq: 130.8, start: 0.9, dur: 0.9 }
        ];
        tones.forEach((t) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(t.freq, now + t.start);
          g.gain.setValueAtTime(0, now + t.start);
          g.gain.linearRampToValueAtTime(0.2, now + t.start + 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + t.start);
          osc.stop(now + t.start + t.dur + 0.1);
        });
      } else if (type === 'amin') {
        // Soft collective congregation whispered Âmîn resonance
        const f = 164.8; // E3
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.95, now + 1.8);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.3);
        g.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.3);
      } else if (type === 'selam') {
        // Selam cadence
        const cadence = [
          { freq: 196, start: 0, dur: 0.6 },
          { freq: 164.8, start: 0.55, dur: 0.8 },
          { freq: 130.8, start: 1.3, dur: 1.1 }
        ];
        cadence.forEach((c) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(c.freq, now + c.start);
          g.gain.setValueAtTime(0, now + c.start);
          g.gain.linearRampToValueAtTime(0.25, now + c.start + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + c.start + c.dur);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + c.start);
          osc.stop(now + c.start + c.dur + 0.1);
        });
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Request notification permission and schedule/send notification
   */
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') {
      return true;
    }
    const res = await Notification.requestPermission();
    return res === 'granted';
  }

  public sendNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      } catch {
        // Notification could fail inside some iframes
      }
    }
  }
}

export const audioService = new AudioService();
