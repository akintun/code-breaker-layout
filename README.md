

# ChainBreaker - A Web-Based Code-Breaking Game

ChainBreaker is an engaging, Mastermind-style code-breaking game designed to test your logic and deduction skills. The objective is to guess a secret code within a set number of attempts and a time limit. With a sleek, modern interface and multiple difficulty levels, ChainBreaker offers a challenging experience for players of all skill levels.

This project is built with a modern technology stack, featuring a responsive design that works seamlessly on both desktop and mobile devices. It includes comprehensive accessibility features, robust error handling, and full game state persistence. The codebase follows TypeScript best practices with extensive testing coverage.

## Features

### Core Gameplay
*   **Classic Code-Breaking Gameplay**: Guess a secret code using logic and feedback
*   **Multiple Difficulty Levels**:
    *   **Easy**: 3-digit code, 12 attempts, numbers 1-6
    *   **Medium**: 4-digit code, 10 attempts, numbers 1-6  
    *   **Hard**: 5-digit code, 8 attempts, numbers 1-8
*   **Smart Feedback System**: Visual indicators for correct positions and numbers
*   **Timer Functionality**: Track your solving speed with persistent timing

### User Experience
*   **Fully Accessible**: ARIA labels, keyboard navigation, screen reader support
*   **Mobile-First Responsive Design**: Optimized touch targets and layouts
*   **Game State Persistence**: Resume games automatically with localStorage
*   **Comprehensive Error Handling**: Graceful fallbacks and user-friendly error messages
*   **Recent Activities Tracking**: See your game history and progress

### Technical Features
*   **TypeScript Strict Mode**: Full type safety and IntelliSense support
*   **Performance Optimized**: Memoized computations and efficient re-renders
*   **Memory Leak Prevention**: Proper cleanup and resource management
*   **Comprehensive Testing**: Unit, component, and integration test coverage
*   **Modern Development Tools**: ESLint, Prettier, and Vite for optimal DX

## Technology Stack

This project is built with a modern front-end stack that emphasizes performance, accessibility, and developer experience:

