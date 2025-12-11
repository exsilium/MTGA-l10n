import * as gettextParser from 'gettext-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Card, Localization, AbilityIdEntry } from '../types/card.js';

interface POTEntry {
  msgid: string;
  msgstr: string[];
  comments: {
    translator?: string;
    reference?: string;
    extracted?: string;
    flag?: string;
    previous?: string;
  };
  msgctxt?: string;
}

export class POTGenerator {
  private translations: Map<string, POTEntry> = new Map();
  private headers: Record<string, string>;

  constructor(projectName: string, version: string = '1.0.0') {
    this.headers = {
      'Project-Id-Version': `${projectName} ${version}`,
      'Report-Msgid-Bugs-To': '',
      'POT-Creation-Date': new Date().toISOString(),
      'PO-Revision-Date': 'YEAR-MO-DA HO:MI+ZONE',
      'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
      'Language-Team': 'LANGUAGE <LL@li.org>',
      'Language': '',
      'MIME-Version': '1.0',
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Transfer-Encoding': '8bit',
    };
  }

  /**
   * Add a translation entry with context for Pontoon
   * Context allows Pontoon to group related strings (e.g., all strings for one card)
   */
  addEntry(
    msgid: string,
    msgctxt: string,
    extractedComment: string,
    reference?: string
  ): void {
    const key = msgctxt ? `${msgctxt}\x04${msgid}` : msgid;
    
    this.translations.set(key, {
      msgid,
      msgstr: [''],
      comments: {
        extracted: extractedComment,
        reference: reference,
      },
      msgctxt,
    });
  }

  /**
   * Generate POT content from cards
   */
  generateFromCards(
    cards: Card[],
    getLocalization: (locId: number) => Localization | undefined
  ): void {
    for (const card of cards) {
      const context = `card-${card.GrpId}`;
      const reference = `${card.ExpansionCode}/${card.CollectorNumber}`;

      // Add title
      const titleLoc = getLocalization(card.TitleId);
      if (titleLoc) {
        this.addEntry(
          titleLoc.Loc,
          context,
          `Card Title | GrpId: ${card.GrpId} | TitleId: ${card.TitleId}`,
          reference
        );
      }

      // Add flavor text if present
      if (card.FlavorTextId > 1) {
        const flavorLoc = getLocalization(card.FlavorTextId);
        if (flavorLoc) {
          this.addEntry(
            flavorLoc.Loc,
            context,
            `Flavor Text | GrpId: ${card.GrpId} | FlavorTextId: ${card.FlavorTextId}`,
            reference
          );
        }
      }

      // Add reminder text if present
      if (card.ReminderTextId > 1) {
        const reminderLoc = getLocalization(card.ReminderTextId);
        if (reminderLoc) {
          this.addEntry(
            reminderLoc.Loc,
            context,
            `Reminder Text | GrpId: ${card.GrpId} | ReminderTextId: ${card.ReminderTextId}`,
            reference
          );
        }
      }

      // Add abilities
      if (card.AbilityIds) {
        const abilities = this.parseAbilityIds(card.AbilityIds);
        abilities.forEach((ability, index) => {
          const abilityLoc = getLocalization(ability.locId);
          if (abilityLoc) {
            this.addEntry(
              abilityLoc.Loc,
              context,
              `Ability ${index + 1} | GrpId: ${card.GrpId} | AbilityId: ${ability.abilityId} | LocId: ${ability.locId}`,
              reference
            );
          }
        });
      }
    }
  }

  /**
   * Generate POT content for types
   */
  generateTypesFile(
    typeIds: number[],
    subtypeIds: number[],
    getLocalization: (locId: number) => Localization | undefined
  ): void {
    // Add types
    for (const typeId of typeIds) {
      const typeLoc = getLocalization(typeId);
      if (typeLoc) {
        this.addEntry(
          typeLoc.Loc,
          'types',
          `Type | TypeTextId: ${typeId}`,
          'types'
        );
      }
    }

    // Add subtypes
    for (const subtypeId of subtypeIds) {
      const subtypeLoc = getLocalization(subtypeId);
      if (subtypeLoc) {
        this.addEntry(
          subtypeLoc.Loc,
          'subtypes',
          `Subtype | SubtypeTextId: ${subtypeId}`,
          'subtypes'
        );
      }
    }
  }

  /**
   * Parse ability IDs string (format: "abilityId:locId,abilityId:locId,...")
   */
  private parseAbilityIds(abilityIdsStr: string): AbilityIdEntry[] {
    if (!abilityIdsStr) return [];
    
    return abilityIdsStr.split(',').map(pair => {
      const [abilityId, locId] = pair.split(':').map(Number);
      return { abilityId, locId };
    });
  }

  /**
   * Write POT file to disk
   */
  writeToDisk(outputPath: string): void {
    const data = {
      charset: 'UTF-8',
      headers: this.headers,
      translations: {
        '': this.convertToGettextFormat(),
      },
    };

    const output = gettextParser.po.compile(data);
    fs.writeFileSync(outputPath, output);
  }

  /**
   * Convert internal format to gettext format
   */
  private convertToGettextFormat(): Record<string, any> {
    const result: Record<string, any> = {};
    
    this.translations.forEach((entry, key) => {
      const gettextEntry: any = {
        msgid: entry.msgid,
        msgstr: entry.msgstr,
        comments: {},
      };

      if (entry.msgctxt) {
        gettextEntry.msgctxt = entry.msgctxt;
      }

      if (entry.comments.extracted) {
        gettextEntry.comments.extracted = entry.comments.extracted;
      }

      if (entry.comments.reference) {
        gettextEntry.comments.reference = entry.comments.reference;
      }

      result[entry.msgctxt || ''] = result[entry.msgctxt || ''] || {};
      result[entry.msgctxt || ''][entry.msgid] = gettextEntry;
    });

    // Flatten the structure for gettext-parser
    const flattened: Record<string, any> = { '': { msgid: '', msgstr: [''] } };
    
    this.translations.forEach(entry => {
      const key = entry.msgctxt ? `${entry.msgctxt}\x04${entry.msgid}` : entry.msgid;
      flattened[key] = {
        msgid: entry.msgid,
        msgstr: entry.msgstr,
        msgctxt: entry.msgctxt,
        comments: entry.comments,
      };
    });

    return flattened;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.translations.clear();
  }
}
