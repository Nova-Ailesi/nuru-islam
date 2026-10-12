/**
 * Islamic (Hijri) Calendar Service
 * Calculates accurate Hijri dates, sacred months, white days (eyyâm-ı bîyz),
 * lunar moon phases, and upcoming religious milestones with countdowns.
 */

export interface HijriDateInfo {
  day: number;
  monthIndex: number; // 1 - 12
  monthName: string;
  year: number;
  formattedHijri: string;
  gregorianDateStr: string;
  isSacredMonth: boolean; // Muharrem, Recep, Zilkade, Zilhicce
  isUcAy: boolean; // Recep, Şaban, Ramazan
  isWhiteDay: boolean; // 13, 14, 15 of Hijri month
  sacredTag?: string;
  moonPhase: MoonPhaseInfo;
}

export interface MoonPhaseInfo {
  phaseName: string;
  phaseIcon: string;
  illuminationPercent: number;
  description: string;
}

export interface UpcomingReligiousEvent {
  id: string;
  name: string;
  type: 'kandil' | 'bayram' | 'ramazan' | 'hac' | 'mubarek_gun';
  typeBadge: string;
  hijriMonth: number;
  hijriDay: number;
  hijriDateStr: string;
  gregorianEstimatedDate: string;
  daysRemaining: number;
  description: string;
  importance: string;
}

export const HIJRI_MONTH_NAMES_TR = [
  'Muharrem',
  'Sefer',
  'Rebiülevvel',
  'Rebiülâhir',
  'Cemâziyelevvel',
  'Cemâziyelahir',
  'Recep',
  'Şaban',
  'Ramazan',
  'Şevval',
  'Zilkade',
  'Zilhicce'
];

export const HIJRI_MONTH_NAMES_AR = [
  'المحرّم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوّال',
  'ذو القعدة',
  'ذو الحجة'
];

export const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah'
];

export const HIJRI_MONTH_NAMES_DE = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Dschumada al-Ula',
  'Dschumada al-Achira',
  'Radschab',
  "Scha'ban",
  'Ramadan',
  'Schawwal',
  "Dhu l-qa'da",
  'Dhu l-Hiddscha'
];

/**
 * Calculates Moon Phase based on Hijri day (1-30 lunar cycle)
 */
export function getMoonPhaseInfo(day: number): MoonPhaseInfo {
  if (day === 1 || day === 2) {
    return {
      phaseName: 'Hilâl (Yeni Ay)',
      phaseIcon: '🌙',
      illuminationPercent: 8,
      description: 'Hicrî ayın başlangıcını müjdeleyen zarif hilal evresi.'
    };
  }
  if (day >= 3 && day <= 6) {
    return {
      phaseName: 'Büyüyen Hilal',
      phaseIcon: '🌒',
      illuminationPercent: 25,
      description: 'Hilalin her gece biraz daha genişlediği evre.'
    };
  }
  if (day >= 7 && day <= 9) {
    return {
      phaseName: 'İlk Dördün',
      phaseIcon: '🌓',
      illuminationPercent: 50,
      description: 'Ay diskinin sağ yarısının tam aydınlandığı evre.'
    };
  }
  if (day >= 10 && day <= 12) {
    return {
      phaseName: 'Şişkin Ay (Büyüyen)',
      phaseIcon: '🌔',
      illuminationPercent: 80,
      description: 'Dolunaya yaklaşan parlak ay evresi.'
    };
  }
  if (day >= 13 && day <= 15) {
    return {
      phaseName: 'Bedir / Dolunay (Eyyâm-ı Bîyz)',
      phaseIcon: '🌕',
      illuminationPercent: 100,
      description: 'Ayın en parlak hali. Efendimiz bu geceleri oruçla ihya etmeyi tavsiye etmiştir.'
    };
  }
  if (day >= 16 && day <= 19) {
    return {
      phaseName: 'Şişkin Ay (Küçülen)',
      phaseIcon: '🌖',
      illuminationPercent: 80,
      description: 'Dolunay sonrası yavaşça küçülen ay evresi.'
    };
  }
  if (day >= 20 && day <= 23) {
    return {
      phaseName: 'Son Dördün',
      phaseIcon: '🌗',
      illuminationPercent: 50,
      description: 'Ay diskinin sol yarısının aydınlandığı evre.'
    };
  }
  return {
    phaseName: 'Eski Hilâl (Balsamik)',
    phaseIcon: '🌘',
    illuminationPercent: 12,
    description: 'Ayın son günleri; yeni aya hazırlık evresi.'
  };
}

/**
 * Calculates Hijri Date from a Gregorian date using Intl API with fallback
 */
