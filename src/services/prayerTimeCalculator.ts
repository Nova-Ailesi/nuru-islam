import { PrayerKey, PrayerTimesData } from '../types';

export interface CityLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export const POPULAR_CITIES: CityLocation[] = [
  { name: "İstanbul", country: "Türkiye", latitude: 41.0082, longitude: 28.9784, timezone: 3 },
  { name: "Ankara", country: "Türkiye", latitude: 39.9334, longitude: 32.8597, timezone: 3 },
  { name: "İzmir", country: "Türkiye", latitude: 38.4192, longitude: 27.1287, timezone: 3 },
  { name: "Bursa", country: "Türkiye", latitude: 40.1885, longitude: 29.0610, timezone: 3 },
  { name: "Konya", country: "Türkiye", latitude: 37.8746, longitude: 32.4932, timezone: 3 },
  { name: "Antalya", country: "Türkiye", latitude: 36.8969, longitude: 30.7133, timezone: 3 },
  { name: "Adana", country: "Türkiye", latitude: 37.0000, longitude: 35.3213, timezone: 3 },
  { name: "Gaziantep", country: "Türkiye", latitude: 37.0662, longitude: 37.3833, timezone: 3 },
  { name: "Şanlıurfa", country: "Türkiye", latitude: 37.1674, longitude: 38.7955, timezone: 3 },
  { name: "Diyarbakır", country: "Türkiye", latitude: 37.9144, longitude: 40.2306, timezone: 3 },
  { name: "Trabzon", country: "Türkiye", latitude: 41.0027, longitude: 39.7168, timezone: 3 },
  { name: "Kayseri", country: "Türkiye", latitude: 38.7312, longitude: 35.4787, timezone: 3 },
  { name: "Samsun", country: "Türkiye", latitude: 41.2867, longitude: 36.33, timezone: 3 },
  { name: "Erzurum", country: "Türkiye", latitude: 39.9055, longitude: 41.2658, timezone: 3 },
  { name: "Mekke", country: "Suudi Arabistan", latitude: 21.4225, longitude: 39.8262, timezone: 3 },
  { name: "Medine", country: "Suudi Arabistan", latitude: 24.5247, longitude: 39.5692, timezone: 3 },
  { name: "Kudüs", country: "Filistin", latitude: 31.7683, longitude: 35.2137, timezone: 3 },
  { name: "Bakü", country: "Azerbaycan", latitude: 40.4093, longitude: 49.8671, timezone: 4 },
  { name: "Berlin", country: "Almanya", latitude: 52.5200, longitude: 13.4050, timezone: 1 },
  { name: "Londra", country: "İngiltere", latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { name: "Paris", country: "Fransa", latitude: 48.8566, longitude: 2.3522, timezone: 1 },
  { name: "Saraybosna", country: "Bosna Hersek", latitude: 43.8563, longitude: 18.4131, timezone: 1 }
];

// Kaaba Coordinates
const KAABA_LAT = 21.4225241;
const KAABA_LNG = 39.8261818;

/**
 * Calculates Great Circle Qibla Bearing from user location
 */
export function calculateQiblaAngle(latitude: number, longitude: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180.0;
  const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;

  const numerator = Math.sin(lambdaK - lambda);
  const denominator = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let qibla = (Math.atan2(numerator, denominator) * 180.0) / Math.PI;
  return (qibla + 360.0) % 360.0;
}

/**
 * Calculates distance to Kaaba in kilometers
 */
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((KAABA_LAT - latitude) * Math.PI) / 180;
  const dLon = ((KAABA_LNG - longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Local Astronomical Calculation Engine (Diyanet Standard: Fajr 18°, Isha 17°)
 */
export function calculateLocalPrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffsetHours: number
): {
  imsak: string;
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
} {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const b = (360 * (dayOfYear - 81)) / 365;
  const bRad = (b * Math.PI) / 180;
  const declination = 23.45 * Math.sin(bRad);
  const decRad = (declination * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const eot = 9.87 * Math.sin(2 * bRad) - 7.53 * Math.cos(bRad) - 1.5 * Math.sin(bRad);
  const noon = 12 + timezoneOffsetHours - lng / 15 - eot / 60;

  const hourAngle = (angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1) return 0;
    if (cosH < -1) return 180;
    return (Math.acos(cosH) * 180) / Math.PI;
  };

  const hFajr = hourAngle(-18) / 15;
  const hSun = hourAngle(-0.833) / 15;
  const hIsha = hourAngle(-17) / 15;

  const noonAlt = 90 - lat + declination;
  const noonShadow = 1 / Math.tan((noonAlt * Math.PI) / 180);
  const asrAlt = Math.atan(1 / (1 + noonShadow)) * (180 / Math.PI);
  const hAsr = hourAngle(asrAlt) / 15;

  const toTimeString = (decimalHours: number): string => {
    let normalized = (decimalHours + 24) % 24;
    const hours = Math.floor(normalized);
    const minutes = Math.floor((normalized - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return {
    imsak: toTimeString(noon - hFajr),
    gunes: toTimeString(noon - hSun),
    ogle: toTimeString(noon),
    ikindi: toTimeString(noon + hAsr),
    aksam: toTimeString(noon + hSun),
    yatsi: toTimeString(noon + hIsha)
  };
}

export interface KerahetState {
  inKerahet: boolean;
  type: 'sabah' | 'zeval' | 'aksam' | null;
  title: string;
  description: string;
  remainingMinutes: number;
  formattedRange: string;
}

export interface SpecialPrayerTimes {
  israk: string;          // Güneş + 45 dk (Kuşluk başlangıcı)
  duhaSonu: string;       // Öğle - 45 dk
  evvabin: string;        // Akşam + 15 dk
  teheccudStart: string;  // Gecenin son üçte biri
  qiblaHour: string;      // Güneşin kıble açısına geldiği vakit
  sahurBitis: string;     // İmsak
  iftar: string;          // Akşam
}

const timeToMinutes = (tStr: string): number => {
  const [h, m] = tStr.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTimeStr = (totalMinutes: number): string => {
  const normalized = (totalMinutes + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

/**
 * Calculates Fiqh Kerahet Times (Makruh prayer times)
 */
export function calculateKerahetTimes(times: {
  gunes: string;
  ogle: string;
  aksam: string;
}): KerahetState {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const gunesMins = timeToMinutes(times.gunes);
  const ogleMins = timeToMinutes(times.ogle);
  const aksamMins = timeToMinutes(times.aksam);

  // 1. Sabah Keraheti: Güneş doğuşundan itibaren 45 dakika
  const sabahKerahetEnd = gunesMins + 45;
  if (currentMinutes >= gunesMins && currentMinutes < sabahKerahetEnd) {
    return {
      inKerahet: true,
      type: 'sabah',
      title: "Güneş Doğuşu Keraheti (Gündoğumu)",
      description: "Güneş doğarken ve doğduktan sonraki 45 dakika boyunca nafile ve kaza namazı kılmak mekruhtur.",
      remainingMinutes: sabahKerahetEnd - currentMinutes,
      formattedRange: `${times.gunes} - ${minutesToTimeStr(sabahKerahetEnd)}`
    };
  }

  // 2. Zeval Keraheti: Öğleden önceki 45 dakika (Güneş tam tepedeyken)
  const zevalKerahetStart = ogleMins - 45;
  if (currentMinutes >= zevalKerahetStart && currentMinutes < ogleMins) {
    return {
      inKerahet: true,
      type: 'zeval',
      title: "Zeval / İstivâ Keraheti (Öğle Öncesi)",
      description: "Güneş tam tepe noktasındayken (Öğle ezanına 45 dakika kala) nafile namaz kılınması mekruhtur.",
      remainingMinutes: ogleMins - currentMinutes,
      formattedRange: `${minutesToTimeStr(zevalKerahetStart)} - ${times.ogle}`
    };
  }

  // 3. Akşam Keraheti: Akşam ezanına 45 dakika kala (İsfirâr-ı Şems)
  const aksamKerahetStart = aksamMins - 45;
  if (currentMinutes >= aksamKerahetStart && currentMinutes < aksamMins) {
    return {
      inKerahet: true,
      type: 'aksam',
      title: "İsfirâr-ı Şems Keraheti (Günbatımı Öncesi)",
      description: "Güneş batarken sarardığı son 45 dakikada yalnız o günün ikindi farzı hariç namaz kılmak mekruhtur.",
      remainingMinutes: aksamMins - currentMinutes,
      formattedRange: `${minutesToTimeStr(aksamKerahetStart)} - ${times.aksam}`
    };
  }

  return {
    inKerahet: false,
    type: null,
    title: "Mübah Vakit",
    description: "Şu an kerahet vakti dışındasınız. Dilediğinizce kaza ve nafile namaz kılabilirsiniz.",
    remainingMinutes: 0,
    formattedRange: ""
  };
}

/**
 * Calculates auxiliary voluntary worship times (İşrak, Evvâbîn, Teheccüd, Kıble Saati)
 */
export function calculateSpecialTimes(times: {
  imsak: string;
  gunes: string;
  ogle: string;
  aksam: string;
  yatsi: string;
}): SpecialPrayerTimes {
  const gunesMins = timeToMinutes(times.gunes);
  const ogleMins = timeToMinutes(times.ogle);
  const aksamMins = timeToMinutes(times.aksam);
  const yatsiMins = timeToMinutes(times.yatsi);
  const imsakMins = timeToMinutes(times.imsak);

  // İşrak: Güneş + 45 dk
  const israkMins = gunesMins + 45;
  // Kuşluk sonu: Öğle - 45 dk
  const duhaSonuMins = ogleMins - 45;
  // Evvabin: Akşam + 15 dk
  const evvabinMins = aksamMins + 15;

  // Teheccüd: Night is from Maghrib (or Isha) to Fajr
  // Duration between Isha and tomorrow's Fajr
  let nightLength = imsakMins + 1440 - yatsiMins;
  const lastThirdStart = yatsiMins + Math.round((nightLength * 2) / 3);

  // Kıble saati (Approx midday + 1 hour depending on latitude/longitude)
  const qiblaHourMins = ogleMins - 35;

  return {
    israk: minutesToTimeStr(israkMins),
    duhaSonu: minutesToTimeStr(duhaSonuMins),
    evvabin: minutesToTimeStr(evvabinMins),
    teheccudStart: minutesToTimeStr(lastThirdStart),
    qiblaHour: minutesToTimeStr(qiblaHourMins),
    sahurBitis: times.imsak,
    iftar: times.aksam
  };
}

/**
 * Generates Weekly or Monthly Imsakiye Table
 */
export interface ImsakiyeDay {
  dayName: string;
  gregorianDate: string;
  hijriDay: number;
  times: {
    imsak: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
  };
  isToday: boolean;
}

export function generateImsakiyeSchedule(
  city: CityLocation,
  startDate: Date = new Date(),
  dayCount: number = 7
): ImsakiyeDay[] {
  const list: ImsakiyeDay[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < dayCount; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const dStr = d.toISOString().split('T')[0];
    const tz = city.timezone || 3;
    const times = calculateLocalPrayerTimes(d, city.latitude, city.longitude, tz);

    const dayName = d.toLocaleDateString('tr-TR', { weekday: 'long' });
    const gregorianDate = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

    list.push({
      dayName,
      gregorianDate,
      hijriDay: (19 + i) % 30 || 30,
      times,
      isToday: dStr === todayStr
    });
  }

  return list;
}

export interface AdhanMakamInfo {
  prayerKey: PrayerKey;
  prayerName: string;
  makam: string;
  description: string;
  audioFrequencyBase: number;
}

export const ADHAN_MAKAMS: AdhanMakamInfo[] = [
  {
    prayerKey: 'imsak',
    prayerName: 'Sabah Ezanı',
    makam: 'Sabâ Makamı',
    description: "İnsanın kalbine hüzün, tevazu ve uyanış hissi verir. Sabah serinliğinde tatlı bir uyanış sağlar.",
    audioFrequencyBase: 293.66 // D4
  },
  {
    prayerKey: 'ogle',
    prayerName: 'Öğle Ezanı',
    makam: 'Rast Makamı',
    description: "Canlılık, neşe ve saadet telkin eder. Günün en yoğun saatinde insana ferahlık aşılar.",
    audioFrequencyBase: 349.23 // F4
  },
  {
    prayerKey: 'ikindi',
    prayerName: 'İkindi Ezanı',
    makam: 'Hicaz Makamı',
    description: "Huşu, derin tefekkür ve tevazu hissettirir. Gün batımına doğru insanın iç dünyasına yönelmesini sağlar.",
    audioFrequencyBase: 329.63 // E4
  },
  {
    prayerKey: 'aksam',
    prayerName: 'Akşam Ezanı',
    makam: 'Segâh Makamı',
    description: "Vakti kısa olduğu için hızlı, ritmik ve huzur verici bir edayla okunur. İftar vaktinin müjdecisidir.",
    audioFrequencyBase: 392.00 // G4
  },
  {
    prayerKey: 'yatsi',
    prayerName: 'Yatsı Ezanı',
    makam: 'Uşşak / Rast Makamı',
    description: "Gece istirahatine geçişi simgeler, kalbe derin bir sükûnet ve dinginlik verir.",
    audioFrequencyBase: 261.63 // C4
  }
];

/**
 * Fetch prayer times from Aladhan API or fall back to local calculation
 */
export async function getPrayerTimesForLocation(
  city: CityLocation,
  date: Date = new Date()
): Promise<PrayerTimesData> {
  const dateStr = date.toISOString().split('T')[0];
  const cacheKey = `prayer_times_${city.name}_${dateStr}`;
  const cached = localStorage.getItem(cacheKey);

  let times = {
    imsak: "05:15",
    gunes: "06:40",
    ogle: "12:55",
    ikindi: "16:15",
    aksam: "19:05",
    yatsi: "20:25"
  };

  let hijriDate = "19 Rebiülâhir 1448";

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      times = parsed.times;
      hijriDate = parsed.hijriDate || hijriDate;
    } catch {
      // ignore
    }
  } else {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://api.aladhan.com/v1/timingsByCity/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?city=${encodeURIComponent(city.name)}&country=${encodeURIComponent(city.country)}&method=13`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.timings) {
          const t = json.data.timings;
          times = {
            imsak: t.Fajr?.slice(0, 5) || times.imsak,
            gunes: t.Sunrise?.slice(0, 5) || times.gunes,
            ogle: t.Dhuhr?.slice(0, 5) || times.ogle,
            ikindi: t.Asr?.slice(0, 5) || times.ikindi,
            aksam: t.Maghrib?.slice(0, 5) || times.aksam,
            yatsi: t.Isha?.slice(0, 5) || times.yatsi
          };

          if (json.data.date && json.data.date.hijri) {
            const h = json.data.date.hijri;
            hijriDate = `${h.day} ${h.month.en} ${h.year} H.`;
          }

          localStorage.setItem(cacheKey, JSON.stringify({ times, hijriDate }));
        }
      } else {
        throw new Error("API error");
      }
    } catch {
      const tz = city.timezone || 3;
      times = calculateLocalPrayerTimes(date, city.latitude, city.longitude, tz);
      hijriDate = "Hicrî 1448";
    }
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const schedule: { key: PrayerKey; label: string; minutes: number; timeStr: string }[] = [
    { key: "imsak", label: "İmsak", minutes: timeToMinutes(times.imsak), timeStr: times.imsak },
    { key: "gunes", label: "Güneş", minutes: timeToMinutes(times.gunes), timeStr: times.gunes },
    { key: "ogle", label: "Öğle", minutes: timeToMinutes(times.ogle), timeStr: times.ogle },
    { key: "ikindi", label: "İkindi", minutes: timeToMinutes(times.ikindi), timeStr: times.ikindi },
    { key: "aksam", label: "Akşam", minutes: timeToMinutes(times.aksam), timeStr: times.aksam },
    { key: "yatsi", label: "Yatsı", minutes: timeToMinutes(times.yatsi), timeStr: times.yatsi }
  ];

  let nextIndex = schedule.findIndex((p) => p.minutes > currentMinutes);
  let nextPrayerItem;
  let remainingMinutes = 0;

  if (nextIndex === -1) {
    nextPrayerItem = schedule[0];
    remainingMinutes = 24 * 60 - currentMinutes + nextPrayerItem.minutes;
  } else {
    nextPrayerItem = schedule[nextIndex];
    remainingMinutes = nextPrayerItem.minutes - currentMinutes;
  }

  let currentIndex = nextIndex === -1 ? schedule.length - 1 : nextIndex - 1;
  if (currentIndex < 0) currentIndex = schedule.length - 1;
  const currentPrayerItem = schedule[currentIndex];

  const remHours = Math.floor(remainingMinutes / 60);
  const remMins = remainingMinutes % 60;
  const remainingFormatted = `${remHours > 0 ? `${remHours} saat ` : ''}${remMins} dakika`;

  return {
    city: city.name,
    country: city.country,
    date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
    hijriDate,
    times,
    nextPrayer: {
      key: nextPrayerItem.key,
      label: nextPrayerItem.label,
      time: nextPrayerItem.timeStr,
      remainingMinutes,
      remainingFormatted
    },
    currentPrayer: {
      key: currentPrayerItem.key,
      label: currentPrayerItem.label
    }
  };
}
