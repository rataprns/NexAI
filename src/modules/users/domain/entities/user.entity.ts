import bcrypt from 'bcryptjs';
import { UserRole } from './user-role.enum';

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date,
    password?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return bcrypt.compare(password, this.password);
  }
}
