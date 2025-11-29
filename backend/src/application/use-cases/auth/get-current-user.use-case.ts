import { IUserRepository } from '../../../domain/repositories/user.repository';
import { CurrentUserDto } from '../../dto/auth.dto';
import { NotFoundError } from '../../../shared/errors/not-found-error';

export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<CurrentUserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const roles = user.roles.map((ur) => ur.role.name);

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roles,
    };
  }
}
