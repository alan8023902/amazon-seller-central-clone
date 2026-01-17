# Requirements Document

## Introduction

This specification defines the requirements for restructuring and expanding the existing Amazon Seller Central clone project into a comprehensive three-tier architecture. The system will reorganize the current React frontend into a `frontend/` folder, create a new Node.js + Express + TypeScript backend in a `backend/` folder, and build an administrative management interface in a `backend-admin/` folder. The goal is to achieve exact 1:1 pixel-perfect replication of Amazon Seller Central pages while providing full data management capabilities through an admin interface backed by H2 database storage.

## Glossary

- **Frontend**: Existing React 18 + TypeScript application moved to `frontend/` folder, modified to use real APIs
- **Backend**: New Node.js + Express + TypeScript REST API server with H2 database for data persistence  
- **Backend_Admin**: New React + Ant Design Pro management interface for data editing and image uploads
- **Dashboard**: Main seller dashboard page with global snapshot and product performance
- **Voice_of_Customer**: Customer feedback and review management page
- **Sales_Dashboard**: Comprehensive sales analytics and reporting interface
- **Account_Health**: Account status, performance metrics, and compliance monitoring
- **Legal_Entity**: Business entity information and legal compliance page
- **Global_Snapshot**: Six-column metrics display (sales, orders, messages, offers, feedback, payments)
- **Product_Performance_Table**: Tabular product data with images, SKUs, ASINs, and metrics
- **Editable_Data**: User-marked red areas in reference images that can be modified via admin interface
- **H2_Database**: Embedded database storing all application data with predefined schema
- **Image_Upload**: File upload system for product images stored in local filesystem
- **Pixel_Perfect**: Exact 1:1 visual replication matching Amazon's spacing, colors, fonts, and layouts

## Requirements

### Requirement 1: Project Structure Reorganization

**User Story:** As a developer, I want the project reorganized into frontend/admin/backend folders, so that I can maintain clear separation between display, management, and API layers.

#### Acceptance Criteria

1. THE System SHALL create a "frontend" folder containing the current React application code
2. THE System SHALL create an "admin" folder with React + Ant Design Pro for data management
3. THE System SHALL create a "backend" folder with Spring Boot 3.x application and H2 database
4. THE System SHALL maintain proper dependency management between the three components
5. THE System SHALL provide clear documentation for each folder's purpose and setup instructions

### Requirement 2: Node.js Backend with H2 Database

**User Story:** As a system administrator, I want a robust Node.js backend API with database persistence, so that I can store and manage all application data reliably.

#### Acceptance Criteria

1. THE Backend SHALL implement Node.js + Express + TypeScript with embedded H2 database
2. THE Backend SHALL create database tables for store, global_snapshot, product, sales_snapshot, cx_health, account_health, and legal_entity
3. THE Backend SHALL provide REST API endpoints for all CRUD operations on data entities
4. THE Backend SHALL support file upload endpoints for product image management with multer middleware
5. THE Backend SHALL include proper error handling, validation, and logging throughout all operations

### Requirement 3: Admin Interface with Ant Design Pro

**User Story:** As a content manager, I want a professional admin interface to manage all editable data, so that I can easily update store information, products, and metrics.

#### Acceptance Criteria

1. THE Backend_Admin SHALL implement React with Ant Design Pro for professional UI components
2. THE Backend_Admin SHALL provide forms for editing all data marked in red in the reference images
3. THE Backend_Admin SHALL include image upload functionality with drag-and-drop support
4. THE Backend_Admin SHALL display data tables with sorting, filtering, and pagination capabilities
5. THE Backend_Admin SHALL provide real-time preview of changes before saving to database

### Requirement 4: Frontend Display with Real API Integration

**User Story:** As a seller, I want to see a pixel-perfect Amazon Seller Central interface powered by real data, so that I can experience an authentic seller dashboard environment.

#### Acceptance Criteria

1. THE Frontend SHALL move existing React 18 + TypeScript code to `frontend/` folder without changing UI components
2. THE Frontend SHALL replace all mock data with real API calls to the Node.js backend
3. THE Frontend SHALL consume data from Node.js backend APIs exclusively
4. THE Frontend SHALL display real product images uploaded through the admin interface
5. THE Frontend SHALL maintain existing responsive design and pixel-perfect accuracy

### Requirement 5: Database Schema Implementation

**User Story:** As a backend developer, I want a comprehensive database schema that stores all Amazon Seller Central data, so that the system can persist and retrieve all necessary information.

#### Acceptance Criteria

1. THE Backend SHALL implement the store table with fields for store_name, country, marketplace_id, and configuration data
2. THE Backend SHALL create global_snapshot table storing sales, orders, messages, featured_offers, feedback, and payments metrics
3. THE Backend SHALL implement product table with image_url, title, asin, sku, price, inventory, status, and performance fields
4. THE Backend SHALL create sales_snapshot table for historical sales data and trend analysis
5. THE Backend SHALL implement cx_health and account_health tables for customer experience and account status metrics

### Requirement 6: Image Upload and Management System

**User Story:** As a content manager, I want to upload and manage product images, so that the frontend displays realistic product data.

#### Acceptance Criteria

1. THE System SHALL provide image upload functionality in the admin interface with support for JPG, PNG, and WebP formats
2. THE System SHALL store uploaded images in a local filesystem directory with proper organization
3. THE System SHALL generate and store image URLs in the database for frontend consumption
4. THE System SHALL provide image preview and replacement capabilities in the admin interface
5. THE System SHALL implement image optimization and resizing for consistent display quality

