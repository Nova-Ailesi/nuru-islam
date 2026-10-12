# Nur-u İslam — Google Play Store Hazırlık & Yayınlama Rehberi

Bu rehber, **Nur-u İslam** projesini hiçbir kodunu bozmadan, en yüksek performans ve güvenilirlikle **Android App Bundle (.aab)** ve **APK** formatında derleyip **Google Play Store**'da yayınlamak için OpenCode, geliştiriciler veya yapay zeka ajanları tarafından adım adım uygulanmak üzere hazırlanmıştır.

---

## 📌 İçindekiler
1. [Temel Prensipler & Projeyi Bozmadan İlerleme Kuralı](#1-temel-prensipler--projeyi-bozmadan-ilerleme-kuralı)
2. [Ön Gereksinimler](#2-ön-gereksinimler)
3. [1. Yöntem: Capacitor ile Yerel Android Paketi (Önerilen)](#3-1-yöntem-capacitor-ile-yerel-android-paketi-önerilen)
4. [2. Yöntem: Bubblewrap / TWA ile Hızlı PWA Paketi](#4-2-yöntem-bubblewrap--twa-ile-hızlı-pwa-paketi)
5. [AndroidManifest.xml ve İzinler](#5-androidmanifestxml-ve-izinler)
6. [İmzalama Anahtarı (Keystore / JKS) Oluşturma](#6-imzalama-anahtarı-keystore--jks-oluşturma)
7. [AAB (Android App Bundle) Derleme](#7-aab-android-app-bundle-derleme)
8. [Google Play Console Adım Adım Yayın Kontrol Listesi](#8-google-play-console-adım-adım-yayın-kontrol-listesi)
9. [Veri Güvenliği (Data Safety) Formu Yanıtları](#9-veri-güvenliği-data-safety-formu-yanıtları)
10. [OpenCode İçin Kritik Kontrol Listesi](#10-opencode-için-kritik-kontrol-listesi)

---

## 1. Temel Prensipler & Projeyi Bozmadan İlerleme Kuralı

- **UI Saflığı Korunmalıdır:** Uygulamanın kullanıcı arayüzüne kesinlikle *"Play Store'dan İndir"*, *"Bizi Google Play'de Değerlendirin"* gibi ticari ibareler **yazılmamalıdır**. Uygulama manevi huşuya uygun, tertemiz bir ibadet rehberi olarak kalmalıdır.
- **Mevcut Web Koduna Dokunulmaz:** Projenin `src/` altındaki React/TypeScript mimarisi tam uyumludur. Android derlemesi, web projesinin çıktısı (`dist/`) üzerine bir sarmalayıcı (wrapper) olarak inşa edilir.
- **Port ve Sunucu Değiştirilmez:** Geliştirme ortamı `port 3000` ve `Vite` konfigürasyonunda kalır.

---

## 2. Ön Gereksinimler

Bilgisayarınızda veya derleme ortamınızda şunların kurulu olduğundan emin olun:
- **Node.js:** v18 veya v20+
- **JDK (Java Development Kit):** OpenJDK 17 veya 21
- **Android Studio:** Hedgehog veya daha yeni sürüm (Android SDK Platform 34+ ve Build-Tools kurulu olmalı)

---

## 3. 1. Yöntem: Capacitor ile Yerel Android Paketi (Önerilen)

Capacitor, modern web uygulamalarını doğrudan saf yerel (native) Android projesine dönüştürür.

### Adım 3.1: Gerekli Paketleri Yükleyin
Proje ana dizininde terminali açın:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Adım 3.2: Web Projesini Derleyin
```bash
npm run build
```
*(Bu komut `dist/` klasörüne optimize edilmiş web varlıklarını çıkarır.)*

### Adım 3.3: Android Platformunu Ekleyin
Proje kökünde zaten hazır olan `capacitor.config.json` dosyasını kullanarak Android platformunu başlatın:
```bash
npx cap add android
```
Bu işlem proje dizininde `android/` klasörünü oluşturur.

### Adım 3.4: Değişiklikleri Senkronize Edin
Her `npm run build` sonrasında Android klasörünü güncellemek için:
```bash
npx cap sync android
```

### Adım 3.5: Android Studio'yu Açın
```bash
npx cap open android
```

---

## 4. 2. Yöntem: Bubblewrap / TWA ile Hızlı PWA Paketi

Eğer Android Studio ile uğraşmadan doğrudan Google'ın resmi TWA (Trusted Web Activity) aracıyla derlemek isterseniz:

```bash
# 1. Bubblewrap CLI aracını global yükleyin
npm install -g @bubblewrap/cli

# 2. PWA manifestinden Android projesini otomatik başlatın
bubblewrap init --manifest=https://[UYGULAMA-DOMAININIZ]/manifest.json

# 3. İmzalı AAB paketini üretin
bubblewrap build
```

---

## 5. AndroidManifest.xml ve İzinler

Capacitor Android projesi oluşturulduğunda, `android/app/src/main/AndroidManifest.xml` dosyasına projemizdeki `play_store/AndroidManifest.xml` dosyasındaki izinleri ekleyin:

1. **Konum İzinleri:**
   `ACCESS_FINE_LOCATION` ve `ACCESS_COARSE_LOCATION` (Diyanet uyumlu vakitler ve Kıble açısı için).
2. **Bildirim İzinleri:**
   `POST_NOTIFICATIONS` ve `SCHEDULE_EXACT_ALARM` (Android 13+ ezan alarmları için).
3. **Sensör & Titreşim:**
   `VIBRATE` (Zikirmatik dokunsal geri bildirimi ve Kıble hizalama titreşimi).
4. **Ekran Uyku Önleme:**
   `WAKE_LOCK` (Canlı İmam rehberinde namaz kılınırken ekranın aniden kararmaması için).

---

## 6. İmzalama Anahtarı (Keystore / JKS) Oluşturma

Google Play'e yükleme yapabilmek için uygulamanın dijital bir sertifika ile imzalanması şarttır.

Terminalde şu komutu çalıştırarak kendi imza anahtarınızı oluşturun:
```bash
keytool -genkey -v -keystore nuruislam-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias nuruislam
```
- **Keystore Parolası:** Güçlü bir şifre belirleyin ve **asla kaybetmeyin**.
- **İsim, Şirket:** Bilgilerinizi girin.
- Oluşan `nuruislam-release-key.jks` dosyasını `android/app/` klasörü içerisine kopyalayın.

---

## 7. AAB (Android App Bundle) Derleme

Google Play artık saf `.apk` yerine optimize edilmiş `.aab` (Android App Bundle) formatını zorunlu tutmaktadır.

### Android Studio Üzerinden:
1. Android Studio'da üst menüden **Build** > **Generate Signed Bundle / APK...** seçeneğine tıklayın.
2. **Android App Bundle** seçeneğini işaretleyip **Next** deyin.
3. Oluşturduğunuz `nuruislam-release-key.jks` dosyasını ve parolanızı girin.
4. **release** varyantını seçin ve **Finish** butonuna basın.
5. Derleme tamamlandığında dosyanız `android/app/release/app-release.aab` konumunda hazır olacaktır!

### Veya Terminalden Tek Komutla:
```bash
cd android
./gradlew bundleRelease
```

---

## 8. Google Play Console Adım Adım Yayın Kontrol Listesi

1. **Google Play Console Hesabı:**
   - [play.google.com/console](https://play.google.com/console) adresine giriş yapın.
   - **Uygulama Oluştur** (Create App) butonuna tıklayın.
   - **Uygulama Adı:** `Nur-u İslam: Namaz & İbadet`
   - **Varsayılan Dil:** Türkçe (tr-TR)
   - **Uygulama Türü:** Uygulama (App)
   - **Ücretsiz/Ücretli:** Ücretsiz (Free)

2. **Mağaza Girişi Metinleri:**
   - `play_store/app-listing-meta.json` dosyasındaki başlık, kısa açıklama ve tam açıklamayı doğrudan kopyalayıp ilgili kutulara yapıştırın.

3. **Grafik Varlıkları:**
   - **Uygulama Simgesi:** 512 x 512 px (PNG formatında, 32-bit renk).
   - **Özellik Grafiği (Banner):** 1024 x 500 px (PNG veya JPEG).
   - **Telefon Ekran Görüntüleri:** En az 2 adet (Örn: 1080 x 2400 px) - Vakitler, Canlı İmam, Kıble, Zikirmatik ekranları.
   - **7 inç ve 10 inç Tablet Ekran Görüntüleri:** (Opsiyonel ama tavsiye edilir).

4. **Hedef Kitle ve İçerik Derecelendirmesi (IARC):**
   - Anketi doldurun: Dini/Eğitim içeriği, şiddet/uygunsuz içerik yok.
   - Sonuç: **3+ / Everyone** (Herkes için uygun).

5. **Gizlilik Politikası (Privacy Policy):**
   - Play Console'da Gizlilik Politikası URL'si alanına `play_store/privacy-policy.md` metnini barındırdığınız web bağlantısını girin (Örn: `https://nuruislam.app/gizlilik` veya bir GitHub Pages linki).

---

## 9. Veri Güvenliği (Data Safety) Formu Yanıtları

Play Console'daki **Veri Güvenliği** formunu doldururken `play_store/data-safety.json` dosyasındaki beyanları esas alın:
- **Konum (Location):**
  - Toplanıyor mu? **Evet** (Yaklaşık ve Kesin Konum).
  - Üçüncü taraflarla paylaşılıyor mu? **Hayır**.
  - Kullanım amacı: **Uygulama İşlevselliği** (Diyanet namaz vakitleri ve Kıble açısı hesaplama).
  - Kullanıcı verilerin silinmesini talep edebilir mi? **Evet** (Uygulama silindiğinde veya izin kapatıldığında veriler anında sıfırlanır).
- **Ses / Mikrofon:**
  - Toplanıyor mu? **Evet** (İsteğe bağlı tecvid telaffuz pratiği).
  - Sunucuya kaydediliyor mu? **Hayır** (Sadece cihazda anlık işlenir).

---

## 10. OpenCode İçin Kritik Kontrol Listesi

OpenCode veya CLI araçları bu projede işlem yaparken:
- [x] `capacitor.config.json` dosyasının root dizinde hazır olduğunu doğrulayın.
- [x] `play_store/AndroidManifest.xml` izinlerinin Android projesine aktarıldığını doğrulayın.
- [x] Kullanıcı arayüzünde "Play Store" ibarelerinin bulunmadığını (`grep -rni "play store" src/`) doğrulayın.
- [x] `npm run build` komutunun hatasız tamamlandığını teyit edin.
- [x] `npx cap sync android` ile en son `dist/` kodunun Android klasörüne kopyalandığını doğrulayın.

Bu adımları izlediğinizde projenin hiçbir özelliği bozulmadan, Google Play Store standartlarında onay alacak kusursuz bir mobil uygulama paketi elde edilir.
