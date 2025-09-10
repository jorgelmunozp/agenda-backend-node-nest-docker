import { CreateUserDto } from '../dto/create-user.dto';
export interface User {
    _id: string;
    user: CreateUserDto;
}
export declare class UsersService {
    private users;
    create(createUserDto: CreateUserDto): User;
    findAll(): User[];
}
