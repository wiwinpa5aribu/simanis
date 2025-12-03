import { IDepreciationRepository } from '../../../domain/repositories/depreciation.repository'

export interface GetDepreciationTrendParams {
  categoryId?: number
  months?: number // default 12
}

export interface DepreciationTrendItemDto {
  month: string // "2025-01"
  totalPenyusutan: number
  totalNilaiBuku: number
}

/**
 * Use case untuk mendapatkan data trend penyusutan 12 bulan terakhir
 * Validates: Requirements 1.2
 */
export class GetDepreciationTrendUseCase {
  constructor(private depreciationRepository: IDepreciationRepository) {}

  async execute(params: GetDepreciationTrendParams): Promise<DepreciationTrendItemDto[]> {
    const { categoryId, months = 12 } = params

    // Get trend data from repository
    const trendData = await this.depreciationRepository.getMonthlyTrend({
      categoryId,
    })

    // Ensure we have data for all months (fill gaps with zeros)
    const result = this.fillMissingMonths(trendData, months)

    return result
  }

  private fillMissingMonths(
    data: DepreciationTrendItemDto[],
    months: number
  ): DepreciationTrendItemDto[] {
    const now = new Date()
    const result: DepreciationTrendItemDto[] = []
    const dataMap = new Map(data.map((item) => [item.month, item]))

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().substring(0, 7) // YYYY-MM

      const existing = dataMap.get(monthKey)
      result.push(
        existing || {
          month: monthKey,
          totalPenyusutan: 0,
          totalNilaiBuku: 0,
        }
      )
    }

    return result
  }
}
