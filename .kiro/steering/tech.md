# Technology Stack

## Core Technologies

- **React 18**: Frontend library with modern hooks and concurrent features
- **TypeScript**: Static typing for robust code with strict type checking
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for pixel-perfect styling

## State Management & Data

- **Zustand**: Lightweight state management with persistence middleware
- **TanStack Query (React Query)**: Server state management and data synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for type-safe data handling

## UI & Visualization

- **Lucide React**: Clean vector icon library
- **Recharts**: Responsive chart visualization components
- **React Router DOM**: Client-side routing with nested routes

## Development Tools

- **Node.js**: Runtime environment
- **PostCSS**: CSS processing with Autoprefixer
- **ESNext Modules**: Modern JavaScript module system

## Common Commands

```bash
# Development
npm run dev          # Start development server on port 3000

# Production
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build

# Dependencies
npm install          # Install all dependencies
```

## Build Configuration

- **Port**: Development server runs on port 3000
- **Path Alias**: `@/*` maps to project root for clean imports
- **TypeScript**: ES2022 target with React JSX transform
- **Module Resolution**: Bundler strategy for optimal tree-shaking