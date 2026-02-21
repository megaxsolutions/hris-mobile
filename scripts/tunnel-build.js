#!/usr/bin/env node

/**
 * Expo Tunnel Build Manager
 * Manages building, deploying, and updating Expo projects with tunnel support
 * 
 * Usage: node scripts/tunnel-build.js [command] [options]
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMANDS = {
  'build-dev': 'Build development version with tunnel support',
  'build-preview': 'Build preview version for testing',
  'update': 'Push OTA update (no rebuild needed)',
  'update:channel': 'Push update to specific channel',
  'logs': 'View build logs',
  'status': 'Check build status',
  'help': 'Show help information'
};

function log(type, message) {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    error: '❌',
    warn: '⚠️ ',
    build: '🔨',
    update: '📦',
    tunnel: '🌐'
  };
  console.log(`${icons[type] || ''} ${message}`);
}

function showHelp() {
  log('info', 'Expo Tunnel Build Manager\n');
  console.log('Usage: node scripts/tunnel-build.js [command] [options]\n');
  console.log('Commands:');
  
  Object.entries(COMMANDS).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(18)} - ${desc}`);
  });

  console.log(`
Examples:
  node scripts/tunnel-build.js build-dev
  node scripts/tunnel-build.js update
  node scripts/tunnel-build.js update:channel staging
  node scripts/tunnel-build.js status
  node scripts/tunnel-build.js logs

Environment Variables:
  EXPO_UPDATE_CHANNEL    - Update channel name (default: 'default')
  TUNNEL_MODE            - Connection mode (tunnel|lan|localhost)
  SKIP_INSTALL           - Skip npm install

Notes:
  • Development builds are internal distribution (APK/Simulator)
  • Preview builds are for public testing
  • Updates push code without rebuilding
  • Use OTA updates for faster iterations
  `);
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    log('build', cmd);
    exec(cmd, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        log('error', \`Build failed: \${error.message}\`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function buildDev() {
  log('build', 'Building development version...');
  
  try {
    // Check dependencies
    if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
      if (process.env.SKIP_INSTALL !== 'true') {
        log('info', 'Installing dependencies...');
        await runCommand('npm install');
      }
    }

    // Run EAS build for development
    log('tunnel', 'Building with tunnel support (internal distribution)...');
    await runCommand('eas build --platform all --profile development');
    
    log('success', 'Development build completed!');
    log('info', 'You can now install and test the build on devices');
    
  } catch (error) {
    log('error', 'Build failed');
    process.exit(1);
  }
}

async function buildPreview() {
  log('build', 'Building preview version...');
  
  try {
    if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
      if (process.env.SKIP_INSTALL !== 'true') {
        log('info', 'Installing dependencies...');
        await runCommand('npm install');
      }
    }

    log('tunnel', 'Building tunnel-enabled preview...');
    await runCommand('eas build --platform all --profile tunnel-preview');
    
    log('success', 'Preview build completed!');
    log('info', 'Share the generated link with testers');
    
  } catch (error) {
    log('error', 'Build failed');
    process.exit(1);
  }
}

async function pushUpdate() {
  const channel = process.env.EXPO_UPDATE_CHANNEL || 'default';
  log('update', \`Pushing update to channel: \${channel}\`);
  
  try {
    if (!fs.existsSync(path.join(__dirname, '../node_modules'))) {
      if (process.env.SKIP_INSTALL !== 'true') {
        log('info', 'Installing dependencies...');
        await runCommand('npm install');
      }
    }

    log('tunnel', 'Publishing code update (no rebuild needed)...');
    await runCommand(\`eas update --platform all --channel \${channel}\`);
    
    log('success', 'Update published successfully!');
    log('info', 'Connected devices will receive the update on next app resume');
    
  } catch (error) {
    log('error', 'Update failed');
    process.exit(1);
  }
}

async function pushUpdateChannel(channel) {
  if (!channel) {
    log('error', 'Channel name required');
    log('info', 'Usage: node scripts/tunnel-build.js update:channel [channel-name]');
    process.exit(1);
  }

  log('update', \`Pushing update to channel: \${channel}\`);
  
  try {
    log('tunnel', 'Publishing to custom channel...');
    await runCommand(\`eas update --platform all --channel \${channel}\`);
    
    log('success', \`Update published to channel: \${channel}\`);
    
  } catch (error) {
    log('error', 'Update failed');
    process.exit(1);
  }
}

function showStatus() {
  log('info', 'Expo Tunnel Build Status\n');
  
  console.log('Configuration:');
  console.log(`  Project: MegaX Employee App`);
  console.log(`  Tunnel Mode: \${process.env.TUNNEL_MODE || 'auto'}\`);
  console.log(`  Update Channel: \${process.env.EXPO_UPDATE_CHANNEL || 'default'}\`);
  console.log(`  Build Profiles: development, tunnel-preview, preview, preview2, production`);
  
  console.log('\nAvailable Profiles:');
  console.log(`  • development    - Internal APK/Simulator build`);
  console.log(`  • tunnel-preview - Tunnel-enabled preview build`);
  console.log(`  • preview        - Standard preview build`);
  console.log(`  • preview2       - Alternative preview build`);
  console.log(`  • production     - Production app-bundle/archive`);
  
  console.log('\nQuick Commands:');
  console.log(`  npm run build:dev        - Build development version`);
  console.log(`  npm run build:tunnel     - Build tunnel preview`);
  console.log(`  npm run tunnel:update    - Push OTA update`);
  
  log('success', 'System ready for tunnel development');
}

function showLogs() {
  log('info', 'Recent Build Logs\n');
  console.log('To view your recent builds:');
  console.log('  eas build:list\n');
  console.log('To view logs for a specific build:');
  console.log('  eas build:view [build-id]\n');
  console.log('Or visit: https://expo.dev/builds');
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command || !COMMANDS[command]) {
    showHelp();
    if (command && !COMMANDS[command]) {
      log('error', \`Unknown command: \${command}\`);
      process.exit(1);
    }
    return;
  }

  try {
    switch (command) {
      case 'build-dev':
        await buildDev();
        break;
      case 'build-preview':
        await buildPreview();
        break;
      case 'update':
        await pushUpdate();
        break;
      case 'update:channel':
        await pushUpdateChannel(args[0]);
        break;
      case 'status':
        showStatus();
        break;
      case 'logs':
        showLogs();
        break;
      case 'help':
        showHelp();
        break;
      default:
        showHelp();
    }
  } catch (error) {
    log('error', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildDev, buildPreview, pushUpdate };
