#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query, defaultValue = '') =>
  new Promise((resolve) => {
    rl.question(defaultValue ? `${query} (${defaultValue}): ` : `${query}: `, (ans) => {
      resolve(ans.trim() || defaultValue);
    });
  });

async function main() {
  console.log('==================================================');
  console.log('   Tauri Desktop App Release JSON Updater');
  console.log('==================================================\n');

  // List existing JSON files in root
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.json') && f !== 'package.json' && f !== 'package-lock.json');

  if (files.length === 0) {
    console.log('No updater JSON files found in current directory.');
    rl.close();
    return;
  }

  console.log('Available updater JSON files:');
  files.forEach((f, idx) => console.log(` [${idx + 1}] ${f}`));

  const fileChoice = await ask('\nSelect file number to update or type filename', '1');
  let targetFile = files[0];
  const num = parseInt(fileChoice, 10);
  if (!isNaN(num) && num >= 1 && num <= files.length) {
    targetFile = files[num - 1];
  } else if (files.includes(fileChoice)) {
    targetFile = fileChoice;
  } else if (fileChoice.endsWith('.json')) {
    targetFile = fileChoice;
  }

  const filePath = path.join(rootDir, targetFile);
  let currentData = {
    version: 'v1.0.0',
    notes: 'Release update',
    pub_date: new Date().toISOString(),
    platforms: {
      'windows-x86_64': {
        signature: '',
        url: ''
      }
    }
  };

  if (fs.existsSync(filePath)) {
    try {
      currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.warn(`Could not parse ${targetFile}, creating new structure.`);
    }
  }

  console.log(`\nEditing: ${targetFile}`);
  console.log(`Current Version: ${currentData.version || 'none'}`);

  const version = await ask('New Version (e.g. v1.1.2 or 1.1.2)', currentData.version || 'v1.0.0');
  const notes = await ask('Release Notes', currentData.notes || `Update for version ${version}`);
  const defaultUrl = currentData.platforms?.['windows-x86_64']?.url || '';
  const url = await ask('Download URL (.exe or .msi or .zip)', defaultUrl);

  console.log('\n--- Signature ---');
  console.log('Provide either the base64 signature string, or the path to a .sig file.');
  const sigInput = await ask('Signature (paste string or path to .sig)', currentData.platforms?.['windows-x86_64']?.signature || '');

  let signature = sigInput;
  if (sigInput && fs.existsSync(sigInput)) {
    try {
      signature = fs.readFileSync(sigInput, 'utf-8').trim();
      console.log(`Loaded signature from file: ${sigInput}`);
    } catch (e) {
      console.warn(`Failed reading file, using input as raw string.`);
    }
  }

  const updatedData = {
    version: version.startsWith('v') ? version : `v${version}`,
    notes: notes,
    pub_date: new Date().toISOString(),
    platforms: {
      ...(currentData.platforms || {}),
      'windows-x86_64': {
        signature: signature,
        url: url
      }
    }
  };

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2) + '\n', 'utf-8');

  console.log('\n✅ Successfully updated ' + targetFile + ':\n');
  console.log(JSON.stringify(updatedData, null, 2));
  console.log('\nCommit and push your changes to GitHub to publish the update!\n');

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
