import React, { useState, useEffect, useMemo } from 'react';
import {
  BookmarkCheck,
  Plus,
  Heart,
  Trash2,
  Sparkles,
  Pin,
  Clock,
  Check,
  Palette,
  BookOpen,
  FolderPlus,
  Filter,
  X,
  Layers,
  Search,
  Tag,
  Edit3,
  Moon,
  Sun,
  Shield,
  Star
} from 'lucide-react';
import { UserCustomDua, DuaCollection } from '../types';
import { audioService } from '../services/audioService';
import { DuaCardStudioModal } from './DuaCardStudioModal';
import { DUA_TEMPLATES, DuaTemplateItem } from '../data/duaTemplates';

const DEFAULT_USER_DUAS: UserCustomDua[] = [
  {
    id: "1",
    title: "Güne Bereketle Başlama (Sabah Duası)",
    text: "Allah'ım! Senin lütfunla sabaha erdik, Senin lütfunla akşama kavuşuruz. Senin inayetinle yaşar, Senin emrinle ölürüz. Dönüş de ancak Sanadır.",
    arabicText: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    intention: "Güne Allah'ın zikriyle uyanmak, kaza ve belalardan korunmak niyetiyle.",
    category: "Sabah Duaları",
    tags: ["Sabah Duaları", "Bereket", "Şükür"],
    listId: "sabah",
    createdAt: "2026-10-01",
    pinned: true
  },
  {
    id: "2",
    title: "Gece Emniyet ve Huzur Duası",
    text: "Rabbim! Senin isminle yanımı yatağıma koydum ve yine Senin yardımınla kalkarım. Eğer ruhumu alırsan ona merhamet eyle; eğer geri gönderirsen salih kullarını koruduğun gibi muhafaza eyle.",
    arabicText: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا",
    intention: "Gece uykusunda vesvese ve kötülüklerden korunmak, huzurla uyanmak niyetiyle.",
    category: "Gece Duaları",
    tags: ["Gece Duaları", "Uyku", "Huzur", "Korunma"],
    listId: "gece",
    createdAt: "2026-10-01",
    pinned: true
  },
  {
    id: "3",
    title: "Hacet ve Murâd Duası (İstekler İçin)",
    text: "Hilim ve kerem sahibi Allah'tan başka ilah yoktur. Yüce Arş'ın Rabbi olan Allah'ı noksan sıfatlardan tenzih ederim. Allah'ım! Rahmetinin vesilelerini, bağışlanmanın tecellilerini ve her meşru isteğimin hayırla nasip olmasını dilerim.",
    arabicText: "لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ",
    intention: "Dünya ve ahirete ait meşru bir dilek ve muradın husûlü niyetiyle.",
    category: "İstekler",
    tags: ["İstekler", "Hacet", "Dilek"],
    listId: "istekler",
    createdAt: "2026-10-02",
    pinned: false
  },
  {
    id: "4",
    title: "Dünya ve Ahiret Saadeti (Rabbenâ Âtinâ)",
    text: "Rabbimiz! Bize dünyada da iyilik ve güzellik ver, ahirette de iyilik ve güzellik ver ve bizi cehennem azabından koru.",
    arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    intention: "Dünya ve ukbâ saadeti niyetiyle.",
    category: "Sabah Duaları",
    tags: ["Sabah Duaları", "Gece Duaları", "İstekler"],
    listId: "sabah",
    createdAt: "2026-10-02",
    pinned: true
  },
  {
    id: "5",
    title: "Ailem ve Sevdiklerim İçin Sıhhat Duası",
    text: "Allah'ım! Anne ve babama, eşime ve evlatlarıma hayırlı uzun ömürler, kalıcı iman ve beden sıhhati ihsan eyle. Hanemize huzur, rızkımıza bereket ver.",
    arabicText: "اللَّهُمَّ بَارِكْ لَنَا فِي أَهْلِنَا وَارْزُقْنَا مِنْ حَيْثُ لَا نَحْتَسِبُ",
    intention: "Aile fertlerinin dünya ve ahiret selameti niyetiyle.",
    category: "Ailem İçin",
    tags: ["Ailem", "Şifa", "Huzur"],
    listId: "aile",
    createdAt: "2026-10-03",
    pinned: false
  }
];

