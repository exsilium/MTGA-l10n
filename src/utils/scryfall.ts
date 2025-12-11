import fetch from 'node-fetch';

export interface ScryfallCard {
  name: string;
  printed_name?: string;
  type_line: string;
  printed_type_line?: string;
  oracle_text?: string;
  printed_text?: string;
  flavor_text?: string;
  lang: string;
  set: string;
  collector_number: string;
}

interface ScryfallSearchResponse {
  data?: ScryfallCard[];
  total_cards?: number;
}

export class ScryfallAPI {
  private static readonly BASE_URL = 'https://api.scryfall.com';
  private static readonly RATE_LIMIT_DELAY = 100; // 100ms between requests

  /**
   * Search for a card by name and optional set
   */
  static async searchCard(cardName: string, setCode?: string): Promise<ScryfallCard | null> {
    await this.rateLimit();
    
    let query = `!"${cardName}"`;
    if (setCode) {
      query += ` set:${setCode.toLowerCase()}`;
    }

    const url = `${this.BASE_URL}/cards/search?q=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Scryfall API error: ${response.statusText}`);
      }

      const data = await response.json() as ScryfallSearchResponse;
      if (data.data && data.data.length > 0) {
        return data.data[0];
      }
      return null;
    } catch (error) {
      console.error(`Error searching Scryfall for "${cardName}":`, error);
      return null;
    }
  }

  /**
   * Get a card in a specific language
   */
  static async getCardInLanguage(
    cardName: string,
    setCode: string,
    collectorNumber: string,
    language: string = 'en'
  ): Promise<ScryfallCard | null> {
    await this.rateLimit();

    // First, get the card ID
    const searchUrl = `${this.BASE_URL}/cards/named?exact=${encodeURIComponent(cardName)}`;
    
    try {
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        return null;
      }

      const searchData = await searchResponse.json() as ScryfallCard;
      
      // Now get the specific language version
      await this.rateLimit();
      const langUrl = `${this.BASE_URL}/cards/${setCode.toLowerCase()}/${collectorNumber}/${language}`;
      
      const langResponse = await fetch(langUrl);
      if (!langResponse.ok) {
        return null;
      }

      return await langResponse.json() as ScryfallCard;
    } catch (error) {
      console.error(`Error fetching card in language "${language}":`, error);
      return null;
    }
  }

  /**
   * Get all available printings of a card
   */
  static async getCardPrintings(cardName: string): Promise<ScryfallCard[]> {
    await this.rateLimit();

    const url = `${this.BASE_URL}/cards/search?q=!"${encodeURIComponent(cardName)}"`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return [];
      }

      const data = await response.json() as ScryfallSearchResponse;
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching card printings for "${cardName}":`, error);
      return [];
    }
  }

  /**
   * Get card by set code and collector number
   */
  static async getCardBySetAndNumber(
    setCode: string,
    collectorNumber: string,
    language: string = 'en'
  ): Promise<ScryfallCard | null> {
    await this.rateLimit();

    const url = `${this.BASE_URL}/cards/${setCode.toLowerCase()}/${collectorNumber}/${language}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }

      return await response.json() as ScryfallCard;
    } catch (error) {
      console.error(`Error fetching card ${setCode}/${collectorNumber}:`, error);
      return null;
    }
  }

  /**
   * Rate limiting helper
   */
  private static async rateLimit(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY));
  }
}
