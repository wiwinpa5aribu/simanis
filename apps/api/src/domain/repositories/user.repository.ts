import { Role, User } from '@simanis/database'

export type UserWithRoles = User & {
  roles: { role: Role }[]
}

export interface IUserRepository {
  /**
   * Find user by username
   */
  findByUsername(username: string): Promise<UserWithRoles | null>

  /**
   * Find user by ID
   */
  findById(id: number): Promise<UserWithRoles | null>

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<UserWithRoles | null>

  /**
   * Create new user
   */
  create(data: {
    name: string
    username: string
    email?: string
    password: string
  }): Promise<User>

  /**
   * Update user
   */
  update(
    id: number,
    data: {
      name?: string
      email?: string
      password?: string
    }
  ): Promise<User>

  /**
   * Assign role to user
   */
  assignRole(userId: number, roleId: number): Promise<void>

  /**
   * Remove role from user
   */
  removeRole(userId: number, roleId: number): Promise<void>
}
