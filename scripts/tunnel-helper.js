#!/usr/bin/env node

/**
 * Expo Tunnel Configuration Helper
 * Helps manage tunnel settings, monitor connection, and troubleshoot issues
 * 
 * Usage: node scripts/tunnel-helper.js [command]
 * Commands:
 *   status          - Check tunnel status and connection
 *   config          - Show current tunnel configuration
 *   reset           - Reset tunnel settings
 *   help            - Show help information
 */

const fs = require('fs');
const path = require('path');

const COMMANDS = {
  status: 'Check tunnel connection status',
  config: 'Display current tunnel configuration',
  reset: 'Reset tunnel configuration to defaults',
  help: 'Show help information'
};

const tunnelConfig = {
  connectionMode: 'tunnel',
  updateCheckFrequency: 'ON_APP_RESUME',
  updateFallbackTimeout: 30000,
  verbose: false,
  clearOnStart: false
};

function showHelp() {
  console.log(`
🌐 Expo Tunnel Configuration Helper

Usage: node scripts/tunnel-helper.js [command]

Commands:
${Object.entries(COMMANDS)
  .map(([cmd, desc]) => `  ${cmd.padEnd(12)} - ${desc}`)
  .join('\n')}

Examples:
  node scripts/tunnel-helper.js status      # Check tunnel status
  node scripts/tunnel-helper.js config      # Show configuration
  node scripts/tunnel-helper.js reset       # Reset to defaults

Environment Variables:
  TUNNEL_MODE=tunnel|lan|localhost
  EXPO_DEV_SERVER_URL=your-custom-url
  EXPO_UPDATE_CHANNEL=channel-name

For more information, see TUNNEL_SETUP.md
  `);
}

function showStatus() {
  console.log(`
📊 Tunnel Connection Status

Connection Mode: ${process.env.TUNNEL_MODE || 'auto'}
Update Channel: ${process.env.EXPO_UPDATE_CHANNEL || 'default'}
Verbose Mode: ${tunnelConfig.verbose ? 'enabled' : 'disabled'}

Quick Start Commands:
  npm run start:tunnel      - Start with tunnel
  npm run start:lan         - Start with LAN (same network)
  npm run android:tunnel    - Start tunnel on Android
  npm run ios:tunnel        - Start tunnel on iOS

Platform Availability:
  ✓ Android - Supported
  ✓ iOS - Supported
  ✓ Web - Tunnel not needed (local HTTP)

Tips:
  • Use tunnel for remote testing
  • Use LAN for best performance on same network
  • Check firewall if tunnel fails
  `);
}

function showConfig() {
  console.log(`
⚙️  Tunnel Configuration

Current Settings:
${Object.entries(tunnelConfig)
  .map(([key, value]) => `  ${key.padEnd(20)} : ${JSON.stringify(value)}`)
  .join('\n')}

Environment Variables:
${['TUNNEL_MODE', 'EXPO_DEV_SERVER_URL', 'EXPO_UPDATE_CHANNEL']
  .map(env => `  ${env.padEnd(25)} : ${process.env[env] || 'not set'}`)
  .join('\n')}

Configuration Files:
  app.json           - Main Expo configuration
  eas.json           - EAS build profiles
  package.json       - NPM scripts
  .env.example       - Environment variable template

To modify:
  1. Edit app.json for expo config changes
  2. Edit eas.json for build profile changes
  3. Create .env file from .env.example for environment variables
  `);
}

function resetConfig() {
  console.log(`
🔄 Resetting Tunnel Configuration

This will reset tunnel settings to defaults.

Default Settings:
  Connection Mode        : tunnel
  Update Frequency       : ON_APP_RESUME
  Update Timeout         : 30000ms
  Verbose Logging        : false

Next Steps:
  1. Run: npm install
  2. Start tunnel: npm run start:tunnel
  3. Check status: node scripts/tunnel-helper.js status

  `);
}

function main() {
  const command = process.argv[2] || 'help';

  if (!COMMANDS[command]) {
    console.error(`❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
  }

  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'status':
      showStatus();
      break;
    case 'config':
      showConfig();
      break;
    case 'reset':
      resetConfig();
      break;
    default:
      showHelp();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { tunnelConfig, COMMANDS };
