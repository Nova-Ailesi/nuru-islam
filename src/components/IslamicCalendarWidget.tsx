import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  Award,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  getHijriDateDetails,
  getUpcomingReligiousEvents,
  getMilestoneForHijriDay,
  HIJRI_MONTH_NAMES_TR,
  UpcomingReligiousEvent,
  HijriDateInfo
} from '../services/islamicCalendarService';
import { Language } from '../types';

interface IslamicCalendarWidgetProps {
  onOpenDiniGunler?: () => void;
  lang?: Language;
  className?: string;
}

export const IslamicCalendarWidget: React.FC<IslamicCalendarWidgetProps> = ({
  onOpenDiniGunler,
  lang = 'tr',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingReligiousEvent | null>(null);

  // Today's Hijri Date Details
  const todayHijri: HijriDateInfo = useMemo(() => getHijriDateDetails(new Date(), lang), [lang]);
  const upcomingEvents = useMemo(() => getUpcomingReligiousEvents(todayHijri), [todayHijri]);

  // Browsable month state (defaults to current Hijri month)
  const [browsingMonthIndex, setBrowsingMonthIndex] = useState<number>(todayHijri.monthIndex);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(todayHijri.day);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'kandil' | 'bayram' | 'ramazan'>('all');

  const nearestEvent = upcomingEvents[0];

  const getEventBadgeColor = (type: UpcomingReligiousEvent['type']) => {
    switch (type) {
      case 'kandil':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'bayram':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'ramazan':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'hac':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border-violet-300 dark:border-violet-700';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  const formatCountdown = (days: number) => {
    if (days === 0) return 'Bugün!';
    if (days === 1) return 'Yarın!';
    return `${days} gün kaldı`;
  };

  // Browsing month properties
  const browsingMonthName = HIJRI_MONTH_NAMES_TR[browsingMonthIndex - 1];
  const isCurrentMonthBeingViewed = browsingMonthIndex === todayHijri.monthIndex;
  const daysInBrowsingMonth = [1, 3, 5, 7, 9, 11].includes(browsingMonthIndex) ? 30 : 29;
  const monthDaysList = Array.from({ length: daysInBrowsingMonth }, (_, i) => i + 1);

  // Selected Day Details in browsing month
  const selectedDayMilestone = getMilestoneForHijriDay(browsingMonthIndex, selectedDayNumber);
  const isSelectedDayWhiteDay = [13, 14, 15].includes(selectedDayNumber);

  // Filtered upcoming events list
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === 'all') return upcomingEvents;
    return upcomingEvents.filter((e) => e.type === eventTypeFilter);
  }, [upcomingEvents, eventTypeFilter]);

  const handlePrevMonth = () => {
    setBrowsingMonthIndex((prev) => (prev === 1 ? 12 : prev - 1));
    setSelectedDayNumber(1);
  };

  const handleNextMonth = () => {
    setBrowsingMonthIndex((prev) => (prev === 12 ? 1 : prev + 1));
    setSelectedDayNumber(1);
  };

  return (
    <div
      className={`bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs transition-all relative overflow-hidden ${className}`}
    >
      {/* Background Decorative Crescent Glow */}
      <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-6 -translate-y-6">
        <Moon className="w-36 h-36 text-emerald-600" />
      </div>

      <div className="relative z-10 space-y-3.5">
        {/* Top Header: Dual Date (Hijri & Gregorian) + Moon Phase */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                <Moon className="w-4 h-4 fill-current" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
                Hicrî Takvim & Dini Günler
              </span>
              {todayHijri.sacredTag && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                  {todayHijri.sacredTag}
                </span>
              )}
              {/* Moon phase pill */}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center gap-1">
                <span>{todayHijri.moonPhase.phaseIcon}</span>
                <span>{todayHijri.moonPhase.phaseName}</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 pt-0.5">
              <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                {todayHijri.formattedHijri}
              </h3>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Miladî: {todayHijri.gregorianDateStr}
            </p>
          </div>

          {/* Toggle Expand / Full Calendar Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isExpanded ? 'Özet Görünüm' : 'Detaylı Takvim'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Highlight Card: Nearest Upcoming Religious Day */}
        {nearestEvent && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-stone-50 to-amber-50/60 dark:from-emerald-950/30 dark:via-stone-900 dark:to-amber-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                    En Yakın Dini Gün:
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${getEventBadgeColor(
                      nearestEvent.type
                    )}`}
                  >
                    {nearestEvent.typeBadge}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white truncate">
                  {nearestEvent.name}
                </h4>
                <p className="text-[11px] text-stone-500 truncate">
                  {nearestEvent.hijriDateStr} • Tahmini {nearestEvent.gregorianEstimatedDate}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs">
                {formatCountdown(nearestEvent.daysRemaining)}
              </span>
            </div>
          </div>
        )}

        {/* Special Notification for White Days / Eyyam-ı Biyz if active today */}
        {todayHijri.isWhiteDay && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <Star className="w-4 h-4 text-amber-600 shrink-0 fill-current" />
            <div className="flex-1 min-w-0">
              <strong className="font-bold">Eyyâm-ı Bîyz (Aydınlık Günler): </strong>
              <span>
                Hicrî ayın 13, 14 ve 15. günleridir. Peygamber Efendimiz (s.a.v.) bu günleri oruçla geçirmeyi tavsiye buyurmuştur.
              </span>
            </div>
          </div>
        )}

        {/* EXPANDABLE SECTION: Interactive Month Browser & Upcoming Milestones */}
        {isExpanded && (
          <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 space-y-4 animate-in fade-in">
            {/* Month Browser Navigation Bar */}
            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-2xl border border-stone-200/60 dark:border-stone-800">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Önceki Hicrî Ay"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-xs font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5 justify-center">
                  <span>{browsingMonthName} {todayHijri.year} H.</span>
                  {isCurrentMonthBeingViewed && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Şu anki Ay
                    </span>
                  )}
                </span>
                <p className="text-[10px] text-stone-500">
                  {daysInBrowsingMonth} Günlük Kamerî Döngü
                </p>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Sonraki Hicrî Ay"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days in Month Matrix */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-7 gap-1.5">
                {monthDaysList.map((d) => {
                  const isToday = isCurrentMonthBeingViewed && d === todayHijri.day;
                  const isSelected = d === selectedDayNumber;
                  const isWhite = [13, 14, 15].includes(d);
                  const hasMilestone = !!getMilestoneForHijriDay(browsingMonthIndex, d);

                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDayNumber(d)}
                      className={`h-8 rounded-xl flex flex-col items-center justify-center text-[10px] font-semibold transition-all relative cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-500/40 scale-105'
                          : isToday
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-400'
                          : hasMilestone
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-400 font-bold'
                          : isWhite
                          ? 'bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 font-medium'
                          : 'bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                      title={`${d} ${browsingMonthName}`}
                    >
                      <span>{d}</span>
                      {hasMilestone && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 -mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day Legend */}
              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  Bugün
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  Kandil / Bayram
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500/30 border border-amber-400 inline-block" />
                  Eyyâm-ı Bîyz (13-15)
                </span>
              </div>
            </div>

            {/* Selected Day Inspector Card */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedDayNumber} {browsingMonthName} {todayHijri.year}</span>
                </span>
                {isSelectedDayWhiteDay && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Eyyâm-ı Bîyz Günü (Oruç)
                  </span>
                )}
              </div>

              {selectedDayMilestone ? (
                <div className="pt-1 space-y-1 border-t border-stone-200/60 dark:border-stone-700/60 text-[11px]">
                  <p className="font-extrabold text-amber-700 dark:text-amber-400">
                    ★ {selectedDayMilestone.name}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300">
                    {selectedDayMilestone.description}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-stone-500 pt-0.5">
                  {isSelectedDayWhiteDay
                    ? "Peygamber Efendimiz (s.a.v.) bu günü nafile oruç ve tefekkürle ihya etmeyi tavsiye buyurmuştur."
                    : "Hicrî kamerî döngünün mübarek günlerinden biridir."}
                </p>
              )}
            </div>

            {/* Filter Tabs for Upcoming Events */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sıradaki Mübarek Gün ve Kandiller</span>
                </h4>
                {onOpenDiniGunler && (
                  <button
                    onClick={onOpenDiniGunler}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Tüm Dini Günler</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Event Type Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setEventTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-semibold ${
                    eventTypeFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Tümü ({upcomingEvents.length})
                </button>
                <button
                  onClick={() => setEventTypeFilter('kandil')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-semibold ${
                    eventTypeFilter === 'kandil'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Kandiller
                </button>
                <button
                  onClick={() => setEventTypeFilter('bayram')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-semibold ${
                    eventTypeFilter === 'bayram'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Bayramlar
                </button>
                <button
                  onClick={() => setEventTypeFilter('ramazan')}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer font-semibold ${
                    eventTypeFilter === 'ramazan'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Ramazan
                </button>
              </div>

              {/* Timeline of Events */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(isSelected ? null : evt)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getEventBadgeColor(
                                evt.type
                              )}`}
                            >
                              {evt.typeBadge}
                            </span>
                            <span className="text-[11px] text-stone-400 truncate">
                              {evt.hijriDateStr}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-stone-900 dark:text-white mt-0.5 truncate">
                            {evt.name}
                          </h5>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg inline-block ${
                              evt.daysRemaining <= 7
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            {formatCountdown(evt.daysRemaining)}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Event Detail Preview */}
                      {isSelected && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-[11px] space-y-1 animate-in fade-in">
                          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                            {evt.description}
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-400 font-semibold italic">
                            {evt.importance}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Tahmini Miladî Tarih: {evt.gregorianEstimatedDate}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