### Core Technologies
*   **Framework**: [React 19.1.1](https://reactjs.org/) with hooks-based architecture
*   **Build Tool**: [Vite 5.4.19](https://vitejs.dev/) with SWC plugin for fast compilation
*   **Language**: [TypeScript 5.8.3](https://www.typescriptlang.org/) with strict mode enabled
*   **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/) with custom responsive utilities

### UI & Components
*   **Component Library**: [shadcn-ui](https://ui.shadcn.com/) with Radix UI primitives
*   **Routing**: [React Router DOM](https://reactrouter.com/) for client-side navigation
*   **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography
*   **Animations**: CSS transitions and Tailwind animations

### Development & Testing
*   **Testing Framework**: [Vitest 1.4.0](https://vitest.dev/) with coverage reporting
*   **Testing Utilities**: [Testing Library](https://testing-library.com/) for component testing
*   **Linting**: [ESLint 9.17.0](https://eslint.org/) with TypeScript integration
*   **Package Manager**: Support for npm, pnpm, and bun

### State & Data Management
*   **State Management**: Custom hooks with React's built-in state
*   **Persistence**: Advanced localStorage with compression and quota monitoring
*   **Performance**: useMemo and useCallback for optimized re-renders
*   **Error Handling**: Global error boundary with graceful fallbacks

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18.x or later recommended) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd akintun-code-breaker-layout
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Running the Application

Once the dependencies are installed, you can run the development server:

```sh
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:5173`.

### Running Tests

To run the test suite:

```sh
npm run test
```

For test coverage reports:

```sh
npm run test:coverage
```

For interactive testing with UI:

```sh
npm run test:ui
```

## Available Scripts

In the project directory, you can run:

### Development
*   `npm run dev`: Runs the app in development mode at `http://localhost:5173`
*   `npm run build`: Builds the app for production to the `dist` folder
*   `npm run build:dev`: Builds the app in development mode for debugging
*   `npm run preview`: Serves the production build locally to preview it
*   `npm run lint`: Lints the project files for code quality and errors

### Testing
*   `npm run test`: Runs the test suite with Vitest
*   `npm run test:ui`: Runs tests with the Vitest UI interface
*   `npm run test:coverage`: Runs tests and generates coverage reports
*   `npm run test:watch`: Runs tests in watch mode for development

## Project Structure

The project follows a clean, scalable architecture with clear separation of concerns:

```
code-breaker-layout/
├── public/                    # Static assets
│   └── robots.txt
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── game/            # Game-specific components
│   │   │   ├── GameStatusBar.tsx      # Score and game info display
│   │   │   ├── GuessHistory.tsx       # Previous guesses with feedback
│   │   │   ├── GuessRow.tsx           # Individual guess display
│   │   │   ├── NumberPad.tsx          # Interactive number input
│   │   │   ├── RecentActivities.tsx   # Game history tracking
│   │   │   ├── TreasuryPool.tsx       # Score pool display
│   │   │   └── WelcomeScreen.tsx      # Game introduction
│   │   ├── layout/          # App structure components
│   │   │   ├── AppShell.tsx           # Main app wrapper
│   │   │   ├── BottomNavigation.tsx   # Mobile navigation
│   │   │   └── Header.tsx             # App header with controls
│   │   ├── leaderboard/     # Leaderboard components
│   │   │   └── ScoreRow.tsx           # Individual score display
│   │   ├── modals/          # Dialog components
│   │   │   ├── DifficultyModal.tsx    # Game difficulty selector
│   │   │   └── GameResultModal.tsx    # Win/lose results
│   │   └── ui/              # Base UI components (shadcn-ui)
│   ├── contexts/            # React contexts
│   │   └── ErrorContext.tsx           # Global error handling
│   ├── hooks/               # Custom React hooks
│   │   ├── useAccessibility.ts        # Accessibility utilities
│   │   ├── useGameLogic.ts            # Core game logic
│   │   ├── useGamePersistence.ts      # Save/load game state
│   │   ├── useGameState.ts            # Game state management
│   │   ├── useGameTimer.ts            # Timer functionality
│   │   └── use-mobile.tsx             # Mobile detection
│   ├── lib/                 # Utility functions
│   │   ├── storage-utils.ts           # Advanced localStorage management
│   │   ├── type-utils.ts              # TypeScript utilities
│   │   └── utils.ts                   # General utilities
│   ├── pages/               # Route components
│   │   ├── GameView.tsx               # Main game interface
│   │   ├── Index.tsx                  # Home page
│   │   ├── LeaderboardView.tsx        # High scores
│   │   ├── NotFound.tsx               # 404 page
│   │   ├── ProfileView.tsx            # User profile
│   │   └── RulesView.tsx              # Game instructions
│   ├── styles/              # CSS files
│   │   └── mobile.css                 # Mobile-specific styles
│   ├── test/                # Test files
│   │   ├── components/                # Component tests
│   │   ├── hooks/                     # Hook tests
│   │   ├── integration/               # Integration tests
│   │   └── setup.ts                   # Test configuration
│   └── types/               # TypeScript definitions
│       └── game.ts                    # Game-related types
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vitest.config.ts        # Test configuration
└── vite.config.ts          # Vite configuration
```

## Architecture & Design Principles

### Custom Hooks Architecture
The application uses a custom hooks architecture that separates concerns effectively:

- **useGameState**: Manages core game state with memoized computations
- **useGameTimer**: Handles timing with proper cleanup and memory leak prevention  
- **useGameLogic**: Orchestrates game flow and integrates all game hooks
- **useGamePersistence**: Manages save/load functionality with compression
- **useAccessibility**: Provides comprehensive accessibility features

### Performance Optimizations
- **Memoization**: Strategic use of `useMemo` and `useCallback` for expensive operations
- **Efficient Re-renders**: Minimal state updates and optimized component structure
- **Memory Management**: Proper cleanup of intervals, event listeners, and effects
- **Bundle Optimization**: Tree-shaking and code splitting with Vite

### Accessibility Features
- **ARIA Support**: Comprehensive labels, roles, and live regions
- **Keyboard Navigation**: Full keyboard support with arrow key navigation
- **Screen Reader**: Announcements for game state changes and feedback
- **Focus Management**: Proper focus trapping and restoration
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

### Error Handling Strategy
- **Global Error Boundary**: Catches and handles React component errors
- **Graceful Fallbacks**: User-friendly error messages and recovery options
- **Error Logging**: Structured error reporting for debugging
- **Input Validation**: Comprehensive validation with helpful feedback

## Recent Improvements

### Phase 1-3: Foundation & Type Safety
✅ **Custom Hooks Development**: Extracted game logic into reusable, testable hooks  
✅ **Component Refactoring**: Improved component structure and separation of concerns  
✅ **TypeScript Strict Mode**: Enhanced type safety and developer experience

### Phase 4-6: Performance & Persistence  
✅ **Performance Optimization**: Implemented memoization and efficient re-rendering  
✅ **Timer System Overhaul**: Fixed memory leaks and improved timer reliability  
✅ **Game State Persistence**: Advanced localStorage with compression and quota monitoring

### Phase 7-9: UX & Reliability
✅ **Accessibility Implementation**: Full WCAG compliance with ARIA, keyboard nav, and screen reader support  
✅ **Mobile Responsiveness**: Mobile-first design with optimized touch interactions  
✅ **Error Handling**: Global error boundary with graceful fallbacks and user feedback

### Phase 10: Testing Coverage
✅ **Testing Infrastructure**: Comprehensive test setup with Vitest and Testing Library  
✅ **Unit Tests**: Hook testing for game logic and timer functionality  
✅ **Component Tests**: UI component testing with accessibility validation  
✅ **Integration Tests**: End-to-end game flow testing

## Development Guidelines

### Code Quality
- **TypeScript Strict**: All code must pass strict TypeScript checks
- **ESLint Rules**: Consistent code style and best practices enforcement
- **Component Testing**: All components should have corresponding test files
- **Hook Testing**: Custom hooks must be thoroughly tested

### Accessibility Standards
- **WCAG 2.1 AA**: Target compliance level for all features
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader**: Important state changes must be announced
- **Color Contrast**: Maintain sufficient contrast ratios

### Performance Targets
- **Bundle Size**: Keep initial bundle under 500KB
- **First Paint**: Target under 1.5s on 3G connections
- **Memory Usage**: Prevent memory leaks in long gaming sessions
- **Responsiveness**: Maintain 60fps during interactions

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Add tests** for any new functionality
4. **Run** the test suite (`npm run test`)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
