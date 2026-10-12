#!/bin/bash
# ==============================================================================
# Nur-u İslam — Android & Play Store Otomatik Derleme Hazırlık Scripti
# ==============================================================================
set -e

echo "🟢 [1/4] Web projesi derleniyor (npm run build)..."
npm run build

echo "🟢 [2/4] Capacitor bağımlılık kontrolü..."
if ! command -v npx &> /dev/null; then
    echo "❌ npx bulunamadı. Lütfen Node.js ve npm kurun."
    exit 1
fi

echo "🟢 [3/4] Capacitor Android senkronizasyonu başlatılıyor..."
if [ -d "android" ]; then
    npx cap sync android
    echo "✅ Android projesi başarıyla senkronize edildi."
else
    echo "ℹ️ 'android' klasörü henüz bulunamadı. Oluşturmak için: npx cap add android"
fi

echo "🟢 [4/4] Hazırlık tamamlandı!"
echo "👉 Android Studio'da açmak için: npx cap open android"
echo "👉 Tam rehber için: play_store/PLAY_STORE_REHBERI.md"
