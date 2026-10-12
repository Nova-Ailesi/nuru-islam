export interface DiyanetResource {
  id: string;
  name: string;
  category: 'fetva' | 'kuran' | 'vakit' | 'ansiklopedi' | 'medya';
  url: string;
  description: string;
  officialBadge: string;
  features: string[];
}

export const DIYANET_RESOURCES: DiyanetResource[] = [
  {
    id: "kurul",
    name: "T.C. Diyanet Din İşleri Yüksek Kurulu",
    category: "fetva",
    url: "https://kurul.diyanet.gov.tr",
    officialBadge: "Resmi Fetva Mercii",
    description: "İslam dininin temel kaynakları doğrultusunda güncel dini meseleler hakkında en yetkili fetvaların, kararların ve ilmihal bilgilerinin yer aldığı resmi portal.",
    features: [
      "Güncel fıkhi meseleler ve fetvalar",
      "Kafanıza takılan soruları arama ve sorgulama",
      "Alo 190 Dini Danışma Hattı dijital arşivi",
      "Ramazan, zekat ve kurban ilmihali"
    ]
  },
  {
    id: "kuran_portal",
    name: "Diyanet Kur'an-ı Kerim Portalı",
    category: "kuran",
    url: "https://kuran.diyanet.gov.tr",
    officialBadge: "Resmi Kur'an & Tefsir",
    description: "Diyanet İşleri Başkanlığı'nın resmi Kur'an-ı Kerim metni, meali, 'Kur'an Yolu' tefsiri ve farklı hafızlardan sesli tilavet arşivi.",
    features: [
      "Ayet ayet resmi Diyanet meali",
      "Kur'an Yolu 5 Ciltlik muteber tefsir metinleri",
      "Farklı kıraat imamlarından hatim dinleme",
      "Ayet arama ve fihrist motoru"
    ]
  },
  {
    id: "namaz_vakitleri",
    name: "Diyanet Namaz Vakitleri Portalı",
    category: "vakit",
    url: "https://namazvakitleri.diyanet.gov.tr",
    officialBadge: "Resmi Vakit Takvimi",
    description: "Vakit hesaplama yöntemleri ve tüm dünya şehirleri için Diyanet astronomik hesaplama takvimi.",
    features: [
      "Türkiye'nin 81 ili ve tüm ilçeleri",
      "Yurt dışı 150+ ülke ve binlerce şehir",
      "Kıble saati ve astronomik imsakiye tabloları",
      "Hicri takvim ve dini günler takvimi"
    ]
  },
  {
    id: "islam_ansiklopedisi",
    name: "TDV İslâm Ansiklopedisi (DİA)",
    category: "ansiklopedi",
    url: "https://islamansiklopedisi.org.tr",
    officialBadge: "Türkiye Diyanet Vakfı Muteber Kaynak",
    description: "İslam dünyasının en kapsamlı ve akademik referans eseri. 44 ciltlik dev külliyatın dijital arşivi.",
    features: [
      "Peygamberler, sahabeler ve İslam âlimleri",
      "Fıkıh, tefsir, hadis ve tasavvuf kavramları",
      "İslam tarihi, medeniyeti ve mimarisi",
      "Tamamen ücretsiz, reklamsız ve akademik doğruluk"
    ]
  },
  {
    id: "diyanet_tv",
    name: "Diyanet TV ve Diyanet Radyo",
    category: "medya",
    url: "https://www.diyanet.tv",
    officialBadge: "Resmi Yayın Organı",
    description: "İslam'ın sahih bilgisini doğru üslupla anlatan canlı yayınlar, dini programlar, mukabeleler ve sohbetler.",
    features: [
      "Canlı Diyanet TV ve Diyanet Kur'an Radyo yayını",
      "Çocuklar için dini çizgi filmler ve hikayeler",
      "Cuma hutbeleri ve vaaz arşivi",
      "Hac ve umre canlı yayınları"
    ]
  }
];

export const ALO_190_INFO = {
  title: "Alo 190 Dini Danışma Hattı",
  phone: "190",
  shortDesc: "T.C. Diyanet İşleri Başkanlığı'nın vatandaşların dini konulardaki sorularını doğrudan ilahiyat uzmanlarına sorabildiği resmi ücretsiz danışma hattıdır.",
  workingHours: "Hafta içi ve hafta sonu mesai saatlerinde il ve ilçe müftülükleri bünyesinde hizmet verir.",
  howToCall: "Türkiye'nin her yerinden sabit hat veya cep telefonundan alan kodu çevirmeden doğrudan '190' tuşlanarak aranabilir."
};
