import React, { useState } from 'react';
import {
  Droplet,
  Sparkles,
  HelpCircle,
  Check,
  AlertCircle,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import {
  WUDU_STEPS,
  GHUSL_DATA,
  TAYAMMUM_DATA,
  ABDESTI_BOZANLAR,
  ABDESTI_BOZMAYANLAR
} from '../data/abdestGuide';
import { AbdestStepIllustration } from './AbdestStepIllustration';

export const AbdestGuideView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'namaz' | 'gusul' | 'teyemmum' | 'bozanlar'>('namaz');

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Sub-tab Navigation */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('namaz')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'namaz'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Namaz Abdesti (9 Adım)
        </button>
        <button
          onClick={() => setActiveSubTab('gusul')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'gusul'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Gusül (Boy) Abdesti
        </button>
        <button
          onClick={() => setActiveSubTab('teyemmum')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'teyemmum'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Teyemmüm
        </button>
        <button
          onClick={() => setActiveSubTab('bozanlar')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'bozanlar'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Abdesti Bozanlar
        </button>
      </div>

      {/* 1. NAMAZ ABDESTİ (9 Visual Steps) */}
      {activeSubTab === 'namaz' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 rounded-2xl text-xs text-emerald-900 dark:text-emerald-300">
            <span className="font-bold">Abdestin 4 Farzı:</span> Yüzü yıkamak, kolları dirseklerle beraber yıkamak, başın dörtte birini mesh etmek, ayakları topuklarla beraber yıkamak.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WUDU_STEPS.map((step) => {
              const isFarz = step.farzOrSunnet === 'farz';
              return (
                <div
                  key={step.order}
                  className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 shadow-xs flex items-center gap-3.5"
                >
                  <AbdestStepIllustration
                    illustrationKey={step.illustrationKey}
                    className="w-20 h-20 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {step.order}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {step.title}
                      </h4>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          isFarz
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {step.farzOrSunnet}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                      {step.description}
                    </p>

                    {step.duaArabic && (
                      <p className="font-arabic text-sm text-emerald-800 dark:text-emerald-300 pt-1">
                        {step.duaArabic}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. GUSÜL (BOY) ABDESTİ */}
      {activeSubTab === 'gusul' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {GHUSL_DATA.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {GHUSL_DATA.description}
            </p>
          </div>

          {/* Guslün Farzları */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Guslün 3 Farzı
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {GHUSL_DATA.farzlar.map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1"
                >
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {i + 1}. {f.title}
                  </p>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sünnete Uygun Gusül Alınışı */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Sünnete Uygun Gusül Aşamaları
            </h4>
            <div className="space-y-2">
              {GHUSL_DATA.adimlari.map((adim, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-800 dark:text-stone-200 leading-relaxed"
                >
                  {adim}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEYEMMÜM ABDESTİ */}
      {activeSubTab === 'teyemmum' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {TAYAMMUM_DATA.title}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {TAYAMMUM_DATA.description}
            </p>
          </div>

          {/* Farzlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TAYAMMUM_DATA.farzlar.map((f, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 space-y-1"
              >
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {f.title}
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Adımlar */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Teyemmümün Uygulanışı
            </h4>
            <div className="space-y-2">
              {TAYAMMUM_DATA.adimlari.map((adim, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-800 dark:text-stone-200 leading-relaxed"
                >
                  {adim}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ABDESTİ BOZANLAR VE BOZMAYANLAR */}
      {activeSubTab === 'bozanlar' && (
        <div className="space-y-4">
          {/* Bozanlar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Abdesti Bozan Durumlar</span>
            </h3>
            <div className="space-y-2">
              {ABDESTI_BOZANLAR.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bozmayanlar */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Abdesti Bozmayan Haller (Vesvese Önleyici)</span>
            </h3>
            <div className="space-y-2">
              {ABDESTI_BOZMAYANLAR.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
