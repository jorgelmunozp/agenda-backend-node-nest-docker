import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(loginDto: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        user: any;
    }>;
}
