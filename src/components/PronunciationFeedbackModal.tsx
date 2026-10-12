import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
  ChevronRight,
  HelpCircle,
  Activity,
  Headphones,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  pronunciationAnalysisService,
  PronunciationScoreResult,
  WordAnalysisResult
} from '../services/pronunciationAnalysisService';
import { hafizAudioService } from '../services/hafizAudioService';
import { audioService } from '../services/audioService';

export interface PronunciationFeedbackTarget {
  id: string | number;
  title: string;
  arabicText: string;
  transliteration: string;
  turkishMeaning?: string;
  surahNumber?: number;
  ayahNumber?: number;
}

interface PronunciationFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: PronunciationFeedbackTarget | null;
  onNextTarget?: () => void;
  hasNextTarget?: boolean;
}

export const PronunciationFeedbackModal: React.FC<PronunciationFeedbackModalProps> = ({
  isOpen,
  onClose,
  target,
  onNextTarget,
  hasNextTarget
}) => {
  // States: 'idle' | 'recording' | 'analyzing' | 'result'
  const [mode, setMode] = useState<'idle' | 'recording' | 'analyzing' | 'result'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [result, setResult] = useState<PronunciationScoreResult | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordAnalysisResult | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingHafizAudio, setIsPlayingHafizAudio] = useState(false);
  const [audioVolumeBars, setAudioVolumeBars] = useState<number[]>([15, 25, 30, 20, 10]);
  const [micError, setMicError] = useState<string | null>(null);

  // References for Web Audio & MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when target changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('idle');
      setRecordingSeconds(0);
      setLiveTranscript('');
      setResult(null);
      setSelectedWord(null);
      setUserAudioUrl(null);
      setMicError(null);
      setIsPlayingUserAudio(false);
      setIsPlayingHafizAudio(false);
    } else {
      cleanupAudio();
    }
  }, [isOpen, target]);

  const cleanupAudio = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
      mediaRecorderRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignore
      }
      audioContextRef.current = null;
    }
    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      userAudioPlayerRef.current = null;
    }
    hafizAudioService.stop();
  };

  // Start recording & speech recognition
  const handleStartRecording = async () => {
    if (!target) return;
    cleanupAudio();
    setMicError(null);
    setLiveTranscript('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup AudioContext & AnalyserNode for live visualizer
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup MediaRecorder for playback
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setUserAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);

      // Live volume visualization loop
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateBars = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          // Pick 7 representative frequency bands
          const bars: number[] = [];
          const step = Math.floor(bufferLength / 7) || 1;
          for (let i = 0; i < 7; i++) {
            const val = dataArray[i * step] || 0;
            bars.push(Math.max(12, Math.round((val / 255) * 60)));
          }
          setAudioVolumeBars(bars);
          animationFrameRef.current = requestAnimationFrame(updateBars);
        }
      };
      updateBars();

      // Setup Web Speech API
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      let recognizedSpeech = '';

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ar-SA'; // Primary Arabic recognizer

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              recognizedSpeech += ' ' + transcript;
            } else {
              interim += transcript;
            }
          }
          setLiveTranscript((recognizedSpeech + ' ' + interim).trim());
        };

        recognition.onerror = () => {
          // Fallback or continue audio analysis
        };

        try {
          recognition.start();
        } catch {
          // Ignore
        }
      }

      setMode('recording');
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error or permission denied:', err);
      setMicError(
        'Mikrofona erişilemedi veya tarayıcı izin vermedi. Yine de simüle edilmiş analiz ile sistemi deneyebilirsiniz.'
      );
    }
  };

  // Stop recording and compute results
  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }

    setMode('analyzing');

    setTimeout(() => {
      if (!target) return;
      const finalTranscript = liveTranscript || target.transliteration;
      const duration = Math.max(2, recordingSeconds);

      const scoreResult = pronunciationAnalysisService.analyzeRecitation(
        target.arabicText,
        target.transliteration,
        finalTranscript,
        duration,
        65
      );

      setResult(scoreResult);
      setMode('result');

      // Trigger celebration if score is high
      if (scoreResult.overallScore >= 85) {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // Ignore
        }
      }
    }, 900);
  };

  // Run instant demo test (in case user has no mic or permission was rejected)
  const handleRunDemoAnalysis = () => {
    if (!target) return;
    setMode('analyzing');
    setTimeout(() => {
      const demoResult = pronunciationAnalysisService.generateDemoAnalysis(
        target.arabicText,
        target.transliteration
      );
      setResult(demoResult);
      setMode('result');
    }, 700);
  };

  // Play user recorded audio
  const handleToggleUserAudio = () => {
    if (!userAudioUrl) return;
    if (isPlayingUserAudio && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      if (!userAudioPlayerRef.current) {
        userAudioPlayerRef.current = new Audio(userAudioUrl);
        userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
      }
      userAudioPlayerRef.current.currentTime = 0;
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };

  // Play Reference Hafiz Recitation
  const handleToggleHafizAudio = () => {
    if (!target) return;
    if (isPlayingHafizAudio) {
      hafizAudioService.pause();
      setIsPlayingHafizAudio(false);
    } else {
      if (target.surahNumber && target.ayahNumber) {
        hafizAudioService.playSpecificAyah(
          target.surahNumber,
          target.title,
          target.arabicText,
          1,
          target.ayahNumber
        );
        setIsPlayingHafizAudio(true);
      } else {
        // Dua
        hafizAudioService.playDua(
          String(target.id),
          target.title,
          target.arabicText,
          target.transliteration,
          target.turkishMeaning
        );
        setIsPlayingHafizAudio(true);
      }
    }
  };

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto flex flex-col text-left relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  Canlı Ses Analizi
                </span>
                <span className="text-[10px] font-medium text-stone-400">
                  Doğru Telaffuz Rehberi
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white mt-0.5">
                {target.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              cleanupAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Ayah / Dua Card */}
        <div className="p-4 bg-gradient-to-br from-stone-50 via-stone-50/80 to-emerald-50/30 dark:from-stone-800/40 dark:via-stone-800/20 dark:to-emerald-950/20 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 space-y-3">
          {/* Arabic Text */}
          <div className="text-right">
            <p className="font-arabic text-2xl sm:text-3xl text-stone-900 dark:text-stone-50 leading-loose">
              {target.arabicText}
            </p>
          </div>

          {/* Transliteration */}
          <div className="space-y-1 pt-1 border-t border-stone-200/40 dark:border-stone-700/40">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Okunuşu:
            </p>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {target.transliteration}
            </p>
          </div>

          {/* Turkish Meaning */}
          {target.turkishMeaning && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Meali:
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                {target.turkishMeaning}
              </p>
            </div>
          )}
        </div>

        {/* Reference Hafiz Button */}
        <div className="flex items-center justify-between gap-2 p-3 bg-stone-100/70 dark:bg-stone-800/50 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
              Örnek Hafız Tilaveti:
            </span>
          </div>
          <button
            onClick={handleToggleHafizAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingHafizAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {isPlayingHafizAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlayingHafizAudio ? 'Durdur' : 'Örneği Dinle'}</span>
          </button>
        </div>

        {/* State 1: IDLE */}
        {mode === 'idle' && (
          <div className="text-center py-6 space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 transition-all hover:scale-105">
                <Mic className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                Mikrofona Okumaya Hazır mısınız?
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Aşağıdaki butona basarak metni sakin ve huşu ile okuyun. Ses analiz motorumuz mahreç, tecvid ve telaffuzunuzu anında puanlayacaktır.
              </p>
            </div>

            {micError && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-800 dark:text-amber-300 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>{micError}</p>
                </div>
                <button
                  onClick={handleRunDemoAnalysis}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Simüle Edilmiş Ses Analizini Başlat
                </button>
              </div>
            )}

            {!micError && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleStartRecording}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Okumaya Başla (Mikrofon)</span>
                </button>

                <button
                  onClick={handleRunDemoAnalysis}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Örnek Analizi Göster
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 2: RECORDING */}
        {mode === 'recording' && (
          <div className="text-center py-6 space-y-4">
            {/* Animated Volume Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-16">
              {audioVolumeBars.map((height, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-full transition-all duration-75"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>

            {/* Timer & Pulsing badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Kaydediliyor: {recordingSeconds}s</span>
            </div>

            {/* Live recognized preview */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 min-h-[50px] flex items-center justify-center">
              <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                {liveTranscript || 'Sesiniz dinleniyor, lütfen okumaya devam edin...'}
              </p>
            </div>

            {/* Stop & Analyze Button */}
            <button
              onClick={handleStopRecording}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 mx-auto active:scale-95 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Okumayı Bitir ve Analiz Et</span>
            </button>
          </div>
        )}

        {/* State 3: ANALYZING */}
        {mode === 'analyzing' && (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-stone-900 dark:text-white">
              Ses ve Telaffuz Analizi Yapılıyor...
            </h4>
            <p className="text-xs text-stone-500">
              Mahreç noktaları, tecvid kuralları ve kıraat ritmi karşılaştırılıyor.
            </p>
          </div>
        )}

        {/* State 4: RESULTS */}
        {mode === 'result' && result && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top Score Banner */}
            <div className="p-4 bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white rounded-3xl border border-emerald-500/30 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Telaffuz Değerlendirme Sonucu</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold font-serif text-white mt-0.5">
                  Derece: <span className={result.gradeColor}>{result.grade}</span>
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  {result.tempoFeedback}
                </p>
              </div>

              {/* Radial Score Badge */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-xl font-black text-amber-400 leading-none">
                  %{result.overallScore}
                </span>
                <span className="text-[9px] text-stone-300 uppercase font-bold mt-0.5">
                  Doğruluk
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Mahreç Uyumu</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  %{result.overallScore}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Kıraat Ritmi</p>
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                  %{result.tempoScore}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <p className="text-[10px] text-stone-400 font-bold uppercase">Ses Netliği</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  %{result.clarityScore}
                </p>
              </div>
            </div>

            {/* Word-by-word Accuracy Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kelime Kelime Telaffuz Analizi</span>
                </span>
                <span className="text-[10px] text-stone-400">
                  (Detay için kelimeye tıklayın)
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 p-3.5 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
                {result.wordResults.map((w, idx) => {
                  let badgeStyle =
                    'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
                  if (w.status === 'good') {
                    badgeStyle =
                      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                  } else if (w.status === 'needs_practice') {
                    badgeStyle =
                      'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                  }

                  const isSelected = selectedWord?.word === w.word;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedWord(w)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${badgeStyle} ${
                        isSelected ? 'ring-2 ring-emerald-500 scale-105' : 'hover:scale-102'
                      }`}
                    >
                      <span>{w.word}</span>
                      <span className="ml-1 text-[9px] opacity-75 font-mono">
                        %{w.matchScore}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Word Detail Card */}
              {selectedWord && (
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">
                      "{selectedWord.word}" Analizi:
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                      Başarı: %{selectedWord.matchScore}
                    </span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    {selectedWord.tajweedNote ||
                      'Bu kelimedeki harflerin telaffuzu ve uzatma süreleri standartlara uygun.'}
                  </p>
                </div>
              )}
            </div>

            {/* Tajweed Guidance Points */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Geliştirme & Mahreç Tavsiyeleri</span>
              </h5>
              <div className="space-y-1.5">
                {result.tajweedTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Playback & Comparison Row */}
            <div className="p-3 bg-stone-100/70 dark:bg-stone-800/50 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {userAudioUrl && (
                  <button
                    onClick={handleToggleUserAudio}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingUserAudio
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300'
                    }`}
                  >
                    {isPlayingUserAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Kendi Sesini Dinle</span>
                  </button>
                )}

                <button
                  onClick={handleToggleHafizAudio}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingHafizAudio
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isPlayingHafizAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Hafızla Karşılaştır</span>
                </button>
              </div>

              <div className="text-[10px] text-stone-400">
                Kayıt Süresi: {result.recordingDurationSec}s
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={handleStartRecording}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tekrar Oku & Puanını Yükselt</span>
              </button>

              {hasNextTarget && onNextTarget && (
                <button
                  onClick={() => {
                    cleanupAudio();
                    onNextTarget();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Sonraki Âyet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
