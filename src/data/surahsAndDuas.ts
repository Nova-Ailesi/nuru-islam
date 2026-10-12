import { SurahItem, DuaItem } from '../types';

export const SURAHS_DATA: SurahItem[] = [
  {
    id: 1,
    name: "Fâtiha Sûresi",
    arabicName: "سُورَةُ الْفَاتِحَةِ",
    meaningName: "Açılış, Başlangıç",
    ayahCount: 7,
    revelationType: "Mekke",
    summary: "Kur'an-ı Kerim'in ilk sûresi olup her namazın her rekâtında okunması farz veya vacip olan temel sûredir. Ümmü'l-Kitâb (Kitabın Anası) ve Şâfiye (Şifa veren) olarak bilinir.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Elhamdü lillâhi rabbil'âlemîn.",
      "Errahmânir'rahîm.",
      "Mâliki yevmiddîn.",
      "İyyâke na'büdü ve iyyâke neste'în.",
      "İhdinas-sırâtal müstakîm.",
      "Sırâtallezîne en'amte aleyhim gayrilmağdûbi aleyhim veleddâllîn. (Âmîn)"
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Hamd (övgü ve şükür), âlemlerin Rabbi olan Allah'a mahsustur.",
      "O, Rahmândır ve Rahîmdir.",
      "Hesap ve ceza gününün (din gününün) yegâne mâlikidir.",
      "(Rabbimiz!) Yalnız sana kulluk eder ve yalnız senden yardım dileriz.",
      "Bizi doğru yola ilet.",
      "Kendilerine nimet verdiğin kimselerin yoluna; gazaba uğramışların ve sapmışların yoluna değil. (Âmin)"
    ],
    virtue: "Peygamber Efendimiz (s.a.v.) buyurmuştur: 'Fatiha suresini okumayanın namazı olmaz.' Her derdin manevi şifasıdır."
  },
  {
    id: 105,
    name: "Fîl Sûresi",
    arabicName: "سُورَةُ الْفِيلِ",
    meaningName: "Fil Olayı",
    ayahCount: 5,
    revelationType: "Mekke",
    summary: "Ebrehe ordusunun Kâbe'yi yıkmak amacıyla fillerle Mekke'ye gelişini ve Ebâbîl kuşlarıyla helak edilişini anlatır.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
      "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
      "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
      "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",
      "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Elem tera keyfe fe'ale rabbüke bi-ashâbil fîl.",
      "Elem yec'al keydehüm fî tadlîl.",
      "Ve ersele aleyhim tayran ebâbîl.",
      "Termîhim bihicâratin min siccîl.",
      "Fece'alehüm ke'asfin me'kûl."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Görmedin mi Rabbin fil sahiplerine ne yaptı?",
      "Onların tuzaklarını boşa çıkarmadı mı?",
      "Üzerlerine sürü sürü kuşlar (ebâbîl) gönderdi.",
      "Onlara pişirilmiş çamurdan taşlar fırlatıyorlardı.",
      "Nihayet onları yenilmiş ekin yaprağı gibi kuru bir çöpe çevirdi."
    ],
    virtue: "Düşman şerrinden ve haksız zulümlerden korunmak için namazlarda zammı sure olarak okunur."
  },
  {
    id: 106,
    name: "Kureyş Sûresi",
    arabicName: "سُورَةُ قُرَيْشٍ",
    meaningName: "Kureyş Kabilesi",
    ayahCount: 4,
    revelationType: "Mekke",
    summary: "Kureyş kabilesine verilen güven, ticaret kolaylığı ve Kabe'nin Rabbi'ne ibadet etmeleri emrini beyan eder.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "لِإِيلَافِ قُرَيْشٍ",
      "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ",
      "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ",
      "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Li-îlâfi Kurayş.",
      "Îlâfihim rihleteş-şitâ-i ves-sayf.",
      "Felya'büdû rabbe hâzel-beyt.",
      "Ellezî et'amehüm min cû'in ve âmenehüm min havf."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Kureyş'i uzlaştırıp alıştırdığı için,",
      "Kış ve yaz seferlerine (ticaret kervanlarına) alıştırıp güven sağladığı için,",
      "Artık bu Ev'in (Kâbe'nin) Rabbine kulluk etsinler!",
      "O ki, kendilerini açlıktan doyurmuş ve her türlü korkudan emin kılmıştır."
    ],
    virtue: "Rızık bereketi, korkulardan emin olma ve huzur için okunması tavsiye edilir."
  },
  {
    id: 107,
    name: "Mâ'ûn Sûresi",
    arabicName: "سُورَةُ الْمَاعُونِ",
    meaningName: "Yardım, Zekât",
    ayahCount: 7,
    revelationType: "Mekke",
    summary: "Yetimi itip kakan, yoksulu doyurmayan, kıldığı namazdan gafil olan ve riyakarlık (gösteriş) yapan kimseleri uyarır.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
      "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
      "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ",
      "فَوَيْلٌ لِّلْمُصَلِّينَ",
      "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",
      "الَّذِينَ هُمْ يُرَاءُونَ",
      "وَيَمْنَعُونَ الْمَاعُونَ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Era'eytellezî yükezzibü bid-dîn.",
      "Fezâlikellezî yedu'ul-yetîm.",
      "Ve lâ yehuddu 'alâ ta'âmil-miskîn.",
      "Feveylün lil-musallîn.",
      "Ellezîne hüm 'an salâtihim sâhûn.",
      "Ellezîne hüm yürâûn.",
      "Ve yemne'ûnel-mâ'ûn."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Dini (hesap gününü) yalanlayanı gördün mü?",
      "İşte o, yetimi itip kakan kimsedir.",
      "Yoksulu doyurmayı teşvik etmez.",
      "Yazıklar olsun o namaz kılanlara ki,",
      "Onlar namazlarından gafildirler (özensizce kılarlar).",
      "Onlar gösteriş yaparlar,",
      "Ve en ufak bir yardımı (zekâtı ve ödüncü) bile esirgerler."
    ],
    virtue: "İbadetlerde samimiyet ve toplumsal dayanışmanın önemini hatırlatır."
  },
  {
    id: 108,
    name: "Kevser Sûresi",
    arabicName: "سُورَةُ الْكَوْثَرِ",
    meaningName: "Bol Nimet, Kevser Havuzu",
    ayahCount: 3,
    revelationType: "Mekke",
    summary: "Kur'an-ı Kerim'in en kısa suresidir. Efendimiz'e Kevser havuzu ve bitmez tükenmez hayırların verildiğini müjdeler.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
      "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "İnnâ a'taynâkel-kevser.",
      "Fesalli lirabbike venhar.",
      "İnne şânieke hüvel-ebter."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Şüphesiz biz sana Kevser'i (tükenmez hayır ve bereketi) verdik.",
      "Şimdi sen de Rabbin için namaz kıl ve kurban kes.",
      "Asıl sonu kesik (soyu kesik ve ziyan içinde) olan, sana buğzedendir."
    ],
    virtue: "Gam ve kederi defeder, bereket getirir, namazlarda sıkça okunur."
  },
  {
    id: 109,
    name: "Kâfirûn Sûresi",
    arabicName: "سُورَةُ الْكَافِرُونَ",
    meaningName: "İnkârcılar",
    ayahCount: 6,
    revelationType: "Mekke",
    summary: "Tevhid inancının şirkten kesin olarak ayrıldığını, dinde zorlama ve taviz olamayacağını açıkça ilan eder.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
      "لَا أَعْبُدُ مَا تَعْبُدُونَ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
      "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
      "لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Kul yâ eyyühel-kâfirûn.",
      "Lâ a'büdü mâ ta'büdûn.",
      "Ve lâ entüm 'âbidûne mâ a'büd.",
      "Ve lâ ene 'âbidüm-mâ 'abedtüm.",
      "Ve lâ entüm 'âbidûne mâ a'büd.",
      "Leküm dînüküm veliye dîn."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "De ki: Ey inkârcılar!",
      "Ben sizin taptıklarınıza kulluk etmem.",
      "Siz de benim kulluk ettiğime kulluk edecek değilsiniz.",
      "Ben asla sizin taptıklarınıza tapacak değilim.",
      "Siz de benim kulluk ettiğime kulluk ediciler değilsiniz.",
      "Sizin dininiz size, benim dinim banadır."
    ],
    virtue: "Kur'an'ın dörtte birine denktir. Şirkten ve riyadan arınmak için sabah sünnetinde ve yatmadan önce okunur."
  },
  {
    id: 110,
    name: "Nasr Sûresi",
    arabicName: "سُورَةُ النَّصْرِ",
    meaningName: "Zafer, Yardım",
    ayahCount: 3,
    revelationType: "Medine",
    summary: "İslam'ın yayılışını, Mekke'nin fethini ve insanların dalga dalga dine girişini anlatıp Allah'a tesbih ve istiğfarı emreder.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
      "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
      "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "İzâ câ-e nasrullâhi vel-feth.",
      "Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ.",
      "Fesebbih bihamdi rabbike vestağfirh, innehû kâne tevvâbâ."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Allah'ın yardımı ve fetih geldiği zaman,",
      "Ve insanların dalga dalga Allah'ın dinine girdiklerini gördüğün zaman,",
      "Hemen Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. Çünkü O, tövbeleri çokça kabul edendir."
    ],
    virtue: "Hacetlerin kabulü, manevi yardım ve günahların bağışlanması niyetiyle okunur."
  },
  {
    id: 111,
    name: "Tebbet (Mesed) Sûresi",
    arabicName: "سُورَةُ الْمَسَدِ",
    meaningName: "Kurusun, Hurma Lifi",
    ayahCount: 5,
    revelationType: "Mekke",
    summary: "İslam'a ve Resulullah'a düşmanlıkta aşırı giden Ebu Leheb ve eşinin akıbetini haber verir.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
      "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ",
      "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ",
      "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ",
      "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Tebbet yedâ ebî lehebiv-ve tebb.",
      "Mâ ağnâ 'anhü mâlühû ve mâ keseb.",
      "Sayaslâ nâran zâte leheb.",
      "Vemraetühû hammâletel-hatab.",
      "Fî cîdihâ hablüm-mim-mesed."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Ebu Leheb'in iki eli kurusun; kendisi de helak oldu zaten!",
      "Ona ne malı fayda verdi, ne de kazandıkları.",
      "O, alevli bir ateşe girecektir.",
      "Boynunda bükülmüş hurma lifinden bir ip olduğu halde, odun taşıyıcısı karısı da (ateşe girecektir)."
    ],
    virtue: "Zulüm ve fesadın mutlaka hüsrana uğrayacağını beyan eder."
  },
  {
    id: 112,
    name: "İhlâs Sûresi",
    arabicName: "سُورَةُ الإِخْلَاصِ",
    meaningName: "Samimiyet, Tevhid",
    ayahCount: 4,
    revelationType: "Mekke",
    summary: "İslam'ın özü olan Tevhid akidesini en veciz şekilde ifade eder: Allah Birdir, Samed'dir, doğmamış ve doğurmamıştır.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Kul hüvellâhü ehad.",
      "Allâhüs-samed.",
      "Lem yelid ve lem yûled.",
      "Ve lem yekün lehû küfüven ehad."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "De ki: O Allah, birdir (tektir).",
      "Allah Samed'dir (her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir).",
      "O, doğurmamış ve doğurulmamıştır.",
      "Ve hiçbir şey O'nun dengi ve benzeri değildir."
    ],
    virtue: "Kur'an'ın üçte birine denktir. Üç ihlas bir fatiha okumak hatim sevabına vesiledir."
  },
  {
    id: 113,
    name: "Felak Sûresi",
    arabicName: "سُورَةُ الْفَلَقِ",
    meaningName: "Sabah Aydınlığı",
    ayahCount: 5,
    revelationType: "Mekke",
    summary: "Yaratılanların şerrinden, karanlığın çökmesinden, büyücülerin ve hasetçilerin kıskançlığından sabahın Rabbine sığınmayı öğretir.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
      "مِن شَرِّ مَا خَلَقَ",
      "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
      "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Kul e'ûzü bi-rabbil-felak.",
      "Min şerri mâ halak.",
      "Ve min şerri gâsikın izâ vekab.",
      "Ve min şerrin-neffâsâti fil-'ukad.",
      "Ve min şerri hâsidin izâ hased."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "De ki: Sığınırım o sabahın Rabbine,",
      "Yarattığı şeylerin şerrinden,",
      "Karanlığı çöktüğü zaman gecenin şerrinden,",
      "Düğümlere üfleyen büyücülerin şerrinden,",
      "Ve haset ettiği vakit hasetçinin şerrinden!"
    ],
    virtue: "Muavvizeteyn (koruyucu) sürelerdendir. Nazara, vesveseye ve şerlere karşı en büyük kalkandır."
  },
  {
    id: 114,
    name: "Nâs Sûresi",
    arabicName: "سُورَةُ النَّاسِ",
    meaningName: "İnsanlar",
    ayahCount: 6,
    revelationType: "Mekke",
    summary: "İnsanların kalbine vesvese veren cin ve insan şeytanlarının hilesinden İnsanların Meliki ve İlahı olan Allah'a sığınmayı emreder.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
      "مَلِكِ النَّاسِ",
      "إِلَٰهِ النَّاسِ",
      "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
      "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
      "مِنَ الْجِنَّةِ وَالنَّاسِ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Kul e'ûzü bi-rabbin-nâs.",
      "Melikin-nâs.",
      "İlâhin-nâs.",
      "Min şerril-vesvâsil-hannâs.",
      "Ellezî yüvesvisü fî sudûrin-nâs.",
      "Minel-cinneti ven-nâs."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "De ki: Sığınırım insanların Rabbine,",
      "İnsanların yegâne Melik'ine (hükümranına),",
      "İnsanların İlahına,",
      "O sinsi vesvesecinin şerrinden,",
      "Ki o, insanların göğüslerine vesvese fısıldar,",
      "Gerek cinlerden, gerekse insanlardan!"
    ],
    virtue: "Her türlü evham, vesvese ve korkuya karşı sabah-akşam üçer defa okunması sünnettir."
  },
  {
    id: 255,
    name: "Âyet-el Kürsî (Bakara 255)",
    arabicName: "آيَةُ الْكُرْسِيِّ",
    meaningName: "Kürsî Âyeti",
    ayahCount: 1,
    revelationType: "Medine",
    summary: "Kur'an-ı Kerim'in en faziletli âyetidir. Allah'ın Hayy ve Kayyûm sıfatlarını, sonsuz kudretini ve kürsîsinin gökleri ve yeri kuşattığını beyan eder.",
    arabicText: [
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ"
    ],
    transliteration: [
      "Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te'huzühû sinetüv-velâ nevm. Lehû mâ fis-semâvâti ve mâ fil-ard. Men zellezî yeşfe'u 'indehû illâ bi-iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehüm, velâ yühîtûne bi-şey'im-min 'ilmihî illâ bi-mâ şâ'. Vesi'a kürsiyyühüs-semâvâti vel-ard. Velâ yeûdühû hıfzuhümâ ve hüvel-'aliyyül-'azîm."
    ],
    turkishMeaning: [
      "Allah! O'ndan başka ilâh yoktur; O diridir (Hayy'dır), bütün varlığı gözetip yönetendir (Kayyûm'dur). O'nu ne bir uyuklama tutabilir, ne de bir uyku. Göklerde ve yerde ne varsa hepsi O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? O, kullarının önlerindekini de arkalarındakini de (yaptıklarını ve yapacaklarını) bilir. Onlar ise O'nun dilediği kadarından başka, ilminden hiçbir şeyi kavrayamazlar. O'nun kürsüsü gökleri ve yeri kuşatmıştır. Onları koruyup gözetmek O'na asla ağır gelmez. O, çok yücedir, çok büyüktür."
    ],
    virtue: "Her farz namazın ardından okuyanın cennete girmesine ancak ölüm engel olur (Hadis-i Şerif)."
  },
  {
    id: 94,
    name: "İnşirâh Sûresi",
    arabicName: "سُورَةُ الشَّرْحِ",
    meaningName: "Genişleme, Ferahlık",
    ayahCount: 8,
    revelationType: "Mekke",
    summary: "Zorlukların ardından muhakkak bir kolaylığın geleceğini müjdeleyen, göğsü ferahlatan eşsiz bir teselli suresidir.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      "وَوَضَعْنَا عَنكَ وِزْرَكَ",
      "الَّذِي أَنقَضَ ظَهْرَكَ",
      "وَرَفَعْنَا لَكَ ذِكْرَكَ",
      "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      "فَإِذَا فَرَغْتَ فَانصَبْ",
      "وَإِلَىٰ رَبِّكَ فَارْغَب"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Elem neşrah leke sadrak.",
      "Ve veda'nâ 'anke vizrak.",
      "Ellezî enkada zahrak.",
      "Ve refa'nâ leke zikrak.",
      "Fe-inne me'al-'usri yusrâ.",
      "İnne me'al-'usri yusrâ.",
      "Fe-izâ ferağte fensab.",
      "Ve ilâ rabbike ferğab."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Biz senin göğsünü açıp genişletmedik mi?",
      "Belini büken ağır yükünü senden indirmedik mi?",
      "Senin şanını ve zikrini yüceltmedik mi?",
      "Elbette her güçlükle beraber bir kolaylık vardır.",
      "Gerçekten güçlükle beraber bir kolaylık vardır.",
      "Öyleyse bir işi bitirince hemen diğerine koyul (ibadetle yorul),",
      "Ve yalnız Rabbine yönelip yalvar!"
    ],
    virtue: "İçi daralan, sıkıntı ve stres yaşayan kimselerin kalbine sekinet ve huzur indirir."
  },
  {
    id: 97,
    name: "Kadir Sûresi",
    arabicName: "سُورَةُ الْقَدْرِ",
    meaningName: "Kadir Gecesi, Değer",
    ayahCount: 5,
    revelationType: "Mekke",
    summary: "Kur'an'ın indirildiği Kadir Gecesi'nin bin aydan daha hayırlı olduğunu ve meleklerin o gece yeryüzüne inişini anlatır.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
      "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ",
      "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
      "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ",
      "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "İnnâ enzelnâhü fî leyletil-kadr.",
      "Ve mâ edrâke mâ leyletül-kadr.",
      "Leyletül-kadri hayrum-min elfi şehr.",
      "Tenezzelül-melâiketü ver-rûhu fîhâ bi-izni rabbihim min külli emr.",
      "Selâmün hiye hattâ matla'il-fecr."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Şüphesiz biz onu (Kur'an'ı) Kadir Gecesi'nde indirdik.",
      "Kadir Gecesi'nin ne olduğunu sen nereden bileceksin?",
      "Kadir Gecesi bin aydan daha hayırlıdır.",
      "O gecede melekler ve Ruh (Cebrail), Rablerinin izniyle her bir iş için peyderpey inerler.",
      "O gece, tan yeri ağarana kadar tam bir esenlik ve selamettir."
    ],
    virtue: "Kadir gecelerinde ve mübarek günlerde bolca okunur, ömre bereket katar."
  },
  {
    id: 103,
    name: "Asr Sûresi",
    arabicName: "سُورَةُ الْعَصْرِ",
    meaningName: "Zaman, İkindi Vakti",
    ayahCount: 3,
    revelationType: "Mekke",
    summary: "İmam Şafii'nin 'Kur'an'dan başka hiçbir sûre inmeseydi bu sûre insanlara yeterdi' dediği, kurtuluşun 4 şartını bildiren sûredir.",
    arabicText: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "وَالْعَصْرِ",
      "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
      "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ"
    ],
    transliteration: [
      "Bismillâhirrahmânirrahîm.",
      "Vel-'asr.",
      "İnnel-insâne lefî husr.",
      "İllellezîne âmenû ve 'amilus-sâlihâti ve tevâsav bil-hakkı ve tevâsav bis-sabr."
    ],
    turkishMeaning: [
      "Rahmân ve Rahîm olan Allah'ın adıyla.",
      "Asra (zamana) yemin olsun ki,",
      "İnsan gerçekten büyük bir ziyan ve hüsran içindedir.",
      "Ancak iman edip salih ameller işleyenler, birbirlerine hakkı tavsiye edenler ve sabrı tavsiye edenler müstesna!"
    ],
    virtue: "Sahabeler ayrılmadan önce birbirlerine bu sureyi okurlardı."
  }
];

