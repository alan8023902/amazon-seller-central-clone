# Backend Technology Stack

## Core Technologies

- **Node.js**: Runtime environment for server-side JavaScript
- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Static typing for robust server-side code
- **Multer**: Middleware for handling file uploads

## Data Management

- **JSON Files**: File-based data storage for simplicity
- **Zod**: Schema validation for API requests and responses
- **fs-extra**: Enhanced file system operations
- **path**: Path manipulation utilities

## API & Middleware

- **CORS**: Cross-origin resource sharing middleware
- **express.json()**: JSON body parsing middleware
- **express.static()**: Static file serving
- **Custom error handling**: Centralized error management

## Development Tools

- **ts-node**: TypeScript execution for development
- **nodemon**: Auto-restart server on file changes
- **concurrently**: Run multiple commands simultaneously

## Common Commands

```bash
# Development
npm run dev          # Start development server with nodemon
npm run build        # TypeScript compilation
npm run start        # Start production server

# Database
npm run seed         # Generate initial mock data
npm run backup       # Backup data files
```

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic services
│   ├── middleware/      # Express middleware
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Main server file
├── data/                # JSON data files
├── uploads/             # Uploaded images storage
└── package.json
```

## API Design Principles

- RESTful endpoints with consistent naming
- Proper HTTP status codes
- JSON response format with error handling
- Request validation using Zod schemas
- File upload support for product images