import * as gettextParser from 'gettext-parser';
import * as fs from 'fs';

export interface POTranslation {
  msgid: string;
  msgstr: string;
  msgctxt?: string;
  extractedComment?: string;
}

export class POReader {
  /**
   * Read and parse a PO file
   */
  static readPOFile(filePath: string): POTranslation[] {
    const content = fs.readFileSync(filePath);
    const parsed = gettextParser.po.parse(content);
    const translations: POTranslation[] = [];

    // Process translations
    const translationData = parsed.translations[''] || parsed.translations;
    
    for (const context in translationData) {
      const contextData = translationData[context] as any;
      
      for (const msgid in contextData) {
        const entry = contextData[msgid] as any;
        
        // Skip the header entry
        if (msgid === '') continue;
        
        const msgstr = Array.isArray(entry.msgstr) ? entry.msgstr[0] : entry.msgstr;
        
        // Only include entries that have been translated
        if (msgstr && msgstr !== '') {
          translations.push({
            msgid: entry.msgid || msgid,
            msgstr: msgstr,
            msgctxt: entry.msgctxt || context,
            extractedComment: entry.comments?.extracted,
          });
        }
      }
    }

    return translations;
  }

  /**
   * Extract LocId from extracted comment
   * Parses comments like "Card Title | GrpId: 77192 | TitleId: 498563"
   * or "Ability 1 | GrpId: 77192 | AbilityId: 143684 | LocId: 951213"
   */
  static extractLocId(extractedComment?: string): number | null {
    if (!extractedComment) return null;

    // Try to extract TitleId, FlavorTextId, ReminderTextId, or LocId
    const titleMatch = extractedComment.match(/TitleId:\s*(\d+)/);
    if (titleMatch) return parseInt(titleMatch[1], 10);

    const flavorMatch = extractedComment.match(/FlavorTextId:\s*(\d+)/);
    if (flavorMatch) return parseInt(flavorMatch[1], 10);

    const reminderMatch = extractedComment.match(/ReminderTextId:\s*(\d+)/);
    if (reminderMatch) return parseInt(reminderMatch[1], 10);

    const locMatch = extractedComment.match(/LocId:\s*(\d+)/);
    if (locMatch) return parseInt(locMatch[1], 10);

    const typeMatch = extractedComment.match(/TypeTextId:\s*(\d+)/);
    if (typeMatch) return parseInt(typeMatch[1], 10);

    const subtypeMatch = extractedComment.match(/SubtypeTextId:\s*(\d+)/);
    if (subtypeMatch) return parseInt(subtypeMatch[1], 10);

    return null;
  }

  /**
   * Extract Formatted value from the original localization
   * This should be looked up from the database when applying translations
   */
  static extractFormattedValue(extractedComment?: string): number {
    // Default to 1 if not specified
    return 1;
  }
}
