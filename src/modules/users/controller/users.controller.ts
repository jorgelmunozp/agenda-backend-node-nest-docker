import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';
import { UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../auth/service/auth.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

//************************** USERS *************************************/
  //@UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.getById(id);
  }

  // Registrar un nuevo usuario
  //@UseGuards(JwtAuthGuard)
  @Post()
  async addUser(@Body() body: any) {
    if (!body.name) throw new BadRequestException('Name is required');
    if (!body.email) throw new BadRequestException('Email is required');
    if (!body.username) throw new BadRequestException('Username is required');
    if (!body.password) throw new BadRequestException('Password is required');

    const existingData = await this.usersService.findByEmailOrUsername(body.email, body.username);
    if (existingData) {
      let message = 'The following fields already exist: ';
      if (existingData.email) message += 'email ';
      if (existingData.username) message += 'username';
      throw new BadRequestException(message.trim());
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const userData = {
      name: body.name,
      email: body.email,
      username: body.username,
      password: hashedPassword,
      tasks: Array.isArray(body.tasks) ? body.tasks : [],
      reminders: Array.isArray(body.reminders) ? body.reminders : [],
    };

    const user = await this.usersService.create(userData);

    console.log("User successfully registered:", userData);
    // genera token automático al registrarse
    return this.authService.generateToken(user);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.delete(id);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() body: any) {
    this.ensureValidObjectId(id);
    return this.usersService.patch(id, body);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    this.ensureValidObjectId(id);
    if (!body.name) throw new BadRequestException('Name is required');
    return this.usersService.update(id, body);
  }

  // Helper privado para validar ObjectId de MongoDB
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
    }
  }
}