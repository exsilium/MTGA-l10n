# Example Translation Workflow

This document provides a detailed walkthrough of the translation workflow using the MTGA-l10n tool.

## Prerequisites

1. A copy of the MTGA database file (typically found in your MTGA installation directory)
   - Path example: `%APPDATA%\..\LocalLow\Wizards Of The Coast\MTGA\`
   - File pattern: `Raw_CardDatabase_*.mtga`
2. Node.js 18+ installed
3. This tool built and ready to use

## Step 1: Extract Card Data

Extract all cards from the Adventures in the Forgotten Realms (AFR) set:

```bash
node dist/index.js dump-set AFR C:/MTGA/Raw_CardDatabase_22df27f4a70bcc34335164f2cb65717e.mtga ./translations
```

This creates:
- `translations/afr.pot` - Translation template for AFR cards
- `translations/types.pot` - Translation template for card types/subtypes (created once)

## Step 2: Prepare for Translation

Rename the `.pot` files to `.po` files:

```bash
cd translations
cp afr.pot afr.po
cp types.pot types.po
```

## Step 3: Translate Using Your Preferred Tool

### Option A: Using Poedit

1. Open `afr.po` in [Poedit](https://poedit.net/)
2. Set your target language (e.g., Estonian, Spanish, etc.)
3. Translate each string

### Option B: Using Pontoon

1. Import the PO files into your Pontoon instance
2. The context grouping will keep all strings for each card together
3. Translate strings with reference to the context

### Option C: Using a Text Editor

You can edit PO files directly:

```po
#. Card Title | GrpId: 77192 | TitleId: 498563
#: AFR/87
msgctxt "card-77192"
msgid "Acererak the Archlich"
msgstr "Acererak Arhlits"  # Add your translation here
```

## Step 4: Get Reference Translations (Optional)

Query Scryfall for official translations in other languages:

```bash
# Get Spanish version
node dist/index.js query-card "Acererak the Archlich" --set afr --language es

# Get French version
node dist/index.js query-card "Acererak the Archlich" --set afr --language fr
```

This helps when:
- Your target language is similar to an official language
- You want to check official terminology
- You're doing AI-assisted translation and need reference text

## Step 5: Load Translations Back

**IMPORTANT**: Make a backup of your database file first!

```bash
# Backup
cp Raw_CardDatabase_22df27f4a70bcc34335164f2cb65717e.mtga Raw_CardDatabase_22df27f4a70bcc34335164f2cb65717e.mtga.backup

# Load translations
node dist/index.js load-set AFR ./translations/afr.po C:/MTGA/Raw_CardDatabase_22df27f4a70bcc34335164f2cb65717e.mtga
```

The tool will automatically load `types.po` from the same directory if it exists.

## Step 6: Test In-Game

1. Close MTGA completely
2. Replace the database file with your modified version
3. Launch MTGA and check if your translations appear

## Example POT File Structure

Here's what the generated POT file looks like:

```po
# SOME DESCRIPTIVE TITLE.
# Copyright (C) YEAR THE PACKAGE'S COPYRIGHT HOLDER
# This file is distributed under the same license as the MTGA-AFR package.
# FIRST AUTHOR <EMAIL@ADDRESS>, YEAR.
#
msgid ""
msgstr ""
"Project-Id-Version: MTGA-AFR 1.0.0\n"
"Report-Msgid-Bugs-To: \n"
"POT-Creation-Date: 2025-12-11T09:00:00.000Z\n"
"Content-Type: text/plain; charset=UTF-8\n"

#. Card Title | GrpId: 77192 | TitleId: 498563
#: AFR/87
msgctxt "card-77192"
msgid "Acererak the Archlich"
msgstr ""

#. Ability 1 | GrpId: 77192 | AbilityId: 143684 | LocId: 951213
#: AFR/87
msgctxt "card-77192"
msgid "When Acererak enters, if you haven't completed Tomb of Annihilation, return Acererak to its owner's hand and venture into the dungeon."
msgstr ""

#. Ability 2 | GrpId: 77192 | AbilityId: 143685 | LocId: 951214
#: AFR/87
msgctxt "card-77192"
msgid "Whenever Acererak attacks, for each opponent, you create a 2/2 black Zombie creature token unless that player sacrifices a creature."
msgstr ""
```

## Tips for Translation

1. **Preserve Formatting**: Keep any special characters or formatting in the original text
2. **Card Terminology**: Be consistent with card type terminology (Creature, Instant, Sorcery, etc.)
3. **Mana Symbols**: These are usually kept as-is (e.g., {T}, {2}, {U}{B})
4. **Keyword Abilities**: Consider keeping English keywords if no official translation exists
5. **Context Matters**: Use the context (card-XXX) to see all related strings together
6. **Reference Comments**: The extracted comments show you what type of string you're translating

## Troubleshooting

### "Source file not found" error
- Check that the database file path is correct
- Make sure you're using the absolute path or correct relative path

### "No cards found for set" warning
- Verify the set code is correct (case-insensitive, e.g., AFR, MID, VOW)
- The set might not be in your database file

### Translations not appearing in-game
- Ensure MTGA is completely closed before replacing the database
- Verify the database file was actually replaced
- Check that your translations were actually saved in the PO file (msgstr not empty)

### Database locked error
- Close MTGA completely
- No other tools should have the database open
- Try running the command again

## Advanced: Batch Processing

To translate multiple sets at once:

```bash
# Extract all sets
node dist/index.js dump-set AFR ./db.mtga ./translations
node dist/index.js dump-set MID ./db.mtga ./translations
node dist/index.js dump-set VOW ./db.mtga ./translations

# After translation...
node dist/index.js load-set AFR ./translations/afr.po ./db.mtga
node dist/index.js load-set MID ./translations/mid.po ./db.mtga
node dist/index.js load-set VOW ./translations/vow.po ./db.mtga
```

## Getting Help

If you encounter issues:

1. Check the error message - they usually indicate what went wrong
2. Verify all file paths are correct
3. Ensure you have the necessary permissions to read/write files
4. Check the GitHub issues for similar problems
