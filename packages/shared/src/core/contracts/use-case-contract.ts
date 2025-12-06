/**
 * Use Case Contract - Specific contracts for SIMANIS use cases
 *
 * Setiap use case harus implement contract yang sesuai.
 * Contract memastikan konsistensi dan type safety.
 */

import type { Result, ResultError } from '../defensive/result'
import type {
  ExecutionContext,
  PaginatedResult,
  PaginationOptions,
  UseCase,
  UseCaseInput,
  UseCaseOutput,
} from './base-contract'

// ============================================
// ASSET USE CASE CONTRACTS
// ============================================

export interface CreateAssetInput extends UseCaseInput {
  data: {
    kodeAset: string
    nama: string
    kategoriId: string
    lokasiId: string
    nilaiPerolehan: number
    tanggalPerolehan: Date
    kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat'
    sumberDana?: string
    masaManfaat?: number
    keterangan?: string
  }
}

export interface AssetOutput {
  id: string
  kodeAset: string
  nama: string
  kategoriId: string
  lokasiId: string
  nilaiPerolehan: number
  nilaiBuku: number
  tanggalPerolehan: Date
  kondisi: string
  status: string
  qrCode?: string
  createdAt: Date
  updatedAt: Date
}

export type CreateAssetUseCase = UseCase<CreateAssetInput, AssetOutput>

export interface GetAssetInput extends UseCaseInput {
  assetId: string
}

export type GetAssetUseCase = UseCase<GetAssetInput, AssetOutput | null>

export interface ListAssetsInput extends UseCaseInput {
  filters?: {
    kategoriId?: string
    lokasiId?: string
    kondisi?: string
    status?: string
    search?: string
  }
  pagination?: PaginationOptions
}

export type ListAssetsUseCase = UseCase<
  ListAssetsInput,
  PaginatedResult<AssetOutput>
>

// ============================================
// LOAN USE CASE CONTRACTS
// ============================================

export interface CreateLoanInput extends UseCaseInput {
  data: {
    peminjam: string
    tanggalPinjam: Date
    tanggalKembali?: Date
    keperluan: string
    assetIds: string[]
  }
}

export interface LoanOutput {
  id: string
  peminjam: string
  tanggalPinjam: Date
  tanggalKembali?: Date
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat'
  keperluan: string
  items: Array<{
    assetId: string
    kondisiSebelum: string
    kondisiSesudah?: string
  }>
  createdAt: Date
}

export type CreateLoanUseCase = UseCase<CreateLoanInput, LoanOutput>

// ============================================
// INVENTORY CHECK USE CASE CONTRACTS
// ============================================

export interface CreateInventoryCheckInput extends UseCaseInput {
  data: {
    nama: string
    tanggalMulai: Date
    tanggalSelesai?: Date
    lokasiId?: string
    keterangan?: string
  }
}

export interface InventoryCheckOutput {
  id: string
  nama: string
  tanggalMulai: Date
  tanggalSelesai?: Date
  status: 'Draft' | 'Berlangsung' | 'Selesai'
  totalAset: number
  totalDitemukan: number
  totalTidakDitemukan: number
  createdAt: Date
}

export type CreateInventoryCheckUseCase = UseCase<
  CreateInventoryCheckInput,
  InventoryCheckOutput
>

// ============================================
// DEPRECIATION USE CASE CONTRACTS
// ============================================

export interface CalculateDepreciationInput extends UseCaseInput {
  assetId: string
  tahun: number
}

export interface DepreciationOutput {
  assetId: string
  tahun: number
  nilaiAwal: number
  penyusutan: number
  nilaiBuku: number
  metode: 'straight-line'
}

export type CalculateDepreciationUseCase = UseCase<
  CalculateDepreciationInput,
  DepreciationOutput
>

// ============================================
// HELPER: Create execution context
// ============================================

export function createExecutionContext(
  userId?: string,
  userRole?: string,
  ipAddress?: string,
  userAgent?: string
): ExecutionContext {
  return {
    correlationId: `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`,
    userId,
    userRole,
    ipAddress,
    userAgent,
    timestamp: new Date(),
  }
}
