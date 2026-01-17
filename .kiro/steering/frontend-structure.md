# Frontend Project Structure

## Root Level Organization

```
frontend/
├── src/
│   ├── features/           # Feature-based components (main app pages)
│   ├── components/         # Reusable UI components
│   ├── layouts/           # Layout wrapper components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external service integrations
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application
├── public/                # Static assets
└── package.json
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

## API Integration

- **Services Layer**: Centralized API calls in `/services/`
- **Error Handling**: Consistent error handling across components
- **Loading States**: Proper loading indicators for async operations
- **Data Caching**: TanStack Query for server state management

## State Architecture

- **Global State**: Zustand store with persistence for user session and dashboard data
- **Component State**: React hooks for local component state
- **Server State**: TanStack Query for API data management

## Styling Approach

- **Tailwind CSS**: Utility-first approach with custom Amazon-themed colors
- **CSS Modules**: Used sparingly for component-specific styles
- **Responsive Design**: Mobile-first approach with desktop optimization

## Import Conventions

- Use `@/` alias for root-level imports
- Relative imports for same-directory files
- Group imports: external libraries, internal modules, relative imports