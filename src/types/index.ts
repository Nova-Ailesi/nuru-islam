export type Language = 'tr' | 'en' | 'ar' | 'de';

export type PrayerKey = 'imsak' | 'gunes' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi';

export interface PrayerTimesData {
  city: string;
  country: string;
  date: string;
  hijriDate: string;
  times: {
    imsak: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
  };
  nextPrayer: {
    key: PrayerKey;
    label: string;
    time: string;
    remainingMinutes: number;
    remainingFormatted: string;
  };
  currentPrayer: {
    key: PrayerKey;
    label: string;
  };
}

export type GenderType = 'erkek' | 'kadin';

export interface NamazStep {
  stepNumber: number;
  rakat: number;
  title: string;
  posture: 'kiyam' | 'ruku' | 'kavme' | 'secde' | 'celse' | 'kade' | 'selam_sag' | 'selam_sol';
  instruction: string;
  femaleInstruction?: string;
  maleInstruction?: string;
  arabicText?: string;
  transliteration?: string;
  meaning?: string;
  audioPrompt?: string; // Text to be spoken by audio engine
}

export interface NamazTypeInfo {
  id: string;
  name: string;
  category: 'vakit' | 'sunnet' | 'nafile' | 'ozel';
  totalRakats: number;
  rakatBreakdown: string;
  shortDesc: string;
  importance: string;
  timeSlotKey?: PrayerKey;
  sections: {
    title: string;
    rakats: number;
    steps: NamazStep[];
  }[];
}

export interface AbdestStep {
  order: number;
  title: string;
  description: string;
  farzOrSunnet: 'farz' | 'sunnet';
  duaArabic?: string;
  duaTurkish?: string;
  illustrationKey: string;
}

export interface SurahItem {
  id: number;
  name: string;
  arabicName: string;
  meaningName: string;
  ayahCount: number;
  revelationType: 'Mekke' | 'Medine';
  summary: string;
  arabicText: string[];
  transliteration: string[];
  turkishMeaning: string[];
  audioText?: string;
  virtue?: string;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'namaz' | 'gunluk' | 'kuran' | 'peygamber' | 'ozel';
  arabic: string;
  transliteration: string;
  meaning: string;
  source: string;
  benefits?: string;
}

export interface DhikrItem {
  id: string;
  name: string;
  arabic: string;
  meaning: string;
  target: number;
  currentCount: number;
  virtue: string;
}

export interface KazaPrayerState {
  sabah: number;
  ogle: number;
  ikindi: number;
  aksam: number;
  yatsi: number;
  vitir: number;
  oruc: number;
}

export interface ProphetItem {
  id: string;
  name: string;
  arabicName: string;
  title: string;
  period: string;
  location: string;
  brief: string;
  fullStory: string;
  keyLessons: string[];
  quranMentions: string;
}

export interface SahabaItem {
  id: string;
  name: string;
  title: string;
  role: string;
  virtues: string;
  lifeSummary: string;
  quote: string;
}

export interface DiniGunItem {
  id: string;
  name: string;
  hijriDate: string;
  gregorianDate: string;
  description: string;
  recommendedWorships: string[];
  specialDua: string;
  isPassed?: boolean;
  daysRemaining?: number;
}

export interface UserCustomDua {
  id: string;
  title: string;
  text: string;
  arabicText?: string;
  transliteration?: string;
  intention?: string;
  category?: string;
  tags?: string[];
  listId?: string;
  createdAt: string;
  pinned: boolean;
}

export interface DuaCollection {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface DailyWisdom {
  ayah: {
    arabic: string;
    translation: string;
    source: string;
  };
  hadith: {
    text: string;
    source: string;
    narrator: string;
  };
  quote: {
    text: string;
    author: string;
  };
}

export interface UserStats {
  dailyCheckIn: {
    [dateStr: string]: {
      sabah: boolean;
      ogle: boolean;
      ikindi: boolean;
      aksam: boolean;
      yatsi: boolean;
    };
  };
  totalDhikrCount: number;
  completedKazalar: number;
  readSurahsCount: number;
  streakDays: number;
  lastActiveDate: string;
}
