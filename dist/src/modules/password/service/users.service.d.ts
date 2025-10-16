import { ObjectId } from 'mongodb';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
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
        user: any;
    }>;
    patch(id: string, body: Partial<CreateUserDto>): Promise<{
        message: string;
    }>;
    findByEmailOrUsername(email: string, username: string): Promise<{
        email?: boolean;
        username?: boolean;
    } | null>;
    getByUsername(username: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    sendPasswordRecoveryEmail(email: string): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        message: string;
        email: any;
    }>;
    updatePasswordById(id: string, newPassword: string): Promise<{
        message: string;
    }>;
}
