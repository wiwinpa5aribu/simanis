# Panduan Debugging SIMANIS

## Tools yang Tersedia

### 1. React Query Devtools (Frontend)

Otomatis muncul di pojok kanan bawah saat development mode.

**Fitur:**
- Lihat semua queries dan mutations
- Inspect cache data
- Trigger refetch manual
- Lihat loading/error states

**Cara Pakai:**
- Klik icon React Query di pojok kanan bawah
- Explore queries yang sedang berjalan

### 2. Zustand Devtools (Frontend)

Terintegrasi dengan Redux DevTools browser extension.

**Setup:**
1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. Buka browser DevTools → Redux tab
3. Pilih store: `AuthStore`, `FavoriteStore`, `FilterStore`

**Fitur:**
- Time-travel debugging
- Lihat state changes
- Dispatch actions manual

### 3. Sentry Error Tracking (Backend)

**Setup:**
1. Buat akun di [sentry.io](https://sentry.io)
2. Buat project baru (Node.js)
3. Copy DSN ke `.env`:
   ```
   SENTRY_DSN_BACKEND=https://xxx@xxx.ingest.sentry.io/xxx
   ```

**Fitur:**
- Auto-capture unhandled errors
- Stack traces dengan source maps
- Performance monitoring
- User context tracking

### 4. Winston Logger (Backend)

Logs tersimpan di `backend/logs/`:
- `combined.log` - Semua logs
- `error.log` - Error logs saja

**Log Levels:**
```typescript
logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message', error)
```

### 5. Pino Pretty (Backend Development)

Logs di console lebih readable saat development.

## Tips Debugging

### Frontend
```typescript
// Di component, gunakan React Query hooks
const { data, isLoading, error, refetch } = useQuery({...})

// Log state changes
console.log('Query state:', { data, isLoading, error })
```

### Backend
```typescript
import { logger } from '../shared/logger/winston.logger'

// Log dengan context
logger.info('Asset created', { assetId: 1, userId: 5 })

// Log error dengan stack trace
logger.error('Failed to create asset', { error: err.message, stack: err.stack })
```

### Database
```bash
# Buka Prisma Studio untuk inspect database
cd backend
npm run prisma:studio
```

## Troubleshooting Common Issues

### 1. API Request Gagal
- Cek Network tab di browser DevTools
- Cek React Query Devtools untuk error details
- Cek backend logs di `backend/logs/`

### 2. State Tidak Update
- Cek Zustand Devtools (Redux DevTools)
- Pastikan action ter-dispatch dengan benar

### 3. Database Error
- Cek Prisma Studio untuk data
- Jalankan `npm run prisma:migrate` jika ada schema changes
