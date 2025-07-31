# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Connect 4 (Puissance 4) game built with Next.js 14, React 18, and TypeScript. The game supports two modes:
- Player vs Player
- Player vs AI

## Development Commands

```bash
# Development server
npm run dev
# or
pnpm dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

The development server runs on http://localhost:3000.

## Architecture

### Component Structure
- `app/page.tsx`: Main entry point that renders the Board component
- `app/components/Board.tsx`: Main game controller managing state, game modes, and player turns
- `app/components/Grid.tsx`: Renders the 6x7 game grid
- `app/components/Cell.tsx`: Individual cell component with click handling
- `app/components/GameControls.tsx`: Win screen and game reset controls
- `app/components/ScoreBoard.tsx`: Displays current scores for both players
- `app/components/IA.ts`: AI logic with minimax-like algorithm for computer opponent
- `app/components/Types.ts`: TypeScript type definitions

### Game Logic Architecture
The game uses a 6x7 grid (ROWS=6, COLS=7) with the following data flow:

1. **Board Component**: Central state manager
   - Manages grid state as `CellValue[][]` (null | 'red' | 'yellow')
   - Handles player turns and game mode switching
   - Coordinates between UI components and game logic

2. **AI System**: Sophisticated decision-making
   - Uses numeric grid representation (0=empty, 1=player1, 2=AI)
   - Implements weighted scoring system with positional preferences
   - Includes defensive and offensive strategies
   - Handles win detection and blocking opponent wins

3. **Game State Management**:
   - Game modes stored as `GameMode` type
   - Player identification through `Player` type
   - Win conditions checked after each move using AI algorithms

### AI Implementation Details
The AI (`IA.ts`) uses a scoring system that:
- Prioritizes winning moves (score: 100)
- Blocks opponent wins (score: 99)  
- Avoids losing moves (score: 0)
- Uses positional weights favoring center columns and middle rows
- Implements defensive positioning detection

## Styling
- Uses Tailwind CSS for styling
- Responsive design with flexbox layouts
- Color scheme: red for Player 1, yellow for Player 2/AI

## Development Notes
- Uses `'use client'` directive for Board component (client-side rendering)
- AI moves have 500ms delay for better UX
- Game includes score tracking across multiple rounds
- TypeScript strict mode enabled with Next.js optimizations