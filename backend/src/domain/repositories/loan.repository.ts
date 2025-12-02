import { Asset, Loan, LoanItem, User } from '@prisma/client'

export type LoanWithRelations = Loan & {
  requester: User
  items: (LoanItem & { asset: Asset })[]
}

export interface ILoanRepository {
  /**
   * Find all loans with pagination
   */
  findAll(params: {
    page: number
    pageSize: number
    status?: string
  }): Promise<{ loans: LoanWithRelations[]; total: number }>

  /**
   * Find loan by ID
   */
  findById(id: number): Promise<LoanWithRelations | null>

  /**
   * Create loan with items
   */
  create(data: {
    requestedBy: number
    tanggalPinjam: Date
    tujuanPinjam?: string
    catatan?: string
    items: {
      assetId: number
      conditionBefore?: string
    }[]
  }): Promise<Loan>

  /**
   * Return loan (update status and condition after)
   */
  returnLoan(
    loanId: number,
    items: {
      assetId: number
      conditionAfter: string
    }[]
  ): Promise<Loan>

  /**
   * Count loans by status
   */
  countByStatus(status: string): Promise<number>
}
