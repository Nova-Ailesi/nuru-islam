import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Sparkles,
  Share2,
  Plus,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  X,
  Copy,
  Check,
  Headphones,
  Flame,
  Info,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  QURAN_JUZ_LIST,
  QuranJuzItem,
  HatimSession,
  OFFICIAL_HATIM_DUA
} from '../data/quranJuzData';
import { hafizAudioService } from '../services/hafizAudioService';
import { audioService } from '../services/audioService';
import { AdBannerSlot } from './AdBannerSlot';

const STORAGE_KEY = 'nur_hatim_tracker_sessions_v1';
const STATS_STORAGE_KEY = 'nur_hatim_completed_counter_v1';

export const HatimTrackerView: React.FC = () => {
  // All Hatim sessions
  const [sessions, setSessions] = useState<HatimSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    // Default active session
    return [
      {
        id: 'default-hatim-1',
        title: 'Bireysel Hatm-i Şerif',
        startDate: new Date().toISOString().split('T')[0],
        targetEndDate: '',
        completedJuz: [1, 2, 3],
        juzProgressPages: { 1: 20, 2: 20, 3: 20, 4: 10 },
        assignedUsers: {},
        isCompleted: false
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'default-hatim-1';
  });

  const [completedHatimTotal, setCompletedHatimTotal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Filter tabs: 'all' | 'in_progress' | 'completed' | 'remaining'
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed' | 'remaining'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  // Modals
  const [showNewHatimModal, setShowNewHatimModal] = useState(false);
  const [showDuaModal, setShowDuaModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAssignModalJuz, setShowAssignModalJuz] = useState<number | null>(null);
  const [assigneeName, setAssigneeName] = useState('');
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [isPlayingDuaAudio, setIsPlayingDuaAudio] = useState(false);

  // Form for New Hatim
  const [newTitle, setNewTitle] = useState('Yeni Hatm-i Şerif');
  const [newTargetDays, setNewTargetDays] = useState(30);

  // Save sessions to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, String(completedHatimTotal));
    } catch {
      // Ignore
    }
  }, [completedHatimTotal]);

  // Current active session
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  // Statistics calculation
  const totalCompletedJuzCount = activeSession?.completedJuz.length || 0;
  const progressPercent = Math.round((totalCompletedJuzCount / 30) * 100);

  // Calculate total pages read across all cüz
  const totalPagesRead = useMemo(() => {
    if (!activeSession) return 0;
    let pages = 0;
    QURAN_JUZ_LIST.forEach((juz) => {
      if (activeSession.completedJuz.includes(juz.cuzNumber)) {
        pages += juz.totalPages;
      } else {
        pages += activeSession.juzProgressPages[juz.cuzNumber] || 0;
      }
    });
    return Math.min(604, pages);
  }, [activeSession]);

  // Toggle Cüz Completion (0 or 20 pages)
  const handleToggleJuzCompletion = (cuzNumber: number) => {
    if (!activeSession) return;
    const isCurrentlyDone = activeSession.completedJuz.includes(cuzNumber);
    const targetJuz = QURAN_JUZ_LIST.find((j) => j.cuzNumber === cuzNumber);
    const fullPages = targetJuz?.totalPages || 20;

    let updatedCompleted: number[];
    let updatedPages = { ...activeSession.juzProgressPages };

    if (isCurrentlyDone) {
      updatedCompleted = activeSession.completedJuz.filter((c) => c !== cuzNumber);
      delete updatedPages[cuzNumber];
    } else {
      updatedCompleted = [...activeSession.completedJuz, cuzNumber];
      updatedPages[cuzNumber] = fullPages;
      audioService.playTasbihClick();
    }

    // Check if all 30 Juz are completed!
    const wasJustFinished = updatedCompleted.length === 30;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            completedJuz: updatedCompleted,
            juzProgressPages: updatedPages,
            isCompleted: wasJustFinished,
            completedAt: wasJustFinished ? new Date().toISOString() : s.completedAt
          };
        }
        return s;
      })
    );

    if (wasJustFinished) {
      setCompletedHatimTotal((prev) => prev + 1);
      setShowDuaModal(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  // Stepper for individual page inside a Cüz
  const handleUpdatePageProgress = (cuzNumber: number, delta: number) => {
    if (!activeSession) return;
    const targetJuz = QURAN_JUZ_LIST.find((j) => j.cuzNumber === cuzNumber);
    const maxPages = targetJuz?.totalPages || 20;
    const currentPages = activeSession.juzProgressPages[cuzNumber] || 0;
    const newPages = Math.max(0, Math.min(maxPages, currentPages + delta));

    let updatedCompleted = [...activeSession.completedJuz];
    const isNowDone = newPages >= maxPages;
    const wasDone = activeSession.completedJuz.includes(cuzNumber);

    if (isNowDone && !wasDone) {
      updatedCompleted.push(cuzNumber);
      audioService.playTasbihClick();
    } else if (!isNowDone && wasDone) {
      updatedCompleted = updatedCompleted.filter((c) => c !== cuzNumber);
    }

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            completedJuz: updatedCompleted,
            juzProgressPages: {
              ...s.juzProgressPages,
              [cuzNumber]: newPages
            }
          };
        }
        return s;
      })
    );

    if (updatedCompleted.length === 30 && !activeSession.isCompleted) {
      setCompletedHatimTotal((prev) => prev + 1);
      setShowDuaModal(true);
      try {
        confetti({ particleCount: 100, spread: 80 });
      } catch {
        // Confetti fallback
      }
    }
  };

  // Assign user to Cüz (for Ortak/Aile Hatmi)
  const handleAssignUser = (cuzNumber: number, name: string) => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          const updatedAssigned = { ...(s.assignedUsers || {}) };
          if (name.trim()) {
            updatedAssigned[cuzNumber] = name.trim();
          } else {
            delete updatedAssigned[cuzNumber];
          }
          return {
            ...s,
            assignedUsers: updatedAssigned
          };
        }
        return s;
      })
    );
    setShowAssignModalJuz(null);
    setAssigneeName('');
  };

  // Create new Hatim session
  const handleCreateNewHatim = () => {
    if (!newTitle.trim()) return;
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + newTargetDays);

    const newSession: HatimSession = {
      id: `hatim-${Date.now()}`,
      title: newTitle.trim(),
      startDate: now.toISOString().split('T')[0],
      targetEndDate: targetDate.toISOString().split('T')[0],
      completedJuz: [],
      juzProgressPages: {},
      assignedUsers: {},
      isCompleted: false
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowNewHatimModal(false);
    setNewTitle('Yeni Hatm-i Şerif');
    audioService.playTasbihClick();
  };

  // Delete Hatim session
  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) return;
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    setActiveSessionId(filtered[0].id);
  };

  // Generate WhatsApp Share Message for Ortak Hatim
  const generateShareText = () => {
    if (!activeSession) return '';
    let msg = `🕌 *${activeSession.title.toUpperCase()} (CÜZ DAĞILIMI)*\n`;
    msg += `📖 İlerleme: %${progressPercent} (${totalCompletedJuzCount}/30 Cüz Tamamlandı)\n\n`;

    QURAN_JUZ_LIST.forEach((juz) => {
      const isDone = activeSession.completedJuz.includes(juz.cuzNumber);
      const assignee = activeSession.assignedUsers?.[juz.cuzNumber];
      const pageProg = activeSession.juzProgressPages[juz.cuzNumber] || 0;

      let statusIcon = isDone ? '✅' : pageProg > 0 ? '⏳' : '⚪';
      let assigneeText = assignee ? `[${assignee}]` : '(Boşta - Almak için yazın)';
      msg += `${statusIcon} *${juz.name}:* ${assigneeText} (${juz.startSurah})\n`;
    });

    msg += `\n🤲 Allah kabul eylesin. Nur-u İslâm Uygulaması ile takip ediliyor.`;
    return msg;
  };

  const handleCopyShareText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2000);
  };

  // Play Hatim Dua recitation via audioService speech
  const handleToggleDuaAudio = () => {
    if (isPlayingDuaAudio) {
      audioService.stopSpeaking();
      setIsPlayingDuaAudio(false);
    } else {
      setIsPlayingDuaAudio(true);
      audioService.speak(
        OFFICIAL_HATIM_DUA.transliteration,
        'tr-TR',
        () => setIsPlayingDuaAudio(false),
        () => setIsPlayingDuaAudio(false)
      );
    }
  };

  // Filtered Cüz list
  const filteredJuzList = QURAN_JUZ_LIST.filter((juz) => {
    const isCompleted = activeSession?.completedJuz.includes(juz.cuzNumber);
    const pages = activeSession?.juzProgressPages[juz.cuzNumber] || 0;
    const isInProgress = !isCompleted && pages > 0;
    const isRemaining = !isCompleted && pages === 0;

    if (filterTab === 'completed' && !isCompleted) return false;
    if (filterTab === 'in_progress' && !isInProgress) return false;
    if (filterTab === 'remaining' && !isRemaining) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        juz.name.toLowerCase().includes(q) ||
        juz.startSurah.toLowerCase().includes(q) ||
        juz.endSurah.toLowerCase().includes(q) ||
        juz.keyThemes.toLowerCase().includes(q) ||
        (activeSession?.assignedUsers?.[juz.cuzNumber] || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto">
      {/* Top Hero Banner: Khatm Progress Overview */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 relative z-10 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hatm-i Şerif Takip Panosu</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Session Selector / Switcher */}
            <select
              value={activeSessionId}
              onChange={(e) => setActiveSessionId(e.target.value)}
              className="bg-stone-900/90 text-white border border-white/20 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.completedJuz.length}/30)
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowNewHatimModal(true)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs transition-colors cursor-pointer"
              title="Yeni Hatim Başlat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Progress Metric Section */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10">
          {/* Left: Radial Progress Ring */}
          <div className="sm:col-span-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-stone-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-400 transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white leading-none">
                  %{progressPercent}
                </span>
                <span className="text-[10px] text-stone-300 font-bold uppercase mt-1">
                  {totalCompletedJuzCount}/30 Cüz
                </span>
              </div>
            </div>
          </div>

          {/* Right: Informative Stats */}
          <div className="sm:col-span-8 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activeSession?.title}</span>
                  {activeSession?.isCompleted && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-stone-950">
                      Tamamlandı
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  {30 - totalCompletedJuzCount === 0
                    ? 'Tebrikler! 30 Cüzün tamamı okundu.'
                    : `Hatmin tamamlanmasına ${30 - totalCompletedJuzCount} cüz kaldı.`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1 justify-end">
                  <Award className="w-3.5 h-3.5" />
                  <span>{completedHatimTotal} Hatim</span>
                </span>
                <span className="text-[10px] text-stone-400">Toplam Biten</span>
              </div>
            </div>

            {/* Linear Page Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-stone-300">
                <span>Sayfa İlerlemesi:</span>
                <span className="font-bold text-emerald-300">
                  {totalPagesRead} / 604 Sayfa
                </span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(totalPagesRead / 604) * 100}%` }}
                />
              </div>
            </div>

            {/* Quick Action Buttons Row */}
            <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => setShowDuaModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hatm-i Şerif Duâsı</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cüz Paylaş (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Ad Slot (AdMob Placement) */}
      <AdBannerSlot slotLocation="hatim_feed" />

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2">
        <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-2 px-2.5 font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Tüm Cüzler (30)
          </button>
          <button
            onClick={() => setFilterTab('in_progress')}
            className={`flex-1 py-2 px-2.5 font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'in_progress'
                ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Okunuyor
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`flex-1 py-2 px-2.5 font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'completed'
                ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Bitenler ({totalCompletedJuzCount})
          </button>
          <button
            onClick={() => setFilterTab('remaining')}
            className={`flex-1 py-2 px-2.5 font-semibold rounded-xl transition-all cursor-pointer ${
              filterTab === 'remaining'
                ? 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Kalanlar ({30 - totalCompletedJuzCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cüz numarası, sure adı veya okuyan kişi ara (örn: Yâsîn, 30. Cüz, Ahmet)..."
            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 30 CÜZ GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredJuzList.map((juz) => {
          const isDone = activeSession?.completedJuz.includes(juz.cuzNumber);
          const currentPages = activeSession?.juzProgressPages[juz.cuzNumber] || (isDone ? juz.totalPages : 0);
          const isExpanded = expandedJuz === juz.cuzNumber;
          const assignedUser = activeSession?.assignedUsers?.[juz.cuzNumber];

          return (
            <div
              key={juz.cuzNumber}
              className={`bg-white dark:bg-stone-900 border rounded-3xl p-4 shadow-xs transition-all relative overflow-hidden ${
                isDone
                  ? 'border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : currentPages > 0
                  ? 'border-amber-400/80 dark:border-amber-600/80'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Cüz Number Badge / Checkbox */}
                  <button
                    onClick={() => handleToggleJuzCompletion(juz.cuzNumber)}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform active:scale-95 cursor-pointer border ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                        : currentPages > 0
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-400'
                    }`}
                    title={isDone ? 'Tamamlandı (Geri al)' : 'Tamamlandı olarak işaretle'}
                  >
                    {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : juz.cuzNumber}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                        {juz.name}
                      </h4>
                      {isDone && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Tamamlandı
                        </span>
                      )}
                      {!isDone && currentPages > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {currentPages}/{juz.totalPages} Sayfa
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {juz.startSurah} ➔ {juz.endSurah}
                    </p>
                  </div>
                </div>

                {/* Arabic Calligraphy Name */}
                <span className="font-arabic text-xs text-stone-400 dark:text-stone-500">
                  {juz.arabicName}
                </span>
              </div>

              {/* Progress Bar & Page Stepper */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">
                    Sayfa: {juz.startPage} - {juz.endPage} ({juz.totalPages} Sayfa)
                  </span>

                  {/* Page Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdatePageProgress(juz.cuzNumber, -1)}
                      disabled={currentPages <= 0}
                      className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 disabled:opacity-30 hover:bg-stone-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="1 sayfa azalt"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200 px-1">
                      {currentPages}/{juz.totalPages}
                    </span>
                    <button
                      onClick={() => handleUpdatePageProgress(juz.cuzNumber, 1)}
                      disabled={currentPages >= juz.totalPages}
                      className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 disabled:opacity-30 hover:bg-stone-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="1 sayfa artır"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Linear Juz Mini Progress */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${(currentPages / juz.totalPages) * 100}%` }}
                  />
                </div>
              </div>

              {/* Assignee / Group Hatim Row */}
              <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-stone-100/60 dark:border-stone-800/60">
                <button
                  onClick={() => {
                    setShowAssignModalJuz(juz.cuzNumber);
                    setAssigneeName(assignedUser || '');
                  }}
                  className="text-[11px] text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  title="Okuyacak kişiyi ata"
                >
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {assignedUser ? `Okuyan: ${assignedUser}` : 'Kişi Ata (Ortak Hatim)'}
                  </span>
                </button>

                <button
                  onClick={() => setExpandedJuz(isExpanded ? null : juz.cuzNumber)}
                  className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Özet</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expanded Theme info */}
              {isExpanded && (
                <div className="mt-2 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl text-xs text-stone-600 dark:text-stone-300 space-y-1 animate-in fade-in">
                  <p className="font-bold text-[10px] text-stone-400 uppercase tracking-wider">
                    Bu Cüzün Temel Konuları:
                  </p>
                  <p className="leading-relaxed">
                    {juz.keyThemes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Official Hatm-i Şerif Dua Modal */}
      {showDuaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto flex flex-col text-left">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {OFFICIAL_HATIM_DUA.title}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Kur'an-ı Kerim hatmi tamamlandığında okunan mübarek dua
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  audioService.stopSpeaking();
                  setIsPlayingDuaAudio(false);
                  setShowDuaModal(false);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Recitation button */}
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                Hatim Duasını Sesli Dinleyin
              </span>
              <button
                onClick={handleToggleDuaAudio}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingDuaAudio
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isPlayingDuaAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingDuaAudio ? 'Durdur' : 'Sesli Dinle'}</span>
              </button>
            </div>

            {/* Arabic Text */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-right">
              <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-stone-50 leading-loose whitespace-pre-line">
                {OFFICIAL_HATIM_DUA.arabic}
              </p>
            </div>

            {/* Transliteration */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-stone-200/40 dark:border-stone-800 space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Okunuşu:
              </p>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed whitespace-pre-line">
                {OFFICIAL_HATIM_DUA.transliteration}
              </p>
            </div>

            {/* Meaning */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Türkçe Meali & Anlamı:
              </p>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line italic">
                {OFFICIAL_HATIM_DUA.meaning}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  audioService.stopSpeaking();
                  setIsPlayingDuaAudio(false);
                  setShowDuaModal(false);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Âmin, Allah Kabul Eylesin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp / Group Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Cüz Dağıtım Listesi
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Ailenizle veya grubunuzla paylaşmak için kopyalayın
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 max-h-60 overflow-y-auto font-mono text-[11px] text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
              {generateShareText()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShareText}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {copiedShareText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShareText ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Assign User to Juz Modal */}
      {showAssignModalJuz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {showAssignModalJuz}. Cüzü Okuyacak Kişi
              </h3>
              <button
                onClick={() => setShowAssignModalJuz(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Kişi veya Aile Üyesi Adı:
              </label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="Örn: Annem, Ahmet, Mehmet..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              {activeSession?.assignedUsers?.[showAssignModalJuz] && (
                <button
                  onClick={() => handleAssignUser(showAssignModalJuz, '')}
                  className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold text-xs cursor-pointer"
                >
                  Kaldır
                </button>
              )}
              <button
                onClick={() => handleAssignUser(showAssignModalJuz, assigneeName)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Hatim Session Modal */}
      {showNewHatimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                Yeni Hatm-i Şerif Başlat
              </h3>
              <button
                onClick={() => setShowNewHatimModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Hatim Başlığı / Niyeti:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Ramazan Hatmi, Aile Hatmi..."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Hedef Süre:
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[15, 30, 60].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setNewTargetDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newTargetDays === days
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {days} Gün
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleCreateNewHatim}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Hatmi Başlat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
