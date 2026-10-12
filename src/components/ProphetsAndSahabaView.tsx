import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Heart,
  Quote
} from 'lucide-react';
import {
  PROPHET_MUHAMMAD_DETAILS,
  PROPHETS_LIST,
  SAHABA_LIST
} from '../data/prophetsAndSahaba';
import { ProphetItem, SahabaItem } from '../types';

export const ProphetsAndSahabaView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'muhammad' | 'prophets' | 'sahaba'>('muhammad');
  const [selectedProphet, setSelectedProphet] = useState<ProphetItem | null>(null);
  const [selectedSahaba, setSelectedSahaba] = useState<SahabaItem | null>(null);

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Tab Navigation */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1">
        <button
          onClick={() => setActiveSection('muhammad')}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'muhammad'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Hz. Muhammed (s.a.v.)
        </button>
        <button
          onClick={() => setActiveSection('prophets')}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'prophets'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          25 Kur'an Peygamberi
        </button>
        <button
          onClick={() => setActiveSection('sahaba')}
          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'sahaba'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Ashâb-ı Kirâm (Sahabeler)
        </button>
      </div>

      {/* 1. HZ. MUHAMMED (S.A.V.) LIFE & STAGES */}
      {activeSection === 'muhammad' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                {PROPHET_MUHAMMAD_DETAILS.title}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {PROPHET_MUHAMMAD_DETAILS.name}
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {PROPHET_MUHAMMAD_DETAILS.summary}
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-emerald-200/80 border-t border-emerald-800/60 font-mono">
                <span>Doğum: {PROPHET_MUHAMMAD_DETAILS.birthYear}</span>
                <span>·</span>
                <span>Vefat: {PROPHET_MUHAMMAD_DETAILS.deathYear}</span>
              </div>
            </div>
          </div>

          {/* Life Stages Timeline */}
          <div className="space-y-3">
            {PROPHET_MUHAMMAD_DETAILS.sections.map((stage, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4.5 shadow-xs space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {stage.title}
                  </h4>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-8">
                  {stage.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 25 PROPHETS LIST */}
      {activeSection === 'prophets' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROPHETS_LIST.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProphet(p)}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-700 rounded-3xl p-4.5 shadow-xs cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-arabic text-base text-emerald-700 dark:text-emerald-400">
                    {p.arabicName}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {p.name}
                </h3>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  {p.title}
                </p>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {p.brief}
                </p>
              </div>
            ))}
          </div>

          {/* Prophet Detail Modal */}
          {selectedProphet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {selectedProphet.name}
                    </h3>
                    <p className="text-xs text-emerald-600 font-medium">
                      {selectedProphet.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProphet(null)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block mb-0.5">
                      Kıssa ve Hayatı:
                    </span>
                    <p>{selectedProphet.fullStory}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 space-y-1.5">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                      Çıkarılacak Temel İbretler:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-600 dark:text-stone-400">
                      {selectedProphet.keyLessons.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    <span className="font-semibold">Kur'an'daki Âyetler: </span>
                    {selectedProphet.quranMentions}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SAHABA (ASHAB-I KIRAM) LIST */}
      {activeSection === 'sahaba' && (
        <div className="space-y-3 animate-in fade-in">
          {SAHABA_LIST.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    {s.name}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-medium">
                    {s.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {s.lifeSummary}
              </p>

              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 flex items-start gap-2 text-xs italic text-stone-600 dark:text-stone-400">
                <Quote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{s.quote}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
