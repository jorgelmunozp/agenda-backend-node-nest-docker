import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, 
  ) {}

  //************************** AUTH JWT *************************************/
  /*** SERVICE: VALIDATE USER ************/
  async validateUser(loginDto: LoginDto) {
    const user = await this.getByUsername(loginDto.username);
    if (!user) return null;

    const match = await bcrypt.compare(loginDto.password, user.user.password);
    if (match) {
      const { password, ...result } = user as any;  // retorna el usuario sin el password
      return result;
    }
    return null;
  }

  /*** SERVICE: GENERATE JWT TOKEN ************/
  async generateToken(user: any) {
    console.log('Generating token for user:', user);
    
    const payload = { sub: user._id || user.id, username: user.user.username };
    console.log('payload:', payload);
    console.log('jwt secret:', process.env.JWT_SECRET);

    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);

    return {
      // access_token: this.jwtService.sign(payload),
      access_token: token,
    };
  }

    /*** SERVICE: GET PASSWORD BY USERNAME TO GET JWT TOKEN ************/
    async getByUsername(username: string) {
      const collection = await this.usersService.getCollection();
      const doc = await collection.findOne({ "user.username": username });
      if (!doc) throw new NotFoundException(`User with id ${username} not found`);
      return doc;
    }


}