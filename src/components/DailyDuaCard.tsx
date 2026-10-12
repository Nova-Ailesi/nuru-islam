import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookmarkPlus,
  Eye,
  EyeOff,
  Info,
  ExternalLink,
  MessageCircle,
  Send,
  X,
  Palette,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QURAN_DUAS_LIST, DAILY_VERSES_LIST, QuranDuaItem, DailyVerseItem } from '../data/dailyQuranDuas';
import { audioService } from '../services/audioService';
import { hafizAudioService } from '../services/hafizAudioService';
import { DuaCardStudioModal } from './DuaCardStudioModal';
import { UserCustomDua } from '../types';

interface DailyDuaCardProps {
  className?: string;
  onOpenDuaBook?: () => void;
}

export const DailyDuaCard: React.FC<DailyDuaCardProps> = ({
  className = "",
  onOpenDuaBook
}) => {
  // Mode: 'dua' (Kur'an Duası) or 'verse' (Kur'an Âyeti)
  const [activeTab, setActiveTab] = useState<'dua' | 'verse'>('dua');

  // Automatic Day-based starting index
  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const [duaIndex, setDuaIndex] = useState<number>(() => {
    return dayOfYear % QURAN_DUAS_LIST.length;
  });

  const [verseIndex, setVerseIndex] = useState<number>(() => {
    return dayOfYear % DAILY_VERSES_LIST.length;
  });

  // UI state
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showVirtue, setShowVirtue] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [addedToDuaBook, setAddedToDuaBook] = useState(false);
  const [studioDua, setStudioDua] = useState<UserCustomDua | null>(null);

  // Amin counter for this dua
  const currentDua: QuranDuaItem = QURAN_DUAS_LIST[duaIndex] || QURAN_DUAS_LIST[0];
  const currentVerse: DailyVerseItem = DAILY_VERSES_LIST[verseIndex] || DAILY_VERSES_LIST[0];

  const [aminCounts, setAminCounts] = useState<{ [id: string]: number }>(() => {
    // Tek kaynak: user_duas_amin_counts (PersonalDuaBookView ile paylaşımlı)
    const saved = localStorage.getItem('user_duas_amin_counts');
    return saved ? JSON.parse(saved) : {};
  });

  const currentAminCount = aminCounts[currentDua.id] || 0;

  // Handle Amin button click
  const handleAmin = () => {
    const updated = {
      ...aminCounts,
      [currentDua.id]: (aminCounts[currentDua.id] || 0) + 1
    };
    setAminCounts(updated);
    localStorage.setItem('user_duas_amin_counts', JSON.stringify(updated));

    audioService.playTasbihClick();

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }
  };

  // Rotation Navigation
  const handlePrev = () => {
    if (activeTab === 'dua') {
      setDuaIndex((prev) => (prev - 1 + QURAN_DUAS_LIST.length) % QURAN_DUAS_LIST.length);
    } else {
      setVerseIndex((prev) => (prev - 1 + DAILY_VERSES_LIST.length) % DAILY_VERSES_LIST.length);
    }
    stopAudio();
    setAddedToDuaBook(false);
  };

  const handleNext = () => {
    if (activeTab === 'dua') {
      setDuaIndex((prev) => (prev + 1) % QURAN_DUAS_LIST.length);
    } else {
      setVerseIndex((prev) => (prev + 1) % DAILY_VERSES_LIST.length);
    }
    stopAudio();
    setAddedToDuaBook(false);
  };

  const handleShuffle = () => {
    if (activeTab === 'dua') {
      let rand = Math.floor(Math.random() * QURAN_DUAS_LIST.length);
      if (rand === duaIndex) rand = (rand + 1) % QURAN_DUAS_LIST.length;
      setDuaIndex(rand);
    } else {
      let rand = Math.floor(Math.random() * DAILY_VERSES_LIST.length);
      if (rand === verseIndex) rand = (rand + 1) % DAILY_VERSES_LIST.length;
      setVerseIndex(rand);
    }
    stopAudio();
    setAddedToDuaBook(false);
  };

  useEffect(() => {
    const unsub = hafizAudioService.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
    return unsub;
  }, []);

  // Stop audio if switching
  const stopAudio = () => {
    hafizAudioService.stop();
    audioService.stopSpeaking();
    setIsPlayingAudio(false);
  };

  // Authentic Hafiz audio recitation
  const toggleAudio = () => {
    if (isPlayingAudio) {
      hafizAudioService.pause();
      return;
    }

    const surahNum = activeTab === 'dua' ? currentDua.surahNumber : currentVerse.surahNumber;
    const ayahNum = activeTab === 'dua' ? parseInt(currentDua.ayahNumber, 10) : parseInt(currentVerse.ayahNumber, 10);
    const title = activeTab === 'dua' ? currentDua.title : `${currentVerse.surahName} ${currentVerse.ayahNumber}. Âyet`;
    const arabicTitle = activeTab === 'dua' ? currentDua.surahName : currentVerse.surahName;

    hafizAudioService.playSpecificAyah(
      surahNum,
      title,
      arabicTitle,
      1,
      ayahNum
    );
  };

  // Save to Personal Dua Book
  const handleSaveToPersonalBook = () => {
    try {
      const saved = localStorage.getItem('user_personal_duas');
      const list = saved ? JSON.parse(saved) : [];

      const newEntry = {
        id: `quran_dua_${Date.now()}`,
        title: currentDua.title,
        text: `${currentDua.translation}\n(${currentDua.surahName}, ${currentDua.ayahNumber})`,
        intention: `${currentDua.speaker} - ${currentDua.themeLabel}`,
        createdAt: new Date().toISOString().split('T')[0],
        pinned: false
      };

      list.unshift(newEntry);
      localStorage.setItem('user_personal_duas', JSON.stringify(list));
      setAddedToDuaBook(true);
      setTimeout(() => setAddedToDuaBook(false), 3000);
    } catch {
      // ignore
    }
  };

  // Open Aesthetic Dua Card Studio Modal
  const handleOpenCardStudio = () => {
    if (activeTab === 'dua') {
      setStudioDua({
        id: `daily_dua_${currentDua.id}`,
        title: currentDua.title,
        text: currentDua.translation,
        arabicText: currentDua.arabic,
        intention: `${currentDua.surahName} ${currentDua.ayahNumber}. Âyet (${currentDua.speaker})`,
        category: 'Günün Kur\'an Duası',
        createdAt: new Date().toISOString().split('T')[0],
        pinned: false
      });
    } else {
      setStudioDua({
        id: `daily_verse_${currentVerse.id}`,
        title: `${currentVerse.surahName} Sûresi, ${currentVerse.ayahNumber}. Âyet`,
        text: currentVerse.translation,
        arabicText: currentVerse.arabic,
        intention: `Hikmet: ${currentVerse.lesson}`,
        category: 'Günün Âyeti',
        createdAt: new Date().toISOString().split('T')[0],
        pinned: false
      });
    }
  };

  // Build formatted text for sharing
  const shareTextFormatted = useMemo(() => {
    if (activeTab === 'dua') {
      return `✨ Kur'an-ı Kerim'den Günün Duası ✨\n\n📌 ${currentDua.title}\n"${currentDua.arabic}"\n\n📖 Meali:\n"${currentDua.translation}"\n\n📍 ${currentDua.surahName}, ${currentDua.ayahNumber}. Âyet (${currentDua.speaker})\n\n🤲 Nur-u İslam Rehberi ile paylaşıldı.`;
    } else {
      return `🌟 Kur'an-ı Kerim'den Günün Âyeti 🌟\n\n"${currentVerse.arabic}"\n\n📖 Meali:\n"${currentVerse.translation}"\n\n📍 ${currentVerse.surahName}, ${currentVerse.ayahNumber}. Âyet\n💡 Hikmet: ${currentVerse.lesson}\n\n🤲 Nur-u İslam Rehberi ile paylaşıldı.`;
    }
  }, [activeTab, currentDua, currentVerse]);

  // Social sharing handlers
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeTab === 'dua' ? currentDua.title : `Günün Âyeti - ${currentVerse.surahName}`,
          text: shareTextFormatted,
          url: window.location.href
        });
        setShowShareModal(false);
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareTextFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextFormatted)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareModal(false);
  };

  const handleTwitterShare = () => {
    const textSnippet = activeTab === 'dua'
      ? `"${currentDua.translation}" (${currentDua.surahName}, ${currentDua.ayahNumber}) #Dua #Ayet #Kuran`
      : `"${currentVerse.translation}" (${currentVerse.surahName}, ${currentVerse.ayahNumber}) #Ayet #Kuran`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textSnippet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareModal(false);
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareTextFormatted)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareModal(false);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-stone-50 to-emerald-50/30 dark:from-stone-900 dark:via-stone-900/95 dark:to-emerald-950/20 border border-stone-200/90 dark:border-stone-800 shadow-md transition-all w-full max-w-full min-w-0 ${className}`}>
      {/* Subtle Islamic Arabesque Geometry Watermark */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Decorative Gold Top Edge */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500" />

      {/* Card Header: Mode Switcher & Quick Navigation */}
      <div className="p-4 sm:p-5 pb-3 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between flex-wrap gap-2">
        {/* Toggle Pills: Günün Duası / Günün Âyeti */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/90 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
          <button
            onClick={() => {
              setActiveTab('dua');
              stopAudio();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dua'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Günün Kur'an Duası</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('verse');
              stopAudio();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verse'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Günün Âyeti</span>
          </button>
        </div>

        {/* Carousel / Rotation Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Önceki"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-mono font-semibold text-stone-500 dark:text-stone-400 px-1">
            {activeTab === 'dua'
              ? `${duaIndex + 1}/${QURAN_DUAS_LIST.length}`
              : `${verseIndex + 1}/${DAILY_VERSES_LIST.length}`}
          </span>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Sonraki"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-xl text-stone-500 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ml-1"
            title="Rastgele Farklı Dua Keşfet"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Badges row: Speaker, Surah, Theme */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-300/40 dark:border-amber-700/50">
              {activeTab === 'dua' ? currentDua.speaker : 'Kur’an-ı Kerîm'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
              {activeTab === 'dua'
                ? `${currentDua.surahName} (${currentDua.ayahNumber})`
                : `${currentVerse.surahName} (${currentVerse.ayahNumber})`}
            </span>
          </div>

          {activeTab === 'dua' && (
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Konu: <span className="font-semibold text-stone-700 dark:text-stone-200">{currentDua.themeLabel}</span>
            </span>
          )}
        </div>

        {/* Title for Dua */}
        {activeTab === 'dua' && (
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
            {currentDua.title}
          </h3>
        )}

        {/* 1. Arabic Quranic Script with Beautiful Calligraphic Styling */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-stone-950/50 border border-amber-200/50 dark:border-stone-800 relative group">
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl text-right text-stone-900 dark:text-amber-100/95 leading-[2.2] tracking-wide select-text drop-shadow-xs"
          >
            {activeTab === 'dua' ? currentDua.arabic : currentVerse.arabic}
          </p>
        </div>

        {/* 2. Phonetic Transliteration (Okunuşu) with show/hide toggle */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium mb-1">
            <span>Okunuşu:</span>
            <button
              onClick={() => setShowTransliteration(!showTransliteration)}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {showTransliteration ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  <span>Gizle</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Göster</span>
                </>
              )}
            </button>
          </div>

          {showTransliteration && (
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-mono italic bg-stone-100/70 dark:bg-stone-800/40 px-3 py-2 rounded-xl border border-stone-200/60 dark:border-stone-800 leading-relaxed">
              {activeTab === 'dua' ? currentDua.transliteration : currentVerse.transliteration}
            </p>
          )}
        </div>

        {/* 3. Turkish Translation (Meali) */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
            Türkçe Meali
          </span>
          <p className="text-sm sm:text-base text-stone-800 dark:text-stone-100 font-medium leading-relaxed select-text">
            "{activeTab === 'dua' ? currentDua.translation : currentVerse.translation}"
          </p>
        </div>

        {/* 4. Virtue / Spiritual Insight (Expandable) */}
        {activeTab === 'dua' && currentDua.virtue && (
          <div className="pt-2">
            <button
              onClick={() => setShowVirtue(!showVirtue)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showVirtue ? 'Faziletini Gizle' : 'Bu Duanın Fazileti ve Hikmeti'}</span>
            </button>

            {showVirtue && (
              <div className="mt-2 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-stone-700 dark:text-emerald-100 leading-relaxed animate-in fade-in">
                {currentDua.virtue}
              </div>
            )}
          </div>
        )}

        {/* Lesson for Verse */}
        {activeTab === 'verse' && currentVerse.lesson && (
          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/60 text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong className="text-stone-900 dark:text-white">Günün Mesajı:</strong> {currentVerse.lesson}</span>
          </div>
        )}

        {/* 5. Interactive Actions & Sharing Toolbar */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2.5">
          {/* Left Actions: Amin button & Audio Recitation */}
          <div className="flex items-center gap-2">
            {activeTab === 'dua' && (
              <button
                onClick={handleAmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                title="Âmin de"
              >
                <Heart className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                <span>Âmin</span>
                {currentAminCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-stone-950/15 text-[10px] font-mono">
                    {currentAminCount}
                  </span>
                )}
              </button>
            )}

            {/* Audio Recitation button */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isPlayingAudio
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title={isPlayingAudio ? 'Dinlemeyi Durdur' : 'Sesli Dinle'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Dinle</span>
                </>
              )}
            </button>

            {/* Save to Personal Dua Book */}
            {activeTab === 'dua' && (
              <button
                onClick={handleSaveToPersonalBook}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  addedToDuaBook
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
                title="Dua Defterime Kaydet"
              >
                {addedToDuaBook ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Kaydedildi</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Defterime Ekle</span>
                  </>
                )}
              </button>
            )}

            {onOpenDuaBook && (
              <button
                onClick={onOpenDuaBook}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                title="Dua Defterim & Dua Kartları Sayfasını Aç"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Dua Defterim</span>
              </button>
            )}
          </div>

          {/* Right Actions: Social Media Sharing & Copy */}
          <div className="flex items-center gap-1.5">
            {/* Quick Copy button */}
            <button
              onClick={handleCopyText}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
              title="Metni Kopyala"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Aesthetic Dua Card Studio Button */}
            <button
              onClick={handleOpenCardStudio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-300/50 shadow-2xs transition-all cursor-pointer active:scale-95"
              title="Estetik hat sanatı ve temalarla Dua Kartı oluşturup indir veya paylaş"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Dua Kartı</span>
            </button>

            {/* Social Share Primary Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paylaş</span>
            </button>
          </div>
        </div>
      </div>

      {/* Social Media Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm">
                  {activeTab === 'dua' ? 'Duayı Paylaş' : 'Âyeti Paylaş'}
                </h4>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Text Preview Box */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 max-h-36 overflow-y-auto space-y-1 italic select-text">
              <p className="font-arabic text-sm text-right leading-relaxed font-bold not-italic">
                {activeTab === 'dua' ? currentDua.arabic : currentVerse.arabic}
              </p>
              <p>"{activeTab === 'dua' ? currentDua.translation : currentVerse.translation}"</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block not-italic">
                — {activeTab === 'dua' ? `${currentDua.surahName} (${currentDua.ayahNumber})` : `${currentVerse.surahName} (${currentVerse.ayahNumber})`}
              </span>
            </div>

            {/* Social Share Channel Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* WhatsApp Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextFormatted)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X Button */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeTab === 'dua' ? `"${currentDua.translation}" (${currentDua.surahName}, ${currentDua.ayahNumber}) #Dua #Ayet #Kuran` : `"${currentVerse.translation}" (${currentVerse.surahName}, ${currentVerse.ayahNumber}) #Ayet #Kuran`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer border border-stone-700"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Twitter</span>
              </a>

              {/* Telegram Button */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(shareTextFormatted)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              {/* Copy Full Text */}
              <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>

            {/* Native Mobile Share Sheet trigger if supported */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Diğer Uygulamalarla Paylaş (Instagram vb.)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Aesthetic Dua Card Studio Modal */}
      <DuaCardStudioModal
        dua={studioDua}
        isOpen={!!studioDua}
        onClose={() => setStudioDua(null)}
      />
    </div>
  );
};
