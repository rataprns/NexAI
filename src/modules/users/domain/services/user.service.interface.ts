
import { LoginDto, RegisterDto, UpdateUserDto } from '../../application/dtos/user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  register(registerDto: RegisterDto): Promise<Omit<User, 'password' | 'comparePassword'>>;
  login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password' | 'comparePassword'>; token: string }>;
  findUserById(userId: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'password' | 'comparePassword'>>;
}
