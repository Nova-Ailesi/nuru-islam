export interface DistrictInfo {
  name: string;
  latOffset?: number; // micro offset from province center
  lngOffset?: number;
}

export interface ProvinceItem {
  plate: number;
  name: string;
  latitude: number;
  longitude: number;
  districts: string[];
}

export const TURKISH_PROVINCES: ProvinceItem[] = [
  { plate: 1, name: "Adana", latitude: 37.0000, longitude: 35.3213, districts: ["Merkez", "Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan", "Kozan", "İmamoğlu", "Karataş", "Karaisalı", "Pozantı", "Yumurtalık", "Tufanbeyli", "Feke", "Aladağ", "Saimbeyli"] },
  { plate: 2, name: "Adıyaman", latitude: 37.7648, longitude: 38.2786, districts: ["Merkez", "Kâhta", "Besni", "Gölbaşı", "Gerger", "Sincik", "Çelikhan", "Tut", "Samsat"] },
  { plate: 3, name: "Afyonkarahisar", latitude: 38.7507, longitude: 30.5567, districts: ["Merkez", "Sandıklı", "Dinar", "Bolvadin", "Sinanpaşa", "Emirdağ", "Şuhut", "Çay", "İhsaniye", "İscehisar", "Dazkırı", "Çobanlar", "Başmakçı", "Evciler", "Bayat", "Hocalar", "Kızılören"] },
  { plate: 4, name: "Ağrı", latitude: 39.7191, longitude: 43.0503, districts: ["Merkez", "Patnos", "Doğubayazıt", "Diyadin", "Eleşkirt", "Tutak", "Taşlıçay", "Hamur"] },
  { plate: 5, name: "Amasya", latitude: 40.6534, longitude: 35.8331, districts: ["Merkez", "Merzifon", "Suluova", "Taşova", "Gümüşhacıköy", "Göynücek", "Hamamözü"] },
  { plate: 6, name: "Ankara", latitude: 39.9334, longitude: 32.8597, districts: ["Merkez", "Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı", "Çubuk", "Kahramankazan", "Beypazarı", "Elmadağ", "Şereflikoçhisar", "Akyurt", "Nallıhan", "Haymana", "Kızılcahamam", "Bala", "Kalecik", "Ayaş", "Güdül", "Çamlıdere", "Evren"] },
  { plate: 7, name: "Antalya", latitude: 36.8969, longitude: 30.7133, districts: ["Merkez", "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Serik", "Aksu", "Kumluca", "Döşemealtı", "Kaş", "Korkuteli", "Gazipaşa", "Finike", "Kemer", "Elmalı", "Demre", "Akseki", "Gündoğmuş", "İbradı"] },
  { plate: 8, name: "Artvin", latitude: 41.1828, longitude: 41.8183, districts: ["Merkez", "Hopa", "Borçka", "Yusufeli", "Arhavi", "Şavşat", "Ardanuç", "Kemalpaşa", "Murgul"] },
  { plate: 9, name: "Aydın", latitude: 37.8560, longitude: 27.8416, districts: ["Merkez (Efeler)", "Efeler", "Kuşadası", "Söke", "Nazilli", "Didim", "İncirliova", "Çine", "Germencik", "Bozdoğan", "Köşk", "Kuyucak", "Sultanhisar", "Karacasu", "Yenipazar", "Buharkent", "Karpuzlu", "Koçarlı"] },
  { plate: 10, name: "Balıkesir", latitude: 39.6484, longitude: 27.8826, districts: ["Merkez (Karesi)", "Altıeylül", "Karesi", "Edremit", "Bandırma", "Gönen", "Ayvalık", "Burhaniye", "Bigadiç", "Susurluk", "Dursunbey", "Sındırgı", "İvrindi", "Erdek", "Havran", "Kepsut", "Manyas", "Savaştepe", "Balya", "Gömeç", "Marmara"] },
  { plate: 11, name: "Bilecik", latitude: 40.1451, longitude: 29.9799, districts: ["Merkez", "Bozüyük", "Osmaneli", "Söğüt", "Gölpazarı", "Pazaryeri", "Yenipazar", "İnhisar"] },
  { plate: 12, name: "Bingöl", latitude: 38.8854, longitude: 40.4983, districts: ["Merkez", "Genç", "Solhan", "Karlıova", "Adaklı", "Kiğı", "Yedisu", "Yayladere"] },
  { plate: 13, name: "Bitlis", latitude: 38.4006, longitude: 42.1095, districts: ["Merkez", "Tatvan", "Güroymak", "Ahlat", "Hizan", "Mutki", "Adilcevaz"] },
  { plate: 14, name: "Bolu", latitude: 40.7392, longitude: 31.6089, districts: ["Merkez", "Gerede", "Mengen", "Mudurnu", "Göynük", "Yeniçağa", "Dörtdivan", "Seben", "Kıbrıscık"] },
  { plate: 15, name: "Burdur", latitude: 37.7203, longitude: 30.2908, districts: ["Merkez", "Bucak", "Gölhisar", "Yeşilova", "Çavdır", "Tefenni", "Ağlasun", "Karamanlı", "Altınyayla", "Çeltikçi", "Kemer"] },
  { plate: 16, name: "Bursa", latitude: 40.1885, longitude: 29.0610, districts: ["Merkez (Osmangazi)", "Osmangazi", "Yıldırım", "Nilüfer", "İnegöl", "Gemlik", "Mustafakemalpaşa", "Mudanya", "Gürsu", "Karacabey", "Orhangazi", "Kestel", "Yenişehir", "İznik", "Orhaneli", "Keles", "Büyükorhan", "Harmancık"] },
  { plate: 17, name: "Çanakkale", latitude: 40.1553, longitude: 26.4142, districts: ["Merkez", "Biga", "Çan", "Gelibolu", "Yenice", "Ayvacık", "Ezine", "Bayramiç", "Lapseki", "Eceabat", "Gökçeada", "Bozcaada"] },
  { plate: 18, name: "Çankırı", latitude: 40.6013, longitude: 33.6134, districts: ["Merkez", "Çerkeş", "Ilgaz", "Orta", "Şabanözü", "Kurşunlu", "Yapraklı", "Kızılırmak", "Eldivan", "Atkaracalar", "Korgun", "Bayramören"] },
  { plate: 19, name: "Çorum", latitude: 40.5506, longitude: 34.9556, districts: ["Merkez", "Sungurlu", "Osmancık", "İskilip", "Alaca", "Bayat", "Kargı", "Mecitözü", "Ortaköy", "Uğurludağ", "Dodurga", "Oğuzlar", "Laçin", "Boğazkale"] },
  { plate: 20, name: "Denizli", latitude: 37.7765, longitude: 29.0864, districts: ["Merkez (Pamukkale)", "Pamukkale", "Merkezefendi", "Çivril", "Acıpayam", "Tavas", "Honaz", "Sarayköy", "Buldan", "Kale", "Çal", "Çameli", "Serinhisar", "Bozkurt", "Güney", "Çardak", "Bekilli", "Beyağaç", "Baklan"] },
  { plate: 21, name: "Diyarbakır", latitude: 37.9144, longitude: 40.2306, districts: ["Merkez (Bağlar)", "Bağlar", "Kayapınar", "Yenişehir", "Sur", "Ergani", "Bismil", "Silvan", "Çınar", "Cermik", "Dicle", "Kulp", "Hani", "Lice", "Eğil", "Hazro", "Kocaköy", "Çüngüş"] },
  { plate: 22, name: "Edirne", latitude: 41.6764, longitude: 26.5609, districts: ["Merkez", "Keşan", "Uzunköprü", "İpsala", "Havsa", "Meriç", "Enez", "Süloğlu", "Lalapaşa"] },
  { plate: 23, name: "Elazığ", latitude: 38.6810, longitude: 39.2264, districts: ["Merkez", "Kovancılar", "Karakoçan", "Palu", "Arıcak", "Baskil", "Maden", "Sivrice", "Alacakaya", "Keban", "Ağın"] },
  { plate: 24, name: "Erzincan", latitude: 39.7500, longitude: 39.5000, districts: ["Merkez", "Tercan", "Üzümlü", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Refahiye", "Otlukbeli"] },
  { plate: 25, name: "Erzurum", latitude: 39.9055, longitude: 41.2658, districts: ["Merkez (Yakutiye)", "Yakutiye", "Palandöken", "Aziziye", "Horasan", "Oltu", "Pasinler", "Karayazı", "Hınıs", "Tekman", "Karaçoban", "Aşkale", "Şenkaya", "Çat", "Köprüköy", "İspir", "Tortum", "Narman", "Uzundere", "Olur", "Pazaryolu"] },
  { plate: 26, name: "Eskişehir", latitude: 39.7767, longitude: 30.5206, districts: ["Merkez (Odunpazarı)", "Odunpazarı", "Tepebaşı", "Sivrihisar", "Çifteler", "Seyitgazi", "Alpu", "Mihalıççık", "Mahmudiye", "Beylikova", "İnönü", "Günyüzü", "Han", "Mihalgazi", "Sarıcakaya"] },
  { plate: 27, name: "Gaziantep", latitude: 37.0662, longitude: 37.3833, districts: ["Merkez (Şahinbey)", "Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Nurdağı", "Araban", "Oğuzeli", "Yavuzeli", "Karkamış"] },
  { plate: 28, name: "Giresun", latitude: 40.9128, longitude: 38.3895, districts: ["Merkez", "Bulancak", "Espiye", "Görele", "Tirebolu", "Dereli", "Şebinkarahisar", "Keşap", "Yağlıdere", "Piraziz", "Eynesil", "Alucra", "Çanakçı", "Güce", "Doğankent", "Çamoluk"] },
  { plate: 29, name: "Gümüşhane", latitude: 40.4600, longitude: 39.4814, districts: ["Merkez", "Kelkit", "Şiran", "Kürtün", "Torul", "Köse"] },
  { plate: 30, name: "Hakkari", latitude: 37.5833, longitude: 43.7333, districts: ["Merkez", "Yüksekova", "Şemdinli", "Çukurca", "Derecik"] },
  { plate: 31, name: "Hatay", latitude: 36.4018, longitude: 36.3498, districts: ["Merkez (Antakya)", "Antakya", "İskenderun", "Defne", "Dörtyol", "Samandağ", "Kırıkhan", "Reyhanlı", "Arsuz", "Altınözü", "Hassa", "Payas", "Erzin", "Yayladağı", "Belen", "Kumlu"] },
  { plate: 32, name: "Isparta", latitude: 37.7648, longitude: 30.5566, districts: ["Merkez", "Yalvaç", "Eğirdir", "Şarkikaraağaç", "Gelendost", "Keçiborlu", "Senirkent", "Sütçüler", "Gönen", "Uluborlu", "Atabey", "Aksu", "Yenişarbademli"] },
  { plate: 33, name: "Mersin", latitude: 36.8121, longitude: 34.6415, districts: ["Merkez (Yenişehir)", "Akdeniz", "Toroslar", "Yenişehir", "Mezitli", "Tarsus", "Erdemli", "Silifke", "Anamur", "Mut", "Bozyazı", "Gülnar", "Aydıncık", "Çamlıyayla"] },
  { plate: 34, name: "İstanbul", latitude: 41.0082, longitude: 28.9784, districts: ["Merkez (Fatih)", "Fatih", "Kadıköy", "Üsküdar", "Beşiktaş", "Beyoğlu", "Şişli", "Bakırköy", "Eyüpsultan", "Sarıyer", "Zeytinburnu", "Bağcılar", "Bahçelievler", "Küçükçekmece", "Büyükçekmece", "Başakşehir", "Beylikdüzü", "Esenyurt", "Esenler", "Güngören", "Bayrampaşa", "Gaziosmanpaşa", "Sultangazi", "Arnavutköy", "Çatalca", "Silivri", "Ataşehir", "Maltepe", "Kartal", "Pendik", "Tuzla", "Ümraniye", "Sancaktepe", "Sultanbeyli", "Çekmeköy", "Beykoz", "Şile", "Adalar"] },
  { plate: 35, name: "İzmir", latitude: 38.4192, longitude: 27.1287, districts: ["Merkez (Konak)", "Konak", "Karşıyaka", "Bornova", "Buca", "Karabağlar", "Bayraklı", "Çiğli", "Gaziemir", "Menemen", "Torbalı", "Kemalpaşa", "Ödemiş", "Aliağa", "Bergama", "Menderes", "Tire", "Balçova", "Narlıdere", "Urla", "Çeşme", "Seferihisar", "Dikili", "Kiraz", "Bayındır", "Selçuk", "Foça", "Güzelbahçe", "Kınık", "Beydağ", "Karaburun"] },
  { plate: 36, name: "Kars", latitude: 40.6167, longitude: 43.1000, districts: ["Merkez", "Kağızman", "Sarıkamış", "Selim", "Digor", "Arpaçay", "Akyaka", "Susuz"] },
  { plate: 37, name: "Kastamonu", latitude: 41.3887, longitude: 33.7827, districts: ["Merkez", "Tosya", "Taşköprü", "Cide", "İnebolu", "Araç", "Devrekani", "Bozkurt", "Daday", "Azdavay", "Çatalzeytin", "Küre", "Doğanyurt", "İhsangazi", "Pınarbaşı", "Şenpazar", "Abana", "Seydiler", "Hanönü", "Ağlı"] },
  { plate: 38, name: "Kayseri", latitude: 38.7312, longitude: 35.4787, districts: ["Merkez (Melikgazi)", "Melikgazi", "Kocasinan", "Talas", "Develi", "Yahyalı", "Bünyan", "Pınarbaşı", "Tomarza", "Yeşilhisar", "Sarıoğlan", "Hacılar", "Sarız", "Felahiye", "Akkışla", "İncesu", "Özvatan"] },
  { plate: 39, name: "Kırklareli", latitude: 41.7333, longitude: 27.2167, districts: ["Merkez", "Lüleburgaz", "Babaeski", "Vize", "Pınarhisar", "Demirköy", "Pehlivanköy", "Kofçaz"] },
  { plate: 40, name: "Kırşehir", latitude: 39.1425, longitude: 34.1709, districts: ["Merkez", "Kaman", "Mucur", "Çiçekdağı", "Akpınar", "Boztepe", "Akçakent"] },
  { plate: 41, name: "Kocaeli", latitude: 40.8533, longitude: 29.8815, districts: ["Merkez (İzmit)", "İzmit", "Gebze", "Darıca", "Gölcük", "Körfez", "Derince", "Çayırova", "Kartepe", "Başiskele", "Karamürsel", "Kandıra", "Dilovası"] },
  { plate: 42, name: "Konya", latitude: 37.8746, longitude: 32.4932, districts: ["Merkez (Selçuklu)", "Selçuklu", "Meram", "Karatay", "Ereğli", "Akşehir", "Beyşehir", "Cihanbeyli", "Seydişehir", "Çumra", "Kulu", "Ilgın", "Karapınar", "Kadınhanı", "Sarayönü", "Bozkır", "Yunak", "Doğanhisar", "Hüyük", "Altınekin", "Hadim", "Çeltik", "Güneysınır", "Taşkent", "Tuzlukçu", "Akören", "Derebucak", "Halkapınar", "Yalıhüyük", "Derbent", "Emirgazi"] },
  { plate: 43, name: "Kütahya", latitude: 39.4167, longitude: 29.9833, districts: ["Merkez", "Tavşanlı", "Simav", "Gediz", "Emet", "Altıntaş", "Domaniç", "Hisarcık", "Aslanapa", "Çavdarhisar", "Şaphane", "Pazarlar", "Dumlupınar"] },
  { plate: 44, name: "Malatya", latitude: 38.3552, longitude: 38.3095, districts: ["Merkez (Battalgazi)", "Battalgazi", "Yeşilyurt", "Doğanşehir", "Akçadağ", "Darende", "Hekimhan", "Pütürge", "Yazıhan", "Arapgir", "Kuluncak", "Arguvan", "Kale", "Doğanyol"] },
  { plate: 45, name: "Manisa", latitude: 38.6191, longitude: 27.4289, districts: ["Merkez (Yunusemre)", "Yunusemre", "Şehzadeler", "Akhisar", "Turgutlu", "Salihli", "Soma", "Alaşehir", "Saruhanlı", "Kula", "Demirci", "Kırkağaç", "Sarıgöl", "Gördes", "Selendi", "Ahmetli", "Gölmarmara", "Köprübaşı"] },
  { plate: 46, name: "Kahramanmaraş", latitude: 37.5858, longitude: 36.9371, districts: ["Merkez (Onikişubat)", "Onikişubat", "Dulkadiroğlu", "Elbistan", "Afşin", "Türkoğlu", "Pazarcık", "Göksun", "Andırın", "Çağlayancerit", "Nurhak", "Ekinözü"] },
  { plate: 47, name: "Mardin", latitude: 37.3212, longitude: 40.7245, districts: ["Merkez (Artuklu)", "Artuklu", "Kızıltepe", "Midyat", "Nusaybin", "Derik", "Mazıdağı", "Dargeçit", "Savur", "Yeşilli", "Ömerli"] },
  { plate: 48, name: "Muğla", latitude: 37.2153, longitude: 28.3636, districts: ["Merkez (Menteşe)", "Menteşe", "Bodrum", "Fethiye", "Milas", "Marmaris", "Seydikemer", "Ortaca", "Yatağan", "Dalaman", "Köyceğiz", "Ula", "Datça", "Kavaklıdere"] },
  { plate: 49, name: "Muş", latitude: 38.7432, longitude: 41.5064, districts: ["Merkez", "Bulanık", "Malazgirt", "Varto", "Hasköy", "Korkut"] },
  { plate: 50, name: "Nevşehir", latitude: 38.6244, longitude: 34.7144, districts: ["Merkez", "Ürgüp", "Avanos", "Gülşehir", "Derinkuyu", "Kozaklı", "Acıgöl", "Hacıbektaş"] },
  { plate: 51, name: "Niğde", latitude: 37.9667, longitude: 34.6833, districts: ["Merkez", "Bor", "Çiftlik", "Ulukışla", "Altunhisar", "Çamardı"] },
  { plate: 52, name: "Ordu", latitude: 40.9839, longitude: 37.8764, districts: ["Merkez (Altınordu)", "Altınordu", "Ünye", "Fatsa", "Kumru", "Korgan", "Gölköy", "Perşembe", "Aybastı", "Ulubey", "Mesudiye", "İkizce", "Gürgentepe", "Çatalpınar", "Çaybaşı", "Kabadüz", "Kabataş", "Çamaş", "Gülyalı"] },
  { plate: 53, name: "Rize", latitude: 41.0201, longitude: 40.5234, districts: ["Merkez", "Çayeli", "Ardeşen", "Pazar", "Fındıklı", "Güneysu", "Kalkandere", "İyidere", "Derepazarı", "Çamlıhemşin", "İkizdere", "Hemşin"] },
  { plate: 54, name: "Sakarya", latitude: 40.7569, longitude: 30.3783, districts: ["Merkez (Adapazarı)", "Adapazarı", "Serdivan", "Akyazı", "Erenler", "Hendek", "Karasu", "Geyve", "Arifiye", "Sapanca", "Pamukova", "Ferizli", "Kaynarca", "Kocaali", "Söğütlü", "Karapürçek", "Taraklı"] },
  { plate: 55, name: "Samsun", latitude: 41.2867, longitude: 36.3300, districts: ["Merkez (İlkadım)", "İlkadım", "Atakum", "Canik", "Bafra", "Çarşamba", "Vezirköprü", "Terme", "Tekkeköy", "Havza", "Alaçam", "19 Mayıs", "Kavak", "Salıpazarı", "Asarcık", "Ladik", "Yakakent", "Ayvacık"] },
  { plate: 56, name: "Siirt", latitude: 37.9333, longitude: 41.9500, districts: ["Merkez", "Kurtalan", "Pervari", "Baykan", "Şirvan", "Eruh", "Tillo"] },
  { plate: 57, name: "Sinop", latitude: 42.0231, longitude: 35.1531, districts: ["Merkez", "Boyabat", "Gerze", "Ayancık", "Durağan", "Türkeli", "Erfelek", "Dikmen", "Saraydüzü"] },
  { plate: 58, name: "Sivas", latitude: 39.7477, longitude: 37.0179, districts: ["Merkez", "Şarkışla", "Yıldızeli", "Suşehri", "Zara", "Gemerek", "Kangal", "Gürün", "Divriği", "Koyulhisar", "Hafik", "Ulaş", "Altınyayla", "İmranlı", "Akıncılar", "Gölova", "Doğanşar"] },
  { plate: 59, name: "Tekirdağ", latitude: 40.9833, longitude: 27.5167, districts: ["Merkez (Süleymanpaşa)", "Süleymanpaşa", "Çorlu", "Çerkezköy", "Kapaklı", "Ergene", "Malkara", "Saray", "Hayrabolu", "Şarköy", "Muratlı", "Marmaraereğlisi"] },
  { plate: 60, name: "Tokat", latitude: 40.3167, longitude: 36.5500, districts: ["Merkez", "Erbaa", "Turhal", "Niksar", "Zile", "Reşadiye", "Almus", "Pazar", "Yeşilyurt", "Artova", "Sulusaray", "Başçiftlik"] },
  { plate: 61, name: "Trabzon", latitude: 41.0027, longitude: 39.7168, districts: ["Merkez (Ortahisar)", "Ortahisar", "Akçaabat", "Araklı", "Of", "Yomra", "Arsin", "Vakfıkebir", "Sürmene", "Maçka", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Tonya", "Düzköy", "Şalpazarı", "Hayrat", "Köprübaşı", "Dernekpazarı"] },
  { plate: 62, name: "Tunceli", latitude: 39.1079, longitude: 39.5401, districts: ["Merkez", "Pertek", "Mazgirt", "Çemişgezek", "Hozat", "Ovacık", "Pülümür", "Nazımiye"] },
  { plate: 63, name: "Şanlıurfa", latitude: 37.1674, longitude: 38.7955, districts: ["Merkez (Haliliye)", "Eyyübiye", "Haliliye", "Siverek", "Viranşehir", "Karaköprü", "Akçakale", "Suruç", "Birecik", "Ceylanpınar", "Harran", "Bozova", "Hilvan", "Halfeti"] },
  { plate: 64, name: "Uşak", latitude: 38.6823, longitude: 29.4082, districts: ["Merkez", "Banaz", "Eşme", "Sivaslı", "Ulubey", "Karahallı"] },
  { plate: 65, name: "Van", latitude: 38.4891, longitude: 43.4089, districts: ["Merkez (İpekyolu)", "İpekyolu", "Tuşba", "Edremit", "Erciş", "Özalp", "Çaldıran", "Başkale", "Muradiye", "Gürpınar", "Gevaş", "Saray", "Çatak", "Bahçesaray"] },
  { plate: 66, name: "Yozgat", latitude: 39.8181, longitude: 34.8147, districts: ["Merkez", "Sorgun", "Akdağmadeni", "Yerköy", "Boğazlıyan", "Sarıkaya", "Çekerek", "Şefaatli", "Saraykent", "Çayıralan", "Kadışehri", "Aydıncık", "Yenifakılı", "Çandır"] },
  { plate: 67, name: "Zonguldak", latitude: 41.4564, longitude: 31.7987, districts: ["Merkez", "Karadeniz Ereğli", "Çaycuma", "Devrek", "Kozlu", "Alaplı", "Kilimli", "Gökçebey"] },
  { plate: 68, name: "Aksaray", latitude: 38.3687, longitude: 34.0370, districts: ["Merkez", "Ortaköy", "Eskil", "Gülağaç", "Güzelyurt", "Ağaçören", "Sarıyahşi", "Sultanhanı"] },
  { plate: 69, name: "Bayburt", latitude: 40.2552, longitude: 40.2249, districts: ["Merkez", "Demirözü", "Aydıntepe"] },
  { plate: 70, name: "Karaman", latitude: 37.1759, longitude: 33.2287, districts: ["Merkez", "Ermenek", "Sarıveliler", "Ayrancı", "Kazımkarabekir", "Başyayla"] },
  { plate: 71, name: "Kırıkkale", latitude: 39.8468, longitude: 33.5153, districts: ["Merkez", "Yahşihan", "Keskin", "Delice", "Bahşılı", "Sulakyurt", "Balışeyh", "Karakeçili", "Çelebi"] },
  { plate: 72, name: "Batman", latitude: 37.8812, longitude: 41.1293, districts: ["Merkez", "Kozluk", "Sason", "Beşiri", "Gercüş", "Hasankeyf"] },
  { plate: 73, name: "Şırnak", latitude: 37.5164, longitude: 42.4611, districts: ["Merkez", "Cizre", "Silopi", "İdil", "Uludere", "Beytüşşebap", "Güçlükonak"] },
  { plate: 74, name: "Bartın", latitude: 41.6344, longitude: 32.3375, districts: ["Merkez", "Amasra", "Ulus", "Kurucaşile"] },
  { plate: 75, name: "Ardahan", latitude: 41.1105, longitude: 42.7022, districts: ["Merkez", "Göle", "Çıldır", "Hanak", "Posof", "Damal"] },
  { plate: 76, name: "Iğdır", latitude: 39.9196, longitude: 44.0450, districts: ["Merkez", "Tuzluca", "Aralık", "Karakoyunlu"] },
  { plate: 77, name: "Yalova", latitude: 40.6550, longitude: 29.2769, districts: ["Merkez", "Çiftlikköy", "Çınarcık", "Altınova", "Armutlu", "Termal"] },
  { plate: 78, name: "Karabük", latitude: 41.2061, longitude: 32.6204, districts: ["Merkez", "Safranbolu", "Yenice", "Eskipazar", "Eflani", "Ovacık"] },
  { plate: 79, name: "Kilis", latitude: 36.7184, longitude: 37.1212, districts: ["Merkez", "Musabeyli", "Elbeyli", "Polateli"] },
  { plate: 80, name: "Osmaniye", latitude: 37.0742, longitude: 36.2472, districts: ["Merkez", "Kadirli", "Düziçi", "Bahçe", "Toprakkale", "Sumbas", "Hasanbeyli"] },
  { plate: 81, name: "Düzce", latitude: 40.8438, longitude: 31.1565, districts: ["Merkez", "Akçakoca", "Kaynaşlı", "Gölyaka", "Çilimli", "Yığılca", "Gümüşova", "Cumayeri"] }
];

export interface WorldCityItem {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export const WORLD_ISLAMIC_CITIES: WorldCityItem[] = [
  { name: "Mekke-i Mükerreme", country: "Suudi Arabistan", latitude: 21.4225, longitude: 39.8262, timezone: 3 },
  { name: "Medine-i Münevvere", country: "Suudi Arabistan", latitude: 24.5247, longitude: 39.5692, timezone: 3 },
  { name: "Kudüs (Mescid-i Aksâ)", country: "Filistin", latitude: 31.7683, longitude: 35.2137, timezone: 3 },
  { name: "Bakü", country: "Azerbaycan", latitude: 40.4093, longitude: 49.8671, timezone: 4 },
  { name: "Saraybosna", country: "Bosna Hersek", latitude: 43.8563, longitude: 18.4131, timezone: 1 },
  { name: "Kahire", country: "Mısır", latitude: 30.0444, longitude: 31.2357, timezone: 2 },
  { name: "Üsküp", country: "Kuzey Makedonya", latitude: 41.9981, longitude: 21.4254, timezone: 1 },
  { name: "Tiran", country: "Arnavutluk", latitude: 41.3275, longitude: 19.8187, timezone: 1 },
  { name: "Berlin", country: "Almanya", latitude: 52.5200, longitude: 13.4050, timezone: 1 },
  { name: "Köln", country: "Almanya", latitude: 50.9375, longitude: 6.9603, timezone: 1 },
  { name: "Frankfurt", country: "Almanya", latitude: 50.1109, longitude: 8.6821, timezone: 1 },
  { name: "Münih", country: "Almanya", latitude: 48.1351, longitude: 11.5820, timezone: 1 },
  { name: "Londra", country: "İngiltere", latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { name: "Paris", country: "Fransa", latitude: 48.8566, longitude: 2.3522, timezone: 1 },
  { name: "Viyana", country: "Avusturya", latitude: 48.2082, longitude: 16.3738, timezone: 1 },
  { name: "Amsterdam", country: "Hollanda", latitude: 52.3676, longitude: 4.9041, timezone: 1 },
  { name: "Brüksel", country: "Belçika", latitude: 50.8503, longitude: 4.3517, timezone: 1 },
  { name: "Zürih", country: "İsviçre", latitude: 47.3769, longitude: 8.5417, timezone: 1 },
  { name: "Kopenhag", country: "Danimarka", latitude: 55.6761, longitude: 12.5683, timezone: 1 },
  { name: "Stockholm", country: "İsveç", latitude: 59.3293, longitude: 18.0686, timezone: 1 },
  { name: "Oslo", country: "Norveç", latitude: 59.9139, longitude: 10.7522, timezone: 1 },
  { name: "Lefkoşa", country: "KKTC", latitude: 35.1856, longitude: 33.3823, timezone: 3 },
  { name: "Taşkent", country: "Özbekistan", latitude: 41.2995, longitude: 69.2401, timezone: 5 },
  { name: "Semerkant", country: "Özbekistan", latitude: 39.6542, longitude: 66.9597, timezone: 5 },
  { name: "Buhara", country: "Özbekistan", latitude: 39.7747, longitude: 64.4286, timezone: 5 },
  { name: "Almatı", country: "Kazakistan", latitude: 43.2220, longitude: 76.8512, timezone: 5 },
  { name: "Bişkek", country: "Kırgızistan", latitude: 42.8746, longitude: 74.5698, timezone: 6 },
  { name: "Aşkabat", country: "Türkmenistan", latitude: 37.9601, longitude: 58.3261, timezone: 5 },
  { name: "New York", country: "ABD", latitude: 40.7128, longitude: -74.0060, timezone: -5 },
  { name: "Toronto", country: "Kanada", latitude: 43.6532, longitude: -79.3832, timezone: -5 },
  { name: "Sidney", country: "Avustralya", latitude: -33.8688, longitude: 151.2093, timezone: 10 }
];
