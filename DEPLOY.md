# InfoPol — Guia de publicació a App Store / Google Play

## Prerequisits

### iOS (App Store)
- Mac amb macOS 13+
- Xcode 15+ instal·lat (gratis a l'App Store de Mac)
- Compte Apple Developer: https://developer.apple.com ($99/any)

### Android (Google Play)
- Android Studio instal·lat: https://developer.android.com/studio (gratis)
- Compte Google Play Console: https://play.google.com/console ($25 únic)
- Java 17+ instal·lat

---

## Cada cop que facis canvis a l'app

### Només contingut (temari, psicotècnics, tests, infraccions…)

**No cal build ni passar per les botigues.** Vegeu [CONTENT.md](CONTENT.md):

```bash
npm run content:build   # genera content/content.json amb la versió +1
npm run content:check   # valida el fitxer
git push -u origin main # les apps instal·lades s'actualitzen soles
```

### Canvis de codi, disseny o pantalles noves

```bash
npm run build          # Compila el web
npx cap sync           # Copia el build a iOS i Android
```

---

## iOS — Publicar a l'App Store

### 1. Obrir el projecte a Xcode
```bash
npm run deploy:ios
# Equivalent a: npm run build && npx cap sync ios && npx cap open ios
```

### 2. Configurar a Xcode
1. Selecciona el target **App** al panell esquerre
2. A **Signing & Capabilities** → escull el teu Team (Apple Developer account)
3. El Bundle Identifier ha de ser: `app.infopol.mossos`
4. Posa la versió i build number que vulguis

### 3. Provar al simulador / dispositiu
- ▶ Play per provar al simulador
- Connecta l'iPhone → selecciona'l com a target → ▶ Play

### 4. Publicar
1. Product → Archive
2. Quan acabi: **Distribute App** → App Store Connect → Upload
3. Ves a https://appstoreconnect.apple.com → completa la fitxa (captures, descripció)
4. Envia per revisió → Apple triga 1–3 dies

---

## Android — Publicar a Google Play

### 1. Obrir el projecte a Android Studio
```bash
npm run deploy:android
# Equivalent a: npm run build && npx cap sync android && npx cap open android
```

### 2. Generar APK / AAB signat
1. Build → **Generate Signed Bundle / APK**
2. Tria **Android App Bundle (.aab)** — és el format que requereix Google Play
3. Crea un nou keystore (guarda'l en un lloc segur!)
4. Compila — genera `release/app-release.aab`

### 3. Publicar a Google Play Console
1. Crea una nova aplicació
2. Ves a **Versiones** → **Producción** → crear nova versió
3. Puja el fitxer `.aab`
4. Completa la fitxa (captures, descripció, classificació d'edat)
5. Envia per revisió → Google triga 1–7 dies

---

## ID de l'aplicació
- **iOS Bundle ID**: `app.infopol.mossos`
- **Android Package**: `app.infopol.mossos`

## Versió actual
- Version: 1.1.0
- Build: 2
