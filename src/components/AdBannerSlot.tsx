import React, { useState } from 'react';
import { ExternalLink, X, Shield, Sparkles } from 'lucide-react';
import { adService, SAMPLE_SPONSORED_ITEMS } from '../services/adService';

interface AdBannerSlotProps {
  slotLocation?: string; // e.g. 'prayer_times_bottom', 'hatim_feed', 'kaza_feed'
  className?: string;
  variant?: 'banner' | 'compact';
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  slotLocation = 'general',
  className = '',
  variant = 'banner'
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [itemIndex] = useState(() => Math.floor(Math.random() * SAMPLE_SPONSORED_ITEMS.length));

  if (adService.getIsAdFree() || isDismissed) {
    return null;
  }

  const currentItem = SAMPLE_SPONSORED_ITEMS[itemIndex];

  return (
    <div
      data-ad-slot={slotLocation}
      className={`relative w-full rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-gradient-to-r from-stone-100/70 via-stone-50 to-stone-100/70 dark:from-stone-900/80 dark:via-stone-900/50 dark:to-stone-900/80 p-3 sm:p-4 overflow-hidden transition-all shadow-xs ${className}`}
    >
      {/* Background subtle watermark */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-4 translate-y-4">
        <Sparkles className="w-24 h-24 text-emerald-600" />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left: Discrete Compliant Badge & Content */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {currentItem.badge}
            </span>
            <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 truncate">
              {currentItem.sponsorName}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 truncate">
            {currentItem.title}
          </h4>

          {variant === 'banner' && (
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
              {currentItem.description}
            </p>
          )}
        </div>

        {/* Right: Action Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={currentItem.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span>{currentItem.callToAction}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg cursor-pointer transition-colors"
            title="Reklamı gizle"
            aria-label="Reklamı gizle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
