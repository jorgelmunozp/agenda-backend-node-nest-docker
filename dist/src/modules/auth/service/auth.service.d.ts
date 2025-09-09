import { AuthRepository } from '../repository/auth.repository';
export declare class AuthService {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        user: {
            username: string;
            password: string;
        };
    }>;
}
