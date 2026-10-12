import { ProphetItem, SahabaItem } from '../types';

export const PROPHET_MUHAMMAD_DETAILS = {
  name: "Hz. Muhammed Mustafa (s.a.v.)",
  title: "Hâtemü'l-Enbiyâ (Peygamberlerin Sonuncusu) & Âlemlere Rahmet",
  birthYear: "571 (12 Rebiülevvel / Fil Yılı)",
  birthPlace: "Mekke-i Mükerreme",
  deathYear: "632 (12 Rebiülevvel / 11 Hicri)",
  deathPlace: "Medine-i Münevvere (Ravza-i Mutahhara)",
  summary: "Cenâb-ı Hakk'ın bütün insanlığa ve cinlere gönderdiği son elçi, ahlakın en yüce örneği ve iki cihan serveri.",
  sections: [
    {
      title: "1. Doğumu ve Yetim Büyümesi",
      content: "571 yılında Mekke'de dünyayı teşrif etti. Doğmadan önce babası Abdullah'ı, 6 yaşında annesi Âmine'yi kaybetti. Dedesi Abdülmuttalib'in ve ardından amcası Ebû Tâlib'in himayesinde büyüdü."
    },
    {
      title: "2. Muhammedü'l-Emîn Sıfatı ve Gençliği",
      content: "Doğruluğu, dürüstlüğü ve ahde vefası sebebiyle henüz genç yaşta tüm Mekke halkı tarafından 'Muhammedü'l-Emîn' (Güvenilir Muhammed) lakabıyla anıldı. Hılfü'l-Fudûl (Erdemliler İttifakı) cemiyetine katılarak mazlumların hakkını savundu."
    },
    {
      title: "3. Hz. Hatice ile Evliliği",
      content: "25 yaşında iken üstün ahlakı, asaleti ve vefasıyla tanınan Hz. Hatice validemiz ile evlendi. Bu kutlu evlilikten Kâsım, Zeyneb, Rukiyye, Ümmü Gülsüm, Fâtıma ve Abdullah dünyaya geldi."
    },
    {
      title: "4. İlk Vahiy ve Peygamberlik (Hira Mağarası)",
      content: "610 yılı Ramazan ayının Kadir Gecesi'nde, Hira Mağarası'nda tefekkür halindeyken Cebrail (a.s.) vasıtasıyla Alak Sûresi'nin ilk 5 âyeti indirildi: 'Yaratan Rabbinin adıyla oku!'"
    },
    {
      title: "5. Hicret ve Medine İslam Devleti (622)",
      content: "Müşriklerin zulüm ve boykotlarına karşı sabredildi. 622 yılında Allah'ın emriyle Mekke'den Medine'ye hicret edildi. Ensar ve Muhacir kardeşliği tesis edildi, ilk mescid (Mescid-i Nebevî) inşa edildi."
    },
    {
      title: "6. Veda Hutbesi ve Ebediyete İrtihal (632)",
      content: "632 yılındaki Veda Haccı'nda 120 binden fazla sahabeye hitap ederek insan haklarının evrensel beyannamesi olan Veda Hutbesi'ni irad etti: 'Size iki emanet bırakıyorum; onlara sarıldıkça asla sapmazsınız: Allah'ın Kitabı ve Sünnetim.' 63 yaşındayken Medine'de refîk-i a'lâya (yüce dosta) kavuştu."
    }
  ]
};

