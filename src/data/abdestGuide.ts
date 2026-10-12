import { AbdestStep } from '../types';

export const WUDU_STEPS: AbdestStep[] = [
  {
    order: 1,
    title: "Niyet ve Besmele",
    description: "Kollar dirseklerin yukarısına kadar sıvanır. 'Eûzü billâhi mineş-şeytânirracîm Bismillâhirrahmânirrahîm. Niyet ettim Allah rızası için abdest almaya' denilir.",
    farzOrSunnet: "sunnet",
    duaArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    duaTurkish: "Rahmân ve Rahîm olan Allah'ın adıyla.",
    illustrationKey: "hands_intent"
  },
  {
    order: 2,
    title: "Elleri Yıkamak (Bileklere Kadar)",
    description: "Eller bileklere kadar, parmak araları hilallenerek ve yüzük varsa oynatılarak üçer defa güzelce yıkanır.",
    farzOrSunnet: "sunnet",
    illustrationKey: "wash_hands"
  },
  {
    order: 3,
    title: "Ağıza Su Vermek (Mazmaza)",
    description: "Sağ avuç ile ağza üç defa ayrı ayrı bolca su verilir ve ağız içi çalkalanıp dışarı tükürülür. Oruçlu olunmadığında gargara yapılır.",
    farzOrSunnet: "sunnet",
    illustrationKey: "mouth"
  },
  {
    order: 4,
    title: "Buruna Su Çekmek (İstinşak)",
    description: "Sağ elle buruna üç kere su çekilir, sol elle sümkürülerek burun temizlenir.",
    farzOrSunnet: "sunnet",
    illustrationKey: "nose"
  },
  {
    order: 5,
    title: "Yüzü Yıkamak (FARZ)",
    description: "Alında saçın bittiği yerden çene altına ve iki kulak memesi arasına kadar bütün yüz üç defa yıkanır. Hiç kuru yer bırakılmaz.",
    farzOrSunnet: "farz",
    illustrationKey: "face"
  },
  {
    order: 6,
    title: "Kolları Dirseklerle Beraber Yıkamak (FARZ)",
    description: "Önce sağ kol, sonra sol kol dirseklerin yukarısına kadar üçer defa iyice ovalanarak yıkanır.",
    farzOrSunnet: "farz",
    illustrationKey: "arms"
  },
  {
    order: 7,
    title: "Başı Mesh Etmek (FARZ)",
    description: "Eller yeni bir su ile ıslatılır. Sağ elin içiyle (veya iki elle kaplama yapılarak) başın en az dörtte biri mesh edilir.",
    farzOrSunnet: "farz",
    illustrationKey: "head"
  },
  {
    order: 8,
    title: "Kulakları ve Boynu Mesh Etmek",
    description: "Eller tekrar ıslatılmadan, şehadet parmaklarıyla kulak içleri, başparmaklarla kulak arkaları; elin kalan dış yüzeyleriyle boyun mesh edilir.",
    farzOrSunnet: "sunnet",
    illustrationKey: "ears_neck"
  },
  {
    order: 9,
    title: "Ayakları Topuklarla Beraber Yıkamak (FARZ)",
    description: "Önce sağ ayak, parmak uçlarından başlanıp parmak araları sol elin serçe parmağıyla hilallenerek topuk kemikleriyle beraber yıkanır. Ardından sol ayak aynı şekilde yıkanır.",
    farzOrSunnet: "farz",
    illustrationKey: "feet"
  }
];

export const GHUSL_DATA = {
  title: "Gusül (Boy) Abdesti",
  description: "Cünüplük, hayız ve nifas hallerinden sonra bütün vücudu arındırmak için alınan farz abdesttir.",
  farzlar: [
    { title: "Ağza bolca su vermek (Mazmaza)", desc: "Boğaza kadar ağzın her yerini yıkamak." },
    { title: "Buruna bolca su çekmek (İstinşak)", desc: "Genze kadar suyu çekip burnu temizlemek." },
    { title: "Bütün vücudu yıkamak", desc: "Tepeden tırnağa iğne ucu kadar kuru yer kalmayacak şekilde bütün bedeni yıkamak." }
  ],
  adimlari: [
    "1. 'Eûzü Besmele' çekilir ve 'Niyet ettim Allah rızası için gusül abdesti almaya' denilir.",
    "2. Eller ve avret yerleri yıkanarak temizlenir.",
    "3. Namaz abdesti gibi tam bir abdest alınır.",
    "4. Önce başa 3 defa, sonra sağ omuza 3 defa, sonra sol omuza 3 defa su dökülerek vücut ovulur.",
    "5. Göbek çukuru, kulak kıvrımları, saç ve sakal dipleri dahil kuru yer bırakılmaksızın yıkanılır."
  ]
};

export const TAYAMMUM_DATA = {
  title: "Teyemmüm Abdesti",
  description: "Su bulunamadığında veya hastalık/zaruret sebebiyle su kullanılamadığında temiz toprak veya toprak cinsi bir madde ile alınan manevi abdesttir.",
  farzlar: [
    { title: "1. Niyet etmek", desc: "'Niyet ettim Allah rızası için teyemmüm abdesti almaya' diye kalben ve lisanen niyet edilir." },
    { title: "2. İki vuruş ve mesh", desc: "Elleri temiz toprağa vurup yüzü mesh etmek, ikinci vuruşla kolları dirseklere kadar mesh etmek." }
  ],
  adimlari: [
    "1. Niyet edilir: 'Niyet ettim Allah rızası için namaz kılabilmek üzere teyemmüm almaya'.",
    "2. İki elin içi temiz toprağa veya taşa hafifçe vurulur; eller birbirine vurularak fazla toz silkelenir.",
    "3. İki elin içiyle bütün yüz sıvazlanarak mesh edilir.",
    "4. Eller ikinci defa toprağa vurulur, silkelenir.",
    "5. Sol elin içiyle sağ kolun dışı ve içi dirsekle beraber; sonra sağ elin içiyle sol kol dirsekle beraber mesh edilir."
  ]
};

export const ABDESTI_BOZANLAR = [
  "Ön veya arkadan idrar, dışkı, gaz veya herhangi bir akıntının çıkması.",
  "Vücudun herhangi bir yerinden kan, irin veya sarı suyun akması (yaranın kenarına taşması).",
  "Ağız dolusu kusmak.",
  "Yatarak veya bir yere dayanarak uyumak (uyuklamak değil, şuurun kaybolduğu uyku).",
  "Akıl ve şuuru giderecek derecede bayılmak, delirmek veya sarhoş olmak.",
  "Rükûlu ve secdeli namazlarda yanındakinin duyabileceği şekilde sesli gülmek.",
  "Teyemmüm için: Namaz kılacak miktarda temiz suyun bulunması."
];

export const ABDESTI_BOZMAYANLAR = [
  "Vücuttan çıkan ama akmayıp yerinde kalan az miktar kan.",
  "Ağız dolusu olmayan az kusuntu.",
  "Oturarak namazda hafifçe dalar gibi olup hemen uyanmak.",
  "Ağlamak, gözden yaş gelmesi.",
  "Tırnak kesmek veya saç/sakal tıraşı olmak.",
  "Yara kabuğunun kan akmaksızın düşmesi."
];
