import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  // Service: Add a task to a user
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

  // Service: Add a reminder to a user
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