export const PROPHETS_LIST: ProphetItem[] = [
  {
    id: "adem",
    name: "Hz. Âdem (a.s.)",
    arabicName: "آدَمُ عَلَيْهِ السَّلَام",
    title: "Safiyyullâh - İlk İnsan ve İlk Peygamber",
    period: "İnsanlığın Başlangıcı",
    location: "Cennet ve Yeryüzü",
    brief: "Allah Teâlâ'nın topraktan yarattığı ilk insan, beşeriyetin babası ve ilk peygamberdir.",
    fullStory: "Allah Teâlâ meleklere 'Ben yeryüzünde bir halife yaratacağım' buyurmuş, Hz. Âdem'e bütün eşyanın isimlerini öğretmiştir. İblis kibirlenerek secde etmemiş ve lanetlenmiştir. Hz. Havva ile birlikte cennette imtihana tabi tutulmuş, tevbesi kabul edildikten sonra yeryüzüne indirilerek insanlığın atası olmuştur.",
    keyLessons: ["Tevbenin gücü ve samimiyeti", "Kibrin şeytani bir helak sebebi oluşu", "İlmin ve isimlerin hikmetinin üstünlüğü"],
    quranMentions: "Bakara 30-38, A'râf 11-25, Tâhâ 115-123"
  },
  {
    id: "nuh",
    name: "Hz. Nûh (a.s.)",
    arabicName: "نُوحٌ عَلَيْهِ السَّلَام",
    title: "Neciyyullâh - İkinci Âdem",
    period: "M.Ö. ~3000'ler",
    location: "Mezopotamya",
    brief: "950 yıl boyunca kavmini bıkmadan usanmadan tevhide davet eden sabır abidesi peygamber.",
    fullStory: "Kavmi putperestlikte ısrar edince Allah'ın emriyle devasa bir gemi inşa etti. Büyük Tufan koptuğunda müminler ve her hayvandan birer çift gemiye bindi. Kendi oğlu Kenan iman etmeyerek boğuldu; gemi Cudi Dağı'na oturdu.",
    keyLessons: ["Tebliğde sarsılmaz sabır ve sebat", "Kan bağının değil, iman bağının kurtarıcı olması", "Allah'ın vadine tam tevekkül"],
    quranMentions: "Nûh Sûresi, Hûd 25-49, A'râf 59-64"
  },
  {
    id: "ibrahim",
    name: "Hz. İbrâhîm (a.s.)",
    arabicName: "إِبْرَاهِيمُ عَلَيْهِ السَّلَام",
    title: "Halîlullâh - Tevhidin Öncüsü & Hanîf Din Önderi",
    period: "M.Ö. ~2000'ler",
    location: "Urfa, Babil, Filistin, Mekke",
    brief: "Putları kıran, Nemrud'un ateşine atıldığında ateşi gül bahçesine dönen ulu'l-azm peygamber.",
    fullStory: "Aklı ve basiretiyle yıldızlara, aya ve güneşe bakarak yaratıcıyı arayan ve 'Ben batanları sevmem' diyerek tek ilaha teslim olan hanif önderdir. Oğlu İsmail (a.s.) ile birlikte yeryüzünün ilk mabedi olan Kâbe-i Muazzama'yı inşa etmiş ve hac ibadetini ilan etmiştir.",
    keyLessons: ["Korkusuzca tevhidi savunmak", "Ateşe atılsan dahi Allah'a tam teslimiyet", "Kurban ve fedakarlık şuuru"],
    quranMentions: "İbrâhîm Sûresi, Bakara 124-132, Enbiyâ 51-71"
  },
  {
    id: "yusuf",
    name: "Hz. Yûsuf (a.s.)",
    arabicName: "يُوسُفُ عَلَيْهِ السَّلَام",
    title: "Sıddîk - Ahsenü'l-Kasas (Kıssaların En Güzeli)",
    period: "M.Ö. ~1700'ler",
    location: "Kenan Diyarı ve Mısır",
    brief: "Kardeşlerinin kuyuya attığı, iftirayla zindana düşen, sabırla Mısır'a aziz olan iffet timsali.",
    fullStory: "Babası Hz. Yakub'un gözbebeği iken kardeşlerinin kıskançlığıyla kuyuya atıldı, köle olarak Mısır sarayına satıldı. Züleyha'nın gayrimeşru teklifine karşı iffetini koruyarak zindanı tercih etti. Rüyaları yorumlama mucizesiyle Mısır hazinelerinin başına geçti ve kardeşlerini affetti.",
    keyLessons: ["İffet ve haya erdemi", "Kuyu ve zindan imtihanına karşı sabrın sonundaki azizlik", "İntikam gücün varken affetme yüceliği"],
    quranMentions: "Yûsuf Sûresi tamamı (111 âyet)"
  },
  {
    id: "musa",
    name: "Hz. Mûsâ (a.s.)",
    arabicName: "مُوسَىٰ عَلَيْهِ السَّلَام",
    title: "Kelîmullâh - Firavun'a Karşı Hak Mücadelesi",
    period: "M.Ö. ~1300'ler",
    location: "Mısır, Sina Çölü, Tur Dağı",
    brief: "Tevrat'ın verildiği, asasıyla Kızıldeniz'i yarıp Firavun'un zulmünü yıkan ulu'l-azm peygamber.",
    fullStory: "Bebekken sandık içinde Nil nehrine bırakılıp bizzat Firavun'un sarayında büyütüldü. Tur Dağı'nda Cenab-ı Hak ile vasıtasız konuştu. Kardeşi Harun (a.s.) ile Firavun'a gidip İsrailoğullarını serbest bırakmasını istedi. Kızıldeniz yarıldı, Firavun ordusuyla boğuldu.",
    keyLessons: ["Zalimin sarayında büyüyüp hakka sahip çıkmak", "Kızıldeniz önünde dahi 'Rabbim benimledir' güveni", "Tevhid mücadelesinde cesaret"],
    quranMentions: "Kasas, Tâhâ, A'râf, Bakara, Şuarâ"
  },
  {
    id: "davud",
    name: "Hz. Dâvûd (a.s.)",
    arabicName: "دَاوُودُ عَلَيْهِ السَّلَام",
    title: "Zebur Verilen Hükümdar Peygamber",
    period: "M.Ö. ~1000'ler",
    location: "Kudüs",
    brief: "Demiri hamur gibi büken, dağların ve kuşların kendisiyle birlikte tesbih ettiği adil peygamber.",
    fullStory: "Câlût'u sapan taşıyla mağlup ederek İsrailoğullarına hükümdar oldu. Kendisine Zebur indirildi. Sesiyle okuduğu tesbihler tüm tabiatı cezbederdi. Bir gün oruç tutup bir gün yerdi (Savm-ı Dâvûd). El emeğiyle zırh örerek rızkını kazanırdı.",
    keyLessons: ["Hükümdarken dahi el emeğiyle geçinmek", "Savm-ı Davud ile nefis terbiyesi", "Adaletli hükmetme sorumluluğu"],
    quranMentions: "Enbiyâ 78-80, Sebe' 10-11, Sâd 17-26"
  },
  {
    id: "suleyman",
    name: "Hz. Süleymân (a.s.)",
    arabicName: "سُلَيْمَانُ عَلَيْهِ السَّلَام",
    title: "Rüzgâra, Cinlere ve Kuş Diline Hükmeden Peygamber",
    period: "M.Ö. ~950'ler",
    location: "Kudüs (Mescid-i Aksâ)",
    brief: "Dünya üzerinde eşi benzeri görülmemiş bir saltanata sahip kılınmış, buna rağmen tevazudan ayrılmamış peygamber.",
    fullStory: "Hz. Davud'un oğludur. Mescid-i Aksâ'yı inşa ettirdi. Karıncaların sesini işitir, hüdhüd kuşu vasıtasıyla Sebe Melikesi Belkıs'ı tevhîde davet ederdi. Muazzam zenginliğine rağmen kalbi yalnız Allah'a bağlı bir kul idi.",
    keyLessons: ["Zenginlik ve iktidarın şımartmadığı tevazu", "Bütün mahlukata şefkat ve merhamet", "Hikmet ve derin anlayış"],
    quranMentions: "Neml 15-44, Sebe' 12-14, Sâd 30-40"
  },
  {
    id: "isa",
    name: "Hz. Îsâ (a.s.)",
    arabicName: "عِيسَىٰ عَلَيْهِ السَّلَام",
    title: "Rûhullâh & Kelimetullâh - İncil Verilen Peygamber",
    period: "Milat Başlangıcı",
    location: "Kudüs, Nasıra, Beytüllahim",
    brief: "Babasız olarak Hz. Meryem'den dünyaya gelen, beşikte konuşan, ölüleri dirilten ulu'l-azm peygamber.",
    fullStory: "Cebrail (a.s.)'ın nefhasıyla iffet timsali Hz. Meryem'den doğdu. Beşikteyken 'Ben Allah'ın kuluyum' diyerek annesini iftiralardan akladı. Allah'ın izniyle körlerin gözünü açar, alacalı hastaları iyileştirir, çamurdan kuşa can verirdi. İncil verildi; çarmıha gerilmedi, Allah katına yükseltildi.",
    keyLessons: ["Allah'ın her şeye gücünün yettiği kudret", "Dünyaya meyletmeyen zühd hayatı", "Şefkat ve bağışlayıcılık"],
    quranMentions: "Âl-i İmrân 45-59, Meryem 16-36, Mâide 110-120"
  }
];

