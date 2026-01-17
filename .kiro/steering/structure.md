# Project Structure

## Root Level Organization

```
├── features/           # Feature-based components (main app pages)
├── components/         # Reusable UI components
├── layouts/           # Layout wrapper components
├── hooks/             # Custom React hooks
├── services/          # API and external service integrations
├── utils/             # Utility functions and helpers
├── mock/              # Mock data for development
├── public/            # Static assets and mock data files
└── src/               # Additional source organization
```

## Key Files

- `App.tsx` - Main application with routing and authentication guards
- `store.ts` - Zustand store with persistence for global state
- `types.ts` - TypeScript type definitions for the entire app
- `i18n.ts` - Internationalization translations and marketplace configs

## Feature Organization

Each feature in `/features/` represents a major page or functionality:
- Authentication flows (`AuthPages.tsx`)
- Dashboard and reporting (`Dashboard.tsx`, `BusinessReports.tsx`)
- Inventory management (`Inventory.tsx`, `AddProducts.tsx`)
- Order processing (`ManageOrders.tsx`)
- Account settings (multiple components for different settings pages)

## Layout System

- `MainLayout` - Base layout for authenticated pages
- `WithSidebarLayout` - Layout with sidebar navigation for sub-sections
- Nested routing structure supports complex navigation hierarchies

## State Architecture

- **Global State**: Zustand store with persistence for user session and dashboard data
- **Component State**: React hooks for local component state
- **Server State**: TanStack Query for API data management (when implemented)

## Styling Approach

- **Tailwind CSS**: Utility-first approach with custom Amazon-themed colors
- **CSS Modules**: Used sparingly for component-specific styles
- **Responsive Design**: Mobile-first approach with desktop optimization

## Import Conventions

- Use `@/` alias for root-level imports
- Relative imports for same-directory files
- Group imports: external libraries, internal modules, relative imports