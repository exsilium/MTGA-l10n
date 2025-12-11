import * as path from 'path';
import * as fs from 'fs';
import { MTGADatabase } from '../utils/database.js';
import { POTGenerator } from '../utils/pot-generator.js';

export async function dumpSet(
  setCode: string,
  sourcePath: string,
  targetDir: string
): Promise<void> {
  console.log(`Dumping set ${setCode} from ${sourcePath} to ${targetDir}`);

  // Validate source file exists
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Open database
  const db = new MTGADatabase(sourcePath);

  try {
    // Get cards for the set
    const cards = db.getCardsBySet(setCode.toUpperCase());
    console.log(`Found ${cards.length} cards in set ${setCode}`);

    if (cards.length === 0) {
      console.warn(`No cards found for set ${setCode}`);
      return;
    }

    // Generate POT file for the set
    const setPOT = new POTGenerator(`MTGA-${setCode}`, '1.0.0');
    setPOT.generateFromCards(cards, (locId) => db.getLocalization(locId));
    
    const setOutputPath = path.join(targetDir, `${setCode.toLowerCase()}.pot`);
    setPOT.writeToDisk(setOutputPath);
    console.log(`Generated set POT file: ${setOutputPath}`);

    // Generate types POT file (only if it doesn't exist to avoid regenerating every time)
    const typesOutputPath = path.join(targetDir, 'types.pot');
    if (!fs.existsSync(typesOutputPath)) {
      console.log('Generating types.pot file...');
      const typesPOT = new POTGenerator('MTGA-Types', '1.0.0');
      
      const typeIds = db.getAllTypeTextIds();
      const subtypeIds = db.getAllSubtypeTextIds();
      
      console.log(`Found ${typeIds.length} type IDs and ${subtypeIds.length} subtype IDs`);
      
      typesPOT.generateTypesFile(typeIds, subtypeIds, (locId) => db.getLocalization(locId));
      typesPOT.writeToDisk(typesOutputPath);
      console.log(`Generated types POT file: ${typesOutputPath}`);
    } else {
      console.log('types.pot already exists, skipping...');
    }

    console.log('Dump completed successfully!');
  } finally {
    db.close();
  }
}
