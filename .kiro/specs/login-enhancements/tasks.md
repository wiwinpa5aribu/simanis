# Implementation Plan

- [x] 1. Setup Database Schema untuk Password Reset dan Rate Limiting
  - [x] 1.1 Tambahkan model PasswordResetToken ke Prisma schema

    - Buat model dengan fields: id, userId, token, expiresAt, usedAt, createdAt
    - Tambahkan relasi ke User model
    - _Requirements: 3.2, 3.6_

  - [x] 1.2 Tambahkan model LoginAttempt ke Prisma schema
    - Buat model dengan fields: id, ip, username, success, attemptedAt
    - Tambahkan index untuk query rate limiting
    - _Requirements: 4.5_
  - [x] 1.3 Jalankan Prisma migration
    - Generate migration file
    - Apply migration ke database
    - _Requirements: 3.2, 4.5_

- [x] 2. Implementasi Remember Me Feature (Frontend)
  - [x] 2.1 Update AuthStore untuk mendukung Remember Me

    - Tambahkan field rememberMe ke state
    - Modifikasi login function untuk menerima parameter rememberMe
    - Implementasi logic penyimpanan ke localStorage vs sessionStorage
    - _Requirements: 1.1, 1.2_

  - [x] 2.2 Write property test untuk Remember Me storage behavior
    - **Property 1: Remember Me Storage Behavior**
    - **Validates: Requirements 1.1, 1.2**
  - [x] 2.3 Update LoginPage dengan checkbox Remember Me
    - Tambahkan checkbox "Ingat Saya" di form
    - Update form schema untuk include rememberMe field
    - Pass rememberMe value ke login function
    - _Requirements: 1.1, 1.2_
  - [x] 2.4 Implementasi token expiry check
    - Tambahkan logic untuk check token age saat app load
    - Clear expired tokens dan redirect ke login
    - _Requirements: 1.4_
  - [x] 2.5 Write property test untuk token expiry
    - **Property 2: Token Expiry Enforcement**
    - **Validates: Requirements 1.4**
  - [x] 2.6 Update logout function untuk clear semua storage
    - Pastikan logout menghapus dari localStorage dan sessionStorage
    - _Requirements: 1.5_
  - [x] 2.7 Write property test untuk logout behavior

    - **Property 3: Logout Clears All Storage**
    - **Validates: Requirements 1.5**

- [x] 3. Checkpoint - Pastikan semua tests passing


  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implementasi Offline Notice Feature (Frontend)
  - [ ] 4.1 Buat NetworkContext untuk track status koneksi
    - Buat context dengan isOnline dan wasOffline state
    - Implementasi event listeners untuk online/offline events
    - _Requirements: 2.1, 2.2_
  - [ ] 4.2 Buat OfflineBanner component
    - Tampilkan banner saat offline dengan pesan "Anda sedang offline"
    - Tampilkan toast saat kembali online
    - Style dengan Tailwind CSS
    - _Requirements: 2.1, 2.2_
  - [ ] 4.3 Write property test untuk offline detection
    - **Property 4: Offline Detection Consistency**
    - **Validates: Requirements 2.1, 2.2**
  - [ ] 4.4 Integrasikan OfflineBanner ke AppLayout
    - Wrap app dengan NetworkProvider
    - Render OfflineBanner di top of layout
    - _Requirements: 2.1, 2.2_
  - [ ] 4.5 Update API client untuk handle offline errors
    - Detect network errors dan tampilkan pesan offline
    - _Requirements: 2.3_
  - [ ] 4.6 Buat OfflinePage untuk cold start offline
    - Halaman khusus saat app dimuat dalam kondisi offline
    - Instruksi untuk memeriksa koneksi
    - _Requirements: 2.5_

- [ ] 5. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implementasi Rate Limiting (Backend)
  - [ ] 6.1 Buat LoginAttemptRepository
    - Implementasi findRecentAttempts untuk query attempts dalam window
    - Implementasi create untuk record attempt baru
    - _Requirements: 4.5_
  - [ ] 6.2 Buat RateLimitService
    - Implementasi checkLoginRateLimit function
    - Return boolean apakah request diizinkan
    - _Requirements: 4.5_
  - [ ] 6.3 Integrasikan rate limiting ke login endpoint
    - Check rate limit sebelum proses login
    - Record attempt setelah login (success atau fail)
    - Return error 429 jika rate limited
    - _Requirements: 4.5_
  - [ ] 6.4 Write property test untuk login rate limiting
    - **Property 9: Login Rate Limiting**
    - **Validates: Requirements 4.5**

