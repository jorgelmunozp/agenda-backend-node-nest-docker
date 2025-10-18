import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  time: string;
  @IsNotEmpty()
  date: string;
  @IsNotEmpty()
  message: string;
  completed: boolean;
}
