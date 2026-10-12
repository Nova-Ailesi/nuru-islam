import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Palette,
  Type,
  Sparkles,
  Maximize2,
  Moon,
  Heart,
  Smartphone,
  Square,
  Layers
} from 'lucide-react';
import { UserCustomDua } from '../types';

export interface DuaCardTheme {
  id: string;
  name: string;
  bgGradient: string;
  canvasBg: string[];
  textColor: string;
  canvasTextColor: string;
  accentColor: string;
  canvasAccentColor: string;
  borderClass: string;
  ornamentClass: string;
}

export const DUA_CARD_THEMES: DuaCardTheme[] = [
  {
    id: 'emerald',
    name: 'Zümrüt Ravza',
    bgGradient: 'from-emerald-950 via-teal-950 to-stone-950',
    canvasBg: ['#022c22', '#042f2e', '#0c0a09'],
    textColor: 'text-emerald-50',
    canvasTextColor: '#f0fdf4',
    accentColor: 'text-amber-300',
    canvasAccentColor: '#fcd34d',
    borderClass: 'border-amber-400/40 ring-1 ring-amber-400/20',
    ornamentClass: 'text-amber-400/60'
  },
  {
    id: 'night',
    name: 'Gece & Hilal',
    bgGradient: 'from-slate-950 via-indigo-950 to-stone-950',
    canvasBg: ['#020617', '#1e1b4b', '#0c0a09'],
    textColor: 'text-indigo-50',
    canvasTextColor: '#eef2ff',
    accentColor: 'text-indigo-300',
    canvasAccentColor: '#a5b4fc',
    borderClass: 'border-indigo-400/30 ring-1 ring-indigo-400/20',
    ornamentClass: 'text-indigo-400/60'
  },
  {
    id: 'kaba',
    name: 'Kisve-i Şerif',
    bgGradient: 'from-stone-950 via-neutral-900 to-black',
    canvasBg: ['#0c0a09', '#171717', '#000000'],
    textColor: 'text-stone-100',
    canvasTextColor: '#f5f5f4',
    accentColor: 'text-amber-400',
    canvasAccentColor: '#fbbf24',
    borderClass: 'border-amber-500/50 ring-1 ring-amber-500/30',
    ornamentClass: 'text-amber-500/70'
  },
  {
    id: 'marble',
    name: 'Mermer & Tezhip',
    bgGradient: 'from-stone-100 via-amber-50/50 to-stone-200',
    canvasBg: ['#f5f5f4', '#fffbeb', '#e7e5e4'],
    textColor: 'text-stone-900',
    canvasTextColor: '#1c1917',
    accentColor: 'text-amber-700',
    canvasAccentColor: '#b45309',
    borderClass: 'border-amber-600/40 ring-1 ring-amber-600/20',
    ornamentClass: 'text-amber-600/70'
  },
  {
    id: 'rose',
    name: 'Gül-i Muhammedî',
    bgGradient: 'from-rose-950 via-stone-900 to-stone-950',
    canvasBg: ['#4c0519', '#1c1917', '#0c0a09'],
    textColor: 'text-rose-50',
    canvasTextColor: '#fff1f2',
    accentColor: 'text-rose-300',
    canvasAccentColor: '#fda4af',
    borderClass: 'border-rose-400/40 ring-1 ring-rose-400/20',
    ornamentClass: 'text-rose-400/60'
  },
  {
    id: 'seljuk',
    name: 'Selçuklu Firuzesi',
    bgGradient: 'from-cyan-950 via-teal-950 to-stone-950',
    canvasBg: ['#083344', '#042f2e', '#0c0a09'],
    textColor: 'text-cyan-50',
    canvasTextColor: '#ecfeff',
    accentColor: 'text-cyan-300',
    canvasAccentColor: '#67e8f9',
    borderClass: 'border-cyan-400/40 ring-1 ring-cyan-400/20',
    ornamentClass: 'text-cyan-400/60'
  }
];

export type FontStyleType = 'sulus' | 'divani' | 'modern';
export type AspectRatioType = 'square' | 'story';

interface DuaCardStudioModalProps {
  dua: UserCustomDua | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DuaCardStudioModal: React.FC<DuaCardStudioModalProps> = ({
  dua,
  isOpen,
  onClose
}) => {
  const [selectedTheme, setSelectedTheme] = useState<DuaCardTheme>(DUA_CARD_THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<FontStyleType>('sulus');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('square');
  const [showBasmala, setShowBasmala] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen || !dua) return null;

  const basmalaText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

  const getFontFamily = (style: FontStyleType) => {
    switch (style) {
      case 'sulus':
        return 'font-serif tracking-wide';
      case 'divani':
        return 'font-serif italic tracking-wide';
      case 'modern':
        return 'font-sans tracking-normal font-medium';
    }
  };

  /**
   * Helper to wrap text cleanly on HTML5 Canvas
   */
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  /**
   * Generates a high-definition image on hidden Canvas and downloads it
   */
  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) return;

