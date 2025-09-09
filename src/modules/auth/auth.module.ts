import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
