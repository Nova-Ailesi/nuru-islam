import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  Volume2,
  VolumeX,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Users,
  Gauge,
  HelpCircle,
  Repeat,
  Headphones,
  CheckCircle2,
  Mic,
  Activity
} from 'lucide-react';
import { SURAHS_DATA, NAMAZ_DUAS_DATA } from '../data/surahsAndDuas';
import { SurahItem, DuaItem } from '../types';
import {
  hafizAudioService,
  HafizPlayerState,
  HAFIZ_RECITERS,
  RepeatOption
} from '../services/hafizAudioService';
import { audioService } from '../services/audioService';
import {
  PronunciationFeedbackModal,
  PronunciationFeedbackTarget
} from './PronunciationFeedbackModal';
import { NativeAdCardSlot } from './NativeAdCardSlot';
import { AdBannerSlot } from './AdBannerSlot';

interface SurahsAndDuasViewProps {
  onSurahRead?: () => void;
}

// Pronunciation and Tajweed guidance tips for accurate recitation
const TAJWEED_TIPS: Record<number | string, { title: string; tips: string[] }> = {
  1: {
    title: "Fâtiha Sûresi Telaffuz & Tecvid İncelikleri",
    tips: [
      "Er-Rahmân: 'Râ' harfi şeddeli olduğu için kalın ve tok bir sesle telaffuz edilir.",
      "İyyâke na'büdü: 'Yâ' harfindeki şeddeye dikkat edilmeli, yumuşak değil baskılı okunmalıdır.",
      "İhdinas-sırâtal-müstakîm: 'Sâd' ve 'Tâ' harfleri kalın, 'Sırât' ve 'Müstakîm' kelimelerindeki 'Tâ' harfi ince 'Te' ile karıştırılmamalıdır.",
      "Veleddâllîn: Kelimenin sonundaki lamelif 'Medd-i Lâzım' olup 4 elif (yaklaşık 4 saniye) tutularak uzatılır."
    ]
  },
  112: {
    title: "İhlâs Sûresi Telaffuz & Tecvid İncelikleri",
    tips: [
      "Kul hüvallâhü ehad: 'Kaf' harfi boğaz dibinden kalın çıkarılır. 'Ehad' sonundaki dâl harfinde durulurken kuvvetli 'Kalkale' (sesi titretme) yapılır.",
      "Allâhüs-samed: 'Samed' kelimesinde Sâd harfi dolgun okunmalı, dâl harfinde kalkale kuralı uygulanmalıdır.",
      "Kefüven ehad: 'Fâ' harfi ötreli değil fethalı (üstünlü) okunur."
    ]
  },
  113: {
    title: "Felak Sûresi Telaffuz & Tecvid İncelikleri",
    tips: [
      "Kul e'ûzü bi-rabbil-felak: 'E'ûzü'deki zâl (ذ) harfi peltek okunur, 'Felak' sonundaki kaf harfinde kalkale yapılır.",
      "Min şerri mâ halak: 'Min şerri'de İhfâ yapılır (nûn sesi genizden 1.5 elif miktarı gizlenir).",
      "Ve min şerri gâsikın izâ vekab: 'Gayn' boğazın üst kısmından hırıltılı bir tonla çıkarılır."
    ]
  },
  114: {
    title: "Nâs Sûresi Telaffuz & Tecvid İncelikleri",
    tips: [
      "Kul e'ûzü bi-rabbin-nâs: 'En-Nâs' kelimesindeki şeddeli Nûn harfinde 1.5 elif miktarı 'Gunne' (geniz sesi) tutulur.",
      "Min şerril-vesvâsil-hannâs: 'Hâ' harfi (خ) hırıltılı boğaz harfidir, normal ince 'h' gibi okunmaz.",
      "Ellezî yüvesvisü: 'Zâl' (ذ) harfi peltek, 'Sîn' harfleri ince ve keskindir."
    ]
  },
  255: {
    title: "Âyet-el Kürsî Telaffuz & Tecvid İncelikleri",
    tips: [
      "El-Hayyül-Kayyûm: 'Hayy' ve 'Kayyûm' isimlerindeki 'yâ' harfleri şeddeli olup hakkı verilerek okunmalıdır.",
      "Lâ te'huzühû: 'Hâ' harfi (خ) hırıltılıdır, 'zel' (ذ) peltektir.",
      "İllâ bi-mâ şâe: 'Şâe' kelimesinde Medd-i Muttasıl bulunur, 4 elif miktarı uzatılması vaciptir.",
      "Vesi'a kürsiyyühü: 'Ayn' (ع) harfi boğaz ortasından net bir sıkma ile telaffuz edilmelidir."
    ]
  },
  subhaneke: {
    title: "Sübhâneke Telaffuz & Mahreç İncelikleri",
    tips: [
      "Sübhânekellâhümme: 'Bâ' harfinde kalkale (hafif titretme) yapılır, 'Allâhümme'deki mim şeddeli ve gunneli okunur.",
      "Ve te'âlâ ceddük: 'Ayn' harfi boğazdan çıkar. 'Ceddük' kelimesindeki dal harfi şeddelidir.",
      "Lâ ilâhe gayrük: 'Gayn' (غ) harfi boğazın ağza en yakın yerinden yumuşak ve kalın sesle çıkarılır."
    ]
  },
  ettehiyyatu: {
    title: "Ettehiyyâtü Telaffuz & Mahreç İncelikleri",
    tips: [
      "Et-Tahiyyâtü: 'Hâ' harfi (ح) ha-i mühmele olup göğüsten değil boğaz ortasından nefesle çıkar.",
      "Esselâmü aleyke eyyühen-nebiyyü: 'Nebiyyü' sonundaki yâ şeddelidir.",
      "Eşhedü el lâ ilâhe illallâh: 'İdğâm-ı Bila Gunne' kuralı gereğince 'el lâ' birbirine katılarak 'ellâ' şeklinde okunur."
    ]
  },
  salli: {
    title: "Allâhümme Salli Telaffuz & Mahreç İncelikleri",
    tips: [
      "Allâhümme salli alâ Muhammed: 'Sâd' (ص) harfi dolgun, kalın okunur, ince 'Sin' gibi okunmamalıdır.",
      "İbrâhîm: 'Râ' harfi kalın, 'he' harfi göğüsten çıkan h harfidir.",
      "İnneke hamîdüm-mecîd: 'İnneke'deki nun harfinde gunne tutulur."
    ]
  }
};

