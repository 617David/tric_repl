# Distribution Packages

This document describes the available distribution packages for Trip Expense Splitter.

## Available Packages

### 1. Linux (.deb package)

**Location:** `packages/trip-expense-splitter_1.0.0_amd64.deb`

**Installation:**
```bash
sudo dpkg -i packages/trip-expense-splitter_1.0.0_amd64.deb
```

**Usage:**
- Launch from application menu: Search for "Trip Expense Splitter"
- Or run from terminal: `trip-expense-splitter`

**How it works:**
- Installs web app files to `/opt/trip-expense-splitter/`
- Creates launcher script in `/usr/bin/trip-expense-splitter`
- Adds desktop entry to application menu
- Starts a local Python HTTP server on port 8765
- Opens the app in your default web browser

**Uninstallation:**
```bash
sudo dpkg -r trip-expense-splitter
```

**Requirements:**
- Debian/Ubuntu Linux (amd64)
- Python 3 (for local web server)
- xdg-utils (for opening browser)

---

### 2. Windows (Portable ZIP)

**Location:** `packages/windows/trip-expense-splitter-windows-portable.zip`

**Installation:**
1. Extract the ZIP file to any location (e.g., `C:\Program Files\TripExpenseSplitter\`)
2. No installation needed - it's portable!

**Usage:**
- **Recommended:** Double-click `launch.vbs` (opens silently without console)
- **Alternative:** Double-click `launch.bat` (shows brief console window)
- The app will open in your default web browser

**How it works:**
- Opens the `index.html` file directly in your default browser
- All data stored in browser's localStorage
- No server required - runs completely client-side

**Requirements:**
- Windows 7 or later
- Any modern web browser (Chrome, Firefox, Edge, etc.)

**Note:** Windows may show a security warning for VBS files. This is normal for unsigned scripts. The script only opens your browser - you can review the source code in a text editor.

---

### 3. Android (.apk)

**Status:** Android project is configured, APK needs to be built on a system with internet access.

**Location:** `android/` (Capacitor project)

**Build Instructions:** See [BUILD_ANDROID.md](./BUILD_ANDROID.md)

**Quick Build:**
```bash
# With Android Studio
# 1. Open the 'android' folder in Android Studio
# 2. Build → Build Bundle(s) / APK(s) → Build APK(s)

# Or via command line
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

**Features:**
- Full offline support
- Native Android app experience
- Data stored locally on device
- No permissions required (beyond internet for initial load)

---

## Web Version (No Installation)

You can also run the app directly without any package:

### Development Mode
```bash
cd trip-expense-splitter
npm install
npm run dev
```
Open http://localhost:5173

### Production Build
```bash
cd trip-expense-splitter
npm run build
npm run preview
```

Or serve the `dist/` folder with any web server:
```bash
cd dist
python3 -m http.server 8080
```
Open http://localhost:8080

---

## Package Comparison

| Feature | Linux .deb | Windows ZIP | Android APK | Web |
|---------|-----------|-------------|-------------|-----|
| Installation | System-wide | Portable | Install APK | None |
| Updates | Manual reinstall | Manual replace | Manual reinstall | Refresh browser |
| Desktop Icon | Yes | Manual | Yes | Bookmark |
| Offline Use | Yes* | Yes | Yes | Yes* |
| Data Storage | Browser localStorage | Browser localStorage | Android storage | Browser localStorage |
| File Size | ~210 KB | ~210 KB | ~5-10 MB | ~210 KB |

\* Requires initial online access to load, then works offline

---

## Data Portability

All packages use browser/WebView localStorage for data. To export/import data:

1. **Export data** (in browser console):
   ```javascript
   const data = localStorage.getItem('trip-expense-splitter-data');
   const blob = new Blob([data], {type: 'application/json'});
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'trip-data.json';
   a.click();
   ```

2. **Import data** (in browser console):
   ```javascript
   // After loading the JSON file content
   localStorage.setItem('trip-expense-splitter-data', jsonContent);
   location.reload();
   ```

---

## Building Packages

### Rebuild Linux .deb
```bash
cd trip-expense-splitter
npm run build
dpkg-deb --build packages/linux/trip-expense-splitter_1.0.0_amd64 packages/trip-expense-splitter_1.0.0_amd64.deb
```

### Rebuild Windows ZIP
```bash
cd trip-expense-splitter
npm run build
cp -r dist/* packages/windows/trip-expense-splitter-portable/
cd packages/windows
zip -r trip-expense-splitter-windows-portable.zip trip-expense-splitter-portable/
```

### Build Android APK
See [BUILD_ANDROID.md](./BUILD_ANDROID.md) for detailed instructions.

---

## Security Notes

- **All packages are local-first**: No data is sent to any server
- **No telemetry or tracking**: The app doesn't phone home
- **Open source**: All code is visible and auditable
- **Browser security**: Relies on browser's security for data storage
- **Windows SmartScreen**: May show warning for unsigned .exe/.vbs files

---

## Support

For issues or questions:
1. Check the main [README.md](./README.md)
2. Review package-specific documentation
3. Open an issue on the project repository
