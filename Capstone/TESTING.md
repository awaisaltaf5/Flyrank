# Flyrank AI Website Metadata Analyzer - Testing Guide

## Overview

This project uses **Vitest** with **React Testing Library** to verify both business logic and the primary user flow.

## Commands

```bash
npm test        # Run the full test suite once
npm run lint    # Check code style
npm run build   # Production build
```

## Test Structure

```
test/
├── setup.js                     # Test environment setup (jsdom, mocks)
├── url-utils.test.js            # URL validation/normalization unit tests
├── chat-input.test.jsx          # ChatInput component tests
├── result-sections.test.jsx     # ResultSections component tests
├── tool-invocation.test.jsx     # ToolInvocation component tests
└── app-flow.test.jsx            # Primary user flow / app integration tests
```

## What is Covered

### Unit Tests (`url-utils.test.js`)
- `normalizeUrl` - protocol handling, whitespace, invalid inputs, non-HTTP(S) protocols
- `validateUrlInput` - success/error response shapes
- `looksLikeUrl` - heuristics for URL-vs-question detection

### Component Tests
- **ChatInput** - rendering, URL normalization on submit, validation errors, streaming/stop/regenerate states
- **ResultSections** - overview, quick stats, metadata, Open Graph, Twitter Card, missing metadata warnings, null/undefined data
- **ToolInvocation** - all tool states (streaming, available, success, error), error classification (timeout, not HTML, generic)

### App Flow Test (`app-flow.test.jsx`)
- Welcome screen renders when no messages
- URL input validation on welcome screen
- Error display and retry behavior
- Loading state during analysis
- Empty assistant response handling

## Notes

- Tests mock `@ai-sdk/react` to avoid network calls during unit/component tests.
- `npm test` runs Vitest in non-watch mode (`vitest run`) so it is suitable for CI.
- The production build passes with zero errors.