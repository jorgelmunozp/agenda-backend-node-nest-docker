import { Module } from '@nestjs/common';
import { AuthModule } from './src/modules/auth/auth.module';
import { UsersModule } from './src/modules/users/users.module';
import { TasksModule } from './src/modules/tasks/tasks.module';
import { RemindersModule } from './src/modules/reminders/reminders.module';
import { PasswordModule } from './src/modules/password/password.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carga variables de entorno
    AuthModule,       // Importa módulo de autenticación
    UsersModule,      // Importa módulo de usuarios
    TasksModule,      // Importa módulo de tareas
    RemindersModule,  // Importa módulo de recordatorios
    PasswordModule,   // Importa módulo de recuperación de contraseña
  ],
})
export class AppModule {}
