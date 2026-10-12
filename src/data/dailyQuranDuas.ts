export interface QuranDuaItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: string;
  theme: 'magfirat' | 'huzur' | 'sifa' | 'rehberlik' | 'aile' | 'bereket';
  themeLabel: string;
  speaker: string; // e.g. "Hz. İbrahim (a.s.)", "Hz. Mûsâ (a.s.)", "Müminlerin Duası"
  virtue: string;
}

export const QURAN_DUAS_LIST: QuranDuaItem[] = [
  {
    id: "rabbena-atina",
    title: "Dünya ve Âhiret İyiliği Duası",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhirati haseneten ve kınâ azâben-nâr.",
    translation: "Rabbimiz! Bize dünyada da iyilik ve güzellik ver, âhirette de iyilik ve güzellik ver ve bizi cehennem azabından koru.",
    surahName: "Bakara Sûresi",
    surahNumber: 2,
    ayahNumber: "201",
    theme: "bereket",
    themeLabel: "Dünya & Âhiret",
    speaker: "Müminlerin Duası",
    virtue: "Resûlullah (s.a.v.) Efendimiz'in hem namazların ka'desinde hem tavafta en çok okuduğu ve tavsiye ettiği dualardandır."
  },
  {
    id: "rabbena-gfirlena",
    title: "Ana-Baba ve Müminler İçin Bağışlanma Duası",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration: "Rabbenagfirlî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hisâb.",
    translation: "Rabbimiz! Hesabın görüleceği günde; beni, anamı-babamı ve bütün inananları bağışla.",
    surahName: "İbrâhîm Sûresi",
    surahNumber: 14,
    ayahNumber: "41",
    theme: "magfirat",
    themeLabel: "Mağfiret & Aile",
    speaker: "Hz. İbrâhîm (a.s.)",
    virtue: "Namazın son oturuşunda Rabbenâ Âtinâ'dan sonra okunan bu dua, ebeveyn hakkını eda etmenin ve ümmete dua etmenin en güzel yoludur."
  },
  {
    id: "hz-musa-inshirah",
    title: "Gönül Ferahlığı ve Dilin Çözülmesi Duası",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
    transliteration: "Rabbişrah lî sadrî ve yessir lî emrî vahlül 'ukdeten min lisânî yefkahû kavlî.",
    translation: "Rabbim! Göğsümü genişlet, işimi kolaylaştır ve dilimdeki düğümü çöz ki sözümü iyi anlasınlar.",
    surahName: "Tâhâ Sûresi",
    surahNumber: 20,
    ayahNumber: "25-28",
    theme: "huzur",
    themeLabel: "Ferahlık & Kolaylık",
    speaker: "Hz. Mûsâ (a.s.)",
    virtue: "Zor bir işe başlarken, sınava girerken, heyecanlandığında veya mühim bir hitap yaparken kalbi teskin eden muazzam bir münacattır."
  },
  {
    id: "hz-yunus-tesbih",
    title: "Darlıktan ve Sıkıntıdan Kurtuluş Duası (Zünnûn)",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn.",
    translation: "Senden başka hiçbir ilâh yoktur; Sen her türlü eksiklikten münezzehsin. Şüphesiz ben nefsimi zulme uğratanlardan oldum.",
    surahName: "Enbiyâ Sûresi",
    surahNumber: 21,
    ayahNumber: "87",
    theme: "huzur",
    themeLabel: "Sıkıntıdan Kurtuluş",
    speaker: "Hz. Yûnus (a.s.)",
    virtue: "Peygamberimiz (s.a.v.) şöyle buyurmuştur: 'Balığın karnındaki Yûnus'un yaptığı bu duayı bir Müslüman herhangi bir sıkıntısında okursa Allah Teâlâ onun duasını muhakkak kabul eder.'"
  },
  {
    id: "hz-eyyub-sifa",
    title: "Hastalık ve Dertlerden Şifa Duası",
    arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
    transliteration: "Ennî messaniyez-durru ve ente erhamur-râhimîn.",
    translation: "Başıma bu dert geldi. Sen, merhametlilerin en merhametlisisin.",
    surahName: "Enbiyâ Sûresi",
    surahNumber: 21,
    ayahNumber: "83",
    theme: "sifa",
    themeLabel: "Şifa & Sabır",
    speaker: "Hz. Eyyûb (a.s.)",
    virtue: "Ağır hastalıklarda, bedeni veya ruhi acılarda edep ve tevazu ile şifa niyaz etmenin Kur'an'daki en müessir örneğidir."
  },
  {
    id: "hz-ibrahim-namaz",
    title: "Namazda Devamlılık ve Hayırlı Zürriyet Duası",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلاَةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    transliteration: "Rabbic'alnî mukîmes-salâti ve min zürriyyetî rabbenâ ve tekabbel dü'â'.",
    translation: "Rabbim! Beni ve soyumdan gelecekleri namazı dosdoğru kılanlardan eyle. Rabbimiz! Duamı kabul buyur.",
    surahName: "İbrâhîm Sûresi",
    surahNumber: 14,
    ayahNumber: "40",
    theme: "aile",
    themeLabel: "Namaz & Zürriyet",
    speaker: "Hz. İbrâhîm (a.s.)",
    virtue: "Kişinin kendisinin ve evlatlarının namaz kılma şuurunu muhafaza etmesi için her namazda okunması çok faziletlidir."
  },
  {
    id: "furkan-aile",
    title: "Göz Aydınlığı Eş ve Evlat Duası",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbenâ heb lenâ min ezvâcinâ ve zürriyyâtinâ kurrate a'yünin vec'alnâ lil-müttekîne imâmâ.",
    translation: "Rabbimiz! Bize gözümüzü aydınlatacak eşler ve zürriyetler bağışla ve bizi takvâ sahiplerine önder kıl.",
    surahName: "Furkân Sûresi",
    surahNumber: 25,
    ayahNumber: "74",
    theme: "aile",
    themeLabel: "Hayırlı Yuva",
    speaker: "Rahmân'ın Has Kulları",
    virtue: "Huzurlu bir evlilik, iffetli ve sâlih evlatlar yetiştirmek isteyenlerin dilinden düşürmemesi gereken bir Kur'an âyetidir."
  },
  {
    id: "taha-ilim",
    title: "İlim ve İrfanın Artırılması Duası",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidnî 'ilmâ.",
    translation: "Rabbim! İlmimi artır.",
    surahName: "Tâhâ Sûresi",
    surahNumber: 20,
    ayahNumber: "114",
    theme: "rehberlik",
    themeLabel: "İlim & Hikmet",
    speaker: "Hz. Muhammed (s.a.v.)",
    virtue: "Cenâb-ı Hakk'ın Sevgili Peygamberimiz'e bizzat emrettiği, her türlü ilim talebesinin vird edinmesi gereken özlü bir duadır."
  },
  {
    id: "bakara-amenerrasulu",
    title: "Kaldıramayacağımız Yükten Korunma Duası",
    arabic: "رَبَّنَا لاَ تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا رَبَّنَا وَلاَ تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا",
    transliteration: "Rabbenâ lâ tü'âhiznâ in nesînâ ev ahta'nâ, Rabbenâ ve lâ tahmil 'aleynâ ısran kemâ hameltehû 'alellezîne min kablinâ.",
    translation: "Rabbimiz! Unutur veya yanılırsak bizi sorumlu tutma! Rabbimiz! Bize, bizden öncekilere yüklediğin gibi ağır yük yükleme!",
    surahName: "Bakara Sûresi",
    surahNumber: 2,
    ayahNumber: "286",
    theme: "magfirat",
    themeLabel: "Af & Hafiflik",
    speaker: "Müminler",
    virtue: "Âmenerrasûlü'nün bu son âyeti, arşın altındaki hazinelerden indirilmiş olup her gece okunması hadis-i şerifle tavsiye edilmiştir."
  },
  {
    id: "ali-imran-istikamet",
    title: "Kalbin Kaymaması ve İstikamet Duası",
    arabic: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ",
    transliteration: "Rabbenâ lâ tüziğ kulûbenâ ba'de iz hedeytenâ ve heb lenâ min ledünke rahmeh, inneke entel-vehhâb.",
    translation: "Rabbimiz! Bizi doğru yola eriştirdikten sonra kalplerimizi saptırma! Bize tarafından bir rahmet bağışla. Şüphesiz bağışı en bol olan yalnız sensin.",
    surahName: "Âl-i İmrân Sûresi",
    surahNumber: 3,
    ayahNumber: "8",
    theme: "rehberlik",
    themeLabel: "Hidayet & Sebat",
    speaker: "İlimde Derinleşenler",
    virtue: "Hidayet nimetine eriştikten sonra son nefeste imanla gidebilmek ve kalbin fitnelerden korunması için okunur."
  },
  {
    id: "hasr-kardeslik",
    title: "Mümin Kardeşler İçin Şefkat ve Af Duası",
    arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا",
    transliteration: "Rabbenagfir lenâ ve li-ihvâninellezîne sebekûnâ bil-îmâni ve lâ tec'al fî kulûbinâ gıllen lillezîne âmenû.",
    translation: "Rabbimiz! Bizi ve bizden önce inanmış olan kardeşlerimizi bağışla; kalplerimizde iman edenlere karşı hiçbir kin ve haset bırakma!",
    surahName: "Haşr Sûresi",
    surahNumber: 59,
    ayahNumber: "10",
    theme: "magfirat",
    themeLabel: "Kardeşlik & Kalp Temizliği",
    speaker: "Muhâcir ve Ensâr'a Tabi Olanlar",
    virtue: "Kalpteki kin, kıskançlık ve hasedi söküp atan, İslam kardeşliğini ve muhabbeti pekiştiren bir duadır."
  },
  {
    id: "isra-anne-baba",
    title: "Anne ve Babaya Merhamet Duası",
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhümâ kemâ rabbeyânî sagîrâ.",
    translation: "Rabbim! Onlar beni küçükken nasıl özenle büyütüp yetiştirdilerse, Sen de onlara öyle merhamet eyle.",
    surahName: "İsrâ Sûresi",
    surahNumber: 17,
    ayahNumber: "24",
    theme: "aile",
    themeLabel: "Anne & Baba",
    speaker: "Vefakâr Evlatlar",
    virtue: "Hayatta olsun veya ahirete irtihal etmiş olsun anne ve babaya yapılacak en büyük vefâ ve dua hediyesidir."
  }
];