export const NAMAZ_DUAS_DATA: DuaItem[] = [
  {
    id: "subhaneke",
    title: "Sübhâneke Duâsı",
    category: "namaz",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ",
    transliteration: "Sübhânekellâhümme ve bi hamdik ve tebârakes-mük ve te'âlâ ceddük (ve celle senâük - cenaze namazında) ve lâ ilâhe gayrük.",
    meaning: "Allah'ım! Sen her türlü noksanlıktan münezzehsin, Seni hamdinle tesbih ederim. Senin ismin mübarektir, Senin şanın yücedir ve Senden başka ilah yoktur.",
    source: "Namazın iftitah tekbirinden sonra ilk okunan duadır (Tirmizi, Ebu Davud).",
    benefits: "Namaza Allah'ı noksan sıfatlardan tenzih ederek başlama fazileti."
  },
  {
    id: "ettehiyyatu",
    title: "Ettehiyyâtü Duâsı (Teşehhüd)",
    category: "namaz",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۖ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۖ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۖ أَشْهَدُ أَن لَّا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ettehiyyâtü lillâhi ves-salevâtü vet-tayyibât. Esselâmü 'aleyke eyyühen-nebiyyü ve rahmetullâhi ve berekâtüh. Esselâmü 'aleynâ ve 'alâ 'ibâdillâhis-sâlihîn. Eşhedü el lâ ilâhe illallâh ve eşhedü enne Muhammeden 'abdühû ve rasûlüh.",
    meaning: "Bütün selamlar, dualar ve en güzel ibadetler Allah'adır. Ey Peygamber! Selam, Allah'ın rahmeti ve bereketleri senin üzerine olsun. Selam bizim ve Allah'ın bütün salih kullarının üzerine olsun. Şahitlik ederim ki Allah'tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed O'nun kulu ve elçisidir.",
    source: "Mirac gecesi Cenab-ı Hak ile Peygamberimiz (s.a.v.) arasındaki kutlu selamlaşma.",
    benefits: "Namazın her oturuşunda (ka'de) okunması vaciptir."
  },
  {
    id: "salli",
    title: "Allâhümme Salli Duâsı",
    category: "namaz",
    arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allâhümme salli 'alâ Muhammedin ve 'alâ âli Muhammed, kemâ salleyte 'alâ İbrâhîme ve 'alâ âli İbrâhîm, inneke hamîdüm-mecîd.",
    meaning: "Allah'ım! İbrahim'e ve İbrahim'in âline (ailesine) salat ettiğin (rahmet kıldığın) gibi, Muhammed'e ve Muhammed'in âline de salat eyle. Şüphesiz Sen çok övülensin, şanı pek yücesin.",
    source: "Sahih-i Buhari & Müslim",
    benefits: "Son oturuşta okunması sünnet-i müekkededir."
  },
  {
    id: "barik",
    title: "Allâhümme Bârik Duâsı",
    category: "namaz",
    arabic: "اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allâhümme bârik 'alâ Muhammedin ve 'alâ âli Muhammed, kemâ bârakte 'alâ İbrâhîme ve 'alâ âli İbrâhîm, inneke hamîdüm-mecîd.",
    meaning: "Allah'ım! İbrahim'e ve İbrahim'in âline bereket ihsan ettiğin gibi, Muhammed'e ve Muhammed'in âline de bereket ihsan eyle. Şüphesiz Sen çok övülensin, şanı pek yücesin.",
    source: "Sahih-i Buhari & Müslim",
    benefits: "Salli duasının ardından okunur."
  },
  {
    id: "rabbena_atina",
    title: "Rabbenâ Âtinâ Duâsı",
    category: "namaz",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbenâ âtinâ fid-dünyâ hasenetev-ve fil-âhireti hasenetev-ve kınâ 'azâben-nâr.",
    meaning: "Ey Rabbimiz! Bize dünyada da iyilik ve güzellik ver, ahirette de iyilik ve güzellik ver ve bizi cehennem ateşinin azabından koru!",
    source: "Bakara Sûresi, 201. Âyet",
    benefits: "Peygamberimiz'in en çok yaptığı duadır."
  },
  {
    id: "rabbenağfirli",
    title: "Rabbenâğfirlî Duâsı",
    category: "namaz",
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration: "Rabbenagfir lî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hisâb. Birahmetike yâ erhamerrâhimîn.",
    meaning: "Ey Rabbimiz! Hesabın görüleceği gün beni, anamı-babamı ve bütün inananları bağışla. Rahmetinle muamele eyle, ey merhametlilerin en merhametlisi!",
    source: "İbrahim Sûresi, 41. Âyet",
    benefits: "Ana-baba ve tüm müminler için af ve mağfiret duasıdır."
  },
  {
    id: "kunut_1",
    title: "Kunut Duâsı 1",
    category: "namaz",
    arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَن يَفْجُرُكَ",
    transliteration: "Allâhümme innâ neste'înüke ve nestağfiruke ve nestehdîk, ve nü'minü bike ve netûbü ileyk, ve netevekkelü 'aleyke ve nüsnî 'aleykel-hayra külleh, neşkürüke ve lâ nekfürük, ve nahle'u ve netrükü mey-yefcürük.",
    meaning: "Allah'ım! Biz Senden yardım dileriz, Senden bağışlanma dileriz ve Senden doğru yolu göstermeni dileriz. Sana iman ederiz, Sana tövbe ederiz ve Sana güveniriz. Seni bütün hayırlarla överiz. Sana şükreder, asla nankörlük etmeyiz. Sana isyan eden günahkâr kimseleri terk eder ve onlardan ayrılırız.",
    source: "Vitir Namazı 3. Rekâtında Vaciptir.",
    benefits: "Vitir namazında rükudan önce tekbir alınıp okunur."
  },
  {
    id: "kunut_2",
    title: "Kunut Duâsı 2",
    category: "namaz",
    arabic: "اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ",
    transliteration: "Allâhümme iyyâke na'büdü ve leke nüsallî ve nescüd, ve ileyke nes'â ve nahfid, nercû rahmeteke ve nahşâ 'azâbek, inne 'azâbeke bil-küffâri mülhık.",
    meaning: "Allah'ım! Biz yalnız Sana kulluk ederiz, yalnız Senin için namaz kılar ve secde ederiz. Yalnız Sana yönelip ibadetine koşarız. Rahmetini umar, azabından korkarız. Şüphesiz Senin azabın kafirlere mutlaka erişecektir.",
    source: "Vitir Namazı Kunut 1'in ardından okunur.",
    benefits: "Kunut 1 ile beraber okunur."
  },
  {
    id: "seyyidul_istigfar",
    title: "Seyyidü'l İstiğfâr (Bağışlanma Duası)",
    category: "gunluk",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allâhümme ente rabbî lâ ilâhe illâ ente halaktenî ve ene 'abdüke ve ene 'alâ 'ahdike ve va'dike mesteta'tü, e'ûzü bike min şerri mâ sana'tü, ebû'ü leke bi-ni'metike 'aleyye ve ebû'ü bi-zenbî fağfir lî fe-innehû lâ yağfiruz-zünûbe illâ ente.",
    meaning: "Allah'ım! Sen benim Rabbimsin; Senden başka ilah yoktur. Beni Sen yarattın, ben Senin kulunum. Gücüm yettiğince Sana verdiğim ahit ve vaat üzerindeyim. Yaptıklarımın şerrinden Sana sığınırım. Üzerimdeki nimetini itiraf eder, günahımı da kabul ederim. Beni bağışla; çünkü günahları Senden başka bağışlayacak hiç kimse yoktur.",
    source: "Buhari, Deavat 2",
    benefits: "Peygamberimiz buyurdu: 'Kim bunu gündüz inanarak söyler de o gün akşama ermeden ölürse cennetliktir.'"
  },
  {
    id: "ezan_duasi",
    title: "Ezan Duâsı",
    category: "gunluk",
    arabic: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
    transliteration: "Allâhümme rabbe hâzihid-da'vetit-tâmmeh, ves-salâtil-kâimeh, âti Muhammedenil-vesîlete vel-fadîleh, veb'ashü mekâmem-mahmûdenillezî va'adteh.",
    meaning: "Ey bu eksiksiz davetin ve kılınacak namazın Rabbi olan Allah'ım! Muhammed'e (s.a.v.) vesileyi ve fazileti ver. O'nu vaat ettiğin Makam-ı Mahmud'a ulaştır.",
    source: "Buhari, Ezan 8",
    benefits: "Ezanı dinledikten sonra bu duayı okuyana Peygamber Efendimiz'in şefaati hak olur."
  },
  {
    id: "nazar_duasi",
    title: "Nazar ve Korunma Duâsı",
    category: "gunluk",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    transliteration: "E'ûzü bi-kelimâtillâhit-tâmmeti min külli şeytânin ve hâmmetin ve min külli 'aynin lâmmeh.",
    meaning: "Her türlü şeytandan, zararlı hayvan ve haşereden ve kem gözlerden (nazardan) Allah'ın tastamam kelimelerine sığınırım.",
    source: "Buhari, Enbiya 10",
    benefits: "Çocuklara ve hanelere nazar ve kötülük isabet etmemesi için okunur."
  }
];
