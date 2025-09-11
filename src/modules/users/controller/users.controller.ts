import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//************************** USERS *************************************/
  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.getById(id);
  }

  @Post()
  async addUser(@Body() body: any) {
    // Validaciones mínimas
    if (!body.name) throw new BadRequestException('Name is required');
    if (!body.email) throw new BadRequestException('Email is required');
    if (!body.username) throw new BadRequestException('Username is required');
    if (!body.password) throw new BadRequestException('Password is required');

    // Construcción explícita del objeto user
    const userData = {
      name: body.name,
      email: body.email,
      username: body.username,
      password: body.password,
      tasks: Array.isArray(body.tasks) ? body.tasks : [],
      reminders: Array.isArray(body.reminders) ? body.reminders : []
    };

    // Valida si ya existe un usuario con el mismo email o username
    const existingData = await this.usersService.findByEmailOrUsername(body.email, body.username);

    if (existingData) {
      let message = 'The following fields already exist: ';
      if (existingData.email) message += 'email ';
      if (existingData.username) message += 'username';
      throw new BadRequestException(message.trim());
    }
  
    console.log("User successfully registered:", userData);
    return this.usersService.create(userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.delete(id);
  }

  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() body: any) {
    this.ensureValidObjectId(id);
    return this.usersService.patch(id, body);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    this.ensureValidObjectId(id);
    if (!body.name) throw new BadRequestException('Name is required');
    return this.usersService.update(id, body);
  }

//************************** TASKS *************************************/
  // Service: Add a Task to a user
  @Post(':id/tasks')
  async addTaskToUser(@Param('id') id: string, @Body() taskDto: any) {
    this.ensureValidObjectId(id);

    if (!taskDto.name || !taskDto.time || !taskDto.date) {
      throw new BadRequestException('The task must have a name, date and time');
    }

    const updatedUser = await this.usersService.addTask(id, taskDto);

    if (!updatedUser) {
      throw new NotFoundException(`No user with id found ${id}`);
    }

    console.log(`New task added to user ${id}:`, JSON.stringify(taskDto, null, 2));

    return updatedUser;
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

    const updatedTask = await this.usersService.completeTask(userId, taskId);
    if (!updatedTask) {
      throw new NotFoundException(`No task with id ${taskId} found for user ${userId}`);
    }

    console.log(`Task ${taskId} for user ${userId} marked as completado:`, updatedTask);

    return updatedTask;
  }


//************************** REMINDERS *************************************/
  // Service: Add a Reminder to a user
  @Post(':id/reminders')
  async addReminderToUser(@Param('id') id: string, @Body() reminderDto: any) {
    this.ensureValidObjectId(id);

    if (!reminderDto.name || !reminderDto.time || !reminderDto.date) {
      throw new BadRequestException('The reminder must have a name, date and time');
    }

    const updatedUser = await this.usersService.addReminder(id, reminderDto);

    if (!updatedUser) {
      throw new NotFoundException(`No user with id found ${id}`);
    }

    console.log(`New reminder added to user ${id}:`, JSON.stringify(reminderDto, null, 2));

    return updatedUser;
  }

  // Service: Get a Reminder from a user by id
  @Get(':userId/reminders/:reminderId')
  async getReminderById( @Param('userId') userId: string, @Param('reminderId') reminderId: string ) {
    this.ensureValidObjectId(userId);

    // Obtener el usuario
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException(`No user with id found ${userId}`);
    }

    // Buscar la tarea dentro del arreglo
    const reminder = user.user.reminders.find((r: any) => r.id === reminderId);
    if (!reminder) {
      throw new NotFoundException(`No reminder with id found ${reminderId} for user ${userId}`);
    }

    return reminder;
  }

  // Service: Update Reminder to completed
  @Patch(':userId/reminders/:reminderId')
  async completeReminder( @Param('userId') userId: string, @Param('reminderId') reminderId: string ) {
    this.ensureValidObjectId(userId);

    const updatedReminder = await this.usersService.completeReminder(userId, reminderId);
    if (!updatedReminder) {
      throw new NotFoundException(`No task with id ${reminderId} found for user ${userId}`);
    }

    console.log(`Task ${reminderId} for user ${userId} marked as completado:`, updatedReminder);

    return updatedReminder;
  }

//************************** PASSWORD RECOVERY *************************************/
  // Service: Send password recovery email
  @Post('recover-password')
  async recoverPassword(@Body() body: { email: string }) {
    if (!body.email) throw new BadRequestException('Email is mandatory');
    return this.usersService.sendPasswordRecoveryEmail(body.email);
  }

  // Helper privado para validar ObjectId
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
    }
  }
}