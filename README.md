# MTGA-l10n

Pipeline to locali(s)(z)e Magic: The Gathering Arena Card texts

A command-line tool for creating translation mods for Magic: The Gathering Arena by extracting card text from the game's SQLite database, generating translation templates (POT files), and loading translated text back into the database.

## ⚠️ Important Disclaimers

**Fan Content Policy:** This is a hobby project created under Wizards of the Coast's Fan Content Policy. This tool is not affiliated with, endorsed by, sponsored by, or specifically approved by Wizards of the Coast LLC.

**Terms of Service Warning:** Modifying game client files, even for local translation purposes, likely violates Magic: The Gathering Arena's Terms of Service. **Use this tool at your own risk.** The author takes no responsibility for any consequences, including but not limited to account penalties or bans that may result from using this tool.

**Non-Commercial Use:** This tool is provided AS-IS for personal, non-commercial use only.

## Features

- **Extract card data** from MTGA SQLite database files
- **Generate POT files** compatible with translation tools like Pontoon
- **Load translations** back into the game database
- **Query Scryfall** for card information in multiple languages to assist with translation
- Support for card titles, types, subtypes, abilities, flavor text, and reminder text
- Maintains context grouping for related strings (all text for a single card)

## Installation

```bash
npm install
npm run build
```

## Usage

### Dump Set Command

Extract all card data from a set and generate translation template files:

```bash
node dist/index.js dump-set AFR /path/to/Raw_CardDatabase_*.mtga ./output
```

**Arguments:**
- `<set-code>`: Three-letter set code (e.g., AFR, MID, VOW, NEO)
- `<source-db>`: Path to the MTGA SQLite database file
- `<target-dir>`: Output directory for generated POT files

**Output:**
- `{set-code}.pot`: Translation template for all cards in the set
- `types.pot`: Translation template for card types and subtypes (generated once)

### Load Set Command

Load translated strings back into the game database:

```bash
node dist/index.js load-set AFR ./translations/afr.po /path/to/Raw_CardDatabase_*.mtga
```

**Arguments:**
- `<set-code>`: Three-letter set code
- `<source-po>`: Path to the translated PO file
- `<target-db>`: Path to the MTGA database file to update

**Note:** If a `types.po` file exists in the same directory as the set PO file, it will be loaded automatically.

### Query Card Command

Query Scryfall for card information in different languages:

```bash
# Search for a card
node dist/index.js query-card "Acererak the Archlich"

# Search with set filter
node dist/index.js query-card "Lightning Bolt" --set afr

# Get card in specific language
node dist/index.js query-card "Acererak the Archlich" --set afr --language es

# Get specific printing
node dist/index.js query-card "Lightning Bolt" --set afr --number 87 --language fr
```

**Options:**
- `-s, --set <code>`: Filter by set code
- `-l, --language <lang>`: Get card in specific language (e.g., es, fr, de, ja, ko, ru)
- `-n, --number <num>`: Specify collector number

## Translation Workflow

1. **Extract card data:**
   ```bash
   node dist/index.js dump-set AFR /path/to/database.mtga ./pot-files
   ```

2. **Translate the POT files:**
   - Use a translation tool like Pontoon, Poedit, or any gettext-compatible editor
   - Rename `.pot` files to `.po` files
   - Translate the strings

3. **Query Scryfall for reference translations** (optional):
   ```bash
   node dist/index.js query-card "Card Name" --set AFR --language es
   ```

4. **Load translations back:**
   ```bash
   node dist/index.js load-set AFR ./translations/afr.po /path/to/database.mtga
   ```

5. **Test in-game** with the modified database

## POT File Structure

The generated POT files use context (`msgctxt`) to group related strings, which is compatible with Pontoon's sibling strings feature. Each card's strings share a context in the format `card-{GrpId}`.

Example entry:
```
#. Card Title | GrpId: 77192 | TitleId: 498563
#: AFR/87
msgctxt "card-77192"
msgid "Acererak the Archlich"
msgstr ""
```

The extracted comment includes:
- String type (Title, Ability, Flavor Text, etc.)
- Internal IDs for reference
- Set code and collector number

## Database Structure

The tool works with MTGA's SQLite database format:

- **Cards table**: Contains card metadata including IDs for localized strings
- **Localizations_enUS table**: Contains the actual text strings

Each localization entry has:
- `LocId`: Unique identifier for the string
- `Formatted`: Format flag (typically 1 for formatted text)
- `Loc`: The actual text string

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm run dev -- dump-set AFR ./test.db ./output

# Clean build artifacts
npm run clean
```

## Dependencies

- **commander**: Command-line argument parsing
- **better-sqlite3**: SQLite database access
- **gettext-parser**: POT/PO file parsing and generation
- **node-fetch**: HTTP client for Scryfall API

## License

BSD 2-Clause License - See LICENSE file for details

## Credits

- Magic: The Gathering and Arena are trademarks of Wizards of the Coast LLC
- Card data retrieved via [Scryfall API](https://scryfall.com)
- Translation file format based on GNU gettext
