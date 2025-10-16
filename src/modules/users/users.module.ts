import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { AuthService } from '../auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService],
  exports: [UsersService],                  // por si otro módulo lo necesita
})
export class UsersModule {}