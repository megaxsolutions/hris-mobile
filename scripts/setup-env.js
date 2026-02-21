#!/usr/bin/env node

/**
 * Android Development Environment Setup Script
 * Sets up JAVA_HOME and ANDROID_HOME environment variables
 * Run with: npm run setup
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

console.clear();
console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  Android Development Environment Setup              ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const JAVA_HOME = 'C:\\Program Files\\Java\\jdk-17';
const ANDROID_HOME = path.join(os.homedir(), 'AppData\\Local\\Android\\sdk');

console.log('📋 Configuration:\n');
console.log(`  JAVA_HOME:     ${JAVA_HOME}`);
console.log(`  ANDROID_HOME:  ${ANDROID_HOME}`);

// Check if on Windows
if (process.platform !== 'win32') {
  console.log('\n⚠️  This setup script is for Windows only.\n');
  console.log('For macOS:');
  console.log('  export JAVA_HOME=$(/usr/libexec/java_home -v 17)');
  console.log('  export ANDROID_HOME=$HOME/Library/Android/sdk\n');
  process.exit(1);
}

// Check if running as admin (for Windows)
if (process.platform === 'win32') {
  const isAdmin = require('is-administrator');
  
  console.log('🔍 Checking permissions...\n');
  
  try {
    isAdmin().then((admin) => {
      if (!admin) {
        console.log('⚠️  This script needs Administrator privileges to set permanent environment variables.\n');
        console.log('Please run one of the following:\n');
        console.log('  1. Right-click PowerShell and select "Run as Administrator"');
        console.log('  2. Then run: npm run setup\n');
        console.log('  OR\n');
        console.log('  1. Double-click: setup-android-env.ps1\n');
        console.log('  OR\n');
        console.log('  For this session only, use:');
        console.log('  $env:JAVA_HOME = "C:\\Program Files\\Java\\jdk-17"');
        console.log('  $env:ANDROID_HOME = "C:\\Users\\jcond\\AppData\\Local\\Android\\sdk"\n');
        process.exit(1);
      }
      
      setupEnvironment();
    });
  } catch (err) {
    console.log('ℹ️  Run this script with Administrator privileges.\n');
    console.log('Right-click PowerShell > Run as Administrator, then: npm run setup\n');
    process.exit(1);
  }
} else {
  setupEnvironment();
}

function setupEnvironment() {
  // Verify Java installation
  fs.stat(JAVA_HOME, (err) => {
    if (err) {
      console.log(`\n❌ Java not found at ${JAVA_HOME}`);
      console.log('\nPlease ensure JDK 17 is installed from:');
      console.log('  https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html\n');
      process.exit(1);
    }

    console.log('✓ Java 17 found\n');

    // Verify Android SDK
    fs.stat(ANDROID_HOME, (err) => {
      if (err) {
        console.log(`\n⚠️  Android SDK not found at ${ANDROID_HOME}`);
        console.log('\nPlease install Android Studio or download SDK from:');
        console.log('  https://developer.android.com/studio/command-line-tools\n');
        console.log('Then set ANDROID_HOME to the correct path.\n');
        process.exit(1);
      }

      console.log('✓ Android SDK found\n');

      if (process.platform === 'win32') {
        setEnvironmentVariablesWindows();
      }
    });
  });
}

function setEnvironmentVariablesWindows() {
  console.log('🔧 Setting environment variables...\n');

  // Use setx command to set variables permanently
  const commands = [
    {
      cmd: 'setx',
      args: ['JAVA_HOME', JAVA_HOME],
      name: 'JAVA_HOME',
    },
    {
      cmd: 'setx',
      args: ['ANDROID_HOME', ANDROID_HOME],
      name: 'ANDROID_HOME',
    },
  ];

  let completed = 0;

  commands.forEach((command) => {
    const proc = spawn(command.cmd, command.args, {
      stdio: 'pipe',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${command.name} set successfully`);
      } else {
        console.log(`✗ Failed to set ${command.name}`);
      }

      completed++;

      if (completed === commands.length) {
        showCompletionMessage();
      }
    });

    proc.on('error', (err) => {
      console.log(`✗ Error setting ${command.name}: ${err.message}`);
      completed++;

      if (completed === commands.length) {
        showCompletionMessage();
      }
    });
  });
}

function showCompletionMessage() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  Setup Complete!                                    ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('✅ Environment variables have been set.\n');

  console.log('📋 Next steps:\n');
  console.log('  1. Close and restart your PowerShell/Command Prompt');
  console.log('  2. Navigate to the project:');
  console.log('     cd C:\\Users\\jcond\\hris\\hris-mobile\n');
  console.log('  3. Build the app:');
  console.log('     npm run android\n');

  console.log('📚 For more information, see:');
  console.log('  - ANDROID_BUILD_SETUP.md (in project root)\n');

  process.exit(0);
}
