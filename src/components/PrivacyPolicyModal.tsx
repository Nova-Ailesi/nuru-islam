import React from 'react';
import { ShieldCheck, X, Lock, MapPin, Mic, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Gizlilik Politikası ve Kullanıcı Hakları
              </h3>
              <p className="text-[11px] text-stone-500">
                KVKK ve GDPR uluslararası standartlarına tam uyumlu gizlilik beyanı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          {/* Section 1: Intro */}
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200">
            <p className="font-semibold">
              Nur-u İslam uygulaması, kullanıcılarının mahremiyetine ve kişisel verilerinin güvenliğine en üst düzeyde saygı duyar.
            </p>
          </div>

          {/* Section 2: Location permissions */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>1. Konum Verileri (Coğrafi Konum İzni)</span>
            </h4>
            <p>
              Uygulama, yalnızca bulunduğunuz şehre ve enlem/boylam koordinatlarınıza ait namaz vakitlerini doğru hesaplamak ve Kâbe-i Muazzama yönünü (Kıble Pusulası) hassas olarak tespit etmek amacıyla konum verinizi kullanır. Konum verileriniz hiçbir harici sunucuya aktarılmaz, satılmaz veya üçüncü şahıslarla paylaşılmaz; tamamen cihazınızda yerel olarak işlenir.
            </p>
          </div>

          {/* Section 3: Audio & Mic permissions */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>2. Mikrofon İzni ve Sesli Geri Bildirim</span>
            </h4>
            <p>
              Kur'an-ı Kerim sûreleri ve dualardaki 'Telaffuzumu Kontrol Et' özelliği esnasında kullanıcının okuyuşunu değerlendirmek amacıyla mikrofon erişimi istenir. Ses sinyalleri cihazınızın tarayıcı motoru (Web Audio API) üzerinde anlık olarak analiz edilir; ses kayıtları sunuculara yüklenmez veya saklanmaz.
            </p>
          </div>

          {/* Section 4: Advertising Policy */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>3. Reklam ve Sponsorluk Politikası</span>
            </h4>
            <p>
              Uygulamamız tamamen ücretsiz ve reklamsız olarak sunulmaktadır. Üçüncü taraf reklam ağları (AdMob vb.) kullanılmaz; ibadet deneyiminizi bölecek hiçbir reklam gösterilmez.
            </p>
          </div>

          {/* Section 5: Local Storage */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>4. Çevrimdışı Veri Güvenliği</span>
            </h4>
            <p>
              Kaza namazı sayılarınız, zikirmatik sayaçlarınız, hatim ilerleme durumunuz ve kişisel dua defterinizdeki notlar tamamen cihazınızın yerel depolama alanında (Local Storage) tutulur. Cihazınızı değiştirdiğinizde veya tarayıcı geçmişinizi temizlediğinizde bu veriler silinebilir.
            </p>
          </div>

          {/* Section 6: Contact */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/50 dark:border-stone-800">
            <p className="font-bold text-stone-800 dark:text-stone-200">İletişim & Geri Bildirim:</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Gizlilik politikamız ve uygulamamızla ilgili her türlü soru ve öneriniz için iletisim@nuruislam.app adresinden bize ulaşabilirsiniz.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Anladım & Onaylıyorum
          </button>
        </div>
      </div>
    </div>
  );
};
