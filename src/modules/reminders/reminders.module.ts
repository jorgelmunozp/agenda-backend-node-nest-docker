import { Module } from '@nestjs/common';
import { RemindersController } from './controller/reminders.controller';
import { RemindersService } from './service/reminders.service';
import { UsersService } from '../users/service/users.service';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, UsersService],
  exports: [RemindersService],      // por si otro módulo lo necesita
})
export class RemindersModule {}