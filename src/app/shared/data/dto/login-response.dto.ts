import { User } from '../model/user';

export interface LoginResponseDto {
  token: string;
  user: User;
}
