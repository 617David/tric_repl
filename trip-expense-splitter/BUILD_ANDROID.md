# Building Android APK

The Android project has been set up using Capacitor. Due to network restrictions in the build environment, the APK needs to be built on a system with proper internet access.

## Prerequisites

1. **Android Studio** or **Android SDK Command Line Tools**
2. **Java JDK** (version 17 or higher)
3. **Node.js** and **npm**

## Build Instructions

### Option 1: Using Android Studio (Recommended)

1. Install Android Studio from https://developer.android.com/studio

2. Open the Android project:
   ```bash
   cd trip-expense-splitter
   ```

3. In Android Studio:
   - File → Open → Select the `android` folder
   - Wait for Gradle sync to complete
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Using Command Line

1. Make sure you have Android SDK installed and ANDROID_HOME environment variable set

2. Navigate to the project:
   ```bash
   cd trip-expense-splitter
   ```

3. Build the web app (if not already done):
   ```bash
   npm run build
   ```

4. Sync Capacitor (to copy web assets to Android):
   ```bash
   npx cap sync android
   ```

5. Build the APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

6. The APK will be located at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 3: Build Release APK (for distribution)

1. Generate a signing key (first time only):
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Build release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. Sign the APK (if not configured in gradle):
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app/build/outputs/apk/release/app-release-unsigned.apk my-key-alias
   ```

4. Optimize with zipalign:
   ```bash
   zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk trip-expense-splitter.apk
   ```

## Testing the APK

1. Enable "Unknown Sources" or "Install Unknown Apps" on your Android device
2. Transfer the APK to your device
3. Open the APK file and install

## Troubleshooting

### Gradle Build Fails
- Ensure you have Java JDK 17 or higher installed
- Check that ANDROID_HOME is set correctly
- Try running `./gradlew clean` before building

### Capacitor Sync Issues
- Make sure the web app is built first: `npm run build`
- Try removing and re-adding Android:
  ```bash
  npx cap remove android
  npx cap add android
  ```

### App Crashes on Launch
- Check Android Studio Logcat for error messages
- Ensure minimum SDK version is compatible (currently set to API 22)

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── assets/public/     # Web app files (copied from dist/)
│   │   ├── java/              # Java/Kotlin source
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── gradle/
└── build.gradle
```

## Configuration

The Capacitor configuration is in `capacitor.config.ts`:
- App Name: Trip Expense Splitter
- Package ID: com.tripexpensesplitter.app
- Web Directory: dist

To modify the app icon, name, or other Android-specific settings, edit:
- `android/app/src/main/res/` - for resources (icons, strings, etc.)
- `android/app/src/main/AndroidManifest.xml` - for permissions and app config