### Requirement 7: Editable Data Management

**User Story:** As a content manager, I want to edit all data fields marked in red in the reference images, so that I can customize the seller dashboard content.

#### Acceptance Criteria

1. THE Admin SHALL provide forms for editing store information including name, country, and marketplace settings
2. THE Admin SHALL allow modification of all global snapshot metrics with validation for numeric fields
3. THE Admin SHALL enable editing of product information including titles, prices, inventory, and status
4. THE Admin SHALL provide interfaces for updating CX health metrics and account health indicators
5. THE Admin SHALL include bulk edit capabilities for efficient management of multiple products

### Requirement 8: Five Target Pages Implementation

**User Story:** As a seller, I want to access all five key Amazon Seller Central pages, so that I can manage different aspects of my business.

#### Acceptance Criteria

1. THE Frontend SHALL implement the Dashboard page with global snapshot, product performance table, and action cards
2. THE Frontend SHALL create the Voice of Customer page displaying customer feedback, reviews, and satisfaction metrics
3. THE Frontend SHALL build the Sales Dashboard with comprehensive analytics, charts, and performance insights
4. THE Frontend SHALL implement the Account Health page showing compliance status, performance metrics, and policy information
5. THE Frontend SHALL create the Legal Entity page displaying business information, tax details, and legal compliance status

### Requirement 9: API Integration and Data Flow

**User Story:** As a system architect, I want seamless data flow between frontend, admin, and backend, so that all components work together cohesively.

#### Acceptance Criteria

1. THE Backend SHALL provide RESTful API endpoints for all data entities with proper HTTP status codes
2. THE Frontend SHALL consume Node.js backend APIs exclusively without any mock data dependencies
3. THE Backend_Admin SHALL use the same backend APIs for data modification and image upload operations
4. THE System SHALL implement proper error handling and loading states across all API interactions
5. THE System SHALL provide API documentation and testing capabilities for development purposes

### Requirement 10: Pixel-Perfect UI Replication

**User Story:** As a user, I want the interface to look exactly like Amazon Seller Central, so that I have an authentic experience.

#### Acceptance Criteria

1. THE Frontend SHALL replicate Amazon's exact color scheme, typography, and spacing measurements
2. THE Frontend SHALL implement identical layout structures, component positioning, and visual hierarchy
3. THE Frontend SHALL use Ant Design components customized to match Amazon's visual design language
4. THE Frontend SHALL maintain consistent styling across all five target pages
5. THE Frontend SHALL provide hover states, animations, and interactions that mirror Amazon's behavior

### Requirement 11: Data Validation and Error Handling

**User Story:** As a system user, I want robust data validation and clear error messages, so that I can use the system reliably.

#### Acceptance Criteria

1. THE Backend SHALL implement comprehensive input validation for all API endpoints using Joi or Zod
2. THE Backend_Admin SHALL provide client-side validation with clear error messages for form inputs
3. THE System SHALL handle database connection errors and provide appropriate fallback responses
4. THE System SHALL validate image uploads for file type, size, and format requirements
5. THE System SHALL log all errors appropriately for debugging and monitoring purposes

### Requirement 12: Performance and Optimization

**User Story:** As a user, I want fast loading times and smooth interactions, so that I can work efficiently.

#### Acceptance Criteria

1. THE Frontend SHALL maintain existing performance optimizations including lazy loading and code splitting
2. THE Backend SHALL optimize database queries and implement appropriate caching strategies with Redis or in-memory cache
3. THE System SHALL compress and optimize uploaded images for web display using Sharp or similar library
4. THE Frontend SHALL provide loading skeletons and progress indicators for better user experience
5. THE System SHALL maintain responsive performance across all three application tiers

### Requirement 13: Development and Deployment Setup

**User Story:** As a developer, I want clear setup instructions and development workflows, so that I can efficiently work on the project.

#### Acceptance Criteria

1. THE System SHALL provide comprehensive README files for each folder with setup and run instructions
2. THE System SHALL include package.json scripts for development, build, and deployment processes
3. THE System SHALL configure proper CORS settings for local development between frontend and backend
4. THE System SHALL provide sample data and database initialization scripts for development
5. THE System SHALL include environment configuration files for different deployment scenarios

### Requirement 14: Security and Access Control

**User Story:** As a system administrator, I want proper security measures in place, so that the application and data are protected.

#### Acceptance Criteria

1. THE Backend SHALL implement input sanitization and SQL injection prevention measures
2. THE System SHALL validate and restrict file upload types and sizes for security
3. THE Admin SHALL include basic authentication or access control for administrative functions
4. THE Backend SHALL implement proper CORS policies and request validation
5. THE System SHALL log security-related events and potential threats appropriately

### Requirement 15: Testing and Quality Assurance

**User Story:** As a developer, I want comprehensive testing capabilities, so that I can ensure code quality and reliability.

#### Acceptance Criteria

1. THE Frontend SHALL include unit tests for critical components using React Testing Library
2. THE Backend SHALL implement API endpoint testing with proper test data setup
3. THE System SHALL provide integration tests between frontend and backend components
4. THE Admin SHALL include form validation testing and user interaction testing
5. THE System SHALL maintain code quality standards with linting and formatting tools