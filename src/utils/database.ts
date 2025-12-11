import Database from 'better-sqlite3';
import { Card, Localization } from '../types/card.js';

export class MTGADatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  /**
   * Get all cards for a specific set
   */
  getCardsBySet(setCode: string): Card[] {
    const stmt = this.db.prepare(
      'SELECT * FROM Cards WHERE ExpansionCode = ? AND IsPrimaryCard = 1'
    );
    return stmt.all(setCode) as Card[];
  }

  /**
   * Get all unique type text IDs from all cards
   */
  getAllTypeTextIds(): number[] {
    const stmt = this.db.prepare('SELECT DISTINCT TypeTextId FROM Cards WHERE TypeTextId > 0');
    const results = stmt.all() as { TypeTextId: number }[];
    return results.map(r => r.TypeTextId);
  }

  /**
   * Get all unique subtype text IDs from all cards
   */
  getAllSubtypeTextIds(): number[] {
    const stmt = this.db.prepare('SELECT DISTINCT SubtypeTextId FROM Cards WHERE SubtypeTextId > 0');
    const results = stmt.all() as { SubtypeTextId: number }[];
    return results.map(r => r.SubtypeTextId);
  }

  /**
   * Get localization by LocId
   */
  getLocalization(locId: number): Localization | undefined {
    const stmt = this.db.prepare('SELECT * FROM Localizations_enUS WHERE LocId = ?');
    return stmt.get(locId) as Localization | undefined;
  }

  /**
   * Get all localizations with a specific formatted value
   */
  getLocalizationsByFormatted(locId: number, formatted: number): Localization | undefined {
    const stmt = this.db.prepare(
      'SELECT * FROM Localizations_enUS WHERE LocId = ? AND Formatted = ?'
    );
    return stmt.get(locId, formatted) as Localization | undefined;
  }

  /**
   * Update or insert a localization
   */
  upsertLocalization(locId: number, formatted: number, loc: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO Localizations_enUS (LocId, Formatted, Loc)
      VALUES (?, ?, ?)
      ON CONFLICT(LocId, Formatted) DO UPDATE SET
        Loc = excluded.Loc
    `);
    stmt.run(locId, formatted, loc);
  }

  /**
   * Begin a transaction
   */
  beginTransaction(): void {
    this.db.prepare('BEGIN TRANSACTION').run();
  }

  /**
   * Commit a transaction
   */
  commitTransaction(): void {
    this.db.prepare('COMMIT').run();
  }

  /**
   * Rollback a transaction
   */
  rollbackTransaction(): void {
    this.db.prepare('ROLLBACK').run();
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }
}