const DEFAULT_COLLECTIONS: DuaCollection[] = [
  { id: 'all', name: 'Tüm Dualar', icon: 'Sparkles' },
  { id: 'sabah', name: 'Sabah Duaları', icon: 'Sun' },
  { id: 'gece', name: 'Gece Duaları', icon: 'Moon' },
  { id: 'istekler', name: 'İstekler', icon: 'Star' },
  { id: 'sifa', name: 'Şifa & Hacet', icon: 'Sparkles' },
  { id: 'aile', name: 'Ailem İçin', icon: 'Heart' },
  { id: 'istigfar', name: 'Tevbe & İstiğfar', icon: 'BookmarkCheck' }
];

const PRESET_POPULAR_TAGS = [
  'Sabah Duaları',
  'Gece Duaları',
  'İstekler',
  'Şifa',
  'Hacet',
  'Ailem',
  'Huzur',
  'Tevbe',
  'Şükür',
  'Korunma',
  'Bereket',
  'Rızık'
];

export const PersonalDuaBookView: React.FC = () => {
  const [userDuas, setUserDuas] = useState<UserCustomDua[]>(() => {
    const saved = localStorage.getItem('user_personal_duas');
    return saved ? JSON.parse(saved) : DEFAULT_USER_DUAS;
  });

  const [collections, setCollections] = useState<DuaCollection[]>(() => {
    const saved = localStorage.getItem('user_dua_collections');
    if (saved) {
      const parsed: DuaCollection[] = JSON.parse(saved);
      // Ensure 'sabah', 'gece', 'istekler' categories exist
      const hasSabah = parsed.some((c) => c.id === 'sabah' || c.name === 'Sabah Duaları');
      const hasGece = parsed.some((c) => c.id === 'gece' || c.name === 'Gece Duaları');
      const hasIstek = parsed.some((c) => c.id === 'istekler' || c.name === 'İstekler');
      if (!hasSabah || !hasGece || !hasIstek) {
        return DEFAULT_COLLECTIONS;
      }
      return parsed;
    }
    return DEFAULT_COLLECTIONS;
  });

  const [aminCounts, setAminCounts] = useState<{ [id: string]: number }>(() => {
    const saved = localStorage.getItem('user_duas_amin_counts');
    return saved ? JSON.parse(saved) : { "1": 24, "2": 19, "3": 15, "4": 31, "5": 18 };
  });

  // Active filter state
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDua, setEditingDua] = useState<UserCustomDua | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [cardStudioDua, setCardStudioDua] = useState<UserCustomDua | null>(null);

  // New Dua Form State
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newArabicText, setNewArabicText] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [newListId, setNewListId] = useState('sabah');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sabah Duaları']);
  const [customTagInput, setCustomTagInput] = useState('');

  // New Collection Form State
  const [newListName, setNewListName] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('user_personal_duas', JSON.stringify(userDuas));
  }, [userDuas]);

  useEffect(() => {
    localStorage.setItem('user_dua_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('user_duas_amin_counts', JSON.stringify(aminCounts));
  }, [aminCounts]);

  // Aggregate all unique tags currently in user duas + popular presets
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>(PRESET_POPULAR_TAGS);
    userDuas.forEach((d) => {
      if (d.tags && Array.isArray(d.tags)) {
        d.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [userDuas]);

  const handleSayAmin = (id: string) => {
    audioService.playTasbihClick();
    setAminCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleAddTagToForm = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTagFromForm = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  const handleOpenAddModal = (defaultCategory?: string) => {
    setNewTitle('');
    setNewText('');
    setNewArabicText('');
    setNewIntention('');
    
    // Choose appropriate list id
    const listId = defaultCategory && collections.some((c) => c.id === defaultCategory)
      ? defaultCategory
      : selectedListId !== 'all'
      ? selectedListId
      : 'sabah';
      
    setNewListId(listId);
    
    const targetCol = collections.find((c) => c.id === listId);
    if (targetCol && targetCol.id !== 'all') {
      setSelectedTags([targetCol.name]);
    } else {
      setSelectedTags(['Sabah Duaları']);
    }
    setShowAddModal(true);
  };

  const handleSaveDua = () => {
    if (!newTitle.trim() || !newText.trim()) return;
    const col = collections.find((c) => c.id === newListId);
    const categoryName = col?.name || 'Kişisel İstekler';

    // If tag list doesn't include the category name, ensure it's there
    const finalTags = [...selectedTags];
    if (!finalTags.includes(categoryName)) {
      finalTags.unshift(categoryName);
    }

    if (editingDua) {
      // Update existing
      setUserDuas(
        userDuas.map((d) =>
          d.id === editingDua.id
            ? {
                ...d,
                title: newTitle.trim(),
                text: newText.trim(),
                arabicText: newArabicText.trim() || undefined,
                intention: newIntention.trim() || undefined,
                category: categoryName,
                listId: newListId,
                tags: finalTags
              }
            : d
        )
      );
      setEditingDua(null);
    } else {
      // Create new
      const newItem: UserCustomDua = {
        id: `dua_${Date.now()}`,
        title: newTitle.trim(),
        text: newText.trim(),
        arabicText: newArabicText.trim() || undefined,
        intention: newIntention.trim() || undefined,
        category: categoryName,
        tags: finalTags,
        listId: newListId,
        createdAt: new Date().toISOString().split('T')[0],
        pinned: false
      };
      setUserDuas([newItem, ...userDuas]);
    }

    setShowAddModal(false);
  };

  const handleOpenEditModal = (dua: UserCustomDua) => {
    setEditingDua(dua);
    setNewTitle(dua.title);
    setNewText(dua.text);
    setNewArabicText(dua.arabicText || '');
    setNewIntention(dua.intention || '');
    setNewListId(dua.listId || 'sabah');
    setSelectedTags(dua.tags || [dua.category || 'Sabah Duaları']);
    setShowAddModal(true);
  };

  const handleAddFromTemplate = (tpl: DuaTemplateItem) => {
    const targetListId = selectedListId !== 'all' ? selectedListId : 'sabah';
    const col = collections.find((c) => c.id === targetListId);
    const categoryName = tpl.category || col?.name || 'Sabah Duaları';

    const newItem: UserCustomDua = {
      id: `dua_${Date.now()}_${tpl.id}`,
      title: tpl.title,
      text: tpl.text,
      arabicText: tpl.arabicText,
      transliteration: tpl.transliteration,
      intention: `${tpl.source} • ${tpl.intention}`,
      category: categoryName,
      tags: tpl.tags || [categoryName],
      listId: targetListId,
      createdAt: new Date().toISOString().split('T')[0],
      pinned: false
    };

    setUserDuas([newItem, ...userDuas]);
    setShowTemplateModal(false);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    const cleanName = newListName.trim();
    const newCol: DuaCollection = {
      id: `list_${cleanName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: cleanName,
      icon: 'BookmarkCheck'
    };
    setCollections([...collections, newCol]);
    setSelectedListId(newCol.id);
    setNewListName('');
    setShowNewListModal(false);
  };

  const handleDeleteList = (id: string) => {
    if (['all', 'sabah', 'gece', 'istekler'].includes(id)) return; // protected
    setCollections(collections.filter((c) => c.id !== id));
    if (selectedListId === id) {
      setSelectedListId('all');
    }
  };

  const handleDeleteDua = (id: string) => {
    setUserDuas(userDuas.filter((d) => d.id !== id));
  };

  const togglePin = (id: string) => {
    setUserDuas(
      userDuas.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d))
    );
  };

  // Filtered duas by category, tags, and search query
  const filteredDuas = useMemo(() => {
    return userDuas.filter((dua) => {
      // 1. Category / Collection Filter
      if (selectedListId !== 'all') {
        const col = collections.find((c) => c.id === selectedListId);
        const matchesListId = dua.listId === selectedListId;
        const matchesCategoryName = col && dua.category === col.name;
        const matchesTags = col && Array.isArray(dua.tags) && dua.tags.includes(col.name);
        if (!matchesListId && !matchesCategoryName && !matchesTags) {
          return false;
        }
      }

      // 2. Specific Tag Filter
      if (selectedTag) {
        if (!dua.tags || !dua.tags.includes(selectedTag)) {
          return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = dua.title.toLowerCase().includes(q);
        const inText = dua.text.toLowerCase().includes(q);
        const inIntention = dua.intention ? dua.intention.toLowerCase().includes(q) : false;
        const inCategory = dua.category ? dua.category.toLowerCase().includes(q) : false;
        const inTags = dua.tags ? dua.tags.some((t) => t.toLowerCase().includes(q)) : false;
        if (!inTitle && !inText && !inIntention && !inCategory && !inTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [userDuas, selectedListId, selectedTag, searchQuery, collections]);

  const renderCollectionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Moon':
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Star':
        return <Star className="w-3.5 h-3.5 text-amber-400" />;
      case 'Heart':
        return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* 1. Top Decorative Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border border-emerald-800/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-300">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <span>Kişisel Dua Defterim & Dua Kartları</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Dua Defterim & Kart Stüdyosu
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg">
            Dualarınızı <strong>Sabah Duaları</strong>, <strong>Gece Duaları</strong> ve <strong>İstekler</strong> gibi kategorilerle etiketleyin; hat sanatı ve temalarla estetik <strong>Dua Kartları</strong> oluşturup cihazınıza indirin.
          </p>

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Özel Dua Ekle</span>
            </button>

            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-400/30 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Hazır Şablonlar</span>
            </button>

            <button
              onClick={() => setShowNewListModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/15 text-stone-200 border border-stone-600/40 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Kategori Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Active Filters Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Dua başlığı, metni, niyet veya etiket ara..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Category / Collection Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kategoriler</span>
          </span>
          <button
            onClick={() => setShowNewListModal(true)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Yeni Kategori</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {collections.map((col) => {
            const isSelected = selectedListId === col.id;
            const count = col.id === 'all'
              ? userDuas.length
              : userDuas.filter((d) => d.listId === col.id || d.category === col.name || (d.tags && d.tags.includes(col.name))).length;

            return (
              <button
                key={col.id}
                onClick={() => {
                  setSelectedListId(col.id);
                  setSelectedTag(null); // reset tag filter when switching category
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-1 ring-emerald-500/50'
                    : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {renderCollectionIcon(col.icon)}
                <span>{col.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tag Filter Chips Carousel */}
      <div className="bg-stone-50/70 dark:bg-stone-900/60 p-2.5 rounded-2xl border border-stone-200/60 dark:border-stone-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Etikete Göre Filtrele:</span>
          </span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-[10px]"
            >
              <span>Filtreyi Temizle</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {allAvailableTags.map((tag) => {
            const isTagActive = selectedTag === tag;
            const tagCount = userDuas.filter((d) => d.tags && d.tags.includes(tag)).length;
            if (tagCount === 0 && !['Sabah Duaları', 'Gece Duaları', 'İstekler'].includes(tag)) {
              return null;
            }

            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 border shrink-0 ${
                  isTagActive
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-400'
                }`}
              >
                <span>#{tag}</span>
                <span className={`text-[9px] px-1 rounded-full ${isTagActive ? 'bg-amber-600 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-400'}`}>
                  {tagCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicators Summary */}
      {(selectedListId !== 'all' || selectedTag || searchQuery) && (
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1 pt-0.5">
          <span>
            {filteredDuas.length} dua bulundu
            {selectedTag && <> • Etiket: <strong>#{selectedTag}</strong></>}
            {selectedListId !== 'all' && <> • Kategori: <strong>{collections.find((c) => c.id === selectedListId)?.name}</strong></>}
          </span>
          <button
            onClick={() => {
              setSelectedListId('all');
              setSelectedTag(null);
              setSearchQuery('');
            }}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Tümünü Göster
          </button>
        </div>
      )}

      {/* 5. Duas List Cards */}
      <div className="space-y-3">
        {filteredDuas.map((dua) => {
          const amins = aminCounts[dua.id] || 0;
          return (
            <div
              key={dua.id}
              className={`bg-white dark:bg-stone-900 border rounded-3xl p-5 shadow-xs space-y-3 transition-all ${
                dua.pinned
                  ? 'border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/20'
                  : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Header: Title, Category Badge, Actions */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  {dua.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />}
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                    {dua.title}
                  </h3>
                  {dua.category && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
                      {dua.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* DUA KARTI OLUŞTUR BUTTON */}
                  <button
                    onClick={() => setCardStudioDua(dua)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300/50 font-bold text-xs cursor-pointer transition-colors"
                    title="Bu duadan estetik Dua Kartı oluştur"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Dua Kartı</span>
                  </button>

                  {/* Edit Dua */}
                  <button
                    onClick={() => handleOpenEditModal(dua)}
                    className="p-1.5 text-stone-400 hover:text-emerald-600 cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Düzenle / Etiket Ekle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Pin Toggle */}
                  <button
                    onClick={() => togglePin(dua.id)}
                    className="p-1.5 text-stone-400 hover:text-amber-500 cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title={dua.pinned ? 'Sabitlemeyi Kaldır' : 'Başa Sabitle'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${dua.pinned ? 'text-amber-500 fill-current' : ''}`} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteDua(dua.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-500 cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional Arabic Text */}
              {dua.arabicText && (
                <p className="text-base sm:text-lg font-bold font-serif text-emerald-800 dark:text-emerald-300 leading-relaxed text-center py-1">
                  {dua.arabicText}
                </p>
              )}

              {/* Dua Main Text */}
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed italic">
                "{dua.text}"
              </p>

              {/* Intention / Niyet */}
              {dua.intention && (
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/40 dark:border-emerald-900/30">
                  <span className="font-semibold">Niyet & Kaynak: </span>
                  {dua.intention}
                </div>
              )}

              {/* Tags Pills Row on Card */}
              {dua.tags && dua.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                    <Tag className="w-3 h-3 text-stone-400" />
                  </span>
                  {dua.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        selectedTag === t
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                      title={`#${t} etiketli duaları filtrele`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}

              {/* Footer: Amin button & Date & Studio Shortcut */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-[10px] text-stone-400 font-mono">
                  {dua.createdAt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSayAmin(dua.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-300/40 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                    <span>Âmîn ({amins})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredDuas.length === 0 && (
          <div className="text-center py-10 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 dark:text-white">
              {searchQuery || selectedTag
                ? 'Aradığınız kriterlere uygun dua bulunamadı'
                : 'Bu kategoride henüz dua bulunmuyor'}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedTag
                ? 'Filtreleri temizleyerek diğer duaları görebilir veya bu kategoriye yeni bir dua ekleyebilirsiniz.'
                : 'Özel niyetlerinizi yazabilir veya Kur\'an ve Sünnet\'teki hazır seçkin dualardan bu kategoriye ekleyebilirsiniz.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchQuery('');
                    setSelectedListId('all');
                  }}
                  className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              )}
              <button
                onClick={() => handleOpenAddModal(selectedListId !== 'all' ? selectedListId : 'sabah')}
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Bu Kategoriye Dua Yaz
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Hazır Şablonlar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Add / Edit Custom Dua Modal with Tagging System */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5 text-left my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{editingDua ? 'Duayı ve Etiketleri Düzenle' : 'Yeni Özel Dua Ekle'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Dua Başlığı *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: Sabah Bereket Duası, Gece Huzur Duası, Sınav Başarısı"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Ana Dua Kategorisi *
              </label>
              <select
                value={newListId}
                onChange={(e) => {
                  const id = e.target.value;
                  setNewListId(id);
                  const col = collections.find((c) => c.id === id);
                  if (col && !selectedTags.includes(col.name)) {
                    setSelectedTags([...selectedTags, col.name]);
                  }
                }}
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              >
                {collections
                  .filter((c) => c.id !== 'all')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Tagging System Section */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dua Etiketleri (Filtreleme İçin)</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {selectedTags.length} etiket seçildi
                </span>
              </label>

              {/* Selected Tag Badges */}
              <div className="flex items-center gap-1.5 flex-wrap min-h-6">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTagFromForm(tag)}
                      className="hover:text-rose-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTagToForm(customTagInput);
                    }
                  }}
                  placeholder="Yeni etiket yaz (örn: Şifa, Hacet, Yolculuk)..."
                  className="flex-1 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddTagToForm(customTagInput)}
                  className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 hover:text-white text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  + Ekle
                </button>
              </div>

              {/* Quick Tag Suggestions Chips */}
              <div className="pt-1">
                <span className="text-[10px] text-stone-400 block mb-1">
                  Hızlı Etiket Önerileri:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {['Sabah Duaları', 'Gece Duaları', 'İstekler', 'Şifa', 'Hacet', 'Ailem', 'Huzur', 'Tevbe', 'Şükür', 'Korunma', 'Rızık'].map((sug) => {
                    const isSelected = selectedTags.includes(sug);
                    return (
                      <button
                        type="button"
                        key={sug}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveTagFromForm(sug);
                          } else {
                            handleAddTagToForm(sug);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-400'
                        }`}
                      >
                        +{sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Arapça Metin (İsteğe Bağlı - Hat Sanatında Gösterilir)
              </label>
              <textarea
                value={newArabicText}
                onChange={(e) => setNewArabicText(e.target.value)}
                rows={2}
                placeholder="Örn: رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً..."
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-serif text-right focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Dua Metni & Türkçe Anlamı *
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                placeholder="Rabbimiz! Bize dünyada da iyilik ve güzellik ver..."
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Niyet veya Kaynak Notu
              </label>
              <input
                type="text"
                value={newIntention}
                onChange={(e) => setNewIntention(e.target.value)}
                placeholder="Örn: Sabah namazından sonra okunacak, Şifa niyetiyle"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 text-stone-500 text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveDua}
                disabled={!newTitle.trim() || !newText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {editingDua ? 'Güncelle ve Kaydet' : 'Duayı Listeme Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. New Category / Collection Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-emerald-600" />
                <span>Yeni Dua Kategorisi Oluştur</span>
              </h3>
              <button
                onClick={() => setShowNewListModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                Kategori veya Liste Adı
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateList();
                  }
                }}
                placeholder="Örn: Sabah Duaları, Gece Duaları, İstekler"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-500 block">
                Önerilen Popüler Kategoriler:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {['Sabah Duaları', 'Gece Duaları', 'İstekler', 'Cuma Duaları', 'İmtihan Duaları', 'Rızık & Bereket'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setNewListName(p)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowNewListModal(false)}
                className="px-3.5 py-2 text-stone-500 text-xs font-semibold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Kategoriyi Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Dua Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-3.5 text-left my-auto max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Seçkin Kur'an ve Sünnet Duaları</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  İstediğiniz duayı tek dokunuşla kendi dua listenize ekleyin.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {DUA_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/70 space-y-2 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                      {tpl.title}
                    </h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                      {tpl.category}
                    </span>
                  </div>

                  <p className="text-sm font-serif font-bold text-emerald-800 dark:text-emerald-300 text-right leading-relaxed">
                    {tpl.arabicText}
                  </p>

                  <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                    "{tpl.text}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                    <span>{tpl.source}</span>
                    <button
                      onClick={() => handleAddFromTemplate(tpl)}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Listeme Ekle</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Aesthetic Dua Card Studio Modal */}
      <DuaCardStudioModal
        dua={cardStudioDua}
        isOpen={!!cardStudioDua}
        onClose={() => setCardStudioDua(null)}
      />
    </div>
  );
};
