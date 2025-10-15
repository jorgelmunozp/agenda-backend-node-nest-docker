import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { CreateReminderDto } from '../../reminders/dto/create-reminder.dto';

export class CreateUserDto {
  name: string;
  email: string;
  username: string;
  password: string;
  tasks?: CreateTaskDto[];
  reminders?: CreateReminderDto[];
}
