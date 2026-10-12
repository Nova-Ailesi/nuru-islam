export interface DuaTemplateItem {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  text: string;
  category: string;
  tags?: string[];
  source: string;
  intention: string;
}

export const DUA_TEMPLATES: DuaTemplateItem[] = [
  {
    id: 'tpl_sabah_duasi',
    title: 'Güne Bereketle Başlama (Sabah Duası)',
    arabicText: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allâhümme bike asbahnâ ve bike emseynâ ve bike nahyâ ve bike nemûtü ve ileyken-nüşûr.",
    text: "Allah'ım! Senin lütfunla sabaha erdik, Senin lütfunla akşama kavuşuruz. Senin inayetinle yaşar, Senin emrinle ölürüz. Dönüş de ancak Sanadır.",
    category: 'Sabah Duaları',
    tags: ['Sabah Duaları', 'Bereket', 'Şükür', 'Günün Başlangıcı'],
    source: 'Tirmizî, Deavât, 13 (Hadîs-i Şerîf)',
    intention: 'Güne Allah\'ın zikriyle uyanmak, kaza ve belalardan korunmak niyetiyle.'
  },
  {
    id: 'tpl_gece_uyku',
    title: 'Gece Huzur ve Emniyet Duası (Yatarken)',
    arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا',
    transliteration: "Bismike Rabbî vada'tü cenbî ve bike erfauhu, fein emsekte nefsî ferhamhâ.",
    text: "Rabbim! Senin isminle yanımı yatağıma koydum ve yine Senin yardımınla kalkarım. Eğer ruhumu alırsan ona merhamet eyle; eğer geri gönderirsen salih kullarını koruduğun gibi onu da muhafaza eyle.",
    category: 'Gece Duaları',
    tags: ['Gece Duaları', 'Uyku', 'Huzur', 'Korunma'],
    source: 'Buhârî, Deavât, 13 (Hadîs-i Şerîf)',
    intention: 'Gece uykusunda vesvese ve kötülüklerden korunmak, afiyetle uyanmak niyetiyle.'
  },
  {
    id: 'tpl_istek_hacet',
    title: 'Hacet ve Murâd Duası (İstekler İçin)',
    arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: "Lâ ilâhe illallâhül-Halîmül-Kerîm, Sübhânallâhi Rabbil-'arşil-'azîm, Elhamdü lillâhi Rabbil-'âlemîn.",
    text: "Hilim ve kerem sahibi Allah'tan başka ilah yoktur. Yüce Arş'ın Rabbi olan Allah'ı noksan sıfatlardan tenzih ederim. Hamd, âlemlerin Rabbi olan Allah'a mahsustur. Allah'ım! Rahmetinin vesilelerini ve mağfiretinin tecellilerini dilerim. Bütün günahlardan selameti, her türlü iyilikten nasiplenmeyi Senden isterim.",
    category: 'İstekler',
    tags: ['İstekler', 'Hacet', 'Dilek', 'Ferahlık'],
    source: 'Tirmizî, Salât, 348 (Hadîs-i Şerîf)',
    intention: 'Dünya ve ahirete ait meşru bir dilek ve muradın husûlü niyetiyle.'
  },
  {
    id: 'tpl_rabbena_atina',
    title: 'Dünya ve Ahiret İyiliği (Rabbenâ Âtinâ)',
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhirati haseneten ve kınâ 'azâben-nâr.",
    text: "Rabbimiz! Bize dünyada da iyilik ve güzellik ver, ahirette de iyilik ve güzellik ver ve bizi cehennem azabından koru.",
    category: 'Sabah Duaları',
    tags: ['Sabah Duaları', 'Gece Duaları', 'İstekler', 'Genel'],
    source: 'Bakara Sûresi, 201. Âyet',
    intention: 'Dünya ve ukbâ saadeti, af ve afiyet niyetiyle.'
  },
  {
    id: 'tpl_rabbena_agfirli',
    title: 'Anne, Baba ve Müminler İçin Mağfiret',
    arabicText: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration: "Rabbenagfir lî ve livâlideyye ve lil-mü'minîne yevme yekûmül-hisâb.",
    text: "Rabbimiz! Hesabın görüleceği günde beni, anne-babamı ve bütün inananları bağışla.",
    category: 'Ailem İçin',
    tags: ['Ailem', 'Bağışlanma', 'Vefa'],
    source: 'İbrâhîm Sûresi, 41. Âyet',
    intention: 'Anne, baba ve cümle müminlerin affı niyetiyle.'
  },
  {
    id: 'tpl_yunus',
    title: 'Darlık ve Kederden Kurtuluş (Hz. Yûnus Duası)',
    arabicText: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliteration: "Lâ ilâhe illâ ente sübhâneke innî küntü minez-zâlimîn.",
    text: "Senden başka hiçbir ilah yoktur. Seni tenzih ederim. Gerçekten ben haksızlık edenlerden oldum.",
    category: 'Şifa & Hacet',
    tags: ['Şifa', 'Hacet', 'Darlık', 'İstekler'],
    source: 'Enbiyâ Sûresi, 87. Âyet',
    intention: 'Gam, keder, sıkıntı ve darlıklardan necat bulma niyetiyle.'
  },
  {
    id: 'tpl_eyyub',
    title: 'Hastalık ve Dertlerden Şifa (Hz. Eyyûb Duası)',
    arabicText: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
    transliteration: "Ennî messeniyez-durru ve ente erhamür-râhimîn.",
    text: "Başıma bu dert geldi. Sen merhametlilerin en merhametlisisin.",
    category: 'Şifa & Hacet',
    tags: ['Şifa', 'Hastalık', 'Sabır'],
    source: 'Enbiyâ Sûresi, 83. Âyet',
    intention: 'Bedenî ve ruhî hastalıklara acil şifa niyetiyle.'
  },
  {
    id: 'tpl_insirah',
    title: 'Gönül Genişliği ve İşlerin Kolaylaşması',
    arabicText: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي',
    transliteration: "Rabbişrah lî sadrî ve yessir lî emrî vahlül 'ukdeten min lisânî.",
    text: "Rabbim! Göğsümü genişlet, işimi bana kolaylaştır, dilimdeki düğümü çöz.",
    category: 'Sabah Duaları',
    tags: ['Sabah Duaları', 'İstekler', 'Ferahlık', 'Başarı'],
    source: 'Tâhâ Sûresi, 25-27. Âyetler',
    intention: 'Zihin açıklığı, işlerin rast gitmesi ve ferahlık niyetiyle.'
  },
  {
    id: 'tpl_seyyidul_istigfar',
    title: 'Tevbelerin Efendisi (Seyyidü\'l-İstiğfar)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
    transliteration: "Allâhümme ente Rabbî lâ ilâhe illâ ente halaktenî ve ene 'abdüke...",
    text: "Allah'ım! Sen benim Rabbimsin, Senden başka ilah yoktur. Beni Sen yarattın, ben Senin kulunum. Gücüm yettiğince Sana verdiğim sözde durmaktayım. Günahımı itiraf eder, bağışlanma dilerim.",
    category: 'Tevbe & İstiğfar',
    tags: ['Tevbe', 'Sabah Duaları', 'Gece Duaları', 'Bağışlanma'],
    source: 'Buhârî, Deavât, 2 (Hadîs-i Şerîf)',
    intention: 'Günahlardan arınma ve cennet ehlinden olma niyetiyle.'
  }
];