export const SurahsAndDuasView: React.FC<SurahsAndDuasViewProps> = ({ onSurahRead }) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'duas' | 'favorites'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(1); // Expand Fatiha by default
  const [showTajweedModalId, setShowTajweedModalId] = useState<string | number | null>(null);
  const [showReciterSelector, setShowReciterSelector] = useState<boolean>(false);
  const [pronunciationModalOpen, setPronunciationModalOpen] = useState<boolean>(false);
  const [pronunciationTarget, setPronunciationTarget] = useState<PronunciationFeedbackTarget | null>(null);

  const handleOpenPronunciationModal = (target: PronunciationFeedbackTarget) => {
    setPronunciationTarget(target);
    setPronunciationModalOpen(true);
  };

  const handleNextPronunciationTarget = () => {
    if (!pronunciationTarget || !pronunciationTarget.surahNumber || !pronunciationTarget.ayahNumber) return;
    const currentSurah = SURAHS_DATA.find((s) => s.id === pronunciationTarget.surahNumber);
    if (!currentSurah) return;

    if (pronunciationTarget.ayahNumber < currentSurah.ayahCount) {
      const nextAyah = pronunciationTarget.ayahNumber + 1;
      const nextIdx = nextAyah - 1;
      setPronunciationTarget({
        id: `${currentSurah.id}-${nextAyah}`,
        title: `${currentSurah.name} · ${nextAyah}. Âyet`,
        arabicText: currentSurah.arabicText[nextIdx],
        transliteration: currentSurah.transliteration[nextIdx],
        turkishMeaning: currentSurah.turkishMeaning[nextIdx],
        surahNumber: currentSurah.id,
        ayahNumber: nextAyah
      });
    }
  };

  // Hafiz Audio Service State
  const [playerState, setPlayerState] = useState<HafizPlayerState>(() =>
    hafizAudioService.getState()
  );

  useEffect(() => {
    const unsub = hafizAudioService.subscribe((state) => {
      setPlayerState(state);
    });
    return unsub;
  }, []);

  const [favorites, setFavorites] = useState<{ surahs: number[]; duas: string[] }>(() => {
    const saved = localStorage.getItem('user_favorites_islamic');
    return saved ? JSON.parse(saved) : { surahs: [1, 255, 112], duas: ['subhaneke', 'ettehiyyatu'] };
  });

  useEffect(() => {
    localStorage.setItem('user_favorites_islamic', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavoriteSurah = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.surahs.includes(id);
      return {
        ...prev,
        surahs: exists ? prev.surahs.filter((x) => x !== id) : [...prev.surahs, id]
      };
    });
  };

  const toggleFavoriteDua = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.duas.includes(id);
      return {
        ...prev,
        duas: exists ? prev.duas.filter((x) => x !== id) : [...prev.duas, id]
      };
    });
  };

  // Play full surah with Hafiz recitation
  const handlePlaySurah = (surah: SurahItem) => {
    if (playerState.isPlaying && playerState.currentId === surah.id) {
      hafizAudioService.pause();
    } else {
      hafizAudioService.playSurah(
        surah.id,
        surah.name,
        surah.arabicName,
        surah.ayahCount,
        1
      );
      if (onSurahRead) onSurahRead();
    }
  };

  // Play single verse with Hafiz recitation
  const handlePlayAyah = (surah: SurahItem, ayahIndex1Based: number) => {
    hafizAudioService.playSpecificAyah(
      surah.id,
      surah.name,
      surah.arabicName,
      surah.ayahCount,
      ayahIndex1Based
    );
    if (onSurahRead) onSurahRead();
  };

  // Play Dua
  const handlePlayDua = (dua: DuaItem) => {
    if (playerState.isPlaying && playerState.currentId === dua.id) {
      hafizAudioService.stop();
    } else {
      // Map Quranic duas to EveryAyah CDN if available
      let quranRef: { surah: number; ayah: number } | undefined;
      if (dua.id === 'rabbena_atina') {
        quranRef = { surah: 2, ayah: 201 };
      } else if (dua.id === 'rabbena_agfirli') {
        quranRef = { surah: 14, ayah: 41 };
      }

      hafizAudioService.playDua(
        dua.id,
        dua.title,
        dua.arabic,
        dua.transliteration,
        dua.meaning,
        quranRef
      );
    }
  };

  // Play Turkish Meaning via speech
  const handlePlayMeaningSpeech = (title: string, meaningText: string) => {
    hafizAudioService.stop();
    audioService.speak(`${title} Meali: ${meaningText}`, 'tr-TR');
  };

  const handleCopyText = (id: string | number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered lists
  const query = searchQuery.toLowerCase().trim();

  const filteredSurahs = SURAHS_DATA.filter((s) => {
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.meaningName.toLowerCase().includes(query) ||
      s.summary.toLowerCase().includes(query) ||
      s.transliteration.some((line) => line.toLowerCase().includes(query)) ||
      s.turkishMeaning.some((line) => line.toLowerCase().includes(query));

    if (activeTab === 'favorites') {
      return matchesSearch && favorites.surahs.includes(s.id);
    }
    return matchesSearch;
  });

  const filteredDuas = NAMAZ_DUAS_DATA.filter((d) => {
    const matchesSearch =
      !query ||
      d.title.toLowerCase().includes(query) ||
      d.meaning.toLowerCase().includes(query) ||
      d.transliteration.toLowerCase().includes(query);

    if (activeTab === 'favorites') {
      return matchesSearch && favorites.duas.includes(d.id);
    }
    return matchesSearch;
  });

  const currentReciter =
    HAFIZ_RECITERS.find((r) => r.id === playerState.selectedReciterId) ||
    HAFIZ_RECITERS[0];

  return (
    <div className="space-y-4 pb-28 max-w-2xl mx-auto">
      {/* Featured Hafiz Recitation Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5" />
              <span>Uzman Hafız Tilaveti & Tecvidli Dinleme</span>
            </div>

            <button
              onClick={() => setShowReciterSelector(true)}
              className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Kâri:</span>
              <span className="text-amber-300 font-bold">{currentReciter.name.split(' ')[1] || currentReciter.name}</span>
            </button>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif">
              Sesli Dua ve Ayet Dinleme Modülü
            </h2>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Dünyaca meşhur hafızların kıraatleriyle duaları ve sureleri doğru mahreç ve tecvidle dinleyin. Ayet ayet takip edebilir, yavaş öğrenme moduyla ezberleyebilirsiniz.
            </p>
          </div>

          {/* Quick Controls Bar: Reciter & Learning Speed */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-300 font-medium">Öğrenme Hızı:</span>
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
                {[0.75, 1.0, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => hafizAudioService.setPlaybackRate(rate)}
                    className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                      playerState.playbackRate === rate
                        ? 'bg-emerald-500 text-stone-950'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {rate === 0.75 ? '0.75x (Yavaş)' : `${rate}x`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-300 font-medium">Ezber Tekrarı:</span>
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
                {([1, 3, 'infinite'] as RepeatOption[]).map((opt) => (
                  <button
                    key={String(opt)}
                    onClick={() => hafizAudioService.setRepeatOption(opt)}
                    className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                      playerState.repeatOption === opt
                        ? 'bg-teal-400 text-stone-950'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {opt === 'infinite' ? '∞ Döngü' : `${opt}x`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Interactive Speech Feedback Coach Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 p-4 rounded-3xl border border-emerald-500/30 dark:border-emerald-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-stone-900 dark:text-white">
                Sesli Geri Bildirim & Telaffuz Rehberi
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-stone-950">
                Canlı Ses Analizi
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
              İstediğiniz âyeti veya duayı mikrofona okuyun, tecvid ve mahreç uyumunu anında puanlayıp düzeltme önerileri sunalım.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const fatiha = SURAHS_DATA[0];
            handleOpenPronunciationModal({
              id: '1-1',
              title: `${fatiha.name} · 1. Âyet`,
              arabicText: fatiha.arabicText[0],
              transliteration: fatiha.transliteration[0],
              turkishMeaning: fatiha.turkishMeaning[0],
              surahNumber: 1,
              ayahNumber: 1
            });
          }}
          className="w-full sm:w-auto shrink-0 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Fâtiha ile Test Et</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sure adı, dua, ayet veya anlam ara (örn: İhlas, huzur, nazar)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
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

      {/* Tabs: Sureler / Dualar / Favoriler */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'surahs'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Kur'an Sureleri ({SURAHS_DATA.length})
        </button>
        <button
          onClick={() => setActiveTab('duas')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'duas'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Namaz & Günlük Dualar ({NAMAZ_DUAS_DATA.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'favorites'
              ? 'bg-white dark:bg-stone-800 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Favorilerim ({favorites.surahs.length + favorites.duas.length})</span>
        </button>
      </div>

      {/* SURAHS LIST */}
      {(activeTab === 'surahs' || activeTab === 'favorites') && filteredSurahs.length > 0 && (
        <div className="space-y-3">
          {activeTab === 'favorites' && (
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Kayıtlı Sureler
            </h4>
          )}
          {filteredSurahs.map((surah) => {
            const isFav = favorites.surahs.includes(surah.id);
            const isExpanded = expandedId === surah.id;
            const isPlayingThisSurah =
              playerState.isPlaying &&
              (playerState.currentType === 'surah' || playerState.currentType === 'ayah') &&
              playerState.currentId === surah.id;

            return (
              <div
                key={surah.id}
                className={`bg-white dark:bg-stone-900 border rounded-3xl overflow-hidden shadow-xs transition-all ${
                  isPlayingThisSurah
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200/80 dark:border-stone-800'
                }`}
              >
                {/* Header Card */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : surah.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                      isPlayingThisSurah
                        ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40'
                    }`}>
                      {surah.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <span>{surah.name}</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          ({surah.ayahCount} Âyet · {surah.revelationType})
                        </span>
                        {isPlayingThisSurah && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse">
                            Çalıyor
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                        {surah.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-arabic text-base text-emerald-800 dark:text-emerald-300 hidden sm:block">
                      {surah.arabicName}
                    </p>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-stone-100 dark:border-stone-800 space-y-4 animate-in fade-in duration-200">
                    {/* Action Bar (Hafiz Recitation, Tajweed Tips, Copy, Favorite) */}
                    <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySurah(surah);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isPlayingThisSurah
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {isPlayingThisSurah ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isPlayingThisSurah ? 'Durdur' : 'Hafız Tilaveti Dinle'}</span>
                        </button>

                        {/* Tajweed Tips button if available */}
                        {TAJWEED_TIPS[surah.id] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTajweedModalId(surah.id);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/50 transition-colors cursor-pointer"
                            title="Tecvid & Telaffuz Rehberi"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">Tecvid Notları</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText(
                              surah.id,
                              `${surah.name}\n\n${surah.arabicText.join('\n')}\n\nOkunuşu:\n${surah.transliteration.join('\n')}\n\nMeali:\n${surah.turkishMeaning.join('\n')}`
                            );
                          }}
                          className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                          title="Kopyala"
                        >
                          {copiedId === surah.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteSurah(surah.id);
                          }}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isFav
                              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                          title="Favorilere Ekle"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Verses Render (with Ayah-by-Ayah audio click & sync highlight) */}
                    <div className="space-y-3 bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
                      {surah.arabicText.map((ayah, idx) => {
                        const ayahNumber = idx + 1;
                        const isThisAyahReciting =
                          isPlayingThisSurah && playerState.currentAyah === ayahNumber;

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl transition-all space-y-2 border ${
                              isThisAyahReciting
                                ? 'bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30'
                                : 'bg-white/60 dark:bg-stone-900/40 border-stone-200/40 dark:border-stone-700/40'
                            }`}
                          >
                            {/* Verse Header: Ayah Number & Instant Listen Button */}
                            <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-1.5">
                              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                                {ayahNumber}. Âyet
                              </span>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handlePlayAyah(surah, ayahNumber)}
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                                    isThisAyahReciting
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                                  }`}
                                  title="Bu âyeti hafızdan dinle"
                                >
                                  {isThisAyahReciting ? (
                                    <Volume2 className="w-3 h-3 animate-pulse" />
                                  ) : (
                                    <Play className="w-3 h-3 fill-current" />
                                  )}
                                  <span>{isThisAyahReciting ? 'Okunuyor' : 'Âyeti Dinle'}</span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleOpenPronunciationModal({
                                      id: `${surah.id}-${ayahNumber}`,
                                      title: `${surah.name} · ${ayahNumber}. Âyet`,
                                      arabicText: ayah,
                                      transliteration: surah.transliteration[idx],
                                      turkishMeaning: surah.turkishMeaning[idx],
                                      surahNumber: surah.id === 255 ? 2 : surah.id,
                                      ayahNumber: surah.id === 255 ? 255 : ayahNumber
                                    })
                                  }
                                  className="text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/50 transition-all cursor-pointer"
                                  title="Kendi sesinle oku ve telaffuzunu anında kontrol et"
                                >
                                  <Mic className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span>Telaffuz Kontrolü</span>
                                </button>
                              </div>
                            </div>

                            {/* Arabic Ayah */}
                            <div className="text-right">
                              <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-stone-50 leading-loose">
                                {ayah}
                              </p>
                            </div>

                            {/* Transliteration (Okunuş) */}
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                              {surah.transliteration[idx]}
                            </p>

                            {/* Turkish Meaning */}
                            <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                              {surah.turkishMeaning[idx]}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Virtue info */}
                    {surah.virtue && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>{surah.virtue}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Sponsored Ad Slot (AdMob Native Placement) */}
          <NativeAdCardSlot slotLocation="surahs_feed" />
        </div>
      )}

      {/* DUAS LIST */}
      {(activeTab === 'duas' || activeTab === 'favorites') && filteredDuas.length > 0 && (
        <div className="space-y-3">
          {activeTab === 'favorites' && (
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1 pt-2">
              Kayıtlı Dualar
            </h4>
          )}
          {filteredDuas.map((dua) => {
            const isFav = favorites.duas.includes(dua.id);
            const isPlayingThisDua =
              playerState.isPlaying && playerState.currentId === dua.id;

            return (
              <div
                key={dua.id}
                className={`bg-white dark:bg-stone-900 border rounded-3xl p-5 shadow-xs space-y-3.5 transition-all ${
                  isPlayingThisDua
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-stone-200/80 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <span>{dua.title}</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                        {dua.category === 'namaz' ? 'Namaz Duası' : 'Günlük Dua'}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Tajweed Tips button if available */}
                    {TAJWEED_TIPS[dua.id] && (
                      <button
                        onClick={() => setShowTajweedModalId(dua.id)}
                        className="p-1.5 text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/40 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Telaffuz & Mahreç İpuçları"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold hidden sm:inline">Telaffuz Notu</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleCopyText(
                          dua.id,
                          `${dua.title}\n\n${dua.arabic}\n\nOkunuşu:\n${dua.transliteration}\n\nAnlamı:\n${dua.meaning}`
                        )
                      }
                      className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
                      title="Kopyala"
                    >
                      {copiedId === dua.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleFavoriteDua(dua.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav
                          ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title="Favori"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right py-1">
                  <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-stone-50 leading-loose">
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/50 dark:border-stone-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Okunuşu (Transkripsiyon):
                  </p>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {dua.transliteration}
                  </p>
                </div>

                {/* Meaning */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Anlamı:
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">
                    {dua.meaning}
                  </p>
                </div>

                {/* Audio Recitation Buttons: Pronunciation Audio + Meaning Audio */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayDua(dua)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isPlayingThisDua
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isPlayingThisDua ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isPlayingThisDua ? 'Durdur' : 'Sesli Dinle (Doğru Telaffuz)'}</span>
                    </button>

                    <button
                      onClick={() => handlePlayMeaningSpeech(dua.title, dua.meaning)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                      title="Türkçe Mealini Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-500 inline mr-1" />
                      <span>Meal Dinle</span>
                    </button>

                    <button
                      onClick={() =>
                        handleOpenPronunciationModal({
                          id: dua.id,
                          title: dua.title,
                          arabicText: dua.arabic,
                          transliteration: dua.transliteration,
                          turkishMeaning: dua.meaning,
                          surahNumber: dua.id === 'rabbena_atina' ? 2 : dua.id === 'rabbena_agfirli' ? 14 : undefined,
                          ayahNumber: dua.id === 'rabbena_atina' ? 201 : dua.id === 'rabbena_agfirli' ? 41 : undefined
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/50 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Kendi sesinle oku ve telaffuz analizini gör"
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Telaffuzumu Kontrol Et</span>
                    </button>
                  </div>

                  {dua.source && (
                    <span className="text-[10px] text-stone-400 italic">
                      {dua.source}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tajweed & Pronunciation Guide Modal */}
      {showTajweedModalId && TAJWEED_TIPS[showTajweedModalId] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    {TAJWEED_TIPS[showTajweedModalId].title}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Doğru telaffuz, mahreç ve tecvid kuralları
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTajweedModalId(null)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {TAJWEED_TIPS[showTajweedModalId].tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTajweedModalId(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reciter Selector Modal */}
      {showReciterSelector && (
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
                onClick={() => setShowReciterSelector(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {HAFIZ_RECITERS.map((reciter) => {
                const isSelected = playerState.selectedReciterId === reciter.id;
                return (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      hafizAudioService.setReciter(reciter.id);
                      setShowReciterSelector(false);
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
          </div>
        </div>
      )}

      {/* Şık AdMob Banner Reklam Alanı (Placeholder) - Ekranın En Altı */}
      <div className="pt-2">
        <AdBannerSlot slotLocation="kuran_dualar_bottom_admob_banner" />
      </div>

      {/* Pronunciation Analysis & Speech Feedback Modal */}
      <PronunciationFeedbackModal
        isOpen={pronunciationModalOpen}
        onClose={() => setPronunciationModalOpen(false)}
        target={pronunciationTarget}
        onNextTarget={handleNextPronunciationTarget}
        hasNextTarget={
          !!(
            pronunciationTarget &&
            pronunciationTarget.surahNumber &&
            pronunciationTarget.ayahNumber &&
            (() => {
              const currentSurah = SURAHS_DATA.find((s) => s.id === pronunciationTarget.surahNumber);
              return !!(currentSurah && pronunciationTarget.ayahNumber < currentSurah.ayahCount);
            })()
          )
        }
      />
    </div>
  );
};
