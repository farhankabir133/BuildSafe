# Contributing to BuildSafe Intelligence

Thank you for your interest in contributing to BuildSafe Intelligence. This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to avoid duplicates.
2. Collect as much information as possible about the bug.
3. Create a new issue with a clear title and description.

### Suggesting Features

1. Check existing issues and discussions first.
2. Create a new issue describing your feature request.
3. Explain the use case and why it would be valuable.

### Pull Requests

1. Fork the repository.
2. Create a feature branch from `main`.
3. Make your changes following the code style guidelines.
4. Add tests for new functionality.
5. Ensure all tests pass (`npm run test`).
6. Ensure the build succeeds (`npm run build`).
7. Run linting (`npm run lint`).
8. Commit your changes with a clear commit message.
9. Push to your fork and create a pull request.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/farhankabir133/BuildSafe.git
cd BuildSafe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## Code Style

- TypeScript with strict mode enabled.
- ESLint with `next/core-web-vitals` preset.
- Prettier for code formatting.
- Follow the existing patterns in the codebase.

## Testing

- Unit tests for pure logic functions (`lib/engine.ts`).
- Integration tests for API routes.
- All new features should include tests.

## Commit Messages

- Use conventional commits format: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, etc.
- Keep messages clear and concise.

## Questions?

If you have questions, feel free to open an issue for discussion.
