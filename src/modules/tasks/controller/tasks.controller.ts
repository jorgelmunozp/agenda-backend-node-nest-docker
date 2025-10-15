import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { TasksService } from '../../tasks/service/tasks.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';
import { CreateTaskDto } from '../dto/create-task.dto';

import jwtEncode from "jwt-encode";
const jwtSecretKey = process.env.JWT_SECRET ?? '';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class TasksController {
  constructor(private readonly tasksService: TasksService, private readonly usersService: UsersService) {}

//************************** TASKS *************************************/
  // Service: Add a Task to a user
  @Post(':id/tasks')
  async addTaskToUser(@Param('id') id: string, @Body() taskDto: CreateTaskDto) {
    this.ensureValidObjectId(id);

    if (!taskDto.name || !taskDto.time || !taskDto.date) {
      throw new BadRequestException('The task must have a name, date and time');
    }

    const updatedUser = await this.tasksService.addTask(id, taskDto);

    if (!updatedUser) {
      throw new NotFoundException(`No user with id found ${id}`);
    }

    console.log(`New task added to user ${id}:`, JSON.stringify(taskDto, null, 2));

    return updatedUser;
  }

  // Service: Get all Tasks from a user
  @Get(':userId/tasks')
  async getAllTasks(@Param('userId') userId: string) {
    this.ensureValidObjectId(userId);

    // Obtener el usuario
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException(`No user with id found ${userId}`);
    }

    // Verificar si tiene tareas
    const tasks = user.user.tasks;
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException(`No tasks found for user ${userId}`);
    }

    return tasks;
  }


  // Service: Get a Task from a user by id
  @Get(':userId/tasks/:taskId')
  async getTaskById( @Param('userId') userId: string, @Param('taskId') taskId: string ) {
    this.ensureValidObjectId(userId);

    // Obtener el usuario
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException(`No user with id found ${userId}`);
    }

    // Buscar la tarea dentro del arreglo
    const task = user.user.tasks.find((t: any) => t.id === taskId);
    if (!task) {
      throw new NotFoundException(`No task with id found ${taskId} for user ${userId}`);
    }

    return task;
  }

  // Service: Update Task to completed
  @Patch(':userId/tasks/:taskId')
  async completeTask( @Param('userId') userId: string, @Param('taskId') taskId: string ) {
    this.ensureValidObjectId(userId);

    const updatedTask = await this.tasksService.completeTask(userId, taskId);
    if (!updatedTask) {
      throw new NotFoundException(`No task with id ${taskId} found for user ${userId}`);
    }

    console.log(`Task ${taskId} for user ${userId} marked as completado:`, updatedTask);

    return updatedTask;
  }

  // Helper privado para validar ObjectId
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
    }
  }
}