import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  X,
  Gauge,
  Repeat,
  Sparkles,
  Users,
  Check,
  ChevronUp,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import {
  hafizAudioService,
  HafizPlayerState,
  HAFIZ_RECITERS,
  RepeatOption
} from '../services/hafizAudioService';

interface HafizAudioPlayerBarProps {
  onOpenSurahView?: () => void;
}

export const HafizAudioPlayerBar: React.FC<HafizAudioPlayerBarProps> = ({
  onOpenSurahView
}) => {
  const [playerState, setPlayerState] = useState<HafizPlayerState>(() =>
    hafizAudioService.getState()
  );
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const unsub = hafizAudioService.subscribe((state) => {
      setPlayerState(state);
    });
    return unsub;
  }, []);

  // If nothing is playing and no track is active, don't show floating bar
  if (!playerState.currentType && !playerState.isPlaying) {
    return null;
  }

  const currentReciter =
    HAFIZ_RECITERS.find((r) => r.id === playerState.selectedReciterId) ||
    HAFIZ_RECITERS[0];

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speedOptions = [0.75, 0.85, 1.0, 1.25, 1.5];
  const repeatOptions: RepeatOption[] = [1, 3, 5, 'infinite'];

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 px-3 sm:px-6 max-w-2xl mx-auto pointer-events-none">
        <div className="pointer-events-auto bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-xl border border-emerald-500/30 text-white rounded-3xl shadow-2xl shadow-emerald-950/50 overflow-hidden transition-all duration-300">
          {/* Top Progress Line */}
          <div
            className="w-full bg-stone-800 h-1.5 cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              hafizAudioService.seek(pct);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-150 relative"
              style={{ width: `${playerState.progressPercent || 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Info */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 min-w-0 cursor-pointer flex-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shrink-0 shadow-inner border border-emerald-400/30">
                <Volume2 className={`w-5 h-5 text-emerald-200 ${playerState.isPlaying ? 'animate-pulse' : ''}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold truncate text-white">
                    {playerState.currentTitle || 'Tilavet'}
                  </h4>
                  {playerState.currentType === 'surah' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {playerState.currentAyah}. Âyet / {playerState.totalAyahs}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="text-amber-400/90 font-medium">
                    {currentReciter.name}
                  </span>
                  <span>·</span>
                  <span>
                    {formatSeconds(playerState.currentTime)} / {formatSeconds(playerState.duration)}
                  </span>
                </p>
              </div>
            </div>

            {/* Center: Playback Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {playerState.currentType === 'surah' && (
                <button
                  onClick={() => hafizAudioService.prevAyah()}
                  disabled={playerState.currentAyah <= 1}
                  className="p-2 text-stone-400 hover:text-white disabled:opacity-30 disabled:hover:text-stone-400 transition-colors cursor-pointer"
                  title="Önceki Âyet"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => hafizAudioService.togglePlay()}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
                title={playerState.isPlaying ? 'Duraklat' : 'Oynat'}
              >
                {playerState.isLoading ? (
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                ) : playerState.isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {playerState.currentType === 'surah' && (
                <button
                  onClick={() => hafizAudioService.nextAyah()}
                  disabled={playerState.currentAyah >= playerState.totalAyahs}
                  className="p-2 text-stone-400 hover:text-white disabled:opacity-30 disabled:hover:text-stone-400 transition-colors cursor-pointer"
                  title="Sonraki Âyet"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {/* Reciter & Settings Button */}
              <button
                onClick={() => setShowReciterModal(true)}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Hafız Değiştir"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px] font-semibold">
                  Hafız
                </span>
              </button>

              {/* Close Button */}
              <button
                onClick={() => hafizAudioService.stop()}
                className="p-2 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-bar: Speed, Repeat, and Learning Mode (collapsible) */}
          {isExpanded && (
            <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-stone-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
              {/* Playback Speed selector */}
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] text-stone-400 font-medium">Hız:</span>
                <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5">
                  {speedOptions.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => hafizAudioService.setPlaybackRate(rate)}
                      className={`px-1.5 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                        playerState.playbackRate === rate
                          ? 'bg-emerald-500 text-stone-950 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                      title={rate === 0.75 ? 'Yavaş (Mahreç Öğrenme Modu)' : `${rate}x Hız`}
                    >
                      {rate === 0.75 ? '0.75x (Yavaş)' : `${rate}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repeat / Memorization selector */}
              <div className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="text-[10px] text-stone-400 font-medium">Ezber Tekrarı:</span>
                <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5">
                  {repeatOptions.map((rep) => (
                    <button
                      key={String(rep)}
                      onClick={() => hafizAudioService.setRepeatOption(rep)}
                      className={`px-1.5 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                        playerState.repeatOption === rep
                          ? 'bg-teal-500 text-stone-950 shadow-xs'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                      title={rep === 'infinite' ? 'Sonsuz Döngü' : `${rep} Defa Tekrarla`}
                    >
                      {rep === 'infinite' ? '∞' : `${rep}x`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reciter Selector Modal */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Hafız ve Kâri Seçimi
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Kur'an-ı Kerim tilavetini dinlemek istediğiniz uzman hafızı seçin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReciterModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {HAFIZ_RECITERS.map((reciter) => {
                const isSelected = playerState.selectedReciterId === reciter.id;
                return (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      hafizAudioService.setReciter(reciter.id);
                      setShowReciterModal(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-stone-900 dark:text-white shadow-xs'
                        : 'border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-white">
                          {reciter.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium">
                          {reciter.bitrate}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {reciter.subTitle} · {reciter.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-arabic text-sm text-emerald-700 dark:text-emerald-400">
                        {reciter.arabicName}
                      </span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>
                Tüm tilavetler dünya standartlarında yüksek kaliteli stüdyo kayıtlarından ve EveryAyah CDN üzerinden kesintisiz yayınlanmaktadır.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
