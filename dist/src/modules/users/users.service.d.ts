export declare class UsersService {
    private readonly collectionName;
    private getCollection;
    getAll(): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    getById(id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    create(user: any): Promise<any>;
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
}
