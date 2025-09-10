import { UsersService, User } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): User;
    findAll(): User[];
}
