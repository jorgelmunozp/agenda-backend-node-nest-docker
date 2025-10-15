import { UsersService } from '../../users/service/users.service';
import { RemindersService } from '../../reminders/service/reminders.service';
import { CreateReminderDto } from '../dto/create-reminder.dto';
export declare class RemindersController {
    private readonly remindersService;
    private readonly usersService;
    constructor(remindersService: RemindersService, usersService: UsersService);
    addReminderToUser(id: string, reminderDto: CreateReminderDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    getAllReminders(userId: string): Promise<any>;
    getReminderById(userId: string, reminderId: string): Promise<any>;
    completeReminder(userId: string, reminderId: string): Promise<string>;
    private ensureValidObjectId;
}