export interface DailyVerseItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: string;
  theme: string;
  lesson: string;
}

export const DAILY_VERSES_LIST: DailyVerseItem[] = [
  {
    id: "rad-28",
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    transliteration: "Ellezîne âmenû ve tatme'innü kulûbühüm bi-zikrillâh, elâ bi-zikrillâhi tatme'innül-kulûb.",
    translation: "Onlar, iman etmiş ve kalpleri Allah'ın zikriyle huzura kavuşmuş kimselerdir. Bilesiniz ki, kalpler ancak Allah'ı anmakla huzur bulur.",
    surahName: "Ra'd Sûresi",
    surahNumber: 13,
    ayahNumber: "28",
    theme: "Huzur & Zikir",
    lesson: "Dünyanın telaşında yorulan ruhun yegâne şifası Allah'ı anmaktır."
  },
  {
    id: "insirah-5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Fe-inne me'al-'usri yusrâ. İnne me'al-'usri yusrâ.",
    translation: "Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten, her güçlükle beraber muhakkak bir kolaylık vardır!",
    surahName: "İnşirâh Sûresi",
    surahNumber: 94,
    ayahNumber: "5-6",
    theme: "Umut & Müjde",
    lesson: "Hiçbir dert kalıcı değildir; Allah bir zorluğun peşinden iki kat kolaylık halk eder."
  },
  {
    id: "talak-2-3",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴿٢﴾ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    transliteration: "Ve men yettekıllâhe yec'al lehû mahrecâ, ve yerzukhu min haysü lâ yahtesib.",
    translation: "Kim Allah'a karşı takva sahibi olursa, Allah ona bir çıkış yolu açar ve onu hiç beklemediği yerden rızıklandırır.",
    surahName: "Talâk Sûresi",
    surahNumber: 65,
    ayahNumber: "2-3",
    theme: "Tevekkül & Rızık",
    lesson: "Takva ve doğruluk, kapalı bütün kapıları açan ilahi bir anahtardır."
  },
  {
    id: "bakara-186",
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    transliteration: "Ve izâ seeleke 'ıbâdî 'annî fe-innî karîb, ücîbü da'veted-dâ'ı izâ de'ân.",
    translation: "Kullarım sana Beni sorduklarında de ki: Şüphesiz Ben onlara çok yakınım! Bana dua ettiği vakit dua edenin dileğine karşılık veririm.",
    surahName: "Bakara Sûresi",
    surahNumber: 2,
    ayahNumber: "186",
    theme: "Yakınlık & Dua",
    lesson: "Allah kuluna şah damarından daha yakındır, samimi hiçbir yakarış geri çevrilmez."
  },
  {
    id: "zumer-53",
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    transliteration: "Kul yâ 'ıbâdiyellezîne esrefû 'alâ enfüsihim lâ taknetû min rahmetillâh, innallâhe yagfiruz-zünûbe cemî'â.",
    translation: "De ki: 'Ey nefisleri aleyhine haddi aşmış kullarım! Allah'ın rahmetinden ümidinizi kesmeyin. Muhakkak ki Allah bütün günahları bağışlar.'",
    surahName: "Zümer Sûresi",
    surahNumber: 39,
    ayahNumber: "53",
    theme: "Bağışlanma & Ümit",
    lesson: "Kur'an'daki en ümit verici âyetlerden biridir; tövbe kapısı son nefese kadar açıktır."
  },
  {
    id: "fecr-27-30",
    arabic: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ﴿٢٧﴾ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً",
    transliteration: "Yâ eyyetühen-nefsül-mutme'inneh. İrci'î ilâ rabbiki râdıyeten merdıyyeten.",
    translation: "Ey huzura kavuşmuş mutmain nefis! Sen O'ndan hoşnut, O da senden hoşnut olarak Rabbine dön!",
    surahName: "Fecr Sûresi",
    surahNumber: 89,
    ayahNumber: "27-28",
    theme: "Rıza & Cennet",
    lesson: "Dünyanın fani heveslerinden arınıp Rabbine teslim olan gönüller ebedi huzura erer."
  }
];
