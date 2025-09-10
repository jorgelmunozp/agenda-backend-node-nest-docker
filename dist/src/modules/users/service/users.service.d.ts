import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersService {
    private readonly collectionName;
    private getCollection;
    getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    create(createUserDto: CreateUserDto): Promise<{
        user: CreateUserDto;
        _id: ObjectId;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    update(id: string, body: CreateUserDto): Promise<{
        message: string;
        user: {
            name: string;
            correo: string;
            username: string;
            password: string;
            tareas?: {
                nombre: string;
                hora: string;
                fecha: string;
                mensaje: string;
                estado: string;
            }[];
            recordatorios?: {
                nombre: string;
                hora: string;
                fecha: string;
                mensaje: string;
                estado: string;
            }[];
            _id: string;
        };
    }>;
    patch(id: string, body: Partial<CreateUserDto>): Promise<{
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
    }>;
}
