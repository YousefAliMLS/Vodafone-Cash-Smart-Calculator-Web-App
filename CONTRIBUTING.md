# Contributing to Vodafone Cash Smart Calculator

Thank you for your interest in contributing to the Vodafone Cash Smart Calculator project. This document outlines the process for development, testing, and submitting contributions.

## Code of Conduct

All contributors are expected to maintain a professional, respectful, and collaborative environment.

## Strict Formatting and Style Guidelines

1. **No Emojis**: Do not use emojis anywhere in the codebase, UI, comments, test descriptions, commit messages, or documentation.
2. **No Em Dashes or En Dashes**: Never use the em dash character or en dash character. Use standard regular hyphens (-), colons, commas, or parentheses instead.
3. **TypeScript**: Keep all code strictly typed without using `any`.
4. **Localization**: Maintain complete English and Arabic translations for any added user interface text.

## Development Workflow

### Prerequisites

- Node.js 20 LTS or Node.js 22 LTS
- npm 10 or later

### Setup

```bash
git clone https://github.com/YousefAliMLS/Vodafone-Cash-Smart-Calculator-Web-App.git
cd Vodafone-Cash-Smart-Calculator-Web-App
npm ci
```

### Available Commands

- `npm run dev`: Start local development server
- `npm run build`: Build production assets
- `npm run preview`: Preview production build locally
- `npm run test`: Run automated Vitest test suite
- `npm run typecheck`: Run TypeScript compilation check without emitting files
- `npm run lint`: Run ESLint validation
- `npm run format:check`: Check code formatting with Prettier
- `npm run format`: Automatically format all files with Prettier

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`.
2. Make your modifications following the strict formatting rules.
3. Verify all validation checks pass:
   ```bash
   npm run typecheck
   npm run lint
   npm run format:check
   npm run test
   npm run build
   ```
4. Commit your changes with clear, descriptive commit messages.
5. Push to your fork and submit a pull request against `main`.
