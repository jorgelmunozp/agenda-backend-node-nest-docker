import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(loginDto: { username: string; password: string }) {
    const user = await this.authRepository.findByUsername(loginDto.username);

    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Usuario o contraseña incorrecta');
    }

    return { message: 'Login correctamente', user };
  }
}
