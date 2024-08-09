import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(createdUser: { email: string; password: string }) {
    return this.userModel.create(createdUser);
  }
}
