# Admin Interface Technology Stack

## Core Technologies

- **React 18**: Frontend library for admin interface
- **TypeScript**: Static typing for robust code
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

## UI Components

- **Ant Design**: Professional UI component library
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms
- **React Router DOM**: Client-side routing

## Data Management

- **TanStack Query**: Server state management
- **Axios**: HTTP client for API calls
- **React Dropzone**: File upload component

## Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## Common Commands

```bash
# Development
npm run dev          # Start development server on port 3001
npm run build        # Build for production
npm run preview      # Preview production build

# Dependencies
npm install          # Install all dependencies
```

## Project Structure

```
backend-admin/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Admin pages
│   ├── services/        # API integration services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main admin application
├── public/              # Static assets
└── package.json
```

## Admin Features

- **Product Management**: CRUD operations for products
- **Data Configuration**: Sales data and metrics management
- **Image Upload**: Product image management
- **Store Settings**: Store configuration management
- **Data Import/Export**: Bulk data operations