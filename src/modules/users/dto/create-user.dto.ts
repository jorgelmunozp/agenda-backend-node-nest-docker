import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { CreateReminderDto } from '../../reminders/dto/create-reminder.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  tasks?: CreateTaskDto[];
  reminders?: CreateReminderDto[];
}
