#!/usr/bin/env node

/**
 * EAS Build Setup Helper
 * Provides quick options for building and testing the app
 */

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = [
  '1. Build Android APK (Local - Recommended for dev)',
  '2. Build iOS Simulator (Local - Mac Only)',
  '3. Build Android APK (EAS Cloud - Counts against plan)',
  '4. Build iOS Simulator (EAS Cloud - Counts against plan)',
  '5. Start Expo Go (Best for quick testing)',
  '6. View EAS Build List',
  '7. Exit',
];

console.clear();
console.log('\n=== MegaX Employee App - Build Helper ===\n');
console.log('Choose a build option:\n');
options.forEach((opt) => console.log(opt));

rl.question('\nEnter your choice (1-7): ', (answer) => {
  rl.close();

  const commands = {
    1: { cmd: 'npm run android', desc: 'Building Android locally...' },
    2: { cmd: 'npm run ios', desc: 'Building iOS locally...' },
    3: { cmd: 'npm run preview:android', desc: 'Building Android APK via EAS...' },
    4: { cmd: 'npm run preview:ios', desc: 'Building iOS via EAS...' },
    5: { cmd: 'npm start', desc: 'Starting Expo Go...' },
    6: { cmd: 'eas build:list', desc: 'Fetching build list...' },
    7: { cmd: null, desc: 'Exiting...' },
  };

  const choice = commands[answer];

  if (!choice) {
    console.log('\n❌ Invalid choice. Please run again and select 1-7.');
    process.exit(1);
  }

  if (answer === '7') {
    console.log('\n✅ Goodbye!\n');
    process.exit(0);
  }

  console.log(`\n✨ ${choice.desc}\n`);

  // Change to the correct directory if needed
  const projectDir = __dirname;

  exec(choice.cmd, { cwd: projectDir, stdio: 'inherit' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
    if (stderr) {
      console.error(`\nWarning: ${stderr}`);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
});
