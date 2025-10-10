
import { IUserRepository } from '../../domain/repositories/user.repository';
import { IUserService } from '../../domain/services/user.service.interface';
import { LoginDto, RegisterDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { encrypt } from '@/lib/auth';
import { UserRole } from '../../domain/entities/user-role.enum';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const userToCreate = {
      ...registerDto,
      role: registerDto.role || UserRole.USER,
    }
    const newUser = await this.userRepository.create(userToCreate);
    return newUser;
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password' | 'comparePassword'>; token: string }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = await encrypt({ userId: user.id, email: user.email, role: user.role });
    
    return { user: UserMapper.toDto(user), token };
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'password' | 'comparePassword'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new Error('Email already in use by another account.');
      }
      user.email = dto.email;
    }

    if (dto.name) {
      user.name = dto.name;
    }
    
    if (dto.password) {
      user.password = dto.password;
    }

    const updatedUser = await this.userRepository.update(user);
    return UserMapper.toDto(updatedUser);
  }
}
