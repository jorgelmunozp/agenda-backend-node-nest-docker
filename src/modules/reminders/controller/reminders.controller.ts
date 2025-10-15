import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { RemindersService } from '../../reminders/service/reminders.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';
import { CreateReminderDto } from '../dto/create-reminder.dto';

import jwtEncode from "jwt-encode";
const jwtSecretKey = process.env.JWT_SECRET ?? '';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService, private readonly usersService: UsersService) {}

//************************** REMINDERS *************************************/
  // Service: Add a Reminder to a user
  @Post(':id/reminders')
  async addReminderToUser(@Param('id') id: string, @Body() reminderDto: CreateReminderDto) {
    this.ensureValidObjectId(id);

    if (!reminderDto.name || !reminderDto.time || !reminderDto.date) {
      throw new BadRequestException('The reminder must have a name, date and time');
    }

    const updatedUser = await this.remindersService.addReminder(id, reminderDto);

    if (!updatedUser) {
      throw new NotFoundException(`No user with id found ${id}`);
    }

    console.log(`New reminder added to user ${id}:`, JSON.stringify(reminderDto, null, 2));

    return updatedUser;
  }

  // Service: Get all Reminders from a user
  @Get(':userId/reminders')
  async getAllReminders(@Param('userId') userId: string) {
    this.ensureValidObjectId(userId);

    // Obtener el usuario
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException(`No user with id found ${userId}`);
    }

    // Verificar si tiene tareas
    const reminders = user.user.reminders;
    if (!reminders || reminders.length === 0) {
      throw new NotFoundException(`No reminders found for user ${userId}`);
    }

    return reminders;
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
    const reminder = user.user.reminders.find((t: any) => t.id === reminderId);
    if (!reminder) {
      throw new NotFoundException(`No reminder with id found ${reminderId} for user ${userId}`);
    }

    return reminder;
  }

  // Service: Update Reminder to completed
  @Patch(':userId/reminders/:reminderId')
  async completeReminder( @Param('userId') userId: string, @Param('reminderId') reminderId: string ) {
    this.ensureValidObjectId(userId);

    const updatedReminder = await this.remindersService.completeReminder(userId, reminderId);
    if (!updatedReminder) {
      throw new NotFoundException(`No reminder with id ${reminderId} found for user ${userId}`);
    }

    console.log(`Reminder ${reminderId} for user ${userId} marked as completado:`, updatedReminder);

    return updatedReminder;
  }

  // Helper privado para validar ObjectId
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
    }
  }
}