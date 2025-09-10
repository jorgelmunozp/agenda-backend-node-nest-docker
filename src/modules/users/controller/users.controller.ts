import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  BadRequestException, 
  NotFoundException 
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import * as dotenv from "dotenv";
import { ObjectId } from 'mongodb';

dotenv.config();
const db = 'users';

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
    if (!body.correo) throw new BadRequestException('Correo is required');
    if (!body.username) throw new BadRequestException('Username is required');
    if (!body.password) throw new BadRequestException('Password is required');

    // Construcción explícita del objeto user
    const userData = {
      name: body.name,
      correo: body.correo,
      username: body.username,
      password: body.password,
      tareas: Array.isArray(body.tareas) ? body.tareas : [],
      recordatorios: Array.isArray(body.recordatorios) ? body.recordatorios : []
    };

    console.log("📌 Usuario registrado:", userData);
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

  // Servicio: Enviar email de recuperación de contraseña
  @Post('recover-password')
  async recoverPassword(@Body() body: { correo: string }) {
    if (!body.correo) throw new BadRequestException('El correo es obligatorio');
    return this.usersService.sendPasswordRecoveryEmail(body.correo);
  }

  // Helper privado para validar ObjectId
  private ensureValidObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(`El id proporcionado no es un ObjectId válido: ${id}`);
    }
  }
}
