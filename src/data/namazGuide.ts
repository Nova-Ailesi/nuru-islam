import { NamazTypeInfo } from '../types';

export const ALL_NAMAZ_TYPES: NamazTypeInfo[] = [
  {
    id: "sabah",
    name: "Sabah Namazı",
    category: "vakit",
    timeSlotKey: "imsak",
    totalRakats: 4,
    rakatBreakdown: "2 Rekât Sünnet + 2 Rekât Farz",
    shortDesc: "Günün ilk namazı; sabah alacakaranlığında kılınır. Peygamber Efendimiz (s.a.v.): 'Sabah namazının iki rekât sünneti, dünyadan ve dünyadaki her şeyden daha hayırlıdır' buyurmuştur.",
    importance: "Sabah namazı meleklerin şahit olduğu kutlu bir vakittir.",
    sections: [
      {
        title: "2 Rekât Sünnet",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve İftitah Tekbiri",
            posture: "kiyam",
            instruction: "Kıbleye yönelinir. 'Niyet ettim Allah rızası için bugünkü sabah namazının iki rekât sünnetini kılmaya' diye niyet edilir.",
            maleInstruction: "Eller kulak memesi hizasına kaldırılır, başparmaklar kulak memesine değer, avuç içleri kıbleye bakar. 'Allahu Ekber' denilerek eller göbek altında bağlanır (sağ el sol bileği kavrar).",
            femaleInstruction: "Eller omuz hizasına kaldırılır, parmaklar birbirine bitişiktir ve göğse doğru açılır. 'Allahu Ekber' denilerek eller göğüs üstünde bağlanır (sağ el sol elin üzerinde durur, bilek kavranmaz).",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Allâhu Ekber",
            meaning: "Allah en büyüktür.",
            audioPrompt: "Allahu Ekber"
          },
          {
            stepNumber: 2,
            rakat: 1,
            title: "Kıyam ve Kıraat (1. Rekât)",
            posture: "kiyam",
            instruction: "Ayakta dik durularak sırasıyla Sübhâneke, Eûzü-Besmele, Fâtiha Sûresi ve bir Zammı Sûre (örn. Fîl veya İhlâs Sûresi) okunur.",
            arabicText: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ... بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ... قُلْ هُوَ اللَّهُ أَحَدٌ",
            transliteration: "Sübhânekellâhümme... Eûzü billâhimineş-şeytânirracîm Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'âlemîn... Kul hüvellâhü ehad...",
            meaning: "Sübhaneke okunur, ardından Euzü-Besmele çekilip Fatiha ve zammı sure okunur.",
            audioPrompt: "Sübhânekellâhümme ve bihamdik ve tebârakes-mük ve teâlâ ceddük ve lâ ilâhe gayrük. Eûzü billâhimineşşeytânirracîm. Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'büdü ve iyyâke nesteîn. İhdinassırâtal müstakîm. Sırâtallezîne en'amte aleyhim gayrilmağdûbi aleyhim veleddâllîn. Âmîn. Bismillâhirrahmânirrahîm. Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad."
          },
          {
            stepNumber: 3,
            rakat: 1,
            title: "Rükû ve Tesbih",
            posture: "ruku",
            instruction: "'Allahu Ekber' denilerek rükûya eğilinir. Sırt düz tutulur ve 3 defa 'Sübhâne Rabbiyel-Azîm' denilir.",
            maleInstruction: "Erkekler sırtı tam yatay düz yapar, parmakları açık şekilde diz kapaklarını kavrar, dirsekler gergin tutulur.",
            femaleInstruction: "Kadınlar erkekler kadar fazla eğilmez (meyilli durur), dizler hafif bükülür, parmaklar bitişik şekilde dizlerin üzerine konur.",
            arabicText: "سُبْحَانَ رَبِّيَ الْعَظِيمِ (٣ مَرَّاتٍ)",
            transliteration: "Sübhâne Rabbiyel-'Azîm (3 defa)",
            meaning: "Büyük olan Rabbimi her türlü eksiklikten tenzih ederim.",
            audioPrompt: "Allahu Ekber. Sübhâne Rabbiyel Azîm. Sübhâne Rabbiyel Azîm. Sübhâne Rabbiyel Azîm."
          },
          {
            stepNumber: 4,
            rakat: 1,
            title: "Kavme (Rükûdan Doğrulma)",
            posture: "kavme",
            instruction: "'Semiallâhu limen hamideh' denilerek doğrulunur ve tam dik durulduğunda 'Rabbenâ lekel-hamd' denilir.",
            arabicText: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۖ رَبَّنَا لَكَ الْحَمْدُ",
            transliteration: "Semiallâhu limen hamideh. Rabbenâ lekel-hamd.",
            meaning: "Allah, kendisine hamd edeni işitir. Ey Rabbimiz! Hamd ancak Sanadır.",
            audioPrompt: "Semiallâhu limen hamideh. Rabbenâ lekel hamd."
          },
          {
            stepNumber: 5,
            rakat: 1,
            title: "1. ve 2. Secde",
            posture: "secde",
            instruction: "'Allahu Ekber' denilerek sırasıyla dizler, eller, burun ve alın yere konur. 3 defa 'Sübhâne Rabbiyel-A'lâ' denilir. Tekbirle oturulur (Celse), ardından ikinci secdeye varılıp tekrar 3 defa tesbih edilir.",
            maleInstruction: "Erkekler karınlarını uyluklarından, kollarını yanlarından ve dirseklerini yerden ayrı tutar. Ayak parmak uçları kıbleye dönüktür.",
            femaleInstruction: "Kadınlar secde ederken kollarını yanlarına bitiştirir ve dirseklerini yere koyarlar. Karın uyluklara bitişir; daha derli toplu ve kapalı durulur.",
            arabicText: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ (٣ مَرَّاتٍ)",
            transliteration: "Sübhâne Rabbiyel-A'lâ (3 defa)",
            meaning: "En yüce olan Rabbimi her türlü noksanlıktan tenzih ederim.",
            audioPrompt: "Allahu Ekber. Sübhâne Rabbiyel A'lâ. Sübhâne Rabbiyel A'lâ. Sübhâne Rabbiyel A'lâ. Allahu Ekber. Allahu Ekber. Sübhâne Rabbiyel A'lâ. Sübhâne Rabbiyel A'lâ. Sübhâne Rabbiyel A'lâ."
          },
          {
            stepNumber: 6,
            rakat: 2,
            title: "2. Rekât Kıyam ve Kıraat",
            posture: "kiyam",
            instruction: "'Allahu Ekber' denilerek ayağa kalkılır. Besmele çekilir, Fatiha ve farklı bir zammı sure (örn. Felak veya Kâfirûn) okunur.",
            arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ... الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            transliteration: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'âlemîn... Kul e'ûzü birabbil-felak...",
            meaning: "Fatiha ve zammı sure okunur.",
            audioPrompt: "Allahu Ekber. Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'büdü ve iyyâke nesteîn. İhdinassırâtal müstakîm. Sırâtallezîne en'amte aleyhim gayrilmağdûbi aleyhim veleddâllîn. Âmîn. Bismillâhirrahmânirrahîm. Kul e'ûzü birabbil felak. Min şerri mâ halak. Ve min şerri gâsikın izâ vekab. Ve min şerrin-neffâsâti fil ukad. Ve min şerri hâsidin izâ hased."
          },
          {
            stepNumber: 7,
            rakat: 2,
            title: "2. Rekât Rükû ve Secdeler",
            posture: "secde",
            instruction: "'Allahu Ekber' ile rükûya varılır (3x Sübhâne Rabbiyel-Azîm), doğrulunur ve ardından 2 secde yapılır (her birinde 3x Sübhâne Rabbiyel-A'lâ).",
            arabicText: "سُبْحَانَ رَبِّيَ الْعَظِيمِ ... سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
            transliteration: "Rükû ve iki secde usulünce tamamlanır.",
            meaning: "Rükû ve secdeler tamamlanarak son oturuşa geçilir.",
            audioPrompt: "Allahu Ekber. Sübhâne Rabbiyel Azîm (üç kez). Semiallâhu limen hamideh, Rabbenâ lekel hamd. Allahu Ekber. Sübhâne Rabbiyel A'lâ (üç kez). Allahu Ekber. Allahu Ekber. Sübhâne Rabbiyel A'lâ (üç kez)."
          },
          {
            stepNumber: 8,
            rakat: 2,
            title: "Ka'de-i Âhire (Son Oturuş)",
            posture: "kade",
            instruction: "Secdeden sonra oturulur. Sırasıyla Ettehiyyâtü, Allâhümme Salli, Allâhümme Bârik ve Rabbenâ Âtinâ - Rabbenâğfirlî duaları okunur.",
            maleInstruction: "Erkekler sol ayağını yatırıp üzerine oturur, sağ ayak parmaklarını kıbleye doğru dik tutar (iftirâş).",
            femaleInstruction: "Kadınlar her iki ayaklarını sağ tarafa çıkararak kalça üzerine otururlar (teverrük).",
            arabicText: "التَّحِيَّاتُ لِلَّهِ ... اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ ... رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
            transliteration: "Ettehiyyâtü lillâhi... Allâhümme salli... Allâhümme bârik... Rabbenâ âtinâ... Rabbenâğfirlî...",
            meaning: "Son oturuş duaları ve selam öncesi bağışlanma niyazı.",
            audioPrompt: "Ettehiyyâtü lillâhi ves-salevâtü vet-tayyibât. Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berekâtüh. Esselâmü aleynâ ve alâ ibâdillâhis-sâlihîn. Eşhedü el lâ ilâhe illallâh ve eşhedü enne Muhammeden abdühû ve rasûlüh. Allâhümme salli alâ Muhammedin ve alâ âli Muhammed. Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed. Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhireti haseneten ve kınâ azâbennâr. Rabbenagfir lî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hisâb."
          },
          {
            stepNumber: 9,
            rakat: 2,
            title: "Selâm Verme",
            posture: "selam_sag",
            instruction: "Önce baş sağ omuza çevrilerek 'Esselâmü aleyküm ve rahmetullâh' denilir, ardından sol omuza çevrilerek aynı şekilde selâm verilir ve sünnet tamamlanır.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Esselâmü 'aleyküm ve rahmetullâh (Sağa ve Sola)",
            meaning: "Allah'ın selâmı ve rahmeti üzerinize olsun.",
            audioPrompt: "Esselâmü aleyküm ve rahmetullâh. Esselâmü aleyküm ve rahmetullâh."
          }
        ]
      },
      {
        title: "2 Rekât Farz",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Kamet ve Niyet",
            posture: "kiyam",
            instruction: "Erkekler farza başlarken kamet getirir. 'Niyet ettim Allah rızası için bugünkü sabah namazının iki rekât farzını kılmaya' denilerek tekbir alınır.",
            maleInstruction: "Kamet getirilir: 'Allahu Ekber Allahu Ekber... Kad kametis-salah'. Eller kulaklara kaldırılır ve göbek altında bağlanır.",
            femaleInstruction: "Kadınlar kamet getirmez, niyet eder, ellerini göğüs hizasına kaldırıp tekbir alarak ellerini göğüste bağlar.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Allâhu Ekber",
            meaning: "Allah en büyüktür.",
            audioPrompt: "Allahu Ekber"
          },
          {
            stepNumber: 2,
            rakat: 1,
            title: "1. Rekât Kıraat, Rükû ve Secdeler",
            posture: "kiyam",
            instruction: "Sübhâneke, Eûzü-Besmele, Fâtiha ve bir zammı sure okunur. Rükûya eğilinir (3x Sübhâne Rabbiyel-Azîm), doğrulunur ve 2 secde (3x Sübhâne Rabbiyel-A'lâ) yapılır.",
            arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ...",
            transliteration: "Kıyam, rükû ve secdeler yerine getirilir.",
            meaning: "Farzın ilk rekâtı tamamlanır.",
            audioPrompt: "Sübhâneke, Fâtiha ve Zammı sûre okunur. Rükû ve iki secde usulünce eda edilir."
          },
          {
            stepNumber: 3,
            rakat: 2,
            title: "2. Rekât Kıraat, Rükû, Secdeler ve Son Oturuş",
            posture: "kade",
            instruction: "2. rekâta kalkılır. Besmele, Fatiha ve zammı sure okunur. Rükû ve secdelerden sonra Ka'de-i Âhire'ye oturulur.",
            arabicText: "التَّحِيَّاتُ ... صَلِّ ... بَارِكْ ... رَبَّنَا ...",
            transliteration: "Ettehiyyâtü, Salli-Bârik, Rabbenâ duaları okunur.",
            meaning: "Tüm dualar huşu ile okunur.",
            audioPrompt: "Ettehiyyâtü, Allâhümme Salli, Allâhümme Bârik ve Rabbenâ duaları okunur."
          },
          {
            stepNumber: 4,
            rakat: 2,
            title: "Selâm ve Tesbihat",
            posture: "selam_sag",
            instruction: "Sağa ve sola selâm verilerek farz tamamlanır. 'Allâhümme ente's-selâm ve minke's-selâm tebârakte yâ zel-celâli vel-ikrâm' denir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Esselâmü aleyküm ve rahmetullâh.",
            meaning: "Namaz tamamlandı. Tesbihat ve dua vakti.",
            audioPrompt: "Esselâmü aleyküm ve rahmetullâh. Esselâmü aleyküm ve rahmetullâh. Allâhümme ente's-selâm ve minke's-selâm tebârakte yâ zel-celâli vel-ikrâm."
          }
        ]
      }
    ]
  },
  {
    id: "ogle",
    name: "Öğle Namazı",
    category: "vakit",
    timeSlotKey: "ogle",
    totalRakats: 10,
    rakatBreakdown: "4 İlk Sünnet + 4 Farz + 2 Son Sünnet",
    shortDesc: "Güneşin tepe noktasını aşıp batıya meyletmesiyle başlar. Toplam 10 rekâttır.",
    importance: "Günün tam ortasında dünya meşgalelerinden sıyrılıp huzur-u ilahiye durma anıdır.",
    sections: [
      {
        title: "4 Rekât İlk Sünnet",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve 1-2. Rekâtlar",
            posture: "kiyam",
            instruction: "Niyet edilir: 'Niyet ettim Allah rızası için bugünkü öğle namazının ilk sünnetini kılmaya'. 1. rekâtta Sübhaneke, Fatiha ve zammı sure; rükû ve secdeler yapılır. 2. rekâtta Besmele, Fatiha ve zammı sure; rükû ve secdelerden sonra ilk oturuşa oturulur.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "İlk 2 rekât kılınır ve ilk oturuşa oturulur.",
            meaning: "1 ve 2. rekatlar eda edilir.",
            audioPrompt: "Niyet edilir ve tekbir alınır. 1. ve 2. rekâtlar rükû ve secdeleriyle tamamlanır."
          },
          {
            stepNumber: 2,
            rakat: 2,
            title: "İlk Oturuş (Ka'de-i Ûlâ)",
            posture: "kade",
            instruction: "Öğle namazı ilk sünnetinin ilk oturuşunda SADECE Ettehiyyâtü duası okunur. Hemen ardından 'Allahu Ekber' denilerek 3. rekâta kalkılır.",
            arabicText: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...",
            transliteration: "Sadece Ettehiyyâtü okunur.",
            meaning: "Yalnızca teşehhüd okunup 3. rekâta ayağa kalkılır.",
            audioPrompt: "Ettehiyyâtü okunur ve tekbir ile 3. rekâta kalkılır."
          },
          {
            stepNumber: 3,
            rakat: 3,
            title: "3 ve 4. Rekâtlar (Zammı Sureli)",
            posture: "kiyam",
            instruction: "Öğle namazı ilk sünneti müekked sünnet olduğu için 3. rekâta kalkınca Sübhaneke okunmaz; Besmele çekilir, Fâtiha ve Zammı Sûre okunur. Rükû ve secdeler yapılır. 4. rekâtta da Besmele, Fatiha ve Zammı Sûre okunup rükû ve secdeler eda edilir.",
            arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ...",
            transliteration: "3. ve 4. rekâtlarda Fâtiha ve zammı sûre okunur.",
            meaning: "İlk sünnetin son iki rekâtı tamamlanır.",
            audioPrompt: "3. ve 4. rekâtlar zammı sureleri, rükû ve secdeleriyle yerine getirilir."
          },
          {
            stepNumber: 4,
            rakat: 4,
            title: "Son Oturuş ve Selâm",
            posture: "selam_sag",
            instruction: "Son oturuşta Ettehiyyâtü, Allâhümme Salli, Allâhümme Bârik ve Rabbenâ duaları okunur. Sağa ve sola selâm verilerek 4 rekât ilk sünnet bitirilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Esselâmü aleyküm ve rahmetullâh.",
            meaning: "4 rekât sünnet tamamlandı.",
            audioPrompt: "Dualar okunur, sağa ve sola selâm verilerek ilk sünnet bitirilir."
          }
        ]
      },
      {
        title: "4 Rekât Farz",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Kamet, Niyet ve 1-2. Rekâtlar",
            posture: "kiyam",
            instruction: "Kamet getirilir (erkekler). 'Niyet ettim Allah rızası için bugünkü öğle namazının 4 rekât farzını kılmaya'. 1. rekât: Sübhaneke, Fatiha, Zammı sure. 2. rekât: Besmele, Fatiha, Zammı sure.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Farzın ilk iki rekâtı zammı sureli kılınır.",
            meaning: "Farz namaza başlanır.",
            audioPrompt: "Kamet getirilir, niyet edilerek 1. ve 2. rekâtlar kılınır."
          },
          {
            stepNumber: 2,
            rakat: 2,
            title: "İlk Oturuş (Sadece Ettehiyyâtü)",
            posture: "kade",
            instruction: "2. rekâtın secdelerinden sonra oturulur ve yalnızca Ettehiyyâtü okunup tekbir ile 3. rekâta kalkılır.",
            arabicText: "التَّحِيَّاتُ لِلَّهِ ...",
            transliteration: "Ettehiyyâtü lillâhi...",
            meaning: "İlk oturuş tamamlanır.",
            audioPrompt: "Ettehiyyâtü okunur ve 3. rekâta kalkılır."
          },
          {
            stepNumber: 3,
            rakat: 3,
            title: "3 ve 4. Rekâtlar (ÖNEMLİ: Sadece Fâtiha!)",
            posture: "kiyam",
            instruction: "DİKKAT: Farz namazların 3. ve 4. rekâtlarında ZAMMI SÛRE OKUNMAZ! Sadece Besmele ve Fâtiha Sûresi okunur. Rükû ve secdeler yapılarak 4. rekât sonunda son oturuşa oturulur.",
            arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ... الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            transliteration: "3. ve 4. rekâtlarda yalnızca Fâtiha okunur.",
            meaning: "Farzlarda 3 ve 4. rekâtta zammı sure okunmaz.",
            audioPrompt: "Farz namazın 3. ve 4. rekâtlarında yalnız Fâtiha okunur. Zammı sure okunmaz."
          },
          {
            stepNumber: 4,
            rakat: 4,
            title: "Son Oturuş ve Selâm",
            posture: "selam_sag",
            instruction: "Ettehiyyâtü, Salli-Bârik, Rabbenâ Âtinâ ve Rabbenâğfirlî okunur. Sağa ve sola selâm verilerek 4 rekât farz eda edilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Esselâmü aleyküm ve rahmetullâh.",
            meaning: "Öğle namazı farzı tamamlandı.",
            audioPrompt: "Dualar okunup selam verilir."
          }
        ]
      },
      {
        title: "2 Rekât Son Sünnet",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "2 Rekât Son Sünnet Kılınışı",
            posture: "kiyam",
            instruction: "'Niyet ettim Allah rızası için bugünkü öğle namazının iki rekât son sünnetini kılmaya'. Tıpkı sabah namazının sünneti gibi 2 rekât kılınır ve selam verilir.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "2 rekât son sünnet kılınır.",
            meaning: "Öğle namazı 10 rekât ile tamamlanır.",
            audioPrompt: "2 rekât son sünnet eda edilerek öğle namazı tamamlanır."
          }
        ]
      }
    ]
  },
  {
    id: "ikindi",
    name: "İkindi Namazı",
    category: "vakit",
    timeSlotKey: "ikindi",
    totalRakats: 8,
    rakatBreakdown: "4 Sünnet + 4 Farz",
    shortDesc: "Gündüzün akşama yaklaştığı vakitte kılınır. Toplam 8 rekâttır. İlk sünneti gayr-i müekked sünnettir (ilk oturuşta Salli-Barik okunur).",
    importance: "Kur'an'da 'Orta namaza (Salât-ı Vüstâ) dikkat edin' buyrulan namaz ekseriyetle ikindi namazıdır.",
    sections: [
      {
        title: "4 Rekât Sünnet (Gayr-i Müekked)",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve 1-2. Rekâtlar",
            posture: "kiyam",
            instruction: "Niyet: 'Niyet ettim Allah rızası için bugünkü ikindi namazının sünnetini kılmaya'. 1 ve 2. rekâtlar kılınır.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Niyet ve ilk 2 rekât.",
            meaning: "Gayr-i müekked sünnete başlanır.",
            audioPrompt: "Niyet edilir, ilk 2 rekat tamamlanıp oturulur."
          },
          {
            stepNumber: 2,
            rakat: 2,
            title: "İlk Oturuşta Salli ve Bârik Okunur!",
            posture: "kade",
            instruction: "ÖNEMLİ KURAL: İkindi sünneti gayr-i müekked olduğu için ilk oturuşta Ettehiyyâtü'den sonra ALLAHÜMME SALLİ ve ALLAHÜMME BÂRİK duaları da okunur!",
            arabicText: "التَّحِيَّاتُ ... اللَّهُمَّ صَلِّ ... اللَّهُمَّ بَارِكْ ...",
            transliteration: "Ettehiyyâtü + Salli + Bârik okunur.",
            meaning: "İlk oturuşta peygamberimize salavat getirilir.",
            audioPrompt: "İkindi sünnetinde ilk oturuşta Ettehiyyâtü, Salli ve Bârik duaları okunur."
          },
          {
            stepNumber: 3,
            rakat: 3,
            title: "3. Rekâta Kalkışta Sübhâneke Okunur!",
            posture: "kiyam",
            instruction: "3. rekâta kalkıldığında Sübhâneke okunur, ardından Eûzü-Besmele, Fâtiha ve zammı sûre okunur. 4. rekâtta Besmele, Fatiha ve zammı sure okunup son oturuşta selam verilir.",
            arabicText: "سُبْحَانَكَ اللَّهُمَّ ...",
            transliteration: "3. rekât başında Sübhâneke okunur.",
            meaning: "3. rekât sanki yeni namaza başlar gibi Sübhâneke ile başlar.",
            audioPrompt: "3. rekâta kalkınca Sübhâneke okunur, Fatiha ve zammı sure ile namaz tamamlanır."
          }
        ]
      },
      {
        title: "4 Rekât Farz",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "4 Rekât Farz Kılınışı",
            posture: "kiyam",
            instruction: "Tıpkı öğle namazının farzı gibi kılınır: İlk oturuşta sadece Ettehiyyâtü okunur; 3. ve 4. rekâtlarda yalnızca Fâtiha okunur (zammı sûre okunmaz).",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "4 rekât farz eda edilir.",
            meaning: "İkindi namazının farzı yerine getirilir.",
            audioPrompt: "İkindi namazı farzı, öğle farzı gibi 3 ve 4. rekatlarda sadece Fatiha ile kılınır."
          }
        ]
      }
    ]
  },
  {
    id: "aksam",
    name: "Akşam Namazı",
    category: "vakit",
    timeSlotKey: "aksam",
    totalRakats: 5,
    rakatBreakdown: "3 Farz + 2 Sünnet",
    shortDesc: "Güneşin batmasıyla başlar. Vakti kısa olduğundan önce 3 rekât Farz, ardından 2 rekât Sünnet kılınır.",
    importance: "Günün gündüz defterinin kapanıp gece ibadetlerinin başladığı müstesna bir vakittir.",
    sections: [
      {
        title: "3 Rekât Farz (Önce Farz Kılınır!)",
        rakats: 3,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve 1-2. Rekâtlar",
            posture: "kiyam",
            instruction: "Kamet getirilir. 'Niyet ettim Allah rızası için bugünkü akşam namazının 3 rekât farzını kılmaya'. 1. rekât: Sübhaneke, Fatiha, Zammı sure. 2. rekât: Besmele, Fatiha, Zammı sure.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Akşam farzına başlanır.",
            meaning: "İlk iki rekat zammı sureli kılınır.",
            audioPrompt: "Niyet edilir ve ilk iki rekât kılınır."
          },
          {
            stepNumber: 2,
            rakat: 2,
            title: "İlk Oturuş (Sadece Ettehiyyâtü)",
            posture: "kade",
            instruction: "2. rekât secdelerinden sonra oturulur. Sadece Ettehiyyâtü okunur ve hemen 'Allahu Ekber' denilerek 3. rekâta kalkılır.",
            arabicText: "التَّحِيَّاتُ لِلَّهِ ...",
            transliteration: "Ettehiyyâtü okunur.",
            meaning: "İlk oturuş tamamlanır.",
            audioPrompt: "Ettehiyyâtü okunur ve 3. rekâta ayağa kalkılır."
          },
          {
            stepNumber: 3,
            rakat: 3,
            title: "3. Rekât (Sadece Fâtiha) ve Son Oturuş",
            posture: "kade",
            instruction: "3. rekâtta Besmele ve SADECE FÂTİHA okunur. Zammı sure okunmaz. Rükû ve secdelerden sonra Ka'de-i Âhire'ye oturulur; Ettehiyyâtü, Salli-Bârik ve Rabbenâ duaları okunup selâm verilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "3. rekât sonunda selam verilir.",
            meaning: "3 rekât farz tamamlanır.",
            audioPrompt: "3. rekâtta yalnız Fatiha okunur, rükû ve secdeden sonra dualarla selâm verilir."
          }
        ]
      },
      {
        title: "2 Rekât Sünnet",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "2 Rekât Sünnet Kılınışı",
            posture: "kiyam",
            instruction: "Tıpkı sabah namazının sünneti gibi 2 rekât kılınarak selam verilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "2 rekât sünnet eda edilir.",
            meaning: "Akşam namazı 5 rekât ile tamamlanır.",
            audioPrompt: "2 rekât sünnet eda edilerek akşam namazı tamamlanır."
          }
        ]
      }
    ]
  },
  {
    id: "yatsi",
    name: "Yatsı Namazı & Vitir",
    category: "vakit",
    timeSlotKey: "yatsi",
    totalRakats: 13,
    rakatBreakdown: "4 İlk Sünnet + 4 Farz + 2 Son Sünnet + 3 Vitir Vacip",
    shortDesc: "Günün son vakit namazıdır. 4 ilk sünnet, 4 farz, 2 son sünnet ve 3 rekât Kunut dualı Vitir namazından oluşur.",
    importance: "Peygamber Efendimiz (s.a.v.): 'Kim yatsı namazını cemaatle kılarsa gecenin yarısını ihya etmiş gibi olur' buyurmuştur.",
    sections: [
      {
        title: "4 Rekât İlk Sünnet",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "İlk Sünnet Kılınışı (Gayr-i Müekked)",
            posture: "kiyam",
            instruction: "İkindi namazının sünneti gibidir: İlk oturuşta Ettehiyyâtü'den sonra Salli-Barik okunur; 3. rekâta kalkınca Sübhaneke ile başlanır.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "4 rekât ilk sünnet eda edilir.",
            meaning: "Yatsının ilk sünneti tamamlanır.",
            audioPrompt: "İlk oturuşta Salli ve Bârik, 3. rekât başında Sübhâneke okunur."
          }
        ]
      },
      {
        title: "4 Rekât Farz",
        rakats: 4,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "4 Rekât Farz Kılınışı",
            posture: "kiyam",
            instruction: "Öğle namazı farzı gibi kılınır: İlk oturuşta sadece Ettehiyyâtü; 3. ve 4. rekâtlarda yalnızca Fâtiha okunur (zammı sure okunmaz).",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "4 rekât farz kılınır.",
            meaning: "Yatsı farzı yerine getirilir.",
            audioPrompt: "Yatsı namazı farzı eda edilir."
          }
        ]
      },
      {
        title: "2 Rekât Son Sünnet",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "2 Rekât Son Sünnet",
            posture: "kiyam",
            instruction: "Sabah namazının sünneti gibi 2 rekât kılınarak selam verilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "2 rekât son sünnet eda edilir.",
            meaning: "Son sünnet tamamlanır.",
            audioPrompt: "2 rekât son sünnet eda edilir."
          }
        ]
      },
      {
        title: "3 Rekât Vitir Vacip Namazı (Kunut Dualı)",
        rakats: 3,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve 1-2. Rekâtlar",
            posture: "kiyam",
            instruction: "'Niyet ettim Allah rızası için bugünkü vitir vacip namazını kılmaya'. 1. rekât: Sübhaneke, Fatiha, Zammı sure. 2. rekât: Besmele, Fatiha, Zammı sure. İlk oturuşta sadece Ettehiyyâtü okunup kalkılır.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Vitir namazına başlanır.",
            meaning: "İlk iki rekat tamamlanır.",
            audioPrompt: "Vitir vacip namazına niyet edilip ilk iki rekât kılınır."
          },
          {
            stepNumber: 2,
            rakat: 3,
            title: "3. Rekât Kıraati ve Kunut Tekbiri",
            posture: "kiyam",
            instruction: "3. rekâtta Besmele, Fâtiha ve bir Zammı Sûre (örn. İhlâs) okunur. Rükûya GİTMEDEN ÖNCE eller kulaklara kaldırılarak 'Allahu Ekber' denilip tekrar bağlanır (Kunut Tekbiri).",
            arabicText: "اللَّهُ أَكْبَرُ (تَكْبِيرَةُ الْقُنُوتِ)",
            transliteration: "Allâhu Ekber (Kunut Tekbiri)",
            meaning: "Kunut tekbiri alınarak eller tekrar bağlanır.",
            audioPrompt: "Fatiha ve zammı sureden sonra tekbir alınır: Allahu Ekber."
          },
          {
            stepNumber: 3,
            rakat: 3,
            title: "Kunut Duaları 1 ve 2 Okunur",
            posture: "kiyam",
            instruction: "Kıyamda Kunut 1 ('Allâhümme innâ neste'înüke...') ve Kunut 2 ('Allâhümme iyyâke na'büdü...') okunur. Kunut bilmeyenler 'Rabbenâ âtinâ' okuyabilir. Ardından tekbirle rükû ve secdeler yapılır, son oturuşta selam verilir.",
            arabicText: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ ... اللَّهُمَّ إِيَّاكَ نَعْبُدُ ...",
            transliteration: "Kunut duaları okunur.",
            meaning: "Kunut duaları huşu içinde okunur.",
            audioPrompt: "Kunut duaları okunur. Rükû ve secdeler yapılarak namaz selam ile tamamlanır."
          }
        ]
      }
    ]
  },
  {
    id: "cuma",
    name: "Cuma Namazı",
    category: "ozel",
    totalRakats: 10,
    rakatBreakdown: "4 İlk Sünnet + 2 Farz (İmamla) + 4 Son Sünnet + Zuhr-i Ahir",
    shortDesc: "Cuma günleri öğle vakti cemaatle kılınması farz-ı ayn olan mübarek namazdır.",
    importance: "Haftalık bayramımızdır. Hutbe dinlenir ve cemaatle 2 rekât farz kılınır.",
    sections: [
      {
        title: "Cuma Namazı Kılınış Özeti",
        rakats: 10,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Cuma Namazı Aşamaları",
            posture: "kiyam",
            instruction: "1. 4 Rekât İlk Sünnet (Öğle ilk sünneti gibi)\n2. İmamın minberde Cuma Hutbesi irad etmesi ve dinlenmesi\n3. Kamet getirilip İmama uyularak 2 Rekât Farz kılınması\n4. 4 Rekât Son Sünnet kılınması\n5. Zuhr-i Âhir ve Vaktin Sünneti niyetiyle 4 ve 2 rekât kılınabilir.",
            arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ",
            transliteration: "Cuma farzı imama uyularak cemaatle kılınır.",
            meaning: "Cuma namazı cemaatle eda edilir.",
            audioPrompt: "Cuma namazı hutbesi dinlenir, cemaatle 2 rekat farz ve sünnetler eda edilir."
          }
        ]
      }
    ]
  },
  {
    id: "teheccud",
    name: "Teheccüd (Gece) Namazı",
    category: "nafile",
    totalRakats: 2,
    rakatBreakdown: "2 Rekâttan 8 Rekâta Kadar",
    shortDesc: "Yatsıdan sonra bir miktar uyuyup gecenin son üçte birinde kalkılarak kılınan en faziletli nafile namazdır.",
    importance: "Peygamber Efendimiz (s.a.v.): 'Farzlardan sonra en faziletli namaz, gece namazıdır' buyurmuştur.",
    sections: [
      {
        title: "2 Rekât Teheccüd",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Teheccüd Kılınışı",
            posture: "kiyam",
            instruction: "'Niyet ettim Allah rızası için teheccüd namazı kılmaya'. Tıpkı sabah namazının 2 rekât sünneti gibi kılınır. İkişer rekât halinde 4, 6 veya 8 rekâta kadar kılınabilir.",
            arabicText: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
            transliteration: "2 rekât nafile namaz kılınır.",
            meaning: "Gece kalkılarak huşu içinde eda edilir.",
            audioPrompt: "Teheccüd namazı iki rekat kılınarak Cenab-ı Hakk'a iltica edilir."
          }
        ]
      }
    ]
  },
  {
    id: "cenaze",
    name: "Cenaze Namazı",
    category: "ozel",
    totalRakats: 0,
    rakatBreakdown: "4 Tekbir ile Ayakta (Rükû ve Secdesiz)",
    shortDesc: "Vefat eden Müslüman din kardeşi için yapılan duadır. Farz-ı kifayedir. Ayakta 4 tekbir ile kılınır.",
    importance: "Müslümanın Müslüman üzerindeki son vazifesidir.",
    sections: [
      {
        title: "Cenaze Namazı Adımları",
        rakats: 0,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "1. Tekbir ve Sübhâneke",
            posture: "kiyam",
            instruction: "Niyet: 'Allah rızası için namaza, Resulullah için salavata, meyyit (veya meyyite) için duaya uydum hazır olan imama'. İftitah tekbiri alınır. Eller bağlanır. Sübhâneke duası 'Ve celle senâük' ilavesiyle okunur.",
            arabicText: "سُبْحَانَكَ اللَّهُمَّ ... وَتَعَالَىٰ جَدُّكَ وَجَلَّ ثَنَاؤُكَ وَلَا إِلَٰهَ غَيْرُكَ",
            transliteration: "Sübhâneke 've celle senâük' ile okunur.",
            meaning: "1. tekbirden sonra Sübhaneke okunur.",
            audioPrompt: "Allahu Ekber. Sübhâneke duası ve celle senâük ilavesiyle okunur."
          },
          {
            stepNumber: 2,
            rakat: 1,
            title: "2. Tekbir ve Salli-Bârik",
            posture: "kiyam",
            instruction: "Eller kaldırılmadan 2. tekbir alınır: 'Allahu Ekber'. Allâhümme Salli ve Allâhümme Bârik duaları okunur.",
            arabicText: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ ... اللَّهُمَّ بَارِكْ ...",
            transliteration: "Salli ve Bârik okunur.",
            meaning: "Peygamber Efendimiz'e salavat getirilir.",
            audioPrompt: "Allahu Ekber. Allâhümme Salli ve Allâhümme Bârik duaları okunur."
          },
          {
            stepNumber: 3,
            rakat: 1,
            title: "3. Tekbir ve Cenaze Duâsı",
            posture: "kiyam",
            instruction: "Eller kaldırılmadan 3. tekbir alınır: 'Allahu Ekber'. Cenaze duası veya bilmeyenler için 'Rabbenâ âtinâ' ya da Fatiha duası niyetle okunur.",
            arabicText: "اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا ...",
            transliteration: "Cenaze duası okunur.",
            meaning: "Vefat eden din kardeşi ve tüm müminler için af dilenir.",
            audioPrompt: "Allahu Ekber. Cenaze duası veya Rabbenâ atinâ okunur."
          },
          {
            stepNumber: 4,
            rakat: 1,
            title: "4. Tekbir ve Selâm",
            posture: "selam_sag",
            instruction: "4. tekbir alınır: 'Allahu Ekber'. Bir şey okunmadan önce sağa sonra sola 'Esselâmü aleyküm ve rahmetullâh' denilerek selam verilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Sağa ve sola selam verilir.",
            meaning: "Cenaze namazı tamamlanır.",
            audioPrompt: "Allahu Ekber. Sağa ve sola selâm verilerek cenaze namazı tamamlanır."
          }
        ]
      }
    ]
  },
  {
    id: "bayram",
    name: "Bayram Namazı",
    category: "ozel",
    totalRakats: 2,
    rakatBreakdown: "2 Rekât (Zevâid Tekbirli) + Hutbe",
    shortDesc: "Ramazan ve Kurban Bayramı sabahlarında güneş doğup kerahet vakti çıktıktan sonra cemaatle kılınan vacip namazdır.",
    importance: "Müslümanların sevinç gününün ilk toplu ibadetidir; fazladan 6 zevaid tekbiriyle kılınır.",
    sections: [
      {
        title: "2 Rekât Bayram Namazı (Zevâid Tekbirleriyle)",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve İftitah Tekbiri",
            posture: "kiyam",
            instruction: "Niyet: 'Niyet ettim Allah rızası için bugünkü Ramazan/Kurban Bayramı namazını kılmaya, uydum hazır olan imama'. İmamla birlikte 'Allahu Ekber' denilerek eller kulak hizasına kaldırılıp bağlanır.",
            arabicText: "اللَّهُ أَكْبَرُ",
            transliteration: "Allâhu Ekber",
            meaning: "Allah en büyüktür.",
            audioPrompt: "Niyet edilir. İmamla birlikte tekbir alınır: Allahu Ekber."
          },
          {
            stepNumber: 2,
            rakat: 1,
            title: "Sübhâneke ve 1. Rekât 3 Zevâid Tekbiri",
            posture: "kiyam",
            instruction: "İmam ve cemaat içinden Sübhâneke okur. Ardından imam açıktan, cemaat içinden 3 defa tekbir alır:\n1. Tekbirde eller kulaklara kaldırılır ve yana salınır.\n2. Tekbirde eller kaldırılır ve yana salınır.\n3. Tekbirde eller kaldırılır ve göbek altında bağlanır.\nİmam açıktan Fâtiha ve bir zammı sûre okur (A'lâ sûresi sünnettir). Rükû ve 2 secde yapılıp 2. rekâta kalkılır.",
            arabicText: "اللَّهُ أَكْبَرُ (٣ تَكْبِيرَاتِ الزَّوَائِدِ)",
            transliteration: "Üç zevaid tekbiri alınır.",
            meaning: "1 ve 2. tekbirde eller yana salınır, 3. tekbirde bağlanır.",
            audioPrompt: "Sübhâneke okunur. Birinci tekbir: eller yana salınır. İkinci tekbir: eller yana salınır. Üçüncü tekbir: eller bağlanır. Fatiha ve zammı sure dinlenir."
          },
          {
            stepNumber: 3,
            rakat: 2,
            title: "2. Rekât Kıraati ve Rükû Öncesi 3 Zevâid Tekbiri",
            posture: "kiyam",
            instruction: "2. rekâta kalkılınca eller bağlı kalır. İmam açıktan Fâtiha ve zammı sûre (Gâşiye sûresi sünnettir) okur. Sûre bitince RÜKÛYA EĞİLMEDEN ÖNCE 3 zevâid tekbiri alınır:\n1. Tekbirde eller kaldırılır yana salınır.\n2. Tekbirde eller kaldırılır yana salınır.\n3. Tekbirde eller kaldırılır yana salınır.\n4. Tekbirde ('Allahu Ekber') eller kaldırılmadan doğrudan rükûya eğilinir.",
            arabicText: "اللَّهُ أَكْبَرُ (تَكْبِيرَاتُ الرُّكُوعِ)",
            transliteration: "3 zevaid tekbirinden sonra 4. tekbirle rükûya varılır.",
            meaning: "Rükû öncesi tekbirler tamamlanarak rükû ve secdelere geçilir.",
            audioPrompt: "İmam Fatiha ve sureyi okur. Ardından 3 tekbirde eller yana salınır, dördüncü tekbirle rükûya varılır."
          },
          {
            stepNumber: 4,
            rakat: 2,
            title: "Son Oturuş, Selam ve Teşrik Tekbiri",
            posture: "kade",
            instruction: "Rükû ve secdelerden sonra oturulur. Ettehiyyâtü, Salli-Bârik, Rabbenâ okunup selam verilir. Cemaatle birlikte 3 defa Teşrik Tekbiri getirilir: 'Allâhu Ekber, Allâhu Ekber, Lâ ilâhe illallâhu vallâhu Ekber. Allâhu Ekber ve lillâhil-hamd'. Ardından imam hutbe irad eder.",
            arabicText: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
            transliteration: "Selam verilir ve Teşrik Tekbiri getirilir.",
            meaning: "Bayram namazı tamamlanır ve bayram hutbesi dinlenir.",
            audioPrompt: "Dualar okunur, selâm verilir. Cemaatle teşrik tekbirleri getirilerek bayram hutbesi dinlenir."
          }
        ]
      }
    ]
  },
  {
    id: "duha",
    name: "Kuşluk (Duhâ) Namazı",
    category: "nafile",
    totalRakats: 2,
    rakatBreakdown: "2 Rekâttan 8 Rekâta Kadar",
    shortDesc: "Güneşin doğup mızrak boyu yükselmesinden (işrak) sonra öğle kerahet vaktine kadar kılınan bereket namazıdır.",
    importance: "Hadis-i Şerif: 'Her birinizin her bir eklemi için her gün bir sadaka vermesi gerekir. Kuşluk vaktinde kılınan iki rekât namaz bunların hepsinin yerine geçer.'",
    sections: [
      {
        title: "2 Rekât Kuşluk Namazı",
        rakats: 2,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Niyet ve Kılınış",
            posture: "kiyam",
            instruction: "'Niyet ettim Allah rızası için Duhâ (Kuşluk) namazı kılmaya'. Tıpkı sabah namazının 2 rekât sünneti gibi huşu içinde kılınır. 1. rekâtta Şems veya Duhâ sûresi okunması müstehaptır.",
            arabicText: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ",
            transliteration: "2 rekât nafile olarak eda edilir.",
            meaning: "Rızık ve sıhhat şükrü için eda edilir.",
            audioPrompt: "Niyet edilir. 1. ve 2. rekatlar rükû ve secdeleriyle tamamlanarak selam verilir."
          }
        ]
      }
    ]
  },
  {
    id: "evvabin",
    name: "Evvâbîn Namazı",
    category: "nafile",
    totalRakats: 6,
    rakatBreakdown: "2şer Rekât Halinde 6 Rekât",
    shortDesc: "Akşam namazının farz ve sünnetinden sonra kılınan, günahlardan tövbe edip Allah'a yönelenlerin (evvâbîn) namazıdır.",
    importance: "Peygamber Efendimiz (s.a.v.): 'Kim akşam namazından sonra altı rekât nafile namaz kılarsa, on iki senelik nafile ibadet sevabı verilir' buyurmuştur.",
    sections: [
      {
        title: "6 Rekât Evvâbîn",
        rakats: 6,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Kılınış Usulü",
            posture: "kiyam",
            instruction: "İkişer rekât halinde 3 selamla veya dörder rekât halinde kılınabilir. İki rekâtta bir selam vermek daha faziletlidir. Her rekâtta Fâtiha ve bir zammı sûre okunur.",
            arabicText: "إِنَّهُ كَانَ لِلْأَوَّابِينَ غَفُورًا",
            transliteration: "Tevbe ve yöneliş niyetiyle kılınır.",
            meaning: "Allah'a çokça yönelenlerin namazıdır.",
            audioPrompt: "Niyet edilerek ikişer rekat halinde akşamın ardından eda edilir."
          }
        ]
      }
    ]
  },
  {
    id: "sehiv",
    name: "Sehiv Secdesi Rehberi",
    category: "ozel",
    totalRakats: 0,
    rakatBreakdown: "Son Oturuşta Sağa Selam + 2 Secde + Tekrar Oturuş",
    shortDesc: "Namazın farzlarından birinin geciktirilmesi veya vaciplerinden birinin unutularak terk edilmesi veya geciktirilmesi durumunda yapılan telafi secdesidir.",
    importance: "Namazdaki eksikliği telafi eden vacip bir secdedir.",
    sections: [
      {
        title: "Sehiv Secdesi Nasıl Yapılır?",
        rakats: 0,
        steps: [
          {
            stepNumber: 1,
            rakat: 1,
            title: "Son Oturuş ve Sağa Selam",
            posture: "kade",
            instruction: "Namazın son oturuşunda SADECE Ettehiyyâtü duası okunur. Ardından yalnızca SAĞ tarafa 'Esselâmü aleyküm ve rahmetullâh' diye selâm verilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (فَقَطْ لِلْيَمِينِ)",
            transliteration: "Sağ tarafa tek selam verilir.",
            meaning: "Ettehiyyâtü'den sonra yalnızca sağa selam verilir.",
            audioPrompt: "Ettehiyyâtü okunup yalnızca sağ tarafa selam verilir."
          },
          {
            stepNumber: 2,
            rakat: 1,
            title: "2 Telafi Secdesi",
            posture: "secde",
            instruction: "Sağa selamdan sonra ara vermeden 'Allahu Ekber' denilerek secdeye varılır. 3 defa 'Sübhâne Rabbiyel-A'lâ' denir, tekbirle oturulur, tekrar tekbirle ikinci secdeye varılıp 3 defa tesbih edilir.",
            arabicText: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
            transliteration: "İki secde yerine getirilir.",
            meaning: "Hatanın telafisi için iki secde yapılır.",
            audioPrompt: "Allahu Ekber. İki secde peş peşe tesbihleriyle yapılır."
          },
          {
            stepNumber: 3,
            rakat: 1,
            title: "Tekrar Oturuş ve Çift Selam",
            posture: "kade",
            instruction: "İkinci secdeden sonra 'Allahu Ekber' denilerek oturulur. Baştan itibaren Ettehiyyâtü, Allâhümme Salli, Allâhümme Bârik ve Rabbenâ duaları okunur. Önce sağa sonra sola selam verilerek namaz kemale erdirilir.",
            arabicText: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            transliteration: "Tüm dualar okunup sağa ve sola selam verilir.",
            meaning: "Namaz noksansız şekilde tamamlanır.",
            audioPrompt: "Tekrar oturulur, dualar okunup sağa ve sola selam verilerek namaz tamamlanır."
          }
        ]
      }
    ]
  }
];
