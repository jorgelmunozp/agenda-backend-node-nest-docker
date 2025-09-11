import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { CreateReminderDto } from '../dto/create-reminder.dto';
export declare class UsersService {
    private readonly collectionName;
    private getCollection;
    getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    create(createUserDto: CreateUserDto): Promise<{
        user: CreateUserDto;
        message: string;
        _id: ObjectId;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    update(id: string, body: CreateUserDto): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            username: string;
            password: string;
            tasks?: CreateTaskDto[];
            reminders?: CreateReminderDto[];
            _id: string;
        };
    }>;
    patch(id: string, body: Partial<CreateUserDto>): Promise<{
        message: string;
    }>;
    addTask(userId: string, task: CreateTaskDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    completeTask(userId: string, taskId: string): Promise<string>;
    addReminder(userId: string, reminder: CreateReminderDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    completeReminder(userId: string, reminderId: string): Promise<string>;
    findByEmailOrUsername(email: string, username: string): Promise<{
        email?: boolean;
        username?: boolean;
    } | null>;
    sendPasswordRecoveryEmail(email: string): Promise<{
        message: string;
    }>;
}
