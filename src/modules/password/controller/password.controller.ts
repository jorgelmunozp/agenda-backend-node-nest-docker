import { Controller, Get, Post, Put, Patch, Delete, Param, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../service/password.service';
import * as dotenv from "dotenv";
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

dotenv.config();                  // Load environment variables
const db = 'users';               // Database route for this controller

@Controller(db)
export class PasswordController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

//************************** PASSWORD *************************************/
  // Service: Send password recovery email
  @UseGuards(JwtAuthGuard)
  @Post('password/recover')
  async recoverPassword(@Body() body: { email: string }) {
    if (!body.email) throw new BadRequestException('Email is requested');
    return this.passwordService.sendPasswordRecoveryEmail(body.email);
  }

  // Service: Send Token password recovery email
  @UseGuards(JwtAuthGuard)
  @Get('password/reset/:token')
  async verifyResetToken(@Param('token') token: string) {
    return this.passwordService.verifyResetToken(token);
  }

  // Service: Password update
  @UseGuards(JwtAuthGuard)
  @Patch('password/update')
  async updatePassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword) throw new BadRequestException('Token and new password are required');

    try {
      // Verifica token y extrae email
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const id = payload._id;

      // Actualiza contraseña
      await this.passwordService.updatePasswordById(id, newPassword);

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

}