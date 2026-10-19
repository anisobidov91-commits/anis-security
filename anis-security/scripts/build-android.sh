#!/usr/bin/env bash
# Builds the debug APK. Run from anywhere: bash anis-security/scripts/build-android.sh
set -euo pipefail
cd "$(dirname "$0")/.."

npm install
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap add android

APPID=$(node -p "require('./capacitor.config.json').appId")
PKGDIR="android/app/src/main/java/$(echo "$APPID" | tr . /)"
mkdir -p "$PKGDIR"
rm -f "$PKGDIR/MainActivity.kt"
sed "s/__APPID__/$APPID/g" native/AppScannerPlugin.java > "$PKGDIR/AppScannerPlugin.java"
sed "s/__APPID__/$APPID/g" native/MainActivity.java > "$PKGDIR/MainActivity.java"

npx cap sync android

M=android/app/src/main/AndroidManifest.xml
sed -i 's/android:allowBackup="true"/android:allowBackup="false"/' "$M"
grep -q 'usesCleartextTraffic' "$M" || sed -i 's/<application/<application android:usesCleartextTraffic="false"/' "$M"
grep -q 'QUERY_ALL_PACKAGES' "$M" || sed -i 's#<application#<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />\n    <application#' "$M"
echo "----- AndroidManifest.xml -----"
cat "$M"
echo "-------------------------------"
ls -la "$PKGDIR"

cd android
chmod +x gradlew
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../Anis-Security-debug.apk
echo "APK ready: $(pwd)/../Anis-Security-debug.apk"
