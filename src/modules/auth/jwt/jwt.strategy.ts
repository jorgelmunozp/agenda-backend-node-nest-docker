import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret,
    });
    }


    async validate(payload: any) {
    // Aquí `payload` es lo firmado en login (sub, email...)
    // Devuelve la información que quieras que esté disponible en req.user
        return { userId: payload.sub, email: payload.email };
    }
}