#!/usr/bin/env node

/**
 * Expo Tunnel Setup Verification Script
 * Verifies that all tunnel components are properly configured
 * 
 * Usage: node scripts/verify-tunnel-setup.js
 */

const fs = require('fs');
const path = require('path');

const checks = {
  'Configuration Files': [
    ['app.json', 'Main Expo configuration'],
    ['eas.json', 'EAS build profiles'],
    ['package.json', 'npm scripts'],
  ],
  'Documentation': [
    ['TUNNEL_SETUP.md', 'Complete tunnel guide'],
    ['TUNNEL_QUICK_REFERENCE.md', 'Quick reference'],
    ['PACKAGING_MANIFEST.md', 'Package overview'],
    ['.env.example', 'Environment template'],
  ],
  'Scripts': [
    ['scripts/tunnel-helper.js', 'Helper utility'],
    ['scripts/tunnel-build.js', 'Build manager'],
  ],
  'Templates': [
    ['config-templates/README.md', 'Template guide'],
    ['config-templates/tunnel-dev.env', 'Dev template'],
    ['config-templates/tunnel-team.env', 'Team template'],
    ['config-templates/lan-dev.env', 'LAN template'],
    ['config-templates/localhost-dev.env', 'Localhost template'],
  ],
  'CI/CD': [
    ['.github/workflows/eas-build.yml', 'GitHub Actions workflow'],
  ]
};

function checkExists(filePath) {
  return fs.existsSync(path.resolve(filePath));
}

function verify() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║    Expo Tunnel Setup Verification                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let allGood = true;
  let totalChecks = 0;
  let passedChecks = 0;

  for (const [category, files] of Object.entries(checks)) {
    console.log(`📁 ${category}`);
    console.log('─'.repeat(60));

    for (const [file, description] of files) {
      totalChecks++;
      const exists = checkExists(file);
      const status = exists ? '✅' : '❌';
      const statusText = exists ? 'Found' : 'Missing';

      console.log(`${status} ${file.padEnd(40)} ${statusText}`);
      console.log(`   └─ ${description}`);

      if (exists) {
        passedChecks++;
      } else {
        allGood = false;
      }
    }
    console.log('');
  }

  // Check npm scripts
  console.log('📦 npm Scripts');
  console.log('─'.repeat(60));
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = [
    'start:tunnel',
    'android:tunnel',
    'ios:tunnel',
    'build:tunnel',
    'tunnel:update'
  ];

  let allScriptsPresent = true;
  for (const script of requiredScripts) {
    const exists = packageJson.scripts[script] !== undefined;
    const status = exists ? '✅' : '❌';
    console.log(`${status} npm run ${script}`);
    if (!exists) allScriptsPresent = false;
  }
  console.log('');

  // Summary
  console.log('╔════════════════════════════════════════════════════════════╗');
  if (allGood && allScriptsPresent) {
    console.log('║ ✅ Setup Complete! All components verified.               ║');
  } else {
    console.log('║ ⚠️  Some components are missing. See above for details.    ║');
  }
  console.log(`║ Status: ${passedChecks}/${totalChecks} files verified        ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Quick start
  console.log('🚀 Quick Start:\n');
  console.log('  1. npm install');
  console.log('  2. cp .env.example .env');
  console.log('  3. npm run start:tunnel');
  console.log('  4. Scan QR code with Expo Go app\n');

  // Next steps
  console.log('📚 Next Steps:\n');
  console.log('  Read the guides:');
  console.log('  • TUNNEL_QUICK_REFERENCE.md - Quick commands');
  console.log('  • TUNNEL_SETUP.md - Complete guide');
  console.log('  • PACKAGING_MANIFEST.md - Package overview\n');

  // Helper commands
  console.log('🛠️  Useful Commands:\n');
  console.log('  node scripts/tunnel-helper.js status   # Check status');
  console.log('  node scripts/tunnel-helper.js config   # View config');
  console.log('  node scripts/tunnel-build.js status    # Check build status\n');

  return allGood && allScriptsPresent;
}

// Run verification
if (require.main === module) {
  const success = verify();
  process.exit(success ? 0 : 1);
}

module.exports = { verify };
