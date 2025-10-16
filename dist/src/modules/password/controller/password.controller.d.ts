import { PasswordService } from '../service/password.service';
import { AuthService } from '../../auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class PasswordController {
    private readonly passwordService;
    private readonly authService;
    private readonly jwtService;
    constructor(passwordService: PasswordService, authService: AuthService, jwtService: JwtService);
    recoverPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        message: string;
        email: any;
    }>;
    updatePassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
