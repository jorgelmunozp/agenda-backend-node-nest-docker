import { Module } from '@nestjs/common';
import { PasswordController } from './controller/password.controller';
import { PasswordService } from './service/password.service';
import { AuthService } from '../auth/service/auth.service';
import { UsersService } from '../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({                    // Registro del módulo JWT con la clave secreta y expiración
      secret: process.env.JWT_SECRET,       // Variable de entorno con secret
      signOptions: { expiresIn: '1h' },     // Tiempo ajustable
    }),
  ],
  controllers: [PasswordController],
  providers: [PasswordService, UsersService, AuthService, JwtService],
  exports: [PasswordService],                  // por si otro módulo lo necesita
})
export class PasswordModule {}