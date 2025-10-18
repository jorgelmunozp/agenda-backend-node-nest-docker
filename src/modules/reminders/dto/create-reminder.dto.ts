import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateReminderDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  @IsDate()
  date: string;
  @IsNotEmpty()
  message: string;
  completed: boolean;
}
