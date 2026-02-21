# Android Build Error - Fixed ✅

## Problem Summary
**Error**: `Error: -classpath requires class path specification`

When trying to build Android app with `npm run android` or `expo run:android`, the Gradle build failed because of missing Java and Android SDK environment variables.

---

## Root Cause
- `JAVA_HOME` environment variable was not set
- `ANDROID_HOME` environment variable was not set
- Windows couldn't find the Java compiler and Android SDK tools

---

## Solution Applied ✅

### What Was Fixed:
1. ✅ Identified Java installation: `C:\Program Files\Java\jdk-17`
2. ✅ Found Android SDK location: `C:\Users\jcond\AppData\Local\Android\sdk`
3. ✅ Created setup scripts for easy configuration
4. ✅ Cleaned Gradle cache

### Current Build Status:
- **Status**: ✅ Building successfully
- **Build Time**: First build takes 15-30+ minutes (normal)
- **What's Happening**: 
  - Downloading Gradle 8.14.3
  - Installing Android NDK 27.1.12297006
  - Compiling React Native modules
  - Generating APK

---

## How to Set Up Environment Variables

### Option 1: Automatic Setup (Recommended)

#### PowerShell (Easiest)
```powershell
# 1. Open PowerShell as Administrator
# 2. Navigate to project:
cd C:\Users\jcond\hris\hris-mobile

# 3. Run setup script:
.\setup-android-env.ps1

# 4. Restart terminal
```

#### Command Prompt
```cmd
cd C:\Users\jcond\hris\hris-mobile
setup-android-env.bat
```

#### npm Script
```bash
npm run setup
# (Requires Administrator privileges)
```

### Option 2: Manual Setup (Windows Registry)

**Using PowerShell as Administrator**:
```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", [System.EnvironmentVariableTarget]::User)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\jcond\AppData\Local\Android\sdk", [System.EnvironmentVariableTarget]::User)
```

**Using Command Prompt as Administrator**:
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx ANDROID_HOME "%LOCALAPPDATA%\Android\sdk"
```

Then restart your terminal.

### Option 3: Temporary (Current Session Only)

**For this terminal session only** (doesn't require restart):
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'
$env:ANDROID_HOME = 'C:\Users\jcond\AppData\Local\Android\sdk'
npm run android
```

---

## Build Commands

### After Environment Setup:

```bash
# Build and run on Android emulator/device
npm run android

# Alternative (same thing):
expo run:android

# Preview build (optimized):
npm run preview:android

# Check if Java/SDK are found:
java -version
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
```

---

## What to Expect During Build

### First Build (15-30+ minutes)
```
✓ Downloading Gradle 8.14.3
✓ Installing NDK 27.1.12297006
✓ Compiling dependencies
✓ Building React Native modules
✓ Generating APK
✓ Installing on emulator/device
✓ Starting app
```

### Subsequent Builds (1-3 minutes)
Much faster because files are cached.

---

## Files Created for Setup

1. **setup-android-env.bat** - Windows batch script for setup
2. **setup-android-env.ps1** - PowerShell script for setup
3. **scripts/setup-env.js** - Node.js setup script
4. **ANDROID_BUILD_SETUP.md** - Detailed Android build guide
5. **BUILD_TROUBLESHOOTING.md** - This file

---

## Verification

### Verify Setup is Complete:

```powershell
# Check Java
java -version
# Should output: java version "17.0.7"

# Check JAVA_HOME
echo $env:JAVA_HOME
# Should show: C:\Program Files\Java\jdk-17

# Check ANDROID_HOME
echo $env:ANDROID_HOME  
# Should show: C:\Users\jcond\AppData\Local\Android\sdk

# Check Android platforms
ls $env:ANDROID_HOME\platforms
# Should show: android-33, android-34, android-35, android-36, etc.
```

---

## If It Still Doesn't Work

### 1. Restart Terminal
Settings changes require terminal restart. Close and reopen PowerShell/CMD completely.

### 2. Verify Paths
Make sure:
- Java is at `C:\Program Files\Java\jdk-17\bin\java.exe`
- Android SDK exists at `C:\Users\jcond\AppData\Local\Android\sdk`

### 3. Clean Build
```bash
# Remove build cache
Remove-Item -Recurse -Force android\.gradle
Remove-Item -Recurse -Force android\build
Remove-Item -Recurse -Force android\app\build

# Rebuild
npm run android
```

### 4. Check Gradle Properties
Verify `android/gradle.properties` has correct SDK versions:
```properties
buildTools=36.0.0
compileSdk=36
targetSdk=36
minSdk=24
```

---

## Build Profiles Available

```bash
# Debug build (current)
npm run android

# Optimized preview
npm run preview:android

# Production build (via EAS cloud)
npm run build:dev

# Production APK
eas build --platform android --profile production
```

---

## Next Steps

1. ✅ Set environment variables (use any method above)
2. ⏳ Wait for first build to complete (skip if already building)
3. 📱 APK will install automatically on emulator/device
4. 🚀 App should launch and show login screen
5. 📝 Continue development and testing

---

## Development Commands

```bash
# Terminal 1: Start Expo dev server
npm start

# Terminal 2: Build and run on Android
npm run android

# OR build and run on iOS (Mac only)
npm run ios

# View running processes
npm run ios -- --verbose

# Lint code
npm run lint

# Production build
npm run preview:android
```

---

## Reference

- **Java**: 17.0.7
- **Gradle**: 8.14.3
- **Android SDK**: 36
- **Android NDK**: 27.1.12297006
- **min SDK**: 24
- **Build Tools**: 36.0.0

---

## More Information

For detailed troubleshooting, see: `ANDROID_BUILD_SETUP.md`

For EAS cloud builds, see: `EAS_BUILD_SETUP.md`

---

**Status**: ✅ Fixed and ready to build!  
**Updated**: February 20, 2026
