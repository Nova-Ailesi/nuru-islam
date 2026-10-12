import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Vibrate,
  Bell,
  Plus,
  Check,
  ChevronDown,
  Trash2,
  Clock
} from 'lucide-react';
import { DhikrItem } from '../types';
import { audioService } from '../services/audioService';

const DEFAULT_DHIKRS: DhikrItem[] = [
  {
    id: "subhanallah",
    name: "Sübhânallâh",
    arabic: "سُبْحَانَ اللَّهِ",
    meaning: "Allah her türlü noksan sıfattan münezzehtir.",
    target: 33,
    currentCount: 0,
    virtue: "Peygamber Efendimiz (s.a.v.): 'Kim günde 100 kere Sübhanallahi ve bihamdihi derse günahları deniz köpüğü kadar da olsa bağışlanır.'"
  },
  {
    id: "elhamdulillah",
    name: "Elhamdülillâh",
    arabic: "الْحَمْدُ لِلَّهِ",
    meaning: "Hamd ve şükür alemlerin Rabbi olan Allah'a mahsustur.",
    target: 33,
    currentCount: 0,
    virtue: "Mizanı dolduran en faziletli zikirdir."
  },
  {
    id: "allahu_ekber",
    name: "Allâhu Ekber",
    arabic: "اللَّهُ أَكْبَرُ",
    meaning: "Allah en büyüktür, şanı her şeyden yücedir.",
    target: 33,
    currentCount: 0,
    virtue: "Göklerle yer arasını dolduracak kadar büyük ecri vardır."
  },
  {
    id: "tevhid",
    name: "Lâ ilâhe illallâh",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    meaning: "Allah'tan başka ilah yoktur.",
    target: 100,
    currentCount: 0,
    virtue: "Zikrin en faziletlisi Lâ ilâhe illallâh'tır."
  },
  {
    id: "istigfar",
    name: "Estağfirullâh el-Azîm",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    meaning: "Yüce olan Allah'tan mağfiret ve bağışlanma dilerim.",
    target: 100,
    currentCount: 0,
    virtue: "Dertlerden kurtuluş ve rızık genişliği getirir."
  },
  {
    id: "salavat",
    name: "Salavât-ı Şerîfe",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ",
    meaning: "Allah'ım! Efendimiz Muhammed'e ve âline rahmet eyle.",
    target: 100,
    currentCount: 0,
    virtue: "Kim Peygamberimize 1 salavat getirirse Allah ona 10 rahmet indirir."
  }
];

interface ZikirmatikProps {
  onDhikrCountUpdated?: (totalCount: number) => void;
}

