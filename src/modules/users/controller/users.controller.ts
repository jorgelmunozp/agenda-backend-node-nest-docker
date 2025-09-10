import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';

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
    console.log("Usuario registrado: ",body);
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

  // Servicio: Añadir una tarea a un usuario
  // Servicio: Añadir una tarea a un usuario
  @Post(':id/tareas')
  async addTaskToUser(@Param('id') id: string, @Body() tareaDto: any) {
    this.ensureValidObjectId(id);
    if (!tareaDto.nombre || !tareaDto.fecha || !tareaDto.hora) {
      throw new BadRequestException('La tarea debe tener nombre, fecha y hora');
    }

    const updatedUser = await this.usersService.addTask(id, tareaDto);

    if (!updatedUser) {
      throw new NotFoundException(`No se encontró un usuario con id ${id}`);
    }

    console.log(`✅ Nueva tarea agregada al usuario ${id}:`, JSON.stringify(tareaDto, null, 2));

    return updatedUser;
  }

  // Helper privado para validar id
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`El id proporcionado no es un ObjectId válido: ${id}`);
    }
  }


}