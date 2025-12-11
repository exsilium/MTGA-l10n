import * as path from 'path';
import * as fs from 'fs';
import { MTGADatabase } from '../utils/database.js';
import { POReader } from '../utils/po-reader.js';

export async function loadSet(
  setCode: string,
  sourcePOPath: string,
  targetDBPath: string
): Promise<void> {
  console.log(`Loading translations for set ${setCode} from ${sourcePOPath} to ${targetDBPath}`);

  // Validate source PO file exists
  if (!fs.existsSync(sourcePOPath)) {
    throw new Error(`Source PO file not found: ${sourcePOPath}`);
  }

  // Validate target database exists
  if (!fs.existsSync(targetDBPath)) {
    throw new Error(`Target database file not found: ${targetDBPath}`);
  }

  // Read PO file
  console.log(`Reading PO file: ${sourcePOPath}`);
  const translations = POReader.readPOFile(sourcePOPath);
  console.log(`Found ${translations.length} translations in PO file`);

  // Check for types.po in the same directory
  const sourceDir = path.dirname(sourcePOPath);
  const typesPOPath = path.join(sourceDir, 'types.po');
  let typesTranslations: typeof translations = [];
  
  if (fs.existsSync(typesPOPath)) {
    console.log(`Reading types PO file: ${typesPOPath}`);
    typesTranslations = POReader.readPOFile(typesPOPath);
    console.log(`Found ${typesTranslations.length} type/subtype translations`);
  } else {
    console.log('types.po not found, skipping type/subtype translations');
  }

  // Combine translations
  const allTranslations = [...translations, ...typesTranslations];

  // Open database
  const db = new MTGADatabase(targetDBPath);

  try {
    // Begin transaction
    db.beginTransaction();

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each translation
    for (const translation of allTranslations) {
      const locId = POReader.extractLocId(translation.extractedComment);
      
      if (locId === null) {
        console.warn(`Could not extract LocId from comment: ${translation.extractedComment}`);
        skippedCount++;
        continue;
      }

      // Get the original localization to preserve the Formatted value
      const originalLoc = db.getLocalization(locId);
      
      if (!originalLoc) {
        console.warn(`Original localization not found for LocId ${locId}, skipping...`);
        skippedCount++;
        continue;
      }

      // Update the localization with the translated text
      db.upsertLocalization(locId, originalLoc.Formatted, translation.msgstr);
      updatedCount++;
    }

    // Commit transaction
    db.commitTransaction();

    console.log(`Load completed successfully!`);
    console.log(`Updated: ${updatedCount} entries`);
    console.log(`Skipped: ${skippedCount} entries`);
  } catch (error) {
    // Rollback on error
    db.rollbackTransaction();
    throw error;
  } finally {
    db.close();
  }
}
