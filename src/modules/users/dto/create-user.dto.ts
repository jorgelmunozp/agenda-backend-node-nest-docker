import { CreateTaskDto } from './create-task.dto';
import { CreateReminderDto } from './create-reminder.dto';

export class CreateUserDto {
  name: string;
  email: string;
  username: string;
  password: string;
  tasks?: CreateTaskDto[];
  reminders?: CreateReminderDto[];
}
