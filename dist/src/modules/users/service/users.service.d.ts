import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersService {
    private readonly collectionName;
    getCollection(): Promise<import("mongodb").Collection<import("bson").Document>>;
    getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            user: {
                name: string;
                email: string;
                username: string;
                password: string;
                tasks: import("../../tasks/dto/create-task.dto").CreateTaskDto[];
                reminders: import("../../reminders/dto/create-reminder.dto").CreateReminderDto[];
            };
            _id: ObjectId;
        };
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
            tasks?: import("../../tasks/dto/create-task.dto").CreateTaskDto[];
            reminders?: import("../../reminders/dto/create-reminder.dto").CreateReminderDto[];
            _id: string;
        };
    }>;
    patch(id: string, body: Partial<CreateUserDto>): Promise<{
        message: string;
    }>;
    findByEmailOrUsername(email: string, username: string): Promise<{
        email?: boolean;
        username?: boolean;
    } | null>;
}
