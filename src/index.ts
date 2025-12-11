#!/usr/bin/env node

import { Command } from 'commander';
import { dumpSet } from './commands/dump-set.js';
import { loadSet } from './commands/load-set.js';
import { queryScryfall } from './commands/query-scryfall.js';

const program = new Command();

// Display disclaimer on startup
console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
console.log('║                         MTGA Localization Tool                            ║');
console.log('║                                                                           ║');
console.log('║  This is a fan-made hobby project created under Wizards of the Coast\'s   ║');
console.log('║  Fan Content Policy. This tool is not affiliated with, endorsed by,      ║');
console.log('║  sponsored by, or specifically approved by Wizards of the Coast LLC.     ║');
console.log('║                                                                           ║');
console.log('║  ⚠️  WARNING: Modifying game client files may violate Arena\'s Terms of   ║');
console.log('║  Service. Use at your own risk. The author takes no responsibility for   ║');
console.log('║  any consequences, including but not limited to account penalties or      ║');
console.log('║  bans that may result from using this tool.                              ║');
console.log('║                                                                           ║');
console.log('║  This tool is provided AS-IS for personal, non-commercial use only.      ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
console.log('');

program
  .name('mtga-l10n')
  .description('Magic: The Gathering Arena localization tool for creating translation mods')
  .version('1.0.0');

program
  .command('dump-set')
  .description('Extract card data from MTGA database and generate POT files for translation')
  .argument('<set-code>', 'Set code (e.g., AFR, MID, VOW)')
  .argument('<source-db>', 'Path to MTGA SQLite database file (e.g., Raw_CardDatabase_*.mtga)')
  .argument('<target-dir>', 'Output directory for POT files')
  .action(async (setCode: string, sourceDb: string, targetDir: string) => {
    try {
      await dumpSet(setCode, sourceDb, targetDir);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('load-set')
  .description('Load translated PO file back into MTGA database')
  .argument('<set-code>', 'Set code (e.g., AFR, MID, VOW)')
  .argument('<source-po>', 'Path to translated PO file (e.g., afr.po)')
  .argument('<target-db>', 'Path to MTGA SQLite database file to update')
  .action(async (setCode: string, sourcePo: string, targetDb: string) => {
    try {
      await loadSet(setCode, sourcePo, targetDb);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('query-card')
  .description('Query Scryfall for card information in different languages')
  .argument('<card-name>', 'Card name to search for')
  .option('-s, --set <code>', 'Filter by set code')
  .option('-l, --language <lang>', 'Get card in specific language (e.g., es, fr, de, ja)')
  .option('-n, --number <num>', 'Collector number')
  .action(async (cardName: string, options: any) => {
    try {
      await queryScryfall(cardName, {
        set: options.set,
        language: options.language,
        collectorNumber: options.number,
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
