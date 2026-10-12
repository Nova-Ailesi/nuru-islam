export interface WisdomEntry {
  id: string;
  ayah: {
    arabic: string;
    transliteration: string;
    translation: string;
    source: string;
  };
  hadith: {
    text: string;
    narrator: string;
    source: string;
  };
  quote: {
    text: string;
    author: string;
  };
}

export const DAILY_WISDOM_LIST: WisdomEntry[] = [
  {
    id: "1",
    ayah: {
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      transliteration: "Elâ bi-zikrillâhi tatme'innül-kulûb.",
      translation: "Bilesiniz ki, kalpler ancak Allah'ı anmakla (zikretmekle) huzur bulur.",
      source: "Ra'd Sûresi, 28. Âyet"
    },
    hadith: {
      text: "Kolaylaştırınız, güçleştirmeyiniz; müjdeleyiniz, nefret ettirmeyiniz.",
      narrator: "Hz. Enes bin Mâlik (r.a.)",
      source: "Buhârî, İlim 11; Müslim, Cihâd 6"
    },
    quote: {
      text: "Dünle beraber gitti cancağızım, ne kadar söz varsa düne ait. Şimdi yeni şeyler söylemek lazım.",
      author: "Mevlânâ Celâleddîn-i Rûmî"
    }
  },
  {
    id: "2",
    ayah: {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "İnne me'al-'usri yusrâ.",
      translation: "Şüphesiz her güçlükle beraber muhakkak bir kolaylık vardır.",
      source: "İnşirâh Sûresi, 6. Âyet"
    },
    hadith: {
      text: "Sizin en hayırlınız, Kur'an'ı öğrenen ve onu başkalarına öğreteninizdir.",
      narrator: "Hz. Osman (r.a.)",
      source: "Buhârî, Fezâilü'l-Kur'an 21"
    },
    quote: {
      text: "Cümleler doğrudur sen doğru isen, doğruluk bulunmaz sen eğri isen.",
      author: "Yunus Emre"
    }
  },
  {
    id: "3",
    ayah: {
      arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
      transliteration: "Ve kâle rabbükümüd'ûnî estecib leküm.",
      translation: "Rabbiniz buyurdu ki: 'Bana dua edin, size icabet edeyim (duanızı kabul edeyim).'",
      source: "Mü'min Sûresi, 60. Âyet"
    },
    hadith: {
      text: "Dua, ibadetin ta kendisidir ve müminin en kuvvetli manevi kalkanıdır.",
      narrator: "Nu'mân bin Beşîr (r.a.)",
      source: "Tirmizî, Deavât 1"
    },
    quote: {
      text: "Kalp denizdir, dil de sahil. Denizde ne varsa sahile o vurur.",
      author: "Mevlânâ Celâleddîn-i Rûmî"
    }
  },
  {
    id: "4",
    ayah: {
      arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
      transliteration: "İnnes-salâte tenhâ 'anil-fahşâ-i vel-münker.",
      translation: "Şüphesiz namaz, insanı her türlü hayasızlıktan ve kötülükten alıkoyar.",
      source: "Ankebût Sûresi, 45. Âyet"
    },
    hadith: {
      text: "Müslüman, elinden ve dilinden diğer Müslümanların emniyette olduğu kimsedir.",
      narrator: "Abdullah bin Amr (r.a.)",
      source: "Buhârî, Îmân 4; Müslim, Îmân 64"
    },
    quote: {
      text: "Kusur arayan göz, güzelliği göremez. Sen kendi ayıplarınla meşgul ol ki başkalarının ayıbını görmeyesin.",
      author: "İmâm-ı Gazâlî"
    }
  }
];

export interface EsmaItem {
  number: number;
  arabic: string;
  name: string;
  meaning: string;
  virtue: string;
}

export const ESMAUL_HUSNA: EsmaItem[] = [
  { number: 1, arabic: "الله", name: "Allah", meaning: "Eşi benzeri olmayan, bütün kemal sıfatları kendisinde toplayan zat ismi.", virtue: "Kalbi nurlandırır, marifetullah kapılarını açar." },
  { number: 2, arabic: "الرَّحْمَن", name: "Er-Rahmân", meaning: "Dünyada bütün mahlukata merhamet eden, ayırt etmeksizin rızık veren.", virtue: "Merhamet duygusunu artırır, kalbe şefkat verir." },
  { number: 3, arabic: "الرَّحِيم", name: "Er-Rahîm", meaning: "Ahirette sadece müminlere sonsuz lütuf ve merhamette bulunan.", virtue: "Rızkı genişletir, manevi dereceleri yükseltir." },
  { number: 4, arabic: "الْمَلِك", name: "El-Melik", meaning: "Bütün kainatın mutlak sahibi, sultanı ve hükümdarı.", virtue: "İzzet, şeref ve manevi güç kazandırır." },
  { number: 5, arabic: "الْقُدُّوس", name: "El-Kuddûs", meaning: "Her türlü noksanlıktan, ayıptan ve kusurdan tamamen münezzeh.", virtue: "Manevi kirlerden ve günah kirinden arınmaya vesiledir." },
  { number: 6, arabic: "السَّلَام", name: "Es-Selâm", meaning: "Kullarını tehlikelerden ve afetten selamete çıkaran, esenlik veren.", virtue: "Korkulardan emin kılar, iç huzuru sağlar." },
  { number: 7, arabic: "الْمُؤْمِن", name: "El-Mü'min", meaning: "Gönüllerde iman nurunu yakan, sığınanlara eman veren.", virtue: "Vesveseden korur, imanı pekiştirir." },
  { number: 8, arabic: "الْمُهَيْمِن", name: "El-Müheymin", meaning: "Her şeyi görüp gözeten, koruyan ve hükmü altında tutan.", virtue: "Gizli sırlara basiretle vakıf olmaya yardımcı olur." },
  { number: 9, arabic: "الْعَزِيز", name: "El-Azîz", meaning: "İzzet sahibi, mağlup edilmesi imkansız, her şeye galip gelen.", virtue: "Zilletten kurtarır, saygınlık verir." },
  { number: 10, arabic: "الْجَبَّار", name: "El-Cebbâr", meaning: "Kırılanları onaran, dilediğini zorla yaptıran, azamet sahibi.", virtue: "Zalimlerin şerrinden ve zorbalıktan korur." },
  { number: 11, arabic: "الْمُتَكَبِّر", name: "El-Mütekebbir", meaning: "Büyüklükte eşi olmayan, azametinde hiçbir varlığa ortak tanımayan.", virtue: "Hayırlı mevki ve bereket celbeder." },
  { number: 12, arabic: "الْخَالِق", name: "El-Hâlık", meaning: "Yoktan var eden, her şeyi takdirine göre yaratan.", virtue: "İşlerin kolaylaşmasına vesiledir." },
  { number: 13, arabic: "الْبَارِئ", name: "El-Bâri'", meaning: "Her şeyi kusursuz, intizamlı ve birbirine uygun yaratan.", virtue: "Zihin berraklığı ve başarı ihsan eder." },
  { number: 14, arabic: "الْمُصَوِّر", name: "El-Musavvir", meaning: "Her varlığa kendine has en güzel suret ve şekli veren.", virtue: "Gönül güzelliği ve kabiliyetlerin inkişafına vesiledir." },
  { number: 15, arabic: "الْغَفَّار", name: "El-Gaffâr", meaning: "Günahları örten, mağfireti pek çok olan.", virtue: "Günahların affı ve bağışlanmaya vesiledir." }
];
