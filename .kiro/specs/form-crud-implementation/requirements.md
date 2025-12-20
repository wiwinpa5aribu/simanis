# Requirements Document

## Introduction

This document specifies the requirements for implementing CRUD (Create, Read, Update, Delete) functionality for all form components in SIMANIS. Currently, all forms display correctly but do not persist data to the database. This fix will implement proper data persistence using Next.js Server Actions with Zod validation.

## Glossary

- **Server_Action**: A Next.js feature that allows server-side code execution from client components
- **Asset_Service**: Service layer for asset database operations (`lib/services/asset-service.ts`)
- **Location_Service**: Service layer for location database operations (`lib/services/location-service.ts`)
- **Mutation_Service**: Service layer for mutation database operations (`lib/services/mutation-service.ts`)
- **User_Service**: Service layer for user database operations (`lib/services/user-service.ts`)
- **Audit_Service**: Service layer for audit log operations (`lib/services/audit-service.ts`)
- **Zod_Schema**: Runtime validation schema for form data
- **Toast**: User notification component (sonner library)

## Requirements

### Requirement 1: Asset Creation

**User Story:** As an asset manager, I want to add new assets to the system, so that I can track school inventory.

#### Acceptance Criteria

1. WHEN a user fills the asset form with valid data and clicks Simpan, THE Asset_Service SHALL create a new asset record in the database
2. WHEN an asset is successfully created, THE System SHALL display a success toast notification
3. WHEN an asset is successfully created, THE System SHALL refresh the asset list to show the new entry
4. WHEN an asset is successfully created, THE Audit_Service SHALL create an audit log entry with action "Tambah" and module "Aset"
5. IF the asset form contains invalid data, THEN THE System SHALL display validation errors and prevent submission
6. WHEN creating an asset, THE System SHALL auto-generate a unique ID following pattern AST-XXXX

### Requirement 2: Location Creation

**User Story:** As an administrator, I want to add new locations to the hierarchy, so that I can organize where assets are placed.

#### Acceptance Criteria

1. WHEN a user fills the location form with valid data and clicks Simpan, THE Location_Service SHALL create a new location record in the database
2. WHEN a location is successfully created, THE System SHALL display a success toast notification
3. WHEN a location is successfully created, THE System SHALL refresh the location tree to show the new entry
4. WHEN a location is successfully created, THE Audit_Service SHALL create an audit log entry with action "Tambah" and module "Lokasi"
5. IF the location form contains invalid data, THEN THE System SHALL display validation errors and prevent submission
6. WHEN creating a location, THE System SHALL auto-generate a unique ID following pattern LOC-XXX

### Requirement 3: Mutation Recording

**User Story:** As a staff member, I want to record asset transfers between locations, so that I can maintain accurate location tracking.

#### Acceptance Criteria

1. WHEN a user fills the mutation form with valid data and clicks Simpan, THE Mutation_Service SHALL create a new mutation record in the database
2. WHEN a mutation is successfully created, THE System SHALL display a success toast notification
3. WHEN a mutation is successfully created, THE System SHALL refresh the mutation list to show the new entry
4. WHEN a mutation is successfully created, THE Audit_Service SHALL create an audit log entry with action "Tambah" and module "Mutasi"
5. IF the mutation form contains invalid data, THEN THE System SHALL display validation errors and prevent submission
6. IF the source location equals the destination location, THEN THE System SHALL reject the mutation with an error message
7. WHEN creating a mutation, THE System SHALL auto-generate a unique ID following pattern MUT-XXX
8. WHEN a mutation is created, THE System SHALL set initial status to "diproses"

### Requirement 4: User Creation

**User Story:** As an administrator, I want to add new users to the system, so that staff can access the application.

#### Acceptance Criteria

1. WHEN a user fills the user form with valid data and clicks Simpan, THE User_Service SHALL create a new user record in the database
2. WHEN a user is successfully created, THE System SHALL display a success toast notification
3. WHEN a user is successfully created, THE System SHALL refresh the user list to show the new entry
4. WHEN a user is successfully created, THE Audit_Service SHALL create an audit log entry with action "Tambah" and module "User"
5. IF the user form contains invalid data, THEN THE System SHALL display validation errors and prevent submission
6. IF the email already exists in the database, THEN THE System SHALL reject the creation with a duplicate error message
7. WHEN creating a user, THE System SHALL auto-generate a unique ID following pattern USR-XXX
8. WHEN a user is created, THE System SHALL set initial status to "aktif"

### Requirement 5: Audit Logging

**User Story:** As a system administrator, I want all data changes to be logged, so that I can maintain compliance and track user activities.

#### Acceptance Criteria

1. WHEN any Create operation is performed, THE Audit_Service SHALL record the action with timestamp, user, action type, module, and details
2. WHEN any Update operation is performed, THE Audit_Service SHALL record the action with timestamp, user, action type, module, and details
3. WHEN any Delete operation is performed, THE Audit_Service SHALL record the action with timestamp, user, action type, module, and details
4. THE Audit_Service SHALL store audit logs in the audit_logs table with all required fields

### Requirement 6: Form Validation

**User Story:** As a user, I want clear feedback when I submit invalid data, so that I can correct my input.

#### Acceptance Criteria

1. WHEN a required field is empty, THE System SHALL display "Field ini wajib diisi" error message
2. WHEN an email field contains invalid format, THE System SHALL display "Format email tidak valid" error message
3. WHEN a numeric field contains non-numeric value, THE System SHALL display "Harus berupa angka" error message
4. WHEN validation fails, THE System SHALL highlight the invalid fields with red border
5. WHEN validation fails, THE System SHALL prevent form submission until errors are corrected
