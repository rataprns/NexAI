import { User } from '../../domain/entities/user.entity';
import { IUser } from '../../infrastructure/persistence/mongoose/models/user.model';

export class UserMapper {
  static toDomain(userDoc: IUser): User {
    return new User(
      userDoc._id.toString(),
      userDoc.name,
      userDoc.email,
      userDoc.role,
      userDoc.createdAt,
      userDoc.updatedAt,
      userDoc.password
    );
  }

  static toDto(user: User): Omit<User, 'password' | 'comparePassword'> {
    const { password, ...userDto } = user;
    return userDto;
  }
}
