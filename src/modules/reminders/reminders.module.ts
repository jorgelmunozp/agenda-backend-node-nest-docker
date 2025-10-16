import { Module } from '@nestjs/common';
import { RemindersController } from './controller/reminders.controller';
import { RemindersService } from './service/reminders.service';
import { UsersService } from '../users/service/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, UsersService, JwtService],
  exports: [RemindersService],      // por si otro módulo lo necesita
})
export class RemindersModule {}