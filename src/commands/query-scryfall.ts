import { ScryfallAPI } from '../utils/scryfall.js';

export async function queryScryfall(
  cardName: string,
  options: {
    set?: string;
    language?: string;
    collectorNumber?: string;
  }
): Promise<void> {
  console.log(`Querying Scryfall for card: ${cardName}`);

  if (options.set && options.collectorNumber && options.language) {
    // Get specific language version by set and collector number
    console.log(`Fetching ${options.set}/${options.collectorNumber} in language: ${options.language}`);
    const card = await ScryfallAPI.getCardBySetAndNumber(
      options.set,
      options.collectorNumber,
      options.language
    );

    if (card) {
      displayCard(card);
    } else {
      console.log('Card not found');
    }
  } else if (options.language && options.set) {
    // Search for card and get language version
    console.log(`Searching for card in ${options.language}...`);
    
    // First, find the English version to get collector number
    const englishCard = await ScryfallAPI.searchCard(cardName, options.set);
    
    if (!englishCard) {
      console.log('Card not found');
      return;
    }

    console.log(`Found card: ${englishCard.name} (${englishCard.set}/${englishCard.collector_number})`);

    // Get the language version
    const langCard = await ScryfallAPI.getCardBySetAndNumber(
      englishCard.set,
      englishCard.collector_number,
      options.language
    );

    if (langCard) {
      console.log(`\nLanguage version (${options.language}):`);
      displayCard(langCard);
    } else {
      console.log(`Language version not available for ${options.language}`);
      console.log('\nEnglish version:');
      displayCard(englishCard);
    }
  } else {
    // Simple search
    const card = await ScryfallAPI.searchCard(cardName, options.set);
    
    if (card) {
      displayCard(card);
    } else {
      console.log('Card not found');
    }
  }
}

function displayCard(card: any): void {
  console.log('\n--- Card Information ---');
  console.log(`Name: ${card.printed_name || card.name}`);
  console.log(`Type: ${card.printed_type_line || card.type_line}`);
  
  if (card.oracle_text || card.printed_text) {
    console.log(`Text: ${card.printed_text || card.oracle_text}`);
  }
  
  if (card.flavor_text) {
    console.log(`Flavor: ${card.flavor_text}`);
  }
  
  console.log(`Set: ${card.set.toUpperCase()} #${card.collector_number}`);
  console.log(`Language: ${card.lang}`);
  console.log('------------------------\n');
}
