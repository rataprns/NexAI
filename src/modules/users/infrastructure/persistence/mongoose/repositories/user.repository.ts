import dbConnect from '@/lib/db';
import { IUserRepository } from '@/modules/users/domain/repositories/user.repository';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserModel, IUser } from '../models/user.model';
import { UserMapper } from '@/modules/users/application/mappers/user.mapper';
import { RegisterDto } from '@/modules/users/application/dtos/user.dto';

export class MongooseUserRepository implements IUserRepository {
  
  public async create(userDto: RegisterDto): Promise<User> {
    await dbConnect();
    const newUser = new UserModel(userDto);
    const savedUser = await newUser.save();
    return UserMapper.toDomain(savedUser);
  }

  public async findByEmail(email: string): Promise<User | null> {
    await dbConnect();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }

  public async findById(id: string): Promise<User | null> {
    await dbConnect();
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }

  public async update(user: User): Promise<User> {
    await dbConnect();
    const userDoc = await UserModel.findById(user.id);
    if (!userDoc) {
      throw new Error('User not found for update');
    }

    userDoc.name = user.name;
    userDoc.email = user.email;
    if (user.password) {
      // The pre-save hook will hash it
      userDoc.password = user.password;
    }

    const savedUser = await userDoc.save();
    return UserMapper.toDomain(savedUser);
  }
}
