import { UsersService } from '../service/users.service';
import { ObjectId } from 'mongodb';
import { CreateTaskDto } from '../dto/create-task.dto';
import { CreateReminderDto } from '../dto/create-reminder.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    addUser(body: any): Promise<{
        user: import("../dto/create-user.dto").CreateUserDto;
        message: string;
        _id: ObjectId;
    }>;
    deleteUser(id: string): Promise<any>;
    patchUser(id: string, body: any): Promise<any>;
    updateUser(id: string, body: any): Promise<any>;
    addTaskToUser(id: string, taskDto: CreateTaskDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    getTaskById(userId: string, taskId: string): Promise<any>;
    completeTask(userId: string, taskId: string): Promise<any>;
    addReminderToUser(id: string, reminderDto: CreateReminderDto): Promise<any>;
    getReminderById(userId: string, reminderId: string): Promise<any>;
    completeReminder(userId: string, reminderId: string): Promise<any>;
    recoverPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    private ensureValidObjectId;
}