      const isStory = aspectRatio === 'story';
      const width = 1080;
      const height = isStory ? 1920 : 1080;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, selectedTheme.canvasBg[0]);
      grad.addColorStop(0.5, selectedTheme.canvasBg[1]);
      grad.addColorStop(1, selectedTheme.canvasBg[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Decorative Golden Borders & Filigree Frame
      const padding = isStory ? 70 : 60;
      ctx.strokeStyle = selectedTheme.canvasAccentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

      // Inner ornate thin frame
      ctx.lineWidth = 1;
      ctx.strokeStyle = `${selectedTheme.canvasAccentColor}55`;
      ctx.strokeRect(padding + 12, padding + 12, width - (padding + 12) * 2, height - (padding + 12) * 2);

      // Corner rosettes
      const corners = [
        [padding, padding],
        [width - padding, padding],
        [padding, height - padding],
        [width - padding, height - padding]
      ];
      ctx.fillStyle = selectedTheme.canvasAccentColor;
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render Basmala (if enabled)
      let currentY = isStory ? 240 : 160;
      if (showBasmala) {
        ctx.textAlign = 'center';
        ctx.fillStyle = selectedTheme.canvasAccentColor;
        ctx.font = 'bold 36px "Traditional Arabic", "Amiri", serif';
        ctx.fillText(basmalaText, width / 2, currentY);
        currentY += 60;

        // Decorative ornament separator
        ctx.font = '22px serif';
        ctx.fillText('◈ ─── ❖ ─── ◈', width / 2, currentY);
        currentY += isStory ? 80 : 50;
      }

      // 4. Render Dua Title
      ctx.textAlign = 'center';
      ctx.fillStyle = selectedTheme.canvasAccentColor;
      ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif';
      currentY = wrapText(ctx, dua.title, width / 2, currentY, width - padding * 3, 56);
      currentY += 30;

      // 5. Render Optional Arabic Text if present
      if (dua.arabicText) {
        ctx.font = 'bold 42px "Traditional Arabic", "Amiri", serif';
        ctx.fillStyle = selectedTheme.canvasAccentColor;
        currentY = wrapText(ctx, dua.arabicText, width / 2, currentY, width - padding * 3.5, 64);
        currentY += 35;
      }

      // 6. Render Dua Main Text
      ctx.font = selectedFont === 'divani'
        ? 'italic 34px Georgia, serif'
        : selectedFont === 'sulus'
        ? '34px Georgia, serif'
        : '32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = selectedTheme.canvasTextColor;
      currentY = wrapText(ctx, `"${dua.text}"`, width / 2, currentY, width - padding * 3.5, 52);
      currentY += 40;

      // 7. Render Intention (Niyet) if present
      if (dua.intention) {
        ctx.font = 'italic 26px -apple-system, BlinkMacSystemFont, serif';
        ctx.fillStyle = `${selectedTheme.canvasAccentColor}dd`;
        currentY = wrapText(ctx, `Niyet: ${dua.intention}`, width / 2, currentY, width - padding * 4, 38);
      }

      // 8. Bottom App Branding / Watermark
      if (showWatermark) {
        const bottomY = height - padding - 35;
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = `${selectedTheme.canvasAccentColor}aa`;
        ctx.fillText('NUR-U İSLÂM • DUA DEFTERİM', width / 2, bottomY);
      }

      // 9. Export to blob & download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `Dua-Karti-${dua.title.slice(0, 20).replace(/[^a-zA-Z0-9çşğüöıÇŞĞÜÖİ]/g, '_')}.png`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating dua card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Native share image or fallback to text share
   */
  const handleShare = async () => {
    try {
      const shareText = `${showBasmala ? `${basmalaText}\n\n` : ''}🤲 ${dua.title}\n\n"${dua.text}"\n\n${dua.intention ? `Niyet: ${dua.intention}\n\n` : ''}Nur-u İslâm Dua Defterim`;

      if (navigator.share) {
        // Try file sharing if canvas is available
        const canvas = hiddenCanvasRef.current;
        if (canvas) {
          canvas.toBlob(async (blob) => {
            if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'dua.png', { type: 'image/png' })] })) {
              try {
                const file = new File([blob], 'dua-karti.png', { type: 'image/png' });
                await navigator.share({
                  title: dua.title,
                  text: shareText,
                  files: [file]
                });
                return;
              } catch {
                // fallback to regular share
              }
            }
            await navigator.share({
              title: dua.title,
              text: shareText
            });
          });
        } else {
          await navigator.share({
            title: dua.title,
            text: shareText
          });
        }
      } else {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  const handleCopyText = () => {
    const text = `${showBasmala ? `${basmalaText}\n\n` : ''}🤲 ${dua.title}\n\n"${dua.text}"\n\n${dua.intention ? `Niyet: ${dua.intention}\n\n` : ''}Nur-u İslâm`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      {/* Hidden high-res canvas for rendering export image */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                Dua Kartı Stüdyosu
              </h3>
              <p className="text-xs text-stone-500">
                Estetik arka planlar ve hat sanatı ile kart oluşturup paylaşın
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Card Preview Area */}
        <div className="flex justify-center p-2 sm:p-4 bg-stone-100 dark:bg-stone-950 rounded-2xl overflow-hidden">
          <div
            ref={cardRef}
            className={`w-full transition-all duration-300 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-center shadow-xl relative overflow-hidden bg-gradient-to-br ${
              selectedTheme.bgGradient
            } ${selectedTheme.textColor} border ${selectedTheme.borderClass} ${
              aspectRatio === 'story' ? 'aspect-[9/16] max-w-[280px]' : 'aspect-square max-w-[340px]'
            }`}
          >
            {/* Corner Decorative Dots */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-400/60" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400/60" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-amber-400/60" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-400/60" />

            {/* Inner Border Line */}
            <div className="absolute inset-2 border border-amber-400/20 rounded-xl pointer-events-none" />

            {/* Top Basmala */}
            <div className="space-y-1 pt-1">
              {showBasmala && (
                <>
                  <p className="text-base sm:text-lg font-bold text-amber-300/90 font-serif tracking-widest">
                    {basmalaText}
                  </p>
                  <p className="text-[10px] text-amber-400/50">◈ ─── ❖ ─── ◈</p>
                </>
              )}
            </div>

            {/* Dua Title & Body */}
            <div className="space-y-2.5 my-auto px-1 py-2">
              <h4 className="text-base sm:text-lg font-bold tracking-tight text-amber-300 drop-shadow-xs">
                {dua.title}
              </h4>

              {dua.arabicText && (
                <p className="text-base sm:text-xl font-bold font-serif text-amber-200/90 leading-relaxed">
                  {dua.arabicText}
                </p>
              )}

              <p
                className={`text-xs sm:text-sm leading-relaxed ${getFontFamily(
                  selectedFont
                )} opacity-95`}
              >
                "{dua.text}"
              </p>

              {dua.intention && (
                <p className="text-[11px] italic text-amber-300/80 pt-1">
                  Niyet: {dua.intention}
                </p>
              )}
            </div>

            {/* Card Footer / Watermark */}
            {showWatermark && (
              <div className="pt-2 text-[9px] uppercase tracking-widest text-amber-400/60 font-semibold flex items-center justify-center gap-1">
                <Moon className="w-2.5 h-2.5" />
                <span>Nur-u İslâm • Dua Defterim</span>
              </div>
            )}
          </div>
        </div>

        {/* Customization Controls */}
        <div className="space-y-3 text-xs">
          {/* 1. Theme Palette Selector */}
          <div>
            <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Arka Plan Teması</span>
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DUA_CARD_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${theme.bgGradient} border border-amber-400/40 shadow-xs`}
                    />
                    <span className="truncate w-full text-stone-700 dark:text-stone-300">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Font Style & Aspect Ratio Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Font Style */}
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <Type className="w-3.5 h-3.5 text-amber-500" />
                <span>Yazı & Hat Stili</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sulus' as FontStyleType, label: 'Sülüs' },
                  { id: 'divani' as FontStyleType, label: 'Divanî' },
                  { id: 'modern' as FontStyleType, label: 'Modern' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFont(f.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedFont === f.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Kart Boyutu</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    aspectRatio === 'square'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Kare (1:1)</span>
                </button>

                <button
                  onClick={() => setAspectRatio('story')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    aspectRatio === 'story'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Hikaye (9:16)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Toggles: Basmala & Watermark */}
          <div className="flex items-center justify-between pt-1 text-stone-600 dark:text-stone-300 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBasmala}
                onChange={(e) => setShowBasmala(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <span>Besmele-i Şerif Başlığı</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
              <span>Nur-u İslâm Filigranı</span>
            </label>
          </div>
        </div>

        {/* Action Buttons: Download & Share */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Kopyalandı' : 'Metni Kopyala'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Paylaş</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Hazırlanıyor...' : 'Görseli İndir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