- [ ] 7. Implementasi Lupa Password (Backend)
  - [ ] 7.1 Setup Resend email service
    - Install resend package
    - Buat ResendService dengan sendPasswordResetEmail function
    - Tambahkan environment variables
    - _Requirements: 3.2_
  - [ ] 7.2 Buat PasswordResetTokenRepository
    - Implementasi create, findByToken, markAsUsed
    - _Requirements: 3.2, 3.6_
  - [ ] 7.3 Buat ForgotPasswordUseCase
    - Generate secure random token
    - Simpan token dengan expiry 1 jam
    - Kirim email dengan reset link
    - Return response yang sama untuk email valid/invalid
    - _Requirements: 3.2, 3.3_
  - [ ] 7.4 Write property test untuk email enumeration prevention
    - **Property 7: Email Enumeration Prevention**
    - **Validates: Requirements 3.3**
  - [ ] 7.5 Buat ResetPasswordUseCase
    - Validasi token (exists, not expired, not used)
    - Update password user
    - Mark token as used
    - _Requirements: 3.4, 3.5, 3.6_
  - [ ] 7.6 Write property test untuk password reset token validity
    - **Property 5: Password Reset Token Validity**
    - **Validates: Requirements 3.2, 3.6**
  - [ ] 7.7 Write property test untuk password reset round trip
    - **Property 6: Password Reset Round Trip**
    - **Validates: Requirements 3.5**
  - [ ] 7.8 Buat PasswordController dengan endpoints
    - POST /api/auth/forgot-password
    - POST /api/auth/reset-password
    - GET /api/auth/verify-reset-token/:token
    - _Requirements: 3.1, 3.4, 3.5_
  - [ ] 7.9 Implementasi rate limiting untuk password reset
    - Max 3 requests per email per jam
    - _Requirements: 3.7_
  - [ ] 7.10 Write property test untuk password reset rate limiting
    - **Property 10: Password Reset Rate Limiting**
    - **Validates: Requirements 3.7**

- [ ] 8. Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implementasi Lupa Password (Frontend)
  - [ ] 9.1 Buat ForgotPasswordPage
    - Form dengan input email
    - Submit ke /api/auth/forgot-password
    - Tampilkan pesan sukses (selalu sama)
    - Link kembali ke login
    - _Requirements: 3.1, 3.3_
  - [ ] 9.2 Buat ResetPasswordPage
    - Form dengan password dan confirm password
    - Validasi password match
    - Submit ke /api/auth/reset-password
    - Redirect ke login dengan pesan sukses
    - _Requirements: 3.4, 3.5_
  - [ ] 9.3 Tambahkan link "Lupa Password?" di LoginPage
    - Link ke /forgot-password
    - _Requirements: 3.1_
  - [ ] 9.4 Setup routing untuk halaman baru
    - /forgot-password → ForgotPasswordPage
    - /reset-password/:token → ResetPasswordPage
    - _Requirements: 3.1, 3.4_

- [ ] 10. Implementasi Peningkatan Error Messages (Frontend)
  - [ ] 10.1 Update error message constants
    - Tambahkan semua error messages ke constants file
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ] 10.2 Update API client error handling
    - Map error codes ke user-friendly messages
    - Handle network errors dengan pesan khusus
    - Handle server errors (5xx) dengan pesan khusus
    - _Requirements: 4.3, 4.4_
  - [ ] 10.3 Write property test untuk consistent error messages
    - **Property 8: Consistent Login Error Messages**
    - **Validates: Requirements 4.1, 4.2**
  - [ ] 10.4 Update LoginPage error display
    - Tampilkan error messages yang sudah di-map
    - Tampilkan rate limit message jika applicable
    - _Requirements: 4.1, 4.2, 4.5_

- [ ] 11. Final Checkpoint - Pastikan semua tests passing
  - Ensure all tests pass, ask the user if questions arise.
