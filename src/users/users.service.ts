import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.model';
import { encodePassword } from '../utils/bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(user: any): Promise<User> {
    const hashedPassword = await encodePassword(user.password);
    user.password = hashedPassword;
    try {
      const createdUser = await this.userModel.create(user);
      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Duplicate user name');
      }
    }
  }

  async updateUser(id: string, user: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
