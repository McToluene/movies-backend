import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { HashHelper } from './helper/hash.helper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user || !(await HashHelper.compare(password, user.password)))
      throw new UnauthorizedException();
    return this.login(user);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    let user = await this.userService.findOneByEmail(email);
    if (user) throw new ConflictException('Email already registered!');
    const createdUser = {
      email,
      password: await HashHelper.hash(password),
    };

    user = await this.userService.create(createdUser);
    return this.login(user);
  }
}
