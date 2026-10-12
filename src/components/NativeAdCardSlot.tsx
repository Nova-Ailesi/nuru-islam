import React, { useState } from 'react';
import { ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { adService, SAMPLE_SPONSORED_ITEMS } from '../services/adService';

interface NativeAdCardSlotProps {
  slotLocation?: string;
  className?: string;
}

export const NativeAdCardSlot: React.FC<NativeAdCardSlotProps> = ({
  slotLocation = 'feed',
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [itemIndex] = useState(() => 1); // Select educational portal item

  if (adService.getIsAdFree() || isDismissed) {
    return null;
  }

  const item = SAMPLE_SPONSORED_ITEMS[itemIndex];

  return (
    <div
      data-ad-slot={slotLocation}
      className={`p-4 sm:p-5 rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-gradient-to-br from-stone-50 via-white to-stone-50/50 dark:from-stone-900/90 dark:via-stone-900/50 dark:to-stone-900/80 shadow-xs space-y-3 relative overflow-hidden transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {item.badge}
          </span>
          <span className="text-xs font-semibold text-stone-500">
            {item.sponsorName}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer"
        >
          Gizle
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{item.title}</span>
        </h4>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end">
        <a
          href={item.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <span>{item.callToAction}</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </a>
      </div>
    </div>
  );
};
