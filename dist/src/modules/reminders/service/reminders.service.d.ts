import { CreateReminderDto } from '../dto/create-reminder.dto';
export declare class RemindersService {
    private readonly collectionName;
    private getCollection;
    addReminder(userId: string, reminder: CreateReminderDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    completeReminder(userId: string, reminderId: string): Promise<string>;
}
