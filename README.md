# Scrib-Draw

A modern, collaborative drawing application built with React, Konva.js, and TypeScript. Scrib-Draw provides an intuitive canvas experience for digital sketching and drawing with real-time collaboration capabilities.

## 🎨 Features

- **Interactive Canvas**: Smooth drawing experience powered by Konva.js and React-Konva
- **Drawing Tools**: Pen and eraser tools with customizable properties
- **Canvas Navigation**: Draggable canvas for easy navigation
- **Real-time Collaboration**: WebSocket-based collaborative drawing (coming soon)
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **State Management**: Efficient state handling with Jotai atoms

## 🏗️ Architecture

This project follows a monorepo architecture using Turborepo, organized into multiple applications and shared packages:

### Applications (`apps/`)

#### 🌐 Web Application (`apps/web/`)
- **Framework**: Next.js 15 with App Router
- **Canvas Engine**: Konva.js with React-Konva bindings
- **State Management**: Jotai for atomic state management
- **Styling**: Tailwind CSS 4.x
- **TypeScript**: Full type safety throughout the application

**Key Components:**
- `Canvas.tsx`: Main drawing canvas component using Konva Stage and Layer
- `Island.tsx`: Floating toolbar for tool selection and canvas controls
- `store.ts`: Jotai atoms for managing drawing state (tools, lines, drawing mode)

#### 🔧 HTTP Backend (`apps/http-backend/`)
- **Framework**: Express.js with TypeScript
- **Authentication**: JWT-based authentication
- **API**: RESTful endpoints for user management and drawing data

#### 🔌 WebSocket Backend (`apps/ws-backend/`)
- **Framework**: Node.js WebSocket server
- **Real-time**: Live collaboration and drawing synchronization
- **Authentication**: JWT token validation for secure connections

### Shared Packages (`packages/`)

#### 🎨 UI Components (`packages/ui/`)
- Reusable React components shared across applications
- TypeScript definitions and component library

#### 🔧 Backend Common (`packages/backend-common/`)
- Shared utilities and configurations for backend services
- Common types and interfaces

#### ⚙️ Configuration Packages
- `packages/eslint-config/`: Shared ESLint configurations
- `packages/typescript-config/`: Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 9.0.0+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scrib-draw
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development environment:
```bash
# Start all applications
pnpm dev

# Or start specific applications
pnpm dev --filter=web
pnpm dev --filter=http-backend
pnpm dev --filter=ws-backend
```

### Development URLs

- **Web Application**: http://localhost:3000
- **HTTP Backend**: http://localhost:8080 (when configured)
- **WebSocket Backend**: ws://localhost:8081 (when configured)

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **Next.js 15**: App Router, Turbopack, and modern React features
- **Konva.js**: 2D canvas library for high-performance graphics
- **React-Konva**: React bindings for Konva.js
- **Jotai**: Primitive and flexible state management
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Static type checking and enhanced developer experience

### Backend
- **Express.js**: Fast, unopinionated web framework
- **WebSocket (ws)**: Real-time bidirectional communication
- **JWT**: Secure authentication and authorization
- **Zod**: TypeScript-first schema validation

### Development Tools
- **Turborepo**: High-performance build system for monorepos
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **TypeScript**: Static type checking across the entire codebase

## 📁 Project Structure

```
scrib-draw/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── Canvas/     # Canvas-related components
│   │   │   │       ├── Canvas.tsx      # Main canvas component
│   │   │   │       ├── Island.tsx      # Toolbar component
│   │   │   │       ├── store.ts        # Jotai state atoms
│   │   │   │       └── Tools/          # Drawing tools
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Home page
│   │   └── package.json
│   ├── http-backend/           # Express.js API server
│   └── ws-backend/             # WebSocket server
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── backend-common/         # Shared backend utilities
│   ├── eslint-config/          # ESLint configurations
│   └── typescript-config/      # TypeScript configurations
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── pnpm-workspace.yaml         # PNPM workspace configuration
```

## 🎯 Canvas Implementation

The drawing canvas is built using Konva.js, providing high-performance 2D graphics:

### Core Canvas Features
- **Stage**: Main container for all canvas elements
- **Layer**: Rendering layer for drawing elements
- **Line**: Vector-based drawing with smooth curves
- **Mouse Events**: Responsive drawing with mouse/touch input

### Drawing State Management
```typescript
// Jotai atoms for state management
const toolAtom = atom<"pen" | "eraser">("pen");
const linesAtom = atom<Line[]>([]);
const drawingAtom = atom<boolean>(false);
const draggableAtom = atom<boolean>(false);
```

### Drawing Flow
1. **Mouse Down**: Initialize new line with current tool and position
2. **Mouse Move**: Extend current line with new points (if drawing)
3. **Mouse Up**: Finalize current line and stop drawing

## 🔧 Available Scripts

### Root Level
```bash
pnpm dev          # Start all applications in development mode
pnpm build        # Build all applications and packages
pnpm lint         # Run ESLint across all packages
pnpm format       # Format code with Prettier
pnpm check-types  # Type check all TypeScript code
```

### Application Specific
```bash
# Web application
pnpm dev --filter=web
pnpm build --filter=web

# Backend services
pnpm dev --filter=http-backend
pnpm dev --filter=ws-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting with Prettier
- Ensure all ESLint rules pass
- Add appropriate type definitions
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Roadmap

- [ ] Enhanced drawing tools (shapes, text, colors)
- [ ] Real-time collaborative editing
- [ ] Drawing export/import functionality
- [ ] User authentication and drawing persistence
- [ ] Mobile-responsive touch controls
- [ ] Undo/redo functionality
- [ ] Layer management
- [ ] Drawing templates and assets

## 🙏 Acknowledgments

- [Konva.js](https://konvajs.org/) for the powerful 2D canvas library
- [React-Konva](https://github.com/konvajs/react-konva) for React integration
- [Jotai](https://jotai.org/) for elegant state management
- [Turborepo](https://turborepo.org/) for monorepo tooling