export const ZikirmatikView: React.FC<ZikirmatikProps> = ({ onDhikrCountUpdated }) => {
  const [dhikrs, setDhikrs] = useState<DhikrItem[]>(() => {
    const saved = localStorage.getItem('user_dhikrs_list');
    return saved ? JSON.parse(saved) : DEFAULT_DHIKRS;
  });

  const [activeDhikrId, setActiveDhikrId] = useState<string>(dhikrs[0]?.id || 'subhanallah');
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isVibrateOn, setIsVibrateOn] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem('dhikr_reminder_time') || "20:00";
  });
  const [reminderActive, setReminderActive] = useState<boolean>(() => {
    return localStorage.getItem('dhikr_reminder_active') === 'true';
  });

  // Custom Dhikr Form State
  const [newDhikrName, setNewDhikrName] = useState('');
  const [newDhikrArabic, setNewDhikrArabic] = useState('');
  const [newDhikrMeaning, setNewDhikrMeaning] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState(33);

  const activeDhikr = dhikrs.find((d) => d.id === activeDhikrId) || dhikrs[0];

  useEffect(() => {
    localStorage.setItem('user_dhikrs_list', JSON.stringify(dhikrs));
  }, [dhikrs]);

  const handleTap = () => {
    // Sound
    if (isSoundOn) {
      audioService.playTasbihClick();
    }
    // Haptic Vibrate
    if (isVibrateOn && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }

    const nextCount = activeDhikr.currentCount + 1;
    const isTargetHit = nextCount === activeDhikr.target;

    setDhikrs((prev) =>
      prev.map((d) => (d.id === activeDhikr.id ? { ...d, currentCount: nextCount } : d))
    );

    if (onDhikrCountUpdated) {
      onDhikrCountUpdated(1);
    }

    if (isTargetHit) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (isVibrateOn && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 150]);
        } catch {
          // ignore
        }
      }
    }
  };

  const handleReset = () => {
    setDhikrs((prev) =>
      prev.map((d) => (d.id === activeDhikr.id ? { ...d, currentCount: 0 } : d))
    );
  };

  const handleAddCustomDhikr = () => {
    if (!newDhikrName.trim()) return;
    const newId = `custom_${Date.now()}`;
    const newItem: DhikrItem = {
      id: newId,
      name: newDhikrName.trim(),
      arabic: newDhikrArabic.trim() || newDhikrName.trim(),
      meaning: newDhikrMeaning.trim() || "Özel zikir niyeti.",
      target: Number(newDhikrTarget) || 33,
      currentCount: 0,
      virtue: "Kişisel günlük zikir hedefi."
    };

    const updated = [...dhikrs, newItem];
    setDhikrs(updated);
    setActiveDhikrId(newId);
    setShowAddModal(false);
    setNewDhikrName('');
    setNewDhikrArabic('');
    setNewDhikrMeaning('');
  };

  const handleSaveReminder = async () => {
    setReminderError(null);
    const granted = await audioService.requestNotificationPermission();
    if (granted) {
      localStorage.setItem('dhikr_reminder_time', reminderTime);
      localStorage.setItem('dhikr_reminder_active', 'true');
      setReminderActive(true);
      setShowReminderModal(false);
      audioService.sendNotification(
        "Zikir Hatırlatıcısı Kuruldu",
        `Her gün saat ${reminderTime}'de günlük zikirleriniz hatırlatılacaktır.`
      );
    } else {
      setReminderError("Bildirim izni verilmediği için sistem hatırlatıcısı etkinleştirilemedi. Tarayıcı ayarlarından bildirimlere izin verebilirsiniz.");
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round((activeDhikr.currentCount / activeDhikr.target) * 100)
  );

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto text-center">
      {/* Top Dhikr Selector Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Seçili Zikir
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-white truncate">
              {activeDhikr.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowReminderModal(true)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                reminderActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300 dark:border-emerald-800'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
              }`}
              title="Günlük Zikir Hatırlatıcısı"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Yeni Zikir Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dhikr Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {dhikrs.map((d) => {
            const isSel = d.id === activeDhikrId;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDhikrId(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium ${
                  isSel
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {d.name} ({d.currentCount}/{d.target})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Digital Tasbih Counter Unit */}
      <div className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-emerald-950 border border-stone-700/60 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Arabic Display */}
        <div className="my-2">
          <p className="font-arabic text-3xl sm:text-4xl text-amber-300 drop-shadow-sm leading-loose">
            {activeDhikr.arabic}
          </p>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto italic">
            "{activeDhikr.meaning}"
          </p>
        </div>

        {/* Big Ergonomic Tap Circle */}
        <div className="my-6 flex flex-col items-center justify-center">
          <button
            onClick={handleTap}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:to-teal-400 active:scale-92 active:shadow-inner text-white shadow-xl shadow-emerald-900/40 border-4 border-emerald-400/40 flex flex-col items-center justify-center transition-transform duration-100 cursor-pointer select-none group"
          >
            <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight drop-shadow-md">
              {activeDhikr.currentCount}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-100 mt-1">
              HEDEF: {activeDhikr.target}
            </span>
            <span className="text-[10px] text-emerald-200/80 mt-2 font-medium">
              (DOKUNUN)
            </span>
          </button>
        </div>

        {/* Progress Bar & Reset Button */}
        <div className="space-y-3">
          <div className="w-full bg-stone-700/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-stone-300">
            <span>İlerleme: %{progressPercent}</span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Toggles: Sound & Vibrate */}
        <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-stone-700/60">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              isSoundOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Ses Efekti</span>
          </button>

          <button
            onClick={() => setIsVibrateOn(!isVibrateOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
              isVibrateOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span>Titreşim</span>
          </button>
        </div>
      </div>

      {/* Virtue Card */}
      {activeDhikr.virtue && (
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-left space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bu Zikrin Fazileti</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {activeDhikr.virtue}
          </p>
        </div>
      )}

      {/* Modal: Add Custom Dhikr */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-left space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Yeni Özel Zikir Ekle
            </h3>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Zikir Adı</label>
              <input
                type="text"
                value={newDhikrName}
                onChange={(e) => setNewDhikrName(e.target.value)}
                placeholder="Örn: Yâ Şâfî, Salât-ı Tefriciye"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Arapça Metni (İsteğe bağlı)</label>
              <input
                type="text"
                value={newDhikrArabic}
                onChange={(e) => setNewDhikrArabic(e.target.value)}
                placeholder="Örn: يَا شَافِي"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-arabic focus:outline-emerald-500 text-right"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Hedef Sayı</label>
              <input
                type="number"
                value={newDhikrTarget}
                onChange={(e) => setNewDhikrTarget(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 rounded-xl text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleAddCustomDhikr}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Daily Reminder Setting */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-left space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                Günlük Zikir Hatırlatıcısı
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Her gün belirleyeceğiniz saatte telefonunuza veya tarayıcınıza sessiz bildirim gönderilir.
            </p>
            <div>
              <label className="text-xs text-stone-500 block mb-1">Hatırlatma Saati</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-mono font-bold text-stone-900 dark:text-white"
              />
            </div>
            {reminderError && (
              <p className="text-[11px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900 leading-snug">
                {reminderError}
              </p>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-3 py-2 rounded-xl text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleSaveReminder}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Hatırlatıcıyı Kur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
