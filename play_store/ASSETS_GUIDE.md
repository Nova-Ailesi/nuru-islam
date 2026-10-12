# Nur-u İslam — Google Play Store Görsel Varlıklar Rehberi (Assets Guide)

Bu doküman, **Nur-u İslam** uygulamasının Google Play Store mağaza sayfasında sergilenecek tüm grafik varlıklarının (ikon, özellik grafiği/banner, ekran görüntüleri) teknik boyutlarını, tasarım kurallarını ve manevi marka kimliğini tanımlar.

---

## 🎨 Marka Kimliği & Renk Paleti

Nur-u İslam'ın görsel dili; İslam mimarisi, huzur veren zümrüt yeşili, derin taş tonları ve sıcak altın/kehribar vurgulardan oluşur:

| Öğe | Renk Kodu (HEX) | Kullanım Alanı |
| :--- | :--- | :--- |
| **Koyu Zümrüt (Primary)** | `#064e3b` | İkon arka planı, ana butonlar, marka rengi |
| **Açık Zümrüt (Accent)** | `#10b981` | Vurgular, aktif sekmeler, onay işaretleri |
| **Altın Kehribar (Amber)** | `#d97706` | Kerahet uyarıları, kıble açısı, hat sanatları |
| **Gece Taşı (Dark Surface)** | `#0c0a09` | Koyu mod arka planı, zarafet ve huşu |
| **Saf Beyaz / Parşömen** | `#f8fafc` | Açık mod, tipografi netliği |

**Tipografi:**
- Latin Başlıklar & Arayüz: `Plus Jakarta Sans`
- Arapça Ayet ve Hat Sanatı: `Amiri`

---

## 📱 1. Uygulama Simgesi (App Icon)

Google Play Store ana listelemesinde ve aramalarda görünecek ana ikon.

- **Boyut:** `512 x 512 piksel`
- **Dosya Formatı:** 32-bit PNG
- **Renk Profili:** sRGB
- **Maksimum Dosya Boyutu:** 1024 KB
- **Şekil / Köşeler:** Düz kare yüklenmelidir. Google Play, köşeleri otomatik olarak dinamik yuvarlak maske (squircle) ile kırpar.
- **Tasarım Konsepti:** 
  - Zümrüt yeşili (`#064e3b`) zemin üzerinde altın sarısı hilal, kubbe silüeti veya 8 köşeli Selçuklu yıldızı motifi.
  - İkonun kenarlarında en az %15 güvenli alan (safe zone) bırakılmalı, kenarlara taşan grafik bulunmamalıdır.
  - İkon üzerinde metin bulunmamalıdır.

---

## 🖼️ 2. Özellik Grafiği / Başlık Görseli (Feature Graphic)

Google Play Store'da uygulamanın en üstünde yer alan ve arama sonuçlarında öne çıkan geniş banner görseli.

- **Boyut:** `1024 x 500 piksel`
- **Dosya Formatı:** JPEG veya 24-bit PNG (alfa kanalsız)
- **Maksimum Dosya Boyutu:** 15 MB
- **Tasarım Rehberi:**
  - **Merkez Odak:** Görselin merkezinde veya sol tarafında zarif bir şekilde *"Nur-u İslam"* logosu ve altında *"Diyanet Uyumlu Namaz & İbadet Rehberi"* alt başlığı yer almalıdır.
  - **Görsel Temalar:** Cami silüeti, Kâbe motifi, zarif hat sanatı veya pusula grafiği.
  - **Güvenli Alan:** Kenarlardan en az 50 piksel içeriye metin yerleştirilmeli; Google Play arayüz butonları (Yükle butonu vb.) görselin alt köşelerine bindiği için önemli grafikler ortaya hizalanmalıdır.

---

## 📸 3. Telefon Ekran Görüntüleri (Phone Screenshots)

Mağaza sayfasında dönüşüm oranını en çok etkileyen görsel unsurdur. En az 4, ideal olarak 8 adet dikey ekran görüntüsü hazırlanmalıdır.

- **En Boy Oranı:** `9:16` veya `16:9` (Dikey / Portrait önerilir)
- **Önerilen Çözünürlük:** `1080 x 2400 piksel` (veya `1080 x 1920 piksel`)
- **Format:** PNG veya JPEG (piksel başına 24 bit)
- **Ekran Görüntüsü Hikaye Akışı (8 Görsel Önerisi):**

| Sıra | Ekran | Üst Başlık (Banner Metni) | Açıklama |
| :---: | :--- | :--- | :--- |
| **1** | Ana Sayfa / Vakitler | **Diyanet Uyumlu Namaz Vakitleri** | 81 il ve ilçeler için kesin vakitler, kerahet ikazları ve geri sayım. |
| **2** | Namaz Rehberi | **Canlı İmam ile Sesli Namaz Kılma** | Rekat rekat sesli yönlendirme, rüku ve secde fıkıh duruşları. |
| **3** | Kıble Pusulası | **Hassas Kıble Pusulası** | Kâbe yönüne kilitlendiğinde titreşimle onay veren canlı pusula. |
| **4** | Zikirmatik | **Akıllı Zikirmatik & Tesbihat** | Dokunsal titreşim geri bildirimi ve kişisel zikir hedefleri. |
| **5** | Kur'an Sûreleri | **Kur'an Sûreleri & Hafız Tilaveti** | Arapça hat, Türkçe meal ve tecvid incelikleri. |
| **6** | Dua Defterim | **Kişisel Dua Defterim & Dua Kartları** | Estetik hat sanatıyla sosyal medyada paylaşılabilir dua kartları. |
| **7** | Hatm-i Şerif | **30 Cüz Hatim & Aile Dağılımı** | Ortaklaşa cüz paylaşımı ve hatim duası takibi. |
| **8** | Diyanet Rehberi | **Muteber Diyanet Fetvaları & Alo 190** | Din İşleri Yüksek Kurulu fetvaları ve tek dokunuşla Alo 190. |

---

## 📱 4. Tablet Ekran Görüntüleri (Tablet Screenshots)

Google Play Store'un tablet arama sonuçlarında ve tablet kullanıcılarına öne çıkarılması için gereklidir:

- **7 inç Tablet:** En az 1 adet `1200 x 1920 piksel` dikey ekran görüntüsü.
- **10 inç Tablet:** En az 1 adet `1600 x 2560 piksel` dikey ekran görüntüsü.

---

## 🚫 Kaçınılması Gereken Hatalar

1. **Telefon Kasası (Mockup) Fazlalığı:** Ekran görüntülerinde çok kalın telefon çerçeveleri kullanmayın; kullanıcı uygulamanın gerçek arayüzünü net görebilmelidir.
2. **Kelimeleri Kenara Yaslama:** Üst başlıklarda metinleri ekran kenarına sıfır yerleştirmeyin; kırpılma riskini önlemek için kenar payı bırakın.
3. **Fiyata veya Derecelendirmeye İlişkin İfadeler:** Google Play politikaları gereği görseller üzerinde *"En iyi uygulama"*, *"1 Numara"*, *"Ücretsiz İndir"* gibi abartılı ifadeler kullanılmamalıdır.
4. **Bulanık Varlıklar:** İkon ve banner dosyaları vektörel kaynaklardan yüksek DPI ile dışa aktarılmalıdır.
