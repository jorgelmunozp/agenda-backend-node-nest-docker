import { Module } from '@nestjs/common';
import { TasksController } from './controller/tasks.controller';
import { TasksService } from './service/tasks.service';
import { UsersService } from '../users/service/users.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, UsersService],
  exports: [TasksService],      // por si otro módulo lo necesita
})
export class TasksModule {}