export function getHijriDateDetails(date: Date = new Date(), lang: string = 'tr'): HijriDateInfo {
  let day = 1;
  let monthIndex = 1;
  let year = 1448;

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    const pMap: Record<string, string> = {};
    parts.forEach((p) => {
      pMap[p.type] = p.value;
    });

    if (pMap.day && pMap.month && pMap.year) {
      day = parseInt(pMap.day, 10);
      monthIndex = parseInt(pMap.month, 10);
      year = parseInt(pMap.year, 10);
    }
  } catch {
    const jd = Math.floor(date.getTime() / 86400000) + 2440587.5;
    const l = Math.floor(jd - 1948440 + 10632);
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    monthIndex = Math.floor((24 * l3) / 709);
    day = l3 - Math.floor((709 * monthIndex) / 24);
    year = 30 * n + j - 30;
  }

  monthIndex = Math.max(1, Math.min(12, monthIndex));
  day = Math.max(1, Math.min(30, day));

  let monthName = HIJRI_MONTH_NAMES_TR[monthIndex - 1];
  if (lang === 'ar') monthName = HIJRI_MONTH_NAMES_AR[monthIndex - 1];
  else if (lang === 'en') monthName = HIJRI_MONTH_NAMES_EN[monthIndex - 1];
  else if (lang === 'de') monthName = HIJRI_MONTH_NAMES_DE[monthIndex - 1];

  const isSacredMonth = [1, 7, 11, 12].includes(monthIndex);
  const isUcAy = [7, 8, 9].includes(monthIndex);
  const isWhiteDay = [13, 14, 15].includes(day);

  let sacredTag: string | undefined;
  if (monthIndex === 9) {
    sacredTag = 'Mübarek Ramazan Ayı';
  } else if (isUcAy) {
    sacredTag = 'Mübarek Üç Aylar';
  } else if (isSacredMonth) {
    sacredTag = 'Haram (Hürmetli) Ay';
  }

  const localeStr = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : 'tr-TR';
  const gregorianFormatter = new Intl.DateTimeFormat(localeStr, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  const moonPhase = getMoonPhaseInfo(day);

  return {
    day,
    monthIndex,
    monthName,
    year,
    formattedHijri: `${day} ${monthName} ${year}`,
    gregorianDateStr: gregorianFormatter.format(date),
    isSacredMonth,
    isUcAy,
    isWhiteDay,
    sacredTag,
    moonPhase
  };
}

/**
 * List of canonical Islamic religious days and kandils with Hijri dates
 */
export interface MilestoneConfig {
  id: string;
  name: string;
  hijriMonth: number;
  hijriDay: number;
  type: 'kandil' | 'bayram' | 'ramazan' | 'hac' | 'mubarek_gun';
  typeBadge: string;
  description: string;
  importance: string;
}

