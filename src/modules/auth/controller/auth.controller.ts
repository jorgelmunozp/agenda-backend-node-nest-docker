import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Post /auth/login
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const token = await this.authService.generateToken(user);

    return token;
  }
}