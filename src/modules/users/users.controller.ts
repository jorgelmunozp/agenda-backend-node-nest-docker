import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as dotenv from "dotenv";

dotenv.config();
const db = 'users';
// const db: string | undefined = process.env.DB;

@Controller(db)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  async addUser(@Body() body: any) {
    if (!body.name) {
      throw new BadRequestException('Name is required');
    }
    return this.usersService.create(body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  async patchUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.patch(id, body);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    if (!body.name) {
      throw new BadRequestException('Name is required');
    }
    return this.usersService.update(id, body);
  }
}