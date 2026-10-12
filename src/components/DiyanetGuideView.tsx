import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Info,
  Lock
} from 'lucide-react';
import { DIYANET_RESOURCES, ALO_190_INFO } from '../data/diyanetResources';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { IslamicQAView } from './IslamicQAView';

export const DiyanetGuideView: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'fetvalar' | 'portallar'>('fetvalar');

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* Sub-tab Switcher: Fetva vs Portallar */}
      <div className="p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl flex items-center gap-1 text-xs">
        <button
          onClick={() => setActiveSubTab('fetvalar')}
          className={`flex-1 py-2 px-3 font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'fetvalar'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>İslami Soru-Cevap (Fetvalar)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('portallar')}
          className={`flex-1 py-2 px-3 font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'portallar'
              ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Resmi Portallar & Alo 190</span>
        </button>
      </div>

      {/* 1. FETVA & SORU-CEVAP TAB */}
      {activeSubTab === 'fetvalar' && <IslamicQAView />}

      {/* 2. RESMİ DİYANET PORTALLARI TAB */}
      {activeSubTab === 'portallar' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Verification Hero Banner */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border border-emerald-800/60 rounded-3xl p-6 text-white shadow-xl space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Muteber & Resmi Dini Kaynaklar</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Güvenilir Diyanet Rehberi
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg">
                İslam dini üzerine sahih, doğrulanmış ve bid'atlerden uzak bilgiye ulaşabilmeniz için T.C. Diyanet İşleri Başkanlığı ve Türkiye Diyanet Vakfı'nın resmi portallarına doğrudan erişim sağlar.
              </p>
            </div>
          </div>

          {/* Alo 190 Direct Call Card */}
          <div className="bg-white dark:bg-stone-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>{ALO_190_INFO.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Ücretsiz
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {ALO_190_INFO.shortDesc}
              </p>
            </div>
          </div>

          <a
            href="tel:190"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>190'ı Ara</span>
          </a>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-600 dark:text-stone-400 space-y-1">
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-200">Çalışma Saatleri: </span>
            {ALO_190_INFO.workingHours}
          </p>
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-200">Nasıl Aranır: </span>
            {ALO_190_INFO.howToCall}
          </p>
        </div>
      </div>

      {/* Official Portals List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
          Resmi Diyanet Portalları ve Kütüphaneleri
        </h3>

        {DIYANET_RESOURCES.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  {res.officialBadge}
                </span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  {res.name}
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950 text-stone-600 hover:text-emerald-600 dark:text-stone-300 dark:hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                title="Resmi Siteyi Ziyaret Et"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Features check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              {res.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimers & Advice Note */}
      <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs text-stone-700 dark:text-stone-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Sahih Bilgi ve Fetva Uyarısı</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          İnternet üzerinde kaynağı belirsiz, uydurma hadis ve teyitsiz fıkhi bilgiler içeren sitelerden uzak durulmalıdır. İbadetlerinizin sıhhati için yalnızca Diyanet İşleri Başkanlığı ve muteber Ehl-i Sünnet ilmihalleri referans alınmalıdır.
        </p>
      </div>
        </div>
      )}

      {/* Google Play Store Privacy Policy & User Rights Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-stone-900 dark:text-white">
              Kullanıcı Hakları & KVKK Gizlilik İlkeleri
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            Resmi Uyumlu
          </span>
        </div>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Konum ve mikrofon izinlerinin kullanımı, çevrimdışı veri güvenliği ve reklam politikası hakkında ayrıntılı yasal metin.
        </p>
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Gizlilik Politikasını Oku</span>
        </button>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
};
