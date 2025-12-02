import { PrismaClient } from '@prisma/client'
import {
  IUserRepository,
  UserWithRoles,
} from '../../../domain/repositories/user.repository'

export class UserRepositoryImpl implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  async findById(id: number): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  async findByEmail(email: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  async create(data: {
    name: string
    username: string
    email?: string
    password: string
  }) {
    return this.prisma.user.create({
      data,
    })
  }

  async update(
    id: number,
    data: {
      name?: string
      email?: string
      password?: string
    }
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  async assignRole(userId: number, roleId: number): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    })
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    })
  }
}
