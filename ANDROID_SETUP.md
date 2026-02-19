# Running Employee Management App on Android Virtual Device

## Prerequisites

1. **Android Studio** installed
2. **Android SDK** (API Level 28 or higher)
3. **Expo CLI** installed globally
4. **Node.js** and **npm** installed

---

## Step 1: Set Up Android Virtual Device (AVD)

### Option A: Using Android Studio UI

1. **Open Android Studio**
2. Go to **Tools** → **Device Manager**
3. Click **Create Virtual Device**
4. Select a device (e.g., Pixel 5)
5. Choose an API level (30 or higher recommended)
6. Configure settings:
   - RAM: 4GB (minimum)
   - Internal Storage: 2GB
   - SD Card: 512MB
7. Click **Finish**

### Option B: Using Command Line

```bash
# List available system images
sdkmanager --list --verbose | grep "system-images"

# Install a system image (if not installed)
sdkmanager "system-images;android-30;default;x86_64"

# Create AVD
avdmanager create avd -n "EmployeeApp_AVD" -k "system-images;android-30;default;x86_64"
```

---

## Step 2: Start the Android Emulator

### Option A: From Android Studio
1. Open **Device Manager**
2. Select your AVD
3. Click the **Play** button (▶)
4. Wait for emulator to fully boot (2-3 minutes)

### Option B: From Command Line

```powershell
# Find emulator executable
$ANDROID_HOME = $env:ANDROID_HOME
$EMULATOR_PATH = "$ANDROID_HOME\emulator\emulator.exe"

# Start emulator
& $EMULATOR_PATH -avd EmployeeApp_AVD

# Or if ANDROID_HOME is set
emulator -avd EmployeeApp_AVD
```

---

## Step 3: Prepare the Project

```bash
# Navigate to project directory
cd C:\Users\JaimeCondes\megaxapp\EmployeeApp

# Install dependencies (if not done)
npm install

# Update .env with API URL (if needed)
# Edit .env file
```

---

## Step 4: Run the App on Android Emulator

### Method 1: Using npm script
```bash
npm run android
```

### Method 2: Using Expo CLI (Recommended)
```bash
# Terminal 1: Start Expo development server
npm start

# Then in the terminal, press:
# a - to run on Android emulator
```

### Method 3: Manual Expo command
```bash
npx expo run:android
```

---

## Step 5: Verify App is Running

You should see:
- Expo splash screen
- App loading
- Login screen appears

✅ **App is successfully running on Android!**

---

## Troubleshooting

### Emulator Won't Start
```powershell
# Check if Android SDK is properly installed
echo $env:ANDROID_HOME

# If not set, set it manually
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"

# Verify emulator list
emulator -list-avds
```

### App Won't Connect to Emulator
```bash
# Kill all adb processes
adb kill-server

# Start adb again
adb start-server

# Check connected devices
adb devices
```

### "No connected devices" Error
```bash
# List all available AVDs
emulator -list-avds

# Make sure emulator is fully booted (wait 2-3 minutes)

# Check device connection
adb devices -l
```

### Build Fails
```bash
# Clear cache and rebuild
npm run android -- --clear

# Or manually
npx expo run:android --clear
```

### Port Already in Use
```bash
# Kill process using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or use different port
npx expo start --port 8082
```

---

## Useful ADB Commands

```bash
# List connected devices
adb devices

# Install app manually
adb install app.apk

# View app logs
adb logcat

# Clear app data
adb shell pm clear com.yourapp.packagename

# Restart emulator
adb reboot

# Connect to specific device
adb -s <device_id> shell
```

---

## Performance Tips

1. **Allocate more RAM**: Settings → Virtual Device → Edit → RAM (4-8GB)
2. **Enable Hardware Acceleration**: If available in your system
3. **Use x86_64 Architecture**: Faster than ARM
4. **Close unnecessary apps** on host machine
5. **Use SSD** for better performance

---

## Network Configuration

### Access Backend from Emulator
The emulator treats `localhost` differently. Use:

```typescript
// Instead of: http://localhost:3000/api
// Use: http://10.0.2.2:3000/api (for emulator)

// Update .env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

Or use your actual machine IP:
```bash
# Get your machine IP
ipconfig /all

# Use that IP in .env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
```

---

## App Permissions on Emulator

The app will request:
- ✅ **Camera** - Grant when prompted
- ✅ **Location** - Grant when prompted

Grant permissions when:
1. App first launches
2. Dialog appears asking for permissions
3. Settings → Apps → EmployeeApp → Permissions

---

## Development Workflow

```bash
# Terminal 1: Run development server
npm start
# Press 'a' for Android

# Terminal 2 (Optional): View logs
adb logcat | grep "EmployeeApp"

# Make code changes → Hot reload automatically
# Press R to refresh if needed
```

---

## Debugging in Emulator

### View Console Logs
```bash
adb logcat | grep "EmployeeApp"
```

### Open DevTools
In Expo terminal, press:
- `j` - Jump to log info
- `m` - Toggle Metro bundler menu
- `d` - Open debugging menu

### React Native Debugger
1. Install: `npm install -g react-native-debugger`
2. Run app with: `npm start`
3. Press `Shift+M` in Expo terminal
4. Click "Debug remote JS"

---

## Common Emulator Images

| Image | Speed | RAM | Best For |
|-------|-------|-----|----------|
| x86_64 | Fast | 2-4GB | Development |
| ARM | Slower | 1-2GB | Testing compatibility |
| Google Play | Medium | 3-4GB | Full Google services |

---

## Next Steps After Running

1. ✅ Test login functionality
2. ✅ Test face recognition (camera works in emulator)
3. ✅ Test location (use emulator location tools)
4. ✅ Verify navigation
5. ✅ Test all menu screens

---

## Stopping the App

- **Ctrl+C** in terminal to stop Expo server
- Emulator window close button to stop emulator
- `adb shell reboot` to restart emulator

---

**Happy Testing on Android! 🎉**

For more help, visit:
- [Expo Documentation](https://docs.expo.dev)
- [Android Emulator Docs](https://developer.android.com/studio/run/emulator)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
