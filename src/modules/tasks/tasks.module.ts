import { Module } from '@nestjs/common';
import { TasksController } from './controller/tasks.controller';
import { TasksService } from './service/tasks.service';
import { UsersService } from '../users/service/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TasksController],
  providers: [TasksService, UsersService, JwtService],
  exports: [TasksService],      // por si otro módulo lo necesita
})
export class TasksModule {}