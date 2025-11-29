import { ILoanRepository } from '../../../domain/repositories/loan.repository';
import { CreateLoanInput } from '../../validators/loan.validators';
import { LoanDto } from '../../dto/loan.dto';
import { logger } from '../../../shared/logger/winston.logger';

export class CreateLoanUseCase {
  constructor(private loanRepository: ILoanRepository) {}

  async execute(data: CreateLoanInput): Promise<LoanDto> {
    // Convert tanggalPinjam string to Date
    const tanggalPinjam = new Date(data.tanggalPinjam);

    // Create loan
    const loan = await this.loanRepository.create({
      ...data,
      tanggalPinjam,
    });

    logger.info('Loan created', {
      loanId: loan.id,
      requestedBy: data.requestedBy,
      itemsCount: data.items.length,
    });

    // Return with relations
    const loanWithRelations = await this.loanRepository.findById(loan.id);
    return loanWithRelations!;
  }
}
