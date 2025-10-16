"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/service/users.service");
const reminders_service_1 = require("../../reminders/service/reminders.service");
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
const create_reminder_dto_1 = require("../dto/create-reminder.dto");
const common_2 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt/jwt-auth.guard");
dotenv.config();
const db = 'users';
let RemindersController = class RemindersController {
    constructor(remindersService, usersService) {
        this.remindersService = remindersService;
        this.usersService = usersService;
    }
    async addReminderToUser(id, reminderDto) {
        this.ensureValidObjectId(id);
        if (!reminderDto.name || !reminderDto.time || !reminderDto.date) {
            throw new common_1.BadRequestException('The reminder must have a name, date and time');
        }
        const updatedUser = await this.remindersService.addReminder(id, reminderDto);
        if (!updatedUser) {
            throw new common_1.NotFoundException(`No user with id found ${id}`);
        }
        console.log(`New reminder added to user ${id}:`, JSON.stringify(reminderDto, null, 2));
        return updatedUser;
    }
    async getAllReminders(userId) {
        this.ensureValidObjectId(userId);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`No user with id found ${userId}`);
        }
        const reminders = user.user.reminders;
        if (!reminders || reminders.length === 0) {
            throw new common_1.NotFoundException(`No reminders found for user ${userId}`);
        }
        return reminders;
    }
    async getReminderById(userId, reminderId) {
        this.ensureValidObjectId(userId);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`No user with id found ${userId}`);
        }
        const reminder = user.user.reminders.find((t) => t.id === reminderId);
        if (!reminder) {
            throw new common_1.NotFoundException(`No reminder with id found ${reminderId} for user ${userId}`);
        }
        return reminder;
    }
    async completeReminder(userId, reminderId) {
        this.ensureValidObjectId(userId);
        const updatedReminder = await this.remindersService.completeReminder(userId, reminderId);
        if (!updatedReminder) {
            throw new common_1.NotFoundException(`No reminder with id ${reminderId} found for user ${userId}`);
        }
        console.log(`Reminder ${reminderId} for user ${userId} marked as completado:`, updatedReminder);
        return updatedReminder;
    }
    ensureValidObjectId(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
        }
    }
};
exports.RemindersController = RemindersController;
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/reminders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reminder_dto_1.CreateReminderDto]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "addReminderToUser", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':userId/reminders'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "getAllReminders", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':userId/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('reminderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "getReminderById", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':userId/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('reminderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "completeReminder", null);
exports.RemindersController = RemindersController = __decorate([
    (0, common_1.Controller)(db),
    __metadata("design:paramtypes", [reminders_service_1.RemindersService, users_service_1.UsersService])
], RemindersController);
//# sourceMappingURL=reminders.controller.js.map