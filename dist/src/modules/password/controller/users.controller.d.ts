import { UsersService } from '../service/users.service';
import { AuthService } from '../../auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    private readonly jwtService;
    constructor(usersService: UsersService, authService: AuthService, jwtService: JwtService);
    getAllUsers(): Promise<any>;
    getById(id: string): Promise<any>;
    addUser(body: any): Promise<{
        access_token: string;
    }>;
    deleteUser(id: string): Promise<any>;
    patchUser(id: string, body: any): Promise<any>;
    updateUser(id: string, body: any): Promise<any>;
    recoverPassword(body: {
        email: string;
    }): Promise<any>;
    verifyResetToken(token: string): Promise<any>;
    updatePassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    private ensureValidObjectId;
}
