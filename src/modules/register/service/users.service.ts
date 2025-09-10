import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

export interface User {
  _id: string;
  user: CreateUserDto;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      _id: (Math.random() * 1000000).toFixed(0),
      user: createUserDto,
    };
    this.users.push(newUser);
    console.log('Usuario registrado:', newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }
}
