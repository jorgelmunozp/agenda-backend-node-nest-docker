import { Controller, Get, Post, Put, Patch, Delete, Param, Body,BadRequestException,NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
  private dataFile = path.resolve(process.cwd(), 'src/users/data.json');

  private readData() {
    if (fs.existsSync(this.dataFile)) {
      return JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
    }
    return { users: [] };
  }

  private writeData(data: any) {
    fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
  }

  @Get()
  getAllUsers() {
    const fileContent = this.readData();
    return fileContent.users || [];
  }

  // GET /users/:id
  @Get(':id')
  getById(@Param('id') id: string) {
    const data = this.readData();
    const record = data.users.find((u: any) => Number(u.id) === Number(id));
    if (!record) throw new NotFoundException(`User with id ${id} not found`);
    return record;
  }

  @Post()
  addUser(@Body() body: any) {
    const { name, id } = body;

    if (!name || typeof id !== 'number') {
      throw new BadRequestException('Name (string) and id (number) are required');
    }

    const data = this.readData();

    const newRecordId = data.users.length
      ? Number(data.users[data.users.length - 1].id) + 1
      : 1;

    const newUser = {
      user: { name, id },
      id: newRecordId
    };

    data.users.push(newUser);
    this.writeData(data);

    return { message: 'User added successfully', user: newUser };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    const data = this.readData();
    const index = data.users.findIndex((u: any) => Number(u.id) === Number(id));

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const deletedUser = data.users.splice(index, 1)[0];
    this.writeData(data);

    return { message: 'User deleted successfully', user: deletedUser };
  }

  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() body: any) {
    const data = this.readData();
    const index = data.users.findIndex((u: any) => Number(u.id) === Number(id));

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Solo actualiza campos enviados
    data.users[index].user = { ...data.users[index].user, ...body };
    this.writeData(data);

    return { message: 'User updated partially', user: data.users[index] };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    const { name, id: userId } = body;

    if (!name || typeof userId !== 'number') {
      throw new BadRequestException('Name (string) and userId (number) are required');
    }

    const data = this.readData();
    const index = data.users.findIndex((u: any) => Number(u.id) === Number(id));

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Reemplaza completamente el objeto
    data.users[index] = {
      user: { name, id: userId },
      id: Number(id)
    };

    this.writeData(data);

    return { message: 'User updated completely', user: data.users[index] };
  }
}