export const RELIGIOUS_MILESTONES: MilestoneConfig[] = [
  {
    id: 'hicri_yilbasi',
    name: 'Hicrî Yılbaşı (1 Muharrem)',
    hijriMonth: 1,
    hijriDay: 1,
    type: 'mubarek_gun',
    typeBadge: 'Yeni Hicrî Yıl',
    description: "Hz. Muhammed (s.a.v.) ve ashabının Mekke'den Medine'ye kutlu hicretinin başlangıcı.",
    importance: 'Müslümanların takvim başı ve kardeşlik miladı'
  },
  {
    id: 'asure_gunu',
    name: 'Âşûrâ Günü (10 Muharrem)',
    hijriMonth: 1,
    hijriDay: 10,
    type: 'mubarek_gun',
    typeBadge: 'Faziletli Oruç',
    description: 'Pek çok peygamberin tevfike erdiği, Hz. Hüseyin ve Kerbelâ şehitlerinin anıldığı gün.',
    importance: 'Peygamber Efendimiz bugünlerde oruç tutmayı tavsiye etmiştir.'
  },
  {
    id: 'mevlid_kandili',
    name: 'Mevlid Kandili (12 Rebiülevvel)',
    hijriMonth: 3,
    hijriDay: 12,
    type: 'kandil',
    typeBadge: 'Kandil Gecesi',
    description: "Âlemlere rahmet olarak gönderilen Sevgili Peygamberimiz'in dünyayı teşrif ettiği veladet gecesi.",
    importance: 'Salavat, Kur\'an tilaveti ve sünneti ihya'
  },
  {
    id: 'uc_aylar_baslangic',
    name: 'Mübarek Üç Ayların Başlangıcı (1 Recep)',
    hijriMonth: 7,
    hijriDay: 1,
    type: 'mubarek_gun',
    typeBadge: 'Rahmet Mevsimi',
    description: "Recep, Şaban ve Ramazan aylarını kapsayan manevi arınma ve feyiz mevsiminin ilk günü.",
    importance: 'Üç aylar duası: "Allahümme bârik lenâ fî Recebe ve Şa\'bân ve belliğnâ Ramadân"'
  },
  {
    id: 'regaip_kandili',
    name: 'Regâip Kandili (Recep İlk Cuma Gecesi)',
    hijriMonth: 7,
    hijriDay: 4,
    type: 'kandil',
    typeBadge: 'Kandil Gecesi',
    description: 'Allah Teâlâ\'nın af, rahmet ve ihsanının bolca bahşedildiği mübarek gece.',
    importance: 'Tövbe, istiğfar ve nafile ibadetler'
  },
  {
    id: 'mirac_kandili',
    name: "Mi'râç Kandili (27 Recep)",
    hijriMonth: 7,
    hijriDay: 27,
    type: 'kandil',
    typeBadge: 'Kandil Gecesi',
    description: "Peygamberimiz'in Mescid-i Aksâ'dan semalara yükselip 5 vakit namaz hediyesiyle döndüğü gece.",
    importance: 'Namaz ibadetinin farz kılındığı kutlu mucize'
  },
  {
    id: 'berat_kandili',
    name: 'Berât Kandili (15 Şaban)',
    hijriMonth: 8,
    hijriDay: 15,
    type: 'kandil',
    typeBadge: 'Kandil Gecesi',
    description: 'Kulların bir yıllık rızık, ecel ve amellerinin tefrik edildiği mağfiret gecesi.',
    importance: 'Geceyi ibadetle, gündüzü oruçla geçirmek sünnettir'
  },
  {
    id: 'ramazan_baslangici',
    name: '1 Ramazan-ı Şerif (Oruç Başlangıcı)',
    hijriMonth: 9,
    hijriDay: 1,
    type: 'ramazan',
    typeBadge: 'Oruç Ayı',
    description: 'On bir ayın sultanı Ramazan-ı Şerif\'in ilk oruç günü ve teravih namazı başlangıcı.',
    importance: 'Farz oruç, mukabele, fitre ve itikaf'
  },
  {
    id: 'kadir_gecesi',
    name: 'Kadir Gecesi (27 Ramazan)',
    hijriMonth: 9,
    hijriDay: 27,
    type: 'kandil',
    typeBadge: 'Bin Aydan Hayırlı',
    description: 'Kur\'an-ı Kerim\'in dünya semasına indirildiği, meleklerin yeryüzünü doldurduğu esenlik gecesi.',
    importance: 'Bin aydan daha hayırlı gece (Kadir Sûresi)'
  },
  {
    id: 'ramazan_bayrami',
    name: 'Ramazan Bayramı (1 Şevval)',
    hijriMonth: 10,
    hijriDay: 1,
    type: 'bayram',
    typeBadge: 'Dini Bayram',
    description: 'Oruç ibadetinin tamamlanması şerefine Müslümanların kardeşçe bayramlaştığı sevinç günleri.',
    importance: 'Bayram namazı, sıla-i rahim, ikram ve hediyeleşme'
  },
  {
    id: 'arefe_gunu',
    name: 'Kurban Arefe Günü (9 Zilhicce)',
    hijriMonth: 12,
    hijriDay: 9,
    type: 'hac',
    typeBadge: 'Arafat Vakfesi',
    description: 'Hacıların Arafat meydanında dualara durduğu, teşrik tekbirlerinin başladığı gün.',
    importance: 'Günü oruçla geçirmek iki yıllık günaha kefarettir (Hadis-i Şerif)'
  },
  {
    id: 'kurban_bayrami',
    name: 'Kurban Bayramı (10 Zilhicce)',
    hijriMonth: 12,
    hijriDay: 10,
    type: 'bayram',
    typeBadge: 'Dini Bayram',
    description: 'Hz. İbrahim ve Hz. İsmail teslimiyetiyle Allah rızası için kurbanların kesildiği günler.',
    importance: 'Kurban kesimi ve teşrik tekbirleri'
  }
];

/**
 * Check if a specific Hijri month and day has a milestone
 */
export function getMilestoneForHijriDay(month: number, day: number): MilestoneConfig | undefined {
  return RELIGIOUS_MILESTONES.find((m) => m.hijriMonth === month && m.hijriDay === day);
}

/**
 * Calculates upcoming religious events sorted by days remaining
 */
export function getUpcomingReligiousEvents(currentHijri: HijriDateInfo): UpcomingReligiousEvent[] {
  const currentTotalDays = (currentHijri.monthIndex - 1) * 29.53 + currentHijri.day;
  const H_YEAR_DAYS = 354.36;

  const events: UpcomingReligiousEvent[] = RELIGIOUS_MILESTONES.map((m) => {
    const targetTotalDays = (m.hijriMonth - 1) * 29.53 + m.hijriDay;
    let diffDays = Math.round(targetTotalDays - currentTotalDays);

    if (diffDays < 0) {
      diffDays = Math.round(diffDays + H_YEAR_DAYS);
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + diffDays);

    const dateFormatted = estimatedDate.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      id: m.id,
      name: m.name,
      type: m.type,
      typeBadge: m.typeBadge,
      hijriMonth: m.hijriMonth,
      hijriDay: m.hijriDay,
      hijriDateStr: `${m.hijriDay} ${HIJRI_MONTH_NAMES_TR[m.hijriMonth - 1]}`,
      gregorianEstimatedDate: dateFormatted,
      daysRemaining: diffDays,
      description: m.description,
      importance: m.importance
    };
  });

  // Sort by nearest upcoming event
  events.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return events;
}
