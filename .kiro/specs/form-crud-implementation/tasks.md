# Implementation Plan: Form CRUD Implementation

## Overview

Implementasi CRUD functionality untuk semua form di SIMANIS menggunakan Next.js Server Actions, Zod validation, dan audit logging. Pendekatan: extend existing service layer, create server actions, update form components.

## Tasks

- [x] 1. Setup foundation dan extend validation schemas
  - [x] 1.1 Create input validation schemas for all entities
    - Add `createAssetSchema` to `lib/validations/asset.ts`
    - Add `createLocationSchema` to `lib/validations/location.ts`
    - Add `createMutationSchema` with location validation to `lib/validations/mutation.ts`
    - Add `createUserSchema` to `lib/validations/user.ts`
    - Add `createAuditLogSchema` to `lib/validations/audit.ts`
    - _Requirements: 1.5, 2.5, 3.5, 3.6, 4.5, 6.1, 6.2, 6.3_

  - [x] 1.2 Write property test for validation schemas
    - **Property 4: Validation rejects invalid input**
    - **Property 5: Mutation location validation**
    - **Validates: Requirements 1.5, 2.5, 3.5, 3.6, 4.5**

- [x] 2. Extend service layer with create methods
  - [x] 2.1 Extend asset-service with create and generateId methods
    - Add `create(data: CreateAssetInput): Promise<TAsset>` method
    - Add `generateId(): Promise<string>` method for AST-XXXX pattern
    - _Requirements: 1.1, 1.6_

  - [x] 2.2 Extend location-service with create and generateId methods
    - Add `create(data: CreateLocationInput): Promise<TLocation>` method
    - Add `generateId(): Promise<string>` method for LOC-XXX pattern
    - _Requirements: 2.1, 2.6_

  - [x] 2.3 Extend mutation-service with create and generateId methods
    - Add `create(data: CreateMutationInput): Promise<TMutation>` method
    - Add `generateId(): Promise<string>` method for MUT-XXX pattern
    - Set default status to "diproses"
    - _Requirements: 3.1, 3.7, 3.8_

  - [x] 2.4 Extend user-service with create and generateId methods
    - Add `create(data: CreateUserInput): Promise<TUser>` method
    - Add `generateId(): Promise<string>` method for USR-XXX pattern
    - Add `checkEmailExists(email: string): Promise<boolean>` method
    - Set default status to "aktif"
    - _Requirements: 4.1, 4.6, 4.7, 4.8_

  - [x] 2.5 Extend audit-service with create method
    - Add `create(data: CreateAuditLogInput): Promise<TAuditLog>` method
    - Auto-generate timestamp
    - _Requirements: 5.1, 5.4_

  - [x] 2.6 Write property tests for service layer
    - **Property 1: Create operation persists data correctly**
    - **Property 2: ID generation follows pattern and is unique**
    - **Property 6: Default values are set correctly**
    - **Validates: Requirements 1.1, 1.6, 2.1, 2.6, 3.1, 3.7, 3.8, 4.1, 4.7, 4.8**

- [x] 3. Checkpoint - Ensure service layer tests pass
  - All 37 unit tests passing (validation schemas + service layer property tests)

- [x] 4. Create server actions
  - [x] 4.1 Create asset server action
    - Create `lib/actions/asset-actions.ts`
    - Implement `createAsset(formData: FormData): Promise<ActionResult>`
    - Validate input, generate ID, call service, create audit log, revalidate path
    - _Requirements: 1.1, 1.4, 1.6_

  - [x] 4.2 Create location server action
    - Create `lib/actions/location-actions.ts`
    - Implement `createLocation(formData: FormData): Promise<ActionResult>`
    - Validate input, generate ID, call service, create audit log, revalidate path
    - _Requirements: 2.1, 2.4, 2.6_

  - [x] 4.3 Create mutation server action
    - Create `lib/actions/mutation-actions.ts`
    - Implement `createMutation(formData: FormData): Promise<ActionResult>`
    - Validate input (including location check), generate ID, call service, create audit log, revalidate path
    - _Requirements: 3.1, 3.4, 3.6, 3.7, 3.8_

  - [x] 4.4 Create user server action
    - Create `lib/actions/user-actions.ts`
    - Implement `createUser(formData: FormData): Promise<ActionResult>`
    - Validate input, check email uniqueness, generate ID, call service, create audit log, revalidate path
    - _Requirements: 4.1, 4.4, 4.6, 4.7, 4.8_

  - [x] 4.5 Write property test for audit log creation
    - **Property 3: Audit log creation on CRUD operations**
    - **Validates: Requirements 1.4, 2.4, 3.4, 4.4, 5.1**

- [x] 5. Update form components
  - [x] 5.1 Update asset-form.tsx
    - Add React Hook Form with zodResolver
    - Add useTransition for pending state
    - Call createAsset server action on submit
    - Show toast notifications (success/error)
    - Add loading state to submit button
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 5.2 Update location-form.tsx
    - Add React Hook Form with zodResolver
    - Add useTransition for pending state
    - Call createLocation server action on submit
    - Show toast notifications (success/error)
    - Add loading state to submit button
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 5.3 Update mutation-form.tsx
    - Add React Hook Form with zodResolver
    - Add useTransition for pending state
    - Call createMutation server action on submit
    - Show toast notifications (success/error)
    - Add loading state to submit button
    - Add validation error display for same location
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [x] 5.4 Update user-form.tsx
    - Add React Hook Form with zodResolver
    - Add useTransition for pending state
    - Call createUser server action on submit
    - Show toast notifications (success/error)
    - Add loading state to submit button
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 6. Checkpoint - Ensure all tests pass and forms work
  - Ensure all tests pass, ask the user if questions arise.
  - Manual testing: verify forms save data to database ✓
  - Verify audit logs are created ✓

- [x] 7. Integration tests
  - [x] 7.1 Write integration tests for form submission flow
    - Test complete flow: form submit → server action → database → UI update
    - 17 integration tests covering all CRUD operations
    - _Requirements: 1.1, 2.1, 3.1, 4.1_

## ✅ SPEC COMPLETE

All tasks completed. Total: 66 tests passing.

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Use existing service layer pattern for consistency
- All forms use sonner for toast notifications (already installed)
