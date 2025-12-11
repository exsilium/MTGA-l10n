# Contributing to MTGA-l10n

Thank you for your interest in contributing to MTGA-l10n! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and constructive
- Focus on the project goals
- Help others learn and grow
- Remember this is a hobby project for fun

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior vs actual behavior
- Your environment (OS, Node.js version, etc.)
- Any relevant error messages or logs

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear description of the feature
- Why it would be useful
- Any examples or mockups if applicable
- Consider how it fits with the project goals

### Contributing Code

1. **Fork the repository** and create a new branch for your feature or fix
2. **Install dependencies**: `npm install`
3. **Make your changes** following the code style
4. **Build the project**: `npm run build`
5. **Test your changes** manually
6. **Commit your changes** with a clear commit message
7. **Push to your fork** and create a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Git

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MTGA-l10n.git
cd MTGA-l10n

# Install dependencies
npm install

# Build the project
npm run build

# Test the CLI
node dist/index.js --help
```

### Project Structure

```
MTGA-l10n/
├── src/                    # TypeScript source code
│   ├── commands/          # CLI command implementations
│   │   ├── dump-set.ts    # Extract cards to POT files
│   │   ├── load-set.ts    # Load translations back to database
│   │   └── query-scryfall.ts # Scryfall API queries
│   ├── types/             # TypeScript type definitions
│   │   └── card.ts        # Card and localization interfaces
│   ├── utils/             # Utility modules
│   │   ├── database.ts    # SQLite database operations
│   │   ├── pot-generator.ts # POT file generation
│   │   ├── po-reader.ts   # PO file parsing
│   │   └── scryfall.ts    # Scryfall API client
│   └── index.ts           # Main CLI entry point
├── dist/                   # Compiled JavaScript (generated)
├── examples/              # Example workflows and documentation
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Main documentation
```

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode (already configured)
- Define interfaces for all data structures
- Use explicit return types for functions
- Prefer async/await over callbacks
- Use descriptive variable and function names

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add JSDoc comments for public APIs
- Keep functions focused and small

### Example

```typescript
/**
 * Get all cards for a specific set
 * @param setCode - Three-letter set code (e.g., 'AFR')
 * @returns Array of card objects
 */
getCardsBySet(setCode: string): Card[] {
  const stmt = this.db.prepare(
    'SELECT * FROM Cards WHERE ExpansionCode = ? AND IsPrimaryCard = 1'
  );
  return stmt.all(setCode) as Card[];
}
```

## Testing

Currently, the project uses manual testing. When adding new features:

1. Test with real MTGA database files (if available)
2. Test error handling with invalid inputs
3. Verify output file formats are correct
4. Check that existing functionality still works

### Test Checklist for PRs

- [ ] Build completes without errors
- [ ] Help commands display correctly
- [ ] Error messages are clear and helpful
- [ ] Edge cases are handled
- [ ] Documentation is updated if needed

## Adding New Features

### Adding a New Command

1. Create a new file in `src/commands/`
2. Implement the command logic
3. Export an async function
4. Add the command to `src/index.ts` using Commander.js
5. Update the README with usage information

Example:

```typescript
// src/commands/my-feature.ts
export async function myFeature(param: string): Promise<void> {
  console.log(`Executing my feature with ${param}`);
  // Implementation here
}

// src/index.ts
import { myFeature } from './commands/my-feature.js';

program
  .command('my-feature')
  .description('Description of my feature')
  .argument('<param>', 'Parameter description')
  .action(async (param: string) => {
    try {
      await myFeature(param);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
```

### Adding New Utilities

1. Create a new file in `src/utils/`
2. Export classes or functions
3. Add TypeScript types/interfaces
4. Document the public API with JSDoc
5. Use the utility in your commands

## Documentation

When adding or changing features:

- Update the README.md with new commands or options
- Add examples to the examples/ directory
- Update this CONTRIBUTING.md if development process changes
- Add inline code comments for complex logic

## Dependencies

### Adding New Dependencies

Before adding a new dependency:
1. Check if existing dependencies can solve the problem
2. Consider the package size and maintenance status
3. Prefer well-maintained packages with TypeScript support
4. Add types packages to devDependencies if needed

```bash
# Add a runtime dependency
npm install package-name

# Add a development dependency
npm install --save-dev @types/package-name
```

### Current Dependencies

- **commander**: CLI argument parsing
- **better-sqlite3**: SQLite database access
- **gettext-parser**: POT/PO file handling
- **node-fetch**: HTTP requests for Scryfall API

## Database Schema

When working with MTGA database files, note:

### Cards Table
- `GrpId`: Unique card identifier
- `ExpansionCode`: Three-letter set code
- `TitleId`, `TypeTextId`, `SubtypeTextId`: References to Localizations table
- `FlavorTextId`, `ReminderTextId`: Optional localization references
- `AbilityIds`: Comma-separated "abilityId:locId" pairs

### Localizations_enUS Table
- `LocId`: Unique localization identifier
- `Formatted`: Format flag (typically 1)
- `Loc`: The actual text string

## Pull Request Process

1. Update documentation for any new features
2. Ensure the build succeeds
3. Describe your changes clearly in the PR description
4. Reference any related issues
5. Be responsive to feedback and questions

## Questions?

If you have questions about contributing:
- Open an issue for discussion
- Check existing issues and PRs
- Read the documentation in the README and examples/

## License

By contributing, you agree that your contributions will be licensed under the BSD 2-Clause License, the same as the project.

## Acknowledgments

Contributors are recognized in the project's commit history and release notes. Thank you for helping make this tool better!
