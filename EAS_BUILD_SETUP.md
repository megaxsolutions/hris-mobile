# EAS Dev Build Setup - Complete Guide

## ✅ Project Configuration Status
- **EAS Project Created**: ✔ 
- **Project ID**: `@megaxsolutions/megaxemployeeapp`
- **Linked to EAS**: ✔ 
- **Owner**: megaxsolutions
- **Profiles Configured**: development, preview, preview2, production

---

## 📦 EAS Build Profiles Configured

Your project has the following profiles ready to use:

### 1. **Development** (Recommended for Dev Testing)
```json
{
  "android": {
    "buildType": "apk",
    "distribution": "internal"
  },
  "ios": {
    "simulator": true,
    "distribution": "internal"
  }
}
```
Build Command: `eas build --platform android --profile development`

### 2. **Preview** (For Testing before Production)
### 3. **Production** (For Release Builds)

---

## 🚀 Build Your App

### Option 1: Build via EAS Cloud (Recommended for CI/CD)
```bash
# Build Android APK
eas build --platform android --profile development

# Build iOS Simulator
eas build --platform ios --profile development

# Build for both platforms
eas build --platform all --profile development
```

### Option 2: Local Build (No Cloud, No Limits)
These don't count against your EAS free plan limits:

```bash
# Build and run on Android device/emulator
npm run android
# or
expo run:android

# Build and run on iOS simulator
npm run ios
# or
expo run:ios
```

### Option 3: Build Preview APK/Simulator Bundle
```bash
# Preview APK for Android
eas build --platform android --profile preview

# iOS Simulator Build
eas build --platform ios --profile preview
```

---

## 📊 Free Plan Limitations
- **Android Builds**: Limited per month (resets monthly)
- **iOS Builds**: Limited per month
- **Concurrent Builds**: 1 at a time
- **Build Duration**: Shorter timeout

**Solution**: Use local builds with `expo run:android` or `expo run:ios` which don't consume your free tier limit.

---

## 🔧 Local Development Setup

### Android Local Build
1. Ensure you have Android SDK installed
2. Set `ANDROID_HOME` environment variable
3. Run: `expo run:android` or `npm run android`

### iOS Local Build (Mac Only)
1. Run: `expo run:ios` or `npm run ios`
2. Requires Xcode and iOS SDK

---

## 📱 Install Built APK

Once you have an APK:

### From EAS Build URL
When build completes, you'll get a download link. Download the APK and:

```bash
# Install on connected device
adb install app-release.apk

# Or open the link on your device to download and install
```

### From Local Build
APK is automatically installed on your device/emulator.

---

## 🔄 Update EAS Project Settings

To manage your EAS project:
```bash
# View project info
eas project:info

# Update environment variables
eas env:create --profile development

# Manage credentials
eas credentials
```

---

## 📋 Next Steps

### For Development Testing:
1. **Use local builds**: `expo run:android` (no EAS build limit)
2. **Test on physical device** or Android emulator
3. **Use Expo Go** for quick testing: `npm start` and scan QR code

### For Production Release:
1. Upgrade EAS plan for more builds
2. Use `eas build --platform all --profile production` when ready
3. Submit to App Store/Google Play via `eas submit`

### For Team/CI/CD:
1. Configure GitHub Actions to use EAS build
2. Set up environment variables for different environments
3. Automate builds on commits

---

## 🎯 Recommended Development Workflow

```bash
# 1. Develop with Expo Go
npm start

# 2. Test locally when needed
expo run:android  # or npm run android

# 3. Build for distribution (when ready for testing)
eas build --platform android --profile preview

# 4. Build for production
eas build --platform android --profile production
```

---

## 📚 Useful Commands

```bash
# Check build status
eas build:list

# View specific build details
eas build:view <build-id>

# Cancel a build
eas build:cancel <build-id>

# Manage app versions
eas secret:create
eas secret:list
```

---

## ❓ Troubleshooting

### Build Failed - Check Logs
```bash
eas build:view <build-id> --verbose
```

### Free Plan Limit Reached
- Use local builds instead
- Wait for monthly reset
- Upgrade to paid plan

### Android Keystore Issues
```bash
# Reset credentials if needed
eas credentials:remove-all --platform android
eas build --platform android --profile development  # Will recreate
```

---

## 🔐 Security Notes

- Your app keystore is securely stored on EAS servers
- API keys in `.env` are never logged
- Use `eas secret` for sensitive data
- Never commit credentials to git

---

**Project Setup Date**: February 20, 2026  
**EAS CLI Version**: 16.28.0  
**Node Version**: v20.19.4

For more info: https://docs.expo.dev/build/
