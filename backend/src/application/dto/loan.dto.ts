import { Loan, LoanItem, Asset, User } from '@prisma/client';

export interface LoanDto extends Loan {
  requester: User;
  items: (LoanItem & { asset: Asset })[];
}

export interface LoanListDto {
  loans: LoanDto[];
  total: number;
}
