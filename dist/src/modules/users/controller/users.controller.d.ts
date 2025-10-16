import { UsersService } from '../service/users.service';
import { AuthService } from '../../auth/service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    getAllUsers(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    addUser(body: CreateUserDto): Promise<{
        access_token: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    patchUser(id: string, body: any): Promise<{
        message: string;
    }>;
    updateUser(id: string, body: any): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            username: string;
            password: string;
            tasks?: import("../../tasks/dto/create-task.dto").CreateTaskDto[];
            reminders?: import("../../reminders/dto/create-reminder.dto").CreateReminderDto[];
            _id: string;
        };
    }>;
    private ensureValidObjectId;
}
