import { Module } from '@nestjs/common';
import { AuthModule } from './src/modules/auth/auth.module';
import { UsersModule } from './src/modules/users/users.module';

@Module({
  imports: [
    AuthModule,       // Importa módulo de autenticación
    UsersModule,      // Importa módulo de usuarios
  ],
})
export class AppModule {}
