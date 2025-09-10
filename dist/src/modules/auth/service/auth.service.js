"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async login(loginDto) {
        const url = 'http://localhost:3000/users';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const users = response.data;
            if (!Array.isArray(users)) {
                throw new common_1.UnauthorizedException('Invalid server response');
            }
            const found = users.find((u) => u.user?.username === loginDto.username);
            if (!found) {
                throw new common_1.UnauthorizedException('Incorrect username or password');
            }
            if (found.user.password !== loginDto.password) {
                throw new common_1.UnauthorizedException('Incorrect username or password');
            }
            return { message: 'Succesfully Login', user: found.user };
        }
        catch (error) {
            console.error('Error querying /users:', error);
            throw new common_1.UnauthorizedException('The user could not be validated');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map