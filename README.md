# SIMANIS - Sistem Manajemen Aset Sekolah

Frontend application untuk sistem manajemen aset sekolah menggunakan React, TypeScript, dan Vite.

## 🚀 Features

- ✅ **Asset Management** - CRUD aset dengan QR code
- ✅ **Inventory** - Stock opname dengan QR scanner
- ✅ **Loans** - Manajemen peminjaman aset
- ✅ **Dashboard** - Statistik dan aktivitas terbaru
- ✅ **Reports** - Generate laporan KIB (Excel/PDF)
- ✅ **Audit Trail** - Jejak perubahan data
- ✅ **PWA Support** - Installable & offline capable
- ✅ **Responsive** - Mobile-friendly design

## 📋 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TanStack Query** - Data fetching & caching
- **React Router** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vitest** - Unit testing
- **PWA** - Progressive Web App

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone repository
git clone https://github.com/wiwinpa5aribu/simanis.git
cd simanis

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Application will run at http://localhost:5000

### Environment Variables

Create `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_USE_MOCK_API=true
VITE_ENABLE_LOGGING=true
VITE_PWA_ENABLED=true
```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

## 📁 Project Structure

```
simanis/
├── src/                    # Frontend source code
│   ├── routes/            # Feature pages (by domain)
│   │   ├── auth/         # Authentication
│   │   ├── assets/       # Asset management
│   │   ├── categories/   # Categories
│   │   ├── loans/        # Loans
│   │   ├── inventory/    # Inventory with QR
│   │   ├── dashboard/    # Dashboard
│   │   ├── depreciation/ # Depreciation
│   │   ├── reports/      # Reports
│   │   ├── audit/        # Audit trail
│   │   └── profile/      # User profile
│   │
│   ├── components/        # Shared UI components
│   │   ├── table/        # DataTable
│   │   ├── filters/      # FilterBar
│   │   ├── uploads/      # FileUpload
│   │   ├── layout/       # AppLayout, ProtectedRoute
│   │   └── ui/           # Base UI components
│   │
│   ├── libs/             # Core libraries
│   │   ├── api/         # API client & endpoints
│   │   │   └── mock/    # Mock data
│   │   ├── auth/        # Auth & permissions
│   │   ├── hooks/       # Custom hooks
│   │   ├── store/       # Zustand stores
│   │   ├── ui/          # UI utilities
│   │   ├── utils/       # General utilities
│   │   └── validation/  # Zod schemas
│   │
│   ├── constants/        # App constants
│   ├── styles/           # Global styles
│   └── test/             # Test utilities
│
├── backend/              # Backend API (future)
│   └── README.md        # Backend planning
│
├── public/              # Static assets
├── ARCHITECTURE.md      # Architecture documentation
└── README.md           # This file
```

📖 **Detailed Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete architecture documentation.

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing documentation.

```bash
# Run all tests
npm test

# Run specific test file
npm test Button.test.tsx

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture & best practices ⭐
- [API Requirements](./project-docs/API_REQUIREMENTS.md) - Backend API specification
- [Testing Guide](./project-docs/TESTING_GUIDE.md) - Testing documentation
- [Collaboration Guide](./project-docs/COLLABORATION.md) - Git workflow
- [Structure](./project-docs/STRUKTUR_FRONTEND.md) - Folder structure (legacy)

## 🔧 Development

### With Mock API (No Backend)

```bash
# .env.local
VITE_USE_MOCK_API=true

npm run dev
```

### With Real Backend

```bash
# .env.local
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000/api

# Make sure backend is running
npm run dev
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Team

- **Owner**: [wiwinpsrb](https://github.com/wiwinpsrb)
- **Developer**: [wiwinpa5aribu](https://github.com/wiwinpa5aribu)

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-19


## 🐛 Debugging & Maintenance

Aplikasi SIMANIS dilengkapi dengan sistem debugging yang komprehensif:

### Fitur Debugging

- ✅ **Logging Terpusat** - Semua operasi ter-log dengan detail
- ✅ **Error Boundary** - Mencegah aplikasi crash total
- ✅ **Try-Catch** - Semua async functions dengan error handling
- ✅ **Constants** - Nilai tetap terpusat untuk mudah maintenance
- ✅ **API Logging** - Semua API calls ter-monitor

### Quick Debug

1. Buka browser console (F12)
2. Lihat log dengan format:
   ```
   [HH:MM:SS.mmm] [Component] 🎯 Pesan
   ```
3. Jika ada error, akan muncul detail lengkap

### Dokumentasi Debugging

- 📖 **[DEBUGGING.md](./DEBUGGING.md)** - Panduan lengkap debugging
- 📝 **[QUICK_DEBUG_GUIDE.md](./QUICK_DEBUG_GUIDE.md)** - Quick reference
- 📋 **[CHANGELOG_DEBUGGING.md](./CHANGELOG_DEBUGGING.md)** - Detail perubahan
- 📊 **[SUMMARY_IMPROVEMENTS.md](./SUMMARY_IMPROVEMENTS.md)** - Ringkasan peningkatan

### Contoh Log

```
[14:23:45.123] [Assets API] ℹ️ Mengambil daftar aset
[14:23:45.456] [API] 🌐 GET /assets
[14:23:45.789] [API Response] ✅ GET /assets - Status: 200
[14:23:45.890] [Assets API] ✅ Berhasil mengambil 25 aset
```

### File Penting

```
src/
├── constants/index.ts       # Semua constants
├── utils/logger.ts          # Sistem logging
├── components/
│   └── ErrorBoundary.tsx    # Error boundary
└── libs/api/                # API dengan logging & try-catch
```

### Tips

- Semua log muncul di **development mode**
- Error log tetap aktif di **production**
- Pesan dalam **Bahasa Indonesia**
- Mudah di-customize sesuai kebutuhan

---
