import { UsersService } from '../service/users.service';
import { ObjectId } from 'mongodb';
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
            tasks?: import("../dto/create-task.dto").CreateTaskDto[];
            reminders?: import("../dto/create-reminder.dto").CreateReminderDto[];
            _id: string;
        };
    }>;
    addTaskToUser(id: string, taskDto: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    getTaskById(userId: string, taskId: string): Promise<any>;
    completeTask(userId: string, taskId: string): Promise<string>;
    addReminderToUser(id: string, reminderDto: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    getReminderById(userId: string, reminderId: string): Promise<any>;
    completeReminder(userId: string, reminderId: string): Promise<string>;
    recoverPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    private ensureValidObjectId;
}
