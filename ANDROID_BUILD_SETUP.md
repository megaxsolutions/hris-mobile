# Android Build Setup - Troubleshooting & Environment Configuration

## ✅ Problem Solved: Classpath Error

**Original Error**: 
```
Error: -classpath requires class path specification
Error: gradlew.bat app:assembleDebug exited with non-zero code: 1
```

**Root Cause**: Missing `JAVA_HOME` and `ANDROID_HOME` environment variables

**Solution Applied**: Set environment variables correctly

---

## 🔧 Environment Variables Setup

### Permanent Setup (Recommended)

#### Option 1: PowerShell (Recommended)
1. Open PowerShell as Administrator
2. Run `cd C:\Users\jcond\hris\hris-mobile`
3. Run `.\setup-android-env.ps1`
4. Restart terminal for changes to take effect

#### Option 2: Batch File
1. Double-click `setup-android-env.bat` in the project folder
2. Click "Yes" if prompted for administrator access
3. Restart terminal

### Manual Setup (If scripts don't work)

**For PowerShell**:
```powershell
$javaHome = "C:\Program Files\Java\jdk-17"
$androidHome = "C:\Users\jcond\AppData\Local\Android\sdk"

[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, [System.EnvironmentVariableTarget]::User)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, [System.EnvironmentVariableTarget]::User)
```

**For Command Prompt**:
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx ANDROID_HOME "%LOCALAPPDATA%\Android\sdk"
```

### Paths Used
- **JAVA_HOME**: `C:\Program Files\Java\jdk-17` (Java 17.0.7)
- **ANDROID_HOME**: `C:\Users\jcond\AppData\Local\Android\sdk`

---

## 🚀 Building Android App

### Quick Build (After Environment Setup)
```bash
# Navigate to project
cd C:\Users\jcond\hris\hris-mobile

# Build and run
npm run android
```

### First Build Warning
First build takes 15-30+ minutes because it:
- Downloads Gradle (8.14.3)
- Downloads Android NDK (27.1.12297006)
- Compiles React Native modules
- Generates APK

**This is normal!** Subsequent builds will be much faster (1-3 minutes).

### Build Command Variations

#### One-liner (set env vars for this session only)
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'; $env:ANDROID_HOME = 'C:\Users\jcond\AppData\Local\Android\sdk'; npm run android
```

#### With Expo directly
```bash
expo run:android
```

#### Stack-based 
```bash
# Fresh build
npm run android -- --no-cache

# With more verbose output
npm run android -- --verbose
```

---

## 📋 Build Configuration

### Gradle Settings
Located in: `android/gradle.properties`

```properties
buildTools=36.0.0
minSdk=24
compileSdk=36
targetSdk=36
ndk=27.1.12297006
kotlin=2.1.20
```

### NDK Information
- **Version**: 27.1.12297006
- **License**: Auto-accepted for builds
- **Location**: `C:\Users\jcond\AppData\Local\Android\sdk\ndk\27.1.12297006`

---

## ✅ Verification Steps

### Check Java Installation
```powershell
java -version
# Output: java version "17.0.7" 2023-04-18 LTS
```

### Check Environment Variables
```powershell
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
```

### Check Android SDK
```powershell
ls "$env:ANDROID_HOME\platforms" | Select-Object Name
# Should show: android-33, android-34, android-35, android-36, etc.
```

---

## 🛠️ Troubleshooting

### Issue: Still Getting Classpath Error
1. **Solution 1**: Run setup script as Administrator
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\setup-android-env.ps1
   ```

2. **Solution 2**: Restart PowerShell/Command Prompt completely
   - Settings page changes require terminal restart to take effect

3. **Solution 3**: Manual environment variable check
   ```powershell
   # Open System Properties > Environment Variables
   # Verify JAVA_HOME and ANDROID_HOME are there
   # Check user variables, not just system variables
   ```

### Issue: "Cannot find Java executable"
```bash
# Manually point to Java
set JAVA_HOME=C:\Program Files\Java\jdk-17
java -version
```

### Issue: "Android SDK is missing"
```bash
# Download Android Studio to get SDK
# Or download SDK separately from:
# https://developer.android.com/studio/command-line-tools

# Place in: C:\Users\jcond\AppData\Local\Android\sdk
```

### Issue: NDK Download Fails
```bash
# Clear gradle cache
rm -Recurse -Force android/.gradle

# Try build again
npm run android
```

### Issue: Build Timeout
First build can take 30+ minutes. This is normal. Ways to speed up:

1. **Update Gradle**:
   ```bash
   cd android
   ./gradlew wrapper --gradle-version latest
   ```

2. **Enable Gradle daemon** (already enabled by default)

3. **Use offline mode if gradle cache exists**:
   ```bash
   npm run android -- --offline
   ```

---

## 📱 Running on Device/Emulator

### Check Connected Devices
```bash
adb devices
```

### Start Android Emulator (if not running)
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <emulator_name>
```

### After Successful Build
1. APK is automatically installed on emulator/device
2. App launches automatically (Metro bundler will connect)
3. You should see the Megax Employee App

---

## 🔄 Clean Build (If Having Issues)

```bash
# 1. Clean Gradle cache
rm -Recurse -Force android/.gradle
rm -Recurse -Force android/build
rm -Recurse -Force android/app/build

# 2. Clean Node modules (optional, if dependencies issue)
rm -Recurse -Force node_modules
npm install

# 3. Rebuild
npm run android
```

---

## 📊 Build Profiles Available

### Development (default for `npm run android`)
- **Buildtype**: debug APK
- **Optimizations**: None (easy debugging)
- **Signing**: Debug keystore
- **Size**: Larger (~80-100MB)
- **Speed**: Slower first run, fast rebuilds
- **Use for**: Development and testing

### Preview
```bash
npm run preview:android
```
- Intermediate build type
- Better performance than debug
- Still debuggable

### Production
```bash
eas build --platform android --profile production
```
- Optimized release build
- Signed with prod keystore (if configured)
- Smallest size (~30-50MB)
- Use for: Distribution

---

## 🎯 Recommended Workflow

```bash
# 1. Set up environment (one-time)
.\setup-android-env.ps1
# Close and restart terminal

# 2. First build (takes 20-30 min)
npm run android

# 3. Subsequent builds (takes 1-3 min)
npm run android

# 4. For production build
npm run build:dev
# or
npm run preview:android
```

---

## 📚 Useful Commands Reference

```bash
# Start dev server
npm start

# Android
npm run android              # Debug build
npm run preview:android      # Optimized APK

# iOS (Mac only)
npm run ios                  # Debug simulator
npm run preview:ios          # Preview build

# Linting
npm run lint

# View build details
eas build:list
eas build:view <build-id>

# Android-specific
adb devices                  # List connected devices
adb logcat                   # View device logs
adb install app.apk          # Manually install APK
```

---

## 🔐 Security & Best Practices

- **Never** commit `.gradle` folder to git
- **Never** commit `android/build` folder to git
- **Never** commit keystores to git
- Add to `.gitignore`:
  ```
  android/.gradle/
  android/build/
  android/app/build/
  *.keystore
  *.jks
  ```

---

## 📞 Support Resources

- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Android Gradle: https://developer.android.com/build
- Gradle Docs: https://docs.gradle.org/

---

**Last Updated**: February 20, 2026  
**Java Version**: 17.0.7  
**Gradle Version**: 8.14.3  
**Android SDK**: 36  
**NDK Version**: 27.1.12297006
