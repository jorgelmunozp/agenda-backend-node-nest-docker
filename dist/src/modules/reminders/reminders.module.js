"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersModule = void 0;
const common_1 = require("@nestjs/common");
const reminders_controller_1 = require("./controller/reminders.controller");
const reminders_service_1 = require("./service/reminders.service");
const users_service_1 = require("../users/service/users.service");
const jwt_1 = require("@nestjs/jwt");
let RemindersModule = class RemindersModule {
};
exports.RemindersModule = RemindersModule;
exports.RemindersModule = RemindersModule = __decorate([
    (0, common_1.Module)({
        controllers: [reminders_controller_1.RemindersController],
        providers: [reminders_service_1.RemindersService, users_service_1.UsersService, jwt_1.JwtService],
        exports: [reminders_service_1.RemindersService],
    })
], RemindersModule);
//# sourceMappingURL=reminders.module.js.map