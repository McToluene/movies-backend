import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthDto) {
    return this.authService.validateUser(data.email, data.password);
  }

  @Post('register')
  async register(@Body() data: AuthDto) {
    return this.authService.register(data.email, data.password);
  }
}
