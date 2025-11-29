# SIMANIS - Sistem Manajemen Aset Sekolah

## Overview
SIMANIS is a school asset management system (Indonesian: Sistem Manajemen Aset Sekolah) designed to track, manage, and report on school assets throughout their lifecycle.

## Core Features
- Asset registration with QR codes for tracking
- Asset categorization and location management (buildings, floors, rooms)
- Loan management for borrowing/returning assets
- Inventory checks with QR scanning
- Depreciation tracking and calculations
- KIB (Kartu Inventaris Barang) report generation
- Audit trail logging
- Role-based access control (Admin, Staff)

## Domain Concepts
- **Asset (Aset)**: Physical items tracked by the system with unique codes and QR identifiers
- **Mutation (Mutasi)**: Movement of assets between rooms/locations
- **Loan (Peminjaman)**: Temporary borrowing of assets with return tracking
- **Inventory Check (Opname)**: Periodic verification of asset condition and location
- **Depreciation (Penyusutan)**: Value reduction calculation over asset lifetime
- **KIB Report**: Official Indonesian government asset inventory card format

## User Roles
- **Admin**: Full system access including user management
- **Staff**: Asset operations, loans, inventory checks
