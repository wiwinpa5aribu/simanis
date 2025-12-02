import { IUserRepository } from '../../../domain/repositories/user.repository'
import { jwtService } from '../../../infrastructure/crypto/jwt.service'
import { passwordService } from '../../../infrastructure/crypto/password.service'
import { UnauthorizedError } from '../../../shared/errors/unauthorized-error'
import { logger } from '../../../shared/logger/winston.logger'
import { LoginResponseDto } from '../../dto/auth.dto'

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, password: string): Promise<LoginResponseDto> {
    logger.info('Login attempt', { username })

    // Find user by username
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      logger.warn('Login failed - user not found', { username })
      throw new UnauthorizedError('Username atau password salah')
    }

    // Verify password
    const isPasswordValid = await passwordService.verify(
      user.password,
      password
    )
    if (!isPasswordValid) {
      logger.warn('Login failed - invalid password', { username })
      throw new UnauthorizedError('Username atau password salah')
    }

    // Extract roles
    const roles = user.roles.map((ur) => ur.role.name)

    // Generate JWT token
    const token = jwtService.sign({
      userId: user.id,
      username: user.username,
      roles,
    })

    logger.info('Login successful', {
      userId: user.id,
      username: user.username,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        roles,
      },
    }
  }
}
