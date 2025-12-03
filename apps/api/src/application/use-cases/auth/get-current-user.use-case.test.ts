import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetCurrentUserUseCase } from './get-current-user.use-case'
import type { IUserRepository, UserWithRoles } from '../../../domain/repositories/user.repository'
import { NotFoundError } from '../../../shared/errors/not-found-error'

describe('GetCurrentUserUseCase', () => {
  let getCurrentUserUseCase: GetCurrentUserUseCase
  let mockUserRepository: IUserRepository

  const mockUser: UserWithRoles = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword',
    isActive: true,
    resetToken: null,
    resetTokenExpiry: null,
    loginAttempts: 0,
    lastLoginAttempt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [
      {
        role: {
          id: 1,
          name: 'Admin',
          description: 'Administrator',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
  }

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Create mock repository
    mockUserRepository = {
      findByUsername: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      assignRole: vi.fn(),
      removeRole: vi.fn(),
    }

    getCurrentUserUseCase = new GetCurrentUserUseCase(mockUserRepository)
  })

  describe('Successful User Retrieval', () => {
    it('should return user data when user exists', async () => {
      // Arrange
      const userId = 1
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser)

      // Act
      const result = await getCurrentUserUseCase.execute(userId)

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        username: mockUser.username,
        email: mockUser.email,
        roles: ['Admin'],
      })

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should handle user with multiple roles', async () => {
      // Arrange
      const userWithMultipleRoles: UserWithRoles = {
        ...mockUser,
        roles: [
          {
            role: {
              id: 1,
              name: 'Admin',
              description: 'Administrator',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            role: {
              id: 2,
              name: 'Operator',
              description: 'Operator',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            role: {
              id: 3,
              name: 'Viewer',
              description: 'Viewer',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      }

      vi.mocked(mockUserRepository.findById).mockResolvedValue(
        userWithMultipleRoles
      )

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result.roles).toEqual(['Admin', 'Operator', 'Viewer'])
      expect(result.roles).toHaveLength(3)
    })

    it('should handle user with no roles', async () => {
      // Arrange
      const userWithNoRoles: UserWithRoles = {
        ...mockUser,
        roles: [],
      }

      vi.mocked(mockUserRepository.findById).mockResolvedValue(userWithNoRoles)

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result.roles).toEqual([])
      expect(result.roles).toHaveLength(0)
    })

    it('should handle user with null email', async () => {
      // Arrange
      const userWithNullEmail: UserWithRoles = {
        ...mockUser,
        email: null,
      }

      vi.mocked(mockUserRepository.findById).mockResolvedValue(
        userWithNullEmail
      )

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result.email).toBeNull()
    })
  })

  describe('User Not Found', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userId = 999
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute(userId)).rejects.toThrow(
        NotFoundError
      )

      await expect(getCurrentUserUseCase.execute(userId)).rejects.toThrow(
        'User tidak ditemukan'
      )

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundError for invalid user ID (0)', async () => {
      // Arrange
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute(0)).rejects.toThrow(
        NotFoundError
      )
    })

    it('should throw NotFoundError for negative user ID', async () => {
      // Arrange
      vi.mocked(mockUserRepository.findById).mockResolvedValue(null)

      // Act & Assert
      await expect(getCurrentUserUseCase.execute(-1)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe('Data Consistency', () => {
    it('should not include password in response', async () => {
      // Arrange
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser)

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result).not.toHaveProperty('password')
      expect(Object.keys(result)).toEqual([
        'id',
        'name',
        'username',
        'email',
        'roles',
      ])
    })

    it('should not include sensitive fields in response', async () => {
      // Arrange
      vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser)

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result).not.toHaveProperty('password')
      expect(result).not.toHaveProperty('resetToken')
      expect(result).not.toHaveProperty('resetTokenExpiry')
      expect(result).not.toHaveProperty('loginAttempts')
      expect(result).not.toHaveProperty('lastLoginAttempt')
    })

    it('should maintain role order from database', async () => {
      // Arrange
      const userWithOrderedRoles: UserWithRoles = {
        ...mockUser,
        roles: [
          {
            role: {
              id: 3,
              name: 'Viewer',
              description: 'Viewer',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            role: {
              id: 1,
              name: 'Admin',
              description: 'Admin',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            role: {
              id: 2,
              name: 'Operator',
              description: 'Operator',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      }

      vi.mocked(mockUserRepository.findById).mockResolvedValue(
        userWithOrderedRoles
      )

      // Act
      const result = await getCurrentUserUseCase.execute(1)

      // Assert
      expect(result.roles).toEqual(['Viewer', 'Admin', 'Operator'])
    })
  })
})
