import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/jwt/constants';

@Module({
  imports: [
    forwardRef(() => AuthModule),       // 👈 evita el error circular
    PassportModule,
    JwtModule.register({                    // Módulo JWT con la clave secreta y expiración
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],                  // por si otro módulo lo necesita
})
export class UsersModule {}