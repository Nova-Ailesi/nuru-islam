import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkCheck,
  PhoneCall,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  X,
  Filter
} from 'lucide-react';
import {
  DIYANET_FETVALARI,
  FETVA_CATEGORIES,
  FetvaItem
} from '../data/diyanetFetvalari';

const BOOKMARKS_STORAGE_KEY = 'nur_diyanet_fetva_bookmarks_v1';

// Helper for Turkish case-insensitive search
const normalizeTurkish = (text: string): string => {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const IslamicQAView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(DIYANET_FETVALARI[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Bookmarks in LocalStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleCopy = (fetva: FetvaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Soru: ${fetva.question}\n\nHüküm: ${fetva.summary}\n\nDetaylı Cevap:\n${fetva.answer}\n\nKaynak: ${fetva.source} - T.C. Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu`;
    navigator.clipboard.writeText(text);
    setCopiedId(fetva.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered list
  const filteredFetvalar = useMemo(() => {
    const q = normalizeTurkish(searchQuery.trim());

    return DIYANET_FETVALARI.filter((item) => {
      if (onlyBookmarks && !bookmarks.includes(item.id)) {
        return false;
      }

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      const inQuestion = normalizeTurkish(item.question).includes(q);
      const inSummary = normalizeTurkish(item.summary).includes(q);
      const inAnswer = normalizeTurkish(item.answer).includes(q);
      const inKeywords = item.keywords.some((kw) => normalizeTurkish(kw).includes(q));

      return inQuestion || inSummary || inAnswer || inKeywords;
    });
  }, [searchQuery, selectedCategory, onlyBookmarks, bookmarks]);

  const quickPills = [
    'Aşı orucu bozar mı?',
    'Kaza namazı varken sünnet',
    'Astım spreyi',
    'Zekât kimlere verilir?',
    'Organ bağışı',
    'Nazar duaları'
  ];

  const getVerdictStyle = (verdict: FetvaItem['verdict']) => {
    switch (verdict) {
      case 'bozmaz':
      case 'caiz':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'bozar':
      case 'caiz_degil':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'mekruh':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-emerald-950 to-stone-900 border border-teal-800/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-300">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <span>T.C. Diyanet Din İşleri Yüksek Kurulu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            İslami Soru & Cevap Modülü
          </h2>
          <p className="text-xs text-teal-100/90 leading-relaxed max-w-lg">
            İbadet, oruç, namaz, zekât, tıp ve modern finans konularında Din İşleri Yüksek Kurulu'nun muteber fetvaları ve resmi hükümleri.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Fetva veya soru ara... (örn: aşı, kaza namazı, altın nisap, göz damlası)"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Quick Search Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Popüler:
        </span>
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => {
              setSearchQuery(pill);
              setSelectedCategory('all');
            }}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950/40 border border-stone-200/60 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Category Tabs & Bookmarks Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {FETVA_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id && !onlyBookmarks;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOnlyBookmarks(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Bookmark Filter Pill */}
        <button
          onClick={() => setOnlyBookmarks(!onlyBookmarks)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
            onlyBookmarks
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Kayıtlı ({bookmarks.length})</span>
        </button>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-500">
        <span>
          Toplam <strong className="text-stone-800 dark:text-stone-200">{filteredFetvalar.length}</strong> fetva listeleniyor
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Aramayı Temizle
          </button>
        )}
      </div>

      {/* Questions & Fatwa Accordion List */}
      <div className="space-y-3">
        {filteredFetvalar.map((fetva) => {
          const isExpanded = expandedId === fetva.id;
          const isBookmarked = bookmarks.includes(fetva.id);

          return (
            <div
              key={fetva.id}
              className={`bg-white dark:bg-stone-900 border rounded-3xl p-4 sm:p-5 shadow-xs transition-all ${
                isExpanded
                  ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/15'
                  : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Question Header (Clickable Accordion) */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : fetva.id)}
                className="cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {fetva.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getVerdictStyle(fetva.verdict)}`}>
                      {fetva.verdictBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => toggleBookmark(fetva.id, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      title={isBookmarked ? 'Kaydedildi' : 'Kaydet'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleCopy(fetva, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Kopyala"
                    >
                      {copiedId === fetva.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    <div className="p-1 text-stone-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-snug">
                  {fetva.question}
                </h3>

                {/* Concise Summary Preview */}
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                  {fetva.summary}
                </p>
              </div>

              {/* Expanded Detailed Fatwa Body */}
              {isExpanded && (
                <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800 space-y-3 animate-in fade-in">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Din İşleri Yüksek Kurulu Hükmü ve Delilleri:</span>
                    </h4>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {fetva.answer}
                    </p>
                  </div>

                  {/* Source and Official Diyanet Link */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-[11px] text-stone-500">
                    <span className="italic truncate max-w-sm">
                      {fetva.source}
                    </span>

                    <a
                      href={fetva.kurulUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline shrink-0"
                    >
                      <span>Resmi Kurulda İncele</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State when no results */}
        {filteredFetvalar.length === 0 && (
          <div className="text-center py-10 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 dark:text-white">
              Aradığınız soruya uygun fetva bulunamadı
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Farklı bir anahtar kelime deneyebilir veya T.C. Diyanet İşleri Başkanlığı'nın Alo 190 Fetva Hattını doğrudan arayabilirsiniz.
            </p>
            <div className="pt-2">
              <a
                href="tel:190"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-500 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Alo 190 Fetva Hattını Ara</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Alo 190 Direct Contact Support Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
              Sorunuzun cevabını bulamadınız mı?
            </h4>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
              Diyanet Alo 190 Dini Danışma Hattı hafta içi ücretsiz olarak sorularınızı cevaplar.
            </p>
          </div>
        </div>

        <a
          href="tel:190"
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>190'ı Ara</span>
        </a>
      </div>
    </div>
  );
};
