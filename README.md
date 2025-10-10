# Scrib-Draw

A modern, collaborative drawing application built with React, Konva.js, and TypeScript.

**[Live Demo](https://scrib-draw-web.vercel.app/)**

## Features

- Interactive canvas with smooth drawing powered by Konva.js
- Pen and eraser tools with customizable properties
- Draggable canvas for navigation
- Real-time collaboration via WebSocket
- Modern UI with Next.js and Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

Install pnpm if needed:
```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/scrib-draw.git
cd scrib-draw

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run Specific Services

```bash
pnpm dev --filter=web           # Frontend only
pnpm dev --filter=http-backend  # HTTP API
pnpm dev --filter=ws-backend    # WebSocket server
```

## Architecture

Monorepo structure using Turborepo:

```
scrib-draw/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── http-backend/     # Express.js API
│   └── ws-backend/       # WebSocket server
└── packages/
    ├── ui/               # Shared components
    ├── backend-common/   # Backend utilities
    ├── eslint-config/    # Linting config
    └── typescript-config/# TypeScript config
```

### Tech Stack

**Frontend:** React 19, Next.js 15, Konva.js, React-Konva, Jotai, Tailwind CSS 4

**Backend:** Express.js, WebSocket (ws), JWT, Zod

**Tools:** Turborepo, TypeScript, ESLint, Prettier

## Available Scripts

```bash
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm check-types      # TypeScript type check
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Konva.js](https://konvajs.org/) - 2D canvas library
- [React-Konva](https://github.com/konvajs/react-konva) - React integration
- [Jotai](https://jotai.org/) - State management
- [Turborepo](https://turborepo.org/) - Monorepo tooling
