import { ILoanRepository } from '../../../domain/repositories/loan.repository';
import { ReturnLoanInput } from '../../validators/loan.validators';
import { LoanDto } from '../../dto/loan.dto';
import { NotFoundError } from '../../../shared/errors/not-found-error';
import { logger } from '../../../shared/logger/winston.logger';

export class ReturnLoanUseCase {
  constructor(private loanRepository: ILoanRepository) {}

  async execute(loanId: number, data: ReturnLoanInput): Promise<LoanDto> {
    // Check if loan exists
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Peminjaman tidak ditemukan');
    }

    // Return loan
    await this.loanRepository.returnLoan(loanId, data.items);

    logger.info('Loan returned', {
      loanId,
      itemsCount: data.items.length,
    });

    // Return updated loan
    const updatedLoan = await this.loanRepository.findById(loanId);
    return updatedLoan!;
  }
}
