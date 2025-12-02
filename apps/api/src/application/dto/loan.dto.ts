import { Asset, Loan, LoanItem, User } from '@simanis/database'

export interface LoanDto extends Loan {
  requester: User
  items: (LoanItem & { asset: Asset })[]
}

export interface LoanListDto {
  loans: LoanDto[]
  total: number
}
