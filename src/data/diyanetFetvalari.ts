export interface FetvaItem {
  id: string;
  question: string;
  category: 'namaz' | 'oruc' | 'zekat' | 'kurban' | 'saglik' | 'aile' | 'gunluk';
  categoryLabel: string;
  verdict: 'caiz' | 'caiz_degil' | 'mekruh' | 'bozmaz' | 'bozar' | 'bilgi';
  verdictBadge: string;
  summary: string;
  answer: string;
  source: string;
  keywords: string[];
  kurulUrl: string;
}

export const FETVA_CATEGORIES = [
  { id: 'all', label: 'Tüm Konular', icon: 'Sparkles' },
  { id: 'namaz', label: 'Namaz & Abdest', icon: 'Clock' },
  { id: 'oruc', label: 'Oruç & Ramazan', icon: 'Moon' },
  { id: 'zekat', label: 'Zekât & Sadaka', icon: 'Coins' },
  { id: 'kurban', label: 'Kurban & Hac', icon: 'Award' },
  { id: 'saglik', label: 'Tıp, Sağlık & Tedavi', icon: 'HeartPulse' },
  { id: 'gunluk', label: 'Günlük Hayat & Finans', icon: 'HelpCircle' }
] as const;

export const DIYANET_FETVALARI: FetvaItem[] = [
  // 1. ORUÇ & RAMAZAN
  {
    id: 'fetva-oruc-1',
    question: 'Aşı olmak veya iğne yaptırmak orucu bozar mı?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bozmaz',
    verdictBadge: 'Orucu Bozmaz (Tedavi Amaçlı)',
    summary: 'Tedavi amaçlı ve besin değeri taşımayan aşı ve iğneler orucu bozmaz.',
    answer: 'Din İşleri Yüksek Kurulu kararına göre; oruç, bir şey yemek, içmek ve cinsi münasebette bulunmaktan dolayı bozulur. Vücuda besin veya gıda maddesi veren, serum ve vitamin gibi besleyici nitelikte olan enjeksiyonlar orucu bozar. Ancak gıda ve keyif verici olmayan, tedavi amacıyla yapılan kas içi (intramusküler) veya cilt altı iğneler ile aşılar (grip, tetanos vb.) orucu bozmaz. Tedavisi devam eden hastaların sağlıklarını tehlikeye atmamaları esastır.',
    source: 'Din İşleri Yüksek Kurulu Fetva Arşivi (Karar No: 2005/56)',
    keywords: ['aşı', 'iğne', 'enjeksiyon', 'ilaç', 'tedavi', 'korona', 'grip', 'orucu bozan şeyler', 'oruc'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-oruc-2',
    question: 'Astım spreyi kullanmak orucu bozar mı?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bozmaz',
    verdictBadge: 'Orucu Bozmaz',
    summary: 'Nefes darlığı çeken astım hastalarının ağza sıktıkları sprey orucu bozmaz.',
    answer: 'Nefes açıcı spreyi kullanan astım hastaları bir püskürtmede çok az bir miktarı (1/20 ml) nefes borusuna çekmektedirler. Bunun da büyük bir kısmı ağız ve boğaz çeperinde tutulmakta, mideye neredeyse hiçbir şey ulaşmamaktadır. Bu sebeple astım hastalarının kullandığı solunum spreyleri orucu bozmaz. Zira bu bir yeme-içme değil, hayati bir hava tedavisi niteliğindedir.',
    source: 'Din İşleri Yüksek Kurulu Kararları (Astım Hastalarının Orucu)',
    keywords: ['astım', 'sprey', 'hava', 'nefes', 'fısfıs', 'akciğer', 'oruc'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-oruc-3',
    question: 'Diş fırçalamak veya misvak kullanmak orucu bozar mı?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bozmaz',
    verdictBadge: 'Yutulmadıkça Bozmaz',
    summary: 'Boğaza su veya macun kaçırılmadığı müddetçe orucu bozmaz.',
    answer: 'Diş fırçalamak orucu bozmaz. Ancak diş macununun veya gargara suyunun boğaza kaçması halinde oruç bozulur ve kaza edilmesi gerekir. Orucun bozulma tehlikesine karşılık, dişlerin sahurdan önce ve iftardan sonra fırçalanması, oruçluyken ise macunsuz veya dikkatli fırçalanması tavsiye edilir.',
    source: 'Diyanet İlmihali, Oruç Bölümü',
    keywords: ['diş', 'fırça', 'macun', 'misvak', 'ağız', 'çalkalama', 'tükürük'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-oruc-4',
    question: 'Göz veya kulak damlası damlatmak orucu bozar mı?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bozmaz',
    verdictBadge: 'Orucu Bozmaz',
    summary: 'Göze ve kulağa damlatılan tıbbi damlalar orucu bozmaz.',
    answer: 'Gözün yapısı gereği damlatılan damlanın çok az bir kısmı göz pınarlarından genze ulaşsa bile bu miktar yok denecek kadar azdır ve besin niteliği taşımaz. Kulak zarı delik olmayan kimselerde kulak damlası orta kulağa veya boğaza geçmez. Zar delik olsa dahi mideye besleyici bir sıvı ulaşmadığı için göz ve kulak damlaları orucu bozmaz.',
    source: 'Din İşleri Yüksek Kurulu Tıbbi Fetvalar Külliyatı',
    keywords: ['göz', 'damla', 'kulak', 'burun', 'damlatmak', 'ilaç'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-oruc-5',
    question: 'Unutarak bir şey yiyip içen kimsenin orucu bozulur mu?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bozmaz',
    verdictBadge: 'Orucu Bozmaz',
    summary: 'Unutarak yiyip içmek orucu bozmaz; hatırlanınca derhal bırakılıp ağız çalkalanmalıdır.',
    answer: 'Peygamber Efendimiz (s.a.v.) şöyle buyurmuştur: "Kim oruçlu olduğunu unutarak yer veya içerse orucunu tamamlasın. Çünkü onu Allah yedirmiş ve içirmiştir." (Buhârî, Savm, 26). Kişi oruçlu olduğunu hatırladığı anda ağzındakini yutmadan çıkarıp çalkalamalı ve orucuna devam etmelidir. Hatırladıktan sonra yutmaya devam ederse orucu bozulur ve kaza gerekir.',
    source: 'Buhârî ve Müslim Müttefekun Aleyh Hadisleri, Diyanet Fetvası',
    keywords: ['unutarak', 'yemek', 'içmek', 'su içmek', 'unutmak', 'bozulur mu'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-oruc-6',
    question: 'Oruç fidyesi nedir, kimler ödeyebilir ve miktarı ne kadardır?',
    category: 'oruc',
    categoryLabel: 'Oruç & Ramazan',
    verdict: 'bilgi',
    verdictBadge: 'Dini Mükellefiyet',
    summary: 'İyileşme ümidi olmayan kronik hastalar ve oruç tutamayacak kadar yaşlılar fidye verir.',
    answer: 'İhtiyarlık sebebiyle oruç tutmaya gücü yetmeyen ya da iyileşme ümidi kalmamış kronik rahatsızlığı bulunan kimseler, tutamadıkları her bir gün için bir fidye öderler. Bir fidye tutarı, bir kişiyi bir gün doyuracak yiyecek miktarıdır ve asgari olarak o yılki Sadaka-i Fıtır (fitre) tutarına eşittir. Daha sonra iyileşen hasta fidye vermiş olsa dahi tutamadığı oruçları kaza etmelidir.',
    source: 'Din İşleri Yüksek Kurulu Yıllık Fitre ve Fidye Tebliği',
    keywords: ['fidye', 'hasta', 'yaşlı', 'fitre', 'oruç tutamayan', 'kronik', 'kaza'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },

  // 2. NAMAZ & ABDEST
  {
    id: 'fetva-namaz-1',
    question: 'Kaza namazı borcu olan kişi sünnet ve nafile namazları kılabilir mi?',
    category: 'namaz',
    categoryLabel: 'Namaz & Abdest',
    verdict: 'caiz',
    verdictBadge: 'Kılabilir (Tavsiye Edilir)',
    summary: 'Kaza borcu olanların vakit sünnetlerini kılmaları Hanefi mezhebinde meşrudur.',
    answer: 'Hanefî mezhebinde tercih edilen görüşe göre; üzerinde kaza namazı borcu bulunan bir kimsenin, vakit namazlarıyla birlikte kılınan müekked ve gayrimüekked sünnetleri (sabah, öğle, ikindi, yatsı sünnetleri) terk etmeyip kılması gerekir. Çünkü bu sünnetlerin terk edilmesi Peygamberimizin şefaatinden mahrum kalma tehlikesi doğurur. Ancak müstakil nafileler yerine kaza namazı kılmak daha evladır.',
    source: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu, Fetva No: 114',
    keywords: ['kaza', 'sünnet', 'nafile', 'kaza namazı', 'borç', 'terk etmek'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-namaz-2',
    question: 'Sehiv secdesi hangi durumlarda gerekir ve nasıl yapılır?',
    category: 'namaz',
    categoryLabel: 'Namaz & Abdest',
    verdict: 'bilgi',
    verdictBadge: 'Vaciptir',
    summary: 'Namazın vaciplerinden birinin unutularak geciktirilmesi veya terk edilmesi halinde yapılır.',
    answer: 'Namazda farzlardan birinin geciktirilmesi yahut vaciplerden birinin unutularak terk edilmesi veya geciktirilmesi durumunda sehiv secdesi vaciptir. Yapılışı: Son oturuşta yalnız Ettahiyyâtü okunduktan sonra sağ tarafa selam verilir. Ardından "Allahu Ekber" diyerek iki defa secdeye varılır; secdelerde üçer kez "Sübhâne Rabbiye\'l-a\'lâ" denir. Tekrar oturulur, Ettahiyyâtü, Allâhümme Salli, Bârik ve Rabbenâ duaları okunarak her iki tarafa selam verilip namaz tamamlanır.',
    source: 'Büyük İslam İlmihali, Ömer Nasuhi Bilmen / Diyanet İlmihali',
    keywords: ['sehiv', 'yanılma', 'secde', 'unutma', 'vacip', 'gecikme', 'namaz'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-namaz-3',
    question: 'Mest üzerine mesh etmenin süresi ve şartları nelerdir?',
    category: 'namaz',
    categoryLabel: 'Namaz & Abdest',
    verdict: 'caiz',
    verdictBadge: 'Sünnettir',
    summary: 'Mukim için 24 saat, seferi (yolcu) için 72 saat boyunca abdestte mestler meshedilebilir.',
    answer: 'Mestlerin abdestli olarak giyilmiş olması, topukları örtmesi, su geçirmeyecek ve 5 kilometre yürünebilecek sağlamlıkta olması şarttır. Mesh süresi mestin giyildiği andan değil, giyildikten sonra abdestin bozulduğu andan itibaren başlar. Mukim olan kişi 24 saat (1 gün-gece), seferde olan kişi ise 72 saat (3 gün-gece) mest üzerine mesh edebilir. Islak el ayasıyla ayak parmaklarından yukarı doğru meshedilir.',
    source: 'Din İşleri Yüksek Kurulu, Abdest ve Temizlik Fıkhı',
    keywords: ['mest', 'mesh', 'çorap', 'abdest', 'sefer', 'yolculuk', 'ayak yıkama'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-namaz-4',
    question: 'Seferi (yolcu) olma şartları nelerdir ve namazlar nasıl kısaltılır?',
    category: 'namaz',
    categoryLabel: 'Namaz & Abdest',
    verdict: 'caiz',
    verdictBadge: 'Ruhsat & Emir',
    summary: 'En az 90 km mesafeye 15 günden az kalmak üzere giden kişi 4 rekatlık farzları 2 rekat kılar.',
    answer: 'Kişi ikamet ettiği yerleşim yerinin sınırlarını terk ederek en az 90 km (18 saatlik yaya yürüyüşü veya günümüz ölçüsüyle asgari sefer mesafesi) uzaklığa yolculuk yaptığında ve varacağı yerde 15 günden az kalmaya niyet ettiğinde seferi sayılır. Seferde 4 rekatlı farz namazlar (Öğle, İkindi, Yatsı) ikişer rekat (kasr) olarak kılınır. Akşam ve sabah namazları ile vitir namazı aynen kılınır kısaltılmaz.',
    source: 'Diyanet Din İşleri Yüksek Kurulu, Seferilik Hükümleri',
    keywords: ['seferi', 'yolcu', 'yolculuk', 'namaz kısaltma', 'kasr', '90 km', 'cem'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-namaz-5',
    question: 'Özür sahibi kimsenin abdesti nasıl olur ve ne zaman bozulur?',
    category: 'namaz',
    categoryLabel: 'Namaz & Abdest',
    verdict: 'bilgi',
    verdictBadge: 'Fıkhi Ruhsat',
    summary: 'Özür sahibi her vakit namazı için ayrı bir abdest alır; o vakit çıkınca abdesti bozulur.',
    answer: 'Bir kimsenin özür sahibi sayılabilmesi için abdesti bozan bir halin (idrar tutamama, sürekli burun kanaması, akıntı vb.) tam bir namaz vakti boyunca devam etmesi ve abdest alıp namaz kılacak kadar durmaması gerekir. Özürlü kimse her farz namazın vakti girdiğinde yeni bir abdest alır. O namaz vakti içinde dilediği kadar farz, kaza ve nafile kılabilir. O vakit çıktığında özür abdesti kendiliğinden sona erer.',
    source: 'Diyanet İşleri Başkanlığı İlmihali, Cilt 1',
    keywords: ['özür', 'akıntı', 'kanama', 'idrar', 'hastalık', 'abdest bozulması'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },

  // 3. ZEKÂT, SADAKA & TİCARET
  {
    id: 'fetva-zekat-1',
    question: 'Zekât kimlere verilir, kimlere verilmez?',
    category: 'zekat',
    categoryLabel: 'Zekât & Sadaka',
    verdict: 'bilgi',
    verdictBadge: 'Şer\'i Hüküm',
    summary: 'Fakir ve miskinlere verilir; usul (anne, baba, dede), füru (çocuk, torun) ve eşe verilemez.',
    answer: 'Kur\'an-ı Kerim\'de zekâtın verileceği kimseler Tevbe Suresi 60. âyette açıkça sayılmıştır: Fakirler, düşkünler (miskinler), zekât toplayan memurlar, kalpleri İslâm\'a ısındırılacak olanlar, kölelikten kurtulmak isteyenler, borçlular, Allah yolunda olanlar ve yolda kalmış muhtaç yolcular. Zekât; anne, baba, dede ve ninelere (usûl), çocuklara ve torunlara (fürû\') ile zevceye (eşe) verilemez. Çünkü kişi bu kimselere zaten bakmakla yükümlüdür. Kardeş, amca, dayı, teyze, hala fakir iseler onlara zekât verilmesi hem vacip hem de sıla-i rahim sevabıdır.',
    source: 'T.C. Diyanet Din İşleri Yüksek Kurulu, Zekat Rehberi',
    keywords: ['zekat', 'kimlere verilir', 'anne', 'baba', 'kardeş', 'akraba', 'fakir', 'fitre'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-zekat-2',
    question: 'Zekât nisap miktarı nedir ve altın için kaç gramdır?',
    category: 'zekat',
    categoryLabel: 'Zekât & Sadaka',
    verdict: 'bilgi',
    verdictBadge: '80.18 Gram Altın',
    summary: 'Temel ihtiyaçlar ve borçlar dışında 80.18 gram altın veya nakit değerine sahip olmak gerekir.',
    answer: 'Diyanet Din İşleri Yüksek Kurulu kararına göre zekâtın nisap miktarı 80.18 gram altındır. Kişinin ev, araba ve zaruri yaşam masrafları düşüldükten sonra elinde bulunan altın, döviz, nakit para ve ticaret mallarının toplam değeri 80.18 gram altının değerine ulaşıyorsa ve üzerinden 1 kameri yıl (354 gün) geçmişse, bu mal varlığının kırkta biri (%2.5) zekât olarak verilir.',
    source: 'Din İşleri Yüksek Kurulu Nisap Kararı',
    keywords: ['nisap', 'altın', '80 gram', 'gram altın', 'yüzde iki buçuk', 'kırkta bir', 'zekat hesabı'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-zekat-3',
    question: 'Kripto paraların ve dijital varlıkların alım satımı caiz midir?',
    category: 'zekat',
    categoryLabel: 'Zekât & Finans',
    verdict: 'caiz_degil',
    verdictBadge: 'Caiz Görülmemektedir',
    summary: 'Merkezi bir güvenceye dayanmaması, spekülasyon ve aldatma riski taşıması sebebiyle caiz görülmez.',
    answer: 'Din İşleri Yüksek Kurulu; para veya mal niteliğindeki varlıkların meşru olabilmesi için devlet garantisi, manipülasyondan uzak şeffaflık ve haksız kazanca yol açmama şartları arandığını belirtir. Kripto paraların arkasında merkezi bir otorite veya reel iktisadi karşılık bulunmaması, kara para aklama ve spekülatif dalgalanmalara açık olması ve taraflar arasında mağduriyet doğurması gerekçeleriyle alım-satımı şu anki yapısıyla caiz görülmemiştir.',
    source: 'Din İşleri Yüksek Kurulu Kripto Varlıklar Mütalaası',
    keywords: ['kripto', 'bitcoin', 'btc', 'dijital para', 'coin', 'borsa', 'faiz', 'caiz mi'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-zekat-4',
    question: 'Banka promosyonu ve mevduat neması dinen nasıl değerlendirilmelidir?',
    category: 'zekat',
    categoryLabel: 'Zekât & Finans',
    verdict: 'bilgi',
    verdictBadge: 'Fakirlere Dağıtılır',
    summary: 'Promosyon paraları şahsi harcamalarda kullanılmamalı, sevap beklenmeksizin ihtiyaç sahiplerine verilmelidir.',
    answer: 'Kamu veya özel sektör çalışanlarına maaş anlaşması karşılığında bankaların ödediği promosyonlar faiz şüphesinden uzak değildir. Din İşleri Yüksek Kurulu fetvasına göre banka promosyon paralarının kişinin kendi temel ihtiyaçları veya zenginleşmesi için harcanması caiz olmayıp, sevap beklenmeksizin fakirlere, yoksullara veya kamu yararına olan hayır kurumlarına verilmesi gerekir.',
    source: 'Din İşleri Yüksek Kurulu Promosyon Fetvası',
    keywords: ['promosyon', 'banka', 'maaş promosyonu', 'faiz', 'sadaka', 'nema'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },

  // 4. SAĞLIK, TIP & TEDAVİ
  {
    id: 'fetva-saglik-1',
    question: 'Organ bağışı ve doku nakli dinen caiz midir?',
    category: 'saglik',
    categoryLabel: 'Tıp, Sağlık & Tedavi',
    verdict: 'caiz',
    verdictBadge: 'Caizdir (Büyük Sevaptır)',
    summary: 'Belirli tıbbi ve ahlaki şartlara riayet edilerek organ bağışı yapmak dinen caizdir.',
    answer: 'Din İşleri Yüksek Kurulu\'nun 1980 tarihli ve 396 sayılı tarihi kararına göre; zaruret halinin bulunması, tıbben vefatın (beyin ölümünün) kesinleşmiş olması, organın maddi bir bedel (ücret) karşılığında verilmemesi ve kişinin sağlığında rızasının olması şartıyla organ nakli caizdir. Bir canı kurtarmak Kur\'an\'da bütün insanlığı diriltmek gibi (Mâide, 32) büyük bir fazilet olarak övülmüştür.',
    source: 'Din İşleri Yüksek Kurulu Kararı, No: 396',
    keywords: ['organ bağışı', 'organ nakli', 'böbrek', 'kalp', 'kan bağışı', 'tıp', 'caiz mi'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-saglik-2',
    question: 'Dövme yaptırmak ve estetik ameliyat olmak caiz midir?',
    category: 'saglik',
    categoryLabel: 'Tıp, Sağlık & Tedavi',
    verdict: 'caiz_degil',
    verdictBadge: 'Keyfi Olanlar Caiz Değil',
    summary: 'Tıbbi bir zaruret veya kusur giderme olmadıkça fıtratı değiştirici keyfi estetik ve dövme caiz değildir.',
    answer: 'İslam dini yaratılıştan gelen tabii güzelliğin (fıtratın) keyfi gerekçelerle tahrip edilmesini veya değiştirilmesini nehyetmiştir. Peygamber Efendimiz (s.a.v.) dövme yapan ve yaptıranları ikaz etmiştir. Ancak yangın, kaza, uzuv kaybı veya belirgin şekil bozukluğunun düzeltilmesi gibi tedavi ve ruhsal sağlığı koruma amaçlı tıbbi müdahaleler caizdir. Dövmesi olan kimsenin gusül ve abdesti geçerlidir; derinin altına işlenen boya suyun deriye ulaşmasına engel teşkil etmez.',
    source: 'Diyanet Din İşleri Yüksek Kurulu, Estetik ve Dövme Kararları',
    keywords: ['dövme', 'estetik', 'ameliyat', 'burun estetiği', 'abdest geçirir mi', 'gusül'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },

  // 5. KURBAN & HAC
  {
    id: 'fetva-kurban-1',
    question: 'Kredi kartıyla taksitle kurban satın almak caiz midir?',
    category: 'kurban',
    categoryLabel: 'Kurban & Hac',
    verdict: 'caiz',
    verdictBadge: 'Faizsiz Olmak Şartıyla Caiz',
    summary: 'Gecikme faizi ödememek ve vade farkı faizine bulaşmamak şartıyla caizdir.',
    answer: 'Kişinin kredi kartı veya taksitle kurbanlık hayvan satın alması caizdir. Burada önemli olan husus, kredi kartı borcunun gününde ödenerek faize girilmemesidir. Eğer gecikme faizi doğacaksa veya bankadan faizli kurban kredisi çekilecekse bu işlem dinen haram kılınan faize vesile olacağından caiz olmaz.',
    source: 'Din İşleri Yüksek Kurulu Kurban Fetvaları Rehberi',
    keywords: ['kurban', 'kredi kartı', 'taksit', 'faiz', 'kurbanlık', 'borçla kurban'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-kurban-2',
    question: 'Kurban etinin gayrimüslim komşuya verilmesi caiz midir?',
    category: 'kurban',
    categoryLabel: 'Kurban & Hac',
    verdict: 'caiz',
    verdictBadge: 'Caizdir (Tavsiye Edilir)',
    summary: 'Kurban eti gayrimüslim komşu ve tanıdıklara hediye olarak verilebilir.',
    answer: 'Kurban, Allah rızası için ibadet maksadıyla kesilir. Kesilen kurbanın eti üçe taksim edilir; bir bölümü ev halkına, bir bölümü eş-dost ve akrabaya, bir bölümü ise fakir ve muhtaçlara dağıtılır. Müslüman olmayan ihtiyaç sahibi veya komşu kimselere kurban etinden ikram edilmesi ve hediye verilmesi İslam ahlakının gereğidir ve caizdir.',
    source: 'Diyanet İlmihali, Kurban Hükümleri',
    keywords: ['kurban eti', 'dağıtımı', 'gayrimüslim', 'komşu', 'üçe bölmek', 'hediye'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },

  // 6. GÜNLÜK HAYAT & İTİKAD
  {
    id: 'fetva-gunluk-1',
    question: 'Nazar haktır ve nazardan korunmak için hangi dualar okunmalıdır?',
    category: 'gunluk',
    categoryLabel: 'Günlük Hayat & Dua',
    verdict: 'bilgi',
    verdictBadge: 'Sünnete Uygun Dua',
    summary: 'Nazar boncuğu vb. batıl eşyalara medet umulmaz; Felak, Nas ve Kalem Suresi 51-52 okunur.',
    answer: 'Peygamber Efendimiz (s.a.v.) "Nazar haktır" buyurmuştur (Müslim, Selam, 42). Ancak nazardan korunmak maksadıyla nazar boncuğu, at nalı veya muska takarak bu nesnelerin bizzat koruduğuna inanmak bid\'at ve batıl inançtır. Sünnete uygun olan; Felak ve Nas sûrelerini, Âyetü\'l-Kürsî\'yi, Fâtiha sûresini ve Kalem Sûresi\'nin 51-52. âyetlerini okumaktır. Ayrıca "Mâşâallâh lâ kuvvete illâ billâh" demek nazarı engeller.',
    source: 'Diyanet Din İşleri Yüksek Kurulu İnanç ve Hurafe Kararları',
    keywords: ['nazar', 'nazar boncuğu', 'felak nas', 'kalem suresi', 'göz değmesi', 'dua', 'hurafe'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  },
  {
    id: 'fetva-gunluk-2',
    question: 'Helal gıda, jelatin ve katkı maddelerinin fıkhi ölçüsü nedir?',
    category: 'gunluk',
    categoryLabel: 'Günlük Hayat & Gıda',
    verdict: 'bilgi',
    verdictBadge: 'Helal Sertifikası Aranmalı',
    summary: 'Domuz ve İslami usulle kesilmemiş hayvan menşeli jelatin ve katkı maddeleri haramdır.',
    answer: 'İslam fıkhında beslenme temel esas olarak helal ve tayyib (temiz) olmalıdır. Domuz eti ve türevleri (kemik, deri, jelatin) kesin olarak haramdır. Sığır veya balıktan elde edilen jelatin ise helaldir. Tüketicilerin ambalaj üzerindeki E kodlarını incelemeleri, güvenilir Diyanet ve TSE helal sertifikalı ürünleri tercih etmeleri tavsiye edilir. Tıbbi zorunluluk halinde alternatif ilaç bulunamadığında uzman tabibin kararıyla istisna uygulanabilir.',
    source: 'Din İşleri Yüksek Kurulu Helal Gıda Rehberi',
    keywords: ['helal gıda', 'jelatin', 'e kodları', 'katkı maddesi', 'domuz', 'haram'],
    kurulUrl: 'https://kurul.diyanet.gov.tr'
  }
];
