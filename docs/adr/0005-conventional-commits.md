# ADR 0005: Conventional Commits

## Status
**Active** (Updated 19 Des 2025)

## Context
Log git memerlukan keteraturan agar perubahan fitur dan perbaikan bug dapat dilacak dengan mudah oleh tim dan AI.

## Decision
Kami secara konsisten menggunakan **Conventional Commits**.
- Format: <type>: <description>
- Tipe Utama: feat, fix, docs, refactor, chore.

## Consequences
- **Pros**:
    - Changelog dapat dihasilkan secara otomatis.
    - Mempermudah audit perubahan pada rilis produksi.
