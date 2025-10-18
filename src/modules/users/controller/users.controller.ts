import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

//************************** USERS *************************************/
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.getById(id);
  }

  // Registrar un nuevo usuario
  @Post()
  async addUser(@Body() body: CreateUserDto) {
    const user = (await this.usersService.create(body)).user;
    const token = await this.authService.generateToken(user);

    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.ensureValidObjectId(id);
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() body: any) {
    this.ensureValidObjectId(id);
    return this.usersService.patch(id, body);
  }

  @UseGuards(JwtAuthGuard)
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