# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chute Certo is a group quiz game application inspired by Baamboozle. Players form two teams and take turns selecting numbered cards containing questions. Teams accumulate points by answering correctly, with some cards containing surprise bonus/penalty points.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Backend**: Supabase (authentication, database, storage)

## Architecture

### Directory Structure

```
/app                    # Next.js 15 App Router pages
  /(auth)              # Authentication routes (login, signup)
  /(dashboard)         # Protected dashboard with layout
  /create              # Create new game
  /game/[id]           # Dynamic game routes
    /edit              # Edit game details
    /questions         # Question management for a game
    /play              # Game play interface (client-side state management)
/components            # Reusable React components
  /auth                # Authentication forms
  /game                # Game management components
  /play                # Gameplay components (scoreboard, cards, modals)
  /layout              # Header, user menu
  /common              # Shared components (empty state, etc.)
  /ui                  # Shadcn/UI components
/lib                   # Utility functions and Supabase client
  /actions             # Server actions (auth, games, questions)
  /supabase            # Supabase client configs
  /utils               # Helper functions (trick cards, etc.)
/types                 # TypeScript type definitions
```

### Data Model

The application manages three primary entities:

1. **Games**: User-created game instances with title and description
2. **Questions**: Multiple-choice questions belonging to a game, each with multiple answer options and one correct answer
3. **Game Sessions**: Active play sessions tracking team names, scores, and which questions have been used

### Key Architectural Patterns

- **Server Components**: Use Next.js Server Components by default for data fetching from Supabase
- **Server Actions**: Handle form submissions and mutations via Server Actions
- **Dynamic Routes**: Game-specific pages use `[id]` dynamic routing

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Setup

See `SETUP.md` for complete setup instructions including:
1. Supabase project creation
2. Database schema setup (execute `supabase-schema.sql`)
3. Environment variables configuration
4. Authentication setup

## Supabase Integration

### Database Tables

**profiles**
- id (uuid, primary key, references auth.users)
- email (text)
- created_at (timestamp)

**games**
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles.id)
- title (text, min 3 chars)
- description (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**questions**
- id (uuid, primary key)
- game_id (uuid, foreign key to games, cascade delete)
- question_text (text)
- created_at (timestamp)
- order (integer)

**answers**
- id (uuid, primary key)
- question_id (uuid, foreign key to questions, cascade delete)
- answer_text (text)
- is_correct (boolean)
- order (integer)

**game_sessions** (optional, not currently used - game state is client-side)
- id (uuid, primary key)
- game_id (uuid, foreign key)
- team1_name, team2_name (text)
- team1_score, team2_score (integer)
- current_turn (integer)
- used_questions (jsonb)

### Supabase Client Setup

Two client instances are configured:
- **Server-side**: `/lib/supabase/server.ts` using `createServerClient` with cookies for Server Components and Server Actions
- **Client-side**: `/lib/supabase/client.ts` using `createBrowserClient` for Client Components
- **Middleware**: `/lib/supabase/middleware.ts` for auth session refresh

### Server Actions

All data mutations use Server Actions:
- `/lib/actions/auth.ts` - signIn, signUp, signOut, getUser
- `/lib/actions/games.ts` - CRUD operations for games
- `/lib/actions/questions.ts` - CRUD operations for questions and answers

## Game Logic

### Question Selection Flow

1. Display numbered cards (one per question in the game)
2. Cards may randomly contain "pegadinhas" (trick cards) with point bonuses/penalties
3. When a card is selected, show the question and multiple choice answers
4. "Mostrar resposta" button reveals the correct answer
5. Manual scoring via "Acertou" (correct) or "Errou" (wrong) buttons
6. Automatically alternate turns between teams
7. Track which questions have been used (prevent re-selection)

### End Game Conditions

Game ends when all cards/questions have been selected. Display result based on final scores:
- Team 1 wins (team1_score > team2_score)
- Team 2 wins (team2_score > team1_score)
- Empate (tie)

## UI/UX Design Principles

- Minimalist and playful design reminiscent of childhood games
- Soft color palette, friendly typography, rounded borders
- Centralized, clean, responsive layouts
- Use Shadcn/UI components for consistency

## Key Routes

- `/` - Redirects to `/dashboard` (authenticated) or `/login` (guest)
- `/login` - Authentication (login form)
- `/signup` - Authentication (signup form)
- `/dashboard` - User's game library with create/play/edit/delete options
- `/create` - Create new game form (redirects to questions after creation)
- `/game/[id]/edit` - Edit game title/description
- `/game/[id]/questions` - Manage questions (add, preview, delete)
- `/game/[id]/play` - Play game interface (client-side state)

## Important Implementation Details

### Game Play State Management
The play page (`/game/[id]/play`) uses **client-side state** (React hooks) for real-time gameplay:
- Team names, scores, current turn
- Used questions tracking
- Trick cards generation (20% of cards, generated on page load)
- No database writes during gameplay - completely local

### Trick Cards System
- Located in `/lib/utils/trick-cards.ts`
- Randomly assigns 20% of question cards as "tricks"
- Types: BONUS_1 (+1), BONUS_2 (+2), PENALTY_1 (-1), PENALTY_2 (-2)
- Generated when game starts and on "Play Again"

### Question Management
- Dynamic form with 2-6 answer inputs (add/remove)
- Radio button to select correct answer
- Validation: min 2 answers, exactly 1 correct
- Preview shows all questions with correct answer highlighted

### Authentication & Security
- Middleware protects routes (`/dashboard`, `/game/*`, `/create`)
- Row Level Security (RLS) on all Supabase tables
- Users can only access their own games and questions
