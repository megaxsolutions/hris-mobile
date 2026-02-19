# Command Reference & Quick Start

## 🚀 Getting Started (Copy & Paste Commands)

### Step 1: Navigate to Project
```powershell
cd C:\Users\JaimeCondes\megaxapp\EmployeeApp
```

### Step 2: Install Dependencies (if needed)
```bash
npm install
```

### Step 3: Update Environment
Edit `.env` file and set your backend API URL:
```env
EXPO_PUBLIC_API_URL=http://your-api-url/api
```

### Step 4: Start Development Server
```bash
npm start
```

### Step 5: Run on Device/Emulator
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web Browser
npm run web
```

---

## 📋 Available NPM Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Run linter
npm run lint

# Reset project (caution - will reset to default)
npm run reset-project

# Install dependencies
npm install

# Update dependencies
npm update

# Clear cache
npm cache clean --force
```

---

## 🔧 Useful Terminal Commands

### Check Node & NPM Version
```bash
node --version
npm --version
```

### Install Expo CLI Globally
```bash
npm install -g expo-cli
```

### Check Installed Packages
```bash
npm list

# Specific package
npm list axios
```

### Update All Dependencies
```bash
npm update
```

### Clear Expo Cache
```bash
expo cache clean
```

---

## 📁 File System Navigation

### Navigate to Project
```powershell
cd C:\Users\JaimeCondes\megaxapp\EmployeeApp
```

### Go to Source Directory
```powershell
cd src
```

### List Files
```powershell
ls
# or
Get-ChildItem
```

### List All TypeScript Files
```powershell
Get-ChildItem -Recurse -Filter "*.tsx" -o Name
```

---

## 🐞 Debugging Commands

### Expo Logs
```bash
# View app logs
npm start
# Press L for logs in the terminal

# Clear logs
expo cache clean
```

### NPM Errors
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

---

## 📱 Device/Emulator Commands

### Android Emulator
```bash
# List connected devices
adb devices

# Kill emulator
adb emu kill
```

### iOS Simulator (macOS only)
```bash
# Open iOS simulator
open -a Simulator

# Kill simulator
xcrun simctl shutdown all
```

---

## 🔐 Environment Setup

### Edit .env File
```bash
# Using VS Code (if available in PATH)
code .env

# Or directly edit in IDE
```

### .env Required Variables
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_APP_NAME=Employee Management App
EXPO_PUBLIC_VERSION=1.0.0
```

---

## 📦 Installing Additional Packages

### Add New Package
```bash
npm install package-name
```

### Add Dev Dependency
```bash
npm install --save-dev package-name
```

### Remove Package
```bash
npm uninstall package-name
```

---

## 🧹 Cleanup Commands

### Remove node_modules
```bash
rm -r node_modules
# or on Windows
rmdir /s /q node_modules
```

### Clean Install
```bash
rm package-lock.json
npm install
```

### Clear Expo Cache
```bash
expo cache clean
```

### Clear All Cache
```bash
npm cache clean --force
expo cache clean
```

---

## 📊 Project Information Commands

### Check TypeScript Version
```bash
npx tsc --version
```

### Check Expo Version
```bash
expo --version
```

### List Project Dependencies
```bash
npm list
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## 🌐 API Testing Commands

### Test API Endpoint (using curl)
```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test location save
curl -X POST http://localhost:3000/api/location/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":"user_id","latitude":10.123,"longitude":121.456}'
```

---

## 🔍 File Operations

### Create New File
```bash
# Using touch (Unix-like)
touch src/screens/NewScreen.tsx

# Using VS Code
code src/screens/NewScreen.tsx
```

### Create New Directory
```bash
mkdir src/new-folder
```

### Copy File
```bash
cp src/screens/LoginScreen.tsx src/screens/NewScreen.tsx
```

### Remove File
```bash
rm src/screens/OldScreen.tsx
```

---

## 📚 Development Workflow

