# Nur-u İslam — Google Play Store Metadata & Teknik Bilgiler

Bu doküman, **Nur-u İslam** uygulamasının Google Play Console'a kaydı, teknik parametreleri, izin gerekçeleri ve Diyanet İşleri Başkanlığı uyumluluk beyanlarını içerir.

---

## 1. Temel Uygulama Bilgileri

| Parametre | Değer |
| :--- | :--- |
| **Resmi Uygulama Adı** | **Nur-u İslam** |
| **Paket Kimliği (Package Name)** | `com.nuruislam.rehber` |
| **Varsayılan Dil** | Türkçe (`tr-TR`) |
| **Desteklenen Diller** | Türkçe (`tr`), İngilizce (`en`), Arapça (`ar`), Almanca (`de`) |
| **Uygulama Türü** | Uygulama (Application) |
| **Birincil Kategori** | Yaşam Tarzı (Lifestyle) |
| **İkincil Kategori** | Kitaplar ve Referans (Books & Reference) / Eğitim (Education) |
| **Fiyatlandırma** | Ücretsiz (Free) - Reklamsiz |
| **İçerik Derecelendirmesi (IARC)** | 3+ (Everyone - Herkes İçin Uygun) |
| **Geliştirici İletişim E-postası** | `iletisim@nuruislam.app` |
| **Geliştirici Web Sitesi** | `https://nuruislam.app` |

---

## 2. Diyanet İşleri Başkanlığı Kaynaklı İçerik & Fıkhi Uyumluluk

Nur-u İslam, sahih dini bilginin korunmasını ve bid'atlerden uzak durulmasını temel ilke kabul eder. İçerik ve hesaplama altyapısı şu muteber kaynaklara dayanır:

1. **Namaz Vakitleri & Takvim:**
   - 81 il ve tüm ilçeler için T.C. Diyanet İşleri Başkanlığı takvimiyle tam uyumlu güneş açısı, imsak ve kerahet hesaplama algoritmaları.
   - Güneş doğuşu, zeval keraheti ve akşam keraheti hesaplamaları fıkıh kaidelerine birebir uygundur.

2. **Kıble Açısı & Kâbe Koordinatları:**
   - Kâbe-i Muazzama'nın coğrafi koordinatları (`21.4225° N, 39.8262° E`) esas alınarak Great-Circle küresel trigonometri formülü ile hesaplanır.

3. **İslami Soru-Cevap & Fetvalar:**
   - T.C. Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu'nun resmi fetvaları referans alınmıştır.
   - Kullanıcıların doğrudan Diyanet Alo 190 Fetva Hattı'na bağlanabilmesi için resmi kanal bilgileri entegre edilmiştir.

4. **Kıraat, Meal & Tefsir:**
   - Sure ve ayet meallerinde Diyanet İşleri Başkanlığı ve Türkiye Diyanet Vakfı onaylı mealler esas alınmıştır.

---

## 3. Hedef SDK ve Android Teknik Uyumluluk

| Alan | Değer | Açıklama |
| :--- | :--- | :--- |
| **Target SDK Version** | `34` (Android 14) | Google Play 2025+ zorunlu gereksinimi (API 35) |
| **|**Compile SDK Version** | `35` | En guncel Android API seti |
| **Min SDK Version** | `24` (Android 7.0 Nougat) | Cihazların %98+'sını kapsar |
| **Version Code** | `1` | İlk sürüm kodu (her güncellemede +1 artar) |
| **Version Name** | `1.0.0` | Semantik sürüm |
| **Desteklenen Mimariler** | `arm64-v8a`, `armeabi-v7a`, `x86_64` | Universal Android desteği |
| **Webview Motoru** | Chromium Modern Webview | Donanım hızlandırmalı CSS/JS |

---

## 4. İzinler ve Google Play Uyumluluk Gerekçeleri

Google Play Console'da beyan edilecek izin listesi ve teknik kullanım gerekçeleri:

### 1. `android.permission.ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`
- **Gerekçe:** Kullanıcının bulunduğu enlem ve boylama göre Diyanet uyumlu 5 vakit namaz saatlerini, imsakiyeyi ve bulunulan noktadan Kâbe-i Muazzama'ya olan manyetik kıble açısını hesaplamak.
- **Gizlilik Notu:** Konum bilgisi yalnızca kullanıcının cihazında yerel olarak işlenir; harici hiçbir sunucuya iletilmez, depolanmaz ve profilleme amacıyla kullanılmaz.

### 2. `android.permission.POST_NOTIFICATIONS` (Android 13+ Uyumlu)
- **Gerekçe:** Ezan vakitleri girdiğinde ve vakit yaklaşırken (15, 30, 45 dk önce) kullanıcıyı uyarmak; günlük zikir ve kandil hatırlatıcılarını iletmek.

### 3. `android.permission.SCHEDULE_EXACT_ALARM` & `USE_EXACT_ALARM`
- **Gerekçe:** Ezan vaktinin bir saniye bile şaşmadan tam zamanında çalabilmesi için işletim sisteminin hassas alarm mekanizmasını kullanmak.

### 4. `android.permission.VIBRATE`
- **Gerekçe:** Zikirmatik tesbihatında dokunsal geri bildirim sağlamak ve Kıble Pusulası Kâbe yönüne tam kilitlendiğinde kullanıcıya titreşimle onay vermek.

### 5. `android.permission.WAKE_LOCK`
- **Gerekçe:** Sesli Namaz Rehberi (Canlı İmam) veya Kur'an tilaveti dinlenirken ekranın aniden kararıp ibadetin bölünmesini önlemek.

### 6. `android.permission.RECORD_AUDIO` (İsteğe Bağlı)
- **Gerekçe:** Sure ve dua okunuşlarında doğru mahreç ve tecvid telaffuzu için yerel konuşma tanıma (SpeechRecognition) analizi yapmak. Ses verisi sunucuya aktarılmaz.

---

## 5. Güvenlik ve Veri Koruma (Data Safety) Özeti

- **Uçtan Uca Şifreleme (HTTPS):** Uygulama içi tüm veri trafiği TLS 1.3 şifrelemesi ile korunur.
- **Sunucu Bağımsızlığı:** Kişisel dua defteri, zikir sayıları, kaza namazı borçları ve tercihler tamamen cihazın kendi yerel hafızasında (`localStorage`) saklanır.
- **Veri Silme Hakkı:** Kullanıcı uygulamayı kaldırdığında veya ayarları sıfırladığında tüm yerel veriler derhal ve kalıcı olarak silinir.
- **Çocuk Güvenliği:** 13 yaş altı çocuklara yönelik özel veri toplama mekanizmaları kesinlikle içermez; aile ve çocuk kullanımına tamamen uygundur.
