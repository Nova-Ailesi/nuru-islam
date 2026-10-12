/**
 * Quran Juz (Cüz) Data for Hatm-i Şerif Tracking
 * Complete information for all 30 Juz with page ranges, surah boundaries, and themes
 */

export interface QuranJuzItem {
  cuzNumber: number;
  name: string;
  arabicName: string;
  startSurah: string;
  endSurah: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  keyThemes: string;
  quarterDescription: string;
}

export const QURAN_JUZ_LIST: QuranJuzItem[] = [
  {
    cuzNumber: 1,
    name: "1. Cüz",
    arabicName: "الجزء ١ (الم)",
    startSurah: "Fâtiha 1",
    endSurah: "Bakara 141",
    startPage: 1,
    endPage: 20,
    totalPages: 20,
    keyThemes: "Fâtiha Suresi, Elif-Lâm-Mîm, Takva ehli, Hz. Âdem ve İblis kıssası, İsrailoğulları ve Hz. İbrahim'in Kâbe inşası.",
    quarterDescription: "Fâtiha 1'den Bakara 141'e kadar"
  },
  {
    cuzNumber: 2,
    name: "2. Cüz",
    arabicName: "الجزء ٢ (سَيَقُولُ)",
    startSurah: "Bakara 142",
    endSurah: "Bakara 252",
    startPage: 21,
    endPage: 40,
    totalPages: 20,
    keyThemes: "Kıblenin Mescid-i Aksa'dan Kâbe'ye çevrilmesi, Sabır ve namaz, Oruç ve Ramazan hükümleri, Hac ibadeti, Cihad, Tâlût ve Câlût kıssası.",
    quarterDescription: "Bakara 142'den Bakara 252'ye kadar"
  },
  {
    cuzNumber: 3,
    name: "3. Cüz",
    arabicName: "الجزء ٣ (تِلْكَ الرُّسُلُ)",
    startSurah: "Bakara 253",
    endSurah: "Âl-i İmrân 92",
    startPage: 41,
    endPage: 60,
    totalPages: 20,
    keyThemes: "Âyet-el Kürsî, Dinde zorlama olmaması, İnfak ahlakı, Faiz yasağı, Borçlanma âyeti (Müdâyene), Âl-i İmrân başlangıcı, Hz. Meryem ve Hz. İsa müjdesi.",
    quarterDescription: "Bakara 253'ten Âl-i İmrân 92'ye kadar"
  },
  {
    cuzNumber: 4,
    name: "4. Cüz",
    arabicName: "الجزء ٤ (لَنْ تَنَالُوا)",
    startSurah: "Âl-i İmrân 93",
    endSurah: "Nisâ 23",
    startPage: 61,
    endPage: 80,
    totalPages: 20,
    keyThemes: "Uhud Savaşı ibretleri, Şehitlerin fazileti, Allah'ın ipine sımsıkı sarılma emri, Nisâ suresine giriş, Yetim hakları, Miras paylaşımları ve evlilik kuralları.",
    quarterDescription: "Âl-i İmrân 93'ten Nisâ 23'e kadar"
  },
  {
    cuzNumber: 5,
    name: "5. Cüz",
    arabicName: "الجزء ٥ (وَالْمُحْصَنَاتُ)",
    startSurah: "Nisâ 24",
    endSurah: "Nisâ 147",
    startPage: 81,
    endPage: 100,
    totalPages: 20,
    keyThemes: "Aile ahlakı, Emanetlerin ehline verilmesi, Adaletle hükmetme, Münafıkların özellikleri, Korku namazı, Selamlaşma adabı.",
    quarterDescription: "Nisâ 24'ten Nisâ 147'ye kadar"
  },
  {
    cuzNumber: 6,
    name: "6. Cüz",
    arabicName: "الجزء ٦ (لَا يُحِبُّ اللَّهُ)",
    startSurah: "Nisâ 148",
    endSurah: "Mâide 81",
    startPage: 101,
    endPage: 120,
    totalPages: 20,
    keyThemes: "Kötü sözün açığa vurulmaması, Ehl-i Kitap ile münasebetler, Mâide suresine giriş, Helal ve haram gıdalar, Abdest âyeti, Şahitlikte adalet.",
    quarterDescription: "Nisâ 148'den Mâide 81'e kadar"
  },
  {
    cuzNumber: 7,
    name: "7. Cüz",
    arabicName: "الجزء ٧ (وَإِذَا سَمِعُوا)",
    startSurah: "Mâide 82",
    endSurah: "En'âm 110",
    startPage: 121,
    endPage: 140,
    totalPages: 20,
    keyThemes: "Yemin kefareti, İçki ve kumarın kesin haram kılınması, Kâbe hürmeti, En'âm suresi, Kâinatın yaratılışı ve tevhid delilleri, Hz. İbrahim'in yıldız ve aya bakışı.",
    quarterDescription: "Mâide 82'den En'âm 110'a kadar"
  },
  {
    cuzNumber: 8,
    name: "8. Cüz",
    arabicName: "الجزء ٨ (وَلَوْ أَنَّنَا)",
    startSurah: "En'âm 111",
    endSurah: "A'râf 87",
    startPage: 141,
    endPage: 160,
    totalPages: 20,
    keyThemes: "On temel ahlak kuralı (İlahi buyruklar), A'râf suresine giriş, Cennet ve cehennem ehlinin konuşmaları, A'râf ehli, Hz. Nuh, Hz. Hud, Hz. Salih kıssaları.",
    quarterDescription: "En'âm 111'den A'râf 87'ye kadar"
  },
  {
    cuzNumber: 9,
    name: "9. Cüz",
    arabicName: "الجزء ٩ (قَالَ الْمَلَأُ)",
    startSurah: "A'râf 88",
    endSurah: "Enfâl 40",
    startPage: 161,
    endPage: 180,
    totalPages: 20,
    keyThemes: "Hz. Şuayb ve Medyen kavmi, Hz. Musa ve Firavun mücadelesi, Sihirbazların secdeye kapanması, Kālû Belâ misakı, Enfâl suresine giriş ve Bedir Savaşı.",
    quarterDescription: "A'râf 88'den Enfâl 40'a kadar"
  },
  {
    cuzNumber: 10,
    name: "10. Cüz",
    arabicName: "الجزء ١٠ (وَاعْلَمُوا)",
    startSurah: "Enfâl 41",
    endSurah: "Tevbe 92",
    startPage: 181,
    endPage: 200,
    totalPages: 20,
    keyThemes: "Ganimetlerin taksimi, Kalplerin kaynaşması ve sabır, Tevbe suresine giriş, Müşriklerle ahitler, Mescidlerin imarı, Tevbe ve infak, Tebük Seferi.",
    quarterDescription: "Enfâl 41'den Tevbe 92'ye kadar"
  },
  {
    cuzNumber: 11,
    name: "11. Cüz",
    arabicName: "الجزء ١١ (يَعْتَذِرُونَ)",
    startSurah: "Tevbe 93",
    endSurah: "Hûd 5",
    startPage: 201,
    endPage: 220,
    totalPages: 20,
    keyThemes: "Muhacir ve Ensar'ın fazileti, Mescid-i Dırar fitnesi, Resûlullah'ın şefkati, Yûnus suresi, Kur'an'ın hikmetleri, Hûd suresine giriş ve rızık güvencesi.",
    quarterDescription: "Tevbe 93'ten Hûd 5'e kadar"
  },
  {
    cuzNumber: 12,
    name: "12. Cüz",
    arabicName: "الجزء ١٢ (وَمَا مِنْ دَابَّةٍ)",
    startSurah: "Hûd 6",
    endSurah: "Yûsuf 52",
    startPage: 221,
    endPage: 240,
    totalPages: 20,
    keyThemes: "Hz. Nuh tufanı ve gemi inşası, Hz. Salih ve helak olan Semûd, Yûsuf suresi (Ahsenü'l-Kasas), Hz. Yusuf'un rüyası, Kuyuya atılışı ve Mısır sarayı.",
    quarterDescription: "Hûd 6'dan Yûsuf 52'ye kadar"
  },
  {
    cuzNumber: 13,
    name: "13. Cüz",
    arabicName: "الجزء ١٣ (وَمَا أُبَرِّئُ)",
    startSurah: "Yûsuf 53",
    endSurah: "İbrâhîm 52",
    startPage: 241,
    endPage: 260,
    totalPages: 20,
    keyThemes: "Hz. Yusuf'un Mısır Azizi oluşu ve kardeşleriyle buluşması, Ra'd suresi (Gök gürültüsünün tesbihi), Kalplerin ancak Allah'ı anmakla mutmain olması, İbrâhîm suresi.",
    quarterDescription: "Yûsuf 53'ten İbrâhîm 52'ye kadar"
  },
  {
    cuzNumber: 14,
    name: "14. Cüz",
    arabicName: "الجزء ١٤ (رُبَمَا)",
    startSurah: "Hicr 1",
    endSurah: "Nahl 128",
    startPage: 261,
    endPage: 280,
    totalPages: 20,
    keyThemes: "Hicr suresi, Kur'an'ın korunmuşluğu taahhüdü, Nahl suresi (Nimetler suresi), Bal arısının ilahi ilhamı, Anne karnındaki yaratılış safhaları.",
    quarterDescription: "Hicr 1'den Nahl 128'e kadar"
  },
  {
    cuzNumber: 15,
    name: "15. Cüz",
    arabicName: "الجزء ١٥ (سُبْحَانَ الَّذِي)",
    startSurah: "İsrâ 1",
    endSurah: "Kehf 74",
    startPage: 281,
    endPage: 300,
    totalPages: 20,
    keyThemes: "İsrâ ve Mirac hadisesi, Anne babaya 'öf' bile dememe emri, 14 ahlaki kural, Kehf suresi, Ashab-ı Kehf gençleri, İki bahçe sahibi misali.",
    quarterDescription: "İsrâ 1'den Kehf 74'e kadar"
  },
  {
    cuzNumber: 16,
    name: "16. Cüz",
    arabicName: "الجزء ١٦ (قَالَ أَلَمْ)",
    startSurah: "Kehf 75",
    endSurah: "Tâhâ 135",
    startPage: 301,
    endPage: 320,
    totalPages: 20,
    keyThemes: "Hz. Musa ve Hz. Hızır yolculuğu, Zülkarneyn ve Ye'cûc-Me'cûc, Meryem suresi (Hz. Zekeriyya ve Hz. İsa doğumu), Tâhâ suresi (Tûr Dağı ve ilahi hitap).",
    quarterDescription: "Kehf 75'ten Tâhâ 135'e kadar"
  },
  {
    cuzNumber: 17,
    name: "17. Cüz",
    arabicName: "الجزء ١٧ (اقْتَرَبَ لِلنَّاسِ)",
    startSurah: "Enbiyâ 1",
    endSurah: "Hac 78",
    startPage: 321,
    endPage: 340,
    totalPages: 20,
    keyThemes: "Enbiyâ suresi, İnsanların hesabının yaklaşması, Peygamberlerin duaları (Hz. Eyyub, Hz. Yunus), 'Seni âlemlere rahmet olarak gönderdik', Hac suresi.",
    quarterDescription: "Enbiyâ 1'den Hac 78'e kadar"
  },
  {
    cuzNumber: 18,
    name: "18. Cüz",
    arabicName: "الجزء ١٨ (قَدْ أَفْلَحَ)",
    startSurah: "Mü'minûn 1",
    endSurah: "Furkân 20",
    startPage: 341,
    endPage: 360,
    totalPages: 20,
    keyThemes: "Kurtuluşa eren müminlerin vasıfları, Nûr suresi, İffet ve tesettür, Nur âyeti ('Allâhu nûrus-semâvâti vel-ard'), İfk hadisesi, Furkân suresine giriş.",
    quarterDescription: "Mü'minûn 1'den Furkân 20'ye kadar"
  },
  {
    cuzNumber: 19,
    name: "19. Cüz",
    arabicName: "الجزء ١٩ (وَقَالَ الَّذِينَ)",
    startSurah: "Furkân 21",
    endSurah: "Neml 55",
    startPage: 361,
    endPage: 380,
    totalPages: 20,
    keyThemes: "Rahmân'ın has kullarının vasıfları ('İbâdurrahmân'), Şuarâ suresi (Peygamberlerin tebliğ mücadelesi), Neml suresi, Hz. Süleyman, karınca ve Hüdhüd kıssası.",
    quarterDescription: "Furkân 21'den Neml 55'e kadar"
  },
  {
    cuzNumber: 20,
    name: "20. Cüz",
    arabicName: "الجزء ٢٠ (أَمَّنْ خَلَقَ)",
    startSurah: "Neml 56",
    endSurah: "Ankebût 45",
    startPage: 381,
    endPage: 400,
    totalPages: 20,
    keyThemes: "Belkıs ve Hz. Süleyman sarayı, Kasas suresi (Hz. Musa'nın nehre bırakılması ve Medyen yılları), Karun'un hazineleri ve batışı, Ankebût (Örümcek ağı misali).",
    quarterDescription: "Neml 56'dan Ankebût 45'e kadar"
  },
  {
    cuzNumber: 21,
    name: "21. Cüz",
    arabicName: "الجزء ٢١ (اتْلُ مَا أُوحِيَ)",
    startSurah: "Ankebût 46",
    endSurah: "Ahzâb 30",
    startPage: 401,
    endPage: 420,
    totalPages: 20,
    keyThemes: "Namazın kötülüklerden alıkoyması, Rûm suresi (Rumların zaferi mucizesi), Lokman suresi ve oğluna hikmetli öğütleri, Secde suresi, Ahzâb Savaşı.",
    quarterDescription: "Ankebût 46'dan Ahzâb 30'a kadar"
  },
  {
    cuzNumber: 22,
    name: "22. Cüz",
    arabicName: "الجزء ٢٢ (وَمَنْ يَقْنُتْ)",
    startSurah: "Ahzâb 31",
    endSurah: "Yâsîn 27",
    startPage: 421,
    endPage: 440,
    totalPages: 20,
    keyThemes: "Peygamber hanımlarının edebi, Efendimiz'e salat-ü selam emri, Sebe' suresi, Fâtır suresi (Meleklerin kanatları), Yâsîn-i Şerif girişi ve Habib-i Neccar kıssası.",
    quarterDescription: "Ahzâb 31'den Yâsîn 27'ye kadar"
  },
  {
    cuzNumber: 23,
    name: "23. Cüz",
    arabicName: "الجزء ٢٣ (وَمَا أَنْزَلْنَا)",
    startSurah: "Yâsîn 28",
    endSurah: "Zümer 31",
    startPage: 441,
    endPage: 460,
    totalPages: 20,
    keyThemes: "Yâsîn suresi ('Kün fe-yekûn' âyeti), Sâffât suresi (Hz. İbrahim ve oğlunu kurban etme imtihanı), Sâd suresi (Hz. Davud ve Süleyman), Zümer suresine giriş.",
    quarterDescription: "Yâsîn 28'den Zümer 31'e kadar"
  },
  {
    cuzNumber: 24,
    name: "24. Cüz",
    arabicName: "الجزء ٢٤ (فَمَنْ أَظْلَمُ)",
    startSurah: "Zümer 32",
    endSurah: "Fussilet 46",
    startPage: 461,
    endPage: 480,
    totalPages: 20,
    keyThemes: "Allah'ın rahmetinden ümit kesmeme âyeti (Zümer 53), Mü'min (Gâfir) suresi (Arşı taşıyan meleklerin duası, Mümin kimsenin konuşması), Fussilet suresi.",
    quarterDescription: "Zümer 32'den Fussilet 46'ya kadar"
  },
  {
    cuzNumber: 25,
    name: "25. Cüz",
    arabicName: "الجزء ٢٥ (إِلَيْهِ يُرَدُّ)",
    startSurah: "Fussilet 47",
    endSurah: "Câsiye 37",
    startPage: 481,
    endPage: 500,
    totalPages: 20,
    keyThemes: "Şûrâ suresi (İstişare ahlakı), Zuhruf suresi (Kur'an'ın apaçık oluşu), Duhân suresi (Mübarek Kadir ve Beraat gecesi işareti), Câsiye suresi.",
    quarterDescription: "Fussilet 47'den Câsiye 37'ye kadar"
  },
  {
    cuzNumber: 26,
    name: "26. Cüz",
    arabicName: "الجزء ٢٦ (حم)",
    startSurah: "Ahkâf 1",
    endSurah: "Zâriyât 30",
    startPage: 501,
    endPage: 520,
    totalPages: 20,
    keyThemes: "Ahkâf suresi, Muhammed suresi, Fetih suresi (Mekke'nin fethi ve Hudeybiye zaferi), Hucurât suresi (İslam kardeşliği, gıybet yasağı, tebeyyün), Kâf suresi.",
    quarterDescription: "Ahkâf 1'den Zâriyât 30'a kadar"
  },
  {
    cuzNumber: 27,
    name: "27. Cüz",
    arabicName: "الجزء ٢٧ (قَالَ فَمَا خَطْبُكُمْ)",
    startSurah: "Zâriyât 31",
    endSurah: "Hadîd 29",
    startPage: 521,
    endPage: 540,
    totalPages: 20,
    keyThemes: "Tûr suresi, Necm suresi (Mirac ve Sidretü'l-Müntehâ), Kamer suresi (Ayın yarılması), Rahmân suresi ('Hangi nimetini yalanlarsınız?'), Vâkıa suresi, Hadîd suresi.",
    quarterDescription: "Zâriyât 31'den Hadîd 29'a kadar"
  },
  {
    cuzNumber: 28,
    name: "28. Cüz",
    arabicName: "الجزء ٢٨ (قَدْ سَمِعَ اللَّهُ)",
    startSurah: "Mücâdele 1",
    endSurah: "Tahrîm 12",
    startPage: 541,
    endPage: 560,
    totalPages: 20,
    keyThemes: "Mücâdele, Haşr suresi ('Hüvallâhüllezî' haşr sonu âyetleri), Mümtehine, Saf, Cum'a suresi (Cuma namazı çağrısı), Münâfikûn, Teğâbün, Talâk, Tahrîm sureleri.",
    quarterDescription: "Mücâdele 1'den Tahrîm 12'ye kadar"
  },
  {
    cuzNumber: 29,
    name: "29. Cüz",
    arabicName: "الجزء ٢٩ (تَبَارَكَ الَّذِي)",
    startSurah: "Mülk 1",
    endSurah: "Mürselât 50",
    startPage: 561,
    endPage: 580,
    totalPages: 20,
    keyThemes: "Mülk (Tebâreke) suresi (Kabir azabından koruyan sure), Kalem, Hâkka, Meâric, Nuh, Cin, Müzzemmil (Gece teheccüd namazı), Müddessir, Kıyâme, İnsân, Mürselât.",
    quarterDescription: "Mülk 1'den Mürselât 50'ye kadar"
  },
  {
    cuzNumber: 30,
    name: "30. Cüz",
    arabicName: "الجزء ٣٠ (عَمَّ يَتَسَاءَلُونَ)",
    startSurah: "Nebe 1",
    endSurah: "Nâs 6",
    startPage: 581,
    endPage: 604,
    totalPages: 24,
    keyThemes: "Amme Cüzü: Nebe, Nâziât, Abese, Tekvîr, İnfitâr, Mutaffifîn, İnşikâk, Bürûc, Târık, A'lâ, Gâşiye, Fecr, Beled, Şems, Leyl, Duhâ, İnşirâh, Tîn, Alak, Kadir, Beyyine, Zilzâl, Âdiyât, Kâria, Tekâsür, Asr, Hümeze, Fîl, Kureyş, Mâûn, Kevser, Kâfirûn, Nasr, Tebbet, İhlâs, Felak, Nâs.",
    quarterDescription: "Nebe 1'den Nâs 6'ya kadar (Hatim Sonu)"
  }
];

