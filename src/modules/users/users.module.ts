import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthService } from '../auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({                    // Registro del módulo JWT con la clave secreta y expiración
      secret: process.env.JWT_SECRET,       // Variable de entorno con secret
      signOptions: { expiresIn: '1h' },     // Tiempo ajustable
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService],
  exports: [UsersService],                  // por si otro módulo lo necesita
})
export class UsersModule {}