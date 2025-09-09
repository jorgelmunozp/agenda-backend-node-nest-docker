export declare class AuthRepository {
    private users;
    findByUsername(username: string): Promise<{
        username: string;
        password: string;
    } | undefined>;
}