export interface HatimSession {
  id: string;
  title: string;
  startDate: string;
  targetEndDate?: string;
  completedJuz: number[]; // e.g. [1, 2, 3]
  juzProgressPages: Record<number, number>; // { [cuzNumber]: pagesRead (0..20) }
  assignedUsers?: Record<number, string>; // for group hatim: { 1: "Ahmet", 2: "Fatma" }
  notes?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export const OFFICIAL_HATIM_DUA = {
  title: "Diyanet Onaylı Hatm-i Şerif Duâsı",
  arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ.
اللَّهُمَّ رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ، وَتُبْ عَلَيْنَا يَا مَوْلَانَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.
اللَّهُمَّ ارْزُقْنَا بِكُلِّ حَرْفٍ مِنَ الْقُرْآنِ حَلَاوَةً، وَبِكُلِّ كَلِمَةٍ كَرَامَةً، وَبِكُلِّ آيَةٍ سَعَادَةً، وَبِكُلِّ سُورَةٍ سَلَامَةً، وَبِكُلِّ جُزْءٍ جَزَاءً.
اللَّهُمَّ اجْعَلِ الْقُرْآنَ لَنَا فِي الدُّنْيَا قَرِينًا، وَفِي الْقَبْرِ مُؤْنِسًا، وَفِي الْقِيَامَةِ شَفِيعًا، وَعَلَى الصِّرَاطِ نُورًا، وَإِلَى الْجَنَّةِ رَفِيقًا، وَمِنَ النَّارِ سِتْرًا وَحِجَابًا.
اللَّهُمَّ اغْفِرْ لِآبَائِنَا وَأُمَّهَاتِنَا وَأَسَاتِذَتِنَا وَلِجَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ. بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.`,
  transliteration: `Bismillâhirrahmânirrahîm.
Elhamdü lillâhi rabbil-'âlemîn. Vessalâtü vesselâmü 'alâ rasûlinâ Muhammedin ve 'alâ âlihî ve sahbihî ecma'în.
Allâhümme rabbenâ tekabbel minnâ inneke entes-semî'ul-'alîm. Ve tüb 'aleynâ yâ mevlânâ inneke entet-tevvâbür-rahîm.
Allâhümmer-zuknâ bi-külli harfin minel-kur'âni halâveh, ve bi-külli kelimetin kerâmeh, ve bi-külli âyetin se'âdeh, ve bi-külli sûretin selâmeh, ve bi-külli cüz'in cezâ'.
Allâhümmec'alil-kur'âne lenâ fid-dünyâ karînâ, ve fil-kabri mûnisâ, ve fil-kıyâmeti şefî'â, ve 'alas-sırâtı nûrâ, ve ilel-cenneti rafîkâ, ve minen-nâri sitrav-ve hicâbâ.
Allâhümmağfir li-âbâinâ ve ümmehâtinâ ve esâtîzinâ ve li-cemî'il-mü'minîne vel-mü'minât. Bi-rahmetike yâ erhamer-râhimîn. Âmîn.`,
  meaning: `Rahmân ve Rahîm olan Allah'ın adıyla.
Hamd âlemlerin Rabbi olan Allah'a mahsustur. Salât ve selâm Peygamberimiz Hz. Muhammed'e, âline ve bütün ashabına olsun.
Ey Rabbimiz! Okuduğumuz Kur'an-ı Kerim'i bizden kabul eyle. Şüphesiz Sen her şeyi hakkıyla işiten ve bilensin. Tövbelerimizi kabul eyle; şüphesiz Sen tövbeleri çokça kabul eden ve çok merhamet edensin.
Allah'ım! Kur'an'ın her bir harfi hürmetine bize kalbimizde manevi tatlılık, her kelimesiyle ikram, her âyetiyle ebedi saadet, her sûresiyle selamet ve her cüzüyle katından büyük mükâfatlar ihsan eyle!
Allah'ım! Kur'an-ı Kerim'i dünyada bize en hayırlı yoldaş, kabirde can yoldaşı, kıyamette şefaatçi, sırat köprüsünde aydınlatıcı nur, cennete ulaştırıcı arkadaş ve cehennem ateşine karşı koruyucu bir kalkan kıl!
Allah'ım! Anne ve babalarımızı, hocalarımızı ve bütün inanan müminleri bağışla. Rahmetinle muamele eyle ey merhametlilerin en merhametlisi! Âmin, velhamdü lillâhi Rabbil-'âlemîn.`
};
