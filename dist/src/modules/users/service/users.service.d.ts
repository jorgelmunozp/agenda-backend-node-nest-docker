import { ObjectId } from 'mongodb';
export declare class UsersService {
    private readonly collectionName;
    private getCollection;
    getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    create(user: any): Promise<{
        user: any;
        _id: ObjectId;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    update(id: string, body: any): Promise<{
        message: string;
        user: any;
    }>;
    patch(id: string, body: any): Promise<{
        message: string;
    }>;
    addTask(userId: string, tarea: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    sendPasswordRecoveryEmail(correo: string): Promise<{
        message: string;
        link: string;
    }>;
}
