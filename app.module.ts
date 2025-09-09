import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './src/modules/auth/auth.module';
import { UsersModule } from './src/modules/users/users.module';

@Module({
  imports: [
    // Sirve los archivos estáticos desde la carpeta /public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // <-- carpeta public en la raíz del proyecto
    }),

    // Importa tu módulo de autenticación
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
