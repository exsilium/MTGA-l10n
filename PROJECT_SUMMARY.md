# MTGA-l10n Project Summary

## Overview

MTGA-l10n is a TypeScript-based command-line tool designed to create translation mods for Magic: The Gathering Arena (MTGA). It enables users to extract card text from the game's SQLite database, translate it using standard gettext tools, and load the translations back into the game.

## Architecture

### Technology Stack

- **Language**: TypeScript 5.7+
- **Runtime**: Node.js 18+
- **CLI Framework**: Commander.js 12.1
- **Database**: better-sqlite3 11.8
- **Translation Format**: GNU gettext (POT/PO files)
- **External API**: Scryfall API for card data

### Project Structure

```
MTGA-l10n/
├── src/
│   ├── commands/          # Command implementations
│   │   ├── dump-set.ts    # Extract cards from database
│   │   ├── load-set.ts    # Load translations to database
│   │   └── query-scryfall.ts  # Query Scryfall API
│   ├── types/
│   │   └── card.ts        # TypeScript interfaces
│   ├── utils/
│   │   ├── database.ts    # SQLite operations
│   │   ├── pot-generator.ts   # POT file generation
│   │   ├── po-reader.ts   # PO file parsing
│   │   └── scryfall.ts    # Scryfall API client
│   └── index.ts           # CLI entry point
├── dist/                  # Compiled JavaScript
├── examples/              # Documentation and examples
├── package.json
├── tsconfig.json
└── README.md
```

## Core Features

### 1. Card Data Extraction (dump-set)

Extracts localization data from MTGA's SQLite database and generates POT files.

**What it extracts:**
- Card titles (`TitleId`)
- Card types (`TypeTextId`)
- Card subtypes (`SubtypeTextId`)
- Flavor text (`FlavorTextId`, if > 1)
- Reminder text (`ReminderTextId`, if > 1)
- Ability text (from `AbilityIds` field)

**Output:**
- `{set-code}.pot`: Set-specific translation template
- `types.pot`: Type/subtype translation template (all sets)

**Pontoon Compatibility:**
- Uses `msgctxt` to group related strings
- All strings for a card share context `card-{GrpId}`
- Extracted comments include card metadata and IDs

### 2. Translation Loading (load-set)

Reads translated PO files and updates the database.

**Features:**
- Preserves original `Formatted` values
- Transactional updates (all-or-nothing)
- Automatic loading of types.po if present
- Validates LocId extraction from comments

### 3. Scryfall Integration (query-card)

Queries Scryfall API for card information in multiple languages.

**Capabilities:**
- Search by card name
- Filter by set code
- Retrieve specific language versions
- Display card text and metadata

**Use Cases:**
- Reference translations for AI-assisted work
- Verify official terminology
- Find collector numbers for specific cards

## Database Schema

### Cards Table

Key fields used by the tool:

| Field | Type | Description |
|-------|------|-------------|
| GrpId | INTEGER | Unique card identifier |
| ExpansionCode | TEXT | Three-letter set code |
| TitleId | INTEGER | Reference to title localization |
| TypeTextId | INTEGER | Reference to type localization |
| SubtypeTextId | INTEGER | Reference to subtype localization |
| FlavorTextId | INTEGER | Reference to flavor text (0/1 = none) |
| ReminderTextId | INTEGER | Reference to reminder text (0/1 = none) |
| AbilityIds | TEXT | Comma-separated "abilityId:locId" pairs |
| CollectorNumber | TEXT | Card number in set |

### Localizations_enUS Table

| Field | Type | Description |
|-------|------|-------------|
| LocId | INTEGER | Unique localization identifier |
| Formatted | INTEGER | Format flag (typically 1) |
| Loc | TEXT | The actual text string |

**Important Notes:**
- Multiple entries can share the same LocId with different Formatted values
- The tool preserves the Formatted value when updating translations
- Only the Localizations_enUS table is modified; Cards table is read-only

## Translation Workflow

1. **Extract** → Generate POT files from MTGA database
2. **Translate** → Use Pontoon, Poedit, or manual editing
3. **Query** → (Optional) Get reference translations from Scryfall
4. **Load** → Apply translations back to database
5. **Test** → Launch MTGA and verify translations appear

## Technical Details

### Type Safety

- Full TypeScript strict mode enabled
- Explicit interfaces for all data structures
- No `any` types in production code
- Proper error handling throughout

### Error Handling

- Validates file paths before operations
- Provides clear, actionable error messages
- Uses transactions for database modifications
- Gracefully handles missing data

### Performance Considerations

- Batch database operations with transactions
- Rate limiting for Scryfall API (100ms between requests)
- Efficient POT file generation with Map-based storage
- Single-pass database reads where possible

## Security

- No hardcoded credentials
- Parameterized SQL queries (SQL injection protection)
- No external code execution
- Local file operations only
- Dependencies scanned for vulnerabilities

### Security Scan Results

- **npm audit**: 0 vulnerabilities
- **GitHub Advisory Database**: No known vulnerabilities
- **CodeQL**: 0 alerts

## Legal Considerations

### Fan Content Policy

This project is created under Wizards of the Coast's Fan Content Policy. It is:
- Not official WotC content
- Not affiliated with or endorsed by WotC
- For personal, non-commercial use only
- Clearly marked as fan-created content

### Terms of Service

**Important Warning:** Modifying MTGA client files likely violates the game's Terms of Service. Users should be aware that:
- Account penalties or bans are possible
- Use is entirely at user's own risk
- The tool author accepts no liability
- This is for educational/personal use only

## Development

### Building

```bash
npm install
npm run build
```

### Running

```bash
# After building
node dist/index.js --help

# During development
npm run dev -- --help
```

### Code Quality

- TypeScript strict mode enabled
- Consistent code formatting
- JSDoc comments for public APIs
- Descriptive variable and function names

## Future Enhancements (Potential)

- Support for more localization tables
- Batch processing of multiple sets
- Translation memory integration
- GUI wrapper for non-technical users
- Validation of translation formatting
- Backup and restore functionality
- Automated testing with sample databases

## Contributing

See CONTRIBUTING.md for guidelines on:
- Reporting bugs
- Suggesting features
- Contributing code
- Development setup
- Code style
- Pull request process

## Resources

- **Main Documentation**: README.md
- **Example Workflow**: examples/example-workflow.md
- **Contributing Guide**: CONTRIBUTING.md
- **License**: BSD 2-Clause (see LICENSE file)

## Contact & Support

- **Issues**: GitHub issue tracker
- **Discussions**: GitHub discussions (if enabled)
- **Source Code**: https://github.com/exsilium/MTGA-l10n

## Version History

### v1.0.0 (Initial Release)

- TypeScript CLI tool with commander.js
- dump-set command for extraction
- load-set command for loading translations
- query-card command for Scryfall integration
- Full TypeScript type safety
- Comprehensive documentation
- Security scanning and validation
- Pontoon-compatible POT file generation

## Acknowledgments

- Wizards of the Coast for Magic: The Gathering
- Scryfall for their comprehensive card database API
- The open-source community for the excellent tools used in this project
