@echo off
REM Windows Batch script to set up Android/React Native development environment
REM Run this once to set up your environment variables

echo ========================================
echo Android Development Environment Setup
echo ========================================
echo.

REM Set JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
echo ✓ JAVA_HOME set to: C:\Program Files\Java\jdk-17

REM Set ANDROID_HOME
setx ANDROID_HOME "%LOCALAPPDATA%\Android\sdk"
echo ✓ ANDROID_HOME set to: %LOCALAPPDATA%\Android\sdk

REM Add to PATH if not already there
setx PATH "%PATH%;%LOCALAPPDATA%\Android\sdk\tools;%LOCALAPPDATA%\Android\sdk\tools\bin;%LOCALAPPDATA%\Android\sdk\platform-tools"
echo ✓ Android SDK tools added to PATH

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Please close and restart your terminal for changes to take effect.
echo Then run: npm run android
echo.
pause
