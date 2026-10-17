# Anis Security – yordamchii amniyat

Barnomai kuchak va rojgon: **tekshiri fayl (SHA-256), tekshiri havola (alomathoi phishing), tekshiri parol**.
Hama tahlil dar dastgohi shumo anjom meyobad. Hech chiz ba server firistoda nameshavad.

> **Mohiyat:** Ini antivirus nest. Virusro nest namekunad va hakerro namebandad. Natija faqat ogohi ast, na kafolat.

## 0. APK bedun Android Studio (GitHub Actions)

Agar Android Studio nadored, GitHub APK-ro baroi shumo dar abr (cloud) mesozad. Rojgon ast (baroi loihahoi omma; baroi loihai shakhsi limiti daqiqaho hast, shartho avval tekshir shavad).

1. Dar github.com hisob kushed va **repository-i nav** sozed.
2. Hama fayli ini papkaro (bo papkai `.github`) ba on **upload** kuned. Papkai `.github/workflows` bayad bo hamin nom dar repository bosh.
3. Dar tabi **Actions** -> **Build Anis Security APK** -> **Run workflow**. (Ba'zan kor bo `push` ham megirad.)
4. Taxminan 5-10 daqiqa intizor shaved. Dar okhir dar sahifai kor, qismi **Artifacts**, **Anis-Security-debug-apk** meoyad. Onro zip-i download kuned, andaruni on `Anis-Security-debug.apk` ast.
5. APK-ro ba telefon guzored va nasbro ijoza dihed (Android "manbai nomalum" meporsad: faqat APK-i khudro nasb kuned).

**Ogohi:** ini workflow dar ini mohit test nashudaast. Agar khato dihad, matni khatoro ba man firisted, ta durust kunem.
Ba'zi telefonho baroi APK-i debug "Play Protect" ogohi nishon medihand. Ini baroi barnomai khudsokhta odi ast.

## 1. Dar papka chi hast

```
anis-security/
  .github/workflows/build-apk.yml  <- sokhtani APK dar GitHub
  public/            <- hama fayli sayt/ilova (webDir)
    index.html  style.css  app.js
    manifest.webmanifest  sw.js  icons/  _headers
  capacitor.config.json   <- sozishi APK
  package.json  .gitignore  README.md
```

## 2. Ijroi mahalli (baroi test)

Node.js LTS lozim ast (rojgon). Dar papkai loiha:

```
npx serve public
```

Ya bedun Node: `python3 -m http.server 8080 -d public`. Sahifaro dar `http://localhost:8080` kushed.

## 3. Nasbi PWA dar Android

1. Papkai `public`-ro ba hosting-i HTTPS gundorid (qismi 6).
2. Dar Chrome-i Android sahifaro kushed -> menyu (⋮) -> **Add to Home screen / Install app**.
3. Ilova bedun internet ham kor mekunad (servis-vorker fayl-ro nigoh medorad).

PWA faqat bo HTTPS (ya localhost) kor mekunad.

## 4. APK-i debug (baroi test dar telefoni khud)

Lozim: Node.js LTS va **Android Studio** (rojgon; SDK va JDK-ro nasb mekunad).

```
npm install
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap add android
npx cap sync android
```

Bad az `cap add android`, dar `android/app/src/main/AndroidManifest.xml`, dar tegi `<application ...>` ilova kuned:

```
android:allowBackup="false"
android:usesCleartextTraffic="false"
```

Ilova internetro talab nakunad. Agar `INTERNET`-ro az manifest bardored, avval tekshir kuned, ki ilova dar telefon kor mekunad.

Sokhtani APK:

```
cd android
./gradlew assembleDebug        (Windows: gradlew.bat assembleDebug)
```

Fayl inja meoyad: `android/app/build/outputs/apk/debug/app-debug.apk`

Nasb: telefonro bo USB peyvand kuned (USB debugging roshan) va `adb install -r app-debug.apk` bizaned; ya faylro ba telefon guzored va nasbro ijoza dihed. **Faqat APK-i khudro nasb kuned.**

Baroi `appId` (`com.example.anissecurity`) pesh az release nomi khudro dihed (masalan `tj.nomi-shumo.anis`). Baad az tagir dodan **nametavon** onro dar Google Play tagir dod.

## 5. Release va imzo (signing)

APK-i debug baroi pakhsh nest. Baroi Google Play **AAB** lozim ast.

1. Kalidi imzo sokhted (yak bor):
   ```
   keytool -genkeypair -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
2. **Fayli `.jks` va parolhoro hargiz ba git/GitHub nagozored** (`.gitignore` onro bastaast). Dar ja-i dur va 2 nusxa (masalan flesh + menejeri parol) nigoh dored.
3. Android Studio -> **Build -> Generate Signed App Bundle / APK** -> AAB -> kalidi khudro intikhob kuned.
4. Google Play-da **Play App Signing**-ro roshan kuned: Google kalidi asliro nigoh medorad, shumo faqat kalidi upload.
5. Tekshir: `apksigner verify --verbose fayl.apk` va `aapt dump badging fayl.apk` (bayad `debuggable` nabosh).

Agar kalidi imzoro gum kuned, ilovaro navsozi karda nametavoned. Az in ehtiyot kuned.

## 6. Joygirkunii (hosting)

`public` yak sayti statik ast. Variantho: Cloudflare Pages, Netlify, GitHub Pages (hama niyoi rojgon dorand).
- Fayli `_headers` (CSP va headerhoi amniyat) dar Cloudflare Pages va Netlify kor mekunad. GitHub Pages onro namedihad, vale CSP dar `index.html` ham hast.
- Domeni shakhsi pulaki ast. Sharti rojgon dar kelajak kafolat nadorad: sharthoro az sayti xizmat tekshir kuned.

## 7. Tekshirii amniyat va natijaho

Dar mohiti sokhtan (bedun internet va bedun Android SDK) ini tekshirho guzaronida shud:

| Tekshiri | Natija |
|---|---|
| `node --check` baroi `app.js` va `sw.js` | guzasht |
| `manifest.webmanifest` JSON-i durust | guzasht |
| Justujo: `eval`, `new Function`, `innerHTML`, `document.write`, `fetch` dar kodi ilova, `localStorage` | peyda nashud |
| Skriptho va uslubhoi inline, handlerhoi inline dar HTML | peyda nashud (CSP-i qatii `script-src 'self'; style-src 'self'` kor karda metavonad) |
| Havolahoi berunia dar kod | nest |
| Server-i mahalli: index, css, js, sw, manifest, icons | hama 200 OK, navi durusti MIME |
| Iconhoi PNG (192, 512, maskable) | sarlavha va andoza durust |

**Hanuz test nashudaast:** kor dar brauzer va telefoni voqei, sokhtani APK (SDK nest), skani MobSF, test bo proxy. Onhoro bo checklist-i amniyati Android (MASVS L1) guzaroned.

Test-i dasti: bo havolai `http://1.2.3.4/login@x.com` ya `https://paypal-secure-login.xyz` Tab-i Havola bayad "Khatarnok" nishon dihad; bo paroli `123456` Tab-i Parol bayad "Zaif" nishon dihad.

## 8. Mahdudiyathoi malum

- Skani virus va bazai virusho nest.
- Tekshiri sizdoho (parol) va skaneri headerhoi sayt hanuz nest: server ya kaliti API lozim, brauzer onhoro bevosita namekunad.
- Tekshiri havola faqat shakl-ro mebinad, na mazmuni sayt-ro.

## 9. Narxho

Rojgon: Node.js, Capacitor, Android Studio, hosting-i statik (daraja-i rojgon). Pulaki: domeni shakhsi; hisobi Google Play Developer (yakbora, taxminan $25); xizmathoi server ba qafo.
