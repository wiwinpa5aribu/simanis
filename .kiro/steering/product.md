# SIMANIS - Product Overview

SIMANIS (Sistem Manajemen Aset Sekolah) is a school asset management system built for Indonesian educational institutions.

## Core Purpose
Track, manage, and audit physical assets across school facilities with full accountability and compliance.

## Key Modules
- `/aset` - Asset inventory management (tracking, categories, conditions)
- `/lokasi` - Hierarchical location management (Gedung → Lantai → Ruangan)
- `/mutasi` - Asset transfer/movement tracking between locations
- `/stock-opname` - Physical inventory verification sessions
- `/audit` - Activity logging for compliance and security
- `/laporan` - Reports, statistics, and data export
- `/users` - User management with role-based access
- `/pencarian` - Global asset search

## Business Rules
- Asset IDs follow pattern `AST-XXXX` (must be unique)
- Assets can only be placed in locations of type `ruangan`
- Mutation statuses: `diproses` → `selesai` or `dibatalkan`
- All critical changes (Create/Update/Delete) must generate an AuditLog entry

## Language Context
- UI text and domain terms are in Indonesian (Bahasa Indonesia)
- Code, comments, and technical documentation use English
