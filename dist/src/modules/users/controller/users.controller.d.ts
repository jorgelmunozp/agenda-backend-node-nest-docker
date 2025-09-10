import { UsersService } from '../service/users.service';
import { ObjectId } from 'mongodb';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    addUser(body: any): Promise<{
        user: import("../dto/create-user.dto").CreateUserDto;
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
    addTaskToUser(id: string, tareaDto: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    recoverPassword(body: {
        correo: string;
    }): Promise<{
        message: string;
    }>;
    private ensureValidObjectId;
}
