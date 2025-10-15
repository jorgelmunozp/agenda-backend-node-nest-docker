import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './src/common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplica el filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Aplica el interceptor global formato de logs HALL
  app.useGlobalInterceptors(new LoggingInterceptor());

  
  await app.listen(3000);
  console.log(`🚀 Server running on ${process.env.FRONTEND_URL}`);
}
bootstrap();