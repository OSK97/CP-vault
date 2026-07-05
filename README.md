# SyntaxForge

A keyboard-first C++ syntax generator for competitive programming. Generate boilerplate code, STL containers, and common algorithms instantly without leaving your keyboard.

## Overview

SyntaxForge is an interactive web tool designed to speed up competitive programming workflows. Instead of manually typing out repetitive C++ syntax patterns, you can search, select, and copy ready-to-use code snippets in seconds.

Built for programmers competing on Codeforces, LeetCode, AtCoder, and similar platforms.

## Why I Built SyntaxForge

While practicing Competitive Programming on platforms like Codeforces, LeetCode, and AtCoder, I often found myself forgetting the exact syntax for STL containers, algorithms, and common C++ constructs.

I usually knew **what** I wanted to use—a `priority_queue`, `lower_bound`, `accumulate`, or a nested `map<int, vector<pair<int, int>>>`—but not the precise syntax.

Every time this happened, I had to leave my editor, open Google, search through cppreference or GeeksforGeeks, and then return to coding. Although each interruption lasted only a minute or two, it repeatedly broke my concentration and slowed down problem solving.

I built **SyntaxForge** to eliminate those interruptions.

Instead of searching documentation, I wanted a tool where I could:

- Search any STL container, algorithm, or C++ construct instantly
- Generate the required syntax by answering only the minimum number of questions
- Copy the generated code with a single click
- Return to solving the problem without breaking focus

SyntaxForge is designed as a **developer productivity tool**, not a documentation website. Its goal is simple: **reduce the time between _"I know what I need"_ and _"I have the correct syntax copied into my editor."_**

## Features

- **Keyboard-first interface**: Navigate and generate code entirely from your keyboard
- **Real-time search**: Instantly find generators by name or description
- **Copy-ready code**: One-click copy of generated syntax
- **Offline capable**: Works entirely in the browser
- **Dark theme UI**: Comfortable for extended coding sessions
- **No dependencies needed**: Clean, minimal interface

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/OSK97/CP-vault.git
cd CP-vault
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173` with hot module reloading enabled.

### Production Build

```bash
npm run build
npm run preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K or / | Focus search bar |
| Arrow Up/Down | Navigate search results |
| Enter | Open selected generator |
| Escape | Close generator or clear search |
| Tab | Navigate between input fields |

## Project Structure

```
CP-vault/
├── src/
│   ├── App.tsx                 # Main application with keyboard navigation
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles
│   ├── components/
│   │   ├── search/             # Search interface
│   │   ├── generator/          # Generator display and forms
│   │   └── layout/             # Layout components
│   ├── core/
│   │   ├── search/             # Search functionality
│   │   └── generator/          # Generator type definitions
│   ├── data/
│   │   └── registry.ts         # Generator definitions
│   └── assets/                 # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript settings
└── package.json                # Dependencies
```

## Technology Stack

- React 19.2 - UI library
- TypeScript 6.0 - Type safety
- Vite 8.1 - Build tool
- Tailwind CSS 4.3 - Styling
- Lucide React 1.23 - Icons
- Oxlint - Code linting

## Development

### Code Quality

Run the linter to check code quality:

```bash
npm run lint
```

TypeScript type checking runs automatically during the build process:

```bash
npm run build
```

For production environments, type-aware lint rules can be enabled by modifying `.oxlintrc.json`.

### Adding New Generators

Generators are defined in `src/data/registry.ts`. Each generator follows a schema with:
- Unique identifier
- Display name and description
- Category for organization
- Input fields
- Code generation function

## Usage

1. Press Ctrl+K or / to open the search bar
2. Type to search for a generator (e.g., "vector", "gcd", "sort")
3. Use arrow keys to navigate results
4. Press Enter to open the selected generator
5. Fill in the input fields
6. Copy the generated code
7. Press Escape to close and return to search

## License

This project is open source under the MIT License.

## Contributing

Contributions are welcome. Please feel free to submit issues and pull requests for bug fixes, feature requests, or new generator types.