### Typical Development Flow

```bash
# 1. Start development
npm start

# 2. In another terminal, navigate to project
cd C:\Users\JaimeCondes\megaxapp\EmployeeApp

# 3. Edit files as needed
# Files auto-reload in Expo

# 4. When done testing
# Press Ctrl+C in terminal running npm start

# 5. Commit changes (if using git)
git add .
git commit -m "Your message"
```

---

## 🚀 Production Build Commands

### Build for Android
```bash
eas build --platform android
```

### Build for iOS
```bash
eas build --platform ios
```

### Build Both
```bash
eas build --platform all
```

**Note**: Requires EAS CLI and account setup

---

## 🆚 Git Commands (if using Git)

### Check Git Status
```bash
git status
```

### Add Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Commit message"
```

### Push to Remote
```bash
git push origin main
```

### Clone Repository
```bash
git clone <repository-url>
```

---

## 📖 Documentation Commands

### Open Documentation in Browser
```bash
# React Navigation Docs
start https://reactnavigation.org

# Expo Docs
start https://docs.expo.dev

# React Native Docs
start https://reactnative.dev
```

---

## 🔥 Hot Reload Features

### During Development (npm start)

- **Press R** - Reload the app
- **Press I** - Run on iOS simulator
- **Press A** - Run on Android emulator
- **Press W** - Run in web browser
- **Press J** - Open debugger
- **Press M** - Toggle menu
- **Press L** - Show logs
- **Press Q** - Exit

---

## ⚡ Speed Tips

### Faster Installs
```bash
# Use npm ci instead of npm install (faster)
npm ci
```

### Faster Development
```bash
# Use --max-workers for faster builds
expo start --max-workers 4
```

---

## 🐛 Emergency Reset

### Completely Reset Project
```bash
# 1. Remove dependencies
rm -r node_modules
rm package-lock.json

# 2. Clear caches
npm cache clean --force
expo cache clean

# 3. Reinstall
npm install

# 4. Restart
npm start
```

---

## 📱 Testing Commands

### Test on Multiple Devices
```bash
# Terminal 1: Start server
npm start

# Terminal 2: In another window, keep server running
# Connect device via USB and run app

# Terminal 3: Run linter
npm run lint
```

---

## ✅ Health Check Commands

```bash
# Check if all is installed correctly
npm list
npm list expo
npm list react-native

# Test TypeScript compilation
npx tsc --noEmit

# Check versions
node --version
npm --version
expo --version
```

---

## 💡 Pro Tips

### 1. Keep Terminal Open
Always keep one terminal running `npm start` while developing.

### 2. Use multiple Terminals
- Terminal 1: `npm start` (keep running)
- Terminal 2: Git commands, file operations
- Terminal 3: Running tests or builds

### 3. Device Testing
Connect physical device via USB for real testing instead of emulator.

### 4. Check Documentation
When stuck, check:
- README.md
- QUICK_REFERENCE.md
- API_DOCUMENTATION.md

### 5. Regular Commits
Make frequent git commits to save progress.

---

## 📞 Getting Help

### If Something Breaks

```bash
# 1. Check logs
npm start
# Look at error messages

# 2. Check documentation
cat README.md
cat API_DOCUMENTATION.md

# 3. Clear cache and reinstall
npm cache clean --force
rm -r node_modules
npm install

# 4. Restart development
npm start
```

---

## 🎯 Quick Command Reference Card

| Action | Command |
|--------|---------|
| Start dev | `npm start` |
| Run Android | `npm run android` |
| Run iOS | `npm run ios` |
| Run Web | `npm run web` |
| Install deps | `npm install` |
| Check version | `node --version` |
| Clear cache | `npm cache clean --force` |
| List packages | `npm list` |
| Update packages | `npm update` |
| Reinstall | `rm -r node_modules && npm install` |

---

**Created**: January 30, 2026
**Version**: 1.0.0
**For**: Employee Management App
