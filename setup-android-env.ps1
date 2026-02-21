# PowerShell script to set up Android/React Native development environment
# Run this once to permanently set up your environment variables

Write-Host "========================================"
Write-Host "Android Development Environment Setup"
Write-Host "========================================"
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This script needs to run as Administrator to set environment variables permanently."
    Write-Host "Please run PowerShell as Administrator and try again."
    pause
    exit
}

$javaHome = "C:\Program Files\Java\jdk-17"
$androidHome = "$env:LOCALAPPDATA\Android\sdk"

# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, [System.EnvironmentVariableTarget]::User)
Write-Host "✓ JAVA_HOME set to: $javaHome"

# Set ANDROID_HOME
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, [System.EnvironmentVariableTarget]::User)
Write-Host "✓ ANDROID_HOME set to: $androidHome"

# Add to PATH
$androidTools = "$androidHome\tools;$androidHome\tools\bin;$androidHome\platform-tools"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)

if ($currentPath -notlike "*$androidHome*") {
    $newPath = "$currentPath;$androidTools"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, [System.EnvironmentVariableTarget]::User)
    Write-Host "✓ Android SDK tools added to PATH"
} else {
    Write-Host "✓ Android SDK tools already in PATH"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Please close and restart your terminal for changes to take effect."
Write-Host "Then run: npm run android"
Write-Host ""

pause
