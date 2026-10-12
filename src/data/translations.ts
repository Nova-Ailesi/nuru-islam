import { Language } from '../types';

export const TRANSLATIONS: Record<Language, {
  appName: string;
  tagline: string;
  tabs: {
    prayerTimes: string;
    namazGuide: string;
    abdest: string;
    qibla: string;
    zikir: string;
    kuranDua: string;
    kaza: string;
    more: string;
    stats: string;
    prophets: string;
    diniGunler: string;
    myDuas: string;
    diyanet: string;
    hatim: string;
    soruCevap: string;
  };
  prayerTimes: {
    title: string;
    imsak: string;
    gunes: string;
    ogle: string;
    ikindi: string;
    aksam: string;
    yatsi: string;
    nextPrayer: string;
    remaining: string;
    currentPrayer: string;
    selectCity: string;
    useGps: string;
    notificationsOn: string;
    notificationsOff: string;
    todayWisdom: string;
    qiblaCompass: string;
    listenAdhan: string;
    prayNow: string;
  };
  namazGuide: {
    title: string;
    subtitle: string;
    genderMale: string;
    genderFemale: string;
    stepByStep: string;
    hidePrayersText: string;
    showPrayersText: string;
    listenAudio: string;
    stopAudio: string;
    nextStep: string;
    prevStep: string;
    finishPrayer: string;
    startPrayer: string;
    currentVakitSuggested: string;
  };
  abdest: {
    title: string;
    wuduNamaz: string;
    ghuslBoy: string;
    tayammum: string;
    invalidators: string;
    farzBadge: string;
    sunnetBadge: string;
  };
  zikirmatik: {
    title: string;
    count: string;
    target: string;
    reset: string;
    customTarget: string;
    addCustom: string;
    hapticSound: string;
    dailyReminder: string;
  };
  kaza: {
    title: string;
    subtitle: string;
    totalRemaining: string;
    estimatedYears: string;
    save: string;
  };
  kuranDua: {
    title: string;
    searchPlaceholder: string;
    surahsTab: string;
    duasTab: string;
    favorites: string;
    readPhonetic: string;
    readMeaning: string;
    playAudio: string;
  };
  settings: {
    theme: string;
    language: string;
    dark: string;
    light: string;
    fontSize: string;
  };
}> = {
  tr: {
    appName: "Nur-u İslam",
    tagline: "Kapsamlı Namaz, İbadet & Yaşam Rehberi",
    tabs: {
      prayerTimes: "Vakitler",
      namazGuide: "Namaz Kıl",
      abdest: "Abdest",
      qibla: "Kıble",
      zikir: "Zikirmatik",
      kuranDua: "Kur'an & Dua",
      kaza: "Kaza Takibi",
      more: "Daha Fazla",
      stats: "İstatistikler",
      prophets: "Peygamberler",
      diniGunler: "Dini Günler",
      myDuas: "Dua Defterim",
      diyanet: "Diyanet Rehberi",
      hatim: "Hatm-i Şerif",
      soruCevap: "Soru & Cevap"
    },
    prayerTimes: {
      title: "Namaz Vakitleri",
      imsak: "İmsak",
      gunes: "Güneş",
      ogle: "Öğle",
      ikindi: "İkindi",
      aksam: "Akşam",
      yatsi: "Yatsı",
      nextPrayer: "Sıradaki Vakit",
      remaining: "Kalan Süre",
      currentPrayer: "Şu Anki Vakit",
      selectCity: "Şehir Seçin",
      useGps: "Konumumu Bul",
      notificationsOn: "Vakit Bildirimleri Açık",
      notificationsOff: "Bildirimleri Aç",
      todayWisdom: "Günün Hikmeti",
      qiblaCompass: "Kıble Yönü",
      listenAdhan: "Ezan Sesi Dinle",
      prayNow: "Bu Vakti Kıl"
    },
    namazGuide: {
      title: "Görsel & Sesli Namaz Kılma Rehberi",
      subtitle: "Adım adım duruşlar, Arapça okunuşlar, mealler ve sesli dinleme",
      genderMale: "Erkek",
      genderFemale: "Kadın",
      stepByStep: "Adım Adım Kılınış",
      hidePrayersText: "Duaları Gizle",
      showPrayersText: "Duaları Göster",
      listenAudio: "Sesli Oku",
      stopAudio: "Durdur",
      nextStep: "Sonraki Adım",
      prevStep: "Önceki Adım",
      finishPrayer: "Namazı Tamamla",
      startPrayer: "Namaza Başla",
      currentVakitSuggested: "Şu Anki Vakit Namazı"
    },
    abdest: {
      title: "Görsel Abdest Rehberi",
      wuduNamaz: "Namaz Abdesti",
      ghuslBoy: "Gusül (Boy) Abdesti",
      tayammum: "Teyemmüm Abdesti",
      invalidators: "Abdesti Bozan Haller",
      farzBadge: "Farz",
      sunnetBadge: "Sünnet"
    },
    zikirmatik: {
      title: "Akıllı Zikirmatik",
      count: "Adet",
      target: "Hedef",
      reset: "Sıfırla",
      customTarget: "Hedef Değiştir",
      addCustom: "Özel Zikir Ekle",
      hapticSound: "Ses & Titreşim",
      dailyReminder: "Günlük Zikir Hatırlatıcısı"
    },
    kaza: {
      title: "Kaza Namazı & Oruç Takibi",
      subtitle: "Kaza borçlarınızı planlayın ve düzenli takip edin",
      totalRemaining: "Toplam Kalan Kaza Vakti",
      estimatedYears: "Günde 1 kaza ile tahmini",
      save: "Kaydet"
    },
    kuranDua: {
      title: "Kur'an Sureleri & Dualar",
      searchPlaceholder: "Sure, dua, ayet veya anlam ara...",
      surahsTab: "Kur'an Sureleri",
      duasTab: "Namaz & Günlük Dualar",
      favorites: "Favorilerim",
      readPhonetic: "Türkçe Okunuş",
      readMeaning: "Türkçe Meali",
      playAudio: "Sesli Dinle"
    },
    settings: {
      theme: "Tema",
      language: "Dil",
      dark: "Karanlık Mod",
      light: "Aydınlık Mod",
      fontSize: "Yazı Boyutu"
    }
  },
  en: {
    appName: "Nur-u Islam",
    tagline: "Comprehensive Islamic Prayer & Worship Companion",
    tabs: {
      prayerTimes: "Prayer Times",
      namazGuide: "Learn Prayer",
      abdest: "Ablution",
      qibla: "Qibla",
      zikir: "Tasbih",
      kuranDua: "Quran & Dua",
      kaza: "Missed Prayers",
      more: "More",
      stats: "Statistics",
      prophets: "Prophets",
      diniGunler: "Holy Days",
      myDuas: "My Duas",
      diyanet: "Reliable Sources",
      hatim: "Khatm Tracker",
      soruCevap: "Fatwa & QA"
    },
    prayerTimes: {
      title: "Prayer Times",
      imsak: "Fajr",
      gunes: "Sunrise",
      ogle: "Dhuhr",
      ikindi: "Asr",
      aksam: "Maghrib",
      yatsi: "Isha",
      nextPrayer: "Next Prayer",
      remaining: "Time Remaining",
      currentPrayer: "Current Prayer",
      selectCity: "Select City",
      useGps: "Use Location",
      notificationsOn: "Notifications On",
      notificationsOff: "Enable Notifications",
      todayWisdom: "Daily Wisdom",
      qiblaCompass: "Qibla Direction",
      listenAdhan: "Listen to Adhan",
      prayNow: "Pray This Now"
    },
    namazGuide: {
      title: "Audio & Visual Prayer Guide",
      subtitle: "Step-by-step postures, Arabic recitations, translations and audio",
      genderMale: "Male",
      genderFemale: "Female",
      stepByStep: "Step-by-Step",
      hidePrayersText: "Hide Dua Text",
      showPrayersText: "Show Dua Text",
      listenAudio: "Recite Audio",
      stopAudio: "Stop",
      nextStep: "Next Step",
      prevStep: "Previous Step",
      finishPrayer: "Complete Prayer",
      startPrayer: "Start Prayer",
      currentVakitSuggested: "Suggested Current Prayer"
    },
    abdest: {
      title: "Visual Ablution Guide",
      wuduNamaz: "Wudu (Ablution)",
      ghuslBoy: "Ghusl (Full Body)",
      tayammum: "Tayammum (Dry)",
      invalidators: "What Nullifies Wudu",
      farzBadge: "Obligatory (Fard)",
      sunnetBadge: "Sunnah"
    },
    zikirmatik: {
      title: "Digital Tasbih",
      count: "Count",
      target: "Goal",
      reset: "Reset",
      customTarget: "Change Goal",
      addCustom: "Add Custom Dhikr",
      hapticSound: "Sound & Vibration",
      dailyReminder: "Daily Dhikr Reminder"
    },
    kaza: {
      title: "Missed Prayers Tracker",
      subtitle: "Plan and track your missed prayers easily",
      totalRemaining: "Total Missed Prayers Remaining",
      estimatedYears: "Estimated duration",
      save: "Save"
    },
    kuranDua: {
      title: "Quran Surahs & Duas",
      searchPlaceholder: "Search surahs, prayers, verses...",
      surahsTab: "Surahs",
      duasTab: "Duas",
      favorites: "Favorites",
      readPhonetic: "Transliteration",
      readMeaning: "Translation",
      playAudio: "Listen Audio"
    },
    settings: {
      theme: "Theme",
      language: "Language",
      dark: "Dark Mode",
      light: "Light Mode",
      fontSize: "Text Size"
    }
  },
  ar: {
    appName: "نور الإسلام",
    tagline: "الدليل الشامل للصلاة والعبادة والحياة الإسلامية",
    tabs: {
      prayerTimes: "مواقيت الصلاة",
      namazGuide: "تعليم الصلاة",
      abdest: "الوضوء",
      qibla: "القبلة",
      zikir: "المسبحة",
      kuranDua: "القرآن والأدعية",
      kaza: "قضاء الصلوات",
      more: "المزيد",
      stats: "الإحصائيات",
      prophets: "الأنبياء",
      diniGunler: "المناسبات الدينية",
      myDuas: "دفتر أدعيتي",
      diyanet: "المصادر الموثوقة",
      hatim: "ختم القرآن",
      soruCevap: "سؤال وجواب (الفتاوى)"
    },
    prayerTimes: {
      title: "مواقيت الصلاة",
      imsak: "الفجر",
      gunes: "الشروق",
      ogle: "الظهر",
      ikindi: "العصر",
      aksam: "المغرب",
      yatsi: "العشاء",
      nextPrayer: "الصلاة القادمة",
      remaining: "الوقت المتبقي",
      currentPrayer: "الوقت الحالي",
      selectCity: "اختر المدينة",
      useGps: "تحديد الموقع",
      notificationsOn: "التنبيهات مفعلة",
      notificationsOff: "تفعيل التنبيهات",
      todayWisdom: "حكمة اليوم",
      qiblaCompass: "اتجاه القبلة",
      listenAdhan: "استماع للأذان",
      prayNow: "صل الآن"
    },
    namazGuide: {
      title: "دليل الصلاة المرئي والصوتي",
      subtitle: "خطوة بخطوة بالصور والنصوص الصوتية والترجمة",
      genderMale: "رجال",
      genderFemale: "نساء",
      stepByStep: "خطوة بخطوة",
      hidePrayersText: "إخفاء النصوص",
      showPrayersText: "إظهار النصوص",
      listenAudio: "استماع صوتي",
      stopAudio: "إيقاف",
      nextStep: "الخطوة التالية",
      prevStep: "الخطوة السابقة",
      finishPrayer: "إتمام الصلاة",
      startPrayer: "بدء الصلاة",
      currentVakitSuggested: "صلاة الوقت الحالي"
    },
    abdest: {
      title: "دليل الوضوء المصور",
      wuduNamaz: "الوضوء الأصغر",
      ghuslBoy: "الغسل الأكبر",
      tayammum: "التيمم",
      invalidators: "نواقض الوضوء",
      farzBadge: "فرض",
      sunnetBadge: "سنة"
    },
    zikirmatik: {
      title: "المسبحة الإلكترونية",
      count: "العدد",
      target: "الهدف",
      reset: "تصفير",
      customTarget: "تعديل الهدف",
      addCustom: "إضافة ذكر",
      hapticSound: "الصوت والاهتزاز",
      dailyReminder: "تذكير الأذكار اليومي"
    },
    kaza: {
      title: "متابعة قضاء الصلوات",
      subtitle: "سجل قضاء ما فاتك من صلوات وصيام",
      totalRemaining: "مجموع الصلوات الفائتة المتبقية",
      estimatedYears: "المدة التقديرية",
      save: "حفظ"
    },
    kuranDua: {
      title: "سور القرآن الكريم والأدعية",
      searchPlaceholder: "ابحث في السور، الأدعية والآيات...",
      surahsTab: "السور",
      duasTab: "الأدعية",
      favorites: "المفضلة",
      readPhonetic: "النطق الصوتي",
      readMeaning: "المعنى والتفسير",
      playAudio: "استماع"
    },
    settings: {
      theme: "المظهر",
      language: "اللغة",
      dark: "الوضع الليلي",
      light: "الوضع النهاري",
      fontSize: "حجم الخط"
    }
  },
  de: {
    appName: "Nur-u Islam",
    tagline: "Umfassender islamischer Gebets- & Lebensbegleiter",
    tabs: {
      prayerTimes: "Gebetszeiten",
      namazGuide: "Gebet lernen",
      abdest: "Gebetswaschung",
      qibla: "Qibla",
      zikir: "Tasbih",
      kuranDua: "Koran & Dua",
      kaza: "Nachholgebete",
      more: "Mehr",
      stats: "Statistiken",
      prophets: "Propheten",
      diniGunler: "Heilige Tage",
      myDuas: "Mein Bittbuch",
      diyanet: "Quellen",
      hatim: "Koran-Hatm",
      soruCevap: "Fragen & Antworten"
    },
    prayerTimes: {
      title: "Gebetszeiten",
      imsak: "Fadschr",
      gunes: "Sonnenaufgang",
      ogle: "Dhuhr",
      ikindi: "Asr",
      aksam: "Maghrib",
      yatsi: "Ischa",
      nextPrayer: "Nächstes Gebet",
      remaining: "Verbleibende Zeit",
      currentPrayer: "Aktuelle Gebetszeit",
      selectCity: "Stadt wählen",
      useGps: "Standort nutzen",
      notificationsOn: "Benachrichtigungen Ein",
      notificationsOff: "Benachrichtigungen Aktivieren",
      todayWisdom: "Weisheit des Tages",
      qiblaCompass: "Qibla-Richtung",
      listenAdhan: "Adhan anhören",
      prayNow: "Jetzt beten"
    },
    namazGuide: {
      title: "Visueller & auditiver Gebetsleitfaden",
      subtitle: "Schritt für Schritt Haltungen, arabische Rezitationen und Übersetzungen",
      genderMale: "Mann",
      genderFemale: "Frau",
      stepByStep: "Schritt für Schritt",
      hidePrayersText: "Texte ausblenden",
      showPrayersText: "Texte einblenden",
      listenAudio: "Vorlesen",
      stopAudio: "Stoppen",
      nextStep: "Nächster Schritt",
      prevStep: "Vorheriger Schritt",
      finishPrayer: "Gebet abschließen",
      startPrayer: "Gebet starten",
      currentVakitSuggested: "Empfohlenes Gebet der Stunde"
    },
    abdest: {
      title: "Visuelle Anleitung zur Gebetswaschung",
      wuduNamaz: "Wudu (Kleine Waschung)",
      ghuslBoy: "Ghusl (Große Waschung)",
      tayammum: "Tayammum (Symbolisch)",
      invalidators: "Was die Waschung bricht",
      farzBadge: "Pflicht (Fard)",
      sunnetBadge: "Sunnah"
    },
    zikirmatik: {
      title: "Digitales Tasbih",
      count: "Anzahl",
      target: "Ziel",
      reset: "Zurücksetzen",
      customTarget: "Ziel ändern",
      addCustom: "Eigenes Dhikr",
      hapticSound: "Ton & Vibration",
      dailyReminder: "Tägliche Erinnerung"
    },
    kaza: {
      title: "Nachholgebete-Tracker",
      subtitle: "Verfolgen und planen Sie Ihre versäumten Gebete",
      totalRemaining: "Verbleibende Nachholgebete",
      estimatedYears: "Geschätzte Dauer",
      save: "Speichern"
    },
    kuranDua: {
      title: "Koran-Suren & Bittgebete",
      searchPlaceholder: "Sure, Gebet, Vers suchen...",
      surahsTab: "Suren",
      duasTab: "Bittgebete",
      favorites: "Favoriten",
      readPhonetic: "Transliteration",
      readMeaning: "Übersetzung",
      playAudio: "Anhören"
    },
    settings: {
      theme: "Design",
      language: "Sprache",
      dark: "Dunkelmodus",
      light: "Hellmodus",
      fontSize: "Schriftgröße"
    }
  }
};
