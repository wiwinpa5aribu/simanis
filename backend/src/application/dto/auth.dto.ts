/**
 * Auth DTOs
 */

export interface LoginResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    username: string;
    email: string | null;
    roles: string[];
  };
}

export interface CurrentUserDto {
  id: number;
  name: string;
  username: string;
  email: string | null;
  roles: string[];
}
