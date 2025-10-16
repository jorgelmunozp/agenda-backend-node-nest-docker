// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';
// import { LoginDto } from '../dto/login.dto';
// import { jwtDecode } from "jwt-decode";

// @Injectable()
// export class AuthService {
//   constructor(private readonly httpService: HttpService) {}

//   async login(loginDto: LoginDto) {
//     const url = process.env.FRONTEND_URL + '/users'; // traemos TODOS los usuarios
//     try {
//       const response = await firstValueFrom(this.httpService.get(url));
//       const users = response.data;

//       // Validar que sea un array
//       if (!Array.isArray(users)) {
//         throw new UnauthorizedException('Invalid server response');
//       }

//       // Buscar el usuario por username
//       const found = users.find((u: any) => {
//         const decodedUsername = jwtDecode<{ }>(u.user?.username); // Decodifica el username
//         return decodedUsername === loginDto.username;
//       });

//       if (!found) {
//         throw new UnauthorizedException('Incorrect username');
//       }

//       // Validar contraseña
//       if (found) {
//         const decodedPassword = jwtDecode<{ }>(found.user.password);
//         if (decodedPassword !== loginDto.password) {
//           throw new UnauthorizedException('Incorrect password');
//         }
//       }

//       // Retornamos el objeto user con id: _id
//       return { message: 'Succesfully Login', user: found.user };
//     } catch (error) {
//       console.error('Error querying /users:', error);
//       throw new UnauthorizedException('The user could not be validated');
//     }
//   }
// }


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
    const payload = { sub: user._id || user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
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