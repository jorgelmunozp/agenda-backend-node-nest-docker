import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from 'src/config/connectDB'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const db = await connectDB();
  console.log(`🚀 Server running on http://localhost:3000`);
  console.log(`✅ Database connected: ${db.databaseName}`);
}
bootstrap();
