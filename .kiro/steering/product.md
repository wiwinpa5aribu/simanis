# SIMANIS - Sistem Manajemen Aset Sekolah

School Asset Management System for Indonesian schools.

## Purpose

Manage school inventory assets including registration, tracking, loans, depreciation, and reporting.

## Core Features

- Asset registration with QR code generation
- Location tracking via building/floor/room hierarchy
- Asset mutations (location transfers)
- Loan management for teachers/staff
- Periodic inventory checks (stock opname) via QR scanning
- Automatic depreciation calculation (straight-line method)
- KIB report generation (Excel/PDF)
- Audit trail for all changes

## User Roles

- Kepsek (Principal)
- Wakasek Sarpras (Vice Principal - Facilities)
- Bendahara BOS (BOS Treasurer)
- Operator
- Guru (Teacher)

## Domain Language

Use Indonesian terminology for domain concepts:
- Aset (Asset)
- Peminjaman (Loan)
- Mutasi (Transfer/Mutation)
- Inventarisasi (Inventory Check)
- Penyusutan (Depreciation)
- Kondisi: Baik, Rusak Ringan, Rusak Berat, Hilang
- Sumber Dana: BOS, APBD, Hibah
