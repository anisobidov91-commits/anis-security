# ANIS MON — IMEI Security System

A multilingual React + Vite + Capacitor starter project for ANIS MON.

## Included in this ZIP

- React + TypeScript + Vite application
- Tajik, Russian and English interface
- Responsive premium dark UI
- IMEI 15-digit and Luhn validation
- Demo-only local verification result
- Capacitor Android configuration
- GitHub Actions workflow that builds a debug APK

## Important limitation

This ZIP is a **starter application**, not a completed official police system. It is not connected to any police, government, telecom or national IMEI database. A valid IMEI with no matching demo record is not proof that a phone is safe or legally owned. No actual stolen-phone records are included.

Before real deployment, connect an authorized backend and verified data source. Do not place database service-role keys or secrets in frontend code.

## Build locally

Requirements: Node.js 20+, Java 21, Android SDK.

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

APK output:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Build APK using GitHub Actions

1. Create a GitHub repository named `ANIS-MON`.
2. Extract this ZIP and upload its contents to the repository root.
3. Commit the files to `main` (or `master`).
4. Open the repository's **Actions** tab.
5. Select **Build ANIS MON Android APK**.
6. Click **Run workflow** if it did not start automatically.
7. Wait for the workflow to finish successfully.
8. Open the completed workflow run and download the **ANIS-MON-APK** artifact.
9. Extract the downloaded artifact ZIP to get `ANIS-MON.apk`.

The workflow creates an unsigned debug APK for testing. A production APK should be signed with a private release keystore stored securely in GitHub Actions secrets. Never commit the keystore or passwords.

## App identity

- App name: ANIS MON
- Package ID: `tj.anismon.security`
- Web title: ANIS MON — IMEI Security System