export const SAHABA_LIST: SahabaItem[] = [
  {
    id: "ebubekir",
    name: "Hz. Ebû Bekir es-Sıddîk (r.a.)",
    title: "İlk Halife & Sıddîk-ı Ekber",
    role: "Peygamber Efendimiz'in hicret yoldaşı, Sevr Mağarası'ndaki 'ikinin ikincisi' ve en yakın dostu.",
    virtues: "İslam'ı tereddütsüz ilk kabul eden erkek, servetinin tamamını Allah yolunda infak eden sahabi.",
    lifeSummary: "Efendimiz'in vefatından sonra ümmetin dağılmasını önlemiş, irtidat isyanlarını bastırmış ve Kur'an-ı Kerim'i mushaf haline getirmiştir. 2 yıl süren adil hilafetinin ardından vefat etmiştir.",
    quote: "'Ey insanlar! Ben sizin en hayırlınız olmadığım halde başınıza geçirildim. Eğer doğru yolda gidersem bana yardım edin; haktan saparsam beni düzeltin!'"
  },
  {
    id: "omer",
    name: "Hz. Ömer el-Fârûk (r.a.)",
    title: "İkinci Halife & Adaletin Timsali",
    role: "Hakkı batıldan ayıran (el-Fârûk), devlet teşkilatlanmasını kuran adil devlet başkanı.",
    virtues: "Peygamberimizin 'Ömer bir sokaktan geçerse şeytan yolunu değiştirir' övgüsüne mazhar olmuştur.",
    lifeSummary: "10 yıllık hilafetinde Kudüs, Şam, Mısır ve İran fethedilmiş; beytülmal, divan ve posta teşkilatı kurulmuş; Hicri takvim ilan edilmiştir. Sırtında un çuvalı taşıyarak yoksullara erzak dağıtan bir adalete sahipti.",
    quote: "'Fırat kenarında bir koyunu kurt kapsa, korkarım ki Allah onu Ömer'den sorar!'"
  },
  {
    id: "osman",
    name: "Hz. Osmân Zinnûreyn (r.a.)",
    title: "Üçüncü Halife & Haya ve Cömertlik Timsali",
    role: "Peygamberimizin iki kızıyla evlendiği için 'İki nur sahibi' (Zinnûreyn) unvanını almıştır.",
    virtues: "Meleklerin dahi hayâ ettiği derin bir edep ve cömertlik sahibi; Tebük ordusunu tek başına donatan sahabi.",
    lifeSummary: "12 yıl hilafet yapmıştır. Kur'an-ı Kerim nüshalarını çoğaltıp İslam merkezlerine göndererek kıraat birliğini sağlamıştır. Şehit edilirken dahi kanı mushaf üzerine akmıştır.",
    quote: "'Kişinin hayâsı ne kadar çoksa, imanı ve dini o kadar kemale erer.'"
  },
  {
    id: "ali",
    name: "Hz. Alî el-Mürtezâ (r.a.)",
    title: "Dördüncü Halife & Haydar-ı Kerrâr (Allah'ın Aslanı)",
    role: "İlim şehrinin kapısı, Efendimiz'in amcasının oğlu ve damadı, Hz. Hasan ve Hüseyin'in babası.",
    virtues: "Çocuk yaşta ilk iman eden kişi, hicret gecesi canını hiçe sayarak Peygamberimizin yatağına yatan fedakarlık timsali.",
    lifeSummary: "Hayber kalesinin fatihi, derin fıkıh ve belagat üstadıdır. Fitne ve kargaşaların arttığı dönemde adaleti tesis etmek için canla başla mücadele etmiş ve şehit edilmiştir.",
    quote: "'Bana bir harf öğretenin kırk yıl kölesi olurum. İlim maldan hayırlıdır; ilim seni korur, sen ise malı korursun.'"
  },
  {
    id: "hatice",
    name: "Hz. Hatîce-tül Kübrâ (r.anhâ)",
    title: "Ümmü'l-Mü'minîn & Tâhire (Tertemiz)",
    role: "İlk Müslüman, Peygamber Efendimiz'in 25 yıllık hayat arkadaşı ve en büyük manevi desteği.",
    virtues: "Cebrail (a.s.)'ın Allah'tan selam getirdiği, cennette kendisi için inciden bir köşk hazırlanan ulu sahabi.",
    lifeSummary: "İlk vahiy geldiğinde Efendimiz'i teselli etmiş, tüm malını İslam davasına vakfetmiş, boykot yıllarının çilesine katlanmıştır. Vefat ettiği yıla 'Hüzün Yılı' denmiştir.",
    quote: "'Allah seni asla utandırmaz. Çünkü sen akrabayı gözetirsin, doğru konuşursun, muhtaçların elinden tutarsın.'"
  },
  {
    id: "bilal",
    name: "Hz. Bilâl-i Habeşî (r.a.)",
    title: "İslam'ın İlk Müezzini & Tevhidin Sadık Nefesi",
    role: "Kızgın kumlara yatırılıp üzerine kayalar konurken bile 'Ehad! Ehad!' (Allah birdir) diye haykıran kölelikten azad olmuş sahabi.",
    virtues: "Kâbe'nin damına çıkarak ilk ezanı okuyan, Resulullah'ın müezzini.",
    lifeSummary: "Hz. Ebubekir tarafından satın alınıp hürriyetine kavuştu. Efendimiz'in vefatından sonra acısına dayanamayarak Şam'a hicret etti; yıllar sonra Medine'ye geldiğinde okuduğu ezan tüm şehri gözyaşına boğdu.",
    quote: "'Ehad, Ehad! Rabbim bir ve tektir!'"
  }
];
