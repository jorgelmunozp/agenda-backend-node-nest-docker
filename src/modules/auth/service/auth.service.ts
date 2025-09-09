import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async login(loginDto: { username: string; password: string }) {
    const url = 'http://localhost:3000/users'; // traemos TODOS los usuarios
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const users = response.data;

      // Validar que sea un array
      if (!Array.isArray(users)) {
        throw new UnauthorizedException('Respuesta inválida del servidor');
      }

      // Buscar el usuario por username
      const found = users.find(
        (u: any) => u.user?.username === loginDto.username,
      );

      if (!found) {
        throw new UnauthorizedException('Usuario o contraseña incorrecta');
      }

      // Validar contraseña
      if (found.user.password !== loginDto.password) {
        throw new UnauthorizedException('Usuario o contraseña incorrecta');
      }

      // Retornamos el objeto user (no todo el documento con _id)
      return { message: 'Login correctamente', user: found.user };
    } catch (error) {
      console.error('Error consultando /users:', error);
      throw new UnauthorizedException('No se pudo validar el usuario');
    }
  }
}
