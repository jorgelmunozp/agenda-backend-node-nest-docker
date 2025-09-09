import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();                 // Habilitamos CORS para que el frontend pueda llamar a la API sin problemas
  // app.setGlobalPrefix('api');      // Opcional: prefijo global de rutas (si quieres que todas empiecen con /api)

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();