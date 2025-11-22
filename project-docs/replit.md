# SIMANIS - Sistem Manajemen Aset Sekolah

## Overview

SIMANIS is a Progressive Web Application (PWA) for managing school assets in Indonesia. The system provides comprehensive asset tracking including registration, categorization, location management, borrowing/lending, periodic inventory checks, depreciation calculation, and reporting. Built with React and TypeScript, it follows a modern single-page application architecture with offline capabilities.

The application supports role-based access control for different school personnel (Principal, Vice Principal for Infrastructure, BOS Treasurer, Operator, Teacher) and implements QR code-based asset tracking for efficient inventory management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- React 19 with TypeScript for type-safe component development
- Vite build tool with Rolldown for fast development and optimized production builds
- React Router v7 for client-side routing and navigation

**State Management Strategy:**
- **Global State**: Zustand with localStorage persistence for authentication state
- **Server State**: TanStack Query v5 for data fetching, caching, and synchronization
- **Form State**: React Hook Form with Zod validation for robust form handling

**UI Architecture:**
- Tailwind CSS v4 with PostCSS for utility-first styling
- Custom component library based on shadcn/ui patterns (Button, Card, Table, Input, etc.)
- Lucide React for consistent iconography
- Responsive design with mobile-first approach

**PWA Implementation:**
- Service Worker via vite-plugin-pwa for offline capability
- Manifest configuration for installable app experience
- Runtime caching strategies:
  - NetworkFirst for document requests
  - StaleWhileRevalidate for static assets (styles, scripts, images, fonts)

**Data Validation:**
- Zod schemas for runtime type validation
- Centralized validation schemas in `libs/validation/` for consistency
- Form-level validation with @hookform/resolvers integration

**Code Organization Pattern:**
- Route-based code splitting (`routes/` directory)
- Reusable UI components (`components/ui/`, `components/layout/`)
- API client abstraction (`libs/api/`)
- Shared validation logic (`libs/validation/`)
- Centralized store management (`libs/store/`)

### Authentication & Authorization

**Authentication Mechanism:**
- JWT-based authentication stored in Zustand with localStorage persistence
- Axios interceptors automatically attach Bearer token to all API requests
- Protected route wrapper component (`ProtectedRoute`) for access control
- Automatic redirect to login page for unauthenticated users

**Authorization Model:**
- Role-based access control (RBAC) with roles: Kepsek, Wakasek Sarpras, Bendahara BOS, Operator, Guru
- User role information stored in authentication state
- (Note: Fine-grained permission checks are simplified in Phase 1)

### API Client Architecture

**HTTP Client Configuration:**
- Axios instance with configurable base URL via environment variables
- Default `application/json` content type
- Request interceptor for automatic token injection
- Response interceptor for global error handling
- Environment-specific API URL (`VITE_API_URL` with localhost:3000 fallback)

**API Module Organization:**
- Separate API modules per domain entity (assets, categories, loans, mutations, inventory, depreciation, reports, audit, dashboard)
- TypeScript interfaces for request/response types
- Consistent error handling patterns

### Routing Structure

**Application Routes:**
- Public: `/login`
- Protected (requires authentication):
  - `/dashboard` - Statistics and recent activities
  - `/assets` - Asset list and management
  - `/assets/new` - Create new asset
  - `/assets/:id` - Asset detail and mutation history
  - `/categories` - Category management
  - `/loans` - Loan tracking
  - `/loans/new` - Create new loan
  - `/inventory` - Inventory check history
  - `/inventory/scan` - QR scanner for inventory
  - `/depreciation` - Depreciation records
  - `/reports/kib` - KIB report generation
  - `/audit` - Audit trail viewer

**Layout Architecture:**
- `AppLayout` wrapper with persistent sidebar navigation and header
- Nested routing with `<Outlet />` for page content
- Consistent navigation across protected routes

### File Upload Handling

**Upload Strategy:**
- Generic `FileUpload` component for image and document uploads
- Client-side validation for file type and size (configurable, default 5MB for images)
- Progress tracking during upload
- Preview functionality for uploaded files
- Support for photo uploads (asset photos, inventory photos) and document uploads (deletion certificates)

**Supported File Operations:**
- Asset photo upload and update
- Inventory check photo attachment
- Document attachment for asset deletion (Berita Acara)

### Feature-Specific Patterns

**QR Code Scanning:**
- `html5-qrcode` library integration for camera access
- Automatic backend camera selection when available
- Fallback to manual code input when camera access is denied
- Real-time asset lookup after successful scan

**Inventory Management:**
- Two-step process: Scan/input code → Display asset info → Submit with photo and notes
- Client-side file validation before upload
- Server-side pagination for inventory history

**Dashboard & Reporting:**
- Aggregated statistics fetched from backend
- Recent activities timeline
- KIB report generation with filter options (category, room, condition, date range)
- Support for PDF and Excel export formats

**Depreciation Tracking:**
- View-only interface (calculations performed server-side)
- Monthly depreciation entries with filtering by asset, category, month, year
- Pagination for large datasets

**Audit Trail:**
- Comprehensive change tracking across all entities
- Filter by entity type, action, user, date range
- Detailed diff view showing old/new values for changed fields
- Drawer component for expanded audit log details

## External Dependencies

### Core Libraries
- **React & React DOM** (v19.2.0) - UI framework
- **React Router DOM** (v7.9.6) - Client-side routing
- **TypeScript** (v5.9.3) - Type system

### State & Data Management
- **Zustand** (v5.0.8) - Lightweight state management
- **TanStack Query** (v5.90.10) - Server state management and caching
- **Axios** (v1.13.2) - HTTP client for API communication

### Form Handling & Validation
- **React Hook Form** (v7.66.1) - Form state management
- **@hookform/resolvers** (v5.2.2) - Validation resolver integration
- **Zod** (v4.1.12) - Schema validation

### UI & Styling
- **Tailwind CSS** (v4.1.17) - Utility-first CSS framework
- **@tailwindcss/postcss** (v4.1.17) - PostCSS integration
- **tailwind-merge** (v3.4.0) - Utility class merging
- **clsx** (v2.1.1) - Conditional class name construction
- **Lucide React** (v0.554.0) - Icon library

### PWA & Special Features
- **vite-plugin-pwa** (v1.1.0) - PWA manifest and service worker generation
- **html5-qrcode** (v2.3.8) - QR code scanning via camera

### Utilities
- **date-fns** (v4.1.0) - Date manipulation and formatting

### Build Tools & Development
- **Vite** (aliased to rolldown-vite v7.2.2) - Build tool and dev server
- **@vitejs/plugin-react** (v5.1.0) - React plugin for Vite
- **ESLint** (v9.39.1) with TypeScript support - Code linting
- **PostCSS** (v8.5.6) & **Autoprefixer** (v10.4.22) - CSS processing

### Backend Integration
- **Expected Backend API**: REST API (likely Fastify or NestJS based on tech stack docs)
- **Database**: PostgreSQL (referenced in documentation but not directly used by frontend)
- **Authentication**: JWT tokens passed via Authorization header
- **File Storage**: Expected to be handled by backend (uploadthing or Cloudflare R2 mentioned in docs)