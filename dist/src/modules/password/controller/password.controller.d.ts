import { PasswordService } from '../service/password.service';
import { JwtService } from '@nestjs/jwt';
export declare class PasswordController {
    private readonly passwordService;
    private readonly jwtService;
    constructor(passwordService: PasswordService, jwtService: JwtService);
    recoverPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        message: string;
        id: any;
    }>;
    updatePassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
