import { CreateTaskDto } from './create-task.dto';
import { CreateReminderDto } from './create-reminder.dto';

// export class CreateUserDto {
//   name: string;
//   email: string;
//   username: string;
//   password: string;
//   tasks?: {
//     nombre: string;
//     hora: string;
//     fecha: string;
//     mensaje: string;
//     estado: string;
//   }[];
//   reminders?: {
//     nombre: string;
//     hora: string;
//     fecha: string;
//     mensaje: string;
//     estado: string;
//   }[];
// }


export class CreateUserDto {
  name: string;
  email: string;
  username: string;
  password: string;
  tasks?: CreateTaskDto[];
  reminders?: CreateReminderDto[]; // O podrías crear un CreateReminderDto si son distintos